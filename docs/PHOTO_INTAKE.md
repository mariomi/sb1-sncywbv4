# Foto sito — consegna e sostituzione

Questa scheda permette di inserire rapidamente le nuove foto senza perdere
qualità, rallentare il sito o usare lo stesso scatto in troppi punti.

## Selezione minima consigliata

Preparare almeno 12 foto originali, senza filtri o scritte:

- 3 orizzontali ampie per la copertina della home (sala, atmosfera, piatto forte)
- 4 verticali o quadrate di piatti per la galleria
- 2 foto della sala, luminose e senza persone riconoscibili in primo piano
- 1 esterno/ingresso utile anche per la pagina contatti
- 1 foto del team o del servizio per la pagina “Chi siamo”
- 1 foto orizzontale pulita per condivisioni social e Google

## Requisiti dei file

- Consegnare JPG/JPEG originali alla massima risoluzione disponibile.
- Non inviare screenshot, foto già compresse da WhatsApp o immagini con watermark.
- Mantenere i dati di orientamento originali; il sito produrrà copie WebP ottimizzate.
- Indicare, se necessario, quali persone non devono comparire online.

## Destinazioni nel sito

| Priorità | Punto del sito | Formato ideale |
| --- | --- | --- |
| 1 | Copertina home | orizzontale 16:9, soggetto leggibile anche al centro su mobile |
| 2 | Prenotazione | orizzontale, atmosfera accogliente e poco affollata |
| 3 | Cucina e galleria | verticale/quadrato, piatto intero e luce naturale |
| 4 | Chi siamo | orizzontale o verticale con sala/team |
| 5 | Contatti | esterno riconoscibile dall'ospite che arriva |

## Procedura tecnica

1. Copiare gli originali nelle cartelle `src/Img/G1` (locale e persone) oppure
   `src/Img/food` (piatti).
2. Eseguire `npm run images:optimize` per creare le versioni WebP.
3. Aggiornare copertina, pagine interne e galleria scegliendo immagini diverse.
4. Controllare il ritaglio sia a 390 px sia su desktop e verificare peso e build.
5. Pubblicare solo dopo approvazione visiva delle foto selezionate.
