import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export function Toast({
  message,
  type = 'success',
  onClose,
  duration = 2000,
}: ToastProps) {
  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isSuccess = type === 'success';
  const isError = type === 'error';

  const borderColor = isSuccess
    ? 'border-emerald-200/90 dark:border-emerald-800/80 shadow-emerald-950/10'
    : isError
    ? 'border-danger-200/90 dark:border-danger-800/80 shadow-danger-950/10'
    : 'border-slate-200/90 dark:border-zinc-800 shadow-slate-950/10';

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-0 inset-x-0 z-[100] flex justify-center pointer-events-none px-3.5 sm:px-4 pt-[max(0.75rem,env(safe-area-inset-top,0.75rem))] sm:pt-5 animate-fade-in"
    >
      <div
        className={`pointer-events-auto w-full max-w-md bg-white/95 dark:bg-black/95 backdrop-blur-md border ${borderColor} shadow-xl rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-all`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {isSuccess && (
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
          {isError && (
            <div className="w-8 h-8 rounded-xl bg-danger-100 dark:bg-danger-950/80 text-danger-700 dark:text-danger-400 flex items-center justify-center shrink-0 border border-danger-200 dark:border-danger-800/60">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          {!isSuccess && !isError && (
            <div className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-400 flex items-center justify-center shrink-0 border border-primary-200 dark:border-primary-800/60">
              <Info className="w-4 h-4" />
            </div>
          )}
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white leading-snug break-words">
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 active:bg-slate-200 transition-colors shrink-0 cursor-pointer touch-manipulation"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
