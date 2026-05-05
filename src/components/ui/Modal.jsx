import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg', footer }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div className={`modal-content bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-hidden flex flex-col`}>
        <div className="flex items-center justify-between p-5 border-b border-neutral-light/50 flex-shrink-0 sticky top-0 bg-white rounded-t-2xl z-10">
          <h3 className="font-semibold text-primary text-lg">{title}</h3>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-neutral-50 flex items-center justify-center text-neutral">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="flex gap-3 p-5 border-t border-neutral-light/50 flex-shrink-0 sticky bottom-0 bg-white rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
