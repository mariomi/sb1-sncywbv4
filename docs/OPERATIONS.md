# Production operations

This guide covers the four trusted Supabase email functions: booking
confirmation, waitlist notification, day-before reminder, and two-hour
reminder. Never place Resend or service-role credentials in a `VITE_*`
variable: Vite exposes those values to browsers.

## Required secrets

The Supabase Edge Functions use the automatically provided `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY`, plus these custom Function Secrets:

- `RESEND_API_KEY`: a Resend key restricted to sending email
- `SITE_URL`: `https://www.ristorantealgobbodirialto.it`
- `RESERVATIONS_EMAIL`: the restaurant inbox that receives new-booking alerts
- `REMINDER_CRON_SECRET`: a new random value with at least 32 bytes of entropy

Store local values only in ignored environment files. To upload Edge Function
secrets without putting them in shell history, create an ignored file such as
`.env.reminders.local`, then run:

```powershell
npx supabase secrets set --env-file .env.reminders.local
```

## Deploy email functions

Keep JWT verification enabled. The additional `x-reminder-secret` check limits
who can trigger bulk email even if a public Supabase key is known.

```powershell
npx supabase functions deploy send-reservation-confirmation send-waitlist-notification send-reminders send-2h-reminders --use-api
```

The public booking form invokes `send-reservation-confirmation` through the
Supabase client after the reservation is stored. The admin waitlist action
invokes `send-waitlist-notification` with the signed-in administrator session.
No browser request depends on a localhost or Express email server.

## Create schedules

Supabase Cron schedules use UTC. Configure HTTP POST jobs in the Supabase Cron
dashboard (or with `pg_cron` + `pg_net`) with these schedules:

| Function | UTC cron | Result |
| --- | --- | --- |
| `send-reminders` | `0 7,8 * * *` | The function sends only when Rome local time is 09:00, covering CET and CEST. |
| `send-2h-reminders` | `*/10 * * * *` | Finds bookings starting in 110–130 minutes. |

Each request must include:

- `Content-Type: application/json`
- `apikey: <Supabase publishable/anon key>`
- `Authorization: Bearer <Supabase publishable/anon key>`
- `x-reminder-secret: <same REMINDER_CRON_SECRET as the Function Secret>`

Store request credentials in Supabase Vault. Do not hard-code them in SQL or a
migration. The day-before function accepts `{ "force": true }` only for a
deliberate operator test; normal scheduled requests should send `{}`.

## Verification

Before every release:

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm audit --omit=dev --audit-level=high
npx supabase db lint --linked --level warning
npx supabase db advisors --linked --type security --level warn --fail-on none
npx supabase db advisors --linked --type performance --level warn --fail-on none
```

After activation, check the Cron run history and Edge Function logs. A healthy
run returns JSON with `eligible`, `sent`, and `failed`; `failed` must be zero.
The `reminder_emails` feature flag can stop both reminder streams without
removing schedules.

## Secret rotation

If an email key was ever committed, published, pasted into a browser-exposed
variable, or shared outside the deployment system:

1. Revoke it in Resend.
2. Create a replacement restricted to `sending_access` and the restaurant domain.
3. Update the backend host and Supabase Function Secret.
4. Test one controlled booking before enabling Cron.

Deleting `.env` in a later commit does not remove a secret from Git history.
History rewriting should be planned separately because it changes commit IDs
for every collaborator.

## Disabled legacy function

The `create-admin-user` Edge Function is intentionally deployed as an inert
HTTP 410 response. Its former implementation belonged to another project and
contained embedded SMTP credentials. Do not restore it. Rotate the affected
mailbox/SMTP credential in its provider even though the active function no
longer contains or uses it.

Restaurant administrators must be provisioned deliberately through the
Supabase Admin API or dashboard, and authorization belongs in
`app_metadata.role = "admin"`. Confirm the exact operator email before granting
that role.
