const PAGE_TITLES = {
  dashboard:  'Dashboard',
  organisasi: 'Organisasi',
  laporan:    'Laporan',
  sistem:     'Pengaturan Sistem',
  pengaturan: 'Profil & Keamanan',
};

export default function AdminTopbar({ currentPage, onToggleSidebar, onLogout }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-neutral-light/50 flex-shrink-0">
      <div className="flex items-center justify-between px-4 lg:px-8 py-3.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden w-9 h-9 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-dark hover:bg-neutral-100 transition-colors"
          >
            <i className="fas fa-bars text-sm" />
          </button>
          <div>
            <h2 className="font-display font-semibold text-primary text-base leading-tight">
              {PAGE_TITLES[currentPage] || 'Dashboard'}
            </h2>
            <p className="text-neutral text-xs mt-0.5">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tertiary/10 border border-tertiary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
            <span className="text-tertiary text-xs font-semibold">Online</span>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-light text-neutral-dark hover:text-red-500 hover:border-red-300 hover:bg-red-50 text-sm font-medium transition-all"
          >
            <i className="fas fa-sign-out-alt text-xs" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
