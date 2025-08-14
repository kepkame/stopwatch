export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabelledBy?: string;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  variant?: 'center' | 'right';
};
