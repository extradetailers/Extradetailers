import React, { useRef, useEffect } from "react";

interface IModalProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  submitButtonText?: string;
  closeButtonText?: string;
  showFooter?: boolean;
  size?: 'sm' | 'lg' | 'xl';
}

function Modal({
  title,
  children,
  isOpen,
  onClose,
  onSubmit,
  submitButtonText = 'Save changes',
  closeButtonText = 'Close',
  showFooter = true,
  size = "lg"
}: IModalProps) {
  const modalEl = useRef<null | HTMLDivElement>(null);
  const bootstrapModalEl = useRef<null | any>(null);

  useEffect(() => {
    // @ts-ignore
    import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bootstrap) => {
      if (modalEl && modalEl.current && bootstrap) {
        const modal = new bootstrap.Modal(modalEl.current);
        bootstrapModalEl.current = modal;
        
        if (isOpen) {
          modal.show();
        } else {
          modal.hide();
        }
      }
    });
  }, [isOpen]);

  const handleClose = () => {
    if (bootstrapModalEl.current) {
      bootstrapModalEl.current.hide();
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }

    if (bootstrapModalEl.current) {
      bootstrapModalEl.current.hide();
    }
  };

  const modalSizeClass = size ? `modal-${size}` : '';

  return (
    <div
      ref={modalEl}
      className="modal fade"
      id="modal"
      tabIndex={-1}
      aria-labelledby="modalLabel"
      aria-hidden="true"
    >
      <div className={`modal-dialog ${modalSizeClass}`}>
        <form onSubmit={handleSubmit} className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="modalLabel">
              {title}
            </h1>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">{children}</div>
          {showFooter && (
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                {closeButtonText}
              </button>
              {onSubmit && (
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {submitButtonText}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Modal;
