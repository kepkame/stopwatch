export type StepperInputProps = {
  value?: number;
  defaultValue?: number;
  onChange?: (v: number) => void;

  min?: number;
  max?: number;
  step?: number;

  disabled?: boolean;
  id?: string;
  className?: string;

  inputAriaLabel?: string;
};
