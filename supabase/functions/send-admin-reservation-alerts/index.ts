import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.112.4'
import {
  getAdminReservationAlertSchedule,
  isReservationInRomeWindow,
  jsonResponse,
  secretsMatch,
} from '../_shared/reminder-utils.js'
import { buildReservationAdminAlertEmail } from '../_shared/email-utils.js'

const RESEND_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const CRON_SECRET = Deno.env.get('ADMIN_ALERT_CRON_SECRET')
const RESERVATIONS_EMAIL = Deno.env.get('RESERVATIONS_EMAIL')
const SITE_URL = (Deno.env.get('SITE_URL') ?? 'https://www.ristorantealgobbodirialto.it').replace(/\/$/, '')

type AlertKind = '24h' | 'morning' | '45m'
type AlertMarker =
  | 'admin_alert_24h_sent_at'
  | 'admin_alert_morning_sent_at'
  | 'admin_alert_45m_sent_at'

type Reservation = {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  occasion: string | null
  special_requests: string | null
  admin_alert_24h_sent_at: string | null
  admin_alert_morning_sent_at: string | null
  admin_alert_45m_sent_at: string | null
}

type Alert = {
  kind: AlertKind
  marker: AlertMarker
}

const selectColumns = [
  'id',
  'name',
  'email',
  'phone',
  'date',
  'time',
  'guests',
  'occasion',
  'special_requests',
  'admin_alert_24h_sent_at',
  'admin_alert_morning_sent_at',
  'admin_alert_45m_sent_at',
].join(',')

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
    ['ADMIN_ALERT_CRON_SECRET', CRON_SECRET],
    ['RESERVATIONS_EMAIL', RESERVATIONS_EMAIL],
  ].filter(([, value]) => !value).map(([name]) => name)

  if (missingConfiguration.length > 0) {
    console.error('Missing admin alert configuration:', missingConfiguration.join(', '))
    return jsonResponse({ error: 'Admin alert service is not configured' }, 503)
  }

  const payload = await request.json().catch(() => ({})) as {
    dry_run?: boolean
    now?: string
  }
  const requestedNow = payload.dry_run && payload.now ? new Date(payload.now) : new Date()
  if (Number.isNaN(requestedNow.getTime())) {
    return jsonResponse({ error: 'Invalid dry-run date' }, 400)
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

  const schedule = getAdminReservationAlertSchedule(requestedNow)
  const { data, error } = await supabase
    .from('reservations')
    .select(selectColumns)
    .in('status', ['pending', 'confirmed'])
    .gte('date', schedule.romeNow.date)
    .lte('date', schedule.dayBefore.end.date)

  if (error) {
    console.error('Could not load admin reservation alerts:', error)
    return jsonResponse({ error: 'Could not load reservation alerts' }, 500)
  }

  const reservations = (data ?? []) as Reservation[]
  const counts: Record<AlertKind, { eligible: number; sent: number; failed: number }> = {
    '24h': { eligible: 0, sent: 0, failed: 0 },
    morning: { eligible: 0, sent: 0, failed: 0 },
    '45m': { eligible: 0, sent: 0, failed: 0 },
  }

  for (const reservation of reservations) {
    const alerts: Alert[] = []

    if (
      !reservation.admin_alert_24h_sent_at
      && isReservationInRomeWindow(reservation, schedule.dayBefore)
    ) {
      alerts.push({ kind: '24h', marker: 'admin_alert_24h_sent_at' })
    }

    if (
      !reservation.admin_alert_morning_sent_at
      && schedule.morning.enabled
      && reservation.date === schedule.morning.date
      && reservation.time.slice(0, 5) > schedule.morning.afterTime
    ) {
      alerts.push({ kind: 'morning', marker: 'admin_alert_morning_sent_at' })
    }

    if (
      !reservation.admin_alert_45m_sent_at
      && isReservationInRomeWindow(reservation, schedule.shortlyBefore)
    ) {
      alerts.push({ kind: '45m', marker: 'admin_alert_45m_sent_at' })
    }

    for (const alert of alerts) {
      counts[alert.kind].eligible += 1
      if (payload.dry_run) continue

      try {
        const message = buildReservationAdminAlertEmail(reservation, alert.kind, SITE_URL)
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${RESEND_KEY}`,
            'Content-Type': 'application/json',
            'Idempotency-Key': `reservation-admin-alert-${alert.kind}/${reservation.id}/${reservation.date}/${reservation.time.replaceAll(':', '')}`,
          },
          body: JSON.stringify({
            from: 'Al Gobbo di Rialto <reservations@ristorantealgobbodirialto.it>',
            to: RESERVATIONS_EMAIL,
            reply_to: reservation.email,
            subject: message.subject,
            html: message.html,
            text: message.text,
          }),
        })

        if (!response.ok) {
          throw new Error(`Resend returned HTTP ${response.status}`)
        }

        const { error: updateError } = await supabase
          .from('reservations')
          .update({ [alert.marker]: new Date().toISOString() })
          .eq('id', reservation.id)
          .is(alert.marker, null)

        if (updateError) throw updateError
        counts[alert.kind].sent += 1
      } catch (sendError) {
        console.error(`Admin ${alert.kind} alert failed for reservation ${reservation.id}:`, sendError)
        counts[alert.kind].failed += 1
      }
    }
  }

  const failed = Object.values(counts).reduce((total, count) => total + count.failed, 0)
  return jsonResponse(
    {
      dryRun: Boolean(payload.dry_run),
      checkedAt: requestedNow.toISOString(),
      counts,
    },
    failed > 0 ? 502 : 200,
  )
})
