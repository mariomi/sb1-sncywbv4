import { escapeHtml } from './reminder-utils.js'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isUuid(value) {
  return typeof value === 'string' && UUID_PATTERN.test(value)
}

export function isEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function safeHeader(value) {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').slice(0, 160)
}

export function formatReservationDate(dateValue) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateValue ?? ''))) {
    throw new TypeError('A valid reservation date is required')
  }

  const date = new Date(`${dateValue}T12:00:00Z`)
  return {
    it: date.toLocaleDateString('it-IT', {
      timeZone: 'Europe/Rome',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    en: date.toLocaleDateString('en-GB', {
      timeZone: 'Europe/Rome',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  }
}

export function formatReservationTime(timeValue) {
  const value = String(timeValue ?? '')
  if (!/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(value)) {
    throw new TypeError('A valid reservation time is required')
  }
  return value.slice(0, 5)
}

function emailShell(title, eyebrow, content) {
  return `<!doctype html>
<html lang="it">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;background:#f4efe6;font-family:Arial,sans-serif;color:#5c4033">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4efe6">
    <tr><td align="center" style="padding:28px 14px">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 10px 35px rgba(58,38,30,.12)">
        <tr><td style="background:#5c4033;padding:34px 30px;text-align:center;border-bottom:4px solid #d4af37">
          <p style="margin:0 0 8px;color:#d4af37;font-size:11px;letter-spacing:3px;text-transform:uppercase">${escapeHtml(eyebrow)}</p>
          <h1 style="margin:0;color:#fff;font-family:Georgia,serif;font-size:28px">Al Gobbo di Rialto</h1>
          <p style="margin:8px 0 0;color:#ddc9aa;font-size:12px;letter-spacing:2px">VENEZIA · DAL 1955</p>
        </td></tr>
        <tr><td style="padding:32px 30px">${content}</td></tr>
        <tr><td style="background:#5c4033;padding:22px 30px;text-align:center;color:#ddc9aa;font-size:12px;line-height:1.7">
          San Polo 649, Venezia · +39 041 520 4603<br>
          <a href="https://www.ristorantealgobbodirialto.it" style="color:#d4af37">ristorantealgobbodirialto.it</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function detailsBox({ date, time, guests, occasion, specialRequests }) {
  const dateLabel = formatReservationDate(date)
  const timeLabel = formatReservationTime(time)
  return `<div style="margin:24px 0;padding:20px;border:1px solid #e2cf9f;border-radius:12px;background:#fbf7ed;line-height:1.8">
    <strong>📅 ${escapeHtml(dateLabel.it)}</strong><br>
    <span style="color:#856d5f;font-size:13px">${escapeHtml(dateLabel.en)}</span><br>
    <strong>🕐 ${escapeHtml(timeLabel)} &nbsp; · &nbsp; 👥 ${Number(guests)} ${Number(guests) === 1 ? 'persona' : 'persone'}</strong>
    ${occasion ? `<br>🥂 ${escapeHtml(occasion)}` : ''}
    ${specialRequests ? `<br>📝 ${escapeHtml(specialRequests)}` : ''}
  </div>`
}

export function buildReservationCustomerEmail(reservation, siteUrl) {
  const safeName = escapeHtml(reservation.name)
  const manageUrl = `${siteUrl.replace(/\/$/, '')}/cancella/${reservation.cancellation_token}`
  const dateLabel = formatReservationDate(reservation.date)
  const timeLabel = formatReservationTime(reservation.time)
  const content = `
    <p style="margin:0;color:#a07814;font-weight:700">✓ PRENOTAZIONE CONFERMATA</p>
    <h2 style="font-family:Georgia,serif;font-size:25px;margin:10px 0 18px">A presto a Venezia, ${safeName}</h2>
    <p style="line-height:1.7;margin:0">La sua prenotazione è confermata. Conservi questa email per gestire la prenotazione.</p>
    <p style="line-height:1.7;color:#856d5f;margin:8px 0 0"><em>Your reservation is confirmed. Keep this email to manage your booking.</em></p>
    ${detailsBox({
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      occasion: reservation.occasion,
      specialRequests: reservation.special_requests,
    })}
    <p style="text-align:center;margin:26px 0 12px"><a href="${manageUrl}" style="display:inline-block;background:#9e4638;color:#fff;text-decoration:none;padding:13px 22px;border-radius:10px;font-weight:700">Cancella prenotazione / Cancel booking</a></p>
    <p style="font-size:13px;line-height:1.6;color:#856d5f;text-align:center">Per modifiche, ritardi o esigenze di accessibilità ci chiami al <strong>+39 041 520 4603</strong>.</p>`

  return {
    subject: `Prenotazione confermata — ${dateLabel.it} alle ${timeLabel}`,
    html: emailShell('Prenotazione confermata', 'Conferma prenotazione', content),
    text: [
      'RISTORANTE AL GOBBO DI RIALTO',
      `Gentile ${reservation.name}, la sua prenotazione è confermata.`,
      `${dateLabel.it} (${dateLabel.en}) alle ${timeLabel}`,
      `${reservation.guests} ospiti`,
      reservation.special_requests ? `Richieste: ${reservation.special_requests}` : '',
      `Cancella prenotazione: ${manageUrl}`,
      'Per modifiche: +39 041 520 4603',
    ].filter(Boolean).join('\n'),
  }
}

export function buildReservationAdminEmail(reservation) {
  const dateLabel = formatReservationDate(reservation.date)
  const timeLabel = formatReservationTime(reservation.time)
  const content = `
    <p style="margin:0;color:#a07814;font-weight:700">NUOVA PRENOTAZIONE DAL SITO</p>
    <h2 style="font-family:Georgia,serif;font-size:25px;margin:10px 0 18px">${escapeHtml(reservation.name)}</h2>
    ${detailsBox({
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      occasion: reservation.occasion,
      specialRequests: reservation.special_requests,
    })}
    <p style="line-height:1.8"><strong>Email:</strong> ${escapeHtml(reservation.email)}<br><strong>Telefono:</strong> ${escapeHtml(reservation.phone)}</p>`

  return {
    subject: `Nuova prenotazione — ${safeHeader(reservation.name)} · ${dateLabel.it} ${timeLabel}`,
    html: emailShell('Nuova prenotazione', 'Avviso amministratore', content),
  }
}

export function buildWaitlistEmail(entry, siteUrl) {
  const dateLabel = formatReservationDate(entry.date)
  const timeLabel = formatReservationTime(entry.time)
  const reserveUrl = `${siteUrl.replace(/\/$/, '')}/book?date=${encodeURIComponent(entry.date)}&time=${encodeURIComponent(timeLabel)}`
  const content = `
    <p style="margin:0;color:#a07814;font-weight:700">POSTO DISPONIBILE</p>
    <h2 style="font-family:Georgia,serif;font-size:25px;margin:10px 0 18px">Buone notizie, ${escapeHtml(entry.name)}</h2>
    <p style="line-height:1.7">Si è liberato un posto per la sua richiesta. La disponibilità può cambiare: completi la prenotazione appena possibile.</p>
    <p style="line-height:1.7;color:#856d5f"><em>A table has become available. Availability can change, so please complete your booking soon.</em></p>
    ${detailsBox({ date: entry.date, time: entry.time, guests: entry.guests })}
    <p style="text-align:center;margin:26px 0 12px"><a href="${reserveUrl}" style="display:inline-block;background:#d4af37;color:#4a3329;text-decoration:none;padding:13px 24px;border-radius:10px;font-weight:700">Prenota ora / Book now</a></p>`

  return {
    subject: `Posto disponibile — ${dateLabel.it} alle ${timeLabel}`,
    html: emailShell('Posto disponibile', 'Lista d’attesa', content),
    text: `Si è liberato un posto per ${dateLabel.it} alle ${timeLabel}. Prenota: ${reserveUrl}`,
  }
}
