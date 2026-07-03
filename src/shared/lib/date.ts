import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export { dayjs };

// Current time as a UTC ISO-8601 string (replaces new Date().toISOString()).
export const nowIso = (): string => dayjs.utc().toISOString();

// Format a stored ISO string as a UTC calendar date, e.g. "Jul 2, 2026".
export const formatDate = (value: string, template = 'MMM D, YYYY'): string =>
  dayjs.utc(value).format(template);
