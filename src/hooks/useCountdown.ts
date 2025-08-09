import { useEffect, useState } from 'react';

export function useCountdown(nextAlertAtMs: number | null) {
  const [leftMs, setLeftMs] = useState(
    nextAlertAtMs ? Math.max(0, nextAlertAtMs - Date.now()) : 0
  );

  useEffect(() => {
    let rafId: number;
    if (nextAlertAtMs !== null) {
      const tick = () => {
        setLeftMs(Math.max(0, nextAlertAtMs - Date.now()));
        rafId = requestAnimationFrame(tick);
      };
      tick();
    }
    return () => cancelAnimationFrame(rafId);
  }, [nextAlertAtMs]);

  return leftMs;
}
