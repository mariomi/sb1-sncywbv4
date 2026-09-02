import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildReservationTemplateParameters,
  extractInboundMessageText,
  isOptOutMessage,
  normalizeWhatsAppPhone,
  secretsMatch,
  shouldApplyMessageStatus,
  toMetaRecipient,
} from '../supabase/functions/_shared/whatsapp-utils.js';

test('WhatsApp phone normalization accepts E.164-style restaurant form values', () => {
  assert.equal(normalizeWhatsAppPhone('+39 041 520 4603'), '+390415204603');
  assert.equal(normalizeWhatsAppPhone('0039 041 520 4603'), '+390415204603');
  assert.equal(toMetaRecipient('+39 041 520 4603'), '390415204603');
  assert.equal(normalizeWhatsAppPhone('041 520 4603'), null);
  assert.equal(normalizeWhatsAppPhone('+00 123'), null);
});

test('reservation templates contain service details but never customer notes', () => {
  const reservation = {
    name: 'Mario Rossi',
    date: '2026-09-30',
    time: '18:30:00',
    guests: 2,
    locale: 'it',
    cancellation_token: '92a30657-dd29-4ee7-80c5-0f6d388cc04f',
    special_requests: 'Allergia molto sensibile',
  };
  const parameters = buildReservationTemplateParameters(
    reservation,
    'reservation_confirmation',
    'https://www.ristorantealgobbodirialto.it/',
  );

  assert.deepEqual(parameters.slice(0, 4), ['Mario', '30 settembre 2026', '18:30', '2']);
  assert.match(parameters[4], /cancella\/92a30657/);
  assert.doesNotMatch(parameters.join(' '), /Allergia/);
});

test('incoming text and interactive replies are extracted without storing raw webhooks', () => {
  assert.equal(extractInboundMessageText({ type: 'text', text: { body: 'Arriviamo presto' } }), 'Arriviamo presto');
  assert.equal(
    extractInboundMessageText({ type: 'interactive', interactive: { button_reply: { id: 'confirm', title: 'Confermo' } } }),
    'Confermo',
  );
});

test('opt-out keywords and status transitions are conservative', () => {
  assert.equal(isOptOutMessage('STOP!'), true);
  assert.equal(isOptOutMessage('Non annullare'), false);
  assert.equal(shouldApplyMessageStatus('sent', 'delivered'), true);
  assert.equal(shouldApplyMessageStatus('read', 'delivered'), false);
  assert.equal(shouldApplyMessageStatus('read', 'failed'), false);
  assert.equal(secretsMatch('project-key', 'project-key'), true);
  assert.equal(secretsMatch('project-key', 'wrong-key'), false);
});
