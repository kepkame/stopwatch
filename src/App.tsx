import { useDispatch } from 'react-redux';
import { closeSettings } from '@store/slices/settingsSlice';
import { useAppSelector } from '@store/hooks';
import { selectIsSettingsOpen } from '@store/selectors/settingsSelectors';
import { Header } from '@components/Header/Header';
import { SettingsModal } from '@components/SettingsModal/SettingsModal';
import StopwatchPage from '@pages/StopwatchPage/StopwatchPage';

function App() {
  const dispatch = useDispatch();
  const isOpen = useAppSelector(selectIsSettingsOpen);

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
