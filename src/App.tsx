import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@store/store';
import Header from '@components/Header/Header';
import LapList from '@components/LapList/LapList';
import Controls from '@components/Controls/Controls';
import { TimerDisplay } from '@components/TimerDisplay/TimerDisplay';
import { formatTime } from '@utils/time/formatTime';

function App() {
  const laps = useSelector((state: RootState) => state.stopwatch.laps);

  const measuring = useMemo(() => {
    if (!laps.length) return [];
    const asc = [...laps].sort((a, b) => a.id - b.id); // хронологически
    const durations = asc.map((lap, i) =>
      i === 0 ? lap.timestampMs : lap.timestampMs - asc[i - 1].timestampMs
    );
    return asc.map((lap, i) => {
      const timeMs = lap.timestampMs; // абсолютное время с первого запуска
      const diffMs = durations[i]; // длительность текущего круга
      const timeStr = formatTime(timeMs);
      const diffStr = `+${formatTime(diffMs)}`;

      return {
        lap: lap.id,
        time: timeStr,
        diff: diffStr,
        colorIndex: lap.colorIndex,
      };
    });
  }, [laps]);

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
