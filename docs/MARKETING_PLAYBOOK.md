# Playbook acquisizione clienti

Aggiornato al 31 agosto 2026. Questo documento traduce la roadmap originale in
attività eseguibili per Al Gobbo di Rialto. Il risultato principale da
ottimizzare è una prenotazione valida, non il numero di follower o di clic.

## North-star metric e regole

- Conversione primaria: `booking_completed`.
- KPI economico: costo per prenotazione confermata.
- KPI di qualità: ospiti per prenotazione, cancellazioni e prenotazioni
  completate.
- Non usare recensioni inventate, superlativi come “migliore ristorante” o
  dettagli su orari, piatti e offerte non confermati dal ristorante.
- Non inviare alle piattaforme nome, email, telefono, note o altre informazioni
  personali della prenotazione.

## 1. Fondazione di misurazione

Il sito registra già gli eventi:

- `view_menu`
- `click_book`
- `booking_started`
- `booking_completed`
- `click_phone`
- `click_map`
- `click_directions`
- `click_instagram`

### Configurazione account

1. Creare o collegare GA4 e Google Tag Manager.
2. Impostare `booking_completed` come key event in GA4.
3. In Google Ads creare una conversione sito per la prenotazione completata e
   renderla **Primary**. Le conversioni primarie incluse negli obiettivi
   dell'account vengono usate per report e ottimizzazione delle offerte;
   telefono, mappa, menu e inizio prenotazione devono restare **Secondary**
   finché non esiste una ragione documentata per ottimizzarli. Riferimento:
   [Google Ads — account-default conversion goals](https://support.google.com/google-ads/answer/4677036?hl=en).
4. Compilare in produzione `VITE_GTM_ID`, `VITE_GA4_ID`,
   `VITE_GOOGLE_ADS_ID`, `VITE_GOOGLE_ADS_CONVERSION_LABEL` e
   `VITE_META_PIXEL_ID`.
5. Verificare che i tag opzionali restino bloccati prima del consenso e che
   partano solo dopo la scelta del visitatore.
6. Eseguire una prenotazione controllata e verificare in Tag Assistant, GA4
   DebugView e Google Ads Diagnostics un solo `booking_completed`.

Il codice invia l'identificativo opaco della prenotazione come
`transaction_id`. Google raccomanda un ID univoco per evitare di conteggiare
due volte la stessa conversione; l'ID non deve contenere dati personali.
Riferimento: [Google Ads — transaction ID](https://support.google.com/google-ads/answer/6386790?hl=en&web=1).

### Convenzione UTM

Usare solo minuscole e underscore. La denominazione è case-sensitive: valori
come `Google` e `google` creano righe distinte. Google raccomanda di valorizzare
in modo coerente almeno sorgente, mezzo e campagna, oltre a `utm_id` quando
disponibile. Riferimento:
[GA4 — campaign URLs](https://support.google.com/analytics/answer/10917952?hl=en).

| Campo | Regola | Esempio |
| --- | --- | --- |
| `utm_source` | piattaforma | `google`, `instagram`, `facebook`, `thefork` |
| `utm_medium` | tipo di traffico | `cpc`, `paid_social`, `organic`, `referral` |
| `utm_campaign` | obiettivo + intento + lingua | `search_rialto_en` |
| `utm_id` | ID stabile della piattaforma | ID campagna Google o Meta |
| `utm_term` | keyword paid search | `{keyword}` |
| `utm_content` | variante creativa | `rsa_tradition_a`, `reel_bigoli_01` |
| `utm_source_platform` | piattaforma di acquisto | `google_ads`, `meta_ads` |
| `utm_creative_format` | formato | `search`, `reel`, `story` |
| `utm_marketing_tactic` | tattica | `prospecting`, `remarketing` |

Non modificare o rimuovere `gclid`, `gbraid`, `wbraid`, `fbclid` e `ttclid`:
il sito li conserva nell'attribuzione quando il consenso lo consente.

## 2. Google Business Profile

Google consente ai ristoranti di gestire menu, fotografie, post, recensioni e
metriche specifiche. Il profilo deve essere aggiornato dall'account verificato;
non applicare categorie o attributi senza controllare che descrivano davvero il
locale. Riferimento:
[Business Profile per ristoranti](https://support.google.com/business/answer/14189260?hl=en-6).

### Checklist una tantum

- Verificare nome, indirizzo `San Polo 649, Venezia`, telefono, sito e orari.
- Verificare categoria primaria e categorie secondarie disponibili nel profilo.
- Inserire descrizione coerente con: cucina veneziana, tradizione dal 1955,
  zona Rialto, pesce e pizza. Non fare keyword stuffing.
- Impostare il link diretto alla prenotazione come link preferito. Google
  permette più link per categoria e consente di indicarne uno come preferito:
  [gestione link locali](https://support.google.com/business/answer/6218037?hl=en).
- Inserire menu strutturato con sezioni, descrizioni e prezzi solo dopo il
  controllo del ristorante; gli aggiornamenti possono richiedere 24–48 ore:
  [menu editor](https://support.google.com/business/answer/9455840?hl=en).
- Caricare fotografie professionali divise tra esterno/ingresso, sala,
  esperienza e piatti. Evitare doppioni e immagini non rappresentative.
- Controllare e rimuovere, quando possibile, link di prenotazione di terze parti
  non desiderati.

### Link tracciati

| Posizione | URL |
| --- | --- |
| Sito | `https://www.ristorantealgobbodirialto.it/?utm_source=google&utm_medium=organic&utm_campaign=gbp_website&utm_content=profile` |
| Menu | `https://www.ristorantealgobbodirialto.it/menu?utm_source=google&utm_medium=organic&utm_campaign=gbp_menu&utm_content=profile` |
| Prenotazione | `https://www.ristorantealgobbodirialto.it/book?utm_source=google&utm_medium=organic&utm_campaign=gbp_booking&utm_content=preferred_link` |

### Routine settimanale e mensile

- Ogni settimana: rispondere alle nuove recensioni, pubblicare un aggiornamento
  utile e controllare foto/orari eccezionali.
- Ogni mese: esportare ricerche, visualizzazioni, clic sito, chiamate,
  indicazioni e clic al menu. Queste sono metriche disponibili nella sezione
  Performance del profilo verificato:
  [Business Profile performance](https://support.google.com/business/answer/9918094?hl=en).
- Registrare i dati aggregati in `/admin/stats` con canale
  `google_business`; non inserire dati personali dei recensori.

## 3. Google Ads Search

Non aumentare il budget finché la conversione primaria non è verificata. Le
prime campagne devono separare brand, intento e lingua.

### Struttura iniziale

| Campagna | Intento | Landing |
| --- | --- | --- |
| `search_brand_all` | nome ristorante e varianti | `/` o `/book` |
| `search_rialto_en` | restaurant near Rialto / Rialto Bridge | `/restaurant-near-rialto?lang=en` |
| `search_venetian_en` | Venetian restaurant / authentic Venetian food | `/venetian-restaurant-venice?lang=en` |
| `search_seafood_en` | seafood restaurant Rialto/Venice | `/seafood-restaurant-rialto?lang=en` |
| `search_rialto_it` | ristorante vicino Rialto | `/restaurant-near-rialto?lang=it` |

Francese, tedesco e spagnolo partono solo dopo che termini di ricerca e volume
mostrano domanda sufficiente. Ogni gruppo annunci deve avere un tema stretto;
Google raccomanda gruppi coerenti e annunci strettamente collegati alle keyword:
[rilevanza degli annunci Search](https://support.google.com/google-ads/answer/14998307?hl=en).

### Geografia

Separare due ipotesi:

1. **In-destination**: visitatori già a Venezia, con target geografico locale e
   query ad alta urgenza come “near me” o “near Rialto”.
2. **Trip planning**: mercati di origine prioritari, ma solo per query che
   includono chiaramente Venezia/Rialto e con landing nella lingua corretta.

Non mischiare i due gruppi: costi e comportamento sono diversi. Il targeting
geografico usa più segnali e non è accurato al 100%, quindi va controllato dal
report Località:
[Google Ads — location targeting](https://support.google.com/google-ads/answer/1722043?hl=en).

### Keyword e negative iniziali

Partire con exact e phrase per ottenere dati leggibili. Valutare broad match
solo quando conversioni e termini di ricerca sono affidabili.

Temi iniziali:

- `restaurant near rialto bridge`
- `venetian restaurant venice`
- `authentic venetian restaurant`
- `seafood restaurant rialto`
- `where to eat near rialto`
- `ristorante vicino ponte di rialto`

Negative seed da convalidare sul report reale:

- lavoro, jobs, stipendio
- ricetta, recipe, come fare
- delivery, take away, domicilio, se non realmente offerti
- economico, cheap, all you can eat, se incoerenti con il posizionamento
- hotel, museo, parcheggio

Le corrispondenze exact, phrase e broad hanno coperture sovrapposte e basate
anche sul significato della ricerca; per questo il report dei termini va
revisionato almeno due volte a settimana nel lancio:
[Google Ads — keyword matching](https://support.google.com/google-ads/answer/14996023?hl=en).

### Annunci responsive

Preparare almeno due varianti per gruppo, senza ripetere la stessa frase. Google
raccomanda headline numerose e un messaggio coerente con la landing:
[responsive search ads](https://support.google.com/google-ads/answer/6167122?hl=en).

Headline seed da adattare ai limiti della piattaforma:

- Venetian Dining Near Rialto
- Book a Table in Venice
- Authentic Venetian Cuisine
- Steps from Rialto Bridge
- A Venice Tradition Since 1955
- Seafood and Venetian Recipes
- Explore Our Menu
- Reserve Direct on Our Website
- Al Gobbo di Rialto
- Lunch and Dinner in Venice

Description seed:

- Discover Venetian flavours near Rialto. Explore the menu and reserve your
  table directly online.
- A family restaurant in San Polo with a story dating to 1955. Check
  availability for lunch or dinner.
- Seafood, Venetian recipes and pizza in the Rialto district. View the menu
  before you book.
- Planning where to eat in Venice? See the location, menu and available times
  in one place.

Prima della pubblicazione verificare nuovamente orari, giorni di chiusura,
prezzi, disponibilità dei piatti e qualsiasi premio citato.

### Ottimizzazione

- `booking_completed`: Primary, conteggio “One”.
- Telefono, indicazioni, menu e inizio prenotazione: Secondary.
- Prima settimana: controllo giornaliero di termini, errori URL e conversioni.
- Settimane successive: due controlli termini/settimana e revisione settimanale
  di costo per prenotazione per campagna e lingua.
- Non decidere su CTR da solo: landing e costo per prenotazione hanno priorità.

## 4. Meta e Instagram

### Pilastri creativi

| Pilastro | Contenuto | CTA |
| --- | --- | --- |
| Food | piatto, ingrediente, preparazione | Guarda il menu |
| Story | storia dal 1955 e famiglia | Scopri la storia |
| Venice | Rialto, calli, percorso verso il locale | Trova il ristorante |
| People | staff e accoglienza | Vieni a conoscerci |
| Experience | sala, tavolo, servizio, atmosfera | Prenota un tavolo |
| Social proof | sintesi prudente di feedback verificati | Leggi e prenota |

### Calendario test di quattro settimane

- Lunedì: carosello o fotografia editoriale.
- Mercoledì: Reel 9:16 da 10–25 secondi.
- Venerdì: esperienza/atmosfera con CTA prenotazione.
- Stories: disponibilità, backstage e percorso Rialto → ristorante, senza
  creare urgenza artificiale.

Settimana 1: piatto iconico, ingresso da Rialto, storia dal 1955.

Settimana 2: mercato/ingredienti, staff, atmosfera serale.

Settimana 3: ricetta veneziana, percorso pedonale, recensioni verificate.

Settimana 4: pizza o piatto di terra, famiglia, invito alla prenotazione.

### Campagne

1. Prospecting video/foto verso le landing di intento.
2. Remarketing di visitatori, lettori menu e `booking_started` che non hanno
   completato.
3. Esclusione dei `booking_completed` recenti dalle campagne di acquisizione;
   potranno entrare solo in comunicazioni post-visita con base giuridica e
   consenso adeguati.

Il sito invia l'evento standard Meta `Schedule` solo dopo una prenotazione
completata e solo con consenso marketing. La documentazione Meta completa può
richiedere accesso autenticato al Business Manager: verificare in Events
Manager che browser event, dominio e deduplicazione siano corretti prima di
attivare budget.

## 5. Dashboard marketing

La pagina privata `/admin/stats` combina:

- prenotazioni e ospiti dal database;
- attribuzione last-touch UTM/click ID;
- spesa, impression, clic, sessioni e ricavi aggregati inseriti dagli export;
- CTR, CPC, tasso di conversione, costo per prenotazione e ROAS.

### Importazione manuale iniziale

1. Selezionare lo stesso intervallo in Google Ads/Meta/GBP e nella dashboard.
2. Inserire una riga per data, canale e campagna.
3. Usare lo stesso nome minuscolo presente in `utm_campaign`.
4. Inserire `revenue_eur` solo quando proviene da un dato reale e riconciliato,
   non da una stima non dichiarata.
5. Se una piattaforma non fornisce impression o sessioni, lasciare `0`; la
   dashboard mostrerà la metrica derivata come non disponibile.

Una seconda fase potrà automatizzare gli import tramite API di Google Ads,
GA4 e Meta, ma richiede accessi OAuth, autorizzazioni dell'account e una
decisione sulla granularità dei dati.

## 6. Piano di lancio 30 giorni

### Prima del giorno 1

- Ruotare la chiave Resend esposta nella cronologia Git.
- Configurare e verificare email, GA4/GTM, Ads, Meta Pixel e consenso.
- Verificare orari, menu, immagini e link Business Profile.
- Eseguire prenotazione test completa su mobile e desktop.

### Giorni 1–7

- Pubblicare profilo e link tracciati.
- Avviare solo brand e una campagna non-brand inglese ad alta intenzione.
- Pubblicare i primi tre contenuti organici.
- Controllare quotidianamente conversioni, termini di ricerca ed errori.

### Giorni 8–14

- Aggiungere i cluster Rialto/veneziano/seafood solo se il tracking è sano.
- Avviare un piccolo test Meta prospecting e il remarketing.
- Inserire i primi export aggregati nella dashboard.

### Giorni 15–30

- Spostare budget verso campagne con prenotazioni reali e costo sostenibile.
- Fermare query e creatività senza segnale utile.
- Confrontare lingue, landing e dispositivi.
- Presentare al ristorante prenotazioni, ospiti, spesa e costo per prenotazione,
  separando dati osservati da ipotesi.

## 7. Accessi necessari per l'esecuzione sugli account

- Google Business Profile: ruolo proprietario o manager.
- GA4 e GTM: ruolo editor/publisher adeguato.
- Google Ads: accesso standard o amministratore.
- Meta Business Manager, pagina Instagram, Pixel/Dataset: ruolo appropriato.
- Dominio/DNS e hosting: accesso per configurare variabili e verifiche.
- Dati economici: regola concordata per ricavo attribuito e costo massimo per
  prenotazione.

Senza questi accessi il repository, la dashboard e i playbook sono pronti, ma
non devono essere pubblicate campagne né modificate proprietà esterne.
