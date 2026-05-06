import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';

Chart.register(...registerables);

/* ---- helpers ---- */
const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
const fmtShort = (n) => n >= 1_000_000 ? `Rp${(n / 1_000_000).toFixed(1)}jt` : `Rp${(n / 1_000).toFixed(0)}rb`;

const DARK_CHART = {
  gridColor: 'rgba(255,255,255,0.07)',
  tickColor: '#64748B',
  legendColor: '#94A3B8',
  font: 'Plus Jakarta Sans',
  fontDisplay: 'Space Grotesk',
};

const STATUS_COLORS = {
  'Aktif':     '#10B981',
  'Pending':   '#F59E0B',
  'Non-aktif': '#64748B',
};

const TYPE_PALETTE = ['#6366F1', '#8B5CF6', '#EC4899', '#14B8A6', '#F59E0B', '#10B981', '#3B82F6'];

/* ==============================================================
   SUB COMPONENTS
   ============================================================== */

function ChartCard({ title, icon, children, className = '' }) {
  return (
    <div className={`admin-card rounded-2xl p-5 ${className}`}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
          <i className={`fas ${icon} text-indigo-400 text-xs`} />
        </div>
        <h3 className="text-slate-200 font-display font-semibold text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function SummaryCard({ icon, iconBg, label, value, sub }) {
  return (
    <div className="admin-card rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <i className={`fas ${icon} text-base`} />
      </div>
      <div>
        <p className="text-slate-400 text-xs">{label}</p>
        <p className="text-white font-display font-bold text-lg leading-tight">{value}</p>
        {sub && <p className="text-slate-500 text-[11px] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ---- Chart: Status Doughnut ---- */
function StatusChart({ orgs }) {
  const ref = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    inst.current?.destroy();
    const aktif = orgs.filter(o => o.status === 'Aktif').length;
    const pending = orgs.filter(o => o.status === 'Pending').length;
    const nonAktif = orgs.filter(o => o.status === 'Non-aktif').length;

    inst.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Aktif', 'Pending', 'Non-aktif'],
        datasets: [{
          data: [aktif, pending, nonAktif],
          backgroundColor: [STATUS_COLORS.Aktif, STATUS_COLORS.Pending, STATUS_COLORS['Non-aktif']],
          borderColor: '#1E293B',
          borderWidth: 3,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: DARK_CHART.legendColor, font: { family: DARK_CHART.font, size: 11 }, padding: 16, usePointStyle: true, pointStyle: 'circle' },
          },
          tooltip: {
            callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw} organisasi` },
          },
        },
      },
    });
    return () => inst.current?.destroy();
  }, [orgs]);

  return <div className="h-56"><canvas ref={ref} /></div>;
}

/* ---- Chart: Saldo per Org (Bar horizontal) ---- */
function BalanceChart({ orgs }) {
  const ref = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    inst.current?.destroy();
    const sorted = [...orgs].sort((a, b) => b.balance - a.balance).slice(0, 6);

    inst.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sorted.map(o => o.name.length > 18 ? o.name.slice(0, 16) + '…' : o.name),
        datasets: [{
          label: 'Saldo',
          data: sorted.map(o => o.balance),
          backgroundColor: sorted.map((_, i) => TYPE_PALETTE[i % TYPE_PALETTE.length] + 'CC'),
          borderColor: sorted.map((_, i) => TYPE_PALETTE[i % TYPE_PALETTE.length]),
          borderWidth: 1.5,
          borderRadius: 6,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => ` ${fmt(ctx.raw)}` } },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { callback: fmtShort, color: DARK_CHART.tickColor, font: { family: DARK_CHART.fontDisplay, size: 10 } },
            grid: { color: DARK_CHART.gridColor },
          },
          y: {
            ticks: { color: DARK_CHART.legendColor, font: { family: DARK_CHART.font, size: 11 } },
            grid: { display: false },
          },
        },
      },
    });
    return () => inst.current?.destroy();
  }, [orgs]);

  return <div className="h-64"><canvas ref={ref} /></div>;
}

/* ---- Chart: Tipe Org (Bar vertical) ---- */
function TypeChart({ orgs }) {
  const ref = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    inst.current?.destroy();

    const typeCount = {};
    orgs.forEach(o => { typeCount[o.type] = (typeCount[o.type] || 0) + 1; });
    const labels = Object.keys(typeCount);
    const data   = labels.map(l => typeCount[l]);

    inst.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Jumlah Org',
          data,
          backgroundColor: labels.map((_, i) => TYPE_PALETTE[i % TYPE_PALETTE.length] + 'AA'),
          borderColor:     labels.map((_, i) => TYPE_PALETTE[i % TYPE_PALETTE.length]),
          borderWidth: 1.5,
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, color: DARK_CHART.tickColor, font: { family: DARK_CHART.fontDisplay, size: 11 } },
            grid: { color: DARK_CHART.gridColor },
          },
          x: {
            ticks: {
              color: DARK_CHART.legendColor,
              font: { family: DARK_CHART.font, size: 10 },
              callback: (_, i) => labels[i].length > 12 ? labels[i].slice(0, 10) + '…' : labels[i],
            },
            grid: { display: false },
          },
        },
      },
    });
    return () => inst.current?.destroy();
  }, [orgs]);

  return <div className="h-52"><canvas ref={ref} /></div>;
}

/* ---- Chart: Anggota per Org (Line) ---- */
function MemberChart({ orgs }) {
  const ref = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    inst.current?.destroy();
    const sorted = [...orgs].sort((a, b) => b.memberCount - a.memberCount);

    inst.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sorted.map(o => o.name.length > 14 ? o.name.slice(0, 12) + '…' : o.name),
        datasets: [{
          label: 'Jumlah Anggota',
          data: sorted.map(o => o.memberCount),
          borderColor: '#6366F1',
          backgroundColor: 'rgba(99,102,241,0.12)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#6366F1',
          pointRadius: 5,
          pointHoverRadius: 7,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 5, color: DARK_CHART.tickColor, font: { family: DARK_CHART.fontDisplay, size: 11 } },
            grid: { color: DARK_CHART.gridColor },
          },
          x: {
            ticks: { color: DARK_CHART.legendColor, font: { family: DARK_CHART.font, size: 10 } },
            grid: { display: false },
          },
        },
      },
    });
    return () => inst.current?.destroy();
  }, [orgs]);

  return <div className="h-52"><canvas ref={ref} /></div>;
}

/* ==============================================================
   MAIN PAGE
   ============================================================== */
export default function LaporanAdminPage() {
  const { orgs, stats } = useAdmin();
  const showToast = useToast();

  /* ---- Ekspor CSV ---- */
  const exportCSV = () => {
    const header = ['Nama Organisasi', 'Tipe', 'Email', 'Telepon', 'Status', 'Anggota', 'Saldo', 'Terdaftar'];
    const rows = orgs.map(o => [
      `"${o.name}"`, o.type, o.email, o.phone, o.status,
      o.memberCount, o.balance, o.createdAt,
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `laporan-organisasi-${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    showToast('Laporan CSV berhasil diekspor', 'success');
  };

  /* ---- Ekspor PDF (print) ---- */
  const exportPDF = () => {
    showToast('Membuka dialog cetak / simpan PDF…', 'info');
    setTimeout(() => window.print(), 400);
  };

  return (
    <div className="page-enter space-y-5 no-print-admin">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-display font-bold text-xl">Laporan Sistem</h2>
          <p className="text-slate-400 text-sm mt-0.5">Analitik dan ringkasan seluruh organisasi terdaftar</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 text-sm font-semibold transition-all"
          >
            <i className="fas fa-file-csv text-xs" /> Ekspor CSV
          </button>
          <button
            type="button"
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600/20 border border-rose-500/30 text-rose-400 hover:bg-rose-600/30 text-sm font-semibold transition-all"
          >
            <i className="fas fa-file-pdf text-xs" /> Ekspor PDF
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon="fa-sitemap"      iconBg="bg-indigo-600/20 text-indigo-400"  label="Total Organisasi" value={stats.total}        sub="Semua status" />
        <SummaryCard icon="fa-check-circle" iconBg="bg-emerald-600/20 text-emerald-400" label="Aktif"           value={stats.aktif}        sub="Beroperasi" />
        <SummaryCard icon="fa-users"        iconBg="bg-violet-600/20 text-violet-400"  label="Total Anggota"    value={stats.totalMembers}  sub="Semua org" />
        <SummaryCard icon="fa-wallet"       iconBg="bg-amber-600/20 text-amber-400"    label="Total Saldo"      value={fmtShort(stats.totalBalance)} sub="Akumulasi" />
      </div>

      {/* Row 1: Doughnut + Balance Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Distribusi Status Organisasi" icon="fa-chart-pie">
          <StatusChart orgs={orgs} />
        </ChartCard>
        <ChartCard title="Saldo Tertinggi per Organisasi" icon="fa-coins" className="lg:col-span-2">
          <BalanceChart orgs={orgs} />
        </ChartCard>
      </div>

      {/* Row 2: Type Bar + Member Line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Jumlah Organisasi per Tipe" icon="fa-layer-group">
          <TypeChart orgs={orgs} />
        </ChartCard>
        <ChartCard title="Jumlah Anggota per Organisasi" icon="fa-users">
          <MemberChart orgs={orgs} />
        </ChartCard>
      </div>

      {/* Detail Table */}
      <div className="admin-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 flex items-center justify-center">
            <i className="fas fa-table text-indigo-400 text-[11px]" />
          </div>
          <h3 className="text-slate-200 font-semibold text-sm">Tabel Ringkasan Organisasi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-slate-800/40">
                {['Organisasi', 'Tipe', 'Status', 'Anggota', 'Saldo', 'Terdaftar'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orgs.map((org) => {
                const initials = org.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
                return (
                  <tr key={org.id} className="border-b border-white/4 hover:bg-white/[0.025] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                             style={{ background: org.color + '25', color: org.color, border: `1px solid ${org.color}40` }}>
                          {initials}
                        </div>
                        <span className="text-slate-200 text-sm font-medium">{org.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 text-sm">{org.type}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        org.status === 'Aktif'     ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                        org.status === 'Pending'   ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                                                     'bg-slate-600/20 text-slate-400 border-slate-600/40'
                      }`}>{org.status}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-300 text-sm">{org.memberCount}</td>
                    <td className="px-4 py-3.5 text-slate-300 text-sm">{fmt(org.balance)}</td>
                    <td className="px-4 py-3.5 text-slate-500 text-sm">
                      {org.createdAt ? new Date(org.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/8 bg-slate-800/40">
                <td colSpan={3} className="px-4 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  Total ({orgs.length} organisasi)
                </td>
                <td className="px-4 py-3 text-indigo-400 text-sm font-bold">{stats.totalMembers}</td>
                <td className="px-4 py-3 text-indigo-400 text-sm font-bold">{fmt(stats.totalBalance)}</td>
                <td className="px-4 py-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
