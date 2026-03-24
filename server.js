import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const resend = new Resend(process.env.VITE_RESEND_API_KEY);

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return dateStr;
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const itDay = date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const enDay = date.toLocaleDateString('en-GB',  { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return { it: itDay.charAt(0).toUpperCase() + itDay.slice(1), en: enDay };
}

function formatTime(timeStr) {
  if (!timeStr) return timeStr;
  return timeStr.slice(0, 5); // "19:00:00" → "19:00"
}

function occasionLabel(occasion) {
  const map = {
    birthday:    { it: 'Compleanno',          en: 'Birthday' },
    anniversary: { it: 'Anniversario',         en: 'Anniversary' },
    business:    { it: 'Cena di lavoro',       en: 'Business Dinner' },
    date:        { it: 'Serata romantica',     en: 'Date Night' },
    other:       { it: 'Occasione speciale',   en: 'Special Occasion' },
  };
  return map[occasion] || { it: occasion, en: occasion };
}

// ─── HTML template for CUSTOMER confirmation ────────────────────────────────

function buildCustomerHtml({ name, email, phone, date, time, guests, occasion, special_requests, manageUrl }) {
  const fDate = formatDate(date);
  const fTime = formatTime(time);
  const occ   = occasion ? occasionLabel(occasion) : null;
  const gColor = '#5C4033'; // venetian-brown
  const gold   = '#D4AF37'; // venetian-gold
  const sand   = '#F5EDD8'; // light sandstone

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Conferma Prenotazione — Al Gobbo di Rialto</title>
</head>
<body style="margin:0;padding:0;background:#f0e8d5;font-family:'Helvetica Neue',Arial,sans-serif;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0e8d5;">
    <tr><td align="center" style="padding:32px 16px;">

      <!-- Card -->
      <table role="presentation" width="600" cellpadding="0" cellspacing="0"
             style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(92,64,51,0.12);">

        <!-- Header -->
        <tr>
          <td style="background:${gColor};padding:40px 40px 32px;text-align:center;">
            <p style="margin:0 0 8px;font-size:13px;letter-spacing:4px;text-transform:uppercase;color:${gold};font-weight:600;">
              Ristorante
            </p>
            <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:1px;font-family:Georgia,serif;">
              Al Gobbo di Rialto
            </h1>
            <p style="margin:10px 0 0;font-size:13px;color:#d4b896;letter-spacing:2px;text-transform:uppercase;">
              Venezia &nbsp;·&nbsp; Dal 1987
            </p>
          </td>
        </tr>

        <!-- Gold divider -->
        <tr><td style="height:4px;background:${gold};"></td></tr>

        <!-- Confirmation badge -->
        <tr>
          <td style="background:${sand};padding:28px 40px;text-align:center;border-bottom:1px solid #e8d5b0;">
            <p style="margin:0;font-size:22px;font-weight:700;color:${gColor};font-family:Georgia,serif;">
              ✓ &nbsp;Prenotazione Confermata
            </p>
            <p style="margin:4px 0 0;font-size:14px;color:#8a7060;">Reservation Confirmed</p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:32px 40px 8px;">
            <p style="margin:0;font-size:16px;color:${gColor};line-height:1.7;">
              Gentile <strong>${name}</strong>,
            </p>
            <p style="margin:12px 0 0;font-size:15px;color:#6b5244;line-height:1.8;">
              La ringraziamo per aver scelto il Ristorante Al Gobbo di Rialto.<br/>
              Siamo lieti di confermare la sua prenotazione e non vediamo l'ora di accoglierla.
            </p>
            <p style="margin:8px 0 0;font-size:13px;color:#9e8272;line-height:1.7;font-style:italic;">
              Thank you for choosing Al Gobbo di Rialto. We look forward to welcoming you.
            </p>
          </td>
        </tr>

        <!-- Reservation details box -->
        <tr>
          <td style="padding:24px 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                   style="background:${sand};border-radius:10px;border:1px solid #e0c99a;overflow:hidden;">
              <tr>
                <td style="padding:20px 24px;border-bottom:1px solid #e0c99a;">
                  <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${gold};font-weight:700;">
                    Dettagli Prenotazione &nbsp;/&nbsp; Reservation Details
                  </p>
                </td>
              </tr>
              <!-- Date -->
              <tr>
                <td style="padding:16px 24px 4px;">
                  <table role="presentation" width="100%"><tr>
                    <td style="width:36px;vertical-align:top;padding-top:2px;">
                      <span style="font-size:20px;">📅</span>
                    </td>
                    <td>
                      <p style="margin:0;font-size:11px;color:#9e8272;text-transform:uppercase;letter-spacing:1px;">Data / Date</p>
                      <p style="margin:2px 0 0;font-size:16px;font-weight:700;color:${gColor};">${fDate.it}</p>
                      <p style="margin:1px 0 0;font-size:12px;color:#9e8272;font-style:italic;">${fDate.en}</p>
                    </td>
                  </tr></table>
                </td>
              </tr>
              <!-- Time -->
              <tr>
                <td style="padding:12px 24px 4px;">
                  <table role="presentation" width="100%"><tr>
                    <td style="width:36px;vertical-align:top;padding-top:2px;">
                      <span style="font-size:20px;">🕐</span>
                    </td>
                    <td>
                      <p style="margin:0;font-size:11px;color:#9e8272;text-transform:uppercase;letter-spacing:1px;">Orario / Time</p>
                      <p style="margin:2px 0 0;font-size:16px;font-weight:700;color:${gColor};">${fTime}</p>
                    </td>
                  </tr></table>
                </td>
              </tr>
              <!-- Guests -->
              <tr>
                <td style="padding:12px 24px 4px;">
                  <table role="presentation" width="100%"><tr>
                    <td style="width:36px;vertical-align:top;padding-top:2px;">
                      <span style="font-size:20px;">👥</span>
                    </td>
                    <td>
                      <p style="margin:0;font-size:11px;color:#9e8272;text-transform:uppercase;letter-spacing:1px;">Ospiti / Guests</p>
                      <p style="margin:2px 0 0;font-size:16px;font-weight:700;color:${gColor};">${guests} ${guests === 1 ? 'persona' : 'persone'}</p>
                    </td>
                  </tr></table>
                </td>
              </tr>
              ${occ ? `<!-- Occasion -->
              <tr>
                <td style="padding:12px 24px 4px;">
                  <table role="presentation" width="100%"><tr>
                    <td style="width:36px;vertical-align:top;padding-top:2px;">
                      <span style="font-size:20px;">🥂</span>
                    </td>
                    <td>
                      <p style="margin:0;font-size:11px;color:#9e8272;text-transform:uppercase;letter-spacing:1px;">Occasione / Occasion</p>
                      <p style="margin:2px 0 0;font-size:16px;font-weight:700;color:${gColor};">${occ.it}</p>
                      <p style="margin:1px 0 0;font-size:12px;color:#9e8272;font-style:italic;">${occ.en}</p>
                    </td>
                  </tr></table>
                </td>
              </tr>` : ''}
              ${special_requests ? `<!-- Special requests -->
              <tr>
                <td style="padding:12px 24px 4px;">
                  <table role="presentation" width="100%"><tr>
                    <td style="width:36px;vertical-align:top;padding-top:2px;">
                      <span style="font-size:20px;">📝</span>
                    </td>
                    <td>
                      <p style="margin:0;font-size:11px;color:#9e8272;text-transform:uppercase;letter-spacing:1px;">Richieste speciali / Special Requests</p>
                      <p style="margin:2px 0 0;font-size:15px;color:${gColor};">${special_requests}</p>
                    </td>
                  </tr></table>
                </td>
              </tr>` : ''}
              <tr><td style="height:16px;"></td></tr>
            </table>
          </td>
        </tr>

        ${manageUrl ? `<!-- Manage reservation buttons -->
        <tr>
          <td style="padding:0 40px 24px;text-align:center;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td style="padding-right:8px;">
                  <a href="${manageUrl}"
                     style="display:inline-block;background:#9E4638;color:#ffffff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;letter-spacing:0.3px;">
                    ✕ &nbsp;Cancella prenotazione
                  </a>
                </td>
                <td style="padding-left:8px;">
                  <a href="tel:+390415204603"
                     style="display:inline-block;background:${gold};color:${gColor};font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;letter-spacing:0.3px;">
                    📞 &nbsp;Contattaci
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>` : ''}

        <!-- Policy reminder -->
        <tr>
          <td style="padding:0 40px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                   style="background:#fdf6ee;border-radius:8px;border-left:4px solid ${gold};">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0;font-size:13px;font-weight:700;color:${gColor};">ℹ️ &nbsp;Da ricordare / Please note</p>
                  <ul style="margin:8px 0 0;padding-left:20px;font-size:13px;color:#6b5244;line-height:1.8;">
                    <li>Il tavolo viene mantenuto per <strong>15 minuti</strong> oltre l'orario prenotato.<br/>
                        <em style="color:#9e8272;">The table is held for 15 minutes after reservation time.</em></li>
                    <li>Cancellazioni entro <strong>24 ore prima</strong> della prenotazione.<br/>
                        <em style="color:#9e8272;">Cancellations must be made at least 24 hours in advance.</em></li>
                  </ul>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Contact info -->
        <tr>
          <td style="padding:0 40px 32px;text-align:center;">
            <p style="margin:0;font-size:14px;color:#6b5244;line-height:2;">
              Per qualsiasi necessità non esiti a contattarci:<br/>
              <strong style="color:${gColor};">📞 +39 041 520 4603</strong><br/>
              <a href="mailto:reservations@ristorantealgobbodirialto.it"
                 style="color:${gold};text-decoration:none;font-weight:600;">
                reservations@ristorantealgobbodirialto.it
              </a>
            </p>
          </td>
        </tr>

        <!-- Gold divider -->
        <tr><td style="height:4px;background:${gold};"></td></tr>

        <!-- Footer -->
        <tr>
          <td style="background:${gColor};padding:24px 40px;text-align:center;">
            <p style="margin:0;font-size:15px;font-family:Georgia,serif;color:${gold};font-style:italic;">
              "A presto a Venezia"
            </p>
            <p style="margin:12px 0 0;font-size:12px;color:#a08878;line-height:1.6;">
              Ristorante Al Gobbo di Rialto<br/>
              Campo San Polo 649, 30125 Venezia VE<br/>
              <a href="https://ristorantealgobbodirialto.it" style="color:#c9a87a;text-decoration:none;">
                ristorantealgobbodirialto.it
              </a>
            </p>
          </td>
        </tr>

      </table>
      <!-- spacer -->
      <p style="margin:20px 0 0;font-size:11px;color:#a09080;text-align:center;">
        Hai ricevuto questa email perché hai effettuato una prenotazione sul nostro sito.<br/>
        You received this email because you made a reservation on our website.
      </p>
    </td></tr>
  </table>

</body>
</html>`;
}

// ─── Plain-text fallback for CUSTOMER ───────────────────────────────────────

function buildCustomerText({ name, date, time, guests, occasion, special_requests, manageUrl }) {
  const fDate = formatDate(date);
  const fTime = formatTime(time);
  const occ   = occasion ? occasionLabel(occasion) : null;
  return [
    'RISTORANTE AL GOBBO DI RIALTO — Venezia',
    '─'.repeat(46),
    '',
    `Gentile ${name},`,
    'La sua prenotazione è confermata / Your reservation is confirmed.',
    '',
    `📅 Data / Date:    ${fDate.it}`,
    `🕐 Orario / Time:  ${fTime}`,
    `👥 Ospiti / Guests: ${guests}`,
    occ ? `🥂 Occasione:       ${occ.it} / ${occ.en}` : '',
    special_requests ? `📝 Richieste:       ${special_requests}` : '',
    '',
    '─'.repeat(46),
    'Il tavolo viene mantenuto 15 minuti dopo l\'orario prenotato.',
    'Cancellazioni entro 24 ore prima.',
    manageUrl ? `\nPer cancellare la prenotazione: ${manageUrl}` : '',
    '',
    'Contatti / Contact:',
    '  Tel: +39 041 520 4603',
    '  Email: reservations@ristorantealgobbodirialto.it',
    '',
    'A presto a Venezia!',
    'Lo staff del Ristorante Al Gobbo di Rialto',
  ].filter(l => l !== null).join('\n');
}

// ─── HTML template for ADMIN notification ───────────────────────────────────

function buildAdminHtml({ name, email, phone, date, time, guests, occasion, special_requests, marketing_consent }) {
  const fDate = formatDate(date);
  const fTime = formatTime(time);
  const occ   = occasion ? occasionLabel(occasion) : null;

  const row = (emoji, label, value) => value ? `
    <tr>
      <td style="padding:10px 20px;border-bottom:1px solid #f0e8d5;font-size:13px;color:#8a7060;white-space:nowrap;width:1%;">
        ${emoji} <strong>${label}</strong>
      </td>
      <td style="padding:10px 20px;border-bottom:1px solid #f0e8d5;font-size:14px;color:#3d2b1f;">
        ${value}
      </td>
    </tr>` : '';

  return `<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8"/><title>Nuova Prenotazione</title></head>
<body style="margin:0;padding:0;background:#f0e8d5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0e8d5;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0"
             style="max-width:560px;width:100%;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 16px rgba(92,64,51,0.10);">
        <tr>
          <td style="background:#5C4033;padding:24px 28px;">
            <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#D4AF37;">Admin — Al Gobbo di Rialto</p>
            <h2 style="margin:6px 0 0;font-size:20px;color:#ffffff;font-family:Georgia,serif;">🔔 Nuova Prenotazione</h2>
          </td>
        </tr>
        <tr><td style="height:3px;background:#D4AF37;"></td></tr>
        <tr>
          <td style="padding:8px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${row('📅', 'Data', `${fDate.it}`)}
              ${row('🕐', 'Orario', fTime)}
              ${row('👥', 'Ospiti', guests)}
              ${row('👤', 'Nome', name)}
              ${row('📧', 'Email', `<a href="mailto:${email}" style="color:#5C4033;">${email}</a>`)}
              ${row('📞', 'Telefono', phone || '—')}
              ${occ ? row('🥂', 'Occasione', `${occ.it}`) : ''}
              ${special_requests ? row('📝', 'Richieste', special_requests) : ''}
              ${row('📣', 'Marketing', marketing_consent ? '✅ Sì / Yes' : '❌ No')}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 24px;background:#fdf6ee;border-top:1px solid #e8d5b0;">
            <p style="margin:0;font-size:12px;color:#9e8272;">
              Vai alla dashboard per confermare o gestire la prenotazione.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Endpoints ───────────────────────────────────────────────────────────────

// Customer confirmation email
app.post('/send-email', async (req, res) => {
  console.log('📧 /send-email called');
  console.log('API Key:', process.env.VITE_RESEND_API_KEY ? '✅ Present' : '❌ Missing');
  console.log('📝 Body:', JSON.stringify(req.body, null, 2));

  const { name, email, phone, date, time, guests, occasion, special_requests, cancellation_token, reservation_id } = req.body;
  const baseUrl = 'https://ristorantealgobbodirialto.it';
  const manageUrl = cancellation_token ? `${baseUrl}/cancella/${cancellation_token}` : null;

  try {
    const response = await resend.emails.send({
      from:     'Al Gobbo di Rialto <reservations@ristorantealgobbodirialto.it>',
      to:       email,
      reply_to: 'reservations@ristorantealgobbodirialto.it',
      subject:  `✅ Prenotazione confermata — ${formatDate(date).it} alle ${formatTime(time)}`,
      html:     buildCustomerHtml({ name, email, phone, date, time, guests, occasion, special_requests, manageUrl }),
      text:     buildCustomerText({ name, date, time, guests, occasion, special_requests, manageUrl }),
    });

    console.log('✅ Customer email sent:', response);
    res.json({ success: true, response });
  } catch (error) {
    console.error('❌ Error sending customer email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin notification email
app.post('/send-admin-confirmation', async (req, res) => {
  console.log('📧 /send-admin-confirmation called');
  const { name, email, phone, date, time, guests, occasion, special_requests, marketing_consent } = req.body;

  try {
    const response = await resend.emails.send({
      from:    'Al Gobbo di Rialto <reservations@ristorantealgobbodirialto.it>',
      to:      'reservations@ristorantealgobbodirialto.it',
      subject: `🔔 Nuova prenotazione — ${name} · ${formatDate(date).it} ${formatTime(time)} · ${guests} ospiti`,
      html:    buildAdminHtml({ name, email, phone, date, time, guests, occasion, special_requests, marketing_consent }),
    });

    console.log('✅ Admin email sent:', response);
    res.json({ success: true, response });
  } catch (error) {
    console.error('❌ Error sending admin email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Waitlist notification email ─────────────────────────────────────────────

app.post('/send-waitlist-notification', async (req, res) => {
  console.log('📧 /send-waitlist-notification called');
  const { name, email, date, time, guests } = req.body;

  const fDate = formatDate(date);
  const fTime = formatTime(time);
  const gColor = '#5C4033';
  const gold = '#D4AF37';
  const sand = '#F5EDD8';

  // Reservation link with pre-filled date and time
  const baseUrl = 'https://ristorantealgobbodirialto.it';
  const reserveLink = `${baseUrl}/prenota?date=${date}&time=${encodeURIComponent(time.slice(0, 5))}`;

  const html = `<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8"/><title>Posto disponibile — Al Gobbo di Rialto</title></head>
<body style="margin:0;padding:0;background:#f0e8d5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0e8d5;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0"
             style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(92,64,51,0.12);">
        <tr>
          <td style="background:${gColor};padding:36px 40px 28px;text-align:center;">
            <p style="margin:0 0 8px;font-size:13px;letter-spacing:4px;text-transform:uppercase;color:${gold};font-weight:600;">Ristorante</p>
            <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;font-family:Georgia,serif;">Al Gobbo di Rialto</h1>
            <p style="margin:8px 0 0;font-size:12px;color:#d4b896;letter-spacing:2px;text-transform:uppercase;">Venezia · Dal 1987</p>
          </td>
        </tr>
        <tr><td style="height:4px;background:${gold};"></td></tr>
        <tr>
          <td style="background:${sand};padding:24px 40px;text-align:center;border-bottom:1px solid #e8d5b0;">
            <p style="margin:0;font-size:22px;font-weight:700;color:${gColor};font-family:Georgia,serif;">
              🎉 &nbsp;Si è liberato un posto!
            </p>
            <p style="margin:4px 0 0;font-size:13px;color:#8a7060;">A spot has become available</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 40px;">
            <p style="margin:0;font-size:16px;color:${gColor};">Gentile <strong>${name}</strong>,</p>
            <p style="margin:12px 0 0;font-size:15px;color:#6b5244;line-height:1.8;">
              Si è liberato un posto per la sua lista d'attesa!<br/>
              Ha <strong>2 ore</strong> di tempo per completare la prenotazione.
            </p>
            <p style="margin:8px 0 0;font-size:13px;color:#9e8272;font-style:italic;line-height:1.7;">
              A spot has opened up for your waitlist request. You have 2 hours to complete your reservation.
            </p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                   style="background:${sand};border-radius:10px;border:1px solid #e0c99a;margin-top:20px;">
              <tr><td style="padding:16px 20px;border-bottom:1px solid #e0c99a;">
                <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${gold};font-weight:700;">Dettagli / Details</p>
              </td></tr>
              <tr><td style="padding:12px 20px 4px;">
                <p style="margin:0;font-size:13px;color:#9e8272;">📅 Data / Date</p>
                <p style="margin:2px 0 0;font-size:16px;font-weight:700;color:${gColor};">${fDate.it}</p>
                <p style="margin:1px 0 0;font-size:12px;color:#9e8272;font-style:italic;">${fDate.en}</p>
              </td></tr>
              <tr><td style="padding:12px 20px 4px;">
                <p style="margin:0;font-size:13px;color:#9e8272;">🕐 Orario / Time</p>
                <p style="margin:2px 0 0;font-size:16px;font-weight:700;color:${gColor};">${fTime}</p>
              </td></tr>
              <tr><td style="padding:12px 20px 16px;">
                <p style="margin:0;font-size:13px;color:#9e8272;">👥 Ospiti / Guests</p>
                <p style="margin:2px 0 0;font-size:16px;font-weight:700;color:${gColor};">${guests} ${guests === 1 ? 'persona' : 'persone'}</p>
              </td></tr>
            </table>
            <div style="text-align:center;margin-top:24px;">
              <a href="${reserveLink}"
                 style="display:inline-block;background:${gold};color:${gColor};font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.5px;">
                Prenota ora / Book now
              </a>
            </div>
          </td>
        </tr>
        <tr><td style="height:4px;background:${gold};"></td></tr>
        <tr>
          <td style="background:${gColor};padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:13px;font-family:Georgia,serif;color:${gold};font-style:italic;">"A presto a Venezia"</p>
            <p style="margin:10px 0 0;font-size:11px;color:#a08878;">
              Ristorante Al Gobbo di Rialto · Campo San Polo 649, 30125 Venezia
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    'RISTORANTE AL GOBBO DI RIALTO — Venezia',
    '─'.repeat(46),
    '',
    `Gentile ${name},`,
    'Si è liberato un posto per la sua lista d\'attesa!',
    `Ha 2 ore di tempo per completare la prenotazione.`,
    '',
    `📅 Data: ${fDate.it}`,
    `🕐 Orario: ${fTime}`,
    `👥 Ospiti: ${guests}`,
    '',
    `Prenota ora: ${reserveLink}`,
    '',
    'A presto a Venezia!',
    'Lo staff del Ristorante Al Gobbo di Rialto',
  ].join('\n');

  try {
    const response = await resend.emails.send({
      from: 'Al Gobbo di Rialto <reservations@ristorantealgobbodirialto.it>',
      to: email,
      reply_to: 'reservations@ristorantealgobbodirialto.it',
      subject: `🎉 Si è liberato un posto — ${fDate.it} alle ${fTime}`,
      html,
      text,
    });

    console.log('✅ Waitlist notification sent:', response);
    res.json({ success: true, response });
  } catch (error) {
    console.error('❌ Error sending waitlist notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Start server ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
