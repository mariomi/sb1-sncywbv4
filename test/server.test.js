import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

process.env.NODE_ENV = 'test';

let api;
let server;
let baseUrl;

before(async () => {
  api = await import('../server.js');
  server = api.app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
});

test('HTML and header helpers neutralize user-controlled content', () => {
  assert.equal(api.escapeHtml('<script>"x" & y</script>'), '&lt;script&gt;&quot;x&quot; &amp; y&lt;/script&gt;');
  assert.equal(api.safeHeader('Guest\r\nBcc: attacker@example.com'), 'Guest Bcc: attacker@example.com');
  assert.equal(api.safeHeader('x'.repeat(200)).length, 160);
});

test('opaque endpoint identifiers require valid UUIDs', () => {
  assert.equal(api.reservationConfirmationSchema.safeParse({ reservation_id: '1', cancellation_token: '2' }).success, false);
  assert.equal(api.waitlistNotificationSchema.safeParse({ waitlist_id: 'not-a-uuid' }).success, false);
});

test('legacy arbitrary-email endpoints stay disabled', async () => {
  const response = await fetch(`${baseUrl}/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: 'victim@example.com' }),
  });
  assert.equal(response.status, 410);
});

test('health endpoint never exposes configuration details', async () => {
  const response = await fetch(`${baseUrl}/health`);
  const body = await response.json();
  assert.ok([200, 503].includes(response.status));
  assert.deepEqual(Object.keys(body), ['status']);
});
