/**
 * Time utilities — locale-aware formatting.
 *
 * Detects whether the device uses 12h (AM/PM) or 24h time
 * by asking Intl with the device's own locale. No hardcoding.
 */

/**
 * Returns true when the device locale uses a 24-hour clock.
 * Uses 13:00 as a probe — if the formatted string contains AM/PM it's 12h.
 */
export function deviceUses24Hour(): boolean {
  const probe = new Date(2000, 0, 1, 13, 0, 0); // 1 PM
  const formatted = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).format(probe);
  return !/[AP]M/i.test(formatted);
}

/**
 * Formats hour + minute using the device locale's preferred time format.
 * - 24h locale → "14:30"
 * - 12h locale → "2:30 PM"
 */
export function formatTimeLocale(hour: number, minute: number): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
}
