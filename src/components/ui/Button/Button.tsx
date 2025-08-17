import clsx from 'clsx';
import type { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className,
  isOutline = false,
  isIcon = false,
  isDisabled = false,
  ...props
}) => {
  const classes = clsx(className, 'btn', {
    'btn--outline': isOutline,
    'btn--icon': isIcon,
  });

  return (
    <button
      className={classes}
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  );
};
