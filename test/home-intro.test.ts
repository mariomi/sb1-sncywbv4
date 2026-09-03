import assert from 'node:assert/strict';
import { test } from 'node:test';
import { HOME_INTRO_STORAGE_KEY, hasSeenHomeIntro, markHomeIntroSeen } from '../src/lib/homeIntro.ts';

function createStorage(initialValue: string | null = null) {
  let value = initialValue;
  return {
    getItem(key: string) {
      return key === HOME_INTRO_STORAGE_KEY ? value : null;
    },
    setItem(key: string, nextValue: string) {
      if (key === HOME_INTRO_STORAGE_KEY) value = nextValue;
    },
  };
}

test('a new visitor has not seen the home introduction', () => {
  assert.equal(hasSeenHomeIntro(createStorage()), false);
});

test('an existing marker identifies a returning visitor', () => {
  assert.equal(hasSeenHomeIntro(createStorage('1')), true);
});

test('marking the introduction persists it for future visits', () => {
  const storage = createStorage();
  markHomeIntroSeen(storage);
  assert.equal(hasSeenHomeIntro(storage), true);
});
