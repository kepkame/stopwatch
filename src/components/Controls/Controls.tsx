import clsx from 'clsx';
import { Pause, Flag, Play, RefreshCcw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@store/store';
import { start, pause, reset, addLap } from '@store/slices/stopwatchSlice';
import styles from './Controls.module.scss';

export const Controls = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isRunning = useSelector((state: RootState) => state.stopwatch.status === 'running');

  const handleStart = () => {
    dispatch(start());
  };

  const handlePause = () => {
    dispatch(pause());
  };

  const handleReset = () => {
    dispatch(reset());
  };

  const handleLap = () => {
    dispatch(addLap());
  };

  return (
    <div className={styles.controls}>
      {isRunning ? (
        <>
          <button
            className={clsx('btn', 'btn--icon', styles['button-controls'])}
            onClick={handlePause}
            aria-label="Pause stopwatch"
            data-tour="pause"
          >
            <Pause />
            {'Pause'}
          </button>
          <button
            className={clsx('btn', 'btn--icon', styles['button-controls'])}
            onClick={handleLap}
            aria-label="Lap stopwatch"
            data-tour="add-lap"
          >
            <Flag />
            {'Lap'}
          </button>
        </>
      ) : (
        <>
          <button
            className={clsx('btn', 'btn--icon', styles['button-controls'])}
            onClick={handleStart}
            aria-label="Start stopwatch"
          >
            <Play />
            {'Play'}
          </button>
          <button
            className={clsx('btn', 'btn--icon', styles['button-controls'])}
            onClick={handleReset}
            aria-label="Reset stopwatch"
          >
            <RefreshCcw />
            {'Reset'}
          </button>
        </>
      )}
    </div>
  );
};
