import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  title?: string;
  closeable?: boolean;
}

export function Modal({ isOpen, onClose, children, title, closeable = true }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={closeable ? onClose : undefined}
      />
      <div className="relative glass-morphism rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-glass">
        {closeable && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
        {title && (
          <h2 className="text-2xl font-bold uppercase tracking-wide text-electric-cyan mb-6">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
