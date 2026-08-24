import React from 'react';
import { useHackathon } from '../context/HackathonContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useHackathon();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          critical: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-500/30 bg-slate-900/95 text-slate-100 shadow-emerald-500/10',
          warning: 'border-amber-500/30 bg-slate-900/95 text-slate-100 shadow-amber-500/10',
          critical: 'border-rose-500/30 bg-slate-900/95 text-slate-100 shadow-rose-500/10',
          info: 'border-blue-500/30 bg-slate-900/95 text-slate-100 shadow-blue-500/10',
        };

        return (
          <div
            key={toast.id}
            id={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold tracking-tight">{toast.title}</div>
              {toast.description && (
                <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{toast.description}</div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1 -mr-1 -mt-1 rounded-lg"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
