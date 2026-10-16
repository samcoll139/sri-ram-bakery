import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);
let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 2800) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  function dismissToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item toast-${t.type}`} onClick={() => dismissToast(t.id)}>
            {t.message}
          </div>
        ))}
      </div>

      <style>{`
        .toast-stack {
          position: fixed;
          top: 90px;
          right: 20px;
          z-index: 500;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          max-width: min(320px, calc(100vw - 40px));
        }
        .toast-item {
          background: var(--maroon);
          color: var(--white);
          padding: 0.85rem 1.1rem;
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-lift);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          animation: toast-in 0.25s ease;
        }
        .toast-success { background: var(--maroon); }
        .toast-error { background: var(--danger); }
        .toast-info { background: var(--brown); }
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @media (max-width: 640px) {
          .toast-stack { top: auto; bottom: 90px; right: 12px; left: 12px; max-width: none; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
