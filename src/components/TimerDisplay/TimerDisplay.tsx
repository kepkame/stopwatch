import clsx from 'clsx';
import { useCallback } from 'react';
import { useTimerDisplay } from '@hooks/useTimerDisplay';
import styles from './TimerDisplay.module.scss';

export const TimerDisplay: React.FC = () => {
  const {
    elapsedStr,
    diffStr,
    countdownStr,
    isElapsedLong,
    isDiffLong,
    isCountdownLong,
    mode,
    compact,
    changeTimeByTap,
    ariaLabel,
    cycleMode,
  } = useTimerDisplay();

  const onClick = useCallback(() => {
    if (!changeTimeByTap) return;
    cycleMode();
  }, [changeTimeByTap, cycleMode]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!changeTimeByTap) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        cycleMode();
      }
    },
    [changeTimeByTap, cycleMode]
  );

  return (
    <div className={styles.timer}>
      <div
        className={clsx(
          styles.display,
          changeTimeByTap && styles.displayClickable
        )}
        role={changeTimeByTap ? 'button' : undefined}
        aria-label={changeTimeByTap ? ariaLabel : undefined}
        aria-disabled={changeTimeByTap ? undefined : true}
        tabIndex={changeTimeByTap ? 0 : -1}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        <div
          className={clsx(
            styles.value,
            compact && styles.valueCompact,
            isElapsedLong && styles['timer--long']
          )}
        >
          {elapsedStr}
        </div>

        {mode === 'diff' && (
          <div
            className={clsx(
              styles.alt,
              styles.altShown,
              isDiffLong && styles['timer--long']
            )}
          >
            {diffStr}
          </div>
        )}

        {mode === 'countdown' && (
          <div
            className={clsx(
              styles.alt,
              styles.altShown,
              isCountdownLong && styles['timer--long']
            )}
          >
            {countdownStr}
          </div>
        )}
      </div>
    </div>
  );
};
