import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { closeSettings } from '@store/slices/settingsSlice';
import { useAppSelector } from '@store/hooks';
import { useSoundInit } from '@hooks/useSoundInit';
import { useWakeLock } from '@hooks/useWakeLock';
import { selectIsSettingsOpen } from '@store/selectors/settingsSelectors';
import { Header } from '@components/Header/Header';
import { SettingsModal } from '@components/SettingsModal/SettingsModal';
import StopwatchPage from '@pages/StopwatchPage/StopwatchPage';

function App() {
  const dispatch = useDispatch();
  const isOpen = useAppSelector(selectIsSettingsOpen);

  const keepScreenOn = useAppSelector((s) => s.settings.keepScreenOn);
  const status = useAppSelector((s) => s.stopwatch.status);

  useSoundInit();
  useWakeLock(keepScreenOn && status === 'running');

  const handleCloseSettings = useCallback(() => {
    dispatch(closeSettings());
  }, [dispatch]);

  return (
    <>
      <Header />
      <main>
        <StopwatchPage />
      </main>

      <SettingsModal isOpen={isOpen} onClose={handleCloseSettings} />
    </>
  );
}

export default App;
