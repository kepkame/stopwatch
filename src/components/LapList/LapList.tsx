import { LazyMotion, domMax, m, useReducedMotion } from 'motion/react';
import { LapItem } from './LapItem';
import type { LapListProps } from './LapList.types';
import styles from './LapList.module.scss';

export const LapList: React.FC<LapListProps> = ({
  measuring,
  onChangeColor,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const EASE: [number, number, number, number] = [0.2, 0, 0, 1];
  const DURATION_S = 0.3;

  return (
    <div className={styles.list}>
      <LazyMotion features={domMax} strict>
        <m.div
          className={styles.results}
          layout={!prefersReducedMotion}
          transition={{ layout: { duration: DURATION_S, ease: EASE } }}
        >
          {measuring
            .slice()
            .reverse()
            .map((item) => (
              <LapItem
                key={item.lap}
                lap={item.lap}
                time={item.time}
                diff={item.diff}
                colorIndex={item.colorIndex}
                onChangeColor={onChangeColor}
              />
            ))}
        </m.div>
      </LazyMotion>
    </div>
  );
};
