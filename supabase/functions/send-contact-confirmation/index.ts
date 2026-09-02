import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.112.4'
import { jsonResponse } from '../_shared/reminder-utils.js'
import {
  buildContactCustomerEmail,
  isEmail,
  isUuid,
} from '../_shared/email-utils.js'

const RESEND_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const RESERVATIONS_EMAIL = Deno.env.get('RESERVATIONS_EMAIL') ?? 'reservations@ristorantealgobbodirialto.it'
const ALLOWED_ORIGINS = new Set([
  'https://www.ristorantealgobbodirialto.it',
  'https://ristorantealgobbodirialto.it',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

type ContactEmailRecord = {
  id: string
  first_name: string
  last_name: string
  email: string
  subject: string
  message: string
  confirmation_sent_at: string | null
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
  const response = jsonResponse(body, status)
  for (const [name, value] of Object.entries(corsHeaders(request))) response.headers.set(name, value)
  return response
}

async function sendEmail(payload: Record<string, unknown>, idempotencyKey: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(`Email provider returned ${response.status}`)
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request) })
  if (request.method !== 'POST') return respond(request, { error: 'Method not allowed' }, 405)
  if (!RESEND_KEY || !SUPABASE_URL || !SERVICE_KEY) {
    console.error('Contact confirmation service is not configured')
    return respond(request, { error: 'Servizio email non configurato' }, 503)
  }

  const body = await request.json().catch(() => null) as { message_id?: unknown } | null
  if (!body || !isUuid(body.message_id)) {
    return respond(request, { error: 'Richiesta non valida' }, 400)
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const claimTime = new Date().toISOString()
  let claimed: ContactEmailRecord | null = null

  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ confirmation_sent_at: claimTime })
      .eq('id', body.message_id)
      .is('confirmation_sent_at', null)
      .select('id,first_name,last_name,email,subject,message,confirmation_sent_at')
      .maybeSingle()
    if (error) throw error
    claimed = data

    if (!claimed) {
      const { data: existing, error: lookupError } = await supabase
        .from('contact_messages')
        .select('id,confirmation_sent_at')
        .eq('id', body.message_id)
        .maybeSingle()
      if (lookupError) throw lookupError
      if (!existing) return respond(request, { error: 'Messaggio non trovato' }, 404)
      return respond(request, { success: true, already_sent: true })
    }

    if (!isEmail(claimed.email)) throw new Error('Invalid contact email')
    const customerEmail = buildContactCustomerEmail(claimed)
    await sendEmail({
      from: `Al Gobbo di Rialto <${RESERVATIONS_EMAIL}>`,
      to: claimed.email,
      reply_to: RESERVATIONS_EMAIL,
      ...customerEmail,
    }, `contact-confirmation/${claimed.id}/${claimTime}`)

    return respond(request, { success: true })
  } catch (error) {
    if (claimed) {
      await supabase
        .from('contact_messages')
        .update({ confirmation_sent_at: null })
        .eq('id', claimed.id)
        .eq('confirmation_sent_at', claimTime)
    }
    console.error('Contact confirmation failed', error)
    return respond(request, { error: 'Invio email temporaneamente non disponibile' }, 502)
  }
})
