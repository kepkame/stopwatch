import { memo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import type { LapItemProps } from './LapList.types';
import { setLapColorIndex } from '@store/slices/stopwatchSlice';
import styles from './LapList.module.scss';

const PALETTE_SIZE = 6;
const SWIPE_THRESHOLD_PX = 28; // горизонтальный порог
const DOMINANCE_RATIO = 1.2; // горизонт должен доминировать над вертикалью

const LapItemComponent: React.FC<LapItemProps> = ({
  lap,
  time,
  diff,
  colorIndex,
}) => {
  const dispatch = useDispatch();
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const swiped = useRef<boolean>(false);
  const pointerIdRef = useRef<number | null>(null);

  const changeColorBy = (delta: number) => {
    const next =
      (((colorIndex + delta) % PALETTE_SIZE) + PALETTE_SIZE) % PALETTE_SIZE;
    dispatch(setLapColorIndex({ id: lap, colorIndex: next }));
  };

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    pointerIdRef.current = e.pointerId;
    startX.current = e.clientX;
    startY.current = e.clientY;
    swiped.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (startX.current === null || startY.current === null || swiped.current)
      return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    if (
      Math.abs(dx) >= SWIPE_THRESHOLD_PX &&
      Math.abs(dx) > Math.abs(dy) * DOMINANCE_RATIO
    ) {
      swiped.current = true;
      // Left→Right increases index, Right→Left decreases
      changeColorBy(dx > 0 ? 1 : -1);
      // предотвратим ненужные текущее поведение после срабатывания
      e.preventDefault();
    }
  };

  const resetGesture = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (pointerIdRef.current !== null) {
        e.currentTarget.releasePointerCapture(pointerIdRef.current);
      }
    } catch {}
    startX.current = null;
    startY.current = null;
    swiped.current = false;
    pointerIdRef.current = null;
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    resetGesture(e);
  };

  const onPointerCancel: React.PointerEventHandler<HTMLDivElement> = (e) => {
    resetGesture(e);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!e.shiftKey) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      changeColorBy(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      changeColorBy(-1);
    }
  };

  const colorClass = styles[`color-${colorIndex}` as keyof typeof styles] as
    | string
    | undefined;

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
    >
      <span className={styles.number}>{`Lap ${lap}`}</span>
      <span className={styles.time}>{time}</span>
      <span className={styles.diff}>{diff}</span>
    </div>
  );
};

const LapItem = memo(LapItemComponent);
export default LapItem;
