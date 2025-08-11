import { TimerDisplay } from '@components/TimerDisplay/TimerDisplay';
import { Controls } from '@components/Controls/Controls';
import { LapList } from '@components/LapList/LapList';
import { useDispatch, useSelector } from 'react-redux';
import { selectMeasuring } from '@store/selectors/stopwatchSelectors';
import { setLapColorIndex } from '@store/slices/stopwatchSlice';
import { PALETTE_SIZE, cyclicIndex } from '@utils/lapSwipeConfig';
import styles from './StopwatchPage.module.scss';

const StopwatchPage = () => {
  const dispatch = useDispatch();
  const measuring = useSelector(selectMeasuring);
  const handleChangeColor = (lap: number, delta: 1 | -1) => {
    const item = measuring.find((m) => m.lap === lap);
    if (!item) return;
    const next = cyclicIndex(item.colorIndex, delta, PALETTE_SIZE);
    dispatch(setLapColorIndex({ id: lap, colorIndex: next }));
  };

  return (
    <div className={styles.stopwatchPage}>
      <TimerDisplay />
      <Controls />
      <LapList measuring={measuring} onChangeColor={handleChangeColor} />
    </div>
  );
};

export default StopwatchPage;
