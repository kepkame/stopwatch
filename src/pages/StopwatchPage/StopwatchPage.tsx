import { useDispatch, useSelector } from 'react-redux';
import { Play } from 'lucide-react';
import type { RootState } from '@store/store';
import { setLapColorIndex, start } from '@store/slices/stopwatchSlice';
import { TimerDisplay } from '@components/TimerDisplay/TimerDisplay';
import { Controls } from '@components/Controls/Controls';
import { LapList } from '@components/LapList/LapList';
import { HeroActionButton } from '@components/ui/HeroActionButton/HeroActionButton';
import { useElapsedTime } from '@hooks/useElapsedTime';
import { formatTime } from '@utils/time/formatTime';
import { PALETTE_SIZE, cyclicIndex } from '@utils/lapSwipeConfig';
import styles from './StopwatchPage.module.scss';

const StopwatchPage = () => {
  const dispatch = useDispatch();
  const laps = useSelector((s: RootState) => s.stopwatch.laps);
  const startEpochMs = useSelector((s: RootState) => s.stopwatch.startEpochMs);
  const accumulatedMs = useSelector(
    (s: RootState) => s.stopwatch.accumulatedMs
  );
  const status = useSelector((s: RootState) => s.stopwatch.status);

  const elapsedMs = useElapsedTime(startEpochMs, accumulatedMs, status);

  const measuring = laps.map((lap, i, arr) => {
    const prevTs = i === 0 ? 0 : arr[i - 1].timestampMs ?? 0;
    const timeStr =
      lap.timestampMs !== null ? formatTime(lap.timestampMs) : undefined;
    const diffMs =
      lap.timestampMs !== null ? lap.timestampMs - prevTs : elapsedMs - prevTs;
    const diffStr = `+${formatTime(Math.max(0, diffMs))}`;
    return {
      lap: lap.id,
      time: timeStr,
      diff: diffStr,
      colorIndex: lap.colorIndex,
    };
  });

  const handleChangeColor = (lap: number, delta: 1 | -1) => {
    const current = laps.find((l) => l.id === lap);
    if (!current) return;
    const next = cyclicIndex(current.colorIndex, delta, PALETTE_SIZE);
    dispatch(setLapColorIndex({ id: lap, colorIndex: next }));
  };

  const handleStart = () => {
    dispatch(start());
  };

  return (
    <div className={styles.stopwatchPage}>
      <div className="container">
        <div className={styles.wrapper}>
          <TimerDisplay />
          {status === 'idle' ? (
            <HeroActionButton
              icon={Play}
              label="Start stopwatch"
              onClick={handleStart}
            />
          ) : (
            <Controls />
          )}
          <LapList measuring={measuring} onChangeColor={handleChangeColor} />
        </div>
      </div>
    </div>
  );
};

export default StopwatchPage;
