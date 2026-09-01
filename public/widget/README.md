# Booking Widget — Al Gobbo di Rialto

A fully standalone HTML booking widget that can be embedded on any website via `<iframe>`. No React, no npm, no build step required.

## Features

- Fetches available time slots directly from Supabase REST API
- Respects closed dates and recurring closures
- Validates guest capacity per slot
- Prevents duplicate reservations
- Sends the confirmation email (with cancellation link) through the existing Supabase Edge Function
- Reads `online_reservations` before enabling the form and checks it again before booking; errors fail closed
- Uses the `Europe/Rome` calendar for the minimum and maximum booking dates
- Fully responsive, mobile-friendly controls (16px fields on phones)
- Light and dark appearance that follows the visitor's system setting
- Italian, English, French, German, and Spanish interface
- Venetian brand colors, no external CSS dependencies

## Embed via iframe

Add this snippet anywhere on your website:

```html
<iframe
  src="https://ristorantealgobbodirialto.it/widget/"
  width="100%"
  height="720"
  style="border:none; border-radius:16px; max-width:520px; display:block; margin:0 auto;"
  title="Prenota al Ristorante Al Gobbo di Rialto"
  loading="lazy"
></iframe>
```

The widget automatically uses the visitor's browser language when it is one of the five supported languages. Visitors can also switch language from the widget header. To choose it from the embed URL, add `?lang=it`, `?lang=en`, `?lang=fr`, `?lang=de`, or `?lang=es`, for example:

```html
<iframe
  src="https://ristorantealgobbodirialto.it/widget/?lang=en"
  width="100%"
  height="720"
  style="border:none; border-radius:16px; max-width:520px; display:block; margin:0 auto;"
  title="Book a table at Al Gobbo di Rialto"
  loading="lazy"
></iframe>
```

## Use cases

- Third-party hotel websites linking to the restaurant
- Partner tour operators
- Embedded booking on external landing pages
- Google Sites or similar no-code platforms

## Updating credentials

If the Supabase project changes, update the two constants at the top of `index.html`:

```js
const SUPABASE_URL      = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

## Notes

- The widget uses the Supabase anonymous key, which is safe to expose in client-side code — Row Level Security (RLS) policies enforce access control at the database level.
- Never put a `service_role` key or any other server secret in this file. The browser calls the deployed `send-reservation-confirmation` Edge Function with the client-safe anonymous key; email-provider credentials stay inside the function.
- The Edge Function must allow the production widget origin in its CORS configuration. When embedded in an iframe, requests originate from the domain serving the widget, not from the partner page around it.
- The widget does not require authentication — it uses the same public RLS policies as the main React app.
