/**
 * Small, dependency-free time-zone helpers built on Intl. Enough to generate
 * slots in the studio's zone and render them in the visitor's zone.
 */

const dtfCache = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(tz: string) {
  let f = dtfCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    dtfCache.set(tz, f);
  }
  return f;
}

export function tzParts(utcMs: number, tz: string) {
  const parts = partsFormatter(tz).formatToParts(new Date(utcMs));
  const get = (t: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const hour = get("hour");
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: hour === 24 ? 0 : hour,
    minute: get("minute"),
    second: get("second"),
  };
}

/** Offset (ms) of `tz` from UTC at the given instant. */
export function tzOffsetMs(utcMs: number, tz: string) {
  const p = tzParts(utcMs, tz);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

/** Wall-clock time in `tz` → UTC epoch ms (DST-safe for all but the skipped hour). */
export function zonedTimeToUtc(year: number, month: number, day: number, hour: number, minute: number, tz: string) {
  const guess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const off1 = tzOffsetMs(guess, tz);
  let utc = guess - off1;
  const off2 = tzOffsetMs(utc, tz);
  if (off2 !== off1) utc = guess - off2;
  return utc;
}

/** "YYYY-MM-DD" for an instant, as seen in `tz`. */
export function dateKeyInTz(iso: string | number | Date, tz: string) {
  const ms = typeof iso === "number" ? iso : new Date(iso).getTime();
  const p = tzParts(ms, tz);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

export function formatTime(iso: string | number | Date, tz: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" }).format(new Date(iso));
}

export function formatLongDate(iso: string | number | Date, tz: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function tzShortName(tz: string, at: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" }).formatToParts(at);
  return parts.find((p) => p.type === "timeZoneName")?.value ?? tz;
}

export function parseDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return { year: y, month: m, day: d };
}

export function parseHHMM(s: string) {
  const [h, m] = s.split(":").map(Number);
  return { hour: h, minute: m };
}
