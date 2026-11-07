import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

export default function ToastNotification() {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-ps-neon shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/40 bg-emerald-950/90 shadow-emerald-500/10',
    error: 'border-rose-500/40 bg-rose-950/90 shadow-rose-500/10',
    warning: 'border-amber-500/40 bg-amber-950/90 shadow-amber-500/10',
    info: 'border-ps-blue/40 bg-slate-900/95 shadow-ps-blue/20',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-in pointer-events-auto">
      <div className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl text-slate-100 ${borders[toast.type] || borders.info}`}>
        {icons[toast.type] || icons.info}
        <p className="text-sm font-medium leading-snug">{toast.message}</p>
      </div>
    </div>
  );
}
