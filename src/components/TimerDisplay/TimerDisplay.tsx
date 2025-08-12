import clsx from 'clsx';
import { useCallback } from 'react';
import { useTimerDisplay } from '@hooks/useTimerDisplay';
import { useTimerAltAnimation } from '@hooks/useTimerAltAnimation';
import { AnimatedDigits } from './AnimatedDigits';
import styles from './TimerDisplay.module.scss';

export const TimerDisplay: React.FC = () => {
  const {
    elapsedStr,
    diffStr,
    countdownStr,
    isElapsedLong,
    isElapsedVeryLong,
    isDiffLong,
    isDiffVeryLong,
    isCountdownLong,
    isCountdownVeryLong,
    mode,
    compact,
    changeTimeByTap,
    ariaLabel,
    cycleMode,
  } = useTimerDisplay();

  const { isAltShown, isSoftAltAnimation, isBlinkTransition, shouldBlink } =
    useTimerAltAnimation(mode);

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
            (isElapsedVeryLong && styles['timer--4digit']) ||
              (isElapsedLong && styles['timer--3digit'])
          )}
        >
          <AnimatedDigits value={elapsedStr} remeasureKey={compact} />
        </div>

        {mode === 'diff' && (
          <div
            className={clsx(
              styles.alt,
              isBlinkTransition && shouldBlink && styles.altPulse,
              isAltShown && styles.altShown,
              (isDiffVeryLong && styles['timer--4digit']) ||
                (isDiffLong && styles['timer--3digit'])
            )}
          >
            <AnimatedDigits
              value={diffStr}
              announce={false}
              remeasureKey={compact}
            />
          </div>
        )}

        {mode === 'countdown' && (
          <div
            className={clsx(
              styles.alt,
              isSoftAltAnimation && styles.altSoft,
              isBlinkTransition && shouldBlink && styles.altPulse,
              (isSoftAltAnimation || isAltShown) && styles.altShown,
              (isCountdownVeryLong && styles['timer--4digit']) ||
                (isCountdownLong && styles['timer--3digit'])
            )}
          >
            <AnimatedDigits
              value={countdownStr}
              announce={false}
              remeasureKey={compact}
            />
          </div>
        )}
      </div>
    </div>
  );
};
