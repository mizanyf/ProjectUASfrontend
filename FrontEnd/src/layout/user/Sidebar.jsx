import { useApp } from '../../context/AppContext';
import { getInitials } from '../../utils/formatters';
import { useSystem } from '../../context/SystemContext';
import logoProject2 from '../../assets/MoneFloLogo2.png';

const NAV_ITEMS = [
  { page: 'beranda',    icon: 'fa-home',         label: 'Beranda' },
  { page: 'transaksi',  icon: 'fa-exchange-alt',  label: 'Transaksi' },
  { page: 'laporan',    icon: 'fa-chart-pie',     label: 'Laporan' },
  { page: 'anggota',   icon: 'fa-users',          label: 'Anggota' },
  { page: 'pengaturan', icon: 'fa-cog',           label: 'Pengaturan' },
];

export default function Sidebar({ currentPage, onNavigate, onOpenModal, isOpen, onToggle }) {
  const { state } = useApp();
  const { profile } = state;
  const initials = getInitials(profile.name);
  const { settings: sys } = useSystem();
  const logoSrc = sys.logo2Url || logoProject2;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay fixed inset-0 bg-black/40 z-[45] lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside className={`sidebar bg-primary ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img src={logoSrc} alt="MoneFlo Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-lg leading-tight">{sys.appName}</h1>
              <p className="text-white/40 text-[10px] tracking-wider uppercase">{sys.sidebarSub}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ page, icon, label }) => (
            <button
              key={page}
              type="button"
              onClick={() => onNavigate(page)}
              data-page={page}
              className={`nav-item w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/70 ${currentPage === page ? 'active' : ''}`}
            >
              <i className={`fas ${icon} w-5 text-center`} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Add Transaction Button */}
        <div className="px-4 pb-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => onOpenModal('tambah')}
            className="btn-pulse w-full flex items-center justify-center gap-2 py-3 bg-tertiary text-white rounded-xl text-sm font-semibold hover:bg-tertiary-light transition-colors"
          >
            <i className="fas fa-plus" /> Tambah Transaksi
          </button>
        </div>

        {/* Org Card */}
        <div className="px-4 pb-5 flex-shrink-0">
          <div className="org-card-clickable bg-white/10 rounded-xl p-3.5" onClick={() => onOpenModal('orgInfo')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-tertiary/40 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                {profile.photo
                  ? <img src={profile.photo} alt="" className="w-full h-full object-cover" />
                  : <span>{initials}</span>
                }
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-semibold truncate">{profile.name}</p>
                <p className="text-white/40 text-[11px]">Akun Organisasi</p>
              </div>
              <i className="fas fa-chevron-up text-white/30 text-[10px] flex-shrink-0" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
