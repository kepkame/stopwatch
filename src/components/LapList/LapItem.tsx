import { memo } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { m } from 'motion/react';
import { useElapsedTime } from '@hooks/useElapsedTime';
import { useLapSwipe } from '@hooks/useLapSwipe';
import type { RootState } from '@store/store';
import { formatTime } from '@utils/time/formatTime';
import { cyclicIndex, PALETTE_LENGTH, normalizeColorIndex } from '@utils/lapSwipeConfig';
import type { LapItemProps } from './LapList.types';
import styles from './LapList.module.scss';

const LapItemComponent = ({
  lap,
  time,
  diff,
  colorIndex,
  onChangeColor,
  isLatest,
  isOpen,
  prevTs,
}: LapItemProps) => {
  const startEpochMs = useSelector((s: RootState) => s.stopwatch.startEpochMs);
  const accumulatedMs = useSelector((s: RootState) => s.stopwatch.accumulatedMs);
  const status = useSelector((s: RootState) => s.stopwatch.status);

  const enableLive = !!(isLatest && isOpen);
  const elapsedMs = useElapsedTime(startEpochMs, accumulatedMs, status, enableLive);
  const liveDiff = enableLive ? `+${formatTime(Math.max(0, elapsedMs - prevTs))}` : diff;

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
      data-tour={isLatest ? 'lap-item-latest' : undefined}
    >
      <m.div
        ref={overlayRef}
        className={clsx(
          styles['lap__overlay'],
          overlayRtl && styles.rtl,
          overlayRtl ? styles.roundedRtl : styles.rounded,
        )}
        data-color-index={previewIndex}
        aria-hidden
      />
      <div className={styles['lap__content']}>
        <span className={styles.number}>{`Lap ${lap}`}</span>
        {time ? <span className={styles.time}>{time}</span> : null}
        <span className={styles.diff}>{liveDiff}</span>
      </div>
    </m.div>
  );
};

export const LapItem = memo(LapItemComponent);
