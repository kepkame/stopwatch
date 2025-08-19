import { useId } from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';
import type { ThemeSwatchProps } from './ThemeSwatch.types';
import styles from './ThemeSwatch.module.scss';

export const ThemeSwatch: React.FC<ThemeSwatchProps> = ({
  value,
  label,
  active,
  onSelect,
}) => {
  const id = useId();
  const groupName = 'theme';

  const handleRadioKeyInteraction: React.KeyboardEventHandler<
    HTMLLabelElement
  > = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const input = document.getElementById(id) as HTMLInputElement | null;
      input?.click();
      return;
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const radios = Array.from(
        document.querySelectorAll<HTMLInputElement>(
          `input[type="radio"][name="${groupName}"]`
        )
      );
      if (!radios.length) return;

      const currentIdx = radios.findIndex((r) => r.id === id);
      if (currentIdx === -1) return;

      const delta = e.key === 'ArrowRight' ? 1 : -1;
      const nextIdx = (currentIdx + delta + radios.length) % radios.length;
      const next = radios[nextIdx];

      next.click();

      const nextLabel = document.querySelector<HTMLLabelElement>(
        `label[for="${next.id}"]`
      );
      nextLabel?.focus();
    }
  };

  return (
    <div className={clsx(styles.swatch, active && styles.active)}>
      <input
        id={id}
        className={styles.radio}
        type="radio"
        name={groupName}
        value={value}
        checked={active}
        onChange={() => onSelect(value)}
        tabIndex={-1}
      />
      <label
        htmlFor={id}
        className={styles.label}
        role="radio"
        title={label}
        aria-label={label}
        aria-checked={active}
        onKeyDown={handleRadioKeyInteraction}
        tabIndex={active ? -1 : 0}
      >
        <span className={styles.dot} aria-hidden />
        {active && <Check size={16} strokeWidth={4} />}
      </label>
    </div>
  );
};
