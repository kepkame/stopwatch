import { useAppDispatch, useAppSelector } from '@store/hooks';
import { toggleKeepScreenOn } from '@store/slices/settingsSlice';
import { selectSettings } from '@store/selectors/settingsSelectors';
import { Switch } from '@components/ui/Switch/Switch';
import { Section } from '../Section/Section';

export const KeepScreenOnSection = () => {
  const dispatch = useAppDispatch();
  const { keepScreenOn } = useAppSelector(selectSettings);

  return (
    <Section
      title="Keep Screen On"
      description="Prevents your phone from automatically turning off the screen while the stopwatch is running."
      control={
        <Switch
          checked={keepScreenOn}
          onChange={() => dispatch(toggleKeepScreenOn())}
          aria-label="Toggle keep screen on"
        />
      }
    />
  );
};
