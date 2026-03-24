// Deno runtime — runs on Supabase Edge Functions
// Schedule via Supabase Dashboard → Edge Functions → Schedules
// Cron: "0 8 * * *" (every day at 08:00 UTC = 10:00 Italian time)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_KEY   = Deno.env.get('VITE_RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const SITE_URL     = Deno.env.get('SITE_URL') ?? 'https://www.ristorantealgobbodirialto.it'

Deno.serve(async () => {
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

  // Find tomorrow's reservations not yet reminded, status pending or confirmed
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  const { data: reservations, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('date', tomorrowStr)
    .in('status', ['pending', 'confirmed'])
    .is('reminder_sent_at', null)

  if (error) {
    console.error('❌ Query error:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  console.log(`📧 Found ${reservations?.length ?? 0} reservations to remind`)

  let sent = 0, failed = 0

  for (const r of reservations ?? []) {
    try {
      const cancelUrl  = `${SITE_URL}/cancella/${r.cancellation_token}`
      const confirmUrl = `${SITE_URL}/reserve`

      const fDate = new Date(r.date + 'T00:00:00').toLocaleDateString('it-IT', {
        weekday: 'long', day: 'numeric', month: 'long'
      })
      const fTime = r.time.slice(0, 5)

      const html = buildReminderHtml({ ...r, fDate, fTime, cancelUrl, confirmUrl })

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Al Gobbo di Rialto <reservations@ristorantealgobbodirialto.it>',
          to: r.email,
          subject: `⏰ Reminder: domani alle ${fTime} — Al Gobbo di Rialto`,
          html
        })
      })

      if (!res.ok) throw new Error(`Resend error: ${res.status}`)

      // Mark as sent
      await supabase
        .from('reservations')
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq('id', r.id)

      sent++
    } catch (err) {
      console.error(`❌ Failed for reservation ${r.id}:`, err)
      failed++
    }
  }

  return new Response(JSON.stringify({ sent, failed }), {
    headers: { 'Content-Type': 'application/json' }
  })
})

function buildReminderHtml(r: {
  name: string, fDate: string, fTime: string, guests: number,
  occasion?: string | null, special_requests?: string | null,
  cancelUrl: string, confirmUrl: string
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
          <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${gold};">Promemoria Prenotazione</p>
          <h2 style="margin:6px 0 0;font-size:20px;color:#fff;font-family:Georgia,serif;">⏰ A domani, ${r.name.split(' ')[0]}!</h2>
        </td></tr>
        <tr><td style="height:3px;background:${gold};"></td></tr>
        <!-- Body -->
        <tr><td style="padding:28px 32px;">
          <p style="margin:0 0 20px;font-size:15px;color:${brown};line-height:1.6;">
            Ti ricordiamo la tua prenotazione di <strong>domani</strong> al Ristorante Al Gobbo di Rialto.
          </p>
          <table width="100%" style="background:${sand};border-radius:8px;border:1px solid #e0c99a;">
            <tr><td style="padding:16px 20px;border-bottom:1px solid #e0c99a;">
              <p style="margin:0;font-size:11px;color:#9e8272;letter-spacing:2px;text-transform:uppercase;">Dettagli</p>
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
          <!-- CTA buttons -->
          <table width="100%" style="margin-top:24px;">
            <tr>
              <td style="padding-right:8px;">
                <a href="${r.cancelUrl}"
                   style="display:block;text-align:center;padding:12px;background:#fff;border:2px solid #e0c99a;border-radius:8px;color:#9e8272;text-decoration:none;font-size:14px;font-weight:500;">
                  ❌ Cancella prenotazione
                </a>
              </td>
              <td style="padding-left:8px;">
                <a href="${r.confirmUrl}"
                   style="display:block;text-align:center;padding:12px;background:${gold};border:2px solid ${gold};border-radius:8px;color:${brown};text-decoration:none;font-size:14px;font-weight:700;">
                  ✅ Tutto confermato
                </a>
              </td>
            </tr>
          </table>
          <p style="margin:20px 0 0;font-size:12px;color:#9e8272;text-align:center;">
            Il tavolo viene mantenuto 15 minuti dopo l'orario. Per modifiche: +39 041 520 4603
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:16px 24px;background:${sand};border-top:1px solid #e8d5b0;">
          <p style="margin:0;font-size:11px;color:#9e8272;text-align:center;">
            Ristorante Al Gobbo di Rialto — Sestiere San Polo 649, Venezia
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
