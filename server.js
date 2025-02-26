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
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1>Reservation Confirmation</h1>
        <p>Dear ${name},</p>
        <p>Your reservation is confirmed for:</p>
        <ul>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
          <li><strong>Guests:</strong> ${guests}</li>
          ${occasion ? `<li><strong>Occasion:</strong> ${occasion}</li>` : ''}
          ${
            special_requests
              ? `<li><strong>Special Requests:</strong> ${special_requests}</li>`
              : ''
          }
        </ul>
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
