import { supabase } from './supabase';

/**
 * Ask the trusted backend to send the confirmation. The backend reloads the
 * reservation from Supabase, so a browser can never choose the recipient or
 * alter the email content.
 */
export async function sendReservationConfirmation(
  reservationId: string,
  cancellationToken: string,
): Promise<void> {
  const { data, error } = await supabase.functions.invoke('send-reservation-confirmation', {
    body: {
      reservation_id: reservationId,
      cancellation_token: cancellationToken,
    },
  });

  if (error) {
    throw new Error('Impossibile inviare la conferma email');
  }
  if (data?.error) {
    throw new Error(data.error);
  }
}

/**
 * Ask the trusted backend to acknowledge a saved contact message. The
 * recipient and content are always loaded from Supabase by message ID.
 */
export async function sendContactConfirmation(messageId: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke('send-contact-confirmation', {
    body: { message_id: messageId },
  });

  if (error) {
    throw new Error('Impossibile inviare la ricevuta email');
  }
  if (data?.error) {
    throw new Error(data.error);
  }
}

export type ReservationWhatsAppPurpose =
  | 'reservation_confirmation'
  | 'reservation_updated'
  | 'reservation_cancelled'
  | 'reminder_24h'
  | 'reminder_2h';

/**
 * Ask the backend to send one approved Meta template. The backend reloads the
 * booking and verifies both its private token and the recorded WhatsApp opt-in.
 */
export async function sendReservationWhatsApp(
  reservationId: string,
  cancellationToken: string,
  purpose: ReservationWhatsAppPurpose,
): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke('send-whatsapp-notification', {
    body: {
      reservation_id: reservationId,
      cancellation_token: cancellationToken,
      purpose,
    },
  });

  if (error) throw new Error('Impossibile inviare il messaggio WhatsApp');
  if (data?.error) throw new Error(data.error);
  return data?.sent === true;
}

export async function sendAdminWhatsAppReply(input: {
  phone: string;
  body: string;
  reservationId?: string | null;
  replyToProviderMessageId?: string | null;
}): Promise<void> {
  const { data, error } = await supabase.functions.invoke('send-whatsapp-reply', {
    body: {
      phone: input.phone,
      body: input.body,
      reservation_id: input.reservationId ?? null,
      reply_to_provider_message_id: input.replyToProviderMessageId ?? null,
    },
  });

  if (error) throw new Error('Impossibile inviare la risposta WhatsApp');
  if (data?.error) throw new Error(data.error);
}
