// Day-before reservation reminder.
// Schedule at both 07:00 and 08:00 UTC. The Rome-hour guard below makes the
// function run at 09:00 Europe/Rome across daylight-saving changes.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.112.4'
import {
  escapeHtml,
  getRomeDateTimeParts,
  getTomorrowDateInRome,
  jsonResponse,
  secretsMatch,
} from '../_shared/reminder-utils.js'

const RESEND_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const CRON_SECRET = Deno.env.get('REMINDER_CRON_SECRET')
const SITE_URL = (Deno.env.get('SITE_URL') ?? 'https://www.ristorantealgobbodirialto.it').replace(/\/$/, '')
const SEND_HOUR_IN_ROME = 9

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  if (!secretsMatch(request.headers.get('x-reminder-secret'), CRON_SECRET)) {
    return jsonResponse({ error: 'Unauthorized' }, 401)
  }

  const missingConfiguration = [
    ['RESEND_API_KEY', RESEND_KEY],
    ['SUPABASE_URL', SUPABASE_URL],
    ['SUPABASE_SERVICE_ROLE_KEY', SERVICE_KEY],
    ['REMINDER_CRON_SECRET', CRON_SECRET],
  ].filter(([, value]) => !value).map(([name]) => name)

  if (missingConfiguration.length > 0) {
    console.error('Missing reminder configuration:', missingConfiguration.join(', '))
    return jsonResponse({ error: 'Reminder service is not configured' }, 503)
  }

  const payload = await request.json().catch(() => ({})) as { force?: boolean }
  const now = new Date()
  const romeNow = getRomeDateTimeParts(now)

  if (!payload.force && romeNow.hour !== SEND_HOUR_IN_ROME) {
    return jsonResponse({
      skipped: true,
      reason: 'outside_send_window',
      romeTime: romeNow.time,
    })
  }

  const supabase = createClient(SUPABASE_URL!, SERVICE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: reminderFlag, error: flagError } = await supabase
    .from('feature_flags')
    .select('enabled')
    .eq('key', 'reminder_emails')
    .maybeSingle()

  if (flagError) {
    console.error('Could not read reminder feature flag:', flagError)
    return jsonResponse({ error: 'Could not read reminder settings' }, 500)
  }
  if (reminderFlag?.enabled === false) {
    return jsonResponse({ skipped: true, reason: 'feature_disabled' })
  }

  const tomorrow = getTomorrowDateInRome(now)
  const { data: reservations, error } = await supabase
    .from('reservations')
    .select('id,name,email,date,time,guests,cancellation_token')
    .eq('date', tomorrow)
    .in('status', ['pending', 'confirmed'])
    .is('reminder_sent_at', null)

  if (error) {
    console.error('Could not load day-before reminders:', error)
    return jsonResponse({ error: 'Could not load reminders' }, 500)
  }

  let sent = 0
  let failed = 0

  for (const reservation of reservations ?? []) {
    try {
      const formattedDate = new Date(`${reservation.date}T12:00:00Z`).toLocaleDateString('it-IT', {
        timeZone: 'Europe/Rome',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
      const formattedTime = reservation.time.slice(0, 5)
      const cancellationUrl = `${SITE_URL}/cancella/${reservation.cancellation_token}`
      const body = {
        from: 'Al Gobbo di Rialto <reservations@ristorantealgobbodirialto.it>',
        to: reservation.email,
        subject: `Promemoria: domani alle ${formattedTime} — Al Gobbo di Rialto`,
        html: buildReminderHtml({
          name: reservation.name,
          formattedDate,
          formattedTime,
          guests: reservation.guests,
          cancellationUrl,
        }),
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': `reservation-day-before/${reservation.id}/${reservation.date}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`Resend returned HTTP ${response.status}`)
      }

      const { error: updateError } = await supabase
        .from('reservations')
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq('id', reservation.id)
        .is('reminder_sent_at', null)

      if (updateError) throw updateError
      sent += 1
    } catch (sendError) {
      console.error(`Day-before reminder failed for reservation ${reservation.id}:`, sendError)
      failed += 1
    }
  }

  return jsonResponse(
    { date: tomorrow, eligible: reservations?.length ?? 0, sent, failed },
    failed > 0 ? 502 : 200,
  )
})

function buildReminderHtml({
  name,
  formattedDate,
  formattedTime,
  guests,
  cancellationUrl,
}: {
  name: string
  formattedDate: string
  formattedTime: string
  guests: number
  cancellationUrl: string
}) {
  const firstName = escapeHtml(name.trim().split(/\s+/)[0] || 'ospite')
  const safeDate = escapeHtml(formattedDate)
  const safeTime = escapeHtml(formattedTime)
  const safeCancellationUrl = escapeHtml(cancellationUrl)

  return `<!doctype html>
<html lang="it">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f0e8d5;font-family:Arial,sans-serif;color:#5c4033">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:10px;overflow:hidden">
        <tr><td style="background:#5c4033;padding:24px 28px;color:#fff">
          <p style="margin:0;color:#d4af37;font-size:11px;letter-spacing:3px;text-transform:uppercase">Promemoria prenotazione</p>
          <h1 style="margin:6px 0 0;font:20px Georgia,serif">A domani, ${firstName}!</h1>
        </td></tr>
        <tr><td style="height:3px;background:#d4af37"></td></tr>
        <tr><td style="padding:28px 32px">
          <p style="margin:0 0 20px;line-height:1.6">Ti ricordiamo la tua prenotazione di domani al Ristorante Al Gobbo di Rialto.</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6ee;border:1px solid #e0c99a;border-radius:8px">
            <tr><td style="padding:12px 20px;border-bottom:1px solid #e8d5b0"><strong>Data:</strong> ${safeDate}</td></tr>
            <tr><td style="padding:12px 20px;border-bottom:1px solid #e8d5b0"><strong>Orario:</strong> ${safeTime}</td></tr>
            <tr><td style="padding:12px 20px"><strong>Ospiti:</strong> ${guests}</td></tr>
          </table>
          <p style="margin:24px 0 0;text-align:center">
            <a href="${safeCancellationUrl}" style="display:inline-block;padding:12px 18px;border:2px solid #e0c99a;border-radius:8px;color:#7a342b;text-decoration:none">Cancella prenotazione</a>
          </p>
          <p style="margin:20px 0 0;font-size:13px;line-height:1.6;text-align:center;color:#6b5244">Per modifiche, ritardi o esigenze di accessibilità: <a href="tel:+390415204603" style="color:#7a342b">+39 041 520 4603</a></p>
        </td></tr>
        <tr><td style="padding:16px 24px;background:#fdf6ee;text-align:center;font-size:11px;color:#806b60">Ristorante Al Gobbo di Rialto — Sestiere San Polo 649, Venezia</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
