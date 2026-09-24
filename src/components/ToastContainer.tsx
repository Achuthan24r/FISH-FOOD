import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 p-3.5 rounded-xl shadow-elevated text-sm font-medium transition-all animate-slide-up ${
            toast.type === 'success'
              ? 'bg-[#14342A] text-white border-l-4 border-[#2E7D4F]'
              : toast.type === 'error'
              ? 'bg-rose-900 text-white border-l-4 border-rose-500'
              : 'bg-slate-900 text-white border-l-4 border-[#F2A900]'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#F2A900] shrink-0" />}
          <span className="flex-1">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
