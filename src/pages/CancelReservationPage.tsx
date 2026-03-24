import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { PageTransition } from '../components/PageTransition';
import { SEOHead } from '../components/SEOHead';
import { Button } from '../components/Button';
import { getReservationByToken, cancelReservationByToken } from '../lib/api';
import type { Reservation } from '../lib/api';

type PageState = 'loading' | 'found' | 'confirming' | 'success' | 'already_cancelled' | 'already_completed' | 'not_found' | 'error';

export function CancelReservationPage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<PageState>('loading');
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    if (!token) { setState('not_found'); return; }
    getReservationByToken(token)
      .then(r => {
        if (!r) { setState('not_found'); return; }
        if (r.status === 'cancelled') { setState('already_cancelled'); return; }
        if (r.status === 'completed') { setState('already_completed'); return; }
        setReservation(r);
        setState('found');
      })
      .catch(() => setState('error'));
  }, [token]);

  const handleCancel = async () => {
    if (!token) return;
    setState('confirming');
    try {
      await cancelReservationByToken(token);
      setState('success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg === 'already_cancelled') setState('already_cancelled');
      else if (msg === 'already_completed') setState('already_completed');
      else setState('error');
    }
  };

  return (
    <PageTransition>
      <SEOHead title="Cancella Prenotazione" noindex />
      <div className="min-h-screen bg-venetian-sandstone/20 dark:bg-venetian-brown/95 pt-24 pb-20">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <motion.div
            className="bg-white dark:bg-venetian-brown/60 rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="bg-venetian-brown px-6 py-5">
              <p className="text-venetian-gold text-xs font-medium tracking-[0.2em] uppercase mb-1">
                Ristorante Al Gobbo di Rialto
              </p>
              <h1 className="font-serif text-2xl text-white">Cancellazione Prenotazione</h1>
            </div>
            <div className="h-1 bg-venetian-gold" />

            <div className="p-6 sm:p-8">
              {/* Loading */}
              {state === 'loading' && (
                <div className="flex flex-col items-center gap-4 py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-venetian-gold" />
                  <p className="text-venetian-brown/70 dark:text-venetian-sandstone/70">Caricamento prenotazione...</p>
                </div>
              )}

              {/* Found — show details and confirm button */}
              {(state === 'found' || state === 'confirming') && reservation && (
                <div className="space-y-6">
                  <p className="text-venetian-brown dark:text-venetian-sandstone">
                    Stai per cancellare la seguente prenotazione:
                  </p>

                  <div className="bg-venetian-sandstone/30 dark:bg-venetian-brown/30 rounded-xl border border-venetian-brown/20 divide-y divide-venetian-brown/10">
                    <div className="px-4 py-3 flex items-center gap-3">
                      <Users className="w-4 h-4 text-venetian-gold shrink-0" />
                      <span className="text-venetian-brown dark:text-venetian-sandstone font-medium">{reservation.name}</span>
                    </div>
                    <div className="px-4 py-3 flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-venetian-gold shrink-0" />
                      <span className="text-venetian-brown dark:text-venetian-sandstone">
                        {format(parseISO(reservation.date), 'EEEE d MMMM yyyy', { locale: it })}
                      </span>
                    </div>
                    <div className="px-4 py-3 flex items-center gap-3">
                      <Clock className="w-4 h-4 text-venetian-gold shrink-0" />
                      <span className="text-venetian-brown dark:text-venetian-sandstone">
                        {reservation.time.slice(0, 5)} — {reservation.guests} {reservation.guests === 1 ? 'ospite' : 'ospiti'}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-venetian-brown/60 dark:text-venetian-sandstone/60">
                    Questa azione è irreversibile. Se vuoi modificare la prenotazione invece di cancellarla,
                    contattaci al <a href="tel:+390415204603" className="text-venetian-gold hover:underline">+39 041 520 4603</a>.
                  </p>

                  <div className="flex gap-3">
                    <Link to="/reserve" className="flex-1">
                      <Button variant="outline" className="w-full" disabled={state === 'confirming'}>
                        Mantieni prenotazione
                      </Button>
                    </Link>
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      onClick={handleCancel}
                      disabled={state === 'confirming'}
                    >
                      {state === 'confirming' ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Cancello...
                        </span>
                      ) : (
                        'Sì, cancella'
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Success */}
              {state === 'success' && (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <CheckCircle className="w-14 h-14 text-green-500" />
                  <h2 className="font-serif text-xl text-venetian-brown dark:text-venetian-sandstone">
                    Prenotazione cancellata
                  </h2>
                  <p className="text-venetian-brown/70 dark:text-venetian-sandstone/70 text-sm max-w-sm">
                    La tua prenotazione è stata cancellata con successo. Speriamo di rivederti presto!
                  </p>
                  <Link to="/reserve">
                    <Button className="bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90 mt-2">
                      Fai una nuova prenotazione
                    </Button>
                  </Link>
                </div>
              )}

              {/* Already cancelled */}
              {state === 'already_cancelled' && (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <XCircle className="w-14 h-14 text-venetian-brown/40 dark:text-venetian-sandstone/40" />
                  <h2 className="font-serif text-xl text-venetian-brown dark:text-venetian-sandstone">
                    Già cancellata
                  </h2>
                  <p className="text-venetian-brown/70 dark:text-venetian-sandstone/70 text-sm max-w-sm">
                    Questa prenotazione risulta già cancellata.
                  </p>
                  <Link to="/reserve">
                    <Button className="bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90 mt-2">
                      Fai una nuova prenotazione
                    </Button>
                  </Link>
                </div>
              )}

              {/* Already completed */}
              {state === 'already_completed' && (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <XCircle className="w-14 h-14 text-venetian-brown/40 dark:text-venetian-sandstone/40" />
                  <h2 className="font-serif text-xl text-venetian-brown dark:text-venetian-sandstone">
                    Prenotazione completata
                  </h2>
                  <p className="text-venetian-brown/70 dark:text-venetian-sandstone/70 text-sm max-w-sm">
                    Non è possibile cancellare una prenotazione già completata.
                  </p>
                  <Link to="/">
                    <Button className="bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90 mt-2">
                      Torna alla home
                    </Button>
                  </Link>
                </div>
              )}

              {/* Not found */}
              {state === 'not_found' && (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <XCircle className="w-14 h-14 text-red-400" />
                  <h2 className="font-serif text-xl text-venetian-brown dark:text-venetian-sandstone">
                    Link non valido
                  </h2>
                  <p className="text-venetian-brown/70 dark:text-venetian-sandstone/70 text-sm max-w-sm">
                    Il link di cancellazione non è valido o è scaduto.
                    Contattaci al{' '}
                    <a href="tel:+390415204603" className="text-venetian-gold hover:underline">+39 041 520 4603</a>{' '}
                    per assistenza.
                  </p>
                  <Link to="/">
                    <Button className="bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90 mt-2">
                      Torna alla home
                    </Button>
                  </Link>
                </div>
              )}

              {/* Error */}
              {state === 'error' && (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <XCircle className="w-14 h-14 text-red-400" />
                  <h2 className="font-serif text-xl text-venetian-brown dark:text-venetian-sandstone">
                    Errore
                  </h2>
                  <p className="text-venetian-brown/70 dark:text-venetian-sandstone/70 text-sm max-w-sm">
                    Si è verificato un errore. Riprova più tardi o contattaci al{' '}
                    <a href="tel:+390415204603" className="text-venetian-gold hover:underline">+39 041 520 4603</a>.
                  </p>
                  <Link to="/">
                    <Button className="bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90 mt-2">
                      Torna alla home
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
