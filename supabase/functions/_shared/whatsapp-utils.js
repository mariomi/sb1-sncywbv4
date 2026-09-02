const TEMPLATE_NAMES = Object.freeze({
  reservation_confirmation: 'reservation_confirmed',
  reservation_updated: 'reservation_updated',
  reservation_cancelled: 'reservation_cancelled',
  reminder_24h: 'reservation_reminder_24h',
  reminder_2h: 'reservation_reminder_2h',
  waitlist_available: 'waitlist_table_available',
})

const LOCALE_CODES = Object.freeze({
  en: 'en_GB',
  it: 'it',
  fr: 'fr',
  de: 'de',
  es: 'es',
})

const DATE_LOCALES = Object.freeze({
  en: 'en-GB',
  it: 'it-IT',
  fr: 'fr-FR',
  de: 'de-DE',
  es: 'es-ES',
})

const OPT_OUT_WORDS = new Set([
  'stop',
  'annulla',
  'disiscrivimi',
  'unsubscribe',
  'arret',
  'arrêt',
  'stopp',
  'baja',
])

export function normalizeWhatsAppPhone(value) {
  if (typeof value !== 'string') return null
  const compact = value.trim().replace(/[\s().-]/g, '')
  const international = compact.startsWith('00') ? `+${compact.slice(2)}` : compact
  if (!international.startsWith('+')) return null
  const digits = international.slice(1)
  if (!/^[1-9][0-9]{7,14}$/.test(digits)) return null
  return `+${digits}`
}

export function toMetaRecipient(phoneE164) {
  const normalized = normalizeWhatsAppPhone(phoneE164)
  return normalized ? normalized.slice(1) : null
}

export function getTemplateName(purpose, configuredName) {
  if (typeof configuredName === 'string' && configuredName.trim()) return configuredName.trim()
  return TEMPLATE_NAMES[purpose] ?? null
}

export function getTemplateLanguage(locale) {
  return LOCALE_CODES[locale] ?? 'en'
}

export function getFirstName(name) {
  if (typeof name !== 'string') return 'Guest'
  return name.trim().split(/\s+/)[0]?.slice(0, 80) || 'Guest'
}

export function formatWhatsAppReservationDate(date, locale = 'en') {
  const localeCode = DATE_LOCALES[locale] ?? DATE_LOCALES.en
  const parsed = new Date(`${date}T12:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return String(date).slice(0, 40)
  return parsed.toLocaleDateString(localeCode, {
    timeZone: 'Europe/Rome',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function buildReservationTemplateParameters(reservation, purpose, siteUrl) {
  const locale = Object.hasOwn(DATE_LOCALES, reservation.locale) ? reservation.locale : 'en'
  const firstName = getFirstName(reservation.name)
  const date = formatWhatsAppReservationDate(reservation.date, locale)
  const time = String(reservation.time).slice(0, 5)

  if (purpose === 'reservation_cancelled') return [firstName, date, time]

  const manageUrl = `${String(siteUrl).replace(/\/$/, '')}/cancella/${reservation.cancellation_token}?lang=${locale}`
  return [firstName, date, time, String(reservation.guests), manageUrl]
}

export function buildTemplateComponents(parameters) {
  return [{
    type: 'body',
    parameters: parameters.map((value) => ({
      type: 'text',
      text: String(value).slice(0, 1024),
    })),
  }]
}

export function isOptOutMessage(text) {
  if (typeof text !== 'string') return false
  const normalized = text.trim().toLocaleLowerCase().replace(/[.!?,;:]+$/g, '')
  return OPT_OUT_WORDS.has(normalized)
}

export function extractInboundMessageText(message) {
  if (!message || typeof message !== 'object') return null
  if (message.type === 'text') return message.text?.body ?? null
  if (message.type === 'button') return message.button?.text ?? message.button?.payload ?? null
  if (message.type === 'interactive') {
    return message.interactive?.button_reply?.title
      ?? message.interactive?.button_reply?.id
      ?? message.interactive?.list_reply?.title
      ?? message.interactive?.list_reply?.id
      ?? null
  }
  return message.image?.caption
    ?? message.document?.caption
    ?? message.video?.caption
    ?? null
}

export function messageTypeForStorage(message) {
  if (message?.type === 'text' || message?.type === 'button') return 'text'
  if (message?.type === 'interactive') return 'interactive'
  if (['audio', 'document', 'image', 'sticker', 'video'].includes(message?.type)) return 'media'
  return 'unsupported'
}

export function messageStatusRank(status) {
  return ({ sending: 0, sent: 1, delivered: 2, read: 3, failed: 4 })[status] ?? -1
}

export function shouldApplyMessageStatus(currentStatus, nextStatus) {
  if (nextStatus === 'failed') return currentStatus !== 'read'
  if (currentStatus === 'failed') return false
  return messageStatusRank(nextStatus) >= messageStatusRank(currentStatus)
}

export function secretsMatch(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string' || left.length === 0 || left.length !== right.length) {
    return false
  }
  let difference = 0
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return difference === 0
}
