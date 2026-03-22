import type { ReservationFormData } from './validators';

const API_BASE = 'https://sb1-sncywbv4.onrender.com';

async function postEmail(endpoint: string, data: ReservationFormData): Promise<void> {
  const response = await fetch(`${API_BASE}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!result.success) throw new Error(result.error || 'Errore sconosciuto');
}

export async function sendReservationConfirmation(reservation: ReservationFormData): Promise<void> {
  console.log('📩 Invio email di conferma prenotazione...', reservation);

  // Send both emails concurrently; admin failure must not block the customer email
  const [customerResult, adminResult] = await Promise.allSettled([
    postEmail('send-email', reservation),
    postEmail('send-admin-confirmation', reservation),
  ]);

  if (customerResult.status === 'rejected') {
    console.error('❌ Email cliente non inviata:', customerResult.reason);
    throw new Error(customerResult.reason?.message || 'Invio email fallito');
  }

  console.log('✅ Email cliente inviata con successo');

  if (adminResult.status === 'rejected') {
    // Non-blocking: log but don't throw
    console.error('❌ Email admin non inviata (non bloccante):', adminResult.reason);
  } else {
    console.log('✅ Email admin inviata con successo');
  }
}
