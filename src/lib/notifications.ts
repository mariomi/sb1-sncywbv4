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
