import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.112.4'
import { jsonResponse } from '../_shared/reminder-utils.js'
import { buildWaitlistEmail, isEmail, isUuid } from '../_shared/email-utils.js'

const RESEND_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const SITE_URL = (Deno.env.get('SITE_URL') ?? 'https://www.ristorantealgobbodirialto.it').replace(/\/$/, '')
const RESERVATIONS_EMAIL = Deno.env.get('RESERVATIONS_EMAIL') ?? 'reservations@ristorantealgobbodirialto.it'
const ALLOWED_ORIGINS = new Set([
  'https://www.ristorantealgobbodirialto.it',
  'https://ristorantealgobbodirialto.it',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

type WaitlistEmailRecord = {
  id: string
  name: string
  email: string
  date: string
  time: string
  guests: number
  status: string
  notified_at: string | null
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

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request) })
  if (request.method !== 'POST') return respond(request, { error: 'Method not allowed' }, 405)
  if (!RESEND_KEY || !SUPABASE_URL || !SERVICE_KEY) {
    console.error('Waitlist notification service is not configured')
    return respond(request, { error: 'Servizio email non configurato' }, 503)
  }

  const body = await request.json().catch(() => null) as { waitlist_id?: unknown } | null
  if (!body || !isUuid(body.waitlist_id)) return respond(request, { error: 'Richiesta non valida' }, 400)

  const token = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) return respond(request, { error: 'Autenticazione richiesta' }, 401)

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return respond(request, { error: 'Sessione non valida' }, 401)
  if (user.app_metadata?.role !== 'admin') return respond(request, { error: 'Accesso non autorizzato' }, 403)

  const claimTime = new Date().toISOString()
  let entry: WaitlistEmailRecord | null = null
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .update({ status: 'notified', notified_at: claimTime })
      .eq('id', body.waitlist_id)
      .eq('status', 'waiting')
      .select('id,name,email,date,time,guests,status,notified_at')
      .maybeSingle()
    if (error) throw error
    entry = data
    if (!entry) return respond(request, { error: 'Voce già notificata o non disponibile' }, 409)
    if (!isEmail(entry.email)) throw new Error('Invalid waitlist email')

    const email = buildWaitlistEmail(entry, SITE_URL)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `waitlist-available/${entry.id}`,
      },
      body: JSON.stringify({
        from: `Al Gobbo di Rialto <${RESERVATIONS_EMAIL}>`,
        to: entry.email,
        reply_to: RESERVATIONS_EMAIL,
        ...email,
      }),
    })
    if (!response.ok) throw new Error(`Email provider returned ${response.status}`)
    return respond(request, { success: true })
  } catch (error) {
    if (entry) {
      await supabase
        .from('waitlist')
        .update({ status: 'waiting', notified_at: null })
        .eq('id', entry.id)
        .eq('notified_at', claimTime)
    }
    console.error('Waitlist notification failed', error)
    return respond(request, { error: 'Invio email temporaneamente non disponibile' }, 502)
  }
})
