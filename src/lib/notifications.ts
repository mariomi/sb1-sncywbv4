export async function sendReservationConfirmation(
  reservation: ReservationFormData
) {
  console.log(
    '📩 Chiamata a sendReservationConfirmation con i dati:',
    reservation
  );

  try {
    const response = await fetch('http://localhost:3001/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservation),
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.error || 'Errore sconosciuto');

    console.log('✅ Email inviata con successo:', result);
    return result;
  } catch (error) {
    console.error("❌ Errore nell'invio dell'email:", error);
    throw new Error(error.message || 'Errore sconosciuto');
  }
}
