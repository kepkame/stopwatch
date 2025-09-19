import { useEffect, useState } from 'react';

type Status = 'idle' | 'running' | 'paused';

/**
 * Custom hook for calculating elapsed time in milliseconds.
 */
export function useElapsedTime(
  startEpochMs: number | null,
  accumulatedMs: number,
  status: Status,
  enabled: boolean = true,
) {
  const [elapsed, setElapsed] = useState(accumulatedMs);

  useEffect(() => {
    if (!enabled) {
      setElapsed(accumulatedMs);
      return;
    }

    let rafId = 0;

    if (status === 'running' && startEpochMs !== null) {
      // Continuously updates elapsed time using requestAnimationFrame
      const tick = () => {
        const now = Date.now();
        const total = accumulatedMs + (now - startEpochMs);
        setElapsed(total);
        rafId = requestAnimationFrame(tick);
      };
      tick();
    } else {
      // When paused or idle, only show accumulated time without updates
      setElapsed(accumulatedMs);
    }

    return () => cancelAnimationFrame(rafId);
  }, [startEpochMs, accumulatedMs, status, enabled]);

  return elapsed;
}
