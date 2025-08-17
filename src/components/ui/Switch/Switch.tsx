import { forwardRef, useState } from 'react';
import clsx from 'clsx';
import type { SwitchProps } from './Switch.types';
import styles from './Switch.module.scss';

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked,
      onChange,
      disabled,
      name,
      value,
      id,
      size = 'md',
      className,
      ...aria
    },
    ref
  ) => {
    // Controlled if `checked` is provided, otherwise use internal state
    const isControlled = typeof checked === 'boolean';
    const [internal, setInternal] = useState(!!defaultChecked);
    const isOn = isControlled ? !!checked : internal;

    const setOn = (next: boolean) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    const toggle = () => {
      if (!disabled) setOn(!isOn);
    };

    // Keyboard accessibility: space/enter toggles, arrows set explicit state
    const onKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
      if (disabled) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setOn(false);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setOn(true);
      }
    };

    return (
      <>
        {name ? (
          <input
            type="checkbox"
            name={name}
            value={value}
            checked={isOn}
            readOnly
            hidden
          />
        ) : null}

        <button
          ref={ref}
          id={id}
          type="button"
          role="switch"
          aria-checked={isOn}
          aria-disabled={disabled || undefined}
          disabled={disabled}
          onClick={toggle}
          onKeyDown={onKeyDown}
          className={clsx(
            styles.switch,
            styles[size],
            isOn && styles.on,
            disabled && styles.disabled,
            className
          )}
          {...aria}
        >
          <span className={styles.thumb} />
        </button>
      </>
    );
  }
);

Switch.displayName = 'Switch';
