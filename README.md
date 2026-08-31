# Al Gobbo di Rialto

Sito e sistema di acquisizione/prenotazione per il ristorante Al Gobbo di
Rialto a Venezia. Il progetto include sito pubblico multilingua, landing SEO,
prenotazione e waitlist, tracciamento conversioni, pannello amministrativo e
comunicazioni email.

## Stack

- React 18, Vite, TypeScript, Tailwind CSS e Framer Motion
- Supabase Database/Auth con RLS e RPC pubbliche validate
- Express + Resend per le conferme email
- Supabase Edge Functions per i promemoria programmati

## Configurazione locale

Requisiti: Node.js 22 o successivo, npm e accesso al progetto Supabase.

```powershell
npm install
Copy-Item .env.example .env
```

Compilare `.env` con i valori del proprio ambiente. Le sole variabili esposte
al browser sono quelle con prefisso `VITE_`. `RESEND_API_KEY` e
`SUPABASE_SERVICE_ROLE_KEY` sono segreti server-side e non devono mai usare quel
prefisso né essere committati.

Avvio locale:

```powershell
# Terminale 1: frontend
npm run dev

# Terminale 2: API email attendibile
node server.js
```

Per lo sviluppo locale impostare `VITE_API_BASE_URL=http://localhost:3000`.

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
