import assert from 'node:assert/strict';
import test from 'node:test';
import { reservationSchema } from '../src/lib/validators';

const validReservation = {
  date: '2026-09-10',
  time: '19:30',
  guests: 2,
  name: 'Mario Rossi',
  email: 'mario@example.com',
  phone: '+39 041 520 4603',
  occasion: '',
  special_requests: '',
  marketing_consent: false,
  whatsapp_opt_in: false,
};

test('reservation validation accepts restaurant-supported party sizes', () => {
  assert.equal(reservationSchema.safeParse({ ...validReservation, guests: 1 }).success, true);
  assert.equal(reservationSchema.safeParse({ ...validReservation, guests: 8 }).success, true);
});

test('reservation validation rejects unsupported or fractional party sizes', () => {
  assert.equal(reservationSchema.safeParse({ ...validReservation, guests: 9 }).success, false);
  assert.equal(reservationSchema.safeParse({ ...validReservation, guests: 2.5 }).success, false);
});
