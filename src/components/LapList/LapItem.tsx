import { memo } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { setLapColorIndex } from '@store/slices/stopwatchSlice';
import type { LapItemProps } from './LapList.types';
import { PALETTE_SIZE, cyclicIndex } from './lapSwipeConfig';
import { useLapSwipe } from './useLapSwipe';
import styles from './LapList.module.scss';

const LapItemComponent: React.FC<LapItemProps> = ({
  lap,
  time,
  diff,
  colorIndex,
}) => {
  const dispatch = useDispatch();

  const changeColorBy = (delta: number) => {
    const next =
      (((colorIndex + delta) % PALETTE_SIZE) + PALETTE_SIZE) % PALETTE_SIZE;
    dispatch(setLapColorIndex({ id: lap, colorIndex: next }));
  };

  const {
    containerRef,
    overlayRef,
    overlayRtl,
    colorClassFor,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onKeyDown,
  } = useLapSwipe({ onChangeColor: (d) => changeColorBy(d) }, styles);

  const colorClass = colorClassFor(colorIndex);

  return (
    <div
      className={clsx(styles.lap, colorClass)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onKeyDown={onKeyDown}
      role="group"
      aria-label={`Lap ${lap}`}
      tabIndex={1}
      ref={containerRef}
    >
      <motion.div
        ref={overlayRef}
        className={clsx(
          styles['lap__overlay'],
          overlayRtl && styles.rtl,
          overlayRtl ? styles.px20Rtl : styles.px20,
          styles[
            `color-${cyclicIndex(
              colorIndex,
              overlayRtl ? -1 : 1
            )}` as keyof typeof styles
          ] as string
        )}
        // width is controlled via useLapSwipe's subscription
        aria-hidden
      />
      <div className={styles['lap__content']}>
        <span className={styles.number}>{`Lap ${lap}`}</span>
        <span className={styles.time}>{time}</span>
        <span className={styles.diff}>{diff}</span>
      </div>
    </div>
  );
};

const LapItem = memo(LapItemComponent);
export default LapItem;
