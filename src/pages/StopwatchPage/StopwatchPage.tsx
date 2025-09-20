import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { Play } from 'lucide-react';
import type { RootState } from '@store/store';
import { start } from '@store/slices/stopwatchSlice';
import { selectLapItemsStable } from '@store/selectors/stopwatchSelectors';
import { bumpLapColor } from '@store/thunks/stopwatchThunks';
import { TimerDisplay } from '@components/TimerDisplay/TimerDisplay';
import { Controls } from '@components/Controls/Controls';
import { LapList } from '@components/LapList/LapList';
import { HeroActionButton } from '@components/ui/HeroActionButton/HeroActionButton';
import styles from './StopwatchPage.module.scss';

const StopwatchPage = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s: RootState) => s.stopwatch.status);
  const measuring = useAppSelector(selectLapItemsStable);

  const handleChangeColor = useCallback(
    (lapId: number, delta: 1 | -1) => {
      dispatch(bumpLapColor(lapId, delta));
    },
    [dispatch],
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
