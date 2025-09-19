import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Play } from 'lucide-react';
import type { RootState } from '@store/store';
import { setLapColorIndex, start } from '@store/slices/stopwatchSlice';
import { TimerDisplay } from '@components/TimerDisplay/TimerDisplay';
import { Controls } from '@components/Controls/Controls';
import { LapList } from '@components/LapList/LapList';
import type { LapMeasuring } from '@components/LapList/LapList.types';
import { HeroActionButton } from '@components/ui/HeroActionButton/HeroActionButton';
import { formatTime } from '@utils/time/formatTime';
import { PALETTE_LENGTH, cyclicIndex } from '@utils/lapSwipeConfig';
import styles from './StopwatchPage.module.scss';

const StopwatchPage = () => {
  const dispatch = useDispatch();
  const laps = useSelector((s: RootState) => s.stopwatch.laps);
  const status = useSelector((s: RootState) => s.stopwatch.status);

  const measuring = useMemo<LapMeasuring[]>(() => {
    return laps.map((lap, i, arr) => {
      const prevTs = i === 0 ? 0 : arr[i - 1].timestampMs ?? 0;
      const timeStr = lap.timestampMs !== null ? formatTime(lap.timestampMs) : undefined;
      const diffStr =
        lap.timestampMs !== null
          ? `+${formatTime(Math.max(0, lap.timestampMs - prevTs))}`
          : undefined;

      return {
        lap: lap.id,
        time: timeStr,
        diff: diffStr,
        prevTs,
        isOpen: lap.timestampMs === null,
        colorIndex: lap.colorIndex,
      };
    });
  }, [laps]);

  const handleChangeColor = useCallback(
    (lap: number, delta: 1 | -1) => {
      const current = laps.find((l) => l.id === lap);
      if (!current) return;
      const len = PALETTE_LENGTH();
      const next = cyclicIndex(current.colorIndex, delta, len);
      dispatch(setLapColorIndex({ id: lap, colorIndex: next, paletteLength: len }));
    },
    [laps, dispatch],
  );

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
              dataTour="play"
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
