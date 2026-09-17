const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseDate(value: string): Date | null {
  if (!DATE_PATTERN.test(value)) return null;

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10) === value ? date : null;
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function nextUtcDate(date: Date): Date {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + 1);
  return next;
}

export function mondayBasedWeekday(date: Date): number {
  return (date.getUTCDay() + 6) % 7;
}
