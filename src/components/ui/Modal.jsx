import React, { useEffect } from 'react';
import { Icons } from './Icons';
import './Modal.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true
}) => {
  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-content modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showClose) && (
          <div className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {showClose && (
              <button className="modal-close" onClick={onClose}>
                <Icons.x width={20} height={20} />
              </button>
            )}
          </div>
        )}
        
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;