import { useSelector } from 'react-redux';
import type { RootState } from '@store/store';
import { useElapsedTime } from '@hooks/useElapsedTime';
import { formatTime } from '@utils/time/formatTime';
import styles from './TimerDisplay.module.scss';

export const TimerDisplay: React.FC = () => {
  // Берём только инварианты — минимум ререндеров от Redux
  const startEpochMs = useSelector((s: RootState) => s.stopwatch.startEpochMs);
  const accumulatedMs = useSelector(
    (s: RootState) => s.stopwatch.accumulatedMs
  );
  const status = useSelector((s: RootState) => s.stopwatch.status);

  const elapsedMs = useElapsedTime(startEpochMs, accumulatedMs, status);

  return <div className={styles.timer}>{formatTime(elapsedMs)}</div>;
};
