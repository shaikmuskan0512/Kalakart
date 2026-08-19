
import { useApp } from "../store";
import "./Toast.css";

export default function Toast() {
 const { toasts, dismissToast } = useApp();
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast"
          onClick={() => dismissToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
