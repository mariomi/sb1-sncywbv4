# Meta WhatsApp Cloud API

The application is prepared for direct Meta WhatsApp Cloud API integration.
The `whatsapp_notifications` feature flag is intentionally `false` until every
item in the activation checklist has been verified. While it is disabled, the
booking form does not show WhatsApp consent and the backend sends no WhatsApp
messages.

## What is already implemented

- separate optional consent for reservation service messages;
- transactional templates for confirmation, update, cancellation, and 24-hour
  or 2-hour reminders;
- idempotency so the same booking event is not sent twice;
- delivery states: sending, sent, delivered, read, and failed;
- signed Meta webhook with inbound messages and delivery updates;
- global opt-out when a customer replies `STOP` (also supported: `annulla`,
  `disiscrivimi`, `unsubscribe`, `arrêt`, `stopp`, `baja`);
- an administrator WhatsApp inbox with free-form replies only inside Meta's
  24-hour customer-service window;
- no reservation notes, allergies, or special requests in Meta templates.

## Meta assets required

Create or confirm all of the following in accounts owned by the restaurant:

1. A verified Meta Business Portfolio for Al Gobbo di Rialto.
2. A Meta developer app with the WhatsApp product.
3. A WhatsApp Business Account (WABA), billing method, and dedicated business
   phone number.
4. A system user with the minimum permissions needed to send and manage
   WhatsApp messages. Use a long-lived system-user token, not a temporary test
   token.
5. Approved Utility templates in all website languages: `it`, `en_GB`, `fr`,
   `de`, and `es`.

Record the Phone Number ID and App Secret. Do not paste the access token into
source code, Git, a `VITE_*` variable, screenshots, or client-side settings.

## Supabase Function Secrets

Use the current Graph API version shown by Meta when the account is configured.
As of 2 September 2026, Meta has announced Graph API `v26.0`; the version stays
an environment value so it can be upgraded without changing booking code.

Required secrets:

```text
META_WHATSAPP_ACCESS_TOKEN=<long-lived system-user token>
META_WHATSAPP_PHONE_NUMBER_ID=<numeric Phone Number ID>
META_WHATSAPP_API_VERSION=v26.0
META_WHATSAPP_APP_SECRET=<Meta app secret>
META_WHATSAPP_VERIFY_TOKEN=<new random webhook verification value>
SITE_URL=https://www.ristorantealgobbodirialto.it
```

Optional template-name overrides (the shown names are the code defaults):

```text
META_WHATSAPP_TEMPLATE_RESERVATION_CONFIRMED=reservation_confirmed
META_WHATSAPP_TEMPLATE_RESERVATION_UPDATED=reservation_updated
META_WHATSAPP_TEMPLATE_RESERVATION_CANCELLED=reservation_cancelled
META_WHATSAPP_TEMPLATE_REMINDER_24H=reservation_reminder_24h
META_WHATSAPP_TEMPLATE_REMINDER_2H=reservation_reminder_2h
```

Upload values from an ignored local file so credentials are not written into
shell history:

```powershell
npx supabase secrets set --env-file .env.whatsapp.local
```

## Utility templates

Create each template under the **Utility** category and add translations for
all five language codes. Keep the parameter order unchanged.

### `reservation_confirmed`

Five body parameters: first name, date, time, number of guests, private booking
management URL.

```text
Ciao {{1}}, la tua prenotazione da Al Gobbo di Rialto è confermata per il {{2}}
alle {{3}}, per {{4}} ospiti. Puoi gestirla qui: {{5}}
Per interrompere i messaggi di servizio WhatsApp, rispondi STOP.
```

### `reservation_updated`

Five body parameters in the same order.

```text
Ciao {{1}}, la tua prenotazione da Al Gobbo di Rialto è stata aggiornata: {{2}}
alle {{3}}, per {{4}} ospiti. Puoi controllarla qui: {{5}}
Per interrompere i messaggi di servizio WhatsApp, rispondi STOP.
```

### `reservation_cancelled`

Three body parameters: first name, date, time.

```text
Ciao {{1}}, la prenotazione da Al Gobbo di Rialto del {{2}} alle {{3}} è stata
cancellata. Se desideri prenotare di nuovo visita il nostro sito.
```

### `reservation_reminder_24h`

Five body parameters in the same order as the confirmation.

```text
Ciao {{1}}, ti ricordiamo la prenotazione di domani, {{2}} alle {{3}}, per {{4}}
ospiti da Al Gobbo di Rialto. Gestisci la prenotazione: {{5}}
```

### `reservation_reminder_2h`

Five body parameters in the same order as the confirmation.

```text
Ciao {{1}}, il tuo tavolo da Al Gobbo di Rialto ti aspetta oggi, {{2}} alle
{{3}}, per {{4}} ospiti. Gestisci la prenotazione: {{5}}
```

Meta may request wording changes or reclassify a template during review. Update
the text in Meta without changing parameter order, or update the matching code
and tests together.

## Webhook

Deploy the external webhook without Supabase JWT verification because Meta does
not send a Supabase token. The function verifies Meta's
`X-Hub-Signature-256` HMAC before reading or writing data.

Webhook callback URL:

```text
https://vnbiyzomryhusdorvamj.supabase.co/functions/v1/meta-whatsapp-webhook
```

In the Meta App dashboard:

1. Set the callback URL above.
2. Enter the exact `META_WHATSAPP_VERIFY_TOKEN` value.
3. Subscribe the WABA to the `messages` webhook field.
4. Send a controlled test message and confirm it appears in the administrator
   WhatsApp inbox.

Deploy commands:

```powershell
npx supabase functions deploy send-whatsapp-notification send-whatsapp-reply --use-api
npx supabase functions deploy meta-whatsapp-webhook --no-verify-jwt --use-api
```

The public notification endpoint requires the project's API key and also checks
the reservation's private management token, consent, status, opt-out state,
feature flag, and idempotency key. The administrator reply endpoint requires the
project key plus an authenticated user whose `app_metadata.role` is `admin`.

## Activation checklist

- [ ] Restaurant-owned Meta business assets and payment method are complete.
- [ ] The dedicated number is registered and visible in WhatsApp Manager.
- [ ] Long-lived system-user token and minimum permissions are verified.
- [ ] Five template names and all required translations are approved.
- [ ] Supabase secrets are uploaded.
- [ ] Webhook verification succeeds and signed test events are stored.
- [ ] One controlled booking receives confirmation exactly once.
- [ ] Delivered and read states update in the administrator inbox.
- [ ] A customer reply opens the 24-hour window and an admin reply succeeds.
- [ ] Replying `STOP` prevents every later service message.
- [ ] Privacy wording and opt-in copy receive the restaurant's final approval.
- [ ] Only after all checks, enable `whatsapp_notifications` in the admin feature
      settings.

If the flag is disabled again, automated WhatsApp sends and admin replies stop;
webhook status/inbound processing remains available so delivery history is not
lost.
