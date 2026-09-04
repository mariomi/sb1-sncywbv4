import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Clock, Facebook, Instagram, MapPin, Navigation, Phone, Send, Utensils } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../components/Button';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import exteriorImage from '../Img/al-gobbo-2026/exterior-wide-1600.webp';
import { createContactMessage } from '../lib/api';
import { useLanguage, type Language } from '../lib/i18n';

const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=Al+Gobbo+di+Rialto,+San+Polo+649,+Venezia';

const copy: Record<Language, {
  seoTitle: string;
  seoDescription: string;
  kicker: string;
  title: string;
  subtitle: string;
  formTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  subjects: Record<'reservation' | 'event' | 'feedback' | 'other', string>;
  privacyBefore: string;
  privacyAfter: string;
  privacyError: string;
  send: string;
  sending: string;
  success: string;
  successEmailMissing: string;
  failure: string;
  address: string;
  hours: string;
  hoursValue: string;
  phone: string;
  directions: string;
  call: string;
  mapTitle: string;
  follow: string;
  help: string;
}> = {
  it: {
    seoTitle: 'Contatti', seoDescription: 'Contatta Al Gobbo di Rialto a Venezia: scrivici, chiamaci o raggiungici a San Polo 649.',
    kicker: 'San Polo · Rialto', title: 'Parliamo', subtitle: 'Un messaggio, una telefonata, il tuo tavolo a Venezia.',
    formTitle: 'Scrivici un messaggio', firstName: 'Nome', lastName: 'Cognome', email: 'Email', subject: 'Motivo del contatto', message: 'Messaggio',
    subjects: { reservation: 'Prenotazione', event: 'Evento privato', feedback: 'Feedback', other: 'Altro' },
    privacyBefore: 'Confermo di aver letto la', privacyAfter: 'relativa al trattamento dei miei dati personali.', privacyError: 'Conferma di aver letto l’informativa privacy.',
    send: 'Invia messaggio', sending: 'Invio in corso…', success: 'Messaggio ricevuto. Controlla la tua email per la conferma.', successEmailMissing: 'Messaggio ricevuto, ma non è stato possibile consegnare l’email di conferma.', failure: 'Non siamo riusciti a inviare il messaggio. Riprova o chiamaci.',
    address: 'Indirizzo', hours: 'Orari', hoursValue: 'Pranzo e cena\nChiuso il martedì', phone: 'Telefono', directions: 'Apri indicazioni', call: 'Chiama ora',
    mapTitle: 'Mappa di Al Gobbo di Rialto a Venezia', follow: 'Seguici', help: 'Per prenotazioni in giornata o richieste urgenti, chiamaci direttamente.',
  },
  en: {
    seoTitle: 'Contact', seoDescription: 'Contact Al Gobbo di Rialto in Venice: message us, call us or find us at San Polo 649.',
    kicker: 'San Polo · Rialto', title: 'Let’s talk', subtitle: 'A message, a phone call, your table in Venice.',
    formTitle: 'Send us a message', firstName: 'First name', lastName: 'Last name', email: 'Email', subject: 'What can we help with?', message: 'Message',
    subjects: { reservation: 'Reservation', event: 'Private event', feedback: 'Feedback', other: 'Other' },
    privacyBefore: 'I confirm that I have read the', privacyAfter: 'about the processing of my personal data.', privacyError: 'Confirm that you have read the privacy notice.',
    send: 'Send message', sending: 'Sending…', success: 'Message received. Check your email for confirmation.', successEmailMissing: 'Message received, but the confirmation email could not be delivered.', failure: 'We could not send your message. Please try again or call us.',
    address: 'Address', hours: 'Opening hours', hoursValue: 'Lunch and dinner\nClosed on Tuesday', phone: 'Phone', directions: 'Open directions', call: 'Call now',
    mapTitle: 'Map of Al Gobbo di Rialto in Venice', follow: 'Follow us', help: 'For same-day bookings or urgent requests, please call us directly.',
  },
  fr: {
    seoTitle: 'Contact', seoDescription: 'Contactez Al Gobbo di Rialto à Venise : écrivez-nous, appelez-nous ou retrouvez-nous à San Polo 649.',
    kicker: 'San Polo · Rialto', title: 'Parlons-nous', subtitle: 'Un message, un appel, votre table à Venise.',
    formTitle: 'Écrivez-nous', firstName: 'Prénom', lastName: 'Nom', email: 'E-mail', subject: 'Objet de votre demande', message: 'Message',
    subjects: { reservation: 'Réservation', event: 'Événement privé', feedback: 'Votre avis', other: 'Autre' },
    privacyBefore: 'Je confirme avoir lu la', privacyAfter: 'relative au traitement de mes données personnelles.', privacyError: 'Confirmez avoir lu la politique de confidentialité.',
    send: 'Envoyer le message', sending: 'Envoi…', success: 'Message reçu. Consultez votre e-mail pour la confirmation.', successEmailMissing: 'Message reçu, mais l’e-mail de confirmation n’a pas pu être envoyé.', failure: 'Votre message n’a pas pu être envoyé. Réessayez ou appelez-nous.',
    address: 'Adresse', hours: 'Horaires', hoursValue: 'Déjeuner et dîner\nFermé le mardi', phone: 'Téléphone', directions: 'Itinéraire', call: 'Appeler',
    mapTitle: 'Plan d’Al Gobbo di Rialto à Venise', follow: 'Suivez-nous', help: 'Pour une réservation le jour même ou une demande urgente, appelez-nous directement.',
  },
  de: {
    seoTitle: 'Kontakt', seoDescription: 'Kontaktieren Sie Al Gobbo di Rialto in Venedig: schreiben Sie uns, rufen Sie an oder besuchen Sie uns in San Polo 649.',
    kicker: 'San Polo · Rialto', title: 'Kontakt', subtitle: 'Eine Nachricht, ein Anruf, Ihr Tisch in Venedig.',
    formTitle: 'Schreiben Sie uns', firstName: 'Vorname', lastName: 'Nachname', email: 'E-Mail', subject: 'Worum geht es?', message: 'Nachricht',
    subjects: { reservation: 'Reservierung', event: 'Private Veranstaltung', feedback: 'Feedback', other: 'Sonstiges' },
    privacyBefore: 'Ich bestätige, die', privacyAfter: 'zur Verarbeitung meiner personenbezogenen Daten gelesen zu haben.', privacyError: 'Bestätigen Sie, die Datenschutzhinweise gelesen zu haben.',
    send: 'Nachricht senden', sending: 'Wird gesendet…', success: 'Nachricht erhalten. Prüfen Sie Ihre E-Mail für die Bestätigung.', successEmailMissing: 'Nachricht erhalten, aber die Bestätigungs-E-Mail konnte nicht zugestellt werden.', failure: 'Die Nachricht konnte nicht gesendet werden. Versuchen Sie es erneut oder rufen Sie uns an.',
    address: 'Adresse', hours: 'Öffnungszeiten', hoursValue: 'Mittag- und Abendessen\nDienstags geschlossen', phone: 'Telefon', directions: 'Route öffnen', call: 'Jetzt anrufen',
    mapTitle: 'Karte von Al Gobbo di Rialto in Venedig', follow: 'Folgen Sie uns', help: 'Für Reservierungen am selben Tag oder dringende Anfragen rufen Sie uns bitte direkt an.',
  },
  es: {
    seoTitle: 'Contacto', seoDescription: 'Contacta con Al Gobbo di Rialto en Venecia: escríbenos, llámanos o visítanos en San Polo 649.',
    kicker: 'San Polo · Rialto', title: 'Hablemos', subtitle: 'Un mensaje, una llamada, tu mesa en Venecia.',
    formTitle: 'Escríbenos', firstName: 'Nombre', lastName: 'Apellidos', email: 'Correo electrónico', subject: 'Motivo de contacto', message: 'Mensaje',
    subjects: { reservation: 'Reserva', event: 'Evento privado', feedback: 'Opinión', other: 'Otro' },
    privacyBefore: 'Confirmo que he leído la', privacyAfter: 'sobre el tratamiento de mis datos personales.', privacyError: 'Confirma que has leído la política de privacidad.',
    send: 'Enviar mensaje', sending: 'Enviando…', success: 'Mensaje recibido. Revisa tu correo para ver la confirmación.', successEmailMissing: 'Mensaje recibido, pero no se pudo entregar el correo de confirmación.', failure: 'No se ha podido enviar el mensaje. Inténtalo de nuevo o llámanos.',
    address: 'Dirección', hours: 'Horario', hoursValue: 'Comida y cena\nCerrado los martes', phone: 'Teléfono', directions: 'Abrir indicaciones', call: 'Llamar ahora',
    mapTitle: 'Mapa de Al Gobbo di Rialto en Venecia', follow: 'Síguenos', help: 'Para reservas en el mismo día o solicitudes urgentes, llámanos directamente.',
  },
};

const fieldClass = 'min-h-12 w-full border border-venetian-brown/25 bg-white/70 px-4 text-base text-venetian-brown placeholder:text-venetian-brown/40 focus:border-venetian-terracotta focus:outline-none focus:ring-2 focus:ring-venetian-terracotta/30 dark:border-white/20 dark:bg-white/[0.08] dark:text-white dark:placeholder:text-white/35';
const labelClass = 'mb-1.5 block text-sm font-medium text-venetian-brown/80 dark:text-white/80';

export function ContactPage() {
  const { language } = useLanguage();
  const text = copy[language];
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', subject: 'reservation', message: '' });
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!privacyConsent) {
      toast.error(text.privacyError);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createContactMessage({
        first_name: formData.firstName.trim(), last_name: formData.lastName.trim(), email: formData.email.trim(),
        subject: formData.subject, message: formData.message.trim(),
      });
      toast.success(result.confirmation_email_sent ? text.success : text.successEmailMissing);
      setFormData({ firstName: '', lastName: '', email: '', subject: 'reservation', message: '' });
      setPrivacyConsent(false);
    } catch {
      toast.error(text.failure);
    } finally {
      setIsSubmitting(false);
    }
  };

  const details = [
    { icon: MapPin, title: text.address, content: 'San Polo 649\n30125 Venezia, Italia' },
    { icon: Clock, title: text.hours, content: text.hoursValue },
    { icon: Phone, title: text.phone, content: '+39 041 520 4603' },
  ];

  return (
    <PageTransition>
      <SEOHead title={text.seoTitle} canonical="/contact" description={text.seoDescription} />
      <main className="min-h-screen bg-venetian-sandstone pb-16 pt-[84px] dark:bg-venetian-brown sm:pb-24">
        <motion.section className="relative mx-auto h-[34svh] min-h-[280px] max-w-[1480px] overflow-hidden border-x border-venetian-brown/15 dark:border-white/10 sm:h-[46vh] sm:min-h-[420px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <img src={exteriorImage} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
          <div className="relative flex h-full items-end px-5 py-8 sm:px-10 sm:py-12 lg:px-16">
            <div className="max-w-3xl">
              <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-venetian-gold sm:mb-5">{text.kicker}</p>
              <h1 className="font-serif text-6xl font-black uppercase leading-[0.76] tracking-[-0.05em] text-white sm:text-9xl">{text.title}</h1>
              <p className="mt-4 max-w-xl border-l-2 border-venetian-terracotta pl-4 text-sm leading-6 text-white/90 sm:mt-5 sm:text-lg">{text.subtitle}</p>
            </div>
          </div>
        </motion.section>

        <div className="mx-auto max-w-[1480px] px-4 py-12 sm:px-7 sm:py-20 lg:px-10">
          <div className="mb-8 grid grid-cols-2 gap-3 lg:hidden">
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" data-track="click_directions" className="flex min-h-12 items-center justify-center gap-2 bg-venetian-terracotta px-3 text-center text-xs font-bold uppercase tracking-[0.1em] text-white"><Navigation className="h-4 w-4" />{text.directions}</a>
            <a href="tel:+390415204603" className="flex min-h-12 items-center justify-center gap-2 border border-venetian-brown/25 px-3 text-center text-xs font-bold uppercase tracking-[0.1em] text-venetian-brown dark:border-white/25 dark:text-white"><Phone className="h-4 w-4" />{text.call}</a>
          </div>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.section className="order-1 border-t border-venetian-brown pt-7 dark:border-white" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="mb-7 font-serif text-4xl font-black uppercase leading-[0.84] tracking-[-0.035em] text-venetian-brown dark:text-white sm:text-6xl">{text.formTitle}</h2>
              <form onSubmit={handleSubmit} className="space-y-5" aria-busy={isSubmitting}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><label htmlFor="firstName" className={labelClass}>{text.firstName}</label><input id="firstName" autoComplete="given-name" value={formData.firstName} onChange={(event) => setFormData((previous) => ({ ...previous, firstName: event.target.value }))} className={fieldClass} required /></div>
                  <div><label htmlFor="lastName" className={labelClass}>{text.lastName}</label><input id="lastName" autoComplete="family-name" value={formData.lastName} onChange={(event) => setFormData((previous) => ({ ...previous, lastName: event.target.value }))} className={fieldClass} required /></div>
                </div>
                <div><label htmlFor="email" className={labelClass}>{text.email}</label><input type="email" id="email" autoComplete="email" value={formData.email} onChange={(event) => setFormData((previous) => ({ ...previous, email: event.target.value }))} className={fieldClass} required /></div>
                <div><label htmlFor="subject" className={labelClass}>{text.subject}</label><select id="subject" value={formData.subject} onChange={(event) => setFormData((previous) => ({ ...previous, subject: event.target.value }))} className={fieldClass}>{Object.entries(text.subjects).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                <div><label htmlFor="message" className={labelClass}>{text.message}</label><textarea id="message" rows={5} value={formData.message} onChange={(event) => setFormData((previous) => ({ ...previous, message: event.target.value }))} className={`${fieldClass} py-3`} required /></div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="privacyConsent" checked={privacyConsent} onChange={(event) => setPrivacyConsent(event.target.checked)} className="mt-0.5 h-5 w-5 accent-venetian-terracotta" required />
                  <label htmlFor="privacyConsent" className="text-sm leading-6 text-venetian-brown/70 dark:text-white/70">{text.privacyBefore}{' '}<a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-venetian-terracotta underline underline-offset-4">Privacy Policy</a>{' '}{text.privacyAfter}</label>
                </div>
                <Button type="submit" className="min-h-12 w-full rounded-none bg-venetian-brown text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-venetian-terracotta dark:bg-venetian-gold dark:text-venetian-brown dark:hover:bg-white" disabled={isSubmitting}>
                  <Send className="mr-2 h-4 w-4" />{isSubmitting ? text.sending : text.send}
                </Button>
              </form>
            </motion.section>

            <motion.aside className="order-2 space-y-5" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <div className="hidden grid-cols-2 gap-3 lg:grid">
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" data-track="click_directions" className="flex min-h-12 items-center justify-center gap-2 bg-venetian-terracotta px-3 text-center text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-venetian-brown dark:hover:bg-venetian-gold dark:hover:text-venetian-brown"><Navigation className="h-4 w-4" />{text.directions}</a>
                <a href="tel:+390415204603" className="flex min-h-12 items-center justify-center gap-2 border border-venetian-brown/25 px-3 text-center text-xs font-bold uppercase tracking-[0.1em] text-venetian-brown hover:border-venetian-terracotta hover:text-venetian-terracotta dark:border-white/25 dark:text-white"><Phone className="h-4 w-4" />{text.call}</a>
              </div>
              <div className="relative overflow-hidden border border-venetian-brown/15 bg-white/80 dark:border-white/15 dark:bg-white/5">
                <iframe title={text.mapTitle} src="https://www.google.com/maps?q=Al+Gobbo+di+Rialto,+San+Polo+649,+Venezia&output=embed" width="100%" height="260" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                <span className="pointer-events-none absolute left-3 top-3 bg-venetian-brown/90 px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white">San Polo 649 · Rialto</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {details.map((item) => <div key={item.title} className="border border-venetian-brown/15 bg-white/50 p-4 dark:border-white/15 dark:bg-white/5"><item.icon className="mb-2 h-5 w-5 text-venetian-gold" /><h3 className="font-serif text-lg text-venetian-brown dark:text-white">{item.title}</h3><p className="mt-1 whitespace-pre-line text-sm leading-6 text-venetian-brown/70 dark:text-white/70">{item.content}</p></div>)}
              </div>
              <div className="border border-venetian-brown/15 bg-white/50 p-5 dark:border-white/15 dark:bg-white/5">
                <h3 className="font-serif text-lg text-venetian-brown dark:text-white">{text.follow}</h3>
                <div className="mt-4 flex gap-3">{[
                  { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/ristorantealgobbodirialto' },
                  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/algobbodirialto/' },
                  { icon: Utensils, label: 'TripAdvisor', href: 'https://www.tripadvisor.it/Restaurant_Review-g187870-d20083361-Reviews-Ristorante_Pizzeria_Al_Gobbo_di_Rialto-Venice_Veneto.html' },
                ].map((social) => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="grid h-11 w-11 place-items-center border border-venetian-brown/20 text-venetian-brown hover:border-venetian-terracotta hover:text-venetian-terracotta dark:border-white/20 dark:text-white"><social.icon className="h-5 w-5" /></a>)}</div>
              </div>
              <p className="border-l-2 border-venetian-gold pl-4 text-sm leading-6 text-venetian-brown/70 dark:text-white/70">{text.help}</p>
            </motion.aside>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
