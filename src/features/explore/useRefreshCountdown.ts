import { useEffect, useState } from 'react';

const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
// Daily recs refresh at midnight Mountain Standard Time (UTC−7, no daylight saving).
const MST_OFFSET_MS = -7 * HOUR_MS;

function msUntilRefresh(now: number) {
  const intoDay = (((now + MST_OFFSET_MS) % DAY_MS) + DAY_MS) % DAY_MS;
  return DAY_MS - intoDay;
}

// "23h 59m" until the next daily refresh, updated as each minute ticks over.
export function useRefreshCountdown() {
  const [remaining, setRemaining] = useState(() => msUntilRefresh(Date.now()));

  useEffect(() => {
    // Wake just after the shown minute changes, then line up the next one.
    const timer = setTimeout(
      () => setRemaining(msUntilRefresh(Date.now())),
      (remaining % MINUTE_MS) + 50,
    );
    return () => clearTimeout(timer);
  }, [remaining]);

  const hours = Math.floor(remaining / HOUR_MS);
  const minutes = Math.floor((remaining % HOUR_MS) / MINUTE_MS);
  return `${hours}h ${minutes}m`;
}
