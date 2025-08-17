import { StepperInput } from '@components/ui/StepperInput/StepperInput';
import styles from './AlertIntervalControl.module.scss';

type AlertIntervalControlProps = {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
};

export const AlertIntervalControl: React.FC<AlertIntervalControlProps> = ({
  value,
  onChange,
  min = 5,
  max = 999,
  step = 1,
  label = 'Interval:',
  unit = 'seconds',
}) => (
  <div className={styles.interval}>
    <span className={styles.label}>{label}</span>

    <StepperInput
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
    />

    <span className={styles.unit}>{unit}</span>
  </div>
);
