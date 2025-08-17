export type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> & {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isOutline?: boolean;
  isIcon?: boolean;
  isDisabled?: boolean;
};
