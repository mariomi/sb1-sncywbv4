import { useEffect, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, Loader2, MessageSquare, Phone, Users, XCircle } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import { Button } from '../components/Button';
import { getAvailableTimeSlots, getReservationByToken, cancelReservationByToken, updateReservationByToken } from '../lib/api';
import type { ReservationSummary } from '../lib/api';
import { useLanguage, type Language } from '../lib/i18n';

type PageState = 'loading' | 'found' | 'cancelling' | 'success' | 'already_cancelled' | 'already_completed' | 'not_found' | 'error';

type CancellationCopy = {
  seoTitle: string;
  eyebrow: string;
  title: string;
  loading: string;
  intro: string;
  cancel: string;
  cancelling: string;
  keep: string;
  warning: string;
  changeHelp: string;
  guest: string;
  guests: string;
  dateLabel: string;
  timeLabel: string;
  guestsLabel: string;
  successTitle: string;
  successText: string;
  alreadyCancelledTitle: string;
  alreadyCancelledText: string;
  completedTitle: string;
  completedText: string;
  invalidTitle: string;
  invalidText: string;
  errorTitle: string;
  errorText: string;
  newBooking: string;
  home: string;
};

type ReservationEditCopy = {
  pageTitle: string;
  editTitle: string;
  editIntro: string;
  available: string;
  current: string;
  availabilityError: string;
  notesLabel: string;
  notesPlaceholder: string;
  save: string;
  saving: string;
  saved: string;
  savedEmailMissing: string;
  editDeadline: string;
  editClosed: string;
  unavailable: string;
  invalidTime: string;
  notesTooLong: string;
  saveError: string;
};

const cancellationCopy: Record<Language, CancellationCopy> = {
  en: {
    seoTitle: 'Cancel booking', eyebrow: 'Al Gobbo di Rialto', title: 'Cancel your booking', loading: 'Loading your booking…', intro: 'Check the details, then tap the button to free the table.', cancel: 'Cancel this booking', cancelling: 'Cancelling…', keep: 'Keep my booking', warning: 'Cancellation cannot be undone.', changeHelp: 'Need to change the number of guests or want our help? Call us:', guest: 'guest', guests: 'guests', dateLabel: 'Date', timeLabel: 'Time', guestsLabel: 'Guests', successTitle: 'Booking cancelled', successText: 'The table has been released. We hope to welcome you another time.', alreadyCancelledTitle: 'Already cancelled', alreadyCancelledText: 'This booking was already cancelled. No further action is needed.', completedTitle: 'Booking already completed', completedText: 'A past or completed booking can no longer be cancelled.', invalidTitle: 'Link not valid', invalidText: 'This private link is invalid. Call us if you need help.', errorTitle: 'Could not cancel', errorText: 'Please try again or call us and we will help you.', newBooking: 'Book another table', home: 'Return to the website',
  },
  it: {
    seoTitle: 'Cancella prenotazione', eyebrow: 'Al Gobbo di Rialto', title: 'Cancella la prenotazione', loading: 'Carico la prenotazione…', intro: 'Controlla i dati e premi il pulsante per liberare il tavolo.', cancel: 'Cancella questa prenotazione', cancelling: 'Cancellazione in corso…', keep: 'Mantieni la prenotazione', warning: 'La cancellazione non può essere annullata.', changeHelp: 'Vuoi cambiare il numero di ospiti o preferisci il nostro aiuto? Chiamaci:', guest: 'ospite', guests: 'ospiti', dateLabel: 'Data', timeLabel: 'Ora', guestsLabel: 'Ospiti', successTitle: 'Prenotazione cancellata', successText: 'Il tavolo è stato liberato. Speriamo di accoglierti un’altra volta.', alreadyCancelledTitle: 'Prenotazione già cancellata', alreadyCancelledText: 'Non devi fare altro: questa prenotazione risulta già cancellata.', completedTitle: 'Prenotazione già conclusa', completedText: 'Una prenotazione passata o completata non può più essere cancellata.', invalidTitle: 'Link non valido', invalidText: 'Questo link personale non è valido. Chiamaci se hai bisogno di aiuto.', errorTitle: 'Cancellazione non riuscita', errorText: 'Riprova oppure chiamaci: ti aiutiamo noi.', newBooking: 'Prenota un altro tavolo', home: 'Torna al sito',
  },
  fr: {
    seoTitle: 'Annuler la réservation', eyebrow: 'Al Gobbo di Rialto', title: 'Annuler la réservation', loading: 'Chargement de la réservation…', intro: 'Vérifiez les informations puis appuyez sur le bouton pour libérer la table.', cancel: 'Annuler cette réservation', cancelling: 'Annulation…', keep: 'Garder ma réservation', warning: 'L’annulation est définitive.', changeHelp: 'Vous souhaitez changer le nombre de personnes ou obtenir notre aide ? Appelez-nous :', guest: 'personne', guests: 'personnes', dateLabel: 'Date', timeLabel: 'Heure', guestsLabel: 'Personnes', successTitle: 'Réservation annulée', successText: 'La table a été libérée. Nous espérons vous accueillir une prochaine fois.', alreadyCancelledTitle: 'Déjà annulée', alreadyCancelledText: 'Cette réservation a déjà été annulée. Aucune autre action n’est nécessaire.', completedTitle: 'Réservation terminée', completedText: 'Une réservation passée ou terminée ne peut plus être annulée.', invalidTitle: 'Lien non valide', invalidText: 'Ce lien privé n’est pas valide. Appelez-nous si vous avez besoin d’aide.', errorTitle: 'Annulation impossible', errorText: 'Réessayez ou appelez-nous : nous vous aiderons.', newBooking: 'Réserver une autre table', home: 'Retourner au site',
  },
  de: {
    seoTitle: 'Reservierung stornieren', eyebrow: 'Al Gobbo di Rialto', title: 'Reservierung stornieren', loading: 'Reservierung wird geladen…', intro: 'Prüfen Sie die Angaben und tippen Sie dann auf die Schaltfläche, um den Tisch freizugeben.', cancel: 'Diese Reservierung stornieren', cancelling: 'Wird storniert…', keep: 'Reservierung behalten', warning: 'Die Stornierung kann nicht rückgängig gemacht werden.', changeHelp: 'Möchten Sie die Gästezahl ändern oder benötigen Sie Hilfe? Rufen Sie uns an:', guest: 'Gast', guests: 'Gäste', dateLabel: 'Datum', timeLabel: 'Uhrzeit', guestsLabel: 'Gäste', successTitle: 'Reservierung storniert', successText: 'Der Tisch wurde freigegeben. Wir hoffen, Sie ein anderes Mal begrüßen zu dürfen.', alreadyCancelledTitle: 'Bereits storniert', alreadyCancelledText: 'Diese Reservierung wurde bereits storniert. Sie müssen nichts weiter tun.', completedTitle: 'Reservierung abgeschlossen', completedText: 'Eine vergangene oder abgeschlossene Reservierung kann nicht mehr storniert werden.', invalidTitle: 'Link ungültig', invalidText: 'Dieser private Link ist ungültig. Rufen Sie uns an, wenn Sie Hilfe benötigen.', errorTitle: 'Stornierung nicht möglich', errorText: 'Versuchen Sie es erneut oder rufen Sie uns an – wir helfen Ihnen.', newBooking: 'Neuen Tisch reservieren', home: 'Zur Website',
  },
  es: {
    seoTitle: 'Cancelar reserva', eyebrow: 'Al Gobbo di Rialto', title: 'Cancelar la reserva', loading: 'Cargando la reserva…', intro: 'Comprueba los datos y pulsa el botón para liberar la mesa.', cancel: 'Cancelar esta reserva', cancelling: 'Cancelando…', keep: 'Mantener mi reserva', warning: 'La cancelación no se puede deshacer.', changeHelp: '¿Quieres cambiar el número de personas o necesitas ayuda? Llámanos:', guest: 'persona', guests: 'personas', dateLabel: 'Fecha', timeLabel: 'Hora', guestsLabel: 'Personas', successTitle: 'Reserva cancelada', successText: 'La mesa ha quedado libre. Esperamos recibirte en otra ocasión.', alreadyCancelledTitle: 'Ya está cancelada', alreadyCancelledText: 'Esta reserva ya fue cancelada. No tienes que hacer nada más.', completedTitle: 'Reserva finalizada', completedText: 'Una reserva pasada o finalizada ya no se puede cancelar.', invalidTitle: 'Enlace no válido', invalidText: 'Este enlace privado no es válido. Llámanos si necesitas ayuda.', errorTitle: 'No se pudo cancelar', errorText: 'Inténtalo de nuevo o llámanos: te ayudaremos.', newBooking: 'Reservar otra mesa', home: 'Volver al sitio',
  },
};

const reservationEditCopy: Record<Language, ReservationEditCopy> = {
  en: {
    pageTitle: 'Manage your booking',
    editTitle: 'Change your booking',
    editIntro: 'Choose any available time on the same day and update your notes.',
    available: 'Available', current: 'Current time', availabilityError: 'Available times could not be loaded. Reload the page or call us.',
    notesLabel: 'Notes for the restaurant', notesPlaceholder: 'Allergies, dietary needs or other requests',
    save: 'Save changes', saving: 'Saving…', saved: 'Changes saved. We sent you an updated confirmation email.',
    savedEmailMissing: 'Changes saved, but the updated email could not be delivered.',
    editDeadline: 'You can change the time until 24 hours before the booking. Notes remain editable until the booking starts.',
    editClosed: 'The time can no longer be changed online, but you can still update the notes.',
    unavailable: 'That time is no longer available. Choose another option or call us.',
    invalidTime: 'Choose one of the available times for the same day.',
    notesTooLong: 'Notes can contain up to 1,000 characters.',
    saveError: 'Could not save the changes. Please try again or call us.',
  },
  it: {
    pageTitle: 'Gestisci la prenotazione',
    editTitle: 'Modifica la prenotazione',
    editIntro: 'Scegli qualsiasi orario disponibile dello stesso giorno e aggiorna le note.',
    available: 'Disponibile', current: 'Orario attuale', availabilityError: 'Non è stato possibile caricare gli orari disponibili. Ricarica la pagina o chiamaci.',
    notesLabel: 'Note per il ristorante', notesPlaceholder: 'Allergie, esigenze alimentari o altre richieste',
    save: 'Salva le modifiche', saving: 'Salvataggio…', saved: 'Modifiche salvate. Ti abbiamo inviato una nuova email di conferma.',
    savedEmailMissing: 'Modifiche salvate, ma non è stato possibile consegnare la nuova email.',
    editDeadline: 'Puoi cambiare l’orario fino a 24 ore prima. Le note restano modificabili fino all’inizio della prenotazione.',
    editClosed: 'Non puoi più cambiare l’orario online, ma puoi ancora aggiornare le note.',
    unavailable: 'Questo orario non è più disponibile. Scegli un’altra opzione o chiamaci.',
    invalidTime: 'Scegli uno degli orari disponibili dello stesso giorno.',
    notesTooLong: 'Le note possono contenere al massimo 1.000 caratteri.',
    saveError: 'Non è stato possibile salvare le modifiche. Riprova oppure chiamaci.',
  },
  fr: {
    pageTitle: 'Gérer la réservation',
    editTitle: 'Modifier la réservation',
    editIntro: 'Choisissez n’importe quelle heure disponible le même jour, puis modifiez vos notes.',
    available: 'Disponible', current: 'Heure actuelle', availabilityError: 'Impossible de charger les horaires disponibles. Rechargez la page ou appelez-nous.',
    notesLabel: 'Notes pour le restaurant', notesPlaceholder: 'Allergies, besoins alimentaires ou autres demandes',
    save: 'Enregistrer les modifications', saving: 'Enregistrement…', saved: 'Modifications enregistrées. Une nouvelle confirmation vous a été envoyée.',
    savedEmailMissing: 'Modifications enregistrées, mais la nouvelle confirmation n’a pas pu être envoyée.',
    editDeadline: 'Vous pouvez changer l’heure jusqu’à 24 heures avant. Les notes restent modifiables jusqu’au début de la réservation.',
    editClosed: 'L’heure ne peut plus être modifiée en ligne, mais vous pouvez encore mettre à jour les notes.',
    unavailable: 'Cette heure n’est plus disponible. Choisissez une autre option ou appelez-nous.',
    invalidTime: 'Choisissez l’un des horaires disponibles le même jour.',
    notesTooLong: 'Les notes sont limitées à 1 000 caractères.',
    saveError: 'Impossible d’enregistrer les modifications. Réessayez ou appelez-nous.',
  },
  de: {
    pageTitle: 'Reservierung verwalten',
    editTitle: 'Reservierung ändern',
    editIntro: 'Wählen Sie eine beliebige verfügbare Uhrzeit am selben Tag und aktualisieren Sie Ihre Hinweise.',
    available: 'Verfügbar', current: 'Aktuelle Uhrzeit', availabilityError: 'Die verfügbaren Uhrzeiten konnten nicht geladen werden. Laden Sie die Seite neu oder rufen Sie uns an.',
    notesLabel: 'Hinweise für das Restaurant', notesPlaceholder: 'Allergien, Ernährungswünsche oder andere Anfragen',
    save: 'Änderungen speichern', saving: 'Wird gespeichert…', saved: 'Änderungen gespeichert. Eine neue Bestätigung wurde gesendet.',
    savedEmailMissing: 'Änderungen gespeichert, aber die neue Bestätigung konnte nicht gesendet werden.',
    editDeadline: 'Die Uhrzeit kann bis 24 Stunden vorher geändert werden. Hinweise bleiben bis zum Reservierungsbeginn bearbeitbar.',
    editClosed: 'Die Uhrzeit kann online nicht mehr geändert werden, aber Sie können die Hinweise weiterhin aktualisieren.',
    unavailable: 'Diese Uhrzeit ist nicht mehr verfügbar. Wählen Sie eine andere Option oder rufen Sie uns an.',
    invalidTime: 'Wählen Sie eine der verfügbaren Uhrzeiten am selben Tag.',
    notesTooLong: 'Hinweise dürfen höchstens 1.000 Zeichen enthalten.',
    saveError: 'Die Änderungen konnten nicht gespeichert werden. Versuchen Sie es erneut oder rufen Sie uns an.',
  },
  es: {
    pageTitle: 'Gestionar la reserva',
    editTitle: 'Modificar la reserva',
    editIntro: 'Elige cualquier hora disponible del mismo día y actualiza las notas.',
    available: 'Disponible', current: 'Hora actual', availabilityError: 'No se pudieron cargar las horas disponibles. Recarga la página o llámanos.',
    notesLabel: 'Notas para el restaurante', notesPlaceholder: 'Alergias, necesidades alimentarias u otras solicitudes',
    save: 'Guardar cambios', saving: 'Guardando…', saved: 'Cambios guardados. Te hemos enviado una nueva confirmación.',
    savedEmailMissing: 'Cambios guardados, pero no se pudo enviar la nueva confirmación.',
    editDeadline: 'Puedes cambiar la hora hasta 24 horas antes. Las notas se pueden editar hasta que empiece la reserva.',
    editClosed: 'Ya no puedes cambiar la hora en línea, pero todavía puedes actualizar las notas.',
    unavailable: 'Esa hora ya no está disponible. Elige otra opción o llámanos.',
    invalidTime: 'Elige una de las horas disponibles del mismo día.',
    notesTooLong: 'Las notas pueden contener hasta 1.000 caracteres.',
    saveError: 'No se pudieron guardar los cambios. Inténtalo de nuevo o llámanos.',
  },
};

const dateLocales: Record<Language, string> = {
  en: 'en-GB', it: 'it-IT', fr: 'fr-FR', de: 'de-DE', es: 'es-ES',
};

const primaryLinkClass = 'inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-venetian-gold px-5 text-sm font-semibold text-venetian-brown shadow transition-colors hover:bg-venetian-gold/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-venetian-brown';

export function CancelReservationPage() {
  const { token } = useParams<{ token: string }>();
  const { language } = useLanguage();
  const copy = cancellationCopy[language];
  const editCopy = reservationEditCopy[language];
  const [state, setState] = useState<PageState>('loading');
  const [reservation, setReservation] = useState<ReservationSummary | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [timeOptionsFailed, setTimeOptionsFailed] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState<{ kind: 'success' | 'warning' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!token) {
      setState('not_found');
      return;
    }

    let active = true;
    getReservationByToken(token)
      .then(async (result) => {
        if (!active) return;
        if (!result) setState('not_found');
        else if (result.status === 'cancelled') setState('already_cancelled');
        else if (result.status === 'completed' || result.status === 'no_show' || !result.can_modify) setState('already_completed');
        else {
          const currentTime = result.time.slice(0, 5);
          let nextAvailableTimes = [currentTime];

          if (result.can_modify_time) {
            try {
              const slots = await getAvailableTimeSlots(result.date);
              nextAvailableTimes = Array.from(new Set([
                currentTime,
                ...slots
                  .filter((slot) => slot.available && slot.remainingCapacity >= result.guests)
                  .map((slot) => slot.time.slice(0, 5)),
              ])).sort((left, right) => left.localeCompare(right));
            } catch {
              if (active) setTimeOptionsFailed(true);
            }
          }

          if (!active) return;
          setReservation(result);
          setAvailableTimes(nextAvailableTimes);
          setSelectedTime(currentTime);
          setSpecialRequests(result.special_requests || '');
          setState('found');
        }
      })
      .catch(() => active && setState('error'));

    return () => {
      active = false;
    };
  }, [token]);

  const handleCancel = async () => {
    if (!token || state === 'cancelling') return;
    setState('cancelling');
    try {
      await cancelReservationByToken(token, reservation?.id);
      setState('success');
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message === 'already_cancelled') setState('already_cancelled');
      else if (message === 'already_completed') setState('already_completed');
      else setState('error');
    }
  };

  const handleSave = async () => {
    if (!token || !reservation || !reservation.can_modify || isSaving) return;
    setIsSaving(true);
    setSaveNotice(null);

    try {
      const result = await updateReservationByToken(
        token,
        reservation.id,
        selectedTime,
        specialRequests,
      );
      setReservation(result.reservation);
      setSelectedTime(result.reservation.time.slice(0, 5));
      setSpecialRequests(result.reservation.special_requests || '');
      setSaveNotice({
        kind: result.confirmationEmailSent ? 'success' : 'warning',
        text: result.confirmationEmailSent ? editCopy.saved : editCopy.savedEmailMissing,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message === 'too_late') {
        setReservation({ ...reservation, can_modify_time: false, earlier_time: null, later_time: null });
        setSelectedTime(reservation.time.slice(0, 5));
        setSaveNotice({ kind: 'error', text: editCopy.editClosed });
      } else if (message === 'not_found') {
        setState('not_found');
      } else if (message === 'already_cancelled') {
        setState('already_cancelled');
      } else if (message === 'already_completed') {
        setState('already_completed');
      } else if (message === 'unavailable') {
        setSaveNotice({ kind: 'error', text: editCopy.unavailable });
      } else if (message === 'invalid_time') {
        setSaveNotice({ kind: 'error', text: editCopy.invalidTime });
      } else if (message === 'notes_too_long') {
        setSaveNotice({ kind: 'error', text: editCopy.notesTooLong });
      } else {
        setSaveNotice({ kind: 'error', text: editCopy.saveError });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = reservation
    ? new Date(`${reservation.date}T12:00:00Z`).toLocaleDateString(dateLocales[language], {
        timeZone: 'Europe/Rome', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : '';

  const hasChanges = Boolean(reservation) && (
    selectedTime !== reservation?.time.slice(0, 5)
    || specialRequests.trim() !== (reservation?.special_requests || '')
  );

  const renderResult = (icon: ReactNode, title: string, text: string, action: 'book' | 'home') => (
    <div className="flex flex-col items-center py-5 text-center" role="status">
      {icon}
      <h2 className="mt-4 font-serif text-2xl text-venetian-brown dark:text-venetian-sandstone">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-venetian-brown/70 dark:text-venetian-sandstone/70">{text}</p>
      <Link to={action === 'book' ? '/book' : '/'} className={`${primaryLinkClass} mt-6`}>
        {action === 'book' ? copy.newBooking : copy.home}
      </Link>
    </div>
  );

  return (
    <PageTransition>
      <SEOHead title={editCopy.pageTitle} noindex />
      <main className="min-h-screen bg-venetian-sandstone/20 px-4 pb-20 pt-24 dark:bg-venetian-brown/95 sm:px-6">
        <motion.section
          className="mx-auto max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-venetian-brown/60"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          aria-live="polite"
        >
          <header className="border-b-4 border-venetian-gold bg-venetian-brown px-5 py-5 text-center sm:px-7">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-venetian-gold">{copy.eyebrow}</p>
            <h1 className="mt-1 font-serif text-2xl text-white sm:text-3xl">{editCopy.pageTitle}</h1>
          </header>

          <div className="p-5 sm:p-7">
            {state === 'loading' ? (
              <div className="flex flex-col items-center gap-3 py-10" role="status">
                <Loader2 className="h-8 w-8 animate-spin text-venetian-gold" />
                <p className="text-sm text-venetian-brown/70 dark:text-venetian-sandstone/70">{copy.loading}</p>
              </div>
            ) : null}

            {(state === 'found' || state === 'cancelling') && reservation ? (
              <div>
                <div className="mb-5 rounded-xl border border-venetian-gold/35 bg-venetian-gold/10 p-4">
                  <p className="mb-3 text-center font-semibold text-venetian-brown dark:text-venetian-sandstone">{reservation.name}</p>
                  <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                    <div className="flex items-center gap-2 sm:flex-col sm:text-center">
                      <Calendar className="h-5 w-5 shrink-0 text-venetian-gold" />
                      <dt className="sr-only">{copy.dateLabel}</dt>
                      <dd className="font-medium text-venetian-brown dark:text-venetian-sandstone">{formattedDate}</dd>
                    </div>
                    <div className="flex items-center gap-2 sm:flex-col sm:text-center">
                      <Clock className="h-5 w-5 shrink-0 text-venetian-gold" />
                      <dt className="sr-only">{copy.timeLabel}</dt>
                      <dd className="font-medium text-venetian-brown dark:text-venetian-sandstone">{reservation.time.slice(0, 5)}</dd>
                    </div>
                    <div className="flex items-center gap-2 sm:flex-col sm:text-center">
                      <Users className="h-5 w-5 shrink-0 text-venetian-gold" />
                      <dt className="sr-only">{copy.guestsLabel}</dt>
                      <dd className="font-medium text-venetian-brown dark:text-venetian-sandstone">{reservation.guests} {reservation.guests === 1 ? copy.guest : copy.guests}</dd>
                    </div>
                  </dl>
                </div>

                {reservation.can_modify ? (
                  <section className="rounded-xl border border-venetian-gold/30 bg-venetian-sandstone/15 p-4" aria-labelledby="edit-booking-title">
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-venetian-gold" />
                      <div>
                        <h2 id="edit-booking-title" className="font-serif text-xl text-venetian-brown dark:text-venetian-sandstone">{editCopy.editTitle}</h2>
                        <p className="mt-1 text-sm leading-6 text-venetian-brown/70 dark:text-venetian-sandstone/70">{editCopy.editIntro}</p>
                      </div>
                    </div>

                    {reservation.can_modify_time ? (
                      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3" role="group" aria-label={copy.timeLabel}>
                        {availableTimes.map((time) => {
                          const selected = selectedTime === time;
                          const isCurrent = reservation.time.slice(0, 5) === time;
                          return (
                            <button
                              key={time}
                              type="button"
                              className={`min-h-14 rounded-xl border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-venetian-gold ${selected ? 'border-venetian-brown bg-venetian-brown font-semibold text-white' : 'border-venetian-gold/40 bg-white text-venetian-brown hover:border-venetian-gold dark:bg-venetian-brown/40 dark:text-venetian-sandstone'}`}
                              onClick={() => {
                                setSelectedTime(time);
                                setSaveNotice(null);
                              }}
                              disabled={isSaving}
                              aria-pressed={selected}
                            >
                              <span className="block text-xs opacity-75">{isCurrent ? editCopy.current : editCopy.available}</span>
                              <span className="mt-0.5 block text-base">{time}</span>
                            </button>
                          );
                        })}
                        {timeOptionsFailed ? (
                          <p className="rounded-lg border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm leading-5 text-amber-900 sm:col-span-3" role="status">
                            {editCopy.availabilityError}
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-lg border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm leading-5 text-amber-900" role="status">
                        {editCopy.editClosed}
                      </div>
                    )}

                    <label htmlFor="reservation-special-requests" className="mt-5 flex items-center gap-2 text-sm font-semibold text-venetian-brown dark:text-venetian-sandstone">
                      <MessageSquare className="h-4 w-4 text-venetian-gold" />
                      {editCopy.notesLabel}
                    </label>
                    <textarea
                      id="reservation-special-requests"
                      value={specialRequests}
                      onChange={(event) => {
                        setSpecialRequests(event.target.value);
                        setSaveNotice(null);
                      }}
                      maxLength={1000}
                      rows={4}
                      placeholder={editCopy.notesPlaceholder}
                      disabled={isSaving}
                      className="mt-2 w-full resize-y rounded-xl border border-venetian-gold/35 bg-white px-3 py-2.5 text-sm text-venetian-brown outline-none transition focus:border-venetian-gold focus:ring-2 focus:ring-venetian-gold/20 disabled:opacity-60 dark:bg-venetian-brown/40 dark:text-venetian-sandstone"
                    />
                    <div className="mt-1 flex items-start justify-between gap-3 text-xs text-venetian-brown/55 dark:text-venetian-sandstone/55">
                      <span>{editCopy.editDeadline}</span>
                      <span className="shrink-0">{specialRequests.length}/1000</span>
                    </div>

                    <Button className="mt-4 min-h-12 w-full bg-venetian-gold px-5 font-semibold text-venetian-brown hover:bg-venetian-gold/90" onClick={handleSave} disabled={!hasChanges || isSaving || state === 'cancelling'}>
                      {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{editCopy.saving}</> : editCopy.save}
                    </Button>

                    {saveNotice ? (
                      <p
                        className={`mt-3 rounded-lg px-3 py-2 text-sm leading-5 ${saveNotice.kind === 'success' ? 'bg-green-50 text-green-800' : saveNotice.kind === 'warning' ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-700'}`}
                        role="status"
                      >
                        {saveNotice.text}
                      </p>
                    ) : null}
                  </section>
                ) : (
                  <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-4 text-sm leading-6 text-amber-900" role="status">
                    {editCopy.editClosed}
                  </div>
                )}

                <div className="my-6 border-t border-venetian-gold/25" />
                <h2 className="text-center font-serif text-xl text-venetian-brown dark:text-venetian-sandstone">{copy.title}</h2>
                <p className="mt-2 text-center text-sm leading-6 text-venetian-brown/75 dark:text-venetian-sandstone/75">{copy.intro}</p>
                <Button className="min-h-12 w-full bg-red-600 px-5 font-semibold text-white hover:bg-red-700" onClick={handleCancel} disabled={state === 'cancelling' || isSaving}>
                  {state === 'cancelling' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{copy.cancelling}</> : copy.cancel}
                </Button>
                <p className="mt-2 text-center text-xs text-venetian-brown/55 dark:text-venetian-sandstone/55">{copy.warning}</p>

                <Link to="/" className="mt-4 block min-h-11 py-3 text-center text-sm font-semibold text-venetian-brown underline decoration-venetian-gold decoration-2 underline-offset-4 dark:text-venetian-sandstone">
                  {copy.keep}
                </Link>

                <div className="mt-5 rounded-xl bg-venetian-sandstone/25 p-4 text-center">
                  <Phone className="mx-auto h-5 w-5 text-venetian-gold" />
                  <p className="mt-2 text-sm text-venetian-brown/70">{copy.changeHelp}</p>
                  <a href="tel:+390415204603" className="mt-1 inline-block font-semibold text-venetian-brown underline decoration-venetian-gold decoration-2 underline-offset-4">+39 041 520 4603</a>
                </div>
              </div>
            ) : null}

            {state === 'success' ? renderResult(<CheckCircle2 className="h-16 w-16 text-green-500" />, copy.successTitle, copy.successText, 'book') : null}
            {state === 'already_cancelled' ? renderResult(<CheckCircle2 className="h-16 w-16 text-green-500" />, copy.alreadyCancelledTitle, copy.alreadyCancelledText, 'book') : null}
            {state === 'already_completed' ? renderResult(<XCircle className="h-16 w-16 text-venetian-brown/35 dark:text-venetian-sandstone/40" />, copy.completedTitle, copy.completedText, 'home') : null}
            {state === 'not_found' ? renderResult(<XCircle className="h-16 w-16 text-red-400" />, copy.invalidTitle, copy.invalidText, 'home') : null}
            {state === 'error' ? renderResult(<XCircle className="h-16 w-16 text-red-400" />, copy.errorTitle, copy.errorText, 'home') : null}
          </div>
        </motion.section>
      </main>
    </PageTransition>
  );
}
