import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectSettings } from '@store/selectors/settingsSelectors';
import { toggleChangeTimeByTap } from '@store/slices/settingsSlice';
import { Switch } from '@components/ui/Switch/Switch';
import { Section } from '../Section/Section';

export const ChangeByTapSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { changeTimeByTap } = useAppSelector(selectSettings);

  return (
    <Section
      title="Change Time by Tap"
      description="Tapping the large time display switches between showing the total time, the last lap time and the time remaining until the end of the lap."
      control={
        <Switch
          checked={changeTimeByTap}
          onChange={() => dispatch(toggleChangeTimeByTap())}
          aria-label="Toggle change time by tap"
        />
      }
    />
  );
};
