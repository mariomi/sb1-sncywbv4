import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck, Clock, Loader2, MessageCircle, Search, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useFeatureFlag } from '../../lib/featureFlags';
import { sendAdminWhatsAppReply } from '../../lib/notifications';
import type { Database } from '../../lib/database.types';
import { Button } from '../Button';

type WhatsAppMessage = Database['public']['Tables']['whatsapp_messages']['Row'];

const purposeLabels: Record<string, string> = {
  reservation_confirmation: 'Conferma prenotazione',
  reservation_updated: 'Prenotazione aggiornata',
  reservation_cancelled: 'Prenotazione cancellata',
  reminder_24h: 'Promemoria 24 ore',
  reminder_2h: 'Promemoria 2 ore',
  waitlist_available: 'Tavolo disponibile',
  manual_reply: 'Risposta del ristorante',
  customer_message: 'Messaggio del cliente',
};

function DeliveryIcon({ status }: { status: string }) {
  if (status === 'read') return <CheckCheck className="h-4 w-4 text-sky-600" aria-label="Letto" />;
  if (status === 'delivered') return <CheckCheck className="h-4 w-4 text-venetian-brown/60" aria-label="Consegnato" />;
  if (status === 'sent') return <Check className="h-4 w-4 text-venetian-brown/60" aria-label="Inviato" />;
  return <Clock className="h-4 w-4 text-venetian-brown/50" aria-label={status} />;
}

export function WhatsAppInboxPanel() {
  const enabled = useFeatureFlag('whatsapp_notifications', false);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      setMessages(data ?? []);
    } catch (error) {
      console.error('Error loading WhatsApp messages:', error);
      toast.error('Impossibile caricare i messaggi WhatsApp');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const filteredMessages = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return messages;
    return messages.filter((message) => [
      message.contact_phone,
      message.body_text,
      message.template_name,
      purposeLabels[message.purpose],
    ].some((value) => value?.toLocaleLowerCase().includes(term)));
  }, [messages, search]);

  const markRead = async (message: WhatsAppMessage) => {
    if (message.direction !== 'inbound' || message.admin_read_at) return;
    const readAt = new Date().toISOString();
    const { error } = await supabase
      .from('whatsapp_messages')
      .update({ admin_read_at: readAt })
      .eq('id', message.id);
    if (error) {
      toast.error('Impossibile segnare il messaggio come letto');
      return;
    }
    setMessages((current) => current.map((item) => item.id === message.id
      ? { ...item, admin_read_at: readAt }
      : item));
  };

  const sendReply = async (message: WhatsAppMessage) => {
    if (!replyText.trim() || isSending) return;
    setIsSending(true);
    try {
      await sendAdminWhatsAppReply({
        phone: message.contact_phone,
        body: replyText.trim(),
        reservationId: message.reservation_id,
        replyToProviderMessageId: message.provider_message_id,
      });
      setReplyText('');
      setReplyingTo(null);
      await markRead(message);
      await loadMessages();
      toast.success('Risposta WhatsApp inviata');
    } catch (error) {
      console.error('Error sending WhatsApp reply:', error);
      toast.error(error instanceof Error ? error.message : 'Invio WhatsApp non riuscito');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-5">
      {!enabled ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          La struttura WhatsApp è pronta ma disattivata. Attivala solo dopo aver collegato il numero Meta, il webhook e i modelli approvati.
        </div>
      ) : null}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-venetian-brown/40" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cerca numero o messaggio..."
          className="w-full rounded-lg border border-venetian-brown/20 bg-white/80 py-2.5 pl-10 pr-4 focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-venetian-brown" /></div>
      ) : filteredMessages.length === 0 ? (
        <div className="rounded-xl bg-white/80 py-12 text-center shadow-sm">
          <MessageCircle className="mx-auto mb-3 h-12 w-12 text-venetian-brown/25" />
          <p className="font-medium text-venetian-brown">Nessun messaggio WhatsApp</p>
          <p className="mt-1 text-sm text-venetian-brown/60">Le conferme e le risposte dei clienti appariranno qui.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => {
            const inbound = message.direction === 'inbound';
            const isReplying = replyingTo === message.id;
            return (
              <article
                key={message.id}
                className={`rounded-xl border bg-white/95 p-5 shadow-sm ${inbound && !message.admin_read_at ? 'border-l-4 border-l-green-600' : 'border-venetian-brown/10'}`}
                onFocus={() => markRead(message)}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-venetian-brown">{message.contact_phone}</p>
                    <p className="mt-0.5 text-xs text-venetian-brown/55">
                      {purposeLabels[message.purpose] ?? message.purpose} · {format(new Date(message.created_at), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-venetian-brown/5 px-2.5 py-1 text-xs text-venetian-brown/65">
                    {inbound ? <MessageCircle className="h-4 w-4 text-green-700" /> : <DeliveryIcon status={message.status} />}
                    {inbound ? 'Ricevuto' : message.status}
                  </div>
                </div>

                <div className={`mt-4 rounded-xl p-4 text-sm leading-6 ${inbound ? 'bg-green-50 text-green-950' : 'bg-venetian-brown/5 text-venetian-brown'}`}>
                  {message.body_text || `Modello Meta: ${message.template_name ?? purposeLabels[message.purpose] ?? message.purpose}`}
                </div>

                {message.error_message ? (
                  <p className="mt-2 text-xs text-red-700">Errore: {message.error_message}</p>
                ) : null}

                {inbound ? (
                  <div className="mt-4">
                    {isReplying ? (
                      <div className="space-y-2">
                        <textarea
                          value={replyText}
                          onChange={(event) => setReplyText(event.target.value)}
                          rows={3}
                          maxLength={1000}
                          placeholder="Scrivi una risposta..."
                          className="w-full rounded-lg border border-venetian-brown/20 bg-white px-3 py-2 text-sm focus:border-venetian-gold focus:ring-1 focus:ring-venetian-gold"
                        />
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={() => { setReplyingTo(null); setReplyText(''); }}>Annulla</Button>
                          <Button type="button" size="sm" disabled={!enabled || !replyText.trim() || isSending} onClick={() => sendReply(message)} className="bg-green-700 text-white hover:bg-green-800">
                            {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}Invia
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <Button type="button" size="sm" disabled={!enabled} onClick={() => { setReplyingTo(message.id); setReplyText(''); }} className="bg-green-700 text-white hover:bg-green-800">
                          Rispondi su WhatsApp
                        </Button>
                      </div>
                    )}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
