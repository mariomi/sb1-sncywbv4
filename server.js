import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

// Carica variabili ambiente
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const resend = new Resend(process.env.VITE_RESEND_API_KEY);

// 📩 Endpoint per inviare email al cliente
app.post('/send-email', async (req, res) => {
  console.log('📧 Starting email sending process...');
  console.log('API Key:', process.env.VITE_RESEND_API_KEY ? '✅ Present' : '❌ Missing');
  console.log('📝 Request body:', JSON.stringify(req.body, null, 2));

  const { name, email, date, time, guests, occasion, special_requests } = req.body;

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
          ${special_requests ? `<li><strong>Special Requests:</strong> ${special_requests}</li>` : ''}
        </ul>
        <p>We look forward to welcoming you to Al Gobbo di Rialto!</p>
        <p>Best regards,<br>Al Gobbo di Rialto Team</p>
      </div>
    `;

    const response = await resend.emails.send({
      from: 'Reservations <reservations@ristorantealgobbodirialto.com>',
      to: email,
      subject: 'Reservation Confirmation - Al Gobbo di Rialto',
      html: emailHtml,
    });

    console.log('✅ Email sent successfully:', response);
    res.json({ success: true, response });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📩 Endpoint per inviare email all'amministratore
app.post('/send-admin-confirmation', async (req, res) => {
  console.log('📧 Starting admin confirmation email process...');
  const { name, email, date, time, guests, occasion, special_requests } = req.body;

  try {
    const emailHtml = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1>New Reservation</h1>
        <p>A new reservation has been made:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
          <li><strong>Guests:</strong> ${guests}</li>
          ${occasion ? `<li><strong>Occasion:</strong> ${occasion}</li>` : ''}
          ${special_requests ? `<li><strong>Special Requests:</strong> ${special_requests}</li>` : ''}
        </ul>
      </div>
    `;

    const response = await resend.emails.send({
      from: 'Reservations <reservations@ristorantealgobbodirialto.com>',
      to: 'reservations@ristorantealgobbodirialto.com', // Email admin
      subject: 'New Reservation Received - Al Gobbo di Rialto',
      html: emailHtml,
    });

    console.log('✅ Admin email sent successfully:', response);
    res.json({ success: true, response });
  } catch (error) {
    console.error('❌ Error sending admin email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🚀 Avvia server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});