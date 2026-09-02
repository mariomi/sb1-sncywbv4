export const ROME_TIME_ZONE = 'Europe/Rome';

const romeDateTimeFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: ROME_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

export function getRomeDateTimeParts(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new TypeError('A valid date is required');
  }

  const parts = Object.fromEntries(
    romeDateTimeFormatter
      .formatToParts(date)
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value: partValue }) => [type, partValue]),
  );

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  };
}

export function getTomorrowDateInRome(value = new Date()) {
  const { year, month, day } = getRomeDateTimeParts(value);
  return new Date(Date.UTC(year, month - 1, day + 1, 12))
    .toISOString()
    .slice(0, 10);
}

export function getRomeTimeWindow(value, startMinutes, endMinutes) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new TypeError('A valid date is required');
  }

  return {
    start: getRomeDateTimeParts(new Date(date.getTime() + startMinutes * 60_000)),
    end: getRomeDateTimeParts(new Date(date.getTime() + endMinutes * 60_000)),
  };
}

export function getAdminReservationAlertSchedule(value = new Date()) {
  const now = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(now.getTime())) {
    throw new TypeError('A valid date is required');
  }

  const romeNow = getRomeDateTimeParts(now);
  return {
    romeNow,
    dayBefore: getRomeTimeWindow(now, 1435, 1445),
    morning: {
      enabled: romeNow.hour === 9,
      date: romeNow.date,
      afterTime: romeNow.time,
    },
    shortlyBefore: getRomeTimeWindow(now, 40, 50),
  };
}

export function isReservationInRomeWindow(reservation, window) {
  const reservationDateTime = `${reservation.date} ${String(reservation.time).slice(0, 5)}`;
  const windowStart = `${window.start.date} ${window.start.time}`;
  const windowEnd = `${window.end.date} ${window.end.time}`;
  return reservationDateTime >= windowStart && reservationDateTime <= windowEnd;
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function secretsMatch(provided, expected) {
  if (!provided || !expected) return false;

  const length = Math.max(provided.length, expected.length);
  let mismatch = provided.length ^ expected.length;

  for (let index = 0; index < length; index += 1) {
    mismatch |= (provided.charCodeAt(index) || 0) ^ (expected.charCodeAt(index) || 0);
  }

  return mismatch === 0;
}

export function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
