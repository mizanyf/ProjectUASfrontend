import { useApp } from '../../context/AppContext';
import { getInitials } from '../../utils/formatters';

const PAGE_TITLES = {
  beranda: 'Beranda', transaksi: 'Transaksi', laporan: 'Laporan',
  anggota: 'Manajemen Anggota', pengaturan: 'Pengaturan', profil: 'Profil Organisasi',
};

export default function Topbar({ onNotifClick }) {
  const { currentPage, navigateTo, profile, unreadCount, setSidebarOpen, sidebarOpen } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-neutral-light/50 flex-shrink-0 no-print">
      <div className="flex items-center justify-between px-4 lg:px-8 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden w-9 h-9 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-dark hover:bg-neutral-100 transition-colors"
          >
            <i className="fas fa-bars text-sm"></i>
          </button>
          <h2 className="font-semibold text-primary text-lg">{PAGE_TITLES[currentPage] || 'Beranda'}</h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button type="button" onClick={onNotifClick} className="w-9 h-9 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-dark hover:bg-neutral-100 transition-colors relative">
              <i className="fas fa-bell text-sm"></i>
              {unreadCount > 0 && (
                <span className="notif-badge absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('profil')}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-neutral-50 transition-colors"
          >
            <div className="profile-photo-sm bg-primary flex items-center justify-center text-white text-xs font-bold">
              {profile.photo
                ? <img src={profile.photo} alt="avatar" className="w-full h-full object-cover" />
                : <span>{getInitials(profile.name)}</span>}
            </div>
            <span className="text-sm font-medium text-neutral-dark hidden sm:block">{profile.name}</span>
            <i className="fas fa-chevron-down text-[10px] text-neutral"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
