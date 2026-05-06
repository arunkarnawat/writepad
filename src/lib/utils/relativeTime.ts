/**
 * Compact, human-friendly relative time used by todo items.
 *
 * Up to 24 hours we render "X min ago" / "X hours ago"; beyond that we fall
 * back to a short absolute date (e.g. "May 2") which is more useful than an
 * ever-growing day count.
 */
export function formatRelativeTime(timestamp: number, now: number = Date.now()): string {
  const diff = Math.max(0, now - timestamp);
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);

  if (sec < 30) return 'just now';
  if (min < 1) return `${sec} sec ago`;
  if (min < 60) return `${min} min ago`;
  if (hr < 24) return `${hr} ${hr === 1 ? 'hour' : 'hours'} ago`;

  const d = new Date(timestamp);
  const sameYear = d.getFullYear() === new Date(now).getFullYear();
  return d.toLocaleDateString(undefined, sameYear
    ? { month: 'short', day: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' });
}
