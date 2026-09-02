import { Cookie, Database, Download, Mail, Scale, Shield, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import { useLanguage, type Language } from '../lib/i18n';
import { restaurantLegalIdentity } from '../lib/legal';

type PrivacyCopy = {
  title: string;
  description: string;
  kicker: string;
  updated: string;
  controllerTitle: string;
  controllerText: string;
  contactText: string;
  dataTitle: string;
  dataItems: string[];
  basisTitle: string;
  basisItems: string[];
  cookieTitle: string;
  cookieText: string;
  storageTitle: string;
  storageRows: Array<[string, string, string]>;
  providerTitle: string;
  providerText: string;
  transferText: string;
  retentionTitle: string;
  retentionItems: string[];
  rightsTitle: string;
  rightsText: string;
  complaintText: string;
  choicesTitle: string;
  choicesText: string;
  settings: string;
  legal: string;
};

const privacyCopy: Record<Language, PrivacyCopy> = {
  it: {
    title: 'Informativa privacy e cookie', description: 'Come Al Gobbo di Rialto tratta i dati di prenotazione, contatto e navigazione e come gestire le preferenze cookie.', kicker: 'Privacy · Trasparenza', updated: 'Ultimo aggiornamento: 2 settembre 2026',
    controllerTitle: 'Titolare del trattamento', controllerText: 'Il titolare del trattamento dei dati raccolti dal sito e dal servizio di prenotazione è', contactText: 'Per richieste privacy è possibile scrivere tramite il modulo contatti, telefonare o inviare una comunicazione alla sede legale indicata sopra.',
    dataTitle: 'Dati trattati e finalità', dataItems: ['Prenotazioni e lista d’attesa: nome, email, telefono, data, ora, numero di ospiti, stato e informazioni facoltative, per registrare e gestire la richiesta, inviare conferme e promemoria e fornire assistenza.', 'Contatti: nome, email, oggetto e messaggio, per rispondere alla richiesta.', 'Dati tecnici e di sicurezza: orari delle richieste, indirizzo di rete, log e informazioni sul dispositivo, nella misura necessaria a proteggere il sito, prevenire abusi e diagnosticare errori.', 'Dati di navigazione e campagna: pagine, interazioni e parametri promozionali, soltanto dopo il consenso alla categoria corrispondente, per misurazione e pubblicità.', 'Consenso marketing: scelta facoltativa e relativa prova, per eventuali comunicazioni su offerte, eventi e novità.'],
    basisTitle: 'Basi giuridiche e conferimento', basisItems: ['Esecuzione di misure richieste dall’utente e del servizio di prenotazione (art. 6.1.b GDPR).', 'Obblighi di legge applicabili al gestore (art. 6.1.c GDPR).', 'Legittimo interesse alla sicurezza, continuità del servizio e tutela dei diritti, bilanciato con i diritti degli utenti (art. 6.1.f GDPR).', 'Consenso revocabile per analisi, pubblicità e comunicazioni marketing facoltative (art. 6.1.a GDPR).'],
    cookieTitle: 'Cookie e strumenti di memorizzazione', cookieText: 'Il sito usa memorie tecniche per lingua, tema e prova delle scelte. Google Analytics, Google Tag Manager, Google Ads e Meta Pixel possono essere caricati solo dopo il consenso alla relativa categoria. I dati inseriti nella prenotazione non vengono inviati a tali strumenti.', storageTitle: 'Memoria · finalità · durata',
    storageRows: [['al-gobbo-language / theme', 'Preferenze tecniche di lingua e aspetto', 'Fino alla cancellazione dal browser'], ['al-gobbo-consent-v1', 'Prova delle scelte privacy', '6 mesi'], ['al-gobbo-attribution-v1', 'Attribuzione della campagna, solo con consenso analitico', 'Durata della sessione'], ['Google / Meta', 'Analisi e pubblicità, solo con consenso', 'Secondo configurazione e informative dei fornitori']],
    providerTitle: 'Destinatari e trasferimenti', providerText: 'I dati possono essere trattati, per quanto necessario, da personale autorizzato e fornitori contrattualmente incaricati: Supabase per database e autenticazione, Resend per email transazionali, Netlify per hosting e distribuzione, fornitori di assistenza tecnica e, solo con consenso, Google e Meta per misurazione o pubblicità.', transferText: 'Alcuni fornitori possono trattare dati fuori dallo Spazio economico europeo. In tal caso il trasferimento deve basarsi su una decisione di adeguatezza o su garanzie appropriate, incluse le clausole contrattuali standard, secondo le condizioni applicabili del fornitore e le verifiche del titolare.',
    retentionTitle: 'Conservazione', retentionItems: ['Prenotazioni e comunicazioni sono conservate per gestire il servizio e, successivamente, solo finché necessario per obblighi di legge, contestazioni o tutela dei diritti.', 'I messaggi di contatto sono conservati fino alla gestione della richiesta e all’eventuale seguito compatibile.', 'Il consenso marketing vale fino alla revoca; le preferenze cookie vengono richieste nuovamente dopo sei mesi o quando cambia in modo rilevante il trattamento.', 'I log tecnici seguono i tempi strettamente necessari alla sicurezza e quelli operativi dei fornitori. Al termine, i dati sono cancellati o anonimizzati quando possibile.'],
    rightsTitle: 'Diritti dell’interessato', rightsText: 'Nei casi previsti è possibile chiedere accesso, rettifica, cancellazione, limitazione, portabilità e opposizione. Il consenso può essere revocato in qualsiasi momento senza pregiudicare i trattamenti già effettuati. Non vengono adottate decisioni esclusivamente automatizzate con effetti giuridici sull’utente.', complaintText: 'È inoltre possibile proporre reclamo al Garante per la protezione dei dati personali.',
    choicesTitle: 'Gestire le scelte', choicesText: 'Rifiutare gli strumenti facoltativi non impedisce di consultare il sito o prenotare. Le categorie sono disattivate per impostazione predefinita e possono essere modificate in qualsiasi momento.', settings: 'Rivedi le scelte cookie', legal: 'Note legali e condizioni di prenotazione',
  },
  en: {
    title: 'Privacy and cookie notice', description: 'How Al Gobbo di Rialto processes booking, contact and browsing data and how to manage cookie choices.', kicker: 'Privacy · Transparency', updated: 'Last updated: 2 September 2026',
    controllerTitle: 'Data controller', controllerText: 'The controller of personal data collected through the website and booking service is', contactText: 'For privacy requests, use the contact form, call the restaurant or write to the registered office shown above.',
    dataTitle: 'Data and purposes', dataItems: ['Bookings and waitlist: name, email, phone, date, time, party size, status and optional details, to register and manage the request, send confirmations and reminders, and provide assistance.', 'Contact requests: name, email, subject and message, to answer the request.', 'Technical and security data: request times, network address, logs and device information, as needed to secure the service, prevent abuse and diagnose errors.', 'Browsing and campaign data: pages, interactions and promotional parameters, only after consent to the relevant category, for measurement and advertising.', 'Marketing choice: the optional preference and its record, for possible news about offers and events.'],
    basisTitle: 'Legal bases and required data', basisItems: ['Steps requested by the user and performance of the booking service (Article 6(1)(b) GDPR).', 'Legal obligations applying to the operator (Article 6(1)(c) GDPR).', 'Legitimate interests in security, service continuity and protection of legal rights, balanced against users’ rights (Article 6(1)(f) GDPR).', 'Withdrawable consent for optional analytics, advertising and marketing communications (Article 6(1)(a) GDPR).'],
    cookieTitle: 'Cookies and storage tools', cookieText: 'The site uses technical storage for language, theme and evidence of choices. Google Analytics, Google Tag Manager, Google Ads and Meta Pixel can load only after consent to the relevant category. Booking form data is not sent to these tools.', storageTitle: 'Storage · purpose · duration',
    storageRows: [['al-gobbo-language / theme', 'Technical language and appearance preferences', 'Until deleted in the browser'], ['al-gobbo-consent-v1', 'Evidence of privacy choices', '6 months'], ['al-gobbo-attribution-v1', 'Campaign attribution, with analytics consent only', 'Current session'], ['Google / Meta', 'Analytics and advertising, with consent only', 'Provider settings and notices']],
    providerTitle: 'Recipients and transfers', providerText: 'Where necessary, data may be handled by authorised staff and contracted providers: Supabase for database and authentication, Resend for transactional email, Netlify for hosting and delivery, technical support providers and, with consent only, Google and Meta for measurement or advertising.', transferText: 'Some providers may process data outside the European Economic Area. Transfers then rely on an adequacy decision or appropriate safeguards, including standard contractual clauses, as declared by the provider and assessed by the controller.',
    retentionTitle: 'Retention', retentionItems: ['Booking records and communications are kept to provide the service and then only for as long as needed for legal duties, disputes or protection of rights.', 'Contact messages are kept until the request and any compatible follow-up have been handled.', 'Marketing consent lasts until withdrawal; cookie choices are requested again after six months or when processing changes materially.', 'Technical logs follow security needs and providers’ operational retention. Data is then deleted or anonymised where possible.'],
    rightsTitle: 'Your rights', rightsText: 'Where applicable, you may request access, correction, deletion, restriction, portability or object to processing. Consent may be withdrawn at any time without affecting earlier lawful processing. No solely automated decision with legal effects is made about visitors.', complaintText: 'You may also lodge a complaint with the Italian Data Protection Authority.',
    choicesTitle: 'Manage choices', choicesText: 'Rejecting optional tools does not prevent browsing or booking. Optional categories are off by default and may be changed at any time.', settings: 'Review cookie choices', legal: 'Legal notice and booking terms',
  },
  fr: {
    title: 'Politique de confidentialité et cookies', description: 'Traitement des données de réservation, contact et navigation par Al Gobbo di Rialto et gestion des cookies.', kicker: 'Confidentialité · Transparence', updated: 'Dernière mise à jour : 2 septembre 2026',
    controllerTitle: 'Responsable du traitement', controllerText: 'Le responsable des données collectées via le site et le service de réservation est', contactText: 'Pour toute demande, utilisez le formulaire de contact, appelez le restaurant ou écrivez au siège indiqué ci-dessus.',
    dataTitle: 'Données et finalités', dataItems: ['Réservation et liste d’attente : identité, coordonnées, date, heure, nombre de personnes, statut et informations facultatives, pour gérer la demande, envoyer confirmations et rappels et fournir une assistance.', 'Demandes de contact : nom, e-mail, objet et message, pour répondre.', 'Données techniques et de sécurité : horaires, adresse réseau, journaux et appareil, pour protéger le service, prévenir les abus et diagnostiquer les erreurs.', 'Navigation et campagne : pages, interactions et paramètres promotionnels, uniquement après consentement, pour la mesure et la publicité.', 'Choix marketing facultatif et sa preuve, pour d’éventuelles communications sur offres et événements.'],
    basisTitle: 'Bases juridiques et fourniture', basisItems: ['Mesures demandées et exécution du service de réservation (art. 6.1.b RGPD).', 'Obligations légales de l’exploitant (art. 6.1.c RGPD).', 'Intérêt légitime à la sécurité, à la continuité et à la défense des droits (art. 6.1.f RGPD).', 'Consentement révocable pour analyse, publicité et marketing facultatifs (art. 6.1.a RGPD).'],
    cookieTitle: 'Cookies et stockage', cookieText: 'Le site utilise des mémoires techniques pour la langue, le thème et la preuve des choix. Google Analytics, Tag Manager, Ads et Meta Pixel ne peuvent être chargés qu’après consentement. Les données de réservation ne leur sont pas envoyées.', storageTitle: 'Mémoire · finalité · durée', storageRows: [['al-gobbo-language / theme', 'Préférences techniques', 'Jusqu’à suppression du navigateur'], ['al-gobbo-consent-v1', 'Preuve des choix', '6 mois'], ['al-gobbo-attribution-v1', 'Attribution avec consentement analytique', 'Session'], ['Google / Meta', 'Analyse et publicité avec consentement', 'Selon les paramètres des fournisseurs']],
    providerTitle: 'Destinataires et transferts', providerText: 'Les données peuvent être traitées par le personnel autorisé et les prestataires nécessaires : Supabase, Resend, Netlify, assistance technique et, uniquement avec consentement, Google et Meta.', transferText: 'Certains prestataires peuvent traiter les données hors EEE sur la base d’une décision d’adéquation ou de garanties appropriées, notamment les clauses contractuelles types.',
    retentionTitle: 'Conservation', retentionItems: ['Les réservations et communications sont conservées pour le service puis uniquement selon les obligations légales, litiges ou défense des droits.', 'Les messages sont conservés jusqu’au traitement de la demande et de son suivi compatible.', 'Le consentement marketing vaut jusqu’au retrait ; les choix cookie sont redemandés après six mois ou en cas de changement important.', 'Les journaux techniques suivent les besoins de sécurité, puis les données sont supprimées ou anonymisées si possible.'],
    rightsTitle: 'Vos droits', rightsText: 'Selon le cas, vous pouvez demander accès, rectification, effacement, limitation, portabilité ou opposition. Le consentement peut être retiré à tout moment. Aucune décision exclusivement automatisée produisant des effets juridiques n’est prise.', complaintText: 'Vous pouvez aussi saisir l’autorité italienne de protection des données.',
    choicesTitle: 'Gérer les choix', choicesText: 'Refuser les outils facultatifs n’empêche ni la navigation ni la réservation. Ils sont désactivés par défaut et modifiables à tout moment.', settings: 'Revoir les choix cookie', legal: 'Mentions légales et conditions de réservation',
  },
  de: {
    title: 'Datenschutz- und Cookie-Hinweise', description: 'Wie Al Gobbo di Rialto Reservierungs-, Kontakt- und Nutzungsdaten verarbeitet und Cookie-Einstellungen verwaltet werden.', kicker: 'Datenschutz · Transparenz', updated: 'Letzte Aktualisierung: 2. September 2026',
    controllerTitle: 'Verantwortlicher', controllerText: 'Verantwortlicher für die über Website und Reservierung erhobenen Daten ist', contactText: 'Datenschutzanfragen können über das Kontaktformular, telefonisch oder schriftlich an den oben genannten Sitz gestellt werden.',
    dataTitle: 'Daten und Zwecke', dataItems: ['Reservierung und Warteliste: Name, E-Mail, Telefon, Datum, Uhrzeit, Personenzahl, Status und freiwillige Angaben zur Verwaltung, Bestätigung, Erinnerung und Unterstützung.', 'Kontakt: Name, E-Mail, Betreff und Nachricht zur Beantwortung.', 'Technik und Sicherheit: Anfragezeiten, Netzwerkadresse, Protokolle und Gerätedaten zum Schutz, zur Missbrauchsprävention und Fehlerdiagnose.', 'Nutzung und Kampagnen: Seiten, Interaktionen und Werbeparameter nur nach Einwilligung für Messung und Werbung.', 'Freiwillige Marketingauswahl und Nachweis für mögliche Mitteilungen zu Angeboten und Veranstaltungen.'],
    basisTitle: 'Rechtsgrundlagen und Bereitstellung', basisItems: ['Angeforderte Maßnahmen und Reservierungsleistung (Art. 6 Abs. 1 lit. b DSGVO).', 'Gesetzliche Pflichten (Art. 6 Abs. 1 lit. c DSGVO).', 'Berechtigte Interessen an Sicherheit, Kontinuität und Rechtsverteidigung (Art. 6 Abs. 1 lit. f DSGVO).', 'Widerrufliche Einwilligung für optionale Analyse, Werbung und Marketing (Art. 6 Abs. 1 lit. a DSGVO).'],
    cookieTitle: 'Cookies und Speicher', cookieText: 'Technischer Speicher dient Sprache, Darstellung und Nachweis der Auswahl. Google Analytics, Tag Manager, Ads und Meta Pixel laden nur nach Einwilligung. Reservierungsdaten werden nicht an diese Tools gesendet.', storageTitle: 'Speicher · Zweck · Dauer', storageRows: [['al-gobbo-language / theme', 'Technische Einstellungen', 'Bis zur Löschung im Browser'], ['al-gobbo-consent-v1', 'Nachweis der Auswahl', '6 Monate'], ['al-gobbo-attribution-v1', 'Kampagnenzuordnung mit Analyse-Einwilligung', 'Sitzung'], ['Google / Meta', 'Analyse und Werbung mit Einwilligung', 'Laut Anbieter-Einstellungen']],
    providerTitle: 'Empfänger und Übermittlungen', providerText: 'Daten können durch befugtes Personal und notwendige Auftragsverarbeiter verarbeitet werden: Supabase, Resend, Netlify, technischer Support und nur mit Einwilligung Google und Meta.', transferText: 'Einige Anbieter verarbeiten möglicherweise außerhalb des EWR. Dann gelten Angemessenheitsbeschlüsse oder geeignete Garantien, insbesondere Standardvertragsklauseln.',
    retentionTitle: 'Speicherdauer', retentionItems: ['Reservierungen und Kommunikation bleiben für die Leistung und danach nur wegen gesetzlicher Pflichten, Streitigkeiten oder Rechtsverteidigung gespeichert.', 'Kontaktanfragen bis zur Erledigung und einem damit vereinbaren Folgekontakt.', 'Marketing bis zum Widerruf; Cookie-Auswahl sechs Monate oder bis zu einer wesentlichen Änderung.', 'Technische Protokolle nach Sicherheitsbedarf; anschließend Löschung oder Anonymisierung, soweit möglich.'],
    rightsTitle: 'Ihre Rechte', rightsText: 'Soweit anwendbar bestehen Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Übertragbarkeit und Widerspruch. Einwilligungen sind jederzeit widerrufbar. Es erfolgen keine ausschließlich automatisierten Entscheidungen mit Rechtswirkung.', complaintText: 'Sie können sich außerdem bei der italienischen Datenschutzbehörde beschweren.',
    choicesTitle: 'Auswahl verwalten', choicesText: 'Die Ablehnung optionaler Tools verhindert weder Nutzung noch Reservierung. Sie sind standardmäßig aus und jederzeit änderbar.', settings: 'Cookie-Auswahl prüfen', legal: 'Impressum und Reservierungsbedingungen',
  },
  es: {
    title: 'Política de privacidad y cookies', description: 'Cómo Al Gobbo di Rialto trata datos de reserva, contacto y navegación y cómo gestionar las cookies.', kicker: 'Privacidad · Transparencia', updated: 'Última actualización: 2 de septiembre de 2026',
    controllerTitle: 'Responsable del tratamiento', controllerText: 'El responsable de los datos recogidos mediante el sitio y las reservas es', contactText: 'Para solicitudes de privacidad, usa el formulario de contacto, llama o escribe al domicilio indicado.',
    dataTitle: 'Datos y finalidades', dataItems: ['Reservas y lista de espera: nombre, email, teléfono, fecha, hora, personas, estado y datos opcionales, para gestionar, confirmar, recordar y asistir.', 'Contacto: nombre, email, asunto y mensaje para responder.', 'Datos técnicos y de seguridad: horarios, dirección de red, registros y dispositivo para proteger el servicio, prevenir abusos y diagnosticar errores.', 'Navegación y campañas: páginas, interacciones y parámetros promocionales, solo con consentimiento, para medición y publicidad.', 'Elección opcional de marketing y su prueba para posibles comunicaciones sobre ofertas y eventos.'],
    basisTitle: 'Bases jurídicas y entrega de datos', basisItems: ['Medidas solicitadas y prestación de la reserva (art. 6.1.b RGPD).', 'Obligaciones legales del operador (art. 6.1.c RGPD).', 'Interés legítimo en seguridad, continuidad y defensa de derechos (art. 6.1.f RGPD).', 'Consentimiento revocable para análisis, publicidad y marketing opcionales (art. 6.1.a RGPD).'],
    cookieTitle: 'Cookies y almacenamiento', cookieText: 'El almacenamiento técnico guarda idioma, tema y prueba de elecciones. Google Analytics, Tag Manager, Ads y Meta Pixel solo cargan con consentimiento. Los datos de reserva no se envían a estas herramientas.', storageTitle: 'Almacenamiento · finalidad · duración', storageRows: [['al-gobbo-language / theme', 'Preferencias técnicas', 'Hasta borrarlas del navegador'], ['al-gobbo-consent-v1', 'Prueba de elecciones', '6 meses'], ['al-gobbo-attribution-v1', 'Atribución con consentimiento analítico', 'Sesión'], ['Google / Meta', 'Análisis y publicidad con consentimiento', 'Según ajustes del proveedor']],
    providerTitle: 'Destinatarios y transferencias', providerText: 'Los datos pueden ser tratados por personal autorizado y proveedores necesarios: Supabase, Resend, Netlify, asistencia técnica y, solo con consentimiento, Google y Meta.', transferText: 'Algunos proveedores pueden tratar datos fuera del EEE mediante una decisión de adecuación o garantías apropiadas, incluidas cláusulas contractuales tipo.',
    retentionTitle: 'Conservación', retentionItems: ['Reservas y comunicaciones se guardan para el servicio y después solo por obligaciones legales, disputas o defensa de derechos.', 'Los mensajes se guardan hasta atender la solicitud y su seguimiento compatible.', 'El marketing dura hasta la retirada; las elecciones de cookies se solicitan de nuevo tras seis meses o cambios importantes.', 'Los registros técnicos siguen las necesidades de seguridad; después se borran o anonimizan cuando es posible.'],
    rightsTitle: 'Tus derechos', rightsText: 'Cuando proceda, puedes solicitar acceso, rectificación, supresión, limitación, portabilidad u oposición. El consentimiento puede retirarse en cualquier momento. No se toman decisiones exclusivamente automatizadas con efectos jurídicos.', complaintText: 'También puedes reclamar ante la autoridad italiana de protección de datos.',
    choicesTitle: 'Gestionar elecciones', choicesText: 'Rechazar herramientas opcionales no impide navegar ni reservar. Están desactivadas por defecto y pueden cambiarse en cualquier momento.', settings: 'Revisar preferencias de cookies', legal: 'Aviso legal y condiciones de reserva',
  },
};

const sectionClass = 'border-t border-venetian-brown/15 py-8 dark:border-white/12';
const headingClass = 'flex items-center gap-3 text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone';

export function PrivacyPage() {
  const { language } = useLanguage();
  const copy = privacyCopy[language];
  const openCookieSettings = () => window.dispatchEvent(new Event('open-cookie-settings'));

  return (
    <PageTransition>
      <SEOHead title={copy.title} canonical="/privacy" description={copy.description} availableLanguages={['en', 'it', 'fr', 'de', 'es']} />
      <main className="min-h-screen bg-[#f7f3eb] pb-20 pt-[84px] dark:bg-venetian-brown">
        <article className="mx-auto max-w-5xl px-4 py-16 sm:px-7 sm:py-24">
          <div className="border-t border-venetian-brown pt-7 dark:border-white">
            <p className="editorial-kicker mb-5">{copy.kicker}</p>
            <h1 className="max-w-[11ch] font-serif text-5xl font-semibold leading-[0.88] text-venetian-brown sm:text-7xl dark:text-white">{copy.title}</h1>
            <p className="mb-10 mt-5 text-sm text-venetian-brown/60 dark:text-venetian-sandstone/60">{copy.updated}</p>

            <div className="mt-14 leading-relaxed text-venetian-brown/70 dark:text-white/70">
              <section className={sectionClass}>
                <h2 className={headingClass}><Shield className="h-6 w-6 text-venetian-gold" />{copy.controllerTitle}</h2>
                <p className="mt-4">{copy.controllerText} <strong className="text-venetian-brown dark:text-white">{restaurantLegalIdentity.legalName}</strong>, P.IVA/C.F. IT{restaurantLegalIdentity.vatNumber}, {restaurantLegalIdentity.address}, {restaurantLegalIdentity.rea}.</p>
                <p className="mt-3">{copy.contactText} <a href={restaurantLegalIdentity.phoneHref} className="font-semibold text-venetian-terracotta underline underline-offset-4 dark:text-venetian-gold">{restaurantLegalIdentity.phoneDisplay}</a>.</p>
              </section>

              <section className={sectionClass}>
                <h2 className={headingClass}><Database className="h-6 w-6 text-venetian-gold" />{copy.dataTitle}</h2>
                <ul className="mt-5 list-disc space-y-3 pl-5">{copy.dataItems.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>

              <section className={sectionClass}>
                <h2 className={headingClass}><Scale className="h-6 w-6 text-venetian-gold" />{copy.basisTitle}</h2>
                <ul className="mt-5 list-disc space-y-3 pl-5">{copy.basisItems.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>

              <section className={sectionClass}>
                <h2 className={headingClass}><Cookie className="h-6 w-6 text-venetian-gold" />{copy.cookieTitle}</h2>
                <p className="mt-4">{copy.cookieText}</p>
                <div className="mt-6 overflow-x-auto border border-venetian-brown/15 dark:border-white/15">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <caption className="sr-only">{copy.storageTitle}</caption>
                    <tbody>{copy.storageRows.map(([name, purpose, duration]) => <tr key={name} className="border-b border-venetian-brown/10 last:border-b-0 dark:border-white/10"><th scope="row" className="p-4 font-semibold text-venetian-brown dark:text-white">{name}</th><td className="p-4">{purpose}</td><td className="p-4">{duration}</td></tr>)}</tbody>
                  </table>
                </div>
              </section>

              <section className={sectionClass}>
                <h2 className={headingClass}><Mail className="h-6 w-6 text-venetian-gold" />{copy.providerTitle}</h2>
                <p className="mt-4">{copy.providerText}</p><p className="mt-3">{copy.transferText}</p>
              </section>

              <section className={sectionClass}>
                <h2 className={headingClass}><Download className="h-6 w-6 text-venetian-gold" />{copy.retentionTitle}</h2>
                <ul className="mt-5 list-disc space-y-3 pl-5">{copy.retentionItems.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>

              <section className={sectionClass}>
                <h2 className={headingClass}><UserCheck className="h-6 w-6 text-venetian-gold" />{copy.rightsTitle}</h2>
                <p className="mt-4">{copy.rightsText}</p>
                <p className="mt-3">{copy.complaintText}{' '}<a href="https://www.garanteprivacy.it/" target="_blank" rel="noopener noreferrer" className="font-semibold text-venetian-terracotta underline underline-offset-4 dark:text-venetian-gold">garanteprivacy.it</a></p>
              </section>

              <section className={sectionClass}>
                <h2 className={headingClass}><Cookie className="h-6 w-6 text-venetian-gold" />{copy.choicesTitle}</h2>
                <p className="mt-4">{copy.choicesText}</p>
                <div className="mt-5 flex flex-wrap gap-4"><button type="button" onClick={openCookieSettings} className="inline-flex min-h-12 items-center justify-center border border-venetian-brown px-5 text-xs font-bold uppercase tracking-[0.14em] text-venetian-brown hover:border-venetian-terracotta hover:text-venetian-terracotta dark:border-white dark:text-white">{copy.settings}</button><Link to="/legal" className="inline-flex min-h-12 items-center justify-center px-2 text-sm font-bold text-venetian-terracotta underline underline-offset-4 dark:text-venetian-gold">{copy.legal}</Link></div>
              </section>
            </div>
          </div>
        </article>
      </main>
    </PageTransition>
  );
}
