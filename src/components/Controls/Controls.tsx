import clsx from 'clsx';
// import type { ControlsProps } from './Cotrols.types';
import { Pause, Flag, Play, RefreshCcw } from 'lucide-react';
import styles from './Controls.module.scss';

const Controls = () => {
  const isRunning = false;

  return (
    <div className={styles.controls}>
      {isRunning ? (
        <>
          <button
            className={clsx('btn', 'btn--icon', styles['button-controls'])}
          >
            <Pause />
            {'Pause'}
          </button>
          <button
            className={clsx('btn', 'btn--icon', styles['button-controls'])}
          >
            <Flag />
            {'Lap'}
          </button>
        </>
      ) : (
        <>
          <button
            className={clsx('btn', 'btn--icon', styles['button-controls'])}
          >
            <Play />
            {'Play'}
          </button>
          <button
            className={clsx('btn', 'btn--icon', styles['button-controls'])}
          >
            <RefreshCcw />
            {'Reset'}
          </button>
        </>
      )}
    </div>
  );
};

export default Controls;
