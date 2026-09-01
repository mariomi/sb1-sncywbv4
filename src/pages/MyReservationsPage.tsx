import { motion } from 'framer-motion';
import { CalendarCheck, Mail, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import img2939 from '../Img/G1/IMG_2939.webp';
import { useLanguage, type Language } from '../lib/i18n';

const copy: Record<Language, {
  seo: string;
  kicker: string;
  title: string;
  subtitle: string;
  cardTitle: string;
  explanation: string;
  emailTip: string;
  phoneBefore: string;
  phoneAfter: string;
  newBooking: string;
}> = {
  it: {
    seo: 'Gestisci la prenotazione', kicker: 'Il tuo tavolo', title: 'Gestisci la prenotazione', subtitle: 'Un accesso privato, direttamente dalla tua email',
    cardTitle: 'Apri il link nella conferma', explanation: 'Per proteggere i tuoi dati non mostriamo prenotazioni cercando un semplice indirizzo email. Usa il link personale presente nell’email di conferma per vedere i dettagli o cancellare in sicurezza.',
    emailTip: 'Controlla anche la cartella spam. L’oggetto contiene la conferma della prenotazione.', phoneBefore: 'Non trovi l’email? Chiamaci al', phoneAfter: 'e ti aiutiamo subito.', newBooking: 'Fai una nuova prenotazione',
  },
  en: {
    seo: 'Manage your reservation', kicker: 'Your table', title: 'Manage your reservation', subtitle: 'Private access, directly from your confirmation email',
    cardTitle: 'Open the link in your confirmation', explanation: 'To protect your data, reservations cannot be retrieved with an email address alone. Use the personal link in your confirmation email to view the details or cancel safely.',
    emailTip: 'Check your spam folder too. The subject line contains your booking confirmation.', phoneBefore: 'Cannot find the email? Call us on', phoneAfter: 'and we will help you.', newBooking: 'Make a new reservation',
  },
  fr: {
    seo: 'Gérer ma réservation', kicker: 'Votre table', title: 'Gérer ma réservation', subtitle: 'Un accès privé depuis votre e-mail de confirmation',
    cardTitle: 'Ouvrez le lien de confirmation', explanation: 'Pour protéger vos données, une adresse e-mail seule ne permet pas de retrouver une réservation. Utilisez le lien personnel reçu dans l’e-mail de confirmation pour voir les détails ou annuler en toute sécurité.',
    emailTip: 'Vérifiez aussi le dossier indésirable. L’objet contient la confirmation de réservation.', phoneBefore: 'Vous ne trouvez pas l’e-mail ? Appelez-nous au', phoneAfter: 'et nous vous aiderons.', newBooking: 'Faire une nouvelle réservation',
  },
  de: {
    seo: 'Reservierung verwalten', kicker: 'Ihr Tisch', title: 'Reservierung verwalten', subtitle: 'Privater Zugriff über Ihre Bestätigungs-E-Mail',
    cardTitle: 'Link in der Bestätigung öffnen', explanation: 'Zum Schutz Ihrer Daten kann eine Reservierung nicht allein über die E-Mail-Adresse abgerufen werden. Nutzen Sie den persönlichen Link in Ihrer Bestätigung, um Details anzusehen oder sicher zu stornieren.',
    emailTip: 'Prüfen Sie auch den Spam-Ordner. Der Betreff enthält Ihre Reservierungsbestätigung.', phoneBefore: 'Sie finden die E-Mail nicht? Rufen Sie uns an:', phoneAfter: '– wir helfen Ihnen gern.', newBooking: 'Neue Reservierung',
  },
  es: {
    seo: 'Gestionar reserva', kicker: 'Tu mesa', title: 'Gestiona tu reserva', subtitle: 'Acceso privado desde tu correo de confirmación',
    cardTitle: 'Abre el enlace de confirmación', explanation: 'Para proteger tus datos, no mostramos reservas buscando solo una dirección de correo. Usa el enlace personal del mensaje de confirmación para ver los detalles o cancelar de forma segura.',
    emailTip: 'Revisa también la carpeta de correo no deseado. El asunto contiene la confirmación de tu reserva.', phoneBefore: '¿No encuentras el correo? Llámanos al', phoneAfter: 'y te ayudaremos.', newBooking: 'Hacer una nueva reserva',
  },
};

export function MyReservationsPage() {
  const { language } = useLanguage();
  const text = copy[language];

  return (
    <PageTransition>
      <SEOHead title={text.seo} canonical="/my-reservations" noindex />
      <main className="min-h-screen bg-[#f7f3eb] pb-16 pt-[84px] dark:bg-venetian-brown sm:pb-24">
        <section className="relative mx-auto h-[32svh] min-h-[260px] max-w-[1480px] overflow-hidden sm:h-[42vh] sm:min-h-[390px]">
          <img src={img2939} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
          <div className="relative flex h-full items-end px-5 py-8 sm:px-10 sm:py-12 lg:px-16">
            <div>
              <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-venetian-gold sm:mb-5">{text.kicker}</p>
              <h1 className="max-w-[11ch] font-serif text-5xl font-semibold leading-[0.86] text-white sm:text-8xl">{text.title}</h1>
              <p className="mt-4 max-w-xl border-l-2 border-venetian-terracotta pl-4 text-sm leading-6 text-white/90 sm:mt-5 sm:text-lg">{text.subtitle}</p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-7 sm:py-20">
          <motion.section className="border-t border-venetian-brown pt-7 dark:border-white sm:pt-9" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6 grid h-14 w-14 place-items-center bg-venetian-terracotta text-white"><ShieldCheck className="h-7 w-7" /></div>
            <h2 className="mb-3 font-serif text-4xl font-semibold text-venetian-brown dark:text-white sm:text-5xl">{text.cardTitle}</h2>
            <p className="mb-6 leading-7 text-venetian-brown/75 dark:text-white/70">{text.explanation}</p>

            <div className="mb-8 divide-y divide-venetian-brown/15 border-y border-venetian-brown/15 dark:divide-white/15 dark:border-white/15">
              <div className="flex items-start gap-3 py-4"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-venetian-terracotta" /><p className="text-sm leading-6 text-venetian-brown/75 dark:text-white/70">{text.emailTip}</p></div>
              <div className="flex items-start gap-3 py-4"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-venetian-terracotta" /><p className="text-sm leading-6 text-venetian-brown/75 dark:text-white/70">{text.phoneBefore}{' '}<a className="font-semibold text-venetian-brown underline decoration-venetian-gold underline-offset-4 hover:text-venetian-terracotta dark:text-white" href="tel:+390415204603">+39 041 520 4603</a>{' '}{text.phoneAfter}</p></div>
            </div>

            <Link to="/book" className="inline-flex min-h-12 w-full items-center justify-center bg-venetian-brown px-5 text-center text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-venetian-terracotta dark:bg-venetian-gold dark:text-venetian-brown dark:hover:bg-white"><CalendarCheck className="mr-2 h-4 w-4" />{text.newBooking}</Link>
          </motion.section>
        </div>
      </main>
    </PageTransition>
  );
}
