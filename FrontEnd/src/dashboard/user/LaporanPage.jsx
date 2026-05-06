import { useEffect, useRef, useMemo } from 'react';
import { Chart, registerables } from 'chart.js';
import { useApp } from '../../context/AppContext';
import { useFilters } from '../../hooks/useFilters';
import { formatRupiah } from '../../utils/formatters';
import { StatCards, FilterBar, TransactionTable, TableWrapper } from './shared';
import { useToast } from '../../context/ToastContext';

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

/* Aggregate pengeluaran transactions by category */
const ALLOC_COLORS = ['#083D56','#00695C','#546E7A','#00897B','#78909C','#0C5272'];
function buildAllocations(transactions) {
  const map = {};
  transactions
    .filter(t => t.type === 'pengeluaran')
    .forEach(t => {
      const key = t.cat || 'Lainnya';
      map[key] = (map[key] || 0) + t.amount;
    });
  return Object.entries(map).map(([name, amount], i) => ({
    name, amount, color: ALLOC_COLORS[i % ALLOC_COLORS.length],
  }));
}

export default function LaporanPage({ onOpenModal }) {
  const { state, deleteTransaction } = useApp();
  const showToast = useToast();
  const filters = useFilters();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const stats     = filters.getStats();
  const tableData = filters.getTableData();

  /* Compute chart & allocation data from real transactions */
  const { labels, masuk, keluar, hasData } = useMemo(
    () => buildLast6Months(state.transactions),
    [state.transactions]
  );
  const allocations = useMemo(() => buildAllocations(state.transactions), [state.transactions]);
  const totalAlloc  = allocations.reduce((s, a) => s + a.amount, 0);

  /* Arus Kas Chart */
  useEffect(() => {
    if (!hasData) { if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null; } return; }
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;
    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Pemasukan',   data: masuk,  borderColor: '#00695C', backgroundColor: 'rgba(0,105,92,0.08)', tension: 0.4, fill: true, pointBackgroundColor: '#00695C' },
          { label: 'Pengeluaran', data: keluar, borderColor: '#083D56', backgroundColor: 'rgba(8,61,86,0.06)',  tension: 0.4, fill: true, pointBackgroundColor: '#083D56' },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { family: 'Plus Jakarta Sans', size: 12 } } } },
        scales: {
          y: { beginAtZero: true, ticks: { callback: (v) => 'Rp' + (v / 1000000).toFixed(1) + 'jt', font: { family: 'Space Grotesk', size: 11 }, color: '#767779' }, grid: { color: 'rgba(118,119,121,0.1)' } },
          x: { ticks: { font: { family: 'Plus Jakarta Sans', size: 12 }, color: '#424242' }, grid: { display: false } },
        },
      },
    });
    return () => chartInstance.current?.destroy();
  }, [hasData, labels, masuk, keluar]);

  /* Remove old static allocation total — now computed from real transactions above */

  const exportCSV = () => {
    const rows = [['Tanggal', 'Deskripsi', 'Kategori', 'Tipe', 'Jumlah', 'Status']];
    tableData.forEach((t) => rows.push([t.date, t.desc, t.cat, t.type, t.amount, t.status]));
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'laporan.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => window.print();

  const handleDelete = (id) => {
    if (window.confirm('Hapus transaksi ini?')) {
      deleteTransaction(id);
      showToast('Transaksi dihapus', 'info');
    }
  };

  return (
    <div className="page-enter space-y-6">
      <StatCards stats={stats} />

      <FilterBar
        timeFilter={filters.timeFilter}
        typeFilter={filters.typeFilter}
        customStart={filters.customStart}
        customEnd={filters.customEnd}
        search={filters.search}
        onSwitchTime={filters.switchTime}
        onSetType={filters.setTypeFilter}
        onCustomDate={filters.handleCustomDate}
        onSearch={filters.setSearch}
        extraRight={
          <>
            <button type="button" onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-tertiary/10 text-tertiary rounded-lg text-xs font-medium hover:bg-tertiary/20 transition-colors">
              <i className="fas fa-file-excel" /> CSV
            </button>
            <button type="button" onClick={exportPDF}
              className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors">
              <i className="fas fa-file-pdf" /> PDF
            </button>
          </>
        }
      />

      {/* Charts + Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
          <h3 className="font-semibold text-primary mb-4">Visualisasi Arus Kas</h3>
          <div className="h-72 flex items-center justify-center">
            {hasData
              ? <canvas ref={chartRef} className="w-full h-full" />
              : <div className="text-center text-neutral">
                  <i className="fas fa-chart-line text-3xl text-neutral-light mb-2" />
                  <p className="text-sm font-medium">Belum ada data transaksi</p>
                  <p className="text-xs mt-0.5">Tambahkan transaksi untuk melihat arus kas</p>
                </div>
            }
          </div>
        </div>

        <div className="card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
          <h3 className="font-semibold text-primary mb-4">Alokasi Pengeluaran</h3>
          {allocations.length === 0
            ? <div className="flex flex-col items-center justify-center py-8 text-neutral">
                <i className="fas fa-pie-chart text-3xl text-neutral-light mb-2" />
                <p className="text-sm font-medium">Belum ada pengeluaran</p>
                <p className="text-xs mt-0.5">Data muncul saat ada transaksi pengeluaran</p>
              </div>
            : <>
                <div className="space-y-4">
                  {allocations.map((a, i) => {
                    const pct = totalAlloc > 0 ? Math.round(a.amount / totalAlloc * 100) : 0;
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-neutral-dark">{a.name}</span>
                          <span className="text-[11px] font-semibold" style={{ color: a.color }}>{pct}%</span>
                        </div>
                        <div className="pct-bar-track">
                          <div className="pct-bar-fill" style={{ width: `${pct}%`, background: a.color }} />
                        </div>
                        <p className="text-[10px] text-neutral mt-0.5">{formatRupiah(a.amount)}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 pt-4 border-t border-neutral-light/50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral uppercase tracking-wider">Total Pengeluaran</span>
                  <span className="font-display font-bold text-sm text-neutral-dark">{formatRupiah(totalAlloc)}</span>
                </div>
              </>
          }
        </div>
      </div>

      <TableWrapper>
        <TransactionTable
          data={tableData}
          onEdit={(id) => onOpenModal('editTxn', id)}
          onDelete={handleDelete}
        />
      </TableWrapper>
    </div>
  );
}
