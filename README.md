# Al Gobbo di Rialto

Sito e sistema di acquisizione/prenotazione per il ristorante Al Gobbo di
Rialto a Venezia. Il progetto include sito pubblico multilingua, landing SEO,
prenotazione e waitlist, tracciamento conversioni, pannello amministrativo e
comunicazioni email.

## Stack

- React 18, Vite, TypeScript, Tailwind CSS e Framer Motion
- Supabase Database/Auth con RLS e RPC pubbliche validate
- Supabase Edge Functions + Resend per email e promemoria programmati
- Supabase Edge Functions + Meta WhatsApp Cloud API per le comunicazioni WhatsApp

## Configurazione locale

Requisiti: Node.js 22 o successivo, npm e accesso al progetto Supabase.

```powershell
npm install
Copy-Item .env.example .env
```

Compilare `.env` con le sole variabili frontend `VITE_*` del proprio ambiente.
Email e WhatsApp vengono inviati dalle Supabase Edge Functions: i relativi
segreti server-side devono essere configurati come Supabase Function Secrets,
non nelle variabili del frontend, e non devono mai usare il prefisso `VITE_` né
essere committati.

Avvio locale:

```powershell
npm run dev
```

Il frontend usa direttamente le Edge Functions del progetto Supabase
configurato. `server.js` è conservato soltanto come implementazione Express
legacy e non è richiesto né dallo sviluppo corrente né dal deploy di
produzione.

## Controlli di qualità

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm audit --omit=dev --audit-level=high
```

## Sicurezza e dati

Il browser non legge direttamente prenotazioni, waitlist o messaggi di
contatto. I visitatori usano funzioni RPC validate per disponibilità,
prenotazione, waitlist, contatto e cancellazione tramite token. L’accesso
amministrativo richiede un utente autenticato con ruolo `admin` in
`app_metadata`.

Il file `.env` è ignorato e deve restare fuori da Git. Se un segreto è mai
apparso nella cronologia del repository, va revocato e sostituito: cancellare il
file in un commit successivo non è sufficiente.

## Promemoria e produzione

Le procedure per segreti, deploy delle Edge Functions, pianificazioni UTC/Roma
e verifica operativa sono in [docs/OPERATIONS.md](docs/OPERATIONS.md).

La configurazione di Google Business Profile, Google Ads, Meta/Instagram,
tracking UTM e dashboard marketing è descritta in
[docs/MARKETING_PLAYBOOK.md](docs/MARKETING_PLAYBOOK.md).

La struttura per conferme e conversazioni tramite Meta WhatsApp Cloud API,
inclusi consenso, modelli, webhook e attivazione, è descritta in
[docs/WHATSAPP_META_SETUP.md](docs/WHATSAPP_META_SETUP.md).

La separazione degli account cliente, i ruoli di Netawebs, la verifica
inserzionista, il modello di pagamento e il flusso di onboarding sono definiti
in [docs/NETAWEBS_AGENCY_MODEL.md](docs/NETAWEBS_AGENCY_MODEL.md).

## Comandi disponibili

| Comando | Scopo |
| --- | --- |
| `npm run dev` | Avvia Vite in sviluppo |
| `npm run build` | Crea la build di produzione |
| `npm run preview` | Mostra localmente la build |
| `npm run typecheck` | Controlla TypeScript |
| `npm run lint` | Esegue ESLint |
| `npm test` | Esegue test di sicurezza e fuso orario |
| `npm run images:optimize` | Ottimizza le immagini del sito |
| `npm run create-admin` | Crea il primo amministratore |
