export type ConsentPreferences = {
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export type MarketingEvent =
  | 'view_menu'
  | 'click_book'
  | 'booking_started'
  | 'booking_completed'
  | 'click_phone'
  | 'click_map'
  | 'click_directions'
  | 'click_instagram';

type EventProperties = Record<string, string | number | boolean | undefined>;
type DataLayerItem = Record<string, unknown> | unknown[];
type PixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
};
type TrackingWindow = Window & {
  dataLayer?: DataLayerItem[];
  gtag?: (...args: unknown[]) => void;
  fbq?: PixelFunction;
  _fbq?: PixelFunction;
};

const CONSENT_KEY = 'al-gobbo-consent-v1';
const ATTRIBUTION_KEY = 'al-gobbo-attribution-v1';
const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_id',
  'utm_source_platform',
  'utm_term',
  'utm_content',
  'utm_creative_format',
  'utm_marketing_tactic',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'ttclid',
] as const;

let initializedSignature = '';

function trackingWindow() {
  return window as TrackingWindow;
}

function injectScript(id: string, src: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function ensureGoogleLayer() {
  const target = trackingWindow();
  target.dataLayer = target.dataLayer || [];
  target.gtag = target.gtag || function gtag(...args: unknown[]) {
    target.dataLayer?.push(args);
  };
  return target;
}

function loadGoogleTag(id: string) {
  const target = ensureGoogleLayer();
  injectScript('google-tag', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`);
  target.gtag?.('js', new Date());
  return target;
}

function loadMetaPixel(pixelId: string) {
  const target = trackingWindow();
  if (!target.fbq) {
    const pixel = function (...args: unknown[]) {
      if (pixel.callMethod) pixel.callMethod(...args);
      else pixel.queue.push(args);
    } as PixelFunction;
    pixel.queue = [];
    pixel.loaded = true;
    pixel.version = '2.0';
    target.fbq = pixel;
    target._fbq = pixel;
  }
  injectScript('meta-pixel', 'https://connect.facebook.net/en_US/fbevents.js');
  target.fbq?.('init', pixelId);
  target.fbq?.('track', 'PageView');
}

export function readConsent(): ConsentPreferences | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<ConsentPreferences>;
    if (typeof value.analytics !== 'boolean' || typeof value.marketing !== 'boolean') return null;
    return {
      analytics: value.analytics,
      marketing: value.marketing,
      updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : '',
    };
  } catch {
    return null;
  }
}

export function saveConsent(preferences: Pick<ConsentPreferences, 'analytics' | 'marketing'>) {
  const value: ConsentPreferences = {
    ...preferences,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('al-gobbo-consent-change', { detail: value }));
  initializeTracking(value);
}

export function captureAttribution() {
  const consent = readConsent();
  if (!consent?.analytics) return;

  const params = new URLSearchParams(window.location.search);
  const touch: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.slice(0, 250);
    if (value) touch[key] = value;
  }

  const stored = getAttribution();
  const hasCampaignParameters = Object.keys(touch).length > 0;
  if (!hasCampaignParameters && stored.first_touch) return;

  if (touch.gclid || touch.gbraid || touch.wbraid) {
    touch.source = touch.utm_source || 'google';
    touch.medium = touch.utm_medium || 'paid_search';
  } else if (touch.fbclid) {
    touch.source = touch.utm_source || 'meta';
    touch.medium = touch.utm_medium || 'paid_social';
  } else if (touch.ttclid) {
    touch.source = touch.utm_source || 'tiktok';
    touch.medium = touch.utm_medium || 'paid_social';
  } else if (touch.utm_source) {
    touch.source = touch.utm_source;
    touch.medium = touch.utm_medium || 'campaign';
  } else {
    try {
      const referrer = document.referrer ? new URL(document.referrer) : null;
      const host = referrer?.hostname.replace(/^www\./, '') || '';
      const isInternal = host === window.location.hostname.replace(/^www\./, '');
      if (!host || isInternal) {
        touch.source = 'direct';
        touch.medium = 'none';
      } else if (/google\.|bing\.|yahoo\.|duckduckgo\./i.test(host)) {
        touch.source = host.split('.')[0];
        touch.medium = 'organic';
      } else {
        touch.source = host;
        touch.medium = 'referral';
      }
      if (referrer && !isInternal) touch.referrer = referrer.origin.slice(0, 250);
    } catch {
      touch.source = 'direct';
      touch.medium = 'none';
    }
  }

  const timestampedTouch = {
    ...touch,
    landing_page: `${window.location.pathname}${window.location.search}`.slice(0, 500),
    captured_at: new Date().toISOString(),
  };
  const attribution = {
    first_touch: stored.first_touch || timestampedTouch,
    last_touch: timestampedTouch,
  };
  sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
}

export function getAttribution(): Record<string, unknown> {
  if (!readConsent()?.analytics) return {};
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_KEY);
    return raw ? JSON.parse(raw) as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

export function initializeTracking(consent = readConsent()) {
  if (!consent) return;
  const signature = `${consent.analytics}:${consent.marketing}`;
  if (initializedSignature === signature) return;
  initializedSignature = signature;

  const gtmId = import.meta.env.VITE_GTM_ID?.trim();
  const ga4Id = import.meta.env.VITE_GA4_ID?.trim();
  const adsId = import.meta.env.VITE_GOOGLE_ADS_ID?.trim();
  const metaPixelId = import.meta.env.VITE_META_PIXEL_ID?.trim();
  const target = ensureGoogleLayer();

  target.gtag?.('consent', 'update', {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_storage: consent.marketing ? 'granted' : 'denied',
    ad_user_data: consent.marketing ? 'granted' : 'denied',
    ad_personalization: consent.marketing ? 'granted' : 'denied',
  });

  if (consent.analytics && gtmId) {
    target.dataLayer?.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    injectScript('google-tag-manager', `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`);
  } else if (consent.analytics && ga4Id) {
    loadGoogleTag(ga4Id).gtag?.('config', ga4Id, { send_page_view: false });
  }

  if (consent.marketing && adsId) {
    loadGoogleTag(adsId).gtag?.('config', adsId);
  }
  if (consent.marketing && metaPixelId) loadMetaPixel(metaPixelId);

  if (consent.analytics) captureAttribution();
}

export function trackPageView(path: string) {
  const consent = readConsent();
  if (!consent?.analytics) return;

  const target = trackingWindow();
  target.dataLayer?.push({ event: 'page_view', page_path: path });
  const ga4Id = import.meta.env.VITE_GA4_ID?.trim();
  if (!import.meta.env.VITE_GTM_ID?.trim() && ga4Id) {
    target.gtag?.('event', 'page_view', {
      page_path: path,
      page_title: document.title,
    });
  }
  if (consent.marketing) target.fbq?.('track', 'PageView');
}

export function trackEvent(event: MarketingEvent, properties: EventProperties = {}) {
  const consent = readConsent();
  if (!consent?.analytics && !consent?.marketing) return;

  const target = trackingWindow();
  if (consent.analytics) {
    target.dataLayer?.push({ event, ...properties });
    if (!import.meta.env.VITE_GTM_ID?.trim() && import.meta.env.VITE_GA4_ID?.trim()) {
      target.gtag?.('event', event, properties);
    }
  }

  if (event === 'booking_completed' && consent.marketing) {
    const adsId = import.meta.env.VITE_GOOGLE_ADS_ID?.trim();
    const conversionLabel = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL?.trim();
    if (adsId && conversionLabel) {
      target.gtag?.('event', 'conversion', {
        send_to: `${adsId}/${conversionLabel}`,
        transaction_id: properties.reservation_id,
      });
    }
    target.fbq?.('track', 'Schedule', { content_name: 'Restaurant reservation' });
  }
}
