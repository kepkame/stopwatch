import { useSelector } from 'react-redux';
import { Header } from '@components/Header/Header';
import { LapList } from '@components/LapList/LapList';
import { Controls } from '@components/Controls/Controls';
import { TimerDisplay } from '@components/TimerDisplay/TimerDisplay';
import { selectMeasuring } from '@store/selectors/stopwatchSelectors';

function App() {
  const measuring = useSelector(selectMeasuring);

  return (
    <>
      <Header />
      <main>
        <div className="container">
          <TimerDisplay />
          <Controls />
          <LapList measuring={measuring} />
        </div>
      </main>
    </>
  );
}

export default App;
