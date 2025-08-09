import { useEffect, useState } from 'react';

type Status = 'idle' | 'running' | 'paused';

/**
 * Хук для вычисления текущего прошедшего времени в миллисекундах.
 * Не вызывает глобальных ререндеров — состояние локальное.
 */
export function useElapsedTime(
  startEpochMs: number | null,
  accumulatedMs: number,
  status: Status
) {
  const [elapsed, setElapsed] = useState(accumulatedMs);

  useEffect(() => {
    let rafId: number;

    if (status === 'running' && startEpochMs !== null) {
      const tick = () => {
        const now = Date.now();
        const total = accumulatedMs + (now - startEpochMs);
        setElapsed(total);
        rafId = requestAnimationFrame(tick);
      };
      tick();
    } else {
      // Если не бежим — показываем накопленное
      setElapsed(accumulatedMs);
    }

    return () => cancelAnimationFrame(rafId);
  }, [startEpochMs, accumulatedMs, status]);

  return elapsed;
}
