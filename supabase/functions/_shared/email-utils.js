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
  const supportedLocales = new Set(['en', 'it', 'fr', 'de', 'es'])
  const locale = supportedLocales.has(reservation.locale) ? reservation.locale : 'it'
  const manageUrl = `${siteUrl.replace(/\/$/, '')}/cancella/${reservation.cancellation_token}?lang=${locale}`
  const dateLabel = formatReservationDate(reservation.date)
  const timeLabel = formatReservationTime(reservation.time)
  const isUpdate = Boolean(reservation.self_service_updated_at)
  const content = `
    <p style="margin:0;color:#a07814;font-weight:700">✓ ${isUpdate ? 'PRENOTAZIONE AGGIORNATA' : 'PRENOTAZIONE CONFERMATA'}</p>
    <h2 style="font-family:Georgia,serif;font-size:25px;margin:10px 0 18px">A presto a Venezia, ${safeName}</h2>
    <p style="line-height:1.7;margin:0">${isUpdate ? 'Le modifiche alla sua prenotazione sono state salvate.' : 'La sua prenotazione è confermata.'} Conservi questa email per gestire la prenotazione.</p>
    <p style="line-height:1.7;color:#856d5f;margin:8px 0 0"><em>${isUpdate ? 'Your booking changes have been saved.' : 'Your reservation is confirmed.'} Keep this email to manage your booking.</em></p>
    ${detailsBox({
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      occasion: reservation.occasion,
      specialRequests: reservation.special_requests,
    })}
    <p style="text-align:center;margin:26px 0 12px"><a href="${manageUrl}" style="display:inline-block;background:#9e4638;color:#fff;text-decoration:none;padding:13px 22px;border-radius:10px;font-weight:700">Gestisci o cancella / Manage or cancel</a></p>
    <p style="font-size:13px;line-height:1.6;color:#856d5f;text-align:center">Per modifiche, ritardi o esigenze di accessibilità ci chiami al <strong>+39 041 520 4603</strong>.</p>`

  return {
    subject: `${isUpdate ? 'Prenotazione aggiornata' : 'Prenotazione confermata'} — ${dateLabel.it} alle ${timeLabel}`,
    html: emailShell(isUpdate ? 'Prenotazione aggiornata' : 'Prenotazione confermata', isUpdate ? 'Modifica prenotazione' : 'Conferma prenotazione', content),
    text: [
      'RISTORANTE AL GOBBO DI RIALTO',
      `Gentile ${reservation.name}, ${isUpdate ? 'le modifiche alla sua prenotazione sono state salvate.' : 'la sua prenotazione è confermata.'}`,
      `${dateLabel.it} (${dateLabel.en}) alle ${timeLabel}`,
      `${reservation.guests} ospiti`,
      reservation.special_requests ? `Richieste: ${reservation.special_requests}` : '',
      `Gestisci o cancella la prenotazione: ${manageUrl}`,
      'Per modifiche: +39 041 520 4603',
    ].filter(Boolean).join('\n'),
  }
}

export function buildReservationAdminEmail(reservation) {
  const dateLabel = formatReservationDate(reservation.date)
  const timeLabel = formatReservationTime(reservation.time)
  const isUpdate = Boolean(reservation.self_service_updated_at)
  const content = `
    <p style="margin:0;color:#a07814;font-weight:700">${isUpdate ? 'PRENOTAZIONE MODIFICATA DAL CLIENTE' : 'NUOVA PRENOTAZIONE DAL SITO'}</p>
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
    subject: `${isUpdate ? 'Prenotazione modificata' : 'Nuova prenotazione'} — ${safeHeader(reservation.name)} · ${dateLabel.it} ${timeLabel}`,
    html: emailShell(isUpdate ? 'Prenotazione modificata' : 'Nuova prenotazione', 'Avviso amministratore', content),
  }
}

const adminAlertCopy = {
  '24h': {
    eyebrow: 'Promemoria operativo · 24 ore',
    heading: 'Prenotazione di domani',
    subjectPrefix: 'Promemoria 24h',
  },
  morning: {
    eyebrow: 'Promemoria operativo · oggi',
    heading: 'Prenotazione di oggi',
    subjectPrefix: 'Oggi',
  },
  '45m': {
    eyebrow: 'Promemoria operativo · 45 minuti',
    heading: 'Prenotazione tra circa 45 minuti',
    subjectPrefix: 'Tra 45 min',
  },
}

export function buildReservationAdminAlertEmail(reservation, alertKind, siteUrl) {
  const alert = adminAlertCopy[alertKind]
  if (!alert) throw new TypeError('A valid admin alert kind is required')

  const dateLabel = formatReservationDate(reservation.date)
  const timeLabel = formatReservationTime(reservation.time)
  const dashboardUrl = `${siteUrl.replace(/\/$/, '')}/admin`
  const content = `
    <p style="margin:0;color:#a07814;font-weight:700">${escapeHtml(alert.heading.toUpperCase())}</p>
    <h2 style="font-family:Georgia,serif;font-size:25px;margin:10px 0 18px">${escapeHtml(reservation.name)}</h2>
    ${detailsBox({
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      occasion: reservation.occasion,
      specialRequests: reservation.special_requests,
    })}
    <p style="line-height:1.8"><strong>Telefono:</strong> <a href="tel:${escapeHtml(reservation.phone)}" style="color:#7a342b">${escapeHtml(reservation.phone)}</a><br><strong>Email:</strong> <a href="mailto:${escapeHtml(reservation.email)}" style="color:#7a342b">${escapeHtml(reservation.email)}</a></p>
    <p style="text-align:center;margin:26px 0 0"><a href="${escapeHtml(dashboardUrl)}" style="display:inline-block;background:#9e4638;color:#fff;text-decoration:none;padding:13px 22px;border-radius:10px;font-weight:700">Apri le prenotazioni</a></p>`

  return {
    subject: `[${alert.subjectPrefix}] ${safeHeader(reservation.name)} · ${dateLabel.it} ${timeLabel}`,
    html: emailShell(alert.heading, alert.eyebrow, content),
    text: [
      alert.heading.toUpperCase(),
      reservation.name,
      `${dateLabel.it} alle ${timeLabel}`,
      `${reservation.guests} ospiti`,
      `Telefono: ${reservation.phone}`,
      `Email: ${reservation.email}`,
      reservation.occasion ? `Occasione: ${reservation.occasion}` : '',
      reservation.special_requests ? `Note: ${reservation.special_requests}` : '',
      `Gestisci: ${dashboardUrl}`,
    ].filter(Boolean).join('\n'),
  }
}

export function buildContactCustomerEmail(message) {
  const safeName = escapeHtml(`${message.first_name} ${message.last_name}`.trim())
  const subjectLabels = {
    reservation: 'Prenotazione / Reservation',
    event: 'Evento privato / Private event',
    feedback: 'Feedback',
    other: 'Altro / Other',
  }
  const subjectLabel = subjectLabels[message.subject] ?? message.subject
  const content = `
    <p style="margin:0;color:#a07814;font-weight:700">✓ MESSAGGIO RICEVUTO</p>
    <h2 style="font-family:Georgia,serif;font-size:25px;margin:10px 0 18px">Grazie, ${safeName}</h2>
    <p style="line-height:1.7;margin:0">Abbiamo ricevuto il suo messaggio e le risponderemo appena possibile.</p>
    <p style="line-height:1.7;color:#856d5f;margin:8px 0 0"><em>We received your message and will reply as soon as possible.</em></p>
    <div style="margin:24px 0;padding:20px;border:1px solid #e2cf9f;border-radius:12px;background:#fbf7ed;line-height:1.7">
      <strong>${escapeHtml(subjectLabel)}</strong>
      <p style="margin:10px 0 0;white-space:pre-wrap;color:#6b5244">${escapeHtml(message.message)}</p>
    </div>
    <p style="font-size:13px;line-height:1.6;color:#856d5f">Per richieste urgenti o prenotazioni per oggi ci chiami al <strong>+39 041 520 4603</strong>.</p>`

  return {
    subject: 'Abbiamo ricevuto il suo messaggio — Al Gobbo di Rialto',
    html: emailShell('Messaggio ricevuto', 'Contatti', content),
    text: [
      'RISTORANTE AL GOBBO DI RIALTO',
      `Gentile ${message.first_name} ${message.last_name},`,
      'abbiamo ricevuto il suo messaggio e le risponderemo appena possibile.',
      'We received your message and will reply as soon as possible.',
      '',
      `Oggetto / Subject: ${subjectLabel}`,
      message.message,
      '',
      'Per richieste urgenti: +39 041 520 4603',
    ].join('\n'),
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
