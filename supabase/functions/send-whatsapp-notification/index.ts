import { createClient } from 'npm:@supabase/supabase-js@2.112.4'
import {
  buildReservationTemplateParameters,
  buildTemplateComponents,
  getTemplateLanguage,
  getTemplateName,
  normalizeWhatsAppPhone,
  secretsMatch,
  toMetaRecipient,
} from '../_shared/whatsapp-utils.js'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
const META_ACCESS_TOKEN = Deno.env.get('META_WHATSAPP_ACCESS_TOKEN')
const META_PHONE_NUMBER_ID = Deno.env.get('META_WHATSAPP_PHONE_NUMBER_ID')
const META_API_VERSION = Deno.env.get('META_WHATSAPP_API_VERSION')
const SITE_URL = (Deno.env.get('SITE_URL') ?? 'https://www.ristorantealgobbodirialto.it').replace(/\/$/, '')

const ALLOWED_ORIGINS = new Set([
  'https://www.ristorantealgobbodirialto.it',
  'https://ristorantealgobbodirialto.it',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

const PURPOSE_ENV = {
  reservation_confirmation: 'META_WHATSAPP_TEMPLATE_RESERVATION_CONFIRMED',
  reservation_updated: 'META_WHATSAPP_TEMPLATE_RESERVATION_UPDATED',
  reservation_cancelled: 'META_WHATSAPP_TEMPLATE_RESERVATION_CANCELLED',
  reminder_24h: 'META_WHATSAPP_TEMPLATE_REMINDER_24H',
  reminder_2h: 'META_WHATSAPP_TEMPLATE_REMINDER_2H',
} as const

type NotificationPurpose = keyof typeof PURPOSE_ENV

type ReservationRecord = {
  id: string
  cancellation_token: string
  created_at: string
  updated_at: string | null
  self_service_updated_at: string | null
  date: string
  time: string
  guests: number
  name: string
  phone: string
  locale: string
  status: string
  whatsapp_opt_in: boolean
  whatsapp_opt_out_at: string | null
}

function corsHeaders(request: Request) {
  const origin = request.headers.get('origin') ?? ''
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://www.ristorantealgobbodirialto.it',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  }
}

function respond(request: Request, body: unknown, status = 200) {
  return Response.json(body, { status, headers: corsHeaders(request) })
}

function isUuid(value: unknown): value is string {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function isPurpose(value: unknown): value is NotificationPurpose {
  return typeof value === 'string' && value in PURPOSE_ENV
}

function eventVersion(reservation: ReservationRecord, purpose: NotificationPurpose) {
  if (purpose === 'reservation_confirmation') return reservation.created_at
  if (purpose === 'reservation_updated') return reservation.self_service_updated_at ?? reservation.updated_at ?? reservation.created_at
  if (purpose === 'reservation_cancelled') return reservation.updated_at ?? reservation.created_at
  return `${reservation.date}:${purpose}`
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request) })
  if (request.method !== 'POST') return respond(request, { error: 'Method not allowed' }, 405)
  if (!SUPABASE_URL || !SERVICE_KEY || !ANON_KEY) return respond(request, { error: 'Servizio non configurato' }, 503)
  if (!secretsMatch(request.headers.get('apikey'), ANON_KEY)
    && !secretsMatch(request.headers.get('apikey'), SERVICE_KEY)) {
    return respond(request, { error: 'Accesso non autorizzato' }, 401)
  }

  const payload = await request.json().catch(() => null) as {
    reservation_id?: unknown
    cancellation_token?: unknown
    purpose?: unknown
  } | null

  if (!payload
    || !isUuid(payload.reservation_id)
    || !isUuid(payload.cancellation_token)
    || !isPurpose(payload.purpose)) {
    return respond(request, { error: 'Richiesta non valida' }, 400)
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: flag, error: flagError } = await supabase
    .from('feature_flags')
    .select('enabled')
    .eq('key', 'whatsapp_notifications')
    .maybeSingle()

  if (flagError) {
    console.error('Could not read WhatsApp feature flag', flagError)
    return respond(request, { error: 'Impossibile leggere le impostazioni WhatsApp' }, 500)
  }
  if (flag?.enabled !== true) {
    return respond(request, { success: true, sent: false, skipped: 'feature_disabled' })
  }

  const { data, error } = await supabase
    .from('reservations')
    .select('id,cancellation_token,created_at,updated_at,self_service_updated_at,date,time,guests,name,phone,locale,status,whatsapp_opt_in,whatsapp_opt_out_at')
    .eq('id', payload.reservation_id)
    .eq('cancellation_token', payload.cancellation_token)
    .maybeSingle()

  if (error) {
    console.error('Could not load reservation for WhatsApp notification', error)
    return respond(request, { error: 'Impossibile caricare la prenotazione' }, 500)
  }
  if (!data) return respond(request, { error: 'Prenotazione non trovata' }, 404)

  const reservation = data as ReservationRecord
  const expectsCancelled = payload.purpose === 'reservation_cancelled'
  if ((expectsCancelled && reservation.status !== 'cancelled')
    || (!expectsCancelled && !['pending', 'confirmed'].includes(reservation.status))) {
    return respond(request, { success: true, sent: false, skipped: 'incompatible_status' })
  }
  if (!reservation.whatsapp_opt_in || reservation.whatsapp_opt_out_at) {
    return respond(request, { success: true, sent: false, skipped: 'no_consent' })
  }

  const phoneE164 = normalizeWhatsAppPhone(reservation.phone)
  const metaRecipient = toMetaRecipient(reservation.phone)
  if (!phoneE164 || !metaRecipient) {
    return respond(request, { success: true, sent: false, skipped: 'invalid_phone' })
  }

  const { data: contact, error: contactError } = await supabase
    .from('whatsapp_contacts')
    .select('opted_out_at')
    .eq('phone_e164', phoneE164)
    .maybeSingle()

  if (contactError) {
    console.error('Could not load WhatsApp contact', contactError)
    return respond(request, { error: 'Impossibile controllare il contatto WhatsApp' }, 500)
  }
  if (contact?.opted_out_at) {
    return respond(request, { success: true, sent: false, skipped: 'contact_opted_out' })
  }

  const { error: contactInsertError } = await supabase
    .from('whatsapp_contacts')
    .upsert({ phone_e164: phoneE164 }, { onConflict: 'phone_e164', ignoreDuplicates: true })
  if (contactInsertError) {
    console.error('Could not prepare WhatsApp contact', contactInsertError)
    return respond(request, { error: 'Impossibile preparare il contatto WhatsApp' }, 500)
  }

  const version = eventVersion(reservation, payload.purpose)
  const dedupeKey = `reservation:${reservation.id}:${payload.purpose}:${version}`
  const templateName = getTemplateName(
    payload.purpose,
    Deno.env.get(PURPOSE_ENV[payload.purpose]),
  )
  const templateLanguage = getTemplateLanguage(reservation.locale)

  const { data: existing, error: existingError } = await supabase
    .from('whatsapp_messages')
    .select('id,status,attempt_count')
    .eq('dedupe_key', dedupeKey)
    .maybeSingle()
  if (existingError) {
    console.error('Could not check WhatsApp idempotency', existingError)
    return respond(request, { error: 'Impossibile preparare il messaggio WhatsApp' }, 500)
  }

  let messageId: string
  if (existing) {
    if (existing.status !== 'failed') {
      return respond(request, {
        success: true,
        sent: ['sent', 'delivered', 'read'].includes(existing.status),
        already_processed: true,
        status: existing.status,
      })
    }
    const { data: claimedRetry, error: retryError } = await supabase
      .from('whatsapp_messages')
      .update({
        status: 'sending',
        attempt_count: existing.attempt_count + 1,
        error_code: null,
        error_message: null,
        failed_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .eq('status', 'failed')
      .select('id')
      .maybeSingle()
    if (retryError) {
      console.error('Could not claim WhatsApp retry', retryError)
      return respond(request, { error: 'Impossibile riprovare il messaggio WhatsApp' }, 500)
    }
    if (!claimedRetry) return respond(request, { success: true, sent: false, already_processed: true })
    messageId = claimedRetry.id
  } else {
    const { data: queued, error: insertError } = await supabase
      .from('whatsapp_messages')
      .insert({
        reservation_id: reservation.id,
        contact_phone: phoneE164,
        direction: 'outbound',
        purpose: payload.purpose,
        message_type: 'template',
        template_name: templateName,
        template_language: templateLanguage,
        status: 'sending',
        dedupe_key: dedupeKey,
        attempt_count: 1,
        metadata: { event_version: version },
      })
      .select('id')
      .single()
    if (insertError) {
      if (insertError.code === '23505') {
        return respond(request, { success: true, sent: false, already_processed: true })
      }
      console.error('Could not queue WhatsApp notification', insertError)
      return respond(request, { error: 'Impossibile preparare il messaggio WhatsApp' }, 500)
    }
    messageId = queued.id
  }

  const missingConfiguration = [
    ['META_WHATSAPP_ACCESS_TOKEN', META_ACCESS_TOKEN],
    ['META_WHATSAPP_PHONE_NUMBER_ID', META_PHONE_NUMBER_ID],
    ['META_WHATSAPP_API_VERSION', META_API_VERSION],
  ].filter(([, value]) => !value).map(([name]) => name)

  if (missingConfiguration.length > 0 || !/^v\d+\.\d+$/.test(META_API_VERSION ?? '')) {
    const detail = missingConfiguration.length > 0 ? missingConfiguration.join(', ') : 'META_WHATSAPP_API_VERSION'
    await supabase.from('whatsapp_messages').update({
      status: 'failed',
      error_code: 'configuration_missing',
      error_message: `Missing or invalid configuration: ${detail}`,
      failed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', messageId)
    console.error(`WhatsApp notification configuration is missing or invalid: ${detail}`)
    return respond(request, { error: 'Servizio WhatsApp non configurato' }, 503)
  }

  try {
    const parameters = buildReservationTemplateParameters(reservation, payload.purpose, SITE_URL)
    const graphResponse = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${META_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${META_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: metaRecipient,
          type: 'template',
          template: {
            name: templateName,
            language: { code: templateLanguage },
            components: buildTemplateComponents(parameters),
          },
        }),
      },
    )
    const graphBody = await graphResponse.json().catch(() => ({})) as {
      messages?: Array<{ id?: string }>
      error?: { code?: number | string; message?: string }
    }

    if (!graphResponse.ok || !graphBody.messages?.[0]?.id) {
      throw Object.assign(new Error(graphBody.error?.message || `Meta returned HTTP ${graphResponse.status}`), {
        code: graphBody.error?.code ?? graphResponse.status,
      })
    }

    const sentAt = new Date().toISOString()
    const { error: updateError } = await supabase.from('whatsapp_messages').update({
      provider_message_id: graphBody.messages[0].id,
      status: 'sent',
      sent_at: sentAt,
      updated_at: sentAt,
    }).eq('id', messageId)
    if (updateError) throw updateError

    return respond(request, { success: true, sent: true, status: 'sent' })
  } catch (sendError) {
    const failedAt = new Date().toISOString()
    const providerCode = typeof sendError === 'object' && sendError && 'code' in sendError
      ? String(sendError.code).slice(0, 80)
      : 'send_failed'
    const providerMessage = sendError instanceof Error ? sendError.message.slice(0, 500) : 'Unknown Meta error'
    await supabase.from('whatsapp_messages').update({
      status: 'failed',
      error_code: providerCode,
      error_message: providerMessage,
      failed_at: failedAt,
      updated_at: failedAt,
    }).eq('id', messageId)
    console.error('WhatsApp notification failed', providerCode, providerMessage)
    return respond(request, { error: 'Invio WhatsApp temporaneamente non disponibile' }, 502)
  }
})
