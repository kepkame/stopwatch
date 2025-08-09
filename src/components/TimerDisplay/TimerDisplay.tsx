import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@store/store';
import { useElapsedTime } from '@hooks/useElapsedTime';
import { formatTime } from '@utils/time/formatTime';

export const TimerDisplay: React.FC = () => {
  // Берём только инварианты — минимум ререндеров от Redux
  const { startEpochMs, accumulatedMs, status } = useSelector(
    (state: RootState) => ({
      startEpochMs: state.stopwatch.startEpochMs,
      accumulatedMs: state.stopwatch.accumulatedMs,
      status: state.stopwatch.status,
    })
  );

  const elapsedMs = useElapsedTime(startEpochMs, accumulatedMs, status);

  return <div className="timer-display">{formatTime(elapsedMs)}</div>;
};
