// Deno runtime — runs on Supabase Edge Functions
// Schedule via Supabase Dashboard → Edge Functions → Schedules
// Cron: "*/30 * * * *" (every 30 minutes)
// Sends a reminder email to reservations starting in ~2 hours (window: +1h50m to +2h10m)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_KEY   = Deno.env.get('VITE_RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const SITE_URL     = Deno.env.get('SITE_URL') ?? 'https://www.ristorantealgobbodirialto.it'

Deno.serve(async () => {
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

  const now = new Date()

  // Window: reservations starting between now+1h50m and now+2h10m
  const windowStart = new Date(now.getTime() + 110 * 60 * 1000) // +1h50m
  const windowEnd   = new Date(now.getTime() + 130 * 60 * 1000) // +2h10m

  const todayStr        = now.toISOString().split('T')[0]
  const windowStartTime = windowStart.toTimeString().slice(0, 5) // "HH:MM"
  const windowEndTime   = windowEnd.toTimeString().slice(0, 5)

  // Handle midnight crossover: if windowEnd crosses to next day
  const windowEndDate = windowEnd.toISOString().split('T')[0]

  let query = supabase
    .from('reservations')
    .select('*')
    .in('status', ['pending', 'confirmed'])
    .is('reminder_2h_sent_at', null)

  if (todayStr === windowEndDate) {
    // Same day — simple time range
    query = query
      .eq('date', todayStr)
      .gte('time', windowStartTime + ':00')
      .lte('time', windowEndTime + ':59')
  } else {
    // Crosses midnight — query two days
    query = query.or(
      `and(date.eq.${todayStr},time.gte.${windowStartTime}:00),` +
      `and(date.eq.${windowEndDate},time.lte.${windowEndTime}:59)`
    )
  }

  const { data: reservations, error } = await query

  if (error) {
    console.error('❌ Query error:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  console.log(`📧 Found ${reservations?.length ?? 0} reservations for 2h reminder`)

  let sent = 0, failed = 0

  for (const r of reservations ?? []) {
    try {
      const cancelUrl = `${SITE_URL}/cancella/${r.cancellation_token}`

      const fDate = new Date(r.date + 'T00:00:00').toLocaleDateString('it-IT', {
        weekday: 'long', day: 'numeric', month: 'long'
      })
      const fTime = r.time.slice(0, 5)

      const html = build2hReminderHtml({ ...r, fDate, fTime, cancelUrl })

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Al Gobbo di Rialto <reservations@ristorantealgobbodirialto.it>',
          to: r.email,
          subject: `⏰ Tra 2 ore ci vediamo — ${fTime} al Gobbo di Rialto`,
          html
        })
      })

      if (!res.ok) throw new Error(`Resend error: ${res.status}`)

      await supabase
        .from('reservations')
        .update({ reminder_2h_sent_at: new Date().toISOString() })
        .eq('id', r.id)

      sent++
    } catch (err) {
      console.error(`❌ Failed for reservation ${r.id}:`, err)
      failed++
    }
  }

  return new Response(JSON.stringify({ sent, failed, window: { start: windowStartTime, end: windowEndTime } }), {
    headers: { 'Content-Type': 'application/json' }
  })
})

function build2hReminderHtml(r: {
  name: string, fDate: string, fTime: string, guests: number,
  occasion?: string | null, cancelUrl: string
}) {
  const brown = '#5C4033'
  const gold  = '#D4AF37'
  const sand  = '#fdf6ee'

  return `<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0e8d5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0e8d5;">
    <tr><td align="center" style="padding:32px 16px;">
      <table width="560" cellpadding="0" cellspacing="0"
             style="max-width:560px;width:100%;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 16px rgba(92,64,51,0.10);">
        <!-- Header -->
        <tr><td style="background:${brown};padding:24px 28px;">
          <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${gold};">A breve ci vediamo</p>
          <h2 style="margin:6px 0 0;font-size:20px;color:#fff;font-family:Georgia,serif;">⏰ Tra 2 ore, ${r.name.split(' ')[0]}!</h2>
        </td></tr>
        <tr><td style="height:3px;background:${gold};"></td></tr>
        <!-- Body -->
        <tr><td style="padding:28px 32px;">
          <p style="margin:0 0 20px;font-size:15px;color:${brown};line-height:1.6;">
            Il tuo tavolo ti aspetta tra circa <strong>2 ore</strong>. A presto al Ristorante Al Gobbo di Rialto!
          </p>
          <table width="100%" style="background:${sand};border-radius:8px;border:1px solid #e0c99a;">
            <tr><td style="padding:16px 20px;border-bottom:1px solid #e0c99a;">
              <p style="margin:0;font-size:11px;color:#9e8272;letter-spacing:2px;text-transform:uppercase;">Dettagli prenotazione</p>
            </td></tr>
            <tr><td style="padding:12px 20px;border-bottom:1px solid #e8d5b0;">
              <p style="margin:0;font-size:13px;color:#9e8272;">📅 Data</p>
              <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:${brown};text-transform:capitalize;">${r.fDate}</p>
            </td></tr>
            <tr><td style="padding:12px 20px;border-bottom:1px solid #e8d5b0;">
              <p style="margin:0;font-size:13px;color:#9e8272;">🕐 Orario</p>
              <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:${brown};">${r.fTime}</p>
            </td></tr>
            <tr><td style="padding:12px 20px;">
              <p style="margin:0;font-size:13px;color:#9e8272;">👥 Ospiti</p>
              <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:${brown};">${r.guests} ${r.guests === 1 ? 'persona' : 'persone'}</p>
            </td></tr>
          </table>
          <p style="margin:20px 0 8px;font-size:13px;color:#6b5244;line-height:1.7;">
            📍 <strong>Ristorante Al Gobbo di Rialto</strong><br/>
            Sestiere San Polo 649, 30125 Venezia<br/>
            <a href="tel:+390415204603" style="color:${gold};text-decoration:none;">+39 041 520 4603</a>
          </p>
          <p style="margin:16px 0 0;font-size:12px;color:#9e8272;text-align:center;">
            Non puoi più venire?
            <a href="${r.cancelUrl}" style="color:#9E4638;text-decoration:underline;">Cancella la prenotazione</a>
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:16px 24px;background:${sand};border-top:1px solid #e8d5b0;">
          <p style="margin:0;font-size:11px;color:#9e8272;text-align:center;font-family:Georgia,serif;font-style:italic;">
            "A presto a Venezia" — Lo staff del Ristorante Al Gobbo di Rialto
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
