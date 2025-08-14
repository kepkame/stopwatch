import { Modal } from '@components/ui/Modal/Modal';
import { SettingsModalHeader } from './components/SettingsModalHeader';
import type { SettingsModalProps } from './SettingsModal.types';
import styles from './SettingsModal.module.scss';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const titleId = 'settings-title';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledBy={titleId}
      variant="right"
    >
      <SettingsModalHeader onClose={onClose} titleId={titleId} />

      <div className={styles.content}>
        {/* TODO: Add settings */}
        <p>Settings will be here soon. 🎛️</p>
      </div>
    </Modal>
  );
};
