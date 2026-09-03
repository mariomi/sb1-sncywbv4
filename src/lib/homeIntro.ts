export const HOME_INTRO_STORAGE_KEY = 'al-gobbo:home-intro-seen:v1';

type IntroStorage = Pick<Storage, 'getItem' | 'setItem'>;

let introSeenInMemory = false;

function getBrowserStorage(): IntroStorage | null {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function hasSeenHomeIntro(storage: IntroStorage | null = getBrowserStorage()) {
  if (!storage) return introSeenInMemory;

  try {
    return storage.getItem(HOME_INTRO_STORAGE_KEY) === '1';
  } catch {
    return introSeenInMemory;
  }
}

export function markHomeIntroSeen(storage: IntroStorage | null = getBrowserStorage()) {
  introSeenInMemory = true;

  if (!storage) return;

  try {
    storage.setItem(HOME_INTRO_STORAGE_KEY, '1');
  } catch {
    // The in-memory marker still prevents the intro from repeating in this visit.
  }
}

export function shouldPlayHomeIntro() {
  if (typeof window === 'undefined' || hasSeenHomeIntro()) return false;

  try {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return true;
  }
}
