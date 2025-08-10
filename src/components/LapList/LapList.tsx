import LapItem from './LapItem';
import type { LapListProps } from './LapList.types';
import styles from './LapList.module.scss';

export const LapList: React.FC<LapListProps> = ({ measuring }) => {
  return (
    <div className={styles.results}>
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
          />
        ))}
    </div>
  );
};
