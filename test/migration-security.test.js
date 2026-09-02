import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const migrationUrl = new URL(
  '../supabase/migrations/20260902162840_enforce_channel_booking_feature_flag.sql',
  import.meta.url,
);
const migration = readFileSync(migrationUrl, 'utf8');
const tableAssignmentMigration = readFileSync(
  new URL('../supabase/migrations/20260902165116_prevent_duplicate_table_assignments.sql', import.meta.url),
  'utf8',
);

test('channel-aware booking reuses the feature-flag-protected public RPC', () => {
  assert.match(
    migration,
    /from\s+public\.create_public_reservation\s*\(/i,
    'the channel wrapper must delegate to the public kill-switch boundary',
  );
  assert.doesNotMatch(
    migration,
    /from\s+private\.create_public_reservation\s*\(/i,
    'the channel wrapper must not bypass the public feature-flag check',
  );
});

test('channel-aware booking keeps private execution grants explicit', () => {
  assert.match(
    migration,
    /revoke\s+execute\s+on\s+function\s+private\.create_public_reservation_with_channels[\s\S]*?from\s+public,\s*anon,\s*authenticated/i,
  );
  assert.match(
    migration,
    /grant\s+execute\s+on\s+function\s+private\.create_public_reservation_with_channels[\s\S]*?to\s+anon,\s*authenticated,\s*service_role/i,
  );
});

test('active table assignments are unique for each exact service slot', () => {
  assert.match(
    tableAssignmentMigration,
    /create\s+unique\s+index[\s\S]*?on\s+public\.reservations\s*\(\s*date\s*,\s*time\s*,\s*table_id\s*\)/i,
  );
  assert.match(
    tableAssignmentMigration,
    /where\s+table_id\s+is\s+not\s+null[\s\S]*?status\s+in\s*\(\s*'pending'\s*,\s*'confirmed'\s*\)/i,
  );
});

test('table assignment migration fails closed when legacy duplicates exist', () => {
  assert.match(
    tableAssignmentMigration,
    /group\s+by\s+date\s*,\s*time\s*,\s*table_id[\s\S]*?having\s+count\(\*\)\s*>\s*1[\s\S]*?raise\s+exception/i,
  );
});
