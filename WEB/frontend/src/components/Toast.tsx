export type ToastType = "success" | "error";

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

export type Notify = (type: ToastType, message: string) => void;

interface ToastStackProps {
  toasts: ToastItem[];
  onClose: (id: number) => void;
}

export default function ToastStack({ toasts, onClose }: ToastStackProps) {
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`} role="status">
          <span className="toast__text">{toast.message}</span>
          <button
            type="button"
            className="toast__close"
            aria-label="Tutup"
            onClick={() => onClose(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
