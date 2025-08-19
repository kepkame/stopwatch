import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectTheme } from '@store/selectors/settingsSelectors';
import { setTheme } from '@store/slices/settingsSlice';
import {
  THEME_VALUES,
  THEME_LABELS,
  type Theme,
} from '@shared/config/settings';
import { Section } from '../Section/Section';
import { ThemeSwatch } from './ThemeSwatch';
import styles from './ThemeColorSection.module.scss';

export const ThemeColorSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector(selectTheme);

  const handleOnSelect = (value: Theme) => {
    if (value !== current) dispatch(setTheme(value));
  };

  return (
    <Section title="Theme Color">
      <fieldset className={styles.fieldset}>
        <div role="radiogroup" aria-label="Theme color" className={styles.row}>
          {THEME_VALUES.map((value) => (
            <ThemeSwatch
              key={value}
              value={value}
              label={THEME_LABELS[value]}
              active={value === current}
              onSelect={handleOnSelect}
            />
          ))}
        </div>
      </fieldset>
    </Section>
  );
};
