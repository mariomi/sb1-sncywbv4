import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../Button';
import {
  getAvailableTimeSlots,
  updateReservationDetails,
  type ReservationStatus,
  type ReservationUpdateData,
} from '../../lib/api';
import type { Database } from '../../lib/database.types';

type Reservation = Database['public']['Tables']['reservations']['Row'];

type AvailableSlot = {
  time: string;
  available: boolean;
};

type EditReservationModalProps = {
  reservation: Reservation | null;
  onClose: () => void;
  onSaved: (reservation: Reservation) => void;
};

const statusOptions: Array<{ value: ReservationStatus; label: string }> = [
  { value: 'pending', label: 'In attesa' },
  { value: 'confirmed', label: 'Confermata' },
  { value: 'completed', label: 'Completata' },
  { value: 'no_show', label: 'No-show' },
  { value: 'cancelled', label: 'Cancellata' },
];

const sourceOptions = [
  { value: 'online', label: 'Online' },
  { value: 'phone', label: 'Telefono' },
  { value: 'walk_in', label: 'Passaggio diretto' },
];

export function EditReservationModal({ reservation, onClose, onSaved }: EditReservationModalProps) {
  const [formData, setFormData] = useState<ReservationUpdateData>({});
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!reservation) return;
    setFormData({
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone,
      date: reservation.date,
      time: reservation.time.slice(0, 5),
      guests: reservation.guests,
      occasion: reservation.occasion ?? '',
      special_requests: reservation.special_requests ?? '',
      admin_notes: reservation.admin_notes ?? '',
      source: reservation.source ?? 'online',
      status: reservation.status,
    });
  }, [reservation]);

  useEffect(() => {
    if (!reservation || !formData.date) return;
    let active = true;
    setIsLoadingSlots(true);
    getAvailableTimeSlots(formData.date)
      .then((slots) => {
        if (active) setAvailableSlots(slots);
      })
      .catch((error) => {
        console.error('Error loading time slots for reservation edit:', error);
        if (active) toast.error('Impossibile caricare gli orari disponibili');
      })
      .finally(() => {
        if (active) setIsLoadingSlots(false);
      });

    return () => {
      active = false;
    };
  }, [formData.date, reservation]);

  const setField = <Key extends keyof ReservationUpdateData>(
    field: Key,
    value: ReservationUpdateData[Key],
  ) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!reservation) return;

    setIsSaving(true);
    try {
      const updatedReservation = await updateReservationDetails(reservation.id, {
        ...formData,
        name: formData.name?.trim(),
        email: formData.email?.trim().toLowerCase(),
        phone: formData.phone?.trim(),
        occasion: formData.occasion?.trim() || null,
        special_requests: formData.special_requests?.trim() || null,
        admin_notes: formData.admin_notes?.trim() || null,
      });
      toast.success('Prenotazione aggiornata');
      onSaved(updatedReservation);
    } catch (error) {
      console.error('Error saving reservation:', error);
      toast.error('Impossibile aggiornare la prenotazione');
    } finally {
      setIsSaving(false);
    }
  };

  const currentTime = reservation?.time.slice(0, 5) ?? '';
  const selectableSlots = availableSlots.filter((slot) => slot.available || slot.time.slice(0, 5) === currentTime);

  return (
    <AnimatePresence>
      {reservation ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-0 backdrop-blur-sm md:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-reservation-title"
            className="min-h-screen w-full overflow-y-auto bg-white shadow-2xl dark:bg-venetian-brown md:min-h-0 md:max-w-3xl md:rounded-2xl md:max-h-[92vh]"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-venetian-brown/10 bg-white/95 px-5 py-4 backdrop-blur dark:border-white/10 dark:bg-venetian-brown/95 sm:px-6">
              <div>
                <h2 id="edit-reservation-title" className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone">
                  Modifica prenotazione
                </h2>
                <p className="text-sm text-venetian-brown/60 dark:text-venetian-sandstone/60">
                  Aggiorna i dati ricevuti dal cliente o inseriti al telefono.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-venetian-brown transition hover:bg-venetian-brown/10 dark:text-venetian-sandstone dark:hover:bg-white/10"
                aria-label="Chiudi modifica prenotazione"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-venetian-brown dark:text-venetian-sandstone">
                  Nome e cognome
                  <input
                    type="text"
                    value={formData.name ?? ''}
                    onChange={(event) => setField('name', event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-venetian-brown/20 bg-white px-4 py-3 text-base text-venetian-brown focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold"
                    required
                  />
                </label>
                <label className="text-sm font-medium text-venetian-brown dark:text-venetian-sandstone">
                  Email
                  <input
                    type="email"
                    value={formData.email ?? ''}
                    onChange={(event) => setField('email', event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-venetian-brown/20 bg-white px-4 py-3 text-base text-venetian-brown focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold"
                    required
                  />
                </label>
                <label className="text-sm font-medium text-venetian-brown dark:text-venetian-sandstone">
                  Telefono
                  <input
                    type="tel"
                    value={formData.phone ?? ''}
                    onChange={(event) => setField('phone', event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-venetian-brown/20 bg-white px-4 py-3 text-base text-venetian-brown focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold"
                    required
                  />
                </label>
                <label className="text-sm font-medium text-venetian-brown dark:text-venetian-sandstone">
                  Numero ospiti
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={formData.guests ?? 1}
                    onChange={(event) => setField('guests', Number(event.target.value))}
                    className="mt-1.5 w-full rounded-lg border border-venetian-brown/20 bg-white px-4 py-3 text-base text-venetian-brown focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold"
                    required
                  />
                </label>
                <label className="text-sm font-medium text-venetian-brown dark:text-venetian-sandstone">
                  Data
                  <input
                    type="date"
                    value={formData.date ?? ''}
                    onChange={(event) => {
                      setField('date', event.target.value);
                      setField('time', '');
                    }}
                    className="mt-1.5 w-full rounded-lg border border-venetian-brown/20 bg-white px-4 py-3 text-base text-venetian-brown focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold"
                    required
                  />
                </label>
                <label className="text-sm font-medium text-venetian-brown dark:text-venetian-sandstone">
                  Orario
                  <select
                    value={formData.time ?? ''}
                    onChange={(event) => setField('time', event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-venetian-brown/20 bg-white px-4 py-3 text-base text-venetian-brown focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold"
                    disabled={isLoadingSlots}
                    required
                  >
                    <option value="">{isLoadingSlots ? 'Caricamento orari…' : 'Seleziona orario'}</option>
                    {selectableSlots.map((slot) => (
                      <option key={slot.time} value={slot.time.slice(0, 5)}>
                        {slot.time.slice(0, 5)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium text-venetian-brown dark:text-venetian-sandstone">
                  Stato
                  <select
                    value={formData.status ?? 'pending'}
                    onChange={(event) => setField('status', event.target.value as ReservationStatus)}
                    className="mt-1.5 w-full rounded-lg border border-venetian-brown/20 bg-white px-4 py-3 text-base text-venetian-brown focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium text-venetian-brown dark:text-venetian-sandstone">
                  Origine
                  <select
                    value={formData.source ?? 'online'}
                    onChange={(event) => setField('source', event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-venetian-brown/20 bg-white px-4 py-3 text-base text-venetian-brown focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold"
                  >
                    {sourceOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-venetian-brown dark:text-venetian-sandstone">
                  Occasione
                  <input
                    type="text"
                    value={formData.occasion ?? ''}
                    onChange={(event) => setField('occasion', event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-venetian-brown/20 bg-white px-4 py-3 text-base text-venetian-brown focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold"
                  />
                </label>
                <label className="text-sm font-medium text-venetian-brown dark:text-venetian-sandstone">
                  Richieste del cliente
                  <textarea
                    value={formData.special_requests ?? ''}
                    onChange={(event) => setField('special_requests', event.target.value)}
                    rows={3}
                    className="mt-1.5 w-full rounded-lg border border-venetian-brown/20 bg-white px-4 py-3 text-base text-venetian-brown focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold"
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-venetian-brown dark:text-venetian-sandstone">
                Note interne (non visibili al cliente)
                <textarea
                  value={formData.admin_notes ?? ''}
                  onChange={(event) => setField('admin_notes', event.target.value)}
                  rows={3}
                  className="mt-1.5 w-full rounded-lg border border-venetian-brown/20 bg-white px-4 py-3 text-base text-venetian-brown focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold"
                />
              </label>

              <div className="sticky bottom-0 -mx-5 -mb-5 flex flex-col-reverse gap-2 border-t border-venetian-brown/10 bg-white/95 px-5 py-4 backdrop-blur dark:border-white/10 dark:bg-venetian-brown/95 sm:-mx-6 sm:-mb-6 sm:flex-row sm:justify-end sm:px-6">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                  Annulla
                </Button>
                <Button type="submit" className="bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isSaving ? 'Salvataggio…' : 'Salva modifiche'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
