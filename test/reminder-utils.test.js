import assert from 'node:assert/strict';
import test from 'node:test';

import {
  escapeHtml,
  getRomeDateTimeParts,
  getRomeTimeWindow,
  getTomorrowDateInRome,
  secretsMatch,
} from '../supabase/functions/_shared/reminder-utils.js';

test('Rome date/time conversion follows winter and summer offsets', () => {
  assert.deepEqual(
    getRomeDateTimeParts(new Date('2026-01-15T08:00:00Z')),
    {
      year: 2026,
      month: 1,
      day: 15,
      hour: 9,
      minute: 0,
      second: 0,
      date: '2026-01-15',
      time: '09:00',
    },
  );
  assert.equal(getRomeDateTimeParts(new Date('2026-07-15T07:00:00Z')).time, '09:00');
});

test('tomorrow is calculated from the Venice calendar date', () => {
  assert.equal(getTomorrowDateInRome(new Date('2026-08-31T22:30:00Z')), '2026-09-02');
  assert.equal(getTomorrowDateInRome(new Date('2026-12-31T22:30:00Z')), '2027-01-01');
});

test('two-hour window can cross midnight in Venice', () => {
  const window = getRomeTimeWindow(new Date('2026-08-31T20:00:00Z'), 110, 130);
  assert.equal(window.start.date, '2026-08-31');
  assert.equal(window.start.time, '23:50');
  assert.equal(window.end.date, '2026-09-01');
  assert.equal(window.end.time, '00:10');
});

test('email content is escaped and scheduler secrets require exact equality', () => {
  assert.equal(escapeHtml(`<Mario & "Co">`), '&lt;Mario &amp; &quot;Co&quot;&gt;');
  assert.equal(secretsMatch('same-secret', 'same-secret'), true);
  assert.equal(secretsMatch('same-secret', 'different-secret'), false);
  assert.equal(secretsMatch('', ''), false);
});
