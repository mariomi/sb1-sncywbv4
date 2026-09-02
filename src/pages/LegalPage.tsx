import { Building2, CalendarCheck, Code2, FileText, ListChecks, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import { useLanguage, type Language } from '../lib/i18n';
import { developerLegalIdentity, restaurantLegalIdentity } from '../lib/legal';

type LegalCopy = {
  seoTitle: string;
  description: string;
  kicker: string;
  title: string;
  updated: string;
  operatorTitle: string;
  operatorIntro: string;
  businessName: string;
  vatAndTax: string;
  registration: string;
  registeredOffice: string;
  contacts: string;
  contactForm: string;
  developerTitle: string;
  developerIntro: string;
  bookingTitle: string;
  bookingItems: string[];
  cancellationTitle: string;
  cancellationText: string;
  waitlistTitle: string;
  waitlistText: string;
  contentTitle: string;
  contentText: string;
  lawTitle: string;
  lawText: string;
  privacyLink: string;
};

const legalCopy: Record<Language, LegalCopy> = {
  it: {
    seoTitle: 'Note legali e condizioni di prenotazione',
    description: 'Dati societari del gestore, crediti del sito e condizioni del servizio di prenotazione di Al Gobbo di Rialto.',
    kicker: 'Trasparenza · Informazioni societarie',
    title: 'Note legali e condizioni di prenotazione',
    updated: 'Ultimo aggiornamento: 2 settembre 2026',
    operatorTitle: 'Titolare del sito e del ristorante',
    operatorIntro: 'Il sito, il ristorante e il servizio di prenotazione online sono gestiti dalla seguente impresa:',
    businessName: 'Ragione sociale', vatAndTax: 'Partita IVA e Codice Fiscale', registration: 'Registro Imprese / REA', registeredOffice: 'Sede legale', contacts: 'Contatti', contactForm: 'Modulo contatti',
    developerTitle: 'Realizzazione del sito',
    developerIntro: 'Progetto e sviluppo digitale a cura di NetawebS. NetawebS non è il gestore del ristorante e non conclude le prenotazioni con gli ospiti.',
    bookingTitle: 'Condizioni della prenotazione online',
    bookingItems: [
      'Il servizio di prenotazione è gratuito e non richiede pagamenti, caparre o dati di pagamento online.',
      'Quando appare la conferma a schermo, la prenotazione è registrata come confermata. L’email riepilogativa è un servizio di cortesia: la sua mancata consegna non annulla la conferma mostrata sul sito.',
      'L’ospite deve fornire dati corretti e contattare direttamente il ristorante per allergie, esigenze essenziali o richieste che richiedono una conferma specifica.',
      'In caso di indisponibilità eccezionale, errore tecnico o forza maggiore, il ristorante contatterà l’ospite usando i recapiti forniti.',
    ],
    cancellationTitle: 'Cancellazioni e modifiche',
    cancellationText: 'La prenotazione può essere cancellata gratuitamente, prima dell’orario prenotato, tramite il link personale ricevuto nell’email di conferma o nei promemoria. La cancellazione è definitiva. Lo stesso link permette di aggiornare le note e, fino a 24 ore prima, di scegliere un orario disponibile 30 minuti prima o dopo. Per cambiare data, numero di ospiti o scegliere un altro orario occorre contattare il ristorante.',
    waitlistTitle: 'Lista d’attesa',
    waitlistText: 'L’iscrizione alla lista d’attesa non costituisce una prenotazione né garantisce un tavolo. Se si libera disponibilità, l’ospite riceve un avviso e deve completare la prenotazione finché il posto risulta disponibile.',
    contentTitle: 'Contenuti, menu e collegamenti esterni',
    contentText: 'Il ristorante aggiorna con cura menu, prezzi, orari e disponibilità. Prodotti e piatti possono tuttavia variare per stagionalità o disponibilità. Le informazioni sugli allergeni devono essere verificate con il personale. I collegamenti a servizi esterni sono forniti per comodità e restano soggetti alle condizioni dei rispettivi gestori.',
    lawTitle: 'Legge applicabile e diritti',
    lawText: 'Si applica la legge italiana. Restano sempre salvi i diritti inderogabili del consumatore e i criteri di competenza territoriale previsti dalla legge. Nessuna disposizione di questa pagina limita diritti che non possono essere esclusi contrattualmente.',
    privacyLink: 'Informativa privacy e cookie',
  },
  en: {
    seoTitle: 'Legal notice and booking terms', description: 'Restaurant operator details, website credits and online booking terms for Al Gobbo di Rialto.', kicker: 'Transparency · Company information', title: 'Legal notice and booking terms', updated: 'Last updated: 2 September 2026',
    operatorTitle: 'Website and restaurant operator', operatorIntro: 'The website, restaurant and online booking service are operated by:', businessName: 'Legal name', vatAndTax: 'VAT and tax number', registration: 'Business Register / REA', registeredOffice: 'Registered office', contacts: 'Contact', contactForm: 'Contact form',
    developerTitle: 'Website creation', developerIntro: 'Digital design and development by NetawebS. NetawebS does not operate the restaurant and does not enter into reservations with guests.',
    bookingTitle: 'Online booking terms', bookingItems: ['The booking service is free and does not request online payments, deposits or payment details.', 'When the success screen appears, the booking is recorded as confirmed. The confirmation email is a courtesy service; failed email delivery does not cancel the confirmation shown on the website.', 'Guests must provide accurate details and contact the restaurant directly about allergies, essential requirements or requests needing specific confirmation.', 'If exceptional unavailability, a technical error or force majeure occurs, the restaurant will contact the guest using the details provided.'],
    cancellationTitle: 'Cancellations and changes', cancellationText: 'A booking may be cancelled free of charge before its scheduled time through the personal link in the confirmation email or reminders. Cancellation is final. The same link lets you update notes and, until 24 hours before the booking, choose an available time 30 minutes earlier or later. Contact the restaurant to change the date, party size or choose a different time.',
    waitlistTitle: 'Waitlist', waitlistText: 'Joining the waitlist is not a booking and does not guarantee a table. If space becomes available, the guest is notified and must complete the booking while availability lasts.',
    contentTitle: 'Content, menu and external links', contentText: 'The restaurant takes care to keep menus, prices, opening times and availability current. Products and dishes may vary with season and supply. Allergen information must be checked with staff. External links are provided for convenience and remain subject to the relevant provider’s terms.',
    lawTitle: 'Applicable law and rights', lawText: 'Italian law applies. Mandatory consumer rights and statutory rules on jurisdiction always remain unaffected. Nothing on this page limits rights that cannot legally be excluded.', privacyLink: 'Privacy and cookie notice',
  },
  fr: {
    seoTitle: 'Mentions légales et conditions de réservation', description: 'Informations sur l’exploitant, crédits du site et conditions de réservation en ligne d’Al Gobbo di Rialto.', kicker: 'Transparence · Informations sur l’entreprise', title: 'Mentions légales et conditions de réservation', updated: 'Dernière mise à jour : 2 septembre 2026',
    operatorTitle: 'Exploitant du site et du restaurant', operatorIntro: 'Le site, le restaurant et le service de réservation en ligne sont exploités par :', businessName: 'Raison sociale', vatAndTax: 'TVA et code fiscal', registration: 'Registre des entreprises / REA', registeredOffice: 'Siège social', contacts: 'Contact', contactForm: 'Formulaire de contact',
    developerTitle: 'Création du site', developerIntro: 'Conception et développement numérique par NetawebS. NetawebS n’exploite pas le restaurant et ne conclut pas les réservations avec les clients.',
    bookingTitle: 'Conditions de réservation en ligne', bookingItems: ['Le service de réservation est gratuit et ne demande ni paiement, ni acompte, ni coordonnées de paiement en ligne.', 'Lorsque l’écran de confirmation apparaît, la réservation est enregistrée comme confirmée. L’e-mail récapitulatif est un service de courtoisie ; son absence ne supprime pas la confirmation affichée sur le site.', 'Le client doit fournir des informations exactes et contacter directement le restaurant pour les allergies, besoins essentiels ou demandes nécessitant une confirmation spécifique.', 'En cas d’indisponibilité exceptionnelle, d’erreur technique ou de force majeure, le restaurant contactera le client aux coordonnées fournies.'],
    cancellationTitle: 'Annulations et modifications', cancellationText: 'La réservation peut être annulée gratuitement avant l’heure prévue via le lien personnel reçu par e-mail ou dans les rappels. L’annulation est définitive. Le même lien permet de modifier les notes et, jusqu’à 24 heures avant la réservation, de choisir un horaire disponible 30 minutes avant ou après. Contactez le restaurant pour changer la date, le nombre de personnes ou choisir un autre horaire.',
    waitlistTitle: 'Liste d’attente', waitlistText: 'L’inscription sur la liste d’attente ne constitue pas une réservation et ne garantit pas de table. Si une place se libère, le client est averti et doit finaliser la réservation tant qu’elle reste disponible.',
    contentTitle: 'Contenus, menu et liens externes', contentText: 'Le restaurant veille à actualiser menus, prix, horaires et disponibilités. Les produits et plats peuvent varier selon la saison et l’approvisionnement. Les allergènes doivent être vérifiés auprès du personnel. Les liens externes restent soumis aux conditions de leurs fournisseurs.',
    lawTitle: 'Droit applicable et droits', lawText: 'Le droit italien s’applique. Les droits impératifs des consommateurs et les règles légales de compétence restent inchangés. Aucune disposition ne limite les droits qui ne peuvent être légalement exclus.', privacyLink: 'Politique de confidentialité et cookies',
  },
  de: {
    seoTitle: 'Impressum und Reservierungsbedingungen', description: 'Betreiberdaten, Website-Credits und Bedingungen der Online-Reservierung von Al Gobbo di Rialto.', kicker: 'Transparenz · Unternehmensangaben', title: 'Impressum und Reservierungsbedingungen', updated: 'Letzte Aktualisierung: 2. September 2026',
    operatorTitle: 'Betreiber von Website und Restaurant', operatorIntro: 'Website, Restaurant und Online-Reservierung werden betrieben von:', businessName: 'Firmenname', vatAndTax: 'USt-IdNr. und Steuernummer', registration: 'Unternehmensregister / REA', registeredOffice: 'Sitz', contacts: 'Kontakt', contactForm: 'Kontaktformular',
    developerTitle: 'Erstellung der Website', developerIntro: 'Digitales Design und Entwicklung durch NetawebS. NetawebS betreibt das Restaurant nicht und schließt keine Reservierungen mit Gästen ab.',
    bookingTitle: 'Bedingungen der Online-Reservierung', bookingItems: ['Der Reservierungsservice ist kostenlos und verlangt online weder Zahlung noch Anzahlung oder Zahlungsdaten.', 'Sobald die Bestätigung auf dem Bildschirm erscheint, ist die Reservierung als bestätigt erfasst. Die E-Mail ist ein zusätzlicher Service; eine fehlende Zustellung hebt die auf der Website angezeigte Bestätigung nicht auf.', 'Gäste müssen korrekte Angaben machen und das Restaurant bei Allergien, wesentlichen Anforderungen oder bestätigungspflichtigen Wünschen direkt kontaktieren.', 'Bei außergewöhnlicher Nichtverfügbarkeit, technischen Fehlern oder höherer Gewalt kontaktiert das Restaurant den Gast über die angegebenen Kontaktdaten.'],
    cancellationTitle: 'Stornierung und Änderung', cancellationText: 'Die Reservierung kann vor dem gebuchten Zeitpunkt kostenlos über den persönlichen Link in der Bestätigungs-E-Mail oder den Erinnerungen storniert werden. Die Stornierung ist endgültig. Über denselben Link können Hinweise aktualisiert und bis 24 Stunden vorher eine verfügbare Uhrzeit 30 Minuten früher oder später gewählt werden. Für ein anderes Datum, eine andere Personenzahl oder eine andere Uhrzeit kontaktieren Sie das Restaurant.',
    waitlistTitle: 'Warteliste', waitlistText: 'Ein Wartelisteneintrag ist keine Reservierung und garantiert keinen Tisch. Wird ein Platz frei, erhält der Gast eine Nachricht und muss die Reservierung abschließen, solange Verfügbarkeit besteht.',
    contentTitle: 'Inhalte, Speisekarte und externe Links', contentText: 'Das Restaurant hält Speisekarten, Preise, Öffnungszeiten und Verfügbarkeiten sorgfältig aktuell. Produkte und Gerichte können saison- oder lieferbedingt variieren. Allergene sind mit dem Personal zu klären. Externe Links unterliegen den Bedingungen des jeweiligen Anbieters.',
    lawTitle: 'Anwendbares Recht und Rechte', lawText: 'Es gilt italienisches Recht. Zwingende Verbraucherrechte und gesetzliche Gerichtsstandsregeln bleiben unberührt. Diese Seite schränkt keine Rechte ein, die gesetzlich nicht ausgeschlossen werden dürfen.', privacyLink: 'Datenschutz- und Cookie-Hinweise',
  },
  es: {
    seoTitle: 'Aviso legal y condiciones de reserva', description: 'Datos del operador, créditos del sitio y condiciones de reserva en línea de Al Gobbo di Rialto.', kicker: 'Transparencia · Información empresarial', title: 'Aviso legal y condiciones de reserva', updated: 'Última actualización: 2 de septiembre de 2026',
    operatorTitle: 'Operador del sitio y del restaurante', operatorIntro: 'El sitio, el restaurante y el servicio de reserva en línea están gestionados por:', businessName: 'Razón social', vatAndTax: 'IVA y código fiscal', registration: 'Registro Mercantil / REA', registeredOffice: 'Domicilio social', contacts: 'Contacto', contactForm: 'Formulario de contacto',
    developerTitle: 'Creación del sitio', developerIntro: 'Diseño y desarrollo digital por NetawebS. NetawebS no gestiona el restaurante ni formaliza reservas con los clientes.',
    bookingTitle: 'Condiciones de reserva en línea', bookingItems: ['El servicio de reserva es gratuito y no solicita pagos, depósitos ni datos de pago en línea.', 'Cuando aparece la pantalla de confirmación, la reserva queda registrada como confirmada. El correo de resumen es un servicio adicional; su falta de entrega no anula la confirmación mostrada en el sitio.', 'El cliente debe facilitar datos correctos y contactar directamente con el restaurante sobre alergias, necesidades esenciales o solicitudes que requieran confirmación específica.', 'En caso de indisponibilidad excepcional, error técnico o fuerza mayor, el restaurante contactará con el cliente mediante los datos facilitados.'],
    cancellationTitle: 'Cancelaciones y cambios', cancellationText: 'La reserva puede cancelarse gratuitamente antes de la hora reservada mediante el enlace personal del correo de confirmación o los recordatorios. La cancelación es definitiva. El mismo enlace permite actualizar las notas y, hasta 24 horas antes, elegir un horario disponible 30 minutos antes o después. Para cambiar la fecha, el número de personas o elegir otra hora, contacta con el restaurante.',
    waitlistTitle: 'Lista de espera', waitlistText: 'Inscribirse en la lista de espera no constituye una reserva ni garantiza una mesa. Si queda disponibilidad, el cliente recibe un aviso y debe completar la reserva mientras siga disponible.',
    contentTitle: 'Contenido, menú y enlaces externos', contentText: 'El restaurante procura mantener actualizados menús, precios, horarios y disponibilidad. Los productos y platos pueden variar por temporada o suministro. Los alérgenos deben comprobarse con el personal. Los enlaces externos quedan sujetos a las condiciones de sus proveedores.',
    lawTitle: 'Ley aplicable y derechos', lawText: 'Se aplica la ley italiana. Los derechos imperativos del consumidor y las normas legales de competencia permanecen intactos. Nada en esta página limita derechos que legalmente no puedan excluirse.', privacyLink: 'Política de privacidad y cookies',
  },
};

const sectionClass = 'border-t border-venetian-brown/15 py-8 dark:border-white/12';
const headingClass = 'flex items-center gap-3 text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone';

export function LegalPage() {
  const { language } = useLanguage();
  const copy = legalCopy[language];

  return (
    <PageTransition>
      <SEOHead title={copy.seoTitle} canonical="/legal" description={copy.description} availableLanguages={['en', 'it', 'fr', 'de', 'es']} />
      <main className="min-h-screen bg-[#f7f3eb] pb-20 pt-[84px] dark:bg-venetian-brown">
        <article className="mx-auto max-w-5xl px-4 py-16 sm:px-7 sm:py-24">
          <div className="border-t border-venetian-brown pt-7 dark:border-white">
            <p className="editorial-kicker mb-5">{copy.kicker}</p>
            <h1 className="max-w-[13ch] font-serif text-5xl font-semibold leading-[0.88] text-venetian-brown sm:text-7xl dark:text-white">{copy.title}</h1>
            <p className="mb-10 mt-5 text-sm text-venetian-brown/60 dark:text-venetian-sandstone/60">{copy.updated}</p>

            <div className="mt-14 leading-relaxed text-venetian-brown/70 dark:text-white/70">
              <section className={sectionClass}>
                <h2 className={headingClass}><Building2 className="h-6 w-6 text-venetian-gold" />{copy.operatorTitle}</h2>
                <p className="mt-4">{copy.operatorIntro}</p>
                <dl className="mt-6 grid gap-x-8 gap-y-5 border border-venetian-brown/15 p-5 sm:grid-cols-2 dark:border-white/15">
                  <div><dt className="text-xs font-bold uppercase tracking-[0.14em] text-venetian-brown/55 dark:text-white/50">{copy.businessName}</dt><dd className="mt-1 font-semibold text-venetian-brown dark:text-white">{restaurantLegalIdentity.legalName}</dd></div>
                  <div><dt className="text-xs font-bold uppercase tracking-[0.14em] text-venetian-brown/55 dark:text-white/50">{copy.vatAndTax}</dt><dd className="mt-1 font-semibold text-venetian-brown dark:text-white">IT{restaurantLegalIdentity.vatNumber}</dd></div>
                  <div><dt className="text-xs font-bold uppercase tracking-[0.14em] text-venetian-brown/55 dark:text-white/50">{copy.registration}</dt><dd className="mt-1">{restaurantLegalIdentity.registry} · {restaurantLegalIdentity.rea}</dd></div>
                  <div><dt className="text-xs font-bold uppercase tracking-[0.14em] text-venetian-brown/55 dark:text-white/50">{copy.registeredOffice}</dt><dd className="mt-1">{restaurantLegalIdentity.address}</dd></div>
                  <div className="sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-[0.14em] text-venetian-brown/55 dark:text-white/50">{copy.contacts}</dt><dd className="mt-1"><a className="font-semibold text-venetian-terracotta underline underline-offset-4 dark:text-venetian-gold" href={restaurantLegalIdentity.phoneHref}>{restaurantLegalIdentity.phoneDisplay}</a> · <Link className="font-semibold text-venetian-terracotta underline underline-offset-4 dark:text-venetian-gold" to="/contact">{copy.contactForm}</Link></dd></div>
                </dl>
              </section>

              <section className={sectionClass}>
                <h2 className={headingClass}><Code2 className="h-6 w-6 text-venetian-gold" />{copy.developerTitle}</h2>
                <p className="mt-4">{copy.developerIntro}</p>
                <p className="mt-4 font-semibold text-venetian-brown dark:text-white">{developerLegalIdentity.legalName}<br />P.IVA / C.F. IT{developerLegalIdentity.vatNumber} · {developerLegalIdentity.rea}<br />{developerLegalIdentity.address}</p>
                <a href={developerLegalIdentity.website} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center font-bold text-venetian-terracotta underline underline-offset-4 dark:text-venetian-gold">netawebs.net</a>
              </section>

              <section id="booking-terms" className={`${sectionClass} scroll-mt-28`}>
                <h2 className={headingClass}><CalendarCheck className="h-6 w-6 text-venetian-gold" />{copy.bookingTitle}</h2>
                <ul className="mt-5 list-disc space-y-3 pl-5">{copy.bookingItems.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>

              <section className={sectionClass}>
                <h2 className={headingClass}><ListChecks className="h-6 w-6 text-venetian-gold" />{copy.cancellationTitle}</h2>
                <p className="mt-4">{copy.cancellationText}</p>
                <h3 className="mt-7 font-serif text-xl font-semibold text-venetian-brown dark:text-white">{copy.waitlistTitle}</h3>
                <p className="mt-3">{copy.waitlistText}</p>
              </section>

              <section className={sectionClass}>
                <h2 className={headingClass}><FileText className="h-6 w-6 text-venetian-gold" />{copy.contentTitle}</h2>
                <p className="mt-4">{copy.contentText}</p>
              </section>

              <section className={sectionClass}>
                <h2 className={headingClass}><Scale className="h-6 w-6 text-venetian-gold" />{copy.lawTitle}</h2>
                <p className="mt-4">{copy.lawText}</p>
                <Link to="/privacy" className="mt-5 inline-flex min-h-11 items-center font-bold text-venetian-terracotta underline underline-offset-4 dark:text-venetian-gold">{copy.privacyLink}</Link>
              </section>
            </div>
          </div>
        </article>
      </main>
    </PageTransition>
  );
}
