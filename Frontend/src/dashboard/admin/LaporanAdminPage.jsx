import { useAdmin } from '../../context/AdminContext';
import { useRef, useEffect, useMemo } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const fmt  = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
const fmtM = (n) => 'Rp' + (n / 1000000).toFixed(1) + 'jt';

/* ---- Generic canvas chart ---- */
function ChartCanvas({ config, height = 'h-52' }) {
  const ref  = useRef(null);
  const inst = useRef(null);
  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    if (inst.current) inst.current.destroy();
    inst.current = new Chart(ctx, config);
    return () => inst.current?.destroy();
  }, [JSON.stringify(config)]);
  return <div className={height}><canvas ref={ref} className="w-full h-full" /></div>;
}

const GRID  = { color: 'rgba(255,255,255,0.05)' };
const TICKS = (cb) => ({ ticks: { callback: cb, color: '#64748b', font: { size: 11 } }, grid: GRID });

/* ---- Export helpers ---- */
function exportCSV(orgs) {
  const header = ['Nama', 'Tipe', 'Email', 'Anggota', 'Saldo', 'Status'];
  const rows   = orgs.map(o => [o.name, o.type, o.email, o.memberCount, o.balance, o.status]);
  const csv    = [header, ...rows].map(r => r.join(',')).join('\n');
  const blob   = new Blob([csv], { type: 'text/csv' });
  const url    = URL.createObjectURL(blob);
  const a      = document.createElement('a');
  a.href = url; a.download = `laporan-organisasi-${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

function printPDF() { window.print(); }

/* ================================================================
   MAIN PAGE
   ================================================================ */
export default function LaporanAdminPage() {
  const { orgs, stats } = useAdmin();

  /* derived data */
  const byType       = useMemo(() => {
    const map = {};
    orgs.forEach(o => { map[o.type] = (map[o.type] || 0) + 1; });
    return Object.entries(map);
  }, [orgs]);

  const topBalance   = useMemo(() => [...orgs].sort((a, b) => b.balance - a.balance), [orgs]);
  const topMembers   = useMemo(() => [...orgs].sort((a, b) => b.memberCount - a.memberCount), [orgs]);

  const STATUS_STYLE = {
    'Aktif':     'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'Pending':   'bg-amber-500/15 text-amber-400 border-amber-500/30',
    'Non-aktif': 'bg-slate-600/30 text-slate-400 border-slate-600/50',
  };

  /* ── Chart configs ── */
  const donutConfig = {
    type: 'doughnut',
    data: {
      labels: ['Aktif', 'Pending', 'Non-aktif'],
      datasets: [{ data: [stats.aktif, stats.pending, stats.nonAktif],
        backgroundColor: ['#10b98199', '#f59e0b99', '#64748b99'],
        borderColor:     ['#10b981',   '#f59e0b',   '#64748b'],
        borderWidth: 2, hoverOffset: 6 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '65%',
      plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 }, padding: 12 } } },
    },
  };

  const hBarConfig = {
    type: 'bar',
    data: {
      labels: topBalance.map(o => o.name.length > 16 ? o.name.slice(0,15) + '…' : o.name),
      datasets: [{ label: 'Saldo', data: topBalance.map(o => o.balance),
        backgroundColor: topBalance.map(o => o.color + 'AA'),
        borderColor:     topBalance.map(o => o.color),
        borderWidth: 1.5, borderRadius: 5, barPercentage: 0.6 }],
    },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ...TICKS(fmtM), beginAtZero: true },
        y: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { display: false } },
      },
    },
  };

  const vBarConfig = {
    type: 'bar',
    data: {
      labels: byType.map(([t]) => t.length > 14 ? t.slice(0,13) + '…' : t),
      datasets: [{ label: 'Jumlah', data: byType.map(([, c]) => c),
        backgroundColor: '#6366f199', borderColor: '#6366f1',
        borderWidth: 1.5, borderRadius: 5, barPercentage: 0.55 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { ...TICKS(v => v + ' org'), beginAtZero: true },
        x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { display: false } },
      },
    },
  };

  const lineConfig = {
    type: 'line',
    data: {
      labels: topMembers.map(o => o.name.length > 14 ? o.name.slice(0,13) + '…' : o.name),
      datasets: [{ label: 'Anggota', data: topMembers.map(o => o.memberCount),
        borderColor: '#8b5cf6', backgroundColor: '#8b5cf620',
        pointBackgroundColor: '#8b5cf6', pointRadius: 4,
        tension: 0.35, fill: true }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { ...TICKS(v => v + ' org'), beginAtZero: true },
        x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { display: false } },
      },
    },
  };

  /* ================================================================ */
  return (
    <div className="page-enter space-y-5 print:space-y-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-white font-display font-bold text-xl">Laporan Sistem</h2>
          <p className="text-slate-400 text-sm mt-0.5">Ringkasan data dan keuangan seluruh organisasi terdaftar</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button type="button" onClick={() => exportCSV(orgs)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-sm font-semibold transition-all">
            <i className="fas fa-file-csv text-xs" /> Ekspor CSV
          </button>
          <button type="button" onClick={printPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/25">
            <i className="fas fa-print text-xs" /> Cetak / PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Organisasi', value: stats.total,             icon: 'fa-sitemap',      color: 'text-indigo-400',  bg: 'bg-indigo-600/20'  },
          { label: 'Organisasi Aktif', value: stats.aktif,             icon: 'fa-check-circle', color: 'text-emerald-400', bg: 'bg-emerald-600/20' },
          { label: 'Total Anggota',    value: stats.totalMembers,      icon: 'fa-users',         color: 'text-violet-400',  bg: 'bg-violet-600/20'  },
          { label: 'Total Saldo',      value: fmt(stats.totalBalance),  icon: 'fa-wallet',       color: 'text-amber-400',   bg: 'bg-amber-600/20'   },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} className="admin-card rounded-2xl p-5 flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
              <i className={`fas ${icon} ${color} text-base`} />
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-xs">{label}</p>
              <p className="text-white font-display font-bold text-lg mt-0.5 truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Row 1 — Donut + Horizontal Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="admin-card rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <i className="fas fa-chart-pie text-indigo-400 text-xs" /> Distribusi Status Organisasi
          </h3>
          <ChartCanvas config={donutConfig} height="h-56" />
        </div>
        <div className="admin-card rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <i className="fas fa-chart-bar text-amber-400 text-xs" /> Saldo Tertinggi per Organisasi
          </h3>
          <ChartCanvas config={hBarConfig} height="h-56" />
        </div>
      </div>

      {/* Row 2 — Vertical Bar + Line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="admin-card rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <i className="fas fa-layer-group text-violet-400 text-xs" /> Jumlah Organisasi per Tipe
          </h3>
          <ChartCanvas config={vBarConfig} height="h-52" />
        </div>
        <div className="admin-card rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <i className="fas fa-chart-line text-emerald-400 text-xs" /> Jumlah Anggota per Organisasi
          </h3>
          <ChartCanvas config={lineConfig} height="h-52" />
        </div>
      </div>

      {/* Summary Table */}
      <div className="admin-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm">Ringkasan Keuangan Organisasi</h3>
          <span className="text-slate-500 text-xs">{orgs.length} organisasi</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['#', 'Organisasi', 'Tipe', 'Anggota', 'Saldo', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orgs.length === 0
                ? <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500 text-sm">Belum ada organisasi</td></tr>
                : orgs.map((org, idx) => {
                    const initials = org.name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
                    return (
                      <tr key={org.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 text-slate-600 text-sm">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{ backgroundColor: org.color + '25', color: org.color }}>{initials}</div>
                            <p className="text-white text-sm font-medium truncate max-w-[140px]">{org.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-sm">{org.type}</td>
                        <td className="px-4 py-3 text-slate-300 text-sm">{org.memberCount}</td>
                        <td className="px-4 py-3 text-slate-300 text-sm font-medium">{fmt(org.balance)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[org.status] || ''}`}>
                            {org.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
            {orgs.length > 0 && (
              <tfoot>
                <tr className="border-t border-white/10 bg-slate-800/40">
                  <td colSpan={3} className="px-4 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Total</td>
                  <td className="px-4 py-3 text-white text-sm font-bold">{stats.totalMembers}</td>
                  <td className="px-4 py-3 text-white text-sm font-bold">{fmt(stats.totalBalance)}</td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
