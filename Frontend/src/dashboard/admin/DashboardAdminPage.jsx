import { useAdmin } from '../../context/AdminContext';

function StatCard({ icon, iconBg, iconColor, label, value, sub, trend }) {
  return (
    <div className="admin-card rounded-2xl p-6 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <i className={`fas ${icon} text-lg ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-neutral text-sm">{label}</p>
        <p className="text-primary-dark text-2xl font-display font-bold mt-0.5">{value}</p>
        {sub && <p className="text-neutral text-xs mt-1">{sub}</p>}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
          trend > 0 ? 'text-tertiary bg-tertiary/10' : 'text-red-500 bg-red-50'
        }`}>
          <i className={`fas fa-arrow-${trend > 0 ? 'up' : 'down'} text-[10px]`} />
          {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}

function OrgStatusBar({ orgs }) {
  if (orgs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-4 text-neutral">
        <i className="fas fa-sitemap text-2xl text-neutral-light mb-2" />
        <p className="text-xs">Belum ada organisasi terdaftar</p>
      </div>
    );
  }
  const total    = orgs.length;
  const aktif    = orgs.filter(o => o.status === 'Aktif').length;
  const pending  = orgs.filter(o => o.status === 'Pending').length;
  const nonAktif = orgs.filter(o => o.status === 'Non-aktif').length;
  return (
    <div className="space-y-3">
      {[
        { label: 'Aktif',     count: aktif,    color: 'bg-tertiary',   text: 'text-tertiary'  },
        { label: 'Pending',   count: pending,  color: 'bg-amber-400',  text: 'text-amber-500' },
        { label: 'Non-aktif', count: nonAktif, color: 'bg-neutral-light', text: 'text-neutral' },
      ].map(({ label, count, color, text }) => (
        <div key={label}>
          <div className="flex justify-between mb-1">
            <span className="text-neutral text-xs">{label}</span>
            <span className={`text-xs font-semibold ${text}`}>{count} org</span>
          </div>
          <div className="pct-bar-track">
            <div className={`pct-bar-fill ${color}`}
              style={{ width: `${(count / total) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentOrgRow({ org, index }) {
  const STATUS_STYLE = {
    'Aktif':     'bg-tertiary/10 text-tertiary border-tertiary/30',
    'Pending':   'bg-amber-50 text-amber-600 border-amber-200',
    'Non-aktif': 'bg-neutral-50 text-neutral border-neutral-light',
  };
  const initials = org.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <div className="flex items-center gap-3 py-3 border-b border-neutral-light/30 last:border-0 hover:bg-neutral-50/50 rounded-lg px-2 -mx-2 transition-all">
      <span className="text-neutral-light text-xs w-4">{index + 1}</span>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold"
           style={{ backgroundColor: org.color + '22', border: `1px solid ${org.color}44` }}>
        <span style={{ color: org.color }}>{initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-neutral-dark text-sm font-medium truncate">{org.name}</p>
        <p className="text-neutral text-xs">{org.type}</p>
      </div>
      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLE[org.status] || ''}`}>
        {org.status}
      </span>
    </div>
  );
}

export default function DashboardAdminPage({ onNavigate }) {
  const { orgs, stats } = useAdmin();
  const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="page-enter space-y-6">
      {/* Welcome Banner */}
      <div className="admin-card rounded-2xl p-6 flex items-center justify-between gap-4 overflow-hidden relative border-l-4 border-tertiary">
        <div className="relative z-10">
          <p className="text-tertiary text-sm font-semibold mb-1">Selamat Datang 👋</p>
          <h2 className="text-primary-dark text-2xl font-display font-bold">Panel Admin MoneFlo</h2>
          <p className="text-neutral text-sm mt-1">Kelola semua organisasi yang terdaftar di sistem.</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0 relative z-10">
          <button type="button" onClick={() => onNavigate('organisasi')}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/20">
            <i className="fas fa-sitemap text-xs" /> Lihat Organisasi
          </button>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-tertiary/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute right-20 bottom-0 w-32 h-32 rounded-full bg-primary/5 translate-y-1/2 pointer-events-none" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="fa-sitemap"      iconBg="bg-primary/10"   iconColor="text-primary"   label="Total Organisasi" value={stats.total}        sub="Semua status"    trend={12} />
        <StatCard icon="fa-check-circle" iconBg="bg-tertiary/10"  iconColor="text-tertiary"  label="Aktif"            value={stats.aktif}        sub="Beroperasi"      trend={5}  />
        <StatCard icon="fa-clock"        iconBg="bg-amber-50"     iconColor="text-amber-500" label="Pending"          value={stats.pending}      sub="Menunggu review"             />
        <StatCard icon="fa-users"        iconBg="bg-secondary/10" iconColor="text-secondary" label="Total Anggota"    value={stats.totalMembers} sub="Semua org"       trend={8}  />
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="admin-card rounded-2xl p-6 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center">
              <i className="fas fa-wallet text-tertiary text-xs" />
            </div>
            <p className="text-neutral-dark text-sm font-semibold">Total Saldo Sistem</p>
          </div>
          <p className="text-primary-dark text-3xl font-display font-bold">{fmt(stats.totalBalance)}</p>
          <p className="text-neutral text-xs mt-2">Akumulasi semua organisasi</p>
          <div className="mt-4 pt-4 border-t border-neutral-light/30">
            <OrgStatusBar orgs={orgs} />
          </div>
        </div>

        <div className="admin-card rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <i className="fas fa-list text-primary text-xs" />
              </div>
              <p className="text-neutral-dark text-sm font-semibold">Organisasi Terdaftar</p>
            </div>
            <button type="button" onClick={() => onNavigate('organisasi')}
              className="text-tertiary hover:text-tertiary-dark text-xs font-semibold transition-colors">
              Lihat Semua →
            </button>
          </div>
          <div>
            {orgs.slice(0, 5).map((org, i) => <RecentOrgRow key={org.id} org={org} index={i} />)}
            {orgs.length === 0 && <p className="text-neutral text-sm text-center py-8">Belum ada organisasi terdaftar.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
