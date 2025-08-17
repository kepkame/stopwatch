import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { LazyMotion, domAnimation, useReducedMotion } from 'motion/react';
import { useDigitLineHeight } from '@hooks/useDigitLineHeight';
import { AnimatedDigitColumn } from './AnimatedDigitColumn';
import styles from './AnimatedDigits.module.scss';

type AnimatedDigitsProps = {
  value: string;
  className?: string;
  announce?: boolean;
  remeasureKey?: unknown;
};

export const AnimatedDigits: React.FC<AnimatedDigitsProps> = ({
  value,
  className,
  announce = true,
  remeasureKey,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { lineHeightPx, measureRef, remeasure } =
    useDigitLineHeight<HTMLSpanElement>([value, remeasureKey]);
  const rootRef = useRef<HTMLSpanElement>(null);
  const [measuredFont, setMeasuredFont] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const update = () => {
      const cs = window.getComputedStyle(el);
      // full shorthand: weight, size/line-height, family, etc.
      setMeasuredFont(cs.font);
      remeasure();
    };
    update();
    const onResize = () => update();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [remeasureKey, remeasure]);

  const tokens = useMemo(() => value.split(''), [value]);

  const animateMask = useMemo(() => {
    const digitPositions: number[] = [];

    tokens.forEach((ch, idx) => {
      if (ch >= '0' && ch <= '9') digitPositions.push(idx);
    });

    // Disable animation for last two numeric digits (hundredths)
    const rightToLeft = digitPositions.slice().reverse();
    const disabled = new Set<number>(rightToLeft.slice(0, 2));
    const map = new Map<number, boolean>();
    digitPositions.forEach((i) => map.set(i, !disabled.has(i)));
    return map;
  }, [tokens]);

  return (
    <LazyMotion features={domAnimation} strict>
      <span ref={rootRef} className={clsx(styles.root, className)}>
        {/* Hidden measurement element – rendered outside to avoid parent transforms */}
        {createPortal(
          <span
            ref={measureRef as React.RefObject<HTMLSpanElement>}
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
                aria-hidden={false}
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
              prefersReducedMotion={!!prefersReducedMotion}
              animated={animateMask.get(idx) ?? true}
            />
          );
        })}
      </span>
    </LazyMotion>
  );
};
