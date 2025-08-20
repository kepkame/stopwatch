import { m } from 'motion/react';
import styles from './AnimatedDigits.module.scss';

const DIGITS = Array.from({ length: 10 }, (_, i) => String(i));

export const AnimatedDigitColumn = ({
  digit,
  lineHeightPx,
  animated = true,
}: {
  digit: string;
  lineHeightPx: number;
  animated?: boolean;
}) => {
  const index = digit.charCodeAt(0) - 48; // '0' -> 0 ... '9' -> 9
  const y =
    lineHeightPx > 0 && index >= 0 && index <= 9 ? -index * lineHeightPx : 0;

  if (!animated) {
    return (
      <div className={styles.ticker} aria-hidden="true">
        <div
          className={styles.viewport}
          style={{ height: lineHeightPx || undefined }}
        >
          <div
            className={styles.rail}
            style={{
              transform: `translateY(${y}px)`,
              transition: 'none',
            }}
          >
            {DIGITS.map((d) => (
              <div
                key={d}
                className={styles.digit}
                aria-hidden="true"
                style={{ height: lineHeightPx || undefined }}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.ticker} aria-hidden="true">
      <div
        className={styles.viewport}
        style={{ height: lineHeightPx || undefined }}
      >
        <m.div
          className={styles.rail}
          animate={{ y }}
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.2 }}
        >
          {DIGITS.map((d) => (
            <div
              key={d}
              className={styles.digit}
              aria-hidden="true"
              style={{ height: lineHeightPx || undefined }}
            >
              {d}
            </div>
          ))}
        </m.div>
      </div>
    </div>
  );
};
