import React, { useState, useEffect } from 'react';
import { Loader2, Bell, Users, Clock } from 'lucide-react';
import { Button } from '../Button';
import { cn } from '../../lib/utils';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { getWaitlistForSlot, notifyWaitlistEntry } from '../../lib/api';
import type { WaitlistEntry } from '../../lib/api';

const STATUS_COLORS: Record<string, string> = {
  waiting: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
  notified: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
  converted: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
  expired: 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400',
};

const STATUS_LABELS: Record<string, string> = {
  waiting: 'In attesa',
  notified: 'Notificato',
  converted: 'Convertito',
  expired: 'Scaduto',
};

type Props = {
  date: string;
  time: string;
};

export function WaitlistPanel({ date, time }: Props) {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifyingId, setNotifyingId] = useState<string | null>(null);

  useEffect(() => {
    loadEntries();
  }, [date, time]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const data = await getWaitlistForSlot(date, time);
      setEntries(data);
    } catch (error) {
      console.error('Error loading waitlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotify = async (entry: WaitlistEntry) => {
    setNotifyingId(entry.id);
    try {
      await notifyWaitlistEntry(entry.id, entry);
      toast.success(`Notifica inviata a ${entry.name}`);
      await loadEntries();
    } catch (error) {
      console.error(error);
      toast.error('Errore nell\'invio della notifica');
    } finally {
      setNotifyingId(null);
    }
  };

  const waitingEntries = entries.filter(e => e.status === 'waiting' || e.status === 'notified');
  const otherEntries = entries.filter(e => e.status !== 'waiting' && e.status !== 'notified');

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 size={18} className="animate-spin text-venetian-brown/40" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <p className="text-sm text-venetian-brown/50 dark:text-venetian-sandstone/50 text-center py-3">
        Nessuno in lista d'attesa per questo orario
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Active entries */}
      {waitingEntries.length > 0 && (
        <div className="space-y-2">
          {waitingEntries.map(entry => (
            <div
              key={entry.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-venetian-brown/5 dark:bg-white/5 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-venetian-brown dark:text-venetian-sandstone text-sm">
                    #{entry.position} {entry.name}
                  </span>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[entry.status])}>
                    {STATUS_LABELS[entry.status]}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-venetian-brown/60 dark:text-venetian-sandstone/60">
                  <span className="flex items-center gap-1">
                    <Users size={11} /> {entry.guests} ospiti
                  </span>
                  <span>{entry.email}</span>
                  <span>{entry.phone}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {format(parseISO(entry.created_at), 'd MMM HH:mm')}
                  </span>
                </div>
              </div>
              {entry.status === 'waiting' && (
                <Button
                  size="sm"
                  className="bg-venetian-gold text-venetian-brown hover:bg-venetian-gold/90 shrink-0"
                  onClick={() => handleNotify(entry)}
                  disabled={notifyingId === entry.id}
                >
                  {notifyingId === entry.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <>
                      <Bell size={14} className="mr-1" />
                      Notifica
                    </>
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Historical entries */}
      {otherEntries.length > 0 && (
        <details className="text-xs">
          <summary className="cursor-pointer text-venetian-brown/50 dark:text-venetian-sandstone/50 hover:text-venetian-brown dark:hover:text-venetian-sandstone">
            Vedi storico ({otherEntries.length})
          </summary>
          <div className="mt-2 space-y-1">
            {otherEntries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-2 rounded opacity-60">
                <span className="text-venetian-brown dark:text-venetian-sandstone">
                  {entry.name} · {entry.guests} ospiti
                </span>
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[entry.status])}>
                  {STATUS_LABELS[entry.status]}
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
