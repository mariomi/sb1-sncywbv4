import { createClient } from 'npm:@supabase/supabase-js@2.112.4'
import {
  extractInboundMessageText,
  isOptOutMessage,
  messageTypeForStorage,
  normalizeWhatsAppPhone,
  shouldApplyMessageStatus,
} from '../_shared/whatsapp-utils.js'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const VERIFY_TOKEN = Deno.env.get('META_WHATSAPP_VERIFY_TOKEN')
const APP_SECRET = Deno.env.get('META_WHATSAPP_APP_SECRET')
const META_PHONE_NUMBER_ID = Deno.env.get('META_WHATSAPP_PHONE_NUMBER_ID')

type JsonObject = Record<string, unknown>

function hex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false
  let difference = 0
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return difference === 0
}

async function hasValidSignature(rawBody: ArrayBuffer, signatureHeader: string | null) {
  if (!APP_SECRET || !signatureHeader?.startsWith('sha256=')) return false
  const supplied = signatureHeader.slice('sha256='.length).toLowerCase()
  if (!/^[0-9a-f]{64}$/.test(supplied)) return false
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(APP_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const calculated = hex(await crypto.subtle.sign('HMAC', key, rawBody))
  return constantTimeEqual(calculated, supplied)
}

function asObjects(value: unknown): JsonObject[] {
  return Array.isArray(value) ? value.filter((item): item is JsonObject => Boolean(item) && typeof item === 'object') : []
}

function timestampFromUnix(value: unknown) {
  const seconds = typeof value === 'string' || typeof value === 'number' ? Number(value) : Number.NaN
  return Number.isFinite(seconds) ? new Date(seconds * 1000).toISOString() : new Date().toISOString()
}

function todayInRome() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  return `${values.year}-${values.month}-${values.day}`
}

function metadataForInbound(message: JsonObject, phoneNumberId: unknown) {
  const interactive = message.interactive as JsonObject | undefined
  const buttonReply = interactive?.button_reply as JsonObject | undefined
  const listReply = interactive?.list_reply as JsonObject | undefined
  return {
    provider_type: typeof message.type === 'string' ? message.type : 'unknown',
    interactive_id: typeof buttonReply?.id === 'string'
      ? buttonReply.id
      : typeof listReply?.id === 'string' ? listReply.id : null,
    phone_number_id: typeof phoneNumberId === 'string' ? phoneNumberId : null,
  }
}

Deno.serve(async (request) => {
  if (request.method === 'GET') {
    if (!VERIFY_TOKEN) return Response.json({ error: 'Webhook non configurato' }, { status: 503 })
    const url = new URL(request.url)
    const mode = url.searchParams.get('hub.mode')
    const token = url.searchParams.get('hub.verify_token')
    const challenge = url.searchParams.get('hub.challenge')
    if (mode === 'subscribe' && token === VERIFY_TOKEN && challenge) {
      return new Response(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } })
    }
    return Response.json({ error: 'Verifica webhook rifiutata' }, { status: 403 })
  }

  if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 })
  if (!SUPABASE_URL || !SERVICE_KEY || !APP_SECRET) {
    return Response.json({ error: 'Webhook non configurato' }, { status: 503 })
  }

  const rawBody = await request.arrayBuffer()
  if (!await hasValidSignature(rawBody, request.headers.get('x-hub-signature-256'))) {
    return Response.json({ error: 'Firma webhook non valida' }, { status: 401 })
  }

  const payload = JSON.parse(new TextDecoder().decode(rawBody)) as JsonObject
  if (payload.object !== 'whatsapp_business_account') {
    return Response.json({ received: true, ignored: 'unsupported_object' })
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  try {
    let inboundProcessed = 0
    let statusesProcessed = 0

    for (const entry of asObjects(payload.entry)) {
      for (const change of asObjects(entry.changes)) {
        if (change.field !== 'messages') continue
        const value = (change.value && typeof change.value === 'object' ? change.value : {}) as JsonObject
        const metadata = (value.metadata && typeof value.metadata === 'object' ? value.metadata : {}) as JsonObject
        const phoneNumberId = metadata.phone_number_id
        if (META_PHONE_NUMBER_ID && phoneNumberId !== META_PHONE_NUMBER_ID) continue

        const profileByWaId = new Map<string, string>()
        for (const contact of asObjects(value.contacts)) {
          const profile = (contact.profile && typeof contact.profile === 'object' ? contact.profile : {}) as JsonObject
          if (typeof contact.wa_id === 'string' && typeof profile.name === 'string') {
            profileByWaId.set(contact.wa_id, profile.name.slice(0, 160))
          }
        }

        for (const message of asObjects(value.messages)) {
          if (typeof message.id !== 'string' || typeof message.from !== 'string') continue
          const phoneE164 = normalizeWhatsAppPhone(`+${message.from.replace(/\D/g, '')}`)
          if (!phoneE164) continue
          const receivedAt = timestampFromUnix(message.timestamp)
          const bodyText = extractInboundMessageText(message)?.slice(0, 4000) ?? null
          const profileName = profileByWaId.get(message.from) ?? null

          const { error: contactError } = await supabase.from('whatsapp_contacts').upsert({
            phone_e164: phoneE164,
            wa_id: message.from,
            profile_name: profileName,
            last_inbound_at: receivedAt,
            service_window_expires_at: new Date(new Date(receivedAt).getTime() + 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'phone_e164' })
          if (contactError) throw contactError

          const { data: candidates, error: reservationError } = await supabase
            .from('reservations')
            .select('id,phone,created_at')
            .in('status', ['pending', 'confirmed'])
            .eq('whatsapp_opt_in', true)
            .gte('date', todayInRome())
            .order('created_at', { ascending: false })
            .limit(250)
          if (reservationError) throw reservationError
          const reservation = candidates?.find((candidate) => normalizeWhatsAppPhone(candidate.phone) === phoneE164)

          const { error: insertError } = await supabase.from('whatsapp_messages').insert({
            reservation_id: reservation?.id ?? null,
            contact_phone: phoneE164,
            direction: 'inbound',
            purpose: 'customer_message',
            message_type: messageTypeForStorage(message),
            body_text: bodyText,
            provider_message_id: message.id,
            reply_to_provider_message_id: typeof (message.context as JsonObject | undefined)?.id === 'string'
              ? String((message.context as JsonObject).id)
              : null,
            status: 'received',
            received_at: receivedAt,
            metadata: metadataForInbound(message, phoneNumberId),
          })
          if (insertError && insertError.code !== '23505') throw insertError
          if (!insertError) inboundProcessed += 1

          if (bodyText && isOptOutMessage(bodyText)) {
            const optedOutAt = new Date().toISOString()
            const { error: optOutError } = await supabase.from('whatsapp_contacts').update({
              opted_out_at: optedOutAt,
              updated_at: optedOutAt,
            }).eq('phone_e164', phoneE164)
            if (optOutError) throw optOutError

            const matchingIds = (candidates ?? [])
              .filter((candidate) => normalizeWhatsAppPhone(candidate.phone) === phoneE164)
              .map((candidate) => candidate.id)
            if (matchingIds.length > 0) {
              const { error: reservationOptOutError } = await supabase.from('reservations').update({
                whatsapp_opt_in: false,
                whatsapp_opt_out_at: optedOutAt,
              }).in('id', matchingIds)
              if (reservationOptOutError) throw reservationOptOutError
            }
          }
        }

        for (const statusEvent of asObjects(value.statuses)) {
          if (typeof statusEvent.id !== 'string' || typeof statusEvent.status !== 'string') continue
          if (!['sent', 'delivered', 'read', 'failed'].includes(statusEvent.status)) continue
          const { data: existing, error: lookupError } = await supabase
            .from('whatsapp_messages')
            .select('id,status')
            .eq('provider_message_id', statusEvent.id)
            .maybeSingle()
          if (lookupError) throw lookupError
          if (!existing || !shouldApplyMessageStatus(existing.status, statusEvent.status)) continue

          const eventAt = timestampFromUnix(statusEvent.timestamp)
          const errors = asObjects(statusEvent.errors)
          const firstError = errors[0]
          const update: Record<string, unknown> = {
            status: statusEvent.status,
            updated_at: new Date().toISOString(),
          }
          if (statusEvent.status === 'sent') update.sent_at = eventAt
          if (statusEvent.status === 'delivered') update.delivered_at = eventAt
          if (statusEvent.status === 'read') update.read_at = eventAt
          if (statusEvent.status === 'failed') {
            update.failed_at = eventAt
            update.error_code = firstError?.code ? String(firstError.code).slice(0, 80) : 'meta_failed'
            update.error_message = typeof firstError?.message === 'string'
              ? firstError.message.slice(0, 500)
              : 'Meta delivery failed'
          }
          const { error: updateError } = await supabase
            .from('whatsapp_messages')
            .update(update)
            .eq('id', existing.id)
          if (updateError) throw updateError
          statusesProcessed += 1
        }
      }
    }

    return Response.json({ received: true, inbound_processed: inboundProcessed, statuses_processed: statusesProcessed })
  } catch (error) {
    console.error('Meta WhatsApp webhook processing failed', error)
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
})
