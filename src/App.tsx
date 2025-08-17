import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { closeSettings } from '@store/slices/settingsSlice';
import { useAppSelector } from '@store/hooks';
import { selectIsSettingsOpen } from '@store/selectors/settingsSelectors';
import { Header } from '@components/Header/Header';
import { SettingsModal } from '@components/SettingsModal/SettingsModal';
import StopwatchPage from '@pages/StopwatchPage/StopwatchPage';
import { preloadAlert, setAlertSrc } from '@services/sound/sound';
import alertUrl from '/sounds/beep.mp3?url';

function App() {
  const dispatch = useDispatch();
  const isOpen = useAppSelector(selectIsSettingsOpen);

  useEffect(() => {
    setAlertSrc(alertUrl);
    preloadAlert(alertUrl);
  }, []);

  return (
    <>
      <Header />
      <main>
        <StopwatchPage />
      </main>

      <SettingsModal
        isOpen={isOpen}
        onClose={() => dispatch(closeSettings())}
      />
    </>
  );
}

export default App;
