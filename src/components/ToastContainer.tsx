import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map(toast => {
        let bgStyle = 'bg-slate-900 text-white';
        let Icon = Info;

        if (toast.type === 'success') {
          bgStyle = 'bg-emerald-900/95 text-emerald-50 border border-emerald-700/60 shadow-lg';
          Icon = CheckCircle2;
        } else if (toast.type === 'error') {
          bgStyle = 'bg-rose-900/95 text-rose-50 border border-rose-700/60 shadow-lg';
          Icon = AlertCircle;
        } else if (toast.type === 'warning') {
          bgStyle = 'bg-amber-900/95 text-amber-50 border border-amber-700/60 shadow-lg';
          Icon = AlertTriangle;
        } else {
          bgStyle = 'bg-slate-900/95 text-slate-50 border border-slate-700/60 shadow-lg';
          Icon = Info;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg text-sm transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${bgStyle}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-snug">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white p-0.5 rounded transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
