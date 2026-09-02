import { createClient } from 'npm:@supabase/supabase-js@2.112.4'
import { normalizeWhatsAppPhone, secretsMatch, toMetaRecipient } from '../_shared/whatsapp-utils.js'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const META_ACCESS_TOKEN = Deno.env.get('META_WHATSAPP_ACCESS_TOKEN')
const META_PHONE_NUMBER_ID = Deno.env.get('META_WHATSAPP_PHONE_NUMBER_ID')
const META_API_VERSION = Deno.env.get('META_WHATSAPP_API_VERSION')

const ALLOWED_ORIGINS = new Set([
  'https://www.ristorantealgobbodirialto.it',
  'https://ristorantealgobbodirialto.it',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

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

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request) })
  if (request.method !== 'POST') return respond(request, { error: 'Method not allowed' }, 405)
  if (!SUPABASE_URL || !ANON_KEY || !SERVICE_KEY) return respond(request, { error: 'Servizio non configurato' }, 503)
  if (!secretsMatch(request.headers.get('apikey'), ANON_KEY)) {
    return respond(request, { error: 'Accesso non autorizzato' }, 401)
  }

  const authorization = request.headers.get('authorization')
  if (!authorization) return respond(request, { error: 'Accesso amministratore richiesto' }, 401)

  const authClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data: authData, error: authError } = await authClient.auth.getUser()
  if (authError || authData.user?.app_metadata?.role !== 'admin') {
    return respond(request, { error: 'Accesso non autorizzato' }, 403)
  }

  const payload = await request.json().catch(() => null) as {
    phone?: unknown
    body?: unknown
    reservation_id?: unknown
    reply_to_provider_message_id?: unknown
  } | null
  const phoneE164 = normalizeWhatsAppPhone(payload?.phone)
  const metaRecipient = toMetaRecipient(payload?.phone)
  const body = typeof payload?.body === 'string' ? payload.body.trim() : ''
  const reservationId = payload?.reservation_id == null ? null : payload.reservation_id
  const replyTo = payload?.reply_to_provider_message_id == null ? null : payload.reply_to_provider_message_id

  if (!phoneE164 || !metaRecipient || body.length < 1 || body.length > 1000
    || (reservationId !== null && !isUuid(reservationId))
    || (replyTo !== null && (typeof replyTo !== 'string' || replyTo.length > 255))) {
    return respond(request, { error: 'Messaggio non valido' }, 400)
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data: flag, error: flagError } = await supabase
    .from('feature_flags')
    .select('enabled')
    .eq('key', 'whatsapp_notifications')
    .maybeSingle()
  if (flagError) return respond(request, { error: 'Impossibile leggere le impostazioni WhatsApp' }, 500)
  if (flag?.enabled !== true) return respond(request, { error: 'WhatsApp non è ancora attivo' }, 409)

  const { data: contact, error: contactError } = await supabase
    .from('whatsapp_contacts')
    .select('service_window_expires_at,opted_out_at')
    .eq('phone_e164', phoneE164)
    .maybeSingle()
  if (contactError) return respond(request, { error: 'Impossibile caricare il contatto' }, 500)
  if (!contact) return respond(request, { error: 'Il cliente non ha ancora scritto su WhatsApp' }, 409)
  if (contact.opted_out_at) return respond(request, { error: 'Il cliente ha revocato il consenso WhatsApp' }, 409)
  if (!contact.service_window_expires_at || new Date(contact.service_window_expires_at) <= new Date()) {
    return respond(request, { error: 'La finestra di risposta di 24 ore è scaduta; serve un modello approvato' }, 409)
  }

  if (!META_ACCESS_TOKEN || !META_PHONE_NUMBER_ID || !META_API_VERSION
    || !/^v\d+\.\d+$/.test(META_API_VERSION)) {
    return respond(request, { error: 'Servizio WhatsApp non configurato' }, 503)
  }

  const { data: queued, error: queueError } = await supabase
    .from('whatsapp_messages')
    .insert({
      reservation_id: reservationId,
      contact_phone: phoneE164,
      direction: 'outbound',
      purpose: 'manual_reply',
      message_type: 'text',
      body_text: body,
      reply_to_provider_message_id: replyTo,
      status: 'sending',
      attempt_count: 1,
      metadata: { sent_by_user_id: authData.user.id },
    })
    .select('id')
    .single()
  if (queueError) {
    console.error('Could not queue admin WhatsApp reply', queueError)
    return respond(request, { error: 'Impossibile preparare il messaggio' }, 500)
  }

  try {
    const graphPayload: Record<string, unknown> = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: metaRecipient,
      type: 'text',
      text: { preview_url: false, body },
    }
    if (replyTo) graphPayload.context = { message_id: replyTo }

    const graphResponse = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${META_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${META_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphPayload),
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
    }).eq('id', queued.id)
    if (updateError) throw updateError

    return respond(request, { success: true, message_id: queued.id })
  } catch (error) {
    const failedAt = new Date().toISOString()
    const providerCode = typeof error === 'object' && error && 'code' in error
      ? String(error.code).slice(0, 80)
      : 'send_failed'
    const providerMessage = error instanceof Error ? error.message.slice(0, 500) : 'Unknown Meta error'
    await supabase.from('whatsapp_messages').update({
      status: 'failed',
      error_code: providerCode,
      error_message: providerMessage,
      failed_at: failedAt,
      updated_at: failedAt,
    }).eq('id', queued.id)
    console.error('Admin WhatsApp reply failed', providerCode, providerMessage)
    return respond(request, { error: 'Invio WhatsApp temporaneamente non disponibile' }, 502)
  }
})
