# Ristorante Al Gobbo

Un'applicazione web completa per la gestione del "Ristorante Al Gobbo di Rialto", che include un sistema di prenotazione, visualizzazione del menu, e un pannello di amministrazione.

## 🚀 Funzionalità

### Lato Pubblico
*   **Home, Menu, Chi Siamo, Contatti**: Pagine informative con design reattivo.
*   **Prenotazioni**: Sistema di prenotazione tavoli con selezione di data, ora e numero di ospiti in tempo reale.
*   **Multilingua**: Supporto per diverse lingue.
*   **Temi**: Supporto per modalità chiara e scura.

### Pannello Amministrazione (Protetto)
*   **Dashboard**: Panoramica delle prenotazioni e statistiche.
*   **Gestione Prenotazioni**: Visualizza, approva o cancella le prenotazioni.
*   **Gestione Menu**: Modifica i piatti e le categorie del menu.
*   **Orari e Chiusure**: Gestione degli slot orari e delle chiusure straordinarie.
*   **Messaggi**: Visualizzazione dei messaggi inviati tramite il modulo di contatto.

## 🛠 Tech Stack

*   **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion.
*   **Routing**: React Router DOM.
*   **Database & Auth**: Supabase.
*   **Backend (Email Service)**: Express.js (Node.js) con Integrazione Resend.
*   **Icons**: Lucide React.
*   **Utils**: Date-fns, Zod, React Hot Toast.

## 📋 Prerequisiti

*   Node.js (v18 o superiore raccomandato)
*   npm o yarn
*   Account Supabase (per database e autenticazione)
*   Account Resend (per l'invio di email)

## ⚙️ Installazione e Setup

1.  **Clona il repository:**
    ```bash
    git clone <repository-url>
    cd sb1-sncywbv4
    ```

2.  **Installa le dipendenze:**
    ```bash
    npm install
    ```

3.  **Configura le Variabili d'Ambiente:**
    Crea un file `.env` nella root del progetto basato sulle seguenti variabili richieste:

    ```env
    VITE_SUPABASE_URL=la_tua_url_supabase
    VITE_SUPABASE_ANON_KEY=la_tua_chiave_anon_supabase
    VITE_RESEND_API_KEY=la_tua_chiave_api_resend
    ```

4.  **Configurazione Backend (Email):**
    Il file `server.js` gestisce l'invio delle email.
    *   **Nota Importante**: Attualmente, il file `src/lib/notifications.ts` punta a un URL di produzione (`https://sb1-sncywbv4.onrender.com/send-email`). Per lo sviluppo locale, dovrai modificare questo URL per puntare a `http://localhost:3000/send-email` o configurare il tuo ambiente di conseguenza.

## 🏃‍♂️ Avvio del Progetto

Il progetto richiede l'avvio sia del frontend (Vite) che del server backend (Express) per le email.

1.  **Avvia il Server Backend (per le email):**
    ```bash
    node server.js
    ```
    Il server partirà sulla porta 3000 (o quella definita in `PORT`).

2.  **Avvia il Frontend (in un nuovo terminale):**
    ```bash
    npm run dev
    ```
    Il frontend sarà accessibile solitamente su `http://localhost:5173`.

## 📂 Struttura del Progetto

*   `src/components`: Componenti UI riutilizzabili (Navbar, Forms, ecc.).
*   `src/pages`: Pagine principali dell'applicazione.
*   `src/lib`: Logica di business, configurazione Supabase, API client.
    *   `api.ts`: Funzioni per interagire con il database.
    *   `notifications.ts`: Logica per l'invio di email.
*   `server.js`: Server Express semplice per gestire l'invio sicuro di email tramite Resend.
*   `supabase/`: Configurazioni o migrazioni relative a Supabase.

## 🔐 Creazione Admin

Per creare un primo utente amministratore, puoi utilizzare lo script fornito:

```bash
npm run create-admin
```
Assicurati di controllare `src/scripts/createAdmin.ts` per configurare le credenziali desiderate o passare i parametri necessari.