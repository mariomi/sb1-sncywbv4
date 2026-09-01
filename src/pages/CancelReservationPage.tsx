import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, Loader2, Phone, Users, XCircle } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import { Button } from '../components/Button';
import { getReservationByToken, cancelReservationByToken } from '../lib/api';
import type { ReservationSummary } from '../lib/api';
import { useLanguage, type Language } from '../lib/i18n';
import { useFeatureFlag, useFeatureFlags } from '../lib/featureFlags';

type PageState = 'loading' | 'found' | 'cancelling' | 'success' | 'already_cancelled' | 'already_completed' | 'not_found' | 'disabled' | 'error';

type CancellationCopy = {
  seoTitle: string;
  eyebrow: string;
  title: string;
  loading: string;
  intro: string;
  cancel: string;
  cancelling: string;
  confirmTitle: string;
  confirmBody: string;
  confirmCancel: string;
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
  disabledTitle: string;
  disabledText: string;
  errorTitle: string;
  errorText: string;
  newBooking: string;
  home: string;
  callRestaurant: string;
};

const cancellationCopy: Record<Language, CancellationCopy> = {
  en: {
    seoTitle: 'Cancel booking', eyebrow: 'Al Gobbo di Rialto', title: 'Cancel your booking', loading: 'Loading your booking…', intro: 'Check the details, then tap the button to free the table.', cancel: 'Cancel this booking', cancelling: 'Cancelling…', confirmTitle: 'Are you sure?', confirmBody: 'This will permanently cancel the booking and release your table.', confirmCancel: 'Yes, cancel permanently', keep: 'Keep my booking', warning: 'Cancellation cannot be undone.', changeHelp: 'Need to change the time or number of guests? Call us:', guest: 'guest', guests: 'guests', dateLabel: 'Date', timeLabel: 'Time', guestsLabel: 'Guests', successTitle: 'Booking cancelled', successText: 'The table has been released. We hope to welcome you another time.', alreadyCancelledTitle: 'Already cancelled', alreadyCancelledText: 'This booking was already cancelled. No further action is needed.', completedTitle: 'Booking already completed', completedText: 'A past or completed booking can no longer be cancelled.', invalidTitle: 'Link not valid', invalidText: 'This private link is invalid. Call us if you need help.', disabledTitle: 'Online cancellation is paused', disabledText: 'Your booking has not been changed. Call the restaurant and we will help you.', errorTitle: 'Could not cancel', errorText: 'Please try again or call us and we will help you.', newBooking: 'Book another table', home: 'Return to the website', callRestaurant: 'Call the restaurant',
  },
  it: {
    seoTitle: 'Cancella prenotazione', eyebrow: 'Al Gobbo di Rialto', title: 'Cancella la prenotazione', loading: 'Carico la prenotazione…', intro: 'Controlla i dati e premi il pulsante per liberare il tavolo.', cancel: 'Cancella questa prenotazione', cancelling: 'Cancellazione in corso…', confirmTitle: 'Sei sicuro?', confirmBody: 'La prenotazione verrà cancellata definitivamente e il tavolo sarà liberato.', confirmCancel: 'Sì, cancella definitivamente', keep: 'Mantieni la prenotazione', warning: 'La cancellazione non può essere annullata.', changeHelp: 'Vuoi cambiare orario o numero di ospiti? Chiamaci:', guest: 'ospite', guests: 'ospiti', dateLabel: 'Data', timeLabel: 'Ora', guestsLabel: 'Ospiti', successTitle: 'Prenotazione cancellata', successText: 'Il tavolo è stato liberato. Speriamo di accoglierti un’altra volta.', alreadyCancelledTitle: 'Prenotazione già cancellata', alreadyCancelledText: 'Non devi fare altro: questa prenotazione risulta già cancellata.', completedTitle: 'Prenotazione già conclusa', completedText: 'Una prenotazione passata o completata non può più essere cancellata.', invalidTitle: 'Link non valido', invalidText: 'Questo link personale non è valido. Chiamaci se hai bisogno di aiuto.', disabledTitle: 'Cancellazione online sospesa', disabledText: 'La prenotazione non è stata modificata. Chiamaci e ti aiutiamo noi.', errorTitle: 'Cancellazione non riuscita', errorText: 'Riprova oppure chiamaci: ti aiutiamo noi.', newBooking: 'Prenota un altro tavolo', home: 'Torna al sito', callRestaurant: 'Chiama il ristorante',
  },
  fr: {
    seoTitle: 'Annuler la réservation', eyebrow: 'Al Gobbo di Rialto', title: 'Annuler la réservation', loading: 'Chargement de la réservation…', intro: 'Vérifiez les informations puis appuyez sur le bouton pour libérer la table.', cancel: 'Annuler cette réservation', cancelling: 'Annulation…', confirmTitle: 'Êtes-vous sûr ?', confirmBody: 'La réservation sera définitivement annulée et la table libérée.', confirmCancel: 'Oui, annuler définitivement', keep: 'Garder ma réservation', warning: 'L’annulation est définitive.', changeHelp: 'Vous souhaitez changer l’heure ou le nombre de personnes ? Appelez-nous :', guest: 'personne', guests: 'personnes', dateLabel: 'Date', timeLabel: 'Heure', guestsLabel: 'Personnes', successTitle: 'Réservation annulée', successText: 'La table a été libérée. Nous espérons vous accueillir une prochaine fois.', alreadyCancelledTitle: 'Déjà annulée', alreadyCancelledText: 'Cette réservation a déjà été annulée. Aucune autre action n’est nécessaire.', completedTitle: 'Réservation terminée', completedText: 'Une réservation passée ou terminée ne peut plus être annulée.', invalidTitle: 'Lien non valide', invalidText: 'Ce lien privé n’est pas valide. Appelez-nous si vous avez besoin d’aide.', disabledTitle: 'Annulation en ligne suspendue', disabledText: 'Votre réservation n’a pas été modifiée. Appelez le restaurant et nous vous aiderons.', errorTitle: 'Annulation impossible', errorText: 'Réessayez ou appelez-nous : nous vous aiderons.', newBooking: 'Réserver une autre table', home: 'Retourner au site', callRestaurant: 'Appeler le restaurant',
  },
  de: {
    seoTitle: 'Reservierung stornieren', eyebrow: 'Al Gobbo di Rialto', title: 'Reservierung stornieren', loading: 'Reservierung wird geladen…', intro: 'Prüfen Sie die Angaben und tippen Sie dann auf die Schaltfläche, um den Tisch freizugeben.', cancel: 'Diese Reservierung stornieren', cancelling: 'Wird storniert…', confirmTitle: 'Sind Sie sicher?', confirmBody: 'Die Reservierung wird endgültig storniert und der Tisch freigegeben.', confirmCancel: 'Ja, endgültig stornieren', keep: 'Reservierung behalten', warning: 'Die Stornierung kann nicht rückgängig gemacht werden.', changeHelp: 'Möchten Sie Uhrzeit oder Gästezahl ändern? Rufen Sie uns an:', guest: 'Gast', guests: 'Gäste', dateLabel: 'Datum', timeLabel: 'Uhrzeit', guestsLabel: 'Gäste', successTitle: 'Reservierung storniert', successText: 'Der Tisch wurde freigegeben. Wir hoffen, Sie ein anderes Mal begrüßen zu dürfen.', alreadyCancelledTitle: 'Bereits storniert', alreadyCancelledText: 'Diese Reservierung wurde bereits storniert. Sie müssen nichts weiter tun.', completedTitle: 'Reservierung abgeschlossen', completedText: 'Eine vergangene oder abgeschlossene Reservierung kann nicht mehr storniert werden.', invalidTitle: 'Link ungültig', invalidText: 'Dieser private Link ist ungültig. Rufen Sie uns an, wenn Sie Hilfe benötigen.', disabledTitle: 'Online-Stornierung pausiert', disabledText: 'Ihre Reservierung wurde nicht geändert. Rufen Sie das Restaurant an, wir helfen Ihnen.', errorTitle: 'Stornierung nicht möglich', errorText: 'Versuchen Sie es erneut oder rufen Sie uns an – wir helfen Ihnen.', newBooking: 'Neuen Tisch reservieren', home: 'Zur Website', callRestaurant: 'Restaurant anrufen',
  },
  es: {
    seoTitle: 'Cancelar reserva', eyebrow: 'Al Gobbo di Rialto', title: 'Cancelar la reserva', loading: 'Cargando la reserva…', intro: 'Comprueba los datos y pulsa el botón para liberar la mesa.', cancel: 'Cancelar esta reserva', cancelling: 'Cancelando…', confirmTitle: '¿Estás seguro?', confirmBody: 'La reserva se cancelará definitivamente y la mesa quedará libre.', confirmCancel: 'Sí, cancelar definitivamente', keep: 'Mantener mi reserva', warning: 'La cancelación no se puede deshacer.', changeHelp: '¿Quieres cambiar la hora o el número de personas? Llámanos:', guest: 'persona', guests: 'personas', dateLabel: 'Fecha', timeLabel: 'Hora', guestsLabel: 'Personas', successTitle: 'Reserva cancelada', successText: 'La mesa ha quedado libre. Esperamos recibirte en otra ocasión.', alreadyCancelledTitle: 'Ya está cancelada', alreadyCancelledText: 'Esta reserva ya fue cancelada. No tienes que hacer nada más.', completedTitle: 'Reserva finalizada', completedText: 'Una reserva pasada o finalizada ya no se puede cancelar.', invalidTitle: 'Enlace no válido', invalidText: 'Este enlace privado no es válido. Llámanos si necesitas ayuda.', disabledTitle: 'Cancelación online suspendida', disabledText: 'Tu reserva no se ha modificado. Llama al restaurante y te ayudaremos.', errorTitle: 'No se pudo cancelar', errorText: 'Inténtalo de nuevo o llámanos: te ayudaremos.', newBooking: 'Reservar otra mesa', home: 'Volver al sitio', callRestaurant: 'Llamar al restaurante',
  },
};

const dateLocales: Record<Language, string> = {
  en: 'en-GB', it: 'it-IT', fr: 'fr-FR', de: 'de-DE', es: 'es-ES',
};

const primaryLinkClass = 'inline-flex min-h-12 w-full items-center justify-center bg-venetian-brown px-5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-venetian-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-venetian-terracotta';

export function CancelReservationPage() {
  const { token } = useParams<{ token: string }>();
  const { language } = useLanguage();
  const copy = cancellationCopy[language];
  const cancellationEnabled = useFeatureFlag('cancellation_selfserve');
  const { loading: flagsLoading, error: flagsError } = useFeatureFlags();
  const [state, setState] = useState<PageState>('loading');
  const [reservation, setReservation] = useState<ReservationSummary | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const cancelTriggerRef = useRef<HTMLButtonElement>(null);
  const keepButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isConfirming) return;
    keepButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsConfirming(false);
      window.requestAnimationFrame(() => cancelTriggerRef.current?.focus());
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConfirming]);

  const closeConfirmation = () => {
    setIsConfirming(false);
    window.requestAnimationFrame(() => cancelTriggerRef.current?.focus());
  };

  useEffect(() => {
    if (flagsLoading) return;
    if (flagsError || !cancellationEnabled) {
      setState('disabled');
      return;
    }
    if (!token) {
      setState('not_found');
      return;
    }

    let active = true;
    getReservationByToken(token)
      .then((result) => {
        if (!active) return;
        if (!result) setState('not_found');
        else if (result.status === 'cancelled') setState('already_cancelled');
        else if (result.status === 'completed' || result.status === 'no_show') setState('already_completed');
        else {
          setReservation(result);
          setState('found');
        }
      })
      .catch(() => active && setState('error'));

    return () => {
      active = false;
    };
  }, [cancellationEnabled, flagsError, flagsLoading, token]);

  const handleCancel = async () => {
    if (!token || state === 'cancelling') return;
    if (flagsLoading || flagsError || !cancellationEnabled) {
      setState('disabled');
      return;
    }
    setState('cancelling');
    try {
      await cancelReservationByToken(token);
      setState('success');
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message === 'already_cancelled') setState('already_cancelled');
      else if (message === 'already_completed') setState('already_completed');
      else setState('error');
    }
  };

  const formattedDate = reservation
    ? new Date(`${reservation.date}T12:00:00Z`).toLocaleDateString(dateLocales[language], {
        timeZone: 'Europe/Rome', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : '';

  const renderResult = (icon: ReactNode, title: string, text: string, action: 'book' | 'home' | 'call') => (
    <div className="flex flex-col items-center py-5 text-center" role="status">
      {icon}
      <h2 className="mt-4 font-serif text-2xl text-venetian-brown dark:text-venetian-sandstone">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-venetian-brown/70 dark:text-venetian-sandstone/70">{text}</p>
      {action === 'call' ? (
        <a href="tel:+390415204603" className={`${primaryLinkClass} mt-6`}>{copy.callRestaurant}</a>
      ) : (
        <Link to={action === 'book' ? '/book' : '/'} className={`${primaryLinkClass} mt-6`}>
          {action === 'book' ? copy.newBooking : copy.home}
        </Link>
      )}
    </div>
  );

  return (
    <PageTransition>
      <SEOHead title={copy.seoTitle} noindex />
      <main className="min-h-screen bg-[#f7f3eb] px-4 pb-20 pt-32 dark:bg-venetian-brown sm:px-6">
        <motion.section
          className="mx-auto max-w-lg overflow-hidden border border-venetian-brown/15 bg-white/70 dark:border-white/15 dark:bg-[#211d18]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          aria-live="polite"
        >
          <header className="border-b border-white/15 bg-venetian-brown px-5 py-7 text-center sm:px-7">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-venetian-gold">{copy.eyebrow}</p>
            <h1 className="mt-1 font-serif text-2xl text-white sm:text-3xl">{copy.title}</h1>
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
                <p className="text-center text-sm leading-6 text-venetian-brown/75 dark:text-venetian-sandstone/75">{copy.intro}</p>

                <div className="my-5 border border-venetian-brown/15 bg-white/45 p-4 dark:border-white/15 dark:bg-white/5">
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

                {isConfirming ? (
                  <div className="border border-red-700/25 bg-red-50 p-4 text-center dark:bg-red-950/20" role="group" aria-labelledby="cancel-confirmation-title">
                    <h2 id="cancel-confirmation-title" className="font-serif text-2xl font-semibold text-venetian-brown dark:text-white">{copy.confirmTitle}</h2>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-venetian-brown/75 dark:text-white/75">{copy.confirmBody}</p>
                    <button ref={keepButtonRef} type="button" onClick={closeConfirmation} className="mt-5 inline-flex min-h-12 w-full items-center justify-center bg-venetian-brown px-5 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-venetian-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-venetian-gold focus-visible:ring-offset-2">
                      {copy.keep}
                    </button>
                    <Button className="mt-3 min-h-12 w-full border border-red-700 bg-transparent px-5 text-xs font-bold uppercase tracking-[0.12em] text-red-800 hover:bg-red-800 hover:text-white dark:text-red-300" onClick={handleCancel} disabled={state === 'cancelling'}>
                      {state === 'cancelling' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{copy.cancelling}</> : copy.confirmCancel}
                    </Button>
                    <p className="mt-3 text-xs text-venetian-brown/70 dark:text-white/70">{copy.warning}</p>
                  </div>
                ) : (
                  <>
                    <button ref={cancelTriggerRef} type="button" className="inline-flex min-h-12 w-full items-center justify-center bg-venetian-terracotta px-5 text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2" onClick={() => setIsConfirming(true)}>
                      {copy.cancel}
                    </button>
                    <Link to="/" className="mt-4 block min-h-11 py-3 text-center text-sm font-semibold text-venetian-brown underline decoration-venetian-gold decoration-2 underline-offset-4 dark:text-venetian-sandstone">
                      {copy.keep}
                    </Link>
                  </>
                )}

                <div className="mt-5 border-t border-venetian-brown/15 p-4 text-center dark:border-white/15">
                  <Phone className="mx-auto h-5 w-5 text-venetian-gold" />
                  <p className="mt-2 text-sm text-venetian-brown/70 dark:text-white/70">{copy.changeHelp}</p>
                  <a href="tel:+390415204603" className="mt-1 inline-block font-semibold text-venetian-brown underline decoration-venetian-gold decoration-2 underline-offset-4 dark:text-white">+39 041 520 4603</a>
                </div>
              </div>
            ) : null}

            {state === 'success' ? renderResult(<CheckCircle2 className="h-16 w-16 text-green-500" />, copy.successTitle, copy.successText, 'book') : null}
            {state === 'already_cancelled' ? renderResult(<CheckCircle2 className="h-16 w-16 text-green-500" />, copy.alreadyCancelledTitle, copy.alreadyCancelledText, 'book') : null}
            {state === 'already_completed' ? renderResult(<XCircle className="h-16 w-16 text-venetian-brown/35 dark:text-venetian-sandstone/40" />, copy.completedTitle, copy.completedText, 'home') : null}
            {state === 'not_found' ? renderResult(<XCircle className="h-16 w-16 text-red-400" />, copy.invalidTitle, copy.invalidText, 'home') : null}
            {state === 'disabled' ? renderResult(<Phone className="h-16 w-16 text-venetian-gold" />, copy.disabledTitle, copy.disabledText, 'call') : null}
            {state === 'error' ? renderResult(<XCircle className="h-16 w-16 text-red-400" />, copy.errorTitle, copy.errorText, 'home') : null}
          </div>
        </motion.section>
      </main>
    </PageTransition>
  );
}
