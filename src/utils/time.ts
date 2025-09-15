import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

export function formatTimeWithTimezone(
  timestamp: string,
  format: string,
): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return dayjs.utc(timestamp).tz(tz).format(format);
}
