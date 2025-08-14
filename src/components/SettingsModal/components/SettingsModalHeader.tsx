import { MoveLeft } from 'lucide-react';
import type { SettingsModalHeaderProps } from './SettingsModalHeader.types';
import styles from '../SettingsModal.module.scss';

export const SettingsModalHeader: React.FC<SettingsModalHeaderProps> = ({
  onClose,
  titleId,
}) => {
  return (
    <header className={styles.header}>
      <button
        className={styles.close}
        aria-label="Close settings"
        type="button"
        onClick={onClose}
      >
        <MoveLeft size={24} />
      </button>
      <h2 className={styles.title} id={titleId}>
        Settings
      </h2>
    </header>
  );
};
