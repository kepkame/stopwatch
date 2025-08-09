import type { LapItemProps } from './LapList.types';
import styles from './LapList.module.scss';

const LapItem: React.FC<LapItemProps> = ({ lap, time, diff }) => {
  return (
    <div className={styles.lap}>
      <span className={styles.number}>Lap {lap}</span>
      <span className={styles.time}>{time}</span>
      <span className={styles.diff}>Diff {diff}</span>
    </div>
  );
};

export default LapItem;
