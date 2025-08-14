import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import type { ModalProps } from './Modal.types';
import styles from './Modal.module.scss';

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  ariaLabelledBy,
  closeOnBackdrop = true,
  closeOnEsc = true,
  variant = 'center',
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Local state for delay unmounting during closing animation
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  // Manage mounting/closing animation
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
    }
  }, [isOpen, shouldRender]);

  // Close on ESC
  useEffect(() => {
    if (!shouldRender || !closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    return () => document.removeEventListener('keydown', onKey);
  }, [shouldRender, closeOnEsc, onClose]);

  // Block scroll on the body when the modal is open
  useEffect(() => {
    if (!shouldRender) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prev;
    };
  }, [shouldRender]);

  // Focus on the panel when opening
  useEffect(() => {
    if (isOpen) {
      panelRef.current?.focus();
    }
  }, [isOpen]);

  const onBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnBackdrop) return;
    if (e.target === e.currentTarget) onClose();
  };

  const onPanelAnimationEnd = () => {
    if (isClosing) {
      setShouldRender(false);
      setIsClosing(false);
    }
  };

  if (!shouldRender) return null;

  const backdropClass = clsx(
    styles.backdrop,
    variant === 'right' && styles.backdropRight,
    variant === 'right' && isClosing && styles.backdropRightClosing
  );

  const panelClass = clsx(
    styles.panel,
    variant === 'right' && styles.panelRight,
    variant === 'right' && isClosing && styles.panelRightClosing
  );

  return createPortal(
    <div
      className={backdropClass}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      onMouseDown={onBackdropMouseDown}
    >
      <div
        className={panelClass}
        ref={panelRef}
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
        onAnimationEnd={onPanelAnimationEnd}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
