import { useState } from 'react';

export function useToasts() {
  const [toasts, setToasts] = useState([]);

  const showToast = (text, subtitle) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, subtitle }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 3200);
  };

  return { toasts, showToast };
}

export function ToastContainer({ toasts }) {
  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[150] flex flex-col gap-2 items-center pointer-events-none w-full px-5"
      style={{ bottom: 'calc(85px + var(--safe-bot))' }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} text={toast.text} subtitle={toast.subtitle} />
      ))}
    </div>
  );
}

function Toast({ text, subtitle }) {
  return (
    <div
      className="rounded-full text-[13px] font-bold backdrop-blur-md flex items-center gap-2.5 max-w-full px-5 py-3 border"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--accent)',
        color: 'var(--text)',
        animation: 'toastIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), toastOut 0.4s 2.6s forwards',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
      }}
    >
      <span className="font-mono" style={{ color: 'var(--xp)' }}>{text}</span>
      {subtitle && <span className="text-[12px]" style={{ color: 'var(--text-dim)' }}>{subtitle}</span>}
    </div>
  );
}
