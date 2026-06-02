import { useEffect, useState } from 'react';

/**
 * Live London local time, formatted for the hero "Based in" badge.
 *
 * Returns the wall-clock time in `Europe/London` (so it tracks BST/GMT
 * automatically) as `HH:MM` plus the short zone label ("BST" / "GMT"). State
 * only updates when the formatted string actually changes, so a per-second
 * tick doesn't churn renders once the minute is stable.
 */
export interface LondonTime {
  /** 24h time, e.g. "21:43". */
  time: string;
  /** Short zone abbreviation, e.g. "BST" or "GMT". */
  zone: string;
}

const TIME_ZONE = 'Europe/London';

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const zoneFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  timeZoneName: 'short',
});

function readLondonTime(): LondonTime {
  const time = timeFormatter.format(new Date());
  const zonePart = zoneFormatter
    .formatToParts(new Date())
    .find((p) => p.type === 'timeZoneName');
  return { time, zone: zonePart?.value ?? 'GMT' };
}

export function useLondonTime(): LondonTime {
  const [value, setValue] = useState<LondonTime>(() => readLondonTime());

  useEffect(() => {
    const id = setInterval(() => {
      const next = readLondonTime();
      // Only re-render on an actual change (minute rollover / DST flip).
      setValue((prev) =>
        prev.time === next.time && prev.zone === next.zone ? prev : next,
      );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return value;
}
