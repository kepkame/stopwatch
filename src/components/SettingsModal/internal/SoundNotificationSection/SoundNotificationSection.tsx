import { Volume2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setAlertInterval, toggleSound } from '@store/slices/settingsSlice';
import { selectSettings } from '@store/selectors/settingsSelectors';
import { Button } from '@components/ui/Button/Button';
import { Switch } from '@components/ui/Switch/Switch';
import { Section } from '../Section/Section';
import { AlertIntervalControl } from './AlertIntervalControl';
import type { SoundNotificationSectionProps } from './SoundNotificationSection.types';
import styles from './SoundNotificationSection.module.scss';

export const SoundNotificationSection: React.FC<
  SoundNotificationSectionProps
> = ({ onTestAlert, isTesting }) => {
  const dispatch = useAppDispatch();
  const { soundEnabled, alertIntervalSec } = useAppSelector(selectSettings);

  return (
    <Section
      title="Sound Notification"
      description="After each new lap, a signal will sound after the specified interval."
      control={
        <Switch
          checked={soundEnabled}
          onChange={() => dispatch(toggleSound())}
          aria-label="Toggle sound notification"
        />
      }
    >
      <Button
        onClick={onTestAlert}
        className={styles.btnAlert}
        isIcon
        isOutline
        isDisabled={isTesting}
      >
        <Volume2 size={24} />
        Test Alert
      </Button>

      <AlertIntervalControl
        value={alertIntervalSec}
        onChange={(v) => dispatch(setAlertInterval(v))}
        label="Interval:"
        unit="seconds"
      />
    </Section>
  );
};
