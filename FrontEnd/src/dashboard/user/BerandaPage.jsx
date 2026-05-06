import { useEffect, useRef, useMemo } from 'react';
import { Chart, registerables } from 'chart.js';
import { useApp } from '../../context/AppContext';
import { useFilters } from '../../hooks/useFilters';
import { formatRupiah, formatDate, getInitials } from '../../utils/formatters';
import { StatCards } from './shared';

Chart.register(...registerables);

/* Build last-6-months labels + income/expense sums from transactions */
function buildLast6Months(transactions) {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() });
  }
  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const labels = months.map(({ year, month }) => `${MONTH_NAMES[month]} ${String(year).slice(2)}`);
  const masuk  = months.map(({ year, month }) =>
    transactions.filter(t => {
      const d = new Date(t.date);
      return t.type === 'pemasukan' && d.getFullYear() === year && d.getMonth() === month;
    }).reduce((s, t) => s + t.amount, 0)
  );
  const keluar = months.map(({ year, month }) =>
    transactions.filter(t => {
      const d = new Date(t.date);
      return t.type === 'pengeluaran' && d.getFullYear() === year && d.getMonth() === month;
    }).reduce((s, t) => s + t.amount, 0)
  );
  const hasData = [...masuk, ...keluar].some(v => v > 0);
  return { labels, masuk, keluar, hasData };
}

export default function BerandaPage({ onOpenModal, onNavigate }) {
  const { state } = useApp();
  const filters = useFilters();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const stats = filters.getStats();
  const filtered = filters.getFiltered();
  const recent = filtered.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  /* Compute chart data from real transactions */
  const { labels, masuk, keluar, hasData } = useMemo(
    () => buildLast6Months(state.transactions),
    [state.transactions]
  );

  /* Chart */
  useEffect(() => {
    if (!hasData) { if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null; } return; }
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;
    if (chartInstance.current) chartInstance.current.destroy();
    const maxVal = Math.max(...masuk, ...keluar, 1);
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Pemasukan',   data: masuk,  backgroundColor: '#00695C', borderRadius: 6, barPercentage: 0.55 },
          { label: 'Pengeluaran', data: keluar, backgroundColor: '#083D56', borderRadius: 6, barPercentage: 0.55 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'rectRounded', padding: 16, font: { family: 'Plus Jakarta Sans', size: 12 } } },
        },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: maxVal * 1.2,
            ticks: { callback: (v) => 'Rp' + (v / 1000000).toFixed(1) + 'jt', font: { family: 'Space Grotesk', size: 11 }, color: '#767779' },
            grid: { color: 'rgba(118,119,121,0.1)' },
          },
          x: { ticks: { font: { family: 'Plus Jakarta Sans', size: 12 }, color: '#424242' }, grid: { display: false } },
        },
      },
    });
    return () => chartInstance.current?.destroy();
  }, [hasData, labels, masuk, keluar]);

  /* Progress Bars */
  const colors = ['#00695C', '#083D56', '#00897B', '#546E7A', '#78909C', '#0C5272'];

  return (
    <div className="page-enter space-y-6">
      <StatCards stats={stats} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
          <h3 className="font-semibold text-primary mb-4 text-sm">Pemasukan &amp; Pengeluaran 6 Bulan Terakhir</h3>
          <div className="h-64 flex items-center justify-center">
            {hasData
              ? <canvas ref={chartRef} className="w-full h-full" />
              : <div className="text-center text-neutral">
                  <i className="fas fa-chart-bar text-3xl text-neutral-light mb-2" />
                  <p className="text-sm font-medium">Belum ada data transaksi</p>
                  <p className="text-xs mt-0.5">Tambahkan transaksi untuk melihat grafik</p>
                </div>
            }
          </div>
        </div>

        {/* Progress Bars */}
        <div className="card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary text-sm">Realisasi Anggaran</h3>
            <button type="button" onClick={() => onOpenModal('editReal')}
              className="text-[11px] text-tertiary font-semibold hover:text-tertiary-dark flex items-center gap-1">
              <i className="fas fa-pen text-[9px]" /> Revisi
            </button>
          </div>
          <div className="space-y-3">
            {state.programs.length === 0
              ? <div className="text-center py-4 text-neutral">
                  <i className="fas fa-tasks text-2xl text-neutral-light mb-1" />
                  <p className="text-xs">Belum ada program anggaran</p>
                </div>
              : state.programs.map((p, i) => {
                  const clr = colors[i % colors.length];
                  return (
                    <div key={i} className="prog-row flex items-center gap-3 p-2.5 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-neutral-dark font-medium truncate">{p.name}</span>
                          <span className="text-[11px] font-semibold flex-shrink-0 ml-2" style={{ color: clr }}>{p.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="progress-fill h-full rounded-full" style={{ width: `${p.progress}%`, background: clr }} />
                        </div>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        </div>
      </div>

      {/* Recent Transactions + Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary text-sm">Transaksi Terakhir</h3>
            <button type="button" onClick={() => onNavigate('transaksi')}
              className="text-xs text-tertiary font-semibold hover:text-tertiary-dark">Lihat Semua</button>
          </div>
          <div className="space-y-3">
            {recent.length === 0 && <p className="text-sm text-neutral text-center py-4">Belum ada transaksi</p>}
            {recent.map((t) => {
              const isM = t.type === 'pemasukan';
              return (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isM ? 'bg-tertiary-50' : 'bg-red-50'}`}>
                    <i className={`fas ${isM ? 'fa-arrow-down text-tertiary' : 'fa-arrow-up text-red-400'} text-sm`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-dark truncate">{t.desc}</p>
                    <p className="text-xs text-neutral">{formatDate(t.date)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-display font-semibold text-sm ${isM ? 'text-tertiary' : 'text-red-500'}`}>
                      {isM ? '+' : '-'}{formatRupiah(t.amount)}
                    </p>
                    {t.docs?.length > 0 && (
                      <p className="text-[10px] text-neutral mt-0.5"><i className="fas fa-paperclip mr-0.5" />{t.docs.length} file</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agenda */}
        <div className="card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary text-sm">Agenda Pembayaran</h3>
            <button type="button" onClick={() => onOpenModal('agenda')}
              className="w-7 h-7 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary hover:bg-tertiary/20 transition-colors" title="Tambah agenda">
              <i className="fas fa-plus text-xs" />
            </button>
          </div>
          <AgendaList onOpenModal={onOpenModal} />
        </div>
      </div>
    </div>
  );
}

function AgendaList({ onOpenModal }) {
  const { state, deleteAgenda } = useApp();
  if (!state.agendas.length) return <p className="text-sm text-neutral text-center py-4">Belum ada agenda</p>;

  return (
    <div className="space-y-2">
      {state.agendas.map((a) => {
        const due = new Date(a.date);
        const now = new Date();
        const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
        const isUrgent = diffDays <= 3;
        const isOverdue = diffDays < 0;
        return (
          <div key={a.id} className="agenda-item flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-light/30">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isOverdue ? 'bg-red-50' : isUrgent ? 'bg-amber-50' : 'bg-tertiary-50'}`}>
              <i className={`fas fa-calendar-alt text-sm ${isOverdue ? 'text-red-400' : isUrgent ? 'text-amber-500' : 'text-tertiary'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-neutral-dark truncate">{a.name}</p>
              <p className="text-[10px] text-neutral mt-0.5">{formatRupiah(a.amount)} · {formatDate(a.date)}</p>
            </div>
            <div className="agenda-actions flex gap-1 flex-shrink-0">
              <button type="button" onClick={() => onOpenModal('agenda', a)}
                className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-neutral-light hover:text-primary transition-colors">
                <i className="fas fa-pen text-[10px]" />
              </button>
              <button type="button" onClick={() => deleteAgenda(a.id)}
                className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-neutral-light hover:text-red-500 transition-colors">
                <i className="fas fa-trash text-[10px]" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
