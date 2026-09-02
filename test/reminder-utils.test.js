import assert from 'node:assert/strict';
import test from 'node:test';

import {
  escapeHtml,
  getAdminReservationAlertSchedule,
  getRomeDateTimeParts,
  getRomeTimeWindow,
  getTomorrowDateInRome,
  isReservationInRomeWindow,
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

test('restaurant alert schedule covers 24 hours, the same morning and 45 minutes', () => {
  const schedule = getAdminReservationAlertSchedule(new Date('2026-09-03T07:00:00Z'));

  assert.equal(schedule.romeNow.date, '2026-09-03');
  assert.equal(schedule.romeNow.time, '09:00');
  assert.equal(schedule.morning.enabled, true);
  assert.equal(schedule.dayBefore.start.date, '2026-09-04');
  assert.equal(schedule.dayBefore.start.time, '08:55');
  assert.equal(schedule.dayBefore.end.time, '09:05');
  assert.equal(schedule.shortlyBefore.start.date, '2026-09-03');
  assert.equal(schedule.shortlyBefore.start.time, '09:40');
  assert.equal(schedule.shortlyBefore.end.time, '09:50');
});

test('reservation alert windows include only bookings inside their boundaries', () => {
  const schedule = getAdminReservationAlertSchedule(new Date('2026-09-03T07:00:00Z'));

  assert.equal(isReservationInRomeWindow(
    { date: '2026-09-04', time: '09:00:00' },
    schedule.dayBefore,
  ), true);
  assert.equal(isReservationInRomeWindow(
    { date: '2026-09-04', time: '09:30:00' },
    schedule.dayBefore,
  ), false);
  assert.equal(isReservationInRomeWindow(
    { date: '2026-09-03', time: '09:45:00' },
    schedule.shortlyBefore,
  ), true);
});

test('email content is escaped and scheduler secrets require exact equality', () => {
  assert.equal(escapeHtml(`<Mario & "Co">`), '&lt;Mario &amp; &quot;Co&quot;&gt;');
  assert.equal(secretsMatch('same-secret', 'same-secret'), true);
  assert.equal(secretsMatch('same-secret', 'different-secret'), false);
  assert.equal(secretsMatch('', ''), false);
});
