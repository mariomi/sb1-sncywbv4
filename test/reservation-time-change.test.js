import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const migrationUrl = new URL(
  '../supabase/migrations/20260902232908_allow_any_available_reservation_time.sql',
  import.meta.url,
);

test('self-service time changes accept every available slot while preserving safeguards', async () => {
  const sql = await readFile(migrationUrl, 'utf8');

  assert.doesNotMatch(sql, /30 minutes/i);
  assert.match(sql, /is_reservation_change_slot_available/);
  assert.match(sql, /interval '24 hours'/);
  assert.match(sql, /pg_advisory_xact_lock/);
  assert.match(sql, /security definer\s+set search_path = ''/);
  assert.match(sql, /revoke execute on function private\.update_reservation_by_token/);
});
