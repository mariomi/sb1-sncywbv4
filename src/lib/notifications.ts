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
