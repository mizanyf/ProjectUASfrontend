const PAGE_TITLES = {
  dashboard:  { label: 'Dashboard',          icon: 'fa-chart-line' },
  organisasi: { label: 'Organisasi',         icon: 'fa-sitemap' },
  laporan:    { label: 'Laporan',            icon: 'fa-chart-bar' },
  sistem:     { label: 'Pengaturan Sistem',  icon: 'fa-sliders-h' },
  pengaturan: { label: 'Profil & Keamanan',     icon: 'fa-user-lock' },
};

export default function AdminTopbar({ currentPage, onToggleSidebar, onLogout }) {
  const meta = PAGE_TITLES[currentPage] || PAGE_TITLES.dashboard;
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="admin-topbar flex-shrink-0 flex items-center justify-between px-4 lg:px-8 h-16">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className="fas fa-bars text-sm" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
            <i className={`fas ${meta.icon} text-indigo-400 text-xs`} />
          </div>
          <div>
            <h2 className="text-white font-display font-semibold text-base leading-tight">{meta.label}</h2>
            <p className="text-slate-500 text-[11px] hidden sm:block">{dateStr}</p>
          </div>
        </div>
      </div>

      {/* Right: badge + logout */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-medium">Online</span>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
          title="Keluar dari Admin Panel"
        >
          <i className="fas fa-sign-out-alt text-sm" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
}
