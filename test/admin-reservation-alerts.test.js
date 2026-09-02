import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const migrationUrl = new URL(
  '../supabase/migrations/20260902234017_add_admin_reservation_alerts.sql',
  import.meta.url,
);
const functionUrl = new URL(
  '../supabase/functions/send-admin-reservation-alerts/index.ts',
  import.meta.url,
);

test('restaurant alerts are scheduled securely and tracked independently', async () => {
  const [migration, edgeFunction] = await Promise.all([
    readFile(migrationUrl, 'utf8'),
    readFile(functionUrl, 'utf8'),
  ]);

  assert.match(migration, /admin_alert_24h_sent_at/);
  assert.match(migration, /admin_alert_morning_sent_at/);
  assert.match(migration, /admin_alert_45m_sent_at/);
  assert.match(migration, /'\*\/5 \* \* \* \*'/);
  assert.match(migration, /vault\.decrypted_secrets/);
  assert.doesNotMatch(migration, /re_[A-Za-z0-9_-]{20,}/);
  assert.match(edgeFunction, /ADMIN_ALERT_CRON_SECRET/);
  assert.match(edgeFunction, /RESERVATIONS_EMAIL/);
  assert.match(edgeFunction, /Idempotency-Key/);
  assert.match(edgeFunction, /payload\.dry_run/);
});
