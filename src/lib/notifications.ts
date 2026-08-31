const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

/**
 * Ask the trusted backend to send the confirmation. The backend reloads the
 * reservation from Supabase, so a browser can never choose the recipient or
 * alter the email content.
 */
export async function sendReservationConfirmation(
  reservationId: string,
  cancellationToken: string,
): Promise<void> {
  const response = await fetch(`${API_BASE}/send-reservation-confirmation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reservation_id: reservationId,
      cancellation_token: cancellationToken,
    }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error || 'Impossibile inviare la conferma email');
  }
}
