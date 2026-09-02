import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import {
  captureAttribution,
  initializeTracking,
  isSensitiveAnalyticsRoute,
  readConsent,
  trackEvent,
  trackPageView,
} from '../src/lib/analytics.ts';

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
    clear: () => values.clear(),
  };
}

afterEach(() => {
  Reflect.deleteProperty(globalThis, 'window');
  Reflect.deleteProperty(globalThis, 'document');
  Reflect.deleteProperty(globalThis, 'localStorage');
  Reflect.deleteProperty(globalThis, 'sessionStorage');
});

test('recognises every private cancellation URL without matching public pages', () => {
  assert.equal(isSensitiveAnalyticsRoute('/cancella/private-token'), true);
  assert.equal(isSensitiveAnalyticsRoute('/cancella/private-token?lang=it'), true);
  assert.equal(isSensitiveAnalyticsRoute('/CANCELLA/private-token'), true);
  assert.equal(isSensitiveAnalyticsRoute('/book'), false);
  assert.equal(isSensitiveAnalyticsRoute('/cancellazione-policy'), false);
});

test('private cancellation routes never initialise or emit analytics data', () => {
  const dataLayer: unknown[] = [];
  const local = memoryStorage();
  const session = memoryStorage();
  local.setItem('al-gobbo-consent-v1', JSON.stringify({ analytics: true, marketing: true, updatedAt: new Date().toISOString() }));

  Object.assign(globalThis, {
    localStorage: local,
    sessionStorage: session,
    document: {
      referrer: '',
      title: 'Private booking',
      getElementById: () => null,
      createElement: () => ({ id: '', async: false, src: '' }),
      head: { appendChild: () => undefined },
    },
    window: {
      location: { pathname: '/cancella/private-token', search: '?lang=it&email=guest@example.com', hostname: 'example.com' },
      dataLayer,
    },
  });

  initializeTracking();
  captureAttribution();
  trackPageView('/cancella/private-token?lang=it&email=guest@example.com');
  trackEvent('click_phone');

  assert.deepEqual(dataLayer, []);
  assert.equal(session.getItem('al-gobbo-attribution-v1'), null);
});

test('cookie choices expire after six calendar months', () => {
  const local = memoryStorage();
  const expiredAt = new Date();
  expiredAt.setUTCMonth(expiredAt.getUTCMonth() - 7);
  local.setItem('al-gobbo-consent-v1', JSON.stringify({ analytics: true, marketing: false, updatedAt: expiredAt.toISOString() }));
  Object.assign(globalThis, { localStorage: local });

  assert.equal(readConsent(), null);
  assert.equal(local.getItem('al-gobbo-consent-v1'), null);
});

test('fresh cookie choices remain available', () => {
  const local = memoryStorage();
  const updatedAt = new Date().toISOString();
  local.setItem('al-gobbo-consent-v1', JSON.stringify({ analytics: false, marketing: false, updatedAt }));
  Object.assign(globalThis, { localStorage: local });

  assert.deepEqual(readConsent(), { analytics: false, marketing: false, updatedAt });
});
