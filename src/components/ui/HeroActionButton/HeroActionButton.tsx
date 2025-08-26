import clsx from 'clsx';
import styles from './HeroActionButton.module.scss';

type HeroActionButtonProps = {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  sizeIcon?: number;
  isRound?: boolean;
  dataTour?: string;
};

export const HeroActionButton = ({
  icon: Icon,
  label,
  onClick,
  sizeIcon = 42,
  isRound = true,
  dataTour,
}: HeroActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'btn',
        'btn--gradient',
        styles.heroButton,
        isRound && styles.round
      )}
      aria-label={label}
      data-tour={dataTour}
    >
      <Icon size={sizeIcon} />
    </button>
  );
};
