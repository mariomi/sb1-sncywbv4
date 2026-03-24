# Booking Widget — Al Gobbo di Rialto

A fully standalone HTML booking widget that can be embedded on any website via `<iframe>`. No React, no npm, no build step required.

## Features

- Fetches available time slots directly from Supabase REST API
- Respects closed dates and recurring closures
- Validates guest capacity per slot
- Prevents duplicate reservations
- Sends confirmation email (with cancellation link) after booking
- Fully responsive, mobile-friendly
- Venetian brand colors, no external CSS dependencies

## Embed via iframe

Add this snippet anywhere on your website:

```html
<iframe
  src="https://ristorantealgobbodirialto.it/widget/"
  width="100%"
  height="720"
  style="border:none; border-radius:16px; max-width:500px; display:block; margin:0 auto;"
  title="Prenota al Ristorante Al Gobbo di Rialto"
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

Also update `EMAIL_API` if the Express backend URL changes:

```js
const EMAIL_API = 'https://YOUR_BACKEND.onrender.com';
```

## Notes

- The widget uses the Supabase anonymous key, which is safe to expose in client-side code — Row Level Security (RLS) policies enforce access control at the database level.
- The widget does not require authentication — it uses the same public RLS policies as the main React app.
