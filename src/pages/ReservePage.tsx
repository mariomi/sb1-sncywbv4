import React, { useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Calendar, Clock, Users, UtensilsCrossed, ChefHat, Phone, CalendarClock, AlertCircle, CheckCircle2, Loader2, Lock } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { Button } from '../components/Button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getAvailableTimeSlots, createReservation, getClosedDates, joinWaitlist } from '../lib/api';
import { useFeatureFlag, useFeatureFlags } from '../lib/featureFlags';
import { reservationSchema, type ReservationFormData } from '../lib/validators';
import { PageTransition } from '../components/PageTransition';
import { useLanguage, type Language } from '../lib/i18n';
import { trackEvent } from '../lib/analytics';
import reservationImage from '../Img/al-gobbo-2026/reserved-table-wide-1600.webp';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

type TimeSlot = Awaited<ReturnType<typeof getAvailableTimeSlots>>[number];

type ReservationField = 'date' | 'time' | 'name' | 'email' | 'phone';
type ReservationFieldErrors = Partial<Record<ReservationField, string>>;
type WaitlistBannerSource = 'slot' | 'backend';

// Common country phone prefixes
const PHONE_PREFIXES = [
  { code: '+39', flag: '🇮🇹', label: 'Italia (+39)' },
  { code: '+44', flag: '🇬🇧', label: 'UK (+44)' },
  { code: '+33', flag: '🇫🇷', label: 'France (+33)' },
  { code: '+49', flag: '🇩🇪', label: 'Deutschland (+49)' },
  { code: '+34', flag: '🇪🇸', label: 'España (+34)' },
  { code: '+1',  flag: '🇺🇸', label: 'USA/CA (+1)' },
  { code: '+31', flag: '🇳🇱', label: 'Nederland (+31)' },
  { code: '+41', flag: '🇨🇭', label: 'Schweiz (+41)' },
  { code: '+43', flag: '🇦🇹', label: 'Österreich (+43)' },
  { code: '+32', flag: '🇧🇪', label: 'Belgique (+32)' },
  { code: '+351', flag: '🇵🇹', label: 'Portugal (+351)' },
  { code: '+46', flag: '🇸🇪', label: 'Sverige (+46)' },
  { code: '+47', flag: '🇳🇴', label: 'Norge (+47)' },
  { code: '+45', flag: '🇩🇰', label: 'Danmark (+45)' },
  { code: '+358', flag: '🇫🇮', label: 'Suomi (+358)' },
  { code: '+48', flag: '🇵🇱', label: 'Polska (+48)' },
  { code: '+420', flag: '🇨🇿', label: 'Česko (+420)' },
  { code: '+36', flag: '🇭🇺', label: 'Magyarország (+36)' },
  { code: '+40', flag: '🇷🇴', label: 'România (+40)' },
  { code: '+30', flag: '🇬🇷', label: 'Ελλάδα (+30)' },
  { code: '+55', flag: '🇧🇷', label: 'Brasil (+55)' },
  { code: '+81', flag: '🇯🇵', label: '日本 (+81)' },
  { code: '+86', flag: '🇨🇳', label: '中国 (+86)' },
  { code: '+91', flag: '🇮🇳', label: 'India (+91)' },
  { code: '+61', flag: '🇦🇺', label: 'Australia (+61)' },
  { code: 'other', flag: '🌍', label: 'Altro / Other...' },
];

type ReservationCopy = {
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  detailsTitle: string;
  suspendedTitle: string;
  suspendedText: string;
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  customPrefix: string;
  phoneNumber: string;
  guestsLabel: string;
  guest: string;
  guests: string;
  date: string;
  availableTimes: string;
  noTimes: string;
  waitlistFull: string;
  waitlistPrompt: string;
  waitlistJoining: string;
  waitlistJoin: string;
  waitlistLabel: string;
  waitlistSuccess: string;
  waitlistContact: string;
  occasion: string;
  chooseOccasion: string;
  occasions: Record<'birthday' | 'anniversary' | 'business' | 'date' | 'other', string>;
  requests: string;
  requestsPlaceholder: string;
  requestsPrivacy: string;
  privacyPrefix: string;
  privacyLink: string;
  privacyMiddle: string;
  termsLink: string;
  privacySuffix: string;
  marketing: string;
  whatsapp: string;
  whatsappSent: string;
  processing: string;
  confirm: string;
  policyTitle: string;
  policyItems: string[];
  importantTitle: string;
  importantItems: string[];
  helpTitle: string;
  helpBody: string;
  confirmationTitle: string;
  confirmationThanks: string;
  confirmationDetails: string;
  nameLabel: string;
  dateLabel: string;
  timeLabel: string;
  emailSent: string;
  emailMissing: string;
  manageBooking: string;
  manageBookingHint: string;
  returnHome: string;
  errors: {
    privacy: string;
    unavailableDate: string;
    closedDates: string;
    slots: string;
    unexpected: string;
    waitlistContact: string;
    waitlist: string;
  };
};

const reservationCopy: Record<Language, ReservationCopy> = {
  en: {
    seoTitle: 'Book a Table', seoDescription: 'Book your table at Al Gobbo di Rialto in Venice. Live availability for lunch and dinner.',
    heroTitle: 'Make a Reservation', heroSubtitle: 'Join us for an unforgettable dining experience', detailsTitle: 'Reservation Details',
    suspendedTitle: 'Online reservations are temporarily paused', suspendedText: 'Please call us to reserve your table:',
    fullName: 'Full Name', email: 'Email', phone: 'Phone Number', countryCode: 'Select country code *', customPrefix: '+00 custom prefix', phoneNumber: 'Number',
    guestsLabel: 'Number of Guests', guest: 'Guest', guests: 'Guests', date: 'Date', availableTimes: 'Available Time Slots', noTimes: 'No available time slots for this date',
    waitlistFull: 'This time is fully booked.', waitlistPrompt: 'Join the waitlist and we will contact you if a table becomes available.', waitlistJoining: 'Joining...', waitlistJoin: 'Yes, join the waitlist', waitlistLabel: 'Waitlist', waitlistSuccess: 'You are on the waitlist!', waitlistContact: 'We will contact you if a table becomes available for',
    occasion: 'Occasion (Optional)', chooseOccasion: 'Select an occasion', occasions: { birthday: 'Birthday', anniversary: 'Anniversary', business: 'Business Dinner', date: 'Date Night', other: 'Other Special Occasion' },
    requests: 'Special Requests (Optional)', requestsPlaceholder: 'Seating preferences or a note for our team...', requestsPrivacy: 'Do not enter health or other sensitive data here. For allergies, call the restaurant before your visit.',
    privacyPrefix: 'I confirm that I have read the', privacyLink: 'Privacy Policy', privacyMiddle: 'and accept the', termsLink: 'Booking Terms', privacySuffix: '. *',
    marketing: 'I would like to receive marketing communications about special offers, events and news. I can unsubscribe at any time.', whatsapp: 'I would like to receive WhatsApp service confirmations and updates for this reservation from Al Gobbo di Rialto. I can opt out at any time by replying STOP.', whatsappSent: 'We also sent the reservation confirmation on WhatsApp.', processing: 'Processing...', confirm: 'Confirm Reservation',
    policyTitle: 'Reservation Policy', policyItems: ['Reservations can be made up to 3 months in advance', 'For last-minute requests, call us if online times are unavailable', 'Large group bookings (9+ guests) require direct contact'],
    importantTitle: 'Important Information', importantItems: ['Use the private link in your confirmation email to cancel', 'For same-day changes, please call +39 041 520 4603', 'Tell us about allergies or dietary requirements before ordering'],
    helpTitle: 'Need help booking?', helpBody: 'Call the restaurant for groups of nine or more, same-day questions or accessibility needs.',
    confirmationTitle: 'Reservation Confirmed!', confirmationThanks: 'Thank you for choosing Al Gobbo di Rialto. We look forward to welcoming you on', confirmationDetails: 'Reservation Details', nameLabel: 'Name', dateLabel: 'Date', timeLabel: 'Time', emailSent: 'A confirmation email has been sent to', emailMissing: 'Your table is reserved, but the email could not be delivered. Please call us if you need to change or cancel it.', manageBooking: 'Manage or cancel booking', manageBookingHint: 'Save this private link in case you need it later.', returnHome: 'Return to Home',
    errors: { privacy: 'Confirm that you have read the privacy notice and accept the booking terms', unavailableDate: 'This date is not available for reservations', closedDates: 'Failed to load closed dates', slots: 'Failed to load available time slots', unexpected: 'An unexpected error occurred. Please try again later.', waitlistContact: 'Enter your name, email and phone number before joining the waitlist', waitlist: 'Could not join the waitlist. Please try again.' },
  },
  it: {
    seoTitle: 'Prenota un Tavolo', seoDescription: 'Prenota il tuo tavolo da Al Gobbo di Rialto a Venezia. Disponibilità in tempo reale per pranzo e cena.',
    heroTitle: 'Prenota un Tavolo', heroSubtitle: 'Vivi un’autentica esperienza veneziana', detailsTitle: 'Dettagli della Prenotazione',
    suspendedTitle: 'Prenotazioni online temporaneamente sospese', suspendedText: 'Chiamaci per prenotare il tuo tavolo:',
    fullName: 'Nome e Cognome', email: 'Email', phone: 'Numero di Telefono', countryCode: 'Seleziona il prefisso *', customPrefix: '+00 prefisso', phoneNumber: 'Numero',
    guestsLabel: 'Numero di Ospiti', guest: 'Ospite', guests: 'Ospiti', date: 'Data', availableTimes: 'Orari Disponibili', noTimes: 'Nessun orario disponibile per questa data',
    waitlistFull: 'Questo orario è esaurito.', waitlistPrompt: 'Iscriviti alla lista d’attesa: ti contatteremo se si libera un tavolo.', waitlistJoining: 'Iscrizione...', waitlistJoin: 'Sì, iscrivimi alla lista', waitlistLabel: 'Lista', waitlistSuccess: 'Sei in lista d’attesa!', waitlistContact: 'Ti contatteremo se si libera un tavolo per',
    occasion: 'Occasione (Facoltativa)', chooseOccasion: 'Seleziona un’occasione', occasions: { birthday: 'Compleanno', anniversary: 'Anniversario', business: 'Cena di Lavoro', date: 'Cena Romantica', other: 'Altra Occasione Speciale' },
    requests: 'Richieste Speciali (Facoltative)', requestsPlaceholder: 'Preferenze per il tavolo o una nota per lo staff...', requestsPrivacy: 'Non inserire qui dati sanitari o altre informazioni sensibili. Per allergie chiama il ristorante prima della visita.',
    privacyPrefix: 'Confermo di aver letto la', privacyLink: 'Privacy Policy', privacyMiddle: 'e accetto le', termsLink: 'Condizioni di prenotazione', privacySuffix: '. *',
    marketing: 'Desidero ricevere comunicazioni su offerte, eventi e novità. Posso annullare l’iscrizione in qualsiasi momento.', whatsapp: 'Desidero ricevere da Al Gobbo di Rialto su WhatsApp conferme e aggiornamenti di servizio relativi a questa prenotazione. Posso revocare in qualsiasi momento rispondendo STOP.', whatsappSent: 'Abbiamo inviato la conferma della prenotazione anche su WhatsApp.', processing: 'Invio in corso...', confirm: 'Conferma Prenotazione',
    policyTitle: 'Politica di Prenotazione', policyItems: ['Puoi prenotare fino a 3 mesi in anticipo', 'Per richieste all’ultimo momento chiamaci se non trovi orari online', 'Per gruppi di 9 o più persone è necessario contattarci direttamente'],
    importantTitle: 'Informazioni Importanti', importantItems: ['Per cancellare usa il link personale ricevuto via email', 'Per modifiche in giornata chiama il +39 041 520 4603', 'Segnalaci allergie o esigenze alimentari prima di ordinare'],
    helpTitle: 'Serve aiuto?', helpBody: 'Chiamaci per gruppi di almeno nove persone, richieste in giornata o esigenze di accessibilità.',
    confirmationTitle: 'Prenotazione Confermata!', confirmationThanks: 'Grazie per aver scelto Al Gobbo di Rialto. Ti aspettiamo il', confirmationDetails: 'Dettagli della Prenotazione', nameLabel: 'Nome', dateLabel: 'Data', timeLabel: 'Ora', emailSent: 'Abbiamo inviato un’email di conferma a', emailMissing: 'Il tavolo è prenotato, ma non è stato possibile consegnare l’email. Chiamaci per modifiche o cancellazioni.', manageBooking: 'Gestisci o cancella', manageBookingHint: 'Salva questo link personale se ti servirà più tardi.', returnHome: 'Torna alla Home',
    errors: { privacy: 'Conferma di aver letto l’informativa e accetta le condizioni di prenotazione', unavailableDate: 'Questa data non è disponibile', closedDates: 'Impossibile caricare i giorni di chiusura', slots: 'Impossibile caricare gli orari disponibili', unexpected: 'Si è verificato un errore. Riprova più tardi.', waitlistContact: 'Inserisci nome, email e telefono prima di iscriverti alla lista d’attesa', waitlist: 'Impossibile iscriversi alla lista d’attesa. Riprova.' },
  },
  fr: {
    seoTitle: 'Réserver une Table', seoDescription: 'Réservez votre table à Al Gobbo di Rialto à Venise. Disponibilités en temps réel pour le déjeuner et le dîner.',
    heroTitle: 'Réserver une Table', heroSubtitle: 'Vivez une expérience vénitienne inoubliable', detailsTitle: 'Détails de la Réservation',
    suspendedTitle: 'Les réservations en ligne sont temporairement suspendues', suspendedText: 'Appelez-nous pour réserver votre table :',
    fullName: 'Nom Complet', email: 'E-mail', phone: 'Téléphone', countryCode: 'Choisir l’indicatif *', customPrefix: '+00 indicatif', phoneNumber: 'Numéro',
    guestsLabel: 'Nombre de Personnes', guest: 'Personne', guests: 'Personnes', date: 'Date', availableTimes: 'Horaires Disponibles', noTimes: 'Aucun horaire disponible à cette date',
    waitlistFull: 'Cet horaire est complet.', waitlistPrompt: 'Inscrivez-vous sur liste d’attente ; nous vous contacterons si une table se libère.', waitlistJoining: 'Inscription...', waitlistJoin: 'Rejoindre la liste', waitlistLabel: 'Attente', waitlistSuccess: 'Vous êtes sur liste d’attente !', waitlistContact: 'Nous vous contacterons si une table se libère pour le',
    occasion: 'Occasion (Facultatif)', chooseOccasion: 'Choisir une occasion', occasions: { birthday: 'Anniversaire', anniversary: 'Anniversaire de Mariage', business: 'Dîner d’Affaires', date: 'Dîner en Amoureux', other: 'Autre Occasion' },
    requests: 'Demandes Spéciales (Facultatif)', requestsPlaceholder: 'Préférence de table ou message pour l’équipe...', requestsPrivacy: 'N’inscrivez pas ici de données de santé ou sensibles. Pour les allergies, appelez le restaurant avant votre visite.',
    privacyPrefix: 'Je confirme avoir lu la', privacyLink: 'Politique de confidentialité', privacyMiddle: 'et accepter les', termsLink: 'Conditions de réservation', privacySuffix: '. *',
    marketing: 'Je souhaite recevoir des nouvelles sur les offres et événements. Je peux me désinscrire à tout moment.', whatsapp: 'Je souhaite recevoir sur WhatsApp les confirmations et mises à jour de service d’Al Gobbo di Rialto concernant cette réservation. Je peux me désinscrire à tout moment en répondant STOP.', whatsappSent: 'La confirmation de réservation a également été envoyée sur WhatsApp.', processing: 'Traitement...', confirm: 'Confirmer la Réservation',
    policyTitle: 'Conditions de Réservation', policyItems: ['Réservation possible jusqu’à 3 mois à l’avance', 'Pour une demande de dernière minute, appelez-nous si aucun horaire n’est disponible', 'Les groupes de 9 personnes ou plus doivent nous contacter'],
    importantTitle: 'Informations Importantes', importantItems: ['Utilisez le lien personnel reçu par e-mail pour annuler', 'Pour une modification le jour même, appelez le +39 041 520 4603', 'Signalez toute allergie ou exigence alimentaire avant de commander'],
    helpTitle: 'Besoin d’aide ?', helpBody: 'Appelez-nous pour les groupes de neuf personnes ou plus, les demandes du jour ou l’accessibilité.',
    confirmationTitle: 'Réservation Confirmée !', confirmationThanks: 'Merci d’avoir choisi Al Gobbo di Rialto. Nous vous accueillerons le', confirmationDetails: 'Détails de la Réservation', nameLabel: 'Nom', dateLabel: 'Date', timeLabel: 'Heure', emailSent: 'Un e-mail de confirmation a été envoyé à', emailMissing: 'Votre table est réservée, mais l’e-mail n’a pas pu être remis. Appelez-nous pour toute modification ou annulation.', manageBooking: 'Gérer ou annuler', manageBookingHint: 'Conservez ce lien privé si vous en avez besoin plus tard.', returnHome: 'Retour à l’Accueil',
    errors: { privacy: 'Confirmez la lecture de la politique de confidentialité et acceptez les conditions de réservation', unavailableDate: 'Cette date n’est pas disponible', closedDates: 'Impossible de charger les jours de fermeture', slots: 'Impossible de charger les horaires', unexpected: 'Une erreur est survenue. Réessayez plus tard.', waitlistContact: 'Saisissez votre nom, e-mail et téléphone avant de rejoindre la liste d’attente', waitlist: 'Impossible de rejoindre la liste d’attente. Réessayez.' },
  },
  de: {
    seoTitle: 'Tisch Reservieren', seoDescription: 'Reservieren Sie Ihren Tisch im Al Gobbo di Rialto in Venedig. Live-Verfügbarkeit für Mittag- und Abendessen.',
    heroTitle: 'Tisch Reservieren', heroSubtitle: 'Erleben Sie einen unvergesslichen Abend in Venedig', detailsTitle: 'Reservierungsdetails',
    suspendedTitle: 'Online-Reservierungen sind vorübergehend pausiert', suspendedText: 'Rufen Sie uns für eine Reservierung an:',
    fullName: 'Vollständiger Name', email: 'E-Mail', phone: 'Telefonnummer', countryCode: 'Ländervorwahl wählen *', customPrefix: '+00 Vorwahl', phoneNumber: 'Nummer',
    guestsLabel: 'Anzahl der Gäste', guest: 'Gast', guests: 'Gäste', date: 'Datum', availableTimes: 'Verfügbare Uhrzeiten', noTimes: 'Für dieses Datum sind keine Uhrzeiten verfügbar',
    waitlistFull: 'Diese Uhrzeit ist ausgebucht.', waitlistPrompt: 'Setzen Sie sich auf die Warteliste. Wir melden uns, wenn ein Tisch frei wird.', waitlistJoining: 'Wird eingetragen...', waitlistJoin: 'Auf die Warteliste', waitlistLabel: 'Warteliste', waitlistSuccess: 'Sie stehen auf der Warteliste!', waitlistContact: 'Wir melden uns, wenn ein Tisch frei wird für den',
    occasion: 'Anlass (Optional)', chooseOccasion: 'Anlass auswählen', occasions: { birthday: 'Geburtstag', anniversary: 'Jahrestag', business: 'Geschäftsessen', date: 'Romantisches Dinner', other: 'Anderer Besonderer Anlass' },
    requests: 'Besondere Wünsche (Optional)', requestsPlaceholder: 'Sitzplatzwunsch oder Nachricht an das Team...', requestsPrivacy: 'Tragen Sie hier keine Gesundheits- oder sensiblen Daten ein. Bei Allergien rufen Sie das Restaurant vor Ihrem Besuch an.',
    privacyPrefix: 'Ich bestätige, die', privacyLink: 'Datenschutzerklärung', privacyMiddle: 'gelesen zu haben, und akzeptiere die', termsLink: 'Reservierungsbedingungen', privacySuffix: '. *',
    marketing: 'Ich möchte Neuigkeiten zu Angeboten und Veranstaltungen erhalten. Eine Abmeldung ist jederzeit möglich.', whatsapp: 'Ich möchte Bestätigungen und Service-Updates zu dieser Reservierung von Al Gobbo di Rialto über WhatsApp erhalten. Ich kann mich jederzeit mit der Antwort STOP abmelden.', whatsappSent: 'Die Reservierungsbestätigung wurde auch über WhatsApp gesendet.', processing: 'Wird verarbeitet...', confirm: 'Reservierung Bestätigen',
    policyTitle: 'Reservierungsbedingungen', policyItems: ['Reservierungen sind bis zu 3 Monate im Voraus möglich', 'Rufen Sie uns kurzfristig an, wenn online keine Uhrzeit verfügbar ist', 'Gruppen ab 9 Personen müssen uns direkt kontaktieren'],
    importantTitle: 'Wichtige Informationen', importantItems: ['Zum Stornieren den persönlichen Link aus der E-Mail verwenden', 'Für Änderungen am selben Tag: +39 041 520 4603', 'Bitte Allergien oder Ernährungswünsche vor der Bestellung mitteilen'],
    helpTitle: 'Hilfe bei der Reservierung?', helpBody: 'Rufen Sie uns bei Gruppen ab neun Personen, kurzfristigen Fragen oder Barrierefreiheitsbedarf an.',
    confirmationTitle: 'Reservierung Bestätigt!', confirmationThanks: 'Vielen Dank, dass Sie Al Gobbo di Rialto gewählt haben. Wir erwarten Sie am', confirmationDetails: 'Reservierungsdetails', nameLabel: 'Name', dateLabel: 'Datum', timeLabel: 'Uhrzeit', emailSent: 'Eine Bestätigungs-E-Mail wurde gesendet an', emailMissing: 'Ihr Tisch ist reserviert, aber die E-Mail konnte nicht zugestellt werden. Bitte rufen Sie uns für Änderungen oder Stornierungen an.', manageBooking: 'Verwalten oder stornieren', manageBookingHint: 'Speichern Sie diesen privaten Link für später.', returnHome: 'Zur Startseite',
    errors: { privacy: 'Bestätigen Sie die Datenschutzhinweise und akzeptieren Sie die Reservierungsbedingungen', unavailableDate: 'Dieses Datum ist nicht verfügbar', closedDates: 'Schließtage konnten nicht geladen werden', slots: 'Verfügbare Uhrzeiten konnten nicht geladen werden', unexpected: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.', waitlistContact: 'Geben Sie Name, E-Mail und Telefonnummer ein, bevor Sie sich auf die Warteliste setzen', waitlist: 'Die Warteliste konnte nicht aktualisiert werden. Bitte erneut versuchen.' },
  },
  es: {
    seoTitle: 'Reservar una Mesa', seoDescription: 'Reserva tu mesa en Al Gobbo di Rialto, Venecia. Disponibilidad en tiempo real para almuerzo y cena.',
    heroTitle: 'Reservar una Mesa', heroSubtitle: 'Disfruta de una experiencia veneciana inolvidable', detailsTitle: 'Datos de la Reserva',
    suspendedTitle: 'Las reservas online están temporalmente pausadas', suspendedText: 'Llámanos para reservar tu mesa:',
    fullName: 'Nombre Completo', email: 'Correo Electrónico', phone: 'Teléfono', countryCode: 'Selecciona el prefijo *', customPrefix: '+00 prefijo', phoneNumber: 'Número',
    guestsLabel: 'Número de Personas', guest: 'Persona', guests: 'Personas', date: 'Fecha', availableTimes: 'Horarios Disponibles', noTimes: 'No hay horarios disponibles para esta fecha',
    waitlistFull: 'Este horario está completo.', waitlistPrompt: 'Únete a la lista de espera y te avisaremos si queda una mesa libre.', waitlistJoining: 'Inscribiendo...', waitlistJoin: 'Unirme a la lista', waitlistLabel: 'Espera', waitlistSuccess: '¡Estás en la lista de espera!', waitlistContact: 'Te contactaremos si queda una mesa libre para el',
    occasion: 'Ocasión (Opcional)', chooseOccasion: 'Selecciona una ocasión', occasions: { birthday: 'Cumpleaños', anniversary: 'Aniversario', business: 'Cena de Negocios', date: 'Cena Romántica', other: 'Otra Ocasión Especial' },
    requests: 'Peticiones Especiales (Opcional)', requestsPlaceholder: 'Preferencia de mesa o una nota para el equipo...', requestsPrivacy: 'No introduzcas aquí datos de salud ni sensibles. Para alergias, llama al restaurante antes de tu visita.',
    privacyPrefix: 'Confirmo que he leído la', privacyLink: 'Política de privacidad', privacyMiddle: 'y acepto las', termsLink: 'Condiciones de reserva', privacySuffix: '. *',
    marketing: 'Deseo recibir noticias sobre ofertas y eventos. Puedo darme de baja en cualquier momento.', whatsapp: 'Deseo recibir por WhatsApp confirmaciones y actualizaciones de servicio de Al Gobbo di Rialto sobre esta reserva. Puedo darme de baja en cualquier momento respondiendo STOP.', whatsappSent: 'También hemos enviado la confirmación de la reserva por WhatsApp.', processing: 'Procesando...', confirm: 'Confirmar Reserva',
    policyTitle: 'Política de Reservas', policyItems: ['Puedes reservar con hasta 3 meses de antelación', 'Para peticiones de última hora, llámanos si no hay horarios online', 'Los grupos de 9 o más personas deben contactar directamente'],
    importantTitle: 'Información Importante', importantItems: ['Usa el enlace personal del correo de confirmación para cancelar', 'Para cambios el mismo día, llama al +39 041 520 4603', 'Informa de alergias o necesidades alimentarias antes de pedir'],
    helpTitle: '¿Necesitas ayuda?', helpBody: 'Llámanos para grupos de nueve o más personas, dudas del mismo día o necesidades de accesibilidad.',
    confirmationTitle: '¡Reserva Confirmada!', confirmationThanks: 'Gracias por elegir Al Gobbo di Rialto. Te esperamos el', confirmationDetails: 'Datos de la Reserva', nameLabel: 'Nombre', dateLabel: 'Fecha', timeLabel: 'Hora', emailSent: 'Hemos enviado un correo de confirmación a', emailMissing: 'Tu mesa está reservada, pero no se pudo entregar el correo. Llámanos para cambios o cancelaciones.', manageBooking: 'Gestionar o cancelar', manageBookingHint: 'Guarda este enlace privado por si lo necesitas más tarde.', returnHome: 'Volver al Inicio',
    errors: { privacy: 'Confirma que has leído la política de privacidad y acepta las condiciones de reserva', unavailableDate: 'Esta fecha no está disponible', closedDates: 'No se pudieron cargar los días de cierre', slots: 'No se pudieron cargar los horarios', unexpected: 'Se produjo un error. Inténtalo más tarde.', waitlistContact: 'Introduce nombre, correo y teléfono antes de unirte a la lista de espera', waitlist: 'No se pudo completar la inscripción. Inténtalo de nuevo.' },
  },
};

const dateLocales: Record<Language, string> = {
  en: 'en-GB', it: 'it-IT', fr: 'fr-FR', de: 'de-DE', es: 'es-ES',
};

function veniceCalendarDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

function addCalendarMonths(isoDate: string, months: number) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const absoluteMonth = year * 12 + (month - 1) + months;
  const targetYear = Math.floor(absoluteMonth / 12);
  const targetMonthIndex = absoluteMonth % 12;
  const lastDay = new Date(Date.UTC(targetYear, targetMonthIndex + 1, 0)).getUTCDate();
  const targetDay = Math.min(day, lastDay);
  return `${targetYear}-${String(targetMonthIndex + 1).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`;
}

const bookingFlowCopy: Record<Language, {
  steps: [string, string, string];
  continue: string;
  back: string;
  selectionError: string;
  contactError: string;
  summaryTitle: string;
  summaryIntro: string;
  progress: string;
  retry: string;
}> = {
  en: { steps: ['Table', 'Contact', 'Confirm'], continue: 'Continue', back: 'Back', selectionError: 'Choose a date and an available time', contactError: 'Enter a valid name, email and phone number', summaryTitle: 'Check your reservation', summaryIntro: 'Review the details before confirming.', progress: 'Reservation progress', retry: 'Try again' },
  it: { steps: ['Tavolo', 'Contatti', 'Conferma'], continue: 'Continua', back: 'Indietro', selectionError: 'Scegli una data e un orario disponibile', contactError: 'Inserisci nome, email e telefono validi', summaryTitle: 'Controlla la prenotazione', summaryIntro: 'Verifica i dati prima di confermare.', progress: 'Avanzamento della prenotazione', retry: 'Riprova' },
  fr: { steps: ['Table', 'Contact', 'Confirmation'], continue: 'Continuer', back: 'Retour', selectionError: 'Choisissez une date et une heure disponible', contactError: 'Saisissez un nom, un e-mail et un téléphone valides', summaryTitle: 'Vérifiez votre réservation', summaryIntro: 'Vérifiez les informations avant de confirmer.', progress: 'Progression de la réservation', retry: 'Réessayer' },
  de: { steps: ['Tisch', 'Kontakt', 'Bestätigung'], continue: 'Weiter', back: 'Zurück', selectionError: 'Wählen Sie ein Datum und eine verfügbare Uhrzeit', contactError: 'Geben Sie einen gültigen Namen, eine E-Mail-Adresse und eine Telefonnummer ein', summaryTitle: 'Reservierung prüfen', summaryIntro: 'Prüfen Sie Ihre Angaben vor der Bestätigung.', progress: 'Reservierungsfortschritt', retry: 'Erneut versuchen' },
  es: { steps: ['Mesa', 'Contacto', 'Confirmación'], continue: 'Continuar', back: 'Atrás', selectionError: 'Elige una fecha y una hora disponible', contactError: 'Introduce un nombre, correo y teléfono válidos', summaryTitle: 'Revisa tu reserva', summaryIntro: 'Comprueba los datos antes de confirmar.', progress: 'Progreso de la reserva', retry: 'Intentar de nuevo' },
};

const reservationContactSchema = reservationSchema.pick({ name: true, email: true, phone: true });

export function ReservePage() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const { language } = useLanguage();
  const copy = reservationCopy[language];
  const flowCopy = bookingFlowCopy[language];
  const waitlistEnabled = useFeatureFlag('waitlist');
  const onlineReservationsEnabled = useFeatureFlag('online_reservations');
  const whatsappNotificationsEnabled = useFeatureFlag('whatsapp_notifications', false);
  const { loading: flagsLoading } = useFeatureFlags();
  const [formData, setFormData] = useState<ReservationFormData>({
    date: '',
    time: '',
    guests: 2,
    name: '',
    email: '',
    phone: '',
    occasion: '',
    special_requests: '',
    marketing_consent: false,
    whatsapp_opt_in: false,
  });
  const [phonePrefix, setPhonePrefix] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customPrefix, setCustomPrefix] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);
  const [confirmationWhatsAppSent, setConfirmationWhatsAppSent] = useState(false);
  const [cancellationToken, setCancellationToken] = useState('');
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [slotLoadFailed, setSlotLoadFailed] = useState(false);
  const [closedDates, setClosedDates] = useState<string[]>([]);
  const [closedDatesLoaded, setClosedDatesLoaded] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [privacyError, setPrivacyError] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  const [waitlistBannerSource, setWaitlistBannerSource] = useState<WaitlistBannerSource | null>(null);
  const showWaitlistBanner = waitlistBannerSource !== null;
  const [isJoiningWaitlist, setIsJoiningWaitlist] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [fieldErrors, setFieldErrors] = useState<ReservationFieldErrors>({});
  const formTopRef = useRef<HTMLFormElement>(null);
  const slotRequestIdRef = useRef(0);
  const confirmationDialogRef = useRef<HTMLDivElement>(null);
  const confirmationTitleRef = useRef<HTMLHeadingElement>(null);
  const confirmationCloseRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const displayDate = formData.date
    ? new Date(`${formData.date}T12:00:00Z`).toLocaleDateString(dateLocales[language], {
        timeZone: 'Europe/Rome',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const fetchClosedDates = useCallback(async () => {
    try {
      const dates = await getClosedDates();
      setClosedDates(dates.map(d => d.date));
    } catch (error) {
      console.error('Error fetching closed dates:', error);
      toast.error(copy.errors.closedDates);
    } finally {
      setClosedDatesLoaded(true);
    }
  }, [copy.errors.closedDates]);

  const loadTimeSlots = useCallback(async (date: string) => {
    const requestId = ++slotRequestIdRef.current;
    setIsLoadingTimeSlots(true);
    setSlotLoadFailed(false);
    setTimeSlots([]);
    setWaitlistBannerSource(null);
    setWaitlistSuccess(false);
    try {
      const slots = await getAvailableTimeSlots(date);
      if (requestId === slotRequestIdRef.current) setTimeSlots(slots);
    } catch (error) {
      if (requestId !== slotRequestIdRef.current) return;
      console.error('Error loading time slots:', error);
      setSlotLoadFailed(true);
      toast.error(copy.errors.slots);
    } finally {
      if (requestId === slotRequestIdRef.current) setIsLoadingTimeSlots(false);
    }
  }, [copy.errors.slots]);

  // Keep formData.phone in sync whenever prefix or number changes
  useEffect(() => {
    const prefix = phonePrefix === 'other' ? customPrefix : phonePrefix;
    setFormData(prev => ({ ...prev, phone: prefix && phoneNumber ? `${prefix} ${phoneNumber}` : '' }));
  }, [phonePrefix, phoneNumber, customPrefix]);

  const today = veniceCalendarDate();
  const maxDateString = addCalendarMonths(today, 3);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedDate = params.get('date') || '';
    const requestedTime = params.get('time') || '';
    const dateIsValid = /^\d{4}-\d{2}-\d{2}$/.test(requestedDate)
      && requestedDate >= today
      && requestedDate <= maxDateString;
    const timeIsValid = /^([01]\d|2[0-3]):[0-5]\d$/.test(requestedTime);

    if (dateIsValid) {
      setFormData(previous => ({
        ...previous,
        date: requestedDate,
        time: timeIsValid ? requestedTime : previous.time,
      }));
    }
  }, [maxDateString, today]);

  useEffect(() => {
    fetchClosedDates();
  }, [fetchClosedDates]);

  useEffect(() => {
    if (!formData.date) {
      slotRequestIdRef.current += 1;
      setTimeSlots([]);
      setIsLoadingTimeSlots(false);
      setSlotLoadFailed(false);
      return;
    }
    if (!closedDatesLoaded) return;
    if (closedDates.includes(formData.date)) {
      toast.error(copy.errors.unavailableDate, {
        icon: <Lock className="text-red-500" />,
        duration: 4000
      });
      setFormData(prev => ({ ...prev, date: '', time: '' }));
      return;
    }
    loadTimeSlots(formData.date);
  }, [closedDates, closedDatesLoaded, copy.errors.unavailableDate, formData.date, loadTimeSlots]);

  useEffect(() => {
    if (!formData.time) return;
    const selectedSlot = timeSlots.find((slot) => slot.time === formData.time);
    if (!selectedSlot) return;

    const canFit = selectedSlot.available && selectedSlot.remainingCapacity >= formData.guests;
    if (canFit && waitlistBannerSource === 'slot' && !waitlistSuccess) {
      setWaitlistBannerSource(null);
      return;
    }

    if (!canFit && !(waitlistEnabled && showWaitlistBanner)) {
      setWaitlistBannerSource(null);
      setFormData((previous) => ({ ...previous, time: '' }));
    }
  }, [formData.guests, formData.time, showWaitlistBanner, timeSlots, waitlistBannerSource, waitlistEnabled, waitlistSuccess]);

  const moveToStep = (step: 1 | 2 | 3) => {
    setBookingStep(step);
    window.requestAnimationFrame(() => {
      formTopRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      const targetId = step === 1 ? 'reservation-date' : step === 2 ? 'reservation-name' : 'reservation-summary-title';
      document.getElementById(targetId)?.focus({ preventScroll: true });
    });
  };

  const focusField = (field: ReservationField) => {
    const targetId = field === 'time'
      ? 'reservation-time-options'
      : field === 'phone'
        ? 'reservation-phone-prefix'
        : `reservation-${field}`;
    window.requestAnimationFrame(() => document.getElementById(targetId)?.focus({ preventScroll: false }));
  };

  const currentPhone = () => {
    const prefix = phonePrefix === 'other' ? customPrefix : phonePrefix;
    return prefix && phoneNumber ? `${prefix} ${phoneNumber}`.trim() : '';
  };

  const validateContactFields = () => {
    const phone = currentPhone();
    const validation = reservationContactSchema.safeParse({ ...formData, phone });
    if (validation.success) {
      setFormData((current) => ({ ...current, phone }));
      setFieldErrors((current) => ({ ...current, name: undefined, email: undefined, phone: undefined }));
      return true;
    }

    const nextErrors: ReservationFieldErrors = {};
    validation.error.issues.forEach((issue) => {
      const field = issue.path[0] as ReservationField;
      if (field === 'name' || field === 'email' || field === 'phone') nextErrors[field] = flowCopy.contactError;
    });
    setFieldErrors((current) => ({ ...current, ...nextErrors }));
    const firstInvalid = (['name', 'email', 'phone'] as const).find((field) => nextErrors[field]);
    if (firstInvalid) focusField(firstInvalid);
    return false;
  };

  const handleContinue = () => {
    if (bookingStep === 1) {
      const selectedSlot = timeSlots.find((slot) => slot.time === formData.time);
      const slotCanFit = Boolean(selectedSlot?.available && selectedSlot.remainingCapacity >= formData.guests);
      const waitlistSelection = Boolean(selectedSlot && waitlistEnabled && showWaitlistBanner);
      if (!formData.date || !formData.time || (!slotCanFit && !waitlistSelection)) {
        const nextErrors: ReservationFieldErrors = {
          date: formData.date ? undefined : flowCopy.selectionError,
          time: formData.time ? undefined : flowCopy.selectionError,
        };
        setFieldErrors((current) => ({ ...current, ...nextErrors }));
        focusField(!formData.date ? 'date' : 'time');
        toast.error(flowCopy.selectionError);
        return;
      }
      setFieldErrors((current) => ({ ...current, date: undefined, time: undefined }));
      moveToStep(2);
      return;
    }

    if (!validateContactFields()) {
      toast.error(flowCopy.contactError);
      return;
    }
    moveToStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = reservationSchema.safeParse({ ...formData, phone: currentPhone(), marketing_consent: marketingConsent });
    if (!validation.success) {
      const nextErrors: ReservationFieldErrors = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as ReservationField;
        if (['date', 'time', 'name', 'email', 'phone'].includes(field)) {
          nextErrors[field] = field === 'date' || field === 'time' ? flowCopy.selectionError : flowCopy.contactError;
        }
      });
      setFieldErrors((current) => ({ ...current, ...nextErrors }));
      const firstInvalid = (['date', 'time', 'name', 'email', 'phone'] as const).find((field) => nextErrors[field]);
      const targetStep = firstInvalid === 'date' || firstInvalid === 'time' ? 1 : 2;
      moveToStep(targetStep);
      if (firstInvalid) focusField(firstInvalid);
      toast.error(targetStep === 1 ? flowCopy.selectionError : flowCopy.contactError);
      return;
    }

    if (!formData.date || !formData.time) {
      moveToStep(1);
      toast.error(flowCopy.selectionError);
      return;
    }

    if (!privacyConsent) {
      setPrivacyError(true);
      toast.error(copy.errors.privacy);
      window.requestAnimationFrame(() => document.getElementById('privacyConsent')?.focus());
      return;
    }

    if (closedDates.includes(formData.date)) {
      toast.error(copy.errors.unavailableDate, {
        icon: <Lock className="text-red-500" />,
        duration: 4000
      });
      return;
    }

    setIsLoading(true);
    trackEvent('booking_started', { guests: formData.guests });

    try {
      const reservationData = {
        ...validation.data,
        marketing_consent: marketingConsent,
        whatsapp_opt_in: whatsappNotificationsEnabled && whatsappConsent,
      };

      const reservation = await createReservation(reservationData, language);
      setConfirmationEmailSent(reservation.confirmation_email_sent);
      setConfirmationWhatsAppSent(reservation.confirmation_whatsapp_sent);
      setCancellationToken(reservation.cancellation_token);
      trackEvent('booking_completed', {
        reservation_id: reservation.id,
        guests: formData.guests,
      });
      setShowConfirmation(true);
      setWaitlistBannerSource(null);
    } catch (error) {
      console.error('Reservation error:', error);
      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        const isCapacityError =
          msg.includes('capacity') ||
          msg.includes('available') ||
          msg.includes('remaining') ||
          msg.includes('no longer available');
        if (isCapacityError && formData.date && formData.time) {
          setWaitlistBannerSource('backend');
        } else {
          toast.error(error.message, {
            duration: 5000,
            icon: <AlertCircle className="text-red-500" />
          });
        }
      } else {
        toast.error(copy.errors.unexpected, {
          duration: 5000,
          icon: <AlertCircle className="text-red-500" />
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    navigate('/');
  };

  const handleJoinWaitlist = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error(copy.errors.waitlistContact);
      return;
    }
    if (!privacyConsent) {
      setPrivacyError(true);
      toast.error(copy.errors.privacy);
      window.requestAnimationFrame(() => document.getElementById('privacyConsent')?.focus());
      return;
    }
    setIsJoiningWaitlist(true);
    try {
      await joinWaitlist({
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        occasion: formData.occasion || undefined,
        special_requests: formData.special_requests || undefined,
      });
      setWaitlistSuccess(true);
      setWaitlistBannerSource(null);
    } catch (error) {
      console.error('Waitlist error:', error);
      toast.error(copy.errors.waitlist);
    } finally {
      setIsJoiningWaitlist(false);
    }
  };

  // Update marketing consent
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      marketing_consent: marketingConsent,
      whatsapp_opt_in: whatsappNotificationsEnabled && whatsappConsent,
    }));
  }, [marketingConsent, whatsappConsent, whatsappNotificationsEnabled]);

  useEffect(() => {
    if (!showConfirmation) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => confirmationTitleRef.current?.focus(), 60);

    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setShowConfirmation(false);
        navigate('/');
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(confirmationDialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) ?? []).filter((element) => !element.hasAttribute('hidden'));
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleDialogKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleDialogKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocusRef.current?.isConnected) previousFocusRef.current.focus();
    };
  }, [navigate, showConfirmation]);

  return (
    <PageTransition>
      <SEOHead
        title={copy.seoTitle}
        canonical="/book"
        availableLanguages={['en', 'it', 'fr', 'de', 'es']}
        description={copy.seoDescription}
      />
      <div className="min-h-screen bg-[#f7f3eb] pt-[84px] dark:bg-venetian-brown">
        {/* Hero Section */}
        <motion.section
          className="relative mx-auto h-[36svh] min-h-[280px] max-w-[1480px] overflow-hidden border-x border-venetian-brown/15 dark:border-white/10 sm:h-[42svh] sm:min-h-[360px] lg:min-h-[430px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${reservationImage})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
          <div className="relative flex h-full items-end px-5 py-12 sm:px-10 lg:px-16">
            <div className="max-w-3xl text-left">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-venetian-gold sm:mb-5">San Polo · Rialto · Venezia</p>
              <motion.h1
                className="max-w-[9ch] font-serif text-[clamp(3.25rem,15vw,6rem)] font-semibold leading-[0.84] text-white"
                {...fadeIn}
              >
                {copy.heroTitle}
              </motion.h1>
              <motion.p
                className="mt-4 border-l-2 border-venetian-terracotta pl-5 text-base text-white/80 sm:mt-5 sm:text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {copy.heroSubtitle}
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Main Content */}
        <div className="relative z-10 mx-auto max-w-[1480px] px-4 py-16 sm:px-7 sm:py-24 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
            {/* Reservation Form */}
            <motion.div
              className="border-t border-venetian-brown pt-7 lg:col-span-2 sm:pt-9 [&_button]:rounded-none [&_input]:rounded-none [&_select]:rounded-none [&_textarea]:rounded-none dark:border-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-7 font-serif text-4xl font-semibold text-venetian-brown sm:text-6xl dark:text-white">{copy.detailsTitle}</h2>
              {flagsLoading ? (
                <div className="flex min-h-32 items-center justify-center border border-venetian-brown/15 bg-white/50 dark:border-white/15 dark:bg-white/5" role="status" aria-label={copy.processing}>
                  <Loader2 className="h-6 w-6 animate-spin text-venetian-gold" />
                </div>
              ) : !onlineReservationsEnabled ? (
                <div className="border border-amber-300 bg-amber-50 p-6 text-center dark:border-amber-300/30 dark:bg-amber-300/10">
                  <p className="mb-1 font-semibold text-venetian-brown dark:text-white">{copy.suspendedTitle}</p>
                  <p className="text-sm text-venetian-brown/70 dark:text-white/70">
                    {copy.suspendedText}{' '}
                    <a href="tel:+390415204603" className="text-venetian-gold hover:underline font-medium">+39 041 520 4603</a>
                  </p>
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="scroll-mt-28 space-y-6" ref={formTopRef}>
                <ol className="grid grid-cols-3 gap-2" aria-label={flowCopy.progress}>
                  {flowCopy.steps.map((label, index) => {
                    const stepNumber = (index + 1) as 1 | 2 | 3;
                    const isActive = bookingStep === stepNumber;
                    const isComplete = bookingStep > stepNumber;
                    return (
                      <li key={label}>
                        <button
                          type="button"
                          onClick={() => isComplete && moveToStep(stepNumber)}
                          disabled={!isComplete}
                          aria-current={isActive ? 'step' : undefined}
                          className={`w-full rounded-xl border px-2 py-2.5 text-center text-xs font-semibold transition sm:text-sm ${
                            isActive
                              ? 'border-venetian-gold bg-venetian-gold text-venetian-brown'
                              : isComplete
                                ? 'border-venetian-gold/40 bg-venetian-gold/10 text-venetian-brown dark:text-white'
                                : 'border-venetian-brown/10 bg-venetian-brown/5 text-venetian-brown/45 dark:border-white/10 dark:bg-white/5 dark:text-white/45'
                          }`}
                        >
                          <span className="mr-1">{stepNumber}.</span> {label}
                        </button>
                      </li>
                    );
                  })}
                </ol>

                {bookingStep === 1 ? (
                  <motion.div key="booking-step-1" className="space-y-5" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="reservation-date" className="booking-label">
                          <Calendar className="mr-2 inline-block h-4 w-4" />
                          {copy.date}
                        </label>
                        <input
                          id="reservation-date"
                          type="date"
                          min={today}
                          max={maxDateString}
                          value={formData.date}
                          onChange={(event) => {
                            setFormData((previous) => ({ ...previous, date: event.target.value, time: '' }));
                            setFieldErrors((current) => ({ ...current, date: undefined, time: undefined }));
                          }}
                          aria-invalid={Boolean(fieldErrors.date)}
                          aria-describedby={fieldErrors.date ? 'reservation-date-error' : undefined}
                          className="booking-field"
                        />
                        {fieldErrors.date ? <p id="reservation-date-error" className="mt-1.5 text-sm font-medium text-red-700 dark:text-red-300" role="alert">{fieldErrors.date}</p> : null}
                      </div>
                      <div>
                        <label htmlFor="reservation-guests" className="booking-label">
                          <Users className="mr-2 inline-block h-4 w-4" />
                          {copy.guestsLabel}
                        </label>
                        <select
                          id="reservation-guests"
                          value={formData.guests}
                          onChange={(event) => setFormData((previous) => ({ ...previous, guests: Number(event.target.value) }))}
                          className="booking-field"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                            <option key={number} value={number}>{number} {number === 1 ? copy.guest : copy.guests}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {formData.date ? (
                      <fieldset id="reservation-time-options" tabIndex={-1} aria-invalid={Boolean(fieldErrors.time)} aria-describedby={fieldErrors.time ? 'reservation-time-error' : undefined} className="outline-none">
                        <legend className="booking-label mb-3">
                          <Clock className="mr-2 inline-block h-4 w-4" />
                          {copy.availableTimes}
                        </legend>
                        {slotLoadFailed ? (
                          <div className="border border-red-300 bg-red-50 px-4 py-5 text-center dark:border-red-300/30 dark:bg-red-300/10" role="alert">
                            <p className="text-sm font-medium text-red-800 dark:text-red-200">{copy.errors.slots}</p>
                            <button type="button" onClick={() => loadTimeSlots(formData.date)} className="mt-3 min-h-11 border-b border-current px-2 text-xs font-bold uppercase tracking-[0.12em] text-red-800 dark:text-red-200">{flowCopy.retry}</button>
                          </div>
                        ) : isLoadingTimeSlots ? (
                          <div className="flex items-center justify-center py-8" role="status">
                            <Loader2 className="h-6 w-6 animate-spin text-venetian-brown dark:text-white" />
                          </div>
                        ) : timeSlots.length === 0 ? (
                          <p className="bg-venetian-brown/5 py-5 text-center text-venetian-brown/70 dark:bg-white/5 dark:text-white/70">{copy.noTimes}</p>
                        ) : (
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                            {timeSlots.map((slot) => {
                              const canFit = slot.available && slot.remainingCapacity >= formData.guests;
                              return (
                                <motion.button
                                  key={slot.time}
                                  type="button"
                                  disabled={!canFit && !waitlistEnabled}
                                  onClick={() => {
                                    setFormData((previous) => ({ ...previous, time: slot.time }));
                                    setFieldErrors((current) => ({ ...current, time: undefined }));
                                    setWaitlistBannerSource(!canFit && waitlistEnabled ? 'slot' : null);
                                    setWaitlistSuccess(false);
                                  }}
                                  aria-pressed={formData.time === slot.time}
                                  aria-label={!canFit && waitlistEnabled ? `${slot.time.slice(0, 5)} — ${copy.waitlistFull} ${copy.waitlistJoin}` : slot.time.slice(0, 5)}
                                  className={`min-h-11 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                                    formData.time === slot.time
                                      ? 'bg-venetian-gold text-venetian-brown shadow-sm'
                                      : canFit
                                        ? 'border border-venetian-brown/10 bg-white text-venetian-brown hover:bg-venetian-gold/10 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15'
                                        : waitlistEnabled
                                          ? 'border border-venetian-terracotta/50 bg-venetian-terracotta/10 text-venetian-brown hover:bg-venetian-terracotta/15 dark:text-white'
                                          : 'cursor-not-allowed bg-venetian-brown/5 text-venetian-brown/40 dark:bg-white/5 dark:text-white/35'
                                  }`}
                                  whileHover={canFit || waitlistEnabled ? { scale: 1.02 } : undefined}
                                  whileTap={canFit || waitlistEnabled ? { scale: 0.98 } : undefined}
                                >
                                  {slot.time.slice(0, 5)}
                                  {!canFit && waitlistEnabled ? <span className="mt-0.5 block text-xs font-bold uppercase tracking-[0.05em] text-venetian-terracotta">{copy.waitlistLabel}</span> : null}
                                </motion.button>
                              );
                            })}
                          </div>
                        )}
                        {fieldErrors.time ? <p id="reservation-time-error" className="mt-2 text-sm font-medium text-red-700 dark:text-red-300" role="alert">{fieldErrors.time}</p> : null}
                      </fieldset>
                    ) : null}

                    <Button type="button" onClick={handleContinue} disabled={isLoadingTimeSlots} className="w-full bg-venetian-gold font-semibold text-venetian-brown hover:bg-venetian-gold/90">
                      {flowCopy.continue}
                    </Button>
                  </motion.div>
                ) : null}

                {bookingStep === 2 ? (
                  <motion.div key="booking-step-2" className="space-y-5" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="reservation-name" className="booking-label">{copy.fullName}</label>
                        <input
                          id="reservation-name"
                          type="text"
                          autoComplete="name"
                          value={formData.name}
                          onChange={(event) => {
                            setFormData((previous) => ({ ...previous, name: event.target.value }));
                            setFieldErrors((current) => ({ ...current, name: undefined }));
                          }}
                          aria-invalid={Boolean(fieldErrors.name)}
                          aria-describedby={fieldErrors.name ? 'reservation-name-error' : undefined}
                          className="booking-field"
                        />
                        {fieldErrors.name ? <p id="reservation-name-error" className="mt-1.5 text-sm font-medium text-red-700 dark:text-red-300" role="alert">{fieldErrors.name}</p> : null}
                      </div>
                      <div>
                        <label htmlFor="reservation-email" className="booking-label">{copy.email}</label>
                        <input
                          id="reservation-email"
                          type="email"
                          autoComplete="email"
                          value={formData.email}
                          onChange={(event) => {
                            setFormData((previous) => ({ ...previous, email: event.target.value }));
                            setFieldErrors((current) => ({ ...current, email: undefined }));
                          }}
                          aria-invalid={Boolean(fieldErrors.email)}
                          aria-describedby={fieldErrors.email ? 'reservation-email-error' : undefined}
                          className="booking-field"
                        />
                        {fieldErrors.email ? <p id="reservation-email-error" className="mt-1.5 text-sm font-medium text-red-700 dark:text-red-300" role="alert">{fieldErrors.email}</p> : null}
                      </div>
                    </div>

                    <div>
                      <p className="booking-label">{copy.phone}</p>
                      <div className="grid gap-2 sm:grid-cols-[minmax(190px,0.8fr)_1.2fr]">
                        <select
                          id="reservation-phone-prefix"
                          value={phonePrefix}
                          onChange={(event) => {
                            setPhonePrefix(event.target.value);
                            if (event.target.value !== 'other') setCustomPrefix('');
                            setFieldErrors((current) => ({ ...current, phone: undefined }));
                          }}
                          aria-invalid={Boolean(fieldErrors.phone)}
                          aria-describedby={fieldErrors.phone ? 'reservation-phone-error' : undefined}
                          className="booking-field px-3"
                          aria-label={copy.countryCode}
                        >
                          <option value="" disabled>🌍 {copy.countryCode}</option>
                          {PHONE_PREFIXES.map((prefix) => (
                            <option key={prefix.code} value={prefix.code}>{prefix.flag} {prefix.label}</option>
                          ))}
                        </select>
                        {phonePrefix ? (
                          <div className="flex overflow-hidden border border-venetian-brown/20 bg-white/70 focus-within:border-venetian-gold focus-within:ring-1 focus-within:ring-venetian-gold dark:border-white/20 dark:bg-white/10">
                            <span className="flex shrink-0 items-center border-r border-venetian-brown/20 bg-venetian-brown/5 px-3 text-sm font-medium text-venetian-brown/70 dark:border-white/20 dark:bg-white/5 dark:text-white/70">
                              {phonePrefix === 'other' ? (customPrefix || '?') : phonePrefix}
                            </span>
                            <input
                              id="reservation-phone"
                              type="tel"
                              autoComplete="tel-national"
                              aria-label={copy.phone}
                              value={phoneNumber}
                              onChange={(event) => {
                                setPhoneNumber(event.target.value.replace(/[^0-9\s-]/g, ''));
                                setFieldErrors((current) => ({ ...current, phone: undefined }));
                              }}
                              aria-invalid={Boolean(fieldErrors.phone)}
                              aria-describedby={fieldErrors.phone ? 'reservation-phone-error' : undefined}
                              placeholder={copy.phoneNumber}
                              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base text-venetian-brown placeholder:text-venetian-brown/45 focus:outline-none dark:text-white dark:placeholder:text-white/45"
                            />
                          </div>
                        ) : null}
                      </div>
                      {phonePrefix === 'other' ? (
                        <input
                          type="text"
                          value={customPrefix}
                          onChange={(event) => setCustomPrefix(event.target.value.replace(/[^0-9+]/g, ''))}
                          placeholder={copy.customPrefix}
                          aria-label={copy.customPrefix}
                          className="booking-field mt-2"
                          maxLength={7}
                        />
                      ) : null}
                      {fieldErrors.phone ? <p id="reservation-phone-error" className="mt-1.5 text-sm font-medium text-red-700 dark:text-red-300" role="alert">{fieldErrors.phone}</p> : null}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="reservation-occasion" className="booking-label">
                          <ChefHat className="mr-2 inline-block h-4 w-4" />{copy.occasion}
                        </label>
                        <select
                          id="reservation-occasion"
                          value={formData.occasion || ''}
                          onChange={(event) => setFormData((previous) => ({ ...previous, occasion: event.target.value }))}
                          className="booking-field"
                        >
                          <option value="">{copy.chooseOccasion}</option>
                          {Object.entries(copy.occasions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="reservation-requests" className="booking-label">
                          <UtensilsCrossed className="mr-2 inline-block h-4 w-4" />{copy.requests}
                        </label>
                        <textarea
                          id="reservation-requests"
                          value={formData.special_requests || ''}
                          onChange={(event) => setFormData((previous) => ({ ...previous, special_requests: event.target.value }))}
                          maxLength={1000}
                          rows={3}
                          placeholder={copy.requestsPlaceholder}
                          className="booking-field"
                        />
                        <p className="mt-2 text-xs leading-5 text-venetian-brown/60 dark:text-white/60">{copy.requestsPrivacy}</p>
                      </div>
                    </div>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                      <Button type="button" variant="outline" onClick={() => moveToStep(1)}>{flowCopy.back}</Button>
                      <Button type="button" onClick={handleContinue} className="bg-venetian-gold font-semibold text-venetian-brown hover:bg-venetian-gold/90 sm:min-w-40">{flowCopy.continue}</Button>
                    </div>
                  </motion.div>
                ) : null}

                {bookingStep === 3 ? (
                  <motion.div key="booking-step-3" className="space-y-5" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="border border-venetian-gold/35 bg-venetian-gold/10 p-4 dark:bg-venetian-gold/15 sm:p-5">
                      <h3 id="reservation-summary-title" tabIndex={-1} className="font-serif text-xl text-venetian-brown outline-none dark:text-white">{flowCopy.summaryTitle}</h3>
                      <p className="mt-1 text-sm text-venetian-brown/65 dark:text-white/65">{flowCopy.summaryIntro}</p>
                      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
                        <div><dt className="text-venetian-brown/55 dark:text-white/55">{copy.date}</dt><dd className="font-semibold text-venetian-brown dark:text-white">{displayDate}</dd></div>
                        <div><dt className="text-venetian-brown/55 dark:text-white/55">{copy.timeLabel}</dt><dd className="font-semibold text-venetian-brown dark:text-white">{formData.time.slice(0, 5)}</dd></div>
                        <div><dt className="text-venetian-brown/55 dark:text-white/55">{copy.guestsLabel}</dt><dd className="font-semibold text-venetian-brown dark:text-white">{formData.guests}</dd></div>
                        <div><dt className="text-venetian-brown/55 dark:text-white/55">{copy.nameLabel}</dt><dd className="font-semibold text-venetian-brown dark:text-white">{formData.name}</dd></div>
                        <div className="col-span-2"><dt className="text-venetian-brown/55 dark:text-white/55">{copy.email}</dt><dd className="break-all font-semibold text-venetian-brown dark:text-white">{formData.email}</dd></div>
                        <div className="col-span-2 sm:col-span-1"><dt className="text-venetian-brown/55 dark:text-white/55">{copy.phone}</dt><dd className="font-semibold text-venetian-brown dark:text-white">{formData.phone}</dd></div>
                        {formData.occasion ? <div><dt className="text-venetian-brown/55 dark:text-white/55">{copy.occasion}</dt><dd className="font-semibold text-venetian-brown dark:text-white">{copy.occasions[formData.occasion as keyof typeof copy.occasions]}</dd></div> : null}
                        {formData.special_requests ? <div className="col-span-2 sm:col-span-3"><dt className="text-venetian-brown/55 dark:text-white/55">{copy.requests}</dt><dd className="whitespace-pre-wrap font-semibold text-venetian-brown dark:text-white">{formData.special_requests}</dd></div> : null}
                      </dl>
                    </div>

                    <AnimatePresence>
                      {waitlistEnabled && showWaitlistBanner && !waitlistSuccess ? (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="border-l-4 border-venetian-gold bg-amber-50 p-4 dark:bg-amber-300/10">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-venetian-gold" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-venetian-brown dark:text-white">{copy.waitlistFull}</p>
                              <p className="mt-1 text-sm text-venetian-brown/80 dark:text-white/80">{copy.waitlistPrompt}</p>
                              <button type="button" onClick={handleJoinWaitlist} disabled={isJoiningWaitlist} className="mt-3 flex min-h-11 items-center gap-2 rounded-lg bg-venetian-gold px-4 py-2 text-sm font-medium text-venetian-brown transition-colors hover:bg-venetian-gold/90 disabled:opacity-50">
                                {isJoiningWaitlist ? <><Loader2 size={14} className="animate-spin" /> {copy.waitlistJoining}</> : copy.waitlistJoin}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ) : null}
                      {waitlistSuccess ? (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-r-lg border-l-4 border-green-500 bg-green-50 p-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                            <div><p className="text-sm font-medium text-green-800">{copy.waitlistSuccess}</p><p className="mt-1 text-sm text-green-700">{copy.waitlistContact} {displayDate} {copy.timeLabel.toLowerCase()} {formData.time.slice(0, 5)}.</p></div>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3 bg-venetian-brown/[0.03] p-3 dark:bg-white/5">
                        <input type="checkbox" id="privacyConsent" checked={privacyConsent} onChange={(event) => { setPrivacyConsent(event.target.checked); setPrivacyError(false); }} aria-invalid={privacyError} aria-describedby={privacyError ? 'privacy-consent-error' : undefined} className="mt-1 h-5 w-5 shrink-0" />
                        <label htmlFor="privacyConsent" className="text-sm text-venetian-brown/90 dark:text-white/90">
                          {copy.privacyPrefix}{' '}<a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-venetian-brown underline decoration-venetian-gold decoration-2 underline-offset-2 dark:text-white">{copy.privacyLink}</a>{' '}{copy.privacyMiddle}{' '}<a href="/legal#booking-terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-venetian-brown underline decoration-venetian-gold decoration-2 underline-offset-2 dark:text-white">{copy.termsLink}</a>{copy.privacySuffix}
                          {privacyError ? <span id="privacy-consent-error" className="mt-2 block font-semibold text-red-700 dark:text-red-300" role="alert">{copy.errors.privacy}</span> : null}
                        </label>
                      </div>
                      <div className="flex items-start gap-3 bg-venetian-brown/[0.03] p-3 dark:bg-white/5">
                        <input type="checkbox" id="marketingConsent" checked={marketingConsent} onChange={(event) => setMarketingConsent(event.target.checked)} className="mt-1 h-4 w-4" />
                        <label htmlFor="marketingConsent" className="text-sm text-venetian-brown/90 dark:text-white/90">{copy.marketing}</label>
                      </div>
                      {whatsappNotificationsEnabled ? (
                        <div className="flex items-start gap-3 rounded-lg bg-green-50 p-3">
                          <input type="checkbox" id="whatsappConsent" checked={whatsappConsent} onChange={(event) => setWhatsappConsent(event.target.checked)} className="mt-1 h-4 w-4" />
                          <label htmlFor="whatsappConsent" className="text-sm text-venetian-brown/90">{copy.whatsapp}</label>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                      <Button type="button" variant="outline" onClick={() => moveToStep(2)} disabled={isLoading}>{flowCopy.back}</Button>
                      <Button type="submit" className="bg-venetian-gold font-semibold text-[#4A3329] hover:bg-venetian-gold/90 sm:min-w-56" disabled={isLoading || closedDates.includes(formData.date) || showWaitlistBanner || waitlistSuccess}>
                        {isLoading ? <span className="flex items-center justify-center"><Loader2 className="mr-2 h-5 w-5 animate-spin" />{copy.processing}</span> : copy.confirm}
                      </Button>
                    </div>
                  </motion.div>
                ) : null}
              </form>
              )}
            </motion.div>

            {/* Sidebar Information */}
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Reservation Policy */}
              <div className="booking-panel p-5 sm:p-6">
                <h3 className="mb-4 flex items-center font-serif text-xl text-venetian-brown dark:text-white">
                  <CalendarClock className="w-5 h-5 mr-2 text-venetian-gold" />
                  {copy.policyTitle}
                </h3>
                <ul className="space-y-3 text-venetian-brown/90 dark:text-white/85">
                  {copy.policyItems.map(item => (
                    <li key={item} className="flex items-start">
                      <span className="w-1.5 h-1.5 mt-2 mr-2 rounded-full bg-venetian-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Special Notes */}
              <div className="booking-panel p-5 sm:p-6">
                <h3 className="mb-3 flex items-center font-serif text-lg text-venetian-brown dark:text-white sm:text-xl">
                  <AlertCircle className="w-5 h-5 mr-2 text-venetian-gold" />
                  {copy.importantTitle}
                </h3>
                <ul className="space-y-2 text-sm text-venetian-brown/90 dark:text-white/85">
                  {copy.importantItems.map(item => (
                    <li key={item} className="flex items-start">
                      <span className="w-1.5 h-1.5 mt-1.5 mr-2 shrink-0 rounded-full bg-venetian-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct assistance */}
              <div className="bg-venetian-brown p-5 text-white sm:p-6">
                <h3 className="text-lg sm:text-xl font-serif mb-3 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-venetian-gold" />
                  {copy.helpTitle}
                </h3>
                <p className="text-sm text-venetian-sandstone mb-3">
                  {copy.helpBody}
                </p>
                <a href="tel:+390415204603" className="text-sm font-semibold text-white underline decoration-venetian-gold decoration-2 underline-offset-4">+39 041 520 4603</a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
              role="presentation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                ref={confirmationDialogRef}
                className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto bg-white shadow-xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="reservation-confirmation-title"
                aria-describedby="reservation-confirmation-description"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="p-5 sm:p-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                  </motion.div>
                  <h3 ref={confirmationTitleRef} id="reservation-confirmation-title" tabIndex={-1} className="mb-2 font-serif text-2xl text-venetian-brown outline-none">
                    {copy.confirmationTitle}
                  </h3>
                  <p id="reservation-confirmation-description" className="mb-6 text-venetian-brown/70">
                    {copy.confirmationThanks} {displayDate} {copy.timeLabel.toLowerCase()} {formData.time.slice(0, 5)}.
                  </p>
                  <div className="mb-6 border border-venetian-brown/15 bg-venetian-brown/[0.03] p-4">
                    <h4 className="font-medium text-venetian-brown mb-2">{copy.confirmationDetails}</h4>
                    <ul className="space-y-2 text-sm text-venetian-brown/70">
                      <li>{copy.nameLabel}: {formData.name}</li>
                      <li>{copy.guestsLabel}: {formData.guests}</li>
                      <li>{copy.dateLabel}: {displayDate}</li>
                      <li>{copy.timeLabel}: {formData.time.slice(0, 5)}</li>
                      <li>{copy.phone}: {formData.phone}</li>
                      {formData.occasion ? <li>{copy.occasion}: {copy.occasions[formData.occasion as keyof typeof copy.occasions]}</li> : null}
                      {formData.special_requests ? <li className="whitespace-pre-wrap">{copy.requests}: {formData.special_requests}</li> : null}
                    </ul>
                  </div>
                  <p className="text-sm text-venetian-brown/80 mb-6">
                    {confirmationEmailSent
                      ? `${copy.emailSent} ${formData.email}.`
                      : copy.emailMissing}
                  </p>
                  {confirmationWhatsAppSent ? (
                    <p className="-mt-3 mb-6 text-sm font-medium text-green-700">{copy.whatsappSent}</p>
                  ) : null}
                  {cancellationToken ? (
                    <div className="mb-5">
                      <a
                        href={`/cancella/${cancellationToken}?lang=${language}`}
                        className="inline-flex min-h-12 w-full items-center justify-center border-2 border-red-600 px-5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                      >
                        {copy.manageBooking}
                      </a>
                      <p className="mt-2 text-xs text-venetian-brown/60">{copy.manageBookingHint}</p>
                    </div>
                  ) : null}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <button
                      ref={confirmationCloseRef}
                      type="button"
                      onClick={handleConfirmationClose}
                      className="inline-flex min-h-12 w-full items-center justify-center bg-venetian-gold px-5 font-semibold text-venetian-brown hover:bg-venetian-gold/90"
                    >
                      {copy.returnHome}
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
