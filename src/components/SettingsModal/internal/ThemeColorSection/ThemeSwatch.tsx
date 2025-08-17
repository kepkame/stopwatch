import clsx from 'clsx';
import { Check } from 'lucide-react';
import { THEME_LABELS, type ThemeKey } from './themeTokens';
import styles from './ThemeSwatch.module.scss';

type ThemeSwatchProps = {
  name: string;
  value: ThemeKey;
  active: boolean;
  onSelect: (v: ThemeKey) => void;
};

export const ThemeSwatch: React.FC<ThemeSwatchProps> = ({
  name,
  value,
  active,
  onSelect,
}) => {
  const id = `${name}-${value}`;
  const label = THEME_LABELS[value];

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLLabelElement>,
    value: ThemeKey
  ) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onSelect(value);
    }
  };

  return (
    <div className={clsx(styles.swatch, active && styles.active)}>
      <input
        id={id}
        className={styles.radio}
        type="radio"
        name={name}
        value={value}
        checked={active}
        onChange={() => onSelect(value)}
        aria-label={label}
        tabIndex={-1}
        inert
      />
      <label
        role="radio"
        aria-checked={active}
        tabIndex={0}
        htmlFor={id}
        onKeyDown={(e) => handleKeyDown(e, value)}
        className={styles.label}
        title={label}
      >
        <span className={styles.dot} aria-hidden />
        {active && <Check size={16} strokeWidth={4} />}
      </label>
    </div>
  );
};
