import type { Json } from './database.types';

type AttributedReservation = {
  source: string | null;
  attribution: Json;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

export function reservationChannel(reservation: AttributedReservation): string {
  if (reservation.source === 'phone') return 'Telefono';
  if (reservation.source === 'walk_in') return 'Walk-in';

  const attribution = asRecord(reservation.attribution);
  const touch = asRecord(attribution?.last_touch) || asRecord(attribution?.first_touch);
  const source = String(touch?.source || touch?.utm_source || '').toLowerCase();
  const medium = String(touch?.medium || touch?.utm_medium || '').toLowerCase();

  if (!source) return 'Non attribuito';
  if (source === 'direct') return 'Diretto';
  if (source.includes('google') && /(paid|cpc|ppc)/.test(medium)) return 'Google Ads';
  if (source.includes('google') && medium === 'organic') return 'Google organico';
  if (source.includes('instagram')) return /(paid|cpc)/.test(medium) ? 'Instagram Ads' : 'Instagram';
  if (source.includes('facebook') || source === 'meta') return /(paid|cpc)/.test(medium) ? 'Meta Ads' : 'Facebook';
  if (source.includes('tiktok')) return /(paid|cpc)/.test(medium) ? 'TikTok Ads' : 'TikTok';
  if (medium === 'organic') return `${source} organico`;
  if (medium === 'referral') return `Referral: ${source}`;
  return source;
}
