import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { Button } from '../Button';
import { cn } from '../../lib/utils';
import { format, addMonths } from 'date-fns';
import toast from 'react-hot-toast';
import { getAvailableTimeSlots, createManualReservation } from '../../lib/api';

type TimeSlotOption = {
  id: string;
  time: string;
  available: boolean;
  remainingCapacity: number;
  isActive: boolean;
  isLunch: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const inputClass =
  'w-full px-4 py-2 rounded-lg border border-venetian-brown/20 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold bg-white/50 dark:bg-venetian-brown/20 dark:border-venetian-sandstone/20 dark:text-venetian-sandstone text-venetian-brown';

const today = format(new Date(), 'yyyy-MM-dd');
const maxDate = format(addMonths(new Date(), 3), 'yyyy-MM-dd');

export function ManualReservationModal({ isOpen, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    occasion: '',
    admin_notes: '',
    special_requests: '',
    initial_status: 'confirmed' as 'pending' | 'confirmed',
    source: 'phone' as 'phone' | 'walk_in' | 'online',
    send_confirmation_email: true,
  });
  const [timeSlots, setTimeSlots] = useState<TimeSlotOption[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (form.date) {
      setLoadingSlots(true);
      setForm(prev => ({ ...prev, time: '' }));
      getAvailableTimeSlots(form.date)
        .then(slots => setTimeSlots(slots))
        .catch(err => {
          console.error(err);
          toast.error('Errore nel caricare gli orari');
        })
        .finally(() => setLoadingSlots(false));
    }
  }, [form.date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.time || !form.name || !form.email || !form.phone) {
      toast.error('Compila tutti i campi obbligatori');
      return;
    }
    setSaving(true);
    try {
      await createManualReservation({
        date: form.date,
        time: form.time,
        guests: form.guests,
        name: form.name,
        email: form.email,
        phone: form.phone,
        occasion: form.occasion || undefined,
        special_requests: form.special_requests || undefined,
        admin_notes: form.admin_notes || undefined,
        source: form.source,
        initial_status: form.initial_status,
        send_confirmation_email: form.send_confirmation_email,
      });
      toast.success('Prenotazione creata con successo');
      onSuccess();
      onClose();
      setForm({
        name: '', email: '', phone: '', date: '', time: '', guests: 2,
        occasion: '', admin_notes: '', special_requests: '',
        initial_status: 'confirmed', source: 'phone', send_confirmation_email: true,
      });
    } catch (error) {
      console.error('Error creating manual reservation:', error);
      toast.error('Errore: ' + (error instanceof Error ? error.message : 'Impossibile creare la prenotazione'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-venetian-brown/95 rounded-2xl shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-venetian-brown/10 dark:border-venetian-sandstone/10">
              <h3 className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone">
                Nuova Prenotazione Manuale
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-venetian-brown/5 dark:hover:bg-white/5 text-venetian-brown/60 dark:text-venetian-sandstone/60"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-venetian-brown dark:text-venetian-sandstone mb-1">
                  Origine prenotazione
                </label>
                <select
                  value={form.source}
                  onChange={e => setForm(prev => ({ ...prev, source: e.target.value as 'phone' | 'walk_in' | 'online' }))}
                  className={inputClass}
                >
                  <option value="phone">Telefono</option>
                  <option value="walk_in">Walk-in</option>
                  <option value="online">Online (admin)</option>
                </select>
              </div>

              {/* Name & Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-venetian-brown dark:text-venetian-sandstone mb-1">
                    Nome cliente *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className={inputClass}
                    placeholder="Mario Rossi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-venetian-brown dark:text-venetian-sandstone mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                    className={inputClass}
                    placeholder="mario@esempio.it"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-venetian-brown dark:text-venetian-sandstone mb-1">
                  Telefono *
                </label>
                <input
                  type="text"
                  required
                  value={form.phone}
                  onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  className={inputClass}
                  placeholder="+39 041 520 4603"
                />
              </div>

              {/* Date & Guests */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-venetian-brown dark:text-venetian-sandstone mb-1">
                    Data *
                  </label>
                  <input
                    type="date"
                    required
                    min={today}
                    max={maxDate}
                    value={form.date}
                    onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-venetian-brown dark:text-venetian-sandstone mb-1">
                    Numero ospiti *
                  </label>
                  <select
                    value={form.guests}
                    onChange={e => setForm(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                    className={inputClass}
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'ospite' : 'ospiti'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-venetian-brown dark:text-venetian-sandstone mb-1">
                  Orario *
                </label>
                {loadingSlots ? (
                  <div className="flex items-center gap-2 py-2 text-venetian-brown/60 dark:text-venetian-sandstone/60">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">Caricamento orari...</span>
                  </div>
                ) : (
                  <select
                    required
                    value={form.time}
                    onChange={e => setForm(prev => ({ ...prev, time: e.target.value }))}
                    className={inputClass}
                    disabled={!form.date}
                  >
                    <option value="">{form.date ? 'Seleziona orario' : 'Prima seleziona una data'}</option>
                    {timeSlots
                      .filter(s => s.isActive !== false)
                      .map(slot => (
                        <option key={slot.id} value={slot.time}>
                          {slot.time.slice(0, 5)}
                          {!slot.available ? ' — PIENO' : ` — ${slot.remainingCapacity} posti`}
                        </option>
                      ))}
                  </select>
                )}
              </div>

              {/* Occasion */}
              <div>
                <label className="block text-sm font-medium text-venetian-brown dark:text-venetian-sandstone mb-1">
                  Occasione
                </label>
                <select
                  value={form.occasion}
                  onChange={e => setForm(prev => ({ ...prev, occasion: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">Nessuna</option>
                  <option value="birthday">Compleanno</option>
                  <option value="anniversary">Anniversario</option>
                  <option value="business">Cena di lavoro</option>
                  <option value="date">Serata romantica</option>
                  <option value="other">Altra occasione</option>
                </select>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-venetian-brown dark:text-venetian-sandstone mb-1">
                  Richieste speciali
                </label>
                <textarea
                  rows={2}
                  value={form.special_requests}
                  onChange={e => setForm(prev => ({ ...prev, special_requests: e.target.value }))}
                  className={inputClass}
                  placeholder="Allergie, preferenze, ecc."
                />
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-venetian-brown dark:text-venetian-sandstone mb-1">
                  Note interne admin
                  <span className="ml-2 text-xs text-venetian-brown/50 dark:text-venetian-sandstone/50">(non visibili al cliente)</span>
                </label>
                <textarea
                  rows={2}
                  value={form.admin_notes}
                  onChange={e => setForm(prev => ({ ...prev, admin_notes: e.target.value }))}
                  className={cn(inputClass, 'border-venetian-gold/40 bg-venetian-gold/5')}
                  placeholder="Note solo per lo staff..."
                />
              </div>

              {/* Status & Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-venetian-brown dark:text-venetian-sandstone mb-1">
                    Status iniziale
                  </label>
                  <select
                    value={form.initial_status}
                    onChange={e => setForm(prev => ({ ...prev, initial_status: e.target.value as 'pending' | 'confirmed' }))}
                    className={inputClass}
                  >
                    <option value="confirmed">Confermata</option>
                    <option value="pending">In attesa</option>
                  </select>
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.send_confirmation_email}
                      onChange={e => setForm(prev => ({ ...prev, send_confirmation_email: e.target.checked }))}
                      className="w-4 h-4 accent-venetian-gold"
                    />
                    <span className="text-sm text-venetian-brown dark:text-venetian-sandstone">
                      Invia email di conferma al cliente
                    </span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-2 border-t border-venetian-brown/10 dark:border-venetian-sandstone/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={saving}
                  className="text-venetian-brown dark:text-venetian-sandstone"
                >
                  Annulla
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Salvataggio...
                    </span>
                  ) : (
                    'Salva Prenotazione'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
