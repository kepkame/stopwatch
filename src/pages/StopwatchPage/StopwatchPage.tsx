import { TimerDisplay } from '@components/TimerDisplay/TimerDisplay';
import { Controls } from '@components/Controls/Controls';
import { LapList } from '@components/LapList/LapList';
import { useSelector } from 'react-redux';
import { selectMeasuring } from '@store/selectors/stopwatchSelectors';

const StopwatchPage = () => {
  const measuring = useSelector(selectMeasuring);

  return (
    <div>
      <TimerDisplay />
      <Controls />
      <LapList measuring={measuring} />
    </div>
  );
};

export default StopwatchPage;
