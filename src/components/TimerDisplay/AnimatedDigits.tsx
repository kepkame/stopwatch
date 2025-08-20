import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { LazyMotion, domAnimation } from 'motion/react';
import { useDigitLineHeight } from '@hooks/useDigitLineHeight';
import { useComputedFont } from '@hooks/useComputedFont';
import { buildAnimateMask } from '@utils/digits';
import { AnimatedDigitColumn } from './AnimatedDigitColumn';
import styles from './AnimatedDigits.module.scss';

type AnimatedDigitsProps = {
  value: string;
  className?: string;
  announce?: boolean;
  remeasureKey?: unknown;
  staticRightDigits?: number;
};

export const AnimatedDigits: React.FC<AnimatedDigitsProps> = ({
  value,
  className,
  announce = true,
  remeasureKey,
  staticRightDigits = 2,
}) => {
  const tokens = useMemo<readonly string[]>(() => Array.from(value), [value]);

  // Measure line height for vertical rail offset
  const { lineHeightPx, measureRef, remeasure } =
    useDigitLineHeight<HTMLSpanElement>([value, remeasureKey]);

  // Compute the actual font shorthand applied to the visible root
  const rootRef = useRef<HTMLSpanElement>(null);
  const measuredFont = useComputedFont(rootRef, [remeasureKey, value]);

  useEffect(() => {
    remeasure();
  }, [remeasureKey, remeasure]);

  // Map<index, shouldAnimate>
  const animateMask = useMemo(
    () => buildAnimateMask(tokens, staticRightDigits),
    [tokens, staticRightDigits]
  );

  const tokenAriaHidden = announce;

  return (
    <LazyMotion features={domAnimation} strict>
      <span ref={rootRef} className={clsx(styles.root, className)}>
        {/* Hidden measurement element – rendered outside to avoid parent transforms */}
        {createPortal(
          <span
            ref={measureRef}
            className={styles.measure}
            style={
              measuredFont
                ? ({ font: measuredFont } as React.CSSProperties)
                : undefined
            }
          >
            0
          </span>,
          document.body
        )}

        {announce && <span className={styles.srOnly}>{value}</span>}

        {tokens.map((ch, idx) => {
          const isDigit = ch >= '0' && ch <= '9';
          if (!isDigit) {
            return (
              <span
                key={`sep-${idx}`}
                className={styles.sep}
                aria-hidden={tokenAriaHidden}
              >
                {ch}
              </span>
            );
          }

          return (
            <AnimatedDigitColumn
              key={`d-${idx}`}
              digit={ch}
              lineHeightPx={lineHeightPx}
              animated={animateMask.get(idx) ?? true}
            />
          );
        })}
      </span>
    </LazyMotion>
  );
};
