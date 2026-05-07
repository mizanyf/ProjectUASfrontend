import { useSystem } from '../../context/SystemContext';
import defaultLogo2 from '../../assets/MoneFloLogo2.png';

const NAV = [
  { key: 'dashboard',  icon: 'fa-gauge-high',   label: 'Dashboard' },
  { key: 'organisasi', icon: 'fa-sitemap',       label: 'Organisasi' },
  { key: 'laporan',    icon: 'fa-chart-bar',     label: 'Laporan' },
  { key: 'sistem',     icon: 'fa-cog',           label: 'Pengaturan Sistem' },
  { key: 'pengaturan', icon: 'fa-user-shield',   label: 'Profil & Keamanan' },
];

export default function AdminSidebar({ currentPage, onNavigate, isOpen, onToggle }) {
  const { settings: sys } = useSystem();
  const logoSrc = sys.logo2Url || defaultLogo2;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full z-50 w-56 flex flex-col
        bg-[#0F172A] border-r border-white/5 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-white/10 flex items-center justify-center">
            <img src={logoSrc} alt="logo" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-white text-sm leading-tight truncate">{sys.appName}</p>
            <p className="text-white/40 text-[9px] uppercase tracking-widest truncate">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-slate-600 text-[10px] uppercase tracking-widest font-semibold px-2 mb-3">Menu</p>
          {NAV.map(({ key, icon, label }) => {
            const active = currentPage === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onNavigate(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <i className={`fas ${icon} text-sm w-4 text-center`} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-user-tie text-indigo-400 text-xs" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">Administrator</p>
              <p className="text-slate-500 text-[10px] truncate">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
