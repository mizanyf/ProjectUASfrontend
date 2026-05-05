import { useApp } from '../../context/AppContext';

export default function Toast() {
  const { toasts, removeToast } = useApp();
  if (!toasts.length) return null;

  const colors = { success: 'bg-tertiary text-white', error: 'bg-red-500 text-white', info: 'bg-primary text-white' };
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map(t => (
        <div key={t.id} className={`toast-enter flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg ${colors[t.type] || colors.info} min-w-[280px]`}>
          <i className={`fas ${icons[t.type] || icons.info} text-sm flex-shrink-0`}></i>
          <span className="text-sm font-medium flex-1">{t.msg}</span>
          <button type="button" onClick={() => removeToast(t.id)} className="flex-shrink-0 hover:opacity-70">
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>
      ))}
    </div>
  );
}
