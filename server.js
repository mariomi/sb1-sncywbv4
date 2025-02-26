import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

// Carica le variabili d'ambiente
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Permette richieste CORS

const resend = new Resend(process.env.VITE_RESEND_API_KEY);

app.post('/send-email', async (req, res) => {
  console.log('📩 Ricevuta richiesta per inviare email:', req.body);

  const { name, email, date, time, guests, occasion, special_requests } =
    req.body;

  try {
    const emailHtml = `
    <div style="background-color: #f8f3e9; padding: 30px; font-family: 'Georgia', serif; color: #5c4033; max-width: 600px; margin: auto; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://ristorantealgobbodirialto.com/assets/logo.png" alt="Al Gobbo di Rialto" style="max-width: 180px;">
      </div>
      <h1 style="text-align: center; font-size: 26px; color: #8B4513;">Conferma Prenotazione</h1>
      <p style="text-align: center; font-size: 18px;">Gentile <strong>${name}</strong>,</p>
      <p style="text-align: center; font-size: 16px;">
        Siamo lieti di confermare la tua prenotazione presso <strong>Ristorante Al Gobbo di Rialto</strong>.
      </p>
      <div style="background: #e8dac9; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <p><strong>📅 Data:</strong> ${date}</p>
        <p><strong>🕰️ Ora:</strong> ${time}</p>
        <p><strong>👥 Numero di ospiti:</strong> ${guests}</p>
        ${occasion ? `<p><strong>🎉 Occasione:</strong> ${occasion}</p>` : ''}
        ${special_requests ? `<p><strong>📜 Richieste speciali:</strong> ${special_requests}</p>` : ''}
      </div>
      <p style="font-size: 14px; text-align: center; margin-top: 20px;">
        ⏳ Ti ricordiamo che il tavolo verrà mantenuto per un massimo di <strong>15 minuti</strong> dopo l'orario di prenotazione.
      </p>
      <p style="font-size: 14px; text-align: center; margin-top: 30px;">
        📍 <strong>Ristorante Al Gobbo di Rialto</strong><br>
        📍 San Polo, 649, Ruga Rialto, 655, 30125 Venezia VE, Italia<br>
        📞 <a href="tel:+390415204603" style="color: #8B4513; text-decoration: none;">+39 041 520 4603</a><br>
        🌐 <a href="https://ristorantealgobbodirialto.com" style="color: #8B4513; text-decoration: none;">ristorantealgobbodirialto.com</a>
      </p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E6D5B8; font-size: 12px; text-align: center; color: #666;">
        <p>Questa è un'email automatica, si prega di non rispondere.</p>
      </div>
    </div>
  `;
  

    console.log('📤 Inviando email a:', email);

    const response = await resend.emails.send({
      from: 'Reservations <reservations@ristorantealgobbodirialto.com>', // ⬅️ NUOVO MITTENTE VERIFICATO
      to: email,
      subject: 'Reservation Confirmation - Al Gobbo di Rialto',
      html: emailHtml,
    });

    console.log('✅ Email inviata con successo:', response);
    res.json({ success: true, response });
  } catch (error) {
    console.error("❌ Errore nell'invio dell'email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3001, () =>
  console.log('🚀 Server in ascolto su http://localhost:3001')
);
