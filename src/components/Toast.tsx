import { CheckCircle, Info, XCircle, X } from 'lucide-react';
import { Toast as ToastType } from '../context/AppContext';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-500/20 border-green-500 text-green-500',
    info: 'bg-blue-500/20 border-blue-500 text-blue-500',
    error: 'bg-red-500/20 border-red-500 text-red-500',
  };

  return (
    <div
      className={`glass-morphism rounded-lg p-4 border-l-4 ${colors[toast.type]} animate-slide-in-right flex items-center gap-3 min-w-[300px] shadow-glass`}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <p className="flex-1 text-white text-sm">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onClose }: { toasts: ToastType[]; onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}
