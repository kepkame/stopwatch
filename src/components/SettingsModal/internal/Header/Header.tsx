import { X } from 'lucide-react';
import type { HeaderProps } from './Header.types';
import styles from './Header.module.scss';

export const Header: React.FC<HeaderProps> = ({ onClose, titleId }) => {
  return (
    <header className={styles.header}>
      <h2 className={styles.title} id={titleId}>
        Settings
      </h2>
      <button
        className={styles.close}
        aria-label="Close settings"
        type="button"
        onClick={onClose}
      >
        <X size={24} />
      </button>
    </header>
  );
};
