# Modello operativo campagne Netawebs

Questo documento definisce la struttura con cui Netawebs crea e gestisce
campagne pubblicitarie per conto dei clienti. L'agenzia amministra il lavoro;
il cliente resta l'inserzionista finale, proprietario dei propri asset e dei
propri dati.

## Principi non negoziabili

- Un account pubblicitario distinto per ogni cliente finale. Non mischiare
  campagne, conversioni, pubblici, fatture o dati di aziende diverse.
- Netawebs accede come agenzia/partner; non usa l'identità del cliente come se
  fosse la propria e non verifica il cliente come Netawebs.
- Il soggetto pagatore dichiarato alle piattaforme deve coincidere con chi
  sostiene realmente la spesa media.
- Il cliente conserva almeno un accesso amministratore ai propri account e può
  terminare il mandato senza perdere campagne, storico o dati.
- Nessuna password, OTP o chiave API viene richiesta via email o chat. Gli
  accessi si concedono tramite invito, ruolo partner o account manager.
- Budget, annunci, claim, creatività e data di avvio richiedono approvazione
  registrata del cliente prima della pubblicazione.

Google richiede un account separato per ogni inserzionista finale e vieta di
verificare l'account del cliente come se fosse quello dell'agenzia:
[Google third-party policy](https://support.google.com/adspolicy/answer/6086450?hl=en).

## Struttura degli account

### Google

1. Netawebs possiede un Google Ads Manager Account (MCC), configurato come
   account che gestisce attività di terzi.
2. Ogni cliente possiede o riceve un account Google Ads figlio separato,
   collegato al MCC Netawebs.
3. GA4, Google Tag Manager, Search Console e Business Profile appartengono al
   cliente; Netawebs riceve il ruolo minimo sufficiente per lavorare.
4. Nella verifica inserzionista si dichiara che Netawebs è un'agenzia e si
   forniscono separatamente informazioni e documenti del cliente.
5. L'account figlio conserva paese, fuso orario e valuta corretti per il
   cliente. Questi dati non vanno scelti sulla base dell'agenzia.

Riferimenti:

- [Google Ads Manager Account](https://support.google.com/google-ads/answer/6139186?hl=en)
- [Attività richieste per la verifica inserzionista](https://support.google.com/adspolicy/answer/15577076?hl=en)
- [Informazioni visibili sul soggetto pagatore](https://support.google.com/adspolicy/answer/16189141?hl=en)

### Meta

1. Netawebs usa il proprio Business Portfolio come agenzia.
2. Pagina Facebook, profilo Instagram, account pubblicitario, Pixel/Dataset e
   dominio restano asset del Business Portfolio del cliente.
3. Il cliente assegna Netawebs come partner con i soli permessi necessari.
4. Pubblici, eventi, cataloghi e dati first-party non vengono condivisi tra
   clienti senza una base giuridica e un'autorizzazione specifiche.

## Modello di pagamento

Scelta predefinita consigliata:

- il cliente paga direttamente Google o Meta con il proprio profilo di
  pagamento;
- Netawebs fattura separatamente setup, gestione e creatività.

Questo mantiene separate spesa media e compenso dell'agenzia. Se invece
Netawebs anticipa la spesa e la riaddebita, il contratto deve indicare importi,
limiti, commissioni, imposte e responsabilità; la dichiarazione del pagatore
sulla piattaforma deve mostrare Netawebs quando questa è la realtà.

## Scheda decisionale obbligatoria per cliente

Prima di creare una campagna, registrare:

| Campo | Valore richiesto |
| --- | --- |
| Cliente/inserzionista | Ragione sociale e nome pubblico esatti |
| Referente autorizzato | Nome, ruolo ed email aziendale |
| Sito e dominio | URL verificato e proprietario del dominio |
| Obiettivo primario | Vendita, lead, telefonata, visita o prenotazione |
| Conversione primaria | Evento unico usato per offerte e reporting |
| Area e lingue | Località realmente servite e lingue delle landing |
| Budget | Limite giornaliero e mensile approvato |
| KPI economico | Costo massimo per risultato e valore medio |
| Pagatore | Cliente oppure Netawebs, conforme alla realtà |
| Account proprietario | ID degli account cliente e amministratore interno |
| Trattamento dati | Consenso, privacy, retention e accordi applicabili |
| Approvazione | Data, campagne, creatività e approvatore |

## Flusso di onboarding

1. Verificare identità, attività, sito, settore e affidabilità del cliente.
2. Firmare mandato, perimetro, budget, regole di approvazione e gestione dati.
3. Collegare gli asset cliente agli account manager Netawebs senza trasferire
   password.
4. Controllare verifica inserzionista, pagatore, fatturazione e restrizioni di
   settore.
5. Installare consenso e misurazione; testare una conversione senza dati
   personali nelle piattaforme pubblicitarie.
6. Preparare campagne in bozza e consegnare al cliente riepilogo di target,
   annunci, URL, budget e KPI.
7. Pubblicare soltanto dopo approvazione e metodo di pagamento attivo.
8. Monitorare spesa e conversioni; fornire almeno un report mensile con costi,
   clic, risultati e attività svolte.

## Regole di uscita

Alla cessazione del mandato Netawebs:

- interrompe nuove spese alla data concordata;
- consegna report ed elenco delle configurazioni;
- lascia gli asset negli account del cliente;
- rimuove i propri accessi quando richiesto;
- conserva o cancella gli export secondo contratto e normativa applicabile.

## Applicazione ad Al Gobbo di Rialto

- Conservare l'account Google Ads del ristorante e il suo storico; collegarlo
  al futuro MCC Netawebs invece di ricrearlo senza necessità.
- Prima di modificare la verifica già compilata, controllare le risposte su
  organizzazione, agenzia, D-U-N-S e soggetto pagatore.
- Dichiarare il ristorante come cliente/inserzionista finale e Netawebs come
  agenzia che opera per suo conto.
- Mantenere prenotazioni, conversioni e pubblici del ristorante isolati dagli
  altri clienti Netawebs.
- Non attivare budget finché `booking_completed`, consenso e attribuzione non
  sono verificati end-to-end.
