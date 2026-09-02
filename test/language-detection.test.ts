import assert from 'node:assert/strict';
import { test } from 'node:test';
import { detectPreferredLanguage, isSupportedLanguage } from '../src/lib/languageDetection.ts';

test('detects supported regional browser languages', () => {
  assert.equal(detectPreferredLanguage(['it-IT']), 'it');
  assert.equal(detectPreferredLanguage(['fr-CA']), 'fr');
  assert.equal(detectPreferredLanguage(['de_AT']), 'de');
  assert.equal(detectPreferredLanguage(['es-419']), 'es');
});

test('uses the first supported language in the browser preference list', () => {
  assert.equal(detectPreferredLanguage(['nl-NL', 'de-DE', 'en-US']), 'de');
  assert.equal(detectPreferredLanguage(['zh-CN', 'fr-FR', 'it-IT']), 'fr');
});

test('falls back to English when no browser preference is supported', () => {
  assert.equal(detectPreferredLanguage(['ja-JP', 'nl-NL']), 'en');
  assert.equal(detectPreferredLanguage([]), 'en');
  assert.equal(isSupportedLanguage('pt'), false);
});
