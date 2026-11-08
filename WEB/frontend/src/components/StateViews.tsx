export function LoadingView({ text = "Memuat data..." }: { text?: string }) {
  return (
    <div className="state-view">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <div className="state-view">
      <h3>Data gagal dimuat</h3>
      <p>{message}</p>
      <button type="button" className="btn btn--primary" onClick={onRetry}>
        Coba lagi
      </button>
    </div>
  );
}

interface EmptyViewProps {
  title: string;
  text: string;
}

export function EmptyView({ title, text }: EmptyViewProps) {
  return (
    <div className="state-view">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
