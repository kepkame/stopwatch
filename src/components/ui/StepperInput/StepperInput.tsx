import { useMemo } from 'react';
import clsx from 'clsx';
import { Minus, Plus } from 'lucide-react';
import { useHoldRepeat } from './hooks/useHoldRepeat';
import { useStepperValue } from './hooks/useStepperValue';
import type { StepperInputProps } from './StepperInput.types';
import styles from './StepperInput.module.scss';

export const StepperInput: React.FC<StepperInputProps> = ({
  value,
  defaultValue,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  id,
  className,
  inputAriaLabel,
}) => {
  // Core value logic (controlled/uncontrolled, editing state, inc/dec handlers)
  const {
    current,
    draft,
    canDec,
    canInc,
    setDraft,
    setFocused,
    commit,
    inc,
    dec,
    onKeyDown,
  } = useStepperValue({
    value,
    defaultValue,
    onChange,
    min,
    max,
    step,
    disabled,
  });

  // Enable press-and-hold repeat for buttons
  const decRepeat = useHoldRepeat(dec, { disabled });
  const incRepeat = useHoldRepeat(inc, { disabled });

  const aria = useMemo(
    () => ({
      'aria-valuemin': typeof min === 'number' ? min : undefined,
      'aria-valuemax': typeof max === 'number' ? max : undefined,
      'aria-valuenow': current,
    }),
    [current, min, max]
  );

  return (
    <div
      className={clsx(styles.stepper, disabled && styles.disabled, className)}
    >
      <button
        type="button"
        className={clsx(styles.control, styles.dec)}
        aria-label="Decrease value"
        tabIndex={-1}
        {...decRepeat.handlers}
        disabled={!canDec}
      >
        <Minus size={16} />
      </button>

      <input
        id={id}
        className={styles.input}
        inputMode="numeric"
        pattern="[0-9]*"
        role="spinbutton"
        aria-label={inputAriaLabel}
        {...aria}
        value={draft}
        onChange={(e) => {
          // Allow only digits, minus, dot/comma
          const raw = e.target.value.replace(/[^\d.,-]/g, '');
          setDraft(raw);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          // Finalize value when leaving input
          setFocused(false);
          commit(draft);
          decRepeat.stop();
          incRepeat.stop();
        }}
        onKeyDown={onKeyDown}
        disabled={disabled}
      />

      <button
        type="button"
        className={clsx(styles.control, styles.inc)}
        aria-label="Increase value"
        tabIndex={-1}
        {...incRepeat.handlers}
        disabled={!canInc}
      >
        <Plus size={16} />
      </button>
    </div>
  );
};
