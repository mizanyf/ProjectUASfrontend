import { useEffect, useRef, useState } from 'react';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDate } from '../../utils/formatters';
import FilterBar from '../../components/ui/FilterBar';
import TransactionTable, { TransactionTableWrapper } from '../../components/ui/TransactionTable';
import EditTransaksiModal from '../../components/modals/EditTransaksiModal';

Chart.register(BarController, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

export default function LaporanPage() {
  const { getStats, getFilteredTransactions, typeFilter, deleteTransaction, allocations } = useApp();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [search, setSearch] = useState('');
  const [editTxn, setEditTxn] = useState(null);

  const { saldo, masuk, keluar, mp, kp } = getStats();
  const { filtered } = getFilteredTransactions();

  let tableData = typeFilter !== 'semua' ? filtered.filter(t => t.type === typeFilter) : [...filtered];
  if (search) tableData = tableData.filter(t => t.desc.toLowerCase().includes(search.toLowerCase()) || t.cat.toLowerCase().includes(search.toLowerCase()));
  tableData.sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalAlloc = allocations.reduce((s, a) => s + a.amount, 0);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null; }
    const timeout = setTimeout(() => {
      if (!chartRef.current) return;
      chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: ['Mei','Jun','Jul','Agu','Sep','Okt'],
        datasets: [
          { label: 'Pemasukan', data: [5200000,4800000,6500000,5800000,7200000,8400000], backgroundColor: '#00695C', borderRadius: 6, barPercentage: 0.55 },
          { label: 'Pengeluaran', data: [3100000,2800000,4200000,3600000,4800000,5300000], backgroundColor: '#083D56', borderRadius: 6, barPercentage: 0.55 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 16, font: { family: 'Plus Jakarta Sans', size: 12 } } } },
        scales: {
          y: { beginAtZero: true, max: 10000000, ticks: { callback: v => 'Rp'+(v/1000000).toFixed(0)+'jt', font: { size: 11 }, color: '#767779', stepSize: 2000000 }, grid: { color: 'rgba(118,119,121,0.1)' } },
          x: { ticks: { font: { size: 12 }, color: '#424242' }, grid: { display: false } },
        },
      },
      });
    }, 0);
    return () => {
      clearTimeout(timeout);
      if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null; }
    };
  }, []);

  const exportCSV = () => {
    const headers = ['Tanggal','Deskripsi','Kategori','Tipe','Jumlah','Status'];
    const rows = tableData.map(t => [t.date, `"${t.desc}"`, t.cat, t.type, t.amount, 'SELESAI']);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'laporan-moneflo.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => window.print();

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Saldo Saat Ini', val: saldo, icon: 'fa-wallet', iconBg: 'bg-primary/10', color: 'text-primary-dark', sub: 'Total Saldo Akumulatif' },
          { label: 'Pemasukan', val: masuk, icon: 'fa-arrow-circle-down', iconBg: 'bg-tertiary/10', color: 'text-tertiary', sub: `${mp >= 0 ? '+' : ''}${mp}% dari Bulan Lalu` },
          { label: 'Pengeluaran', val: keluar, icon: 'fa-arrow-circle-up', iconBg: 'bg-red-50', color: 'text-red-500', sub: `${kp >= 0 ? '+' : ''}${kp}% dari Bulan Lalu` },
        ].map(c => (
          <div key={c.label} className="card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral uppercase tracking-wider">{c.label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.iconBg}`}><i className={`fas ${c.icon} text-sm ${c.color}`}></i></div>
            </div>
            <p className={`font-display font-bold text-2xl stat-number ${c.color}`}>{formatRupiah(c.val)}</p>
            <p className={`text-xs mt-1 ${c.color}`}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar + Export */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterBar searchValue={search} onSearchChange={setSearch} />
        <div className="flex items-center gap-2 no-print ml-2">
          <button type="button" onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 bg-tertiary/10 text-tertiary rounded-lg text-xs font-medium hover:bg-tertiary/20 transition-colors"><i className="fas fa-file-excel"></i> CSV</button>
          <button type="button" onClick={exportPDF} className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"><i className="fas fa-file-pdf"></i> PDF</button>
        </div>
      </div>

      {/* Chart + Alokasi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
          <h3 className="font-semibold text-primary mb-4">Visualisasi Arus Kas</h3>
          <div className="h-72"><canvas ref={chartRef}></canvas></div>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
          <h3 className="font-semibold text-primary mb-4">Alokasi Pengeluaran</h3>
          <div className="space-y-4">
            {allocations.map(a => {
              const pct = totalAlloc > 0 ? Math.round(a.amount / totalAlloc * 100) : 0;
              return (
                <div key={a.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: a.color }}></div><span className="text-sm font-medium text-neutral-dark">{a.name}</span></div>
                    <span className="text-xs font-semibold" style={{ color: a.color }}>{pct}%</span>
                  </div>
                  <div className="pct-bar-track"><div className="pct-bar-fill" style={{ width: `${pct}%`, background: a.color }}></div></div>
                  <p className="text-xs text-neutral mt-1">{formatRupiah(a.amount)}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-neutral-light/50 flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral uppercase tracking-wider">Total Pengeluaran</span>
            <span className="font-display font-bold text-sm text-neutral-dark">{formatRupiah(totalAlloc)}</span>
          </div>
        </div>
      </div>

      <TransactionTableWrapper>
        <TransactionTable data={tableData} onEdit={t => setEditTxn(t)} onDelete={deleteTransaction} />
      </TransactionTableWrapper>

      <EditTransaksiModal isOpen={!!editTxn} onClose={() => setEditTxn(null)} transaction={editTxn} />
    </div>
  );
}
