import Modal from '../ui/Modal';
import { useApp } from '../../context/AppContext';

export default function NotifModal({ isOpen, onClose }) {
  const { notifications, markAllRead } = useApp();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Notifikasi" maxWidth="max-w-sm"
      footer={null}
    >
      <div className="flex items-center justify-between px-4 pt-2 pb-1">
        <span className="text-xs text-neutral">{notifications.filter(n=>!n.read).length} belum dibaca</span>
        <button type="button" onClick={markAllRead} className="text-xs text-tertiary font-semibold hover:text-tertiary-dark">Tandai semua dibaca</button>
      </div>
      <div className="max-h-80 overflow-y-auto divide-y divide-neutral-light/30">
        {notifications.length === 0 ? (
          <p className="text-center text-neutral text-sm py-8">Tidak ada notifikasi</p>
        ) : notifications.map(n => (
          <div key={n.id} className={`flex items-start gap-3 px-4 py-3 ${n.read ? '' : 'bg-primary-50/50'}`}>
            <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className={`fas ${n.icon} text-sm ${n.iconColor}`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${n.read ? 'text-neutral' : 'font-medium text-neutral-dark'}`}>{n.text}</p>
              <p className="text-xs text-neutral mt-0.5">{n.time}</p>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>}
          </div>
        ))}
      </div>
    </Modal>
  );
}
