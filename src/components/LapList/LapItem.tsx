import clsx from 'clsx';
import { m } from 'motion/react';
import { useLapSwipe } from '@hooks/useLapSwipe';
import {
  cyclicIndex,
  PALETTE_LENGTH,
  normalizeColorIndex,
} from '@utils/lapSwipeConfig';
import type { LapItemProps } from './LapList.types';
import styles from './LapList.module.scss';

export const LapItem = ({
  lap,
  time,
  diff,
  colorIndex,
  onChangeColor,
}: LapItemProps) => {
  const EASE: [number, number, number, number] = [0.2, 0, 0, 1];
  const DURATION_S = 0.4;

  const changeColorBy = (delta: 1 | -1) => onChangeColor(lap, delta);

  const {
    containerRef,
    overlayRef,
    overlayRtl,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onKeyDown,
  } = useLapSwipe({ onChangeColor: changeColorBy });

  const length = PALETTE_LENGTH();
  const normalized = normalizeColorIndex(colorIndex, length);
  const previewIndex = cyclicIndex(normalized, overlayRtl ? -1 : 1, length);

  return (
    <m.div
      layout="position"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: DURATION_S,
        ease: EASE,
        layout: { duration: DURATION_S, ease: EASE },
      }}
      style={{ transformOrigin: 'top center' }}
      className={clsx(styles.lap)}
      data-color-index={normalized}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onKeyDown={onKeyDown}
      role="group"
      aria-label={`Lap ${lap}`}
      tabIndex={0}
      ref={containerRef}
    >
      <m.div
        ref={overlayRef}
        className={clsx(
          styles['lap__overlay'],
          overlayRtl && styles.rtl,
          overlayRtl ? styles.roundedRtl : styles.rounded
        )}
        data-color-index={previewIndex}
        aria-hidden
      />
      <div className={styles['lap__content']}>
        <span className={styles.number}>{`Lap ${lap}`}</span>
        {time ? <span className={styles.time}>{time}</span> : null}
        <span className={styles.diff}>{diff}</span>
      </div>
    </m.div>
  );
};
