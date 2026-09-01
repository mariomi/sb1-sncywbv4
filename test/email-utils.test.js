import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildReservationCustomerEmail,
  buildWaitlistEmail,
  formatReservationDate,
  formatReservationTime,
  isEmail,
  isUuid,
  safeHeader,
} from '../supabase/functions/_shared/email-utils.js';

const reservation = {
  id: '0f585a2a-a7cc-44b8-bab7-aa844dde92aa',
  cancellation_token: '92a30657-dd29-4ee7-80c5-0f6d388cc04f',
  name: '<Mario & Co>',
  email: 'mario@example.com',
  phone: '+39 041 0000000',
  date: '2026-09-02',
  time: '19:30:00',
  guests: 2,
  occasion: 'birthday',
  special_requests: '<script>alert(1)</script>',
};

test('email helpers validate opaque identifiers and contact addresses', () => {
  assert.equal(isUuid(reservation.id), true);
  assert.equal(isUuid('not-a-uuid'), false);
  assert.equal(isEmail('guest@example.com'), true);
  assert.equal(isEmail('guest@example'), false);
});

test('email helpers format restaurant dates and neutralize headers', () => {
  assert.equal(formatReservationTime('19:30:00'), '19:30');
  assert.match(formatReservationDate('2026-09-02').it, /2 settembre 2026/);
  assert.equal(safeHeader('Mario\r\nBcc: bad@example.com'), 'Mario Bcc: bad@example.com');
});

test('reservation and waitlist templates escape customer-controlled HTML', () => {
  const confirmation = buildReservationCustomerEmail(reservation, 'https://www.ristorantealgobbodirialto.it');
  assert.doesNotMatch(confirmation.html, /<script>/);
  assert.match(confirmation.html, /&lt;script&gt;/);
  assert.match(confirmation.html, /cancella\/92a30657/);

  const waitlist = buildWaitlistEmail(reservation, 'https://www.ristorantealgobbodirialto.it');
  assert.doesNotMatch(waitlist.html, /<Mario/);
  assert.match(waitlist.html, /book\?date=2026-09-02&amp;time=19%3A30|book\?date=2026-09-02&time=19%3A30/);
});
