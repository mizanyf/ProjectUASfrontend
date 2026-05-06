import { useSystem } from '../../context/SystemContext';
import logoProject2 from '../../assets/MoneFloLogo2.png';

const NAV_ITEMS = [
  { page: 'dashboard',  icon: 'fa-chart-line',   label: 'Dashboard' },
  { page: 'organisasi', icon: 'fa-sitemap',       label: 'Organisasi' },
  { page: 'laporan',    icon: 'fa-chart-bar',     label: 'Laporan' },
  { page: 'sistem',     icon: 'fa-sliders-h',     label: 'Pengaturan Sistem' },
  { page: 'pengaturan', icon: 'fa-user-lock',    label: 'Profil & Keamanan' },
];

export default function AdminSidebar({ currentPage, onNavigate, isOpen, onToggle }) {
  const { settings: sys } = useSystem();
  const logoSrc = sys.logo2Url || logoProject2;
  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[45] lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-indigo-600/30 ring-1 ring-indigo-500/40">
              <img src={logoSrc} alt="MoneFlo Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-lg leading-tight">{sys.appName}</h1>
              <p className="text-indigo-400 text-[10px] tracking-widest uppercase font-semibold">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-4 mb-3">Menu</p>
          {NAV_ITEMS.map(({ page, icon, label }) => (
            <button
              key={page}
              type="button"
              onClick={() => onNavigate(page)}
              className={`admin-nav-item w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                currentPage === page ? 'active' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <i className={`fas ${icon} w-5 text-center`} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {/* Admin Badge */}
        <div className="px-4 pb-5 flex-shrink-0">
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-user-shield text-white text-sm" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-semibold truncate">Administrator</p>
                <p className="text-indigo-400 text-[11px]">Super Admin</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
