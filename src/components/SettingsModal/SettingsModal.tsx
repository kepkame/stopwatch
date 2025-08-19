import { useState } from 'react';
import { Modal } from '@components/ui/Modal/Modal';
import { playTestAlert } from '@services/sound/sound';
import { Header } from './internal/Header/Header';
import { SoundNotificationSection } from './internal/SoundNotificationSection/SoundNotificationSection';
import { ChangeByTapSection } from './internal/ChangeByTapSection/ChangeByTapSection';
import { KeepScreenOnSection } from './internal/KeepScreenOnSection/KeepScreenOnSection';
import { ThemeColorSection } from './internal/ThemeColorSection/ThemeColorSection';
import type { SettingsModalProps } from './SettingsModal.types';
import styles from './SettingsModal.module.scss';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [testing, setTesting] = useState(false);
  const titleId = 'settings-title';

  const handleTestAlert = async () => {
    if (testing) return;
    setTesting(true);
    try {
      await playTestAlert({ allowOverlap: false, volume: 1 });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledBy={titleId}
      variant="right"
    >
      <Header onClose={onClose} titleId={titleId} />

      <div className={styles.content}>
        <SoundNotificationSection
          onTestAlert={handleTestAlert}
          isTesting={testing}
        />
        <ChangeByTapSection />
        <KeepScreenOnSection />
        <ThemeColorSection />
      </div>
    </Modal>
  );
};
