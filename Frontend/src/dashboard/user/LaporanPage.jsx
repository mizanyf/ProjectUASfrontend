import { useEffect, useRef, useMemo } from 'react';
import { Chart, registerables } from 'chart.js';
import { useApp } from '../../context/AppContext';
import { useFilters } from '../../hooks/useFilters';
import { formatRupiah } from '../../utils/formatters';
import { StatCards, FilterBar, TransactionTable, TableWrapper } from './shared';
import { useToast } from '../../context/ToastContext';

Chart.register(...registerables);

/* ── Helper: bangun data 6 bulan terakhir ── */
function buildLast6Months(transactions) {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }),
      year: d.getFullYear(), month: d.getMonth(),
      income: 0, expense: 0,
    });
  }
  transactions.forEach(t => {
    const d = new Date(t.date);
    const m = months.find(m => m.year === d.getFullYear() && m.month === d.getMonth());
    if (!m) return;
    if (t.type === 'pemasukan') m.income  += Number(t.amount);
    else                       m.expense += Number(t.amount);
  });
  return months;
}

/* ── Smart Y-axis formatting ── */
function smartTick(v) {
  if (v >= 1_000_000) return 'Rp' + (v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1) + 'jt';
  if (v >= 1_000)     return 'Rp' + (v / 1_000).toFixed(0) + 'rb';
  return 'Rp' + v;
}
function smartMax(maxVal) {
  if (maxVal <= 0) return 100_000;
  const mag = Math.pow(10, Math.floor(Math.log10(maxVal)));
  return Math.ceil(maxVal / mag) * mag * 1.25;
}

/* ── Alokasi dari transaksi pengeluaran per kategori ── */
const CAT_COLORS = {
  Operasional: '#083D56', Event: '#00695C', Sponsor: '#0C5272',
  Logistik: '#546E7A', Kepegawaian: '#00897B', Lainnya: '#78909C',
};

export default function LaporanPage({ onOpenModal }) {
  const { state, deleteTransaction } = useApp();
  const showToast = useToast();
  const filters = useFilters();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const stats     = filters.getStats();
  const tableData = filters.getTableData();

  /* 6-bulan data */
  const months6 = useMemo(() => buildLast6Months(state.transactions), [state.transactions]);
  const hasChartData = months6.some(m => m.income > 0 || m.expense > 0);
  const maxVal = Math.max(...months6.map(m => Math.max(m.income, m.expense)));

  /* Alokasi dari transaksi pengeluaran real per kategori */
  const allocations = useMemo(() => {
    const map = {};
    state.transactions
      .filter(t => t.type === 'pengeluaran')
      .forEach(t => { map[t.cat] = (map[t.cat] || 0) + Number(t.amount); });
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount, color: CAT_COLORS[name] || '#9E9E9E' }))
      .sort((a, b) => b.amount - a.amount);
  }, [state.transactions]);
  const totalAlloc = allocations.reduce((s, a) => s + a.amount, 0);

  /* Arus Kas Chart */
  useEffect(() => {
    if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null; }
    if (!hasChartData) return;
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;
    const yMax = smartMax(maxVal);
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months6.map(m => m.label),
        datasets: [
          { label: 'Pemasukan',   data: months6.map(m => m.income),  borderColor: '#00695C', backgroundColor: 'rgba(0,105,92,0.08)',  tension: 0.4, fill: true, pointBackgroundColor: '#00695C', pointRadius: 4 },
          { label: 'Pengeluaran', data: months6.map(m => m.expense), borderColor: '#083D56', backgroundColor: 'rgba(8,61,86,0.06)',   tension: 0.4, fill: true, pointBackgroundColor: '#083D56', pointRadius: 4 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { family: 'Plus Jakarta Sans', size: 12 } } },
          tooltip: { callbacks: { label: (ctx) => ctx.dataset.label + ': ' + formatRupiah(ctx.raw) } },
        },
        scales: {
          y: {
            beginAtZero: true, max: yMax,
            ticks: { callback: smartTick, font: { family: 'Space Grotesk', size: 11 }, color: '#767779' },
            grid: { color: 'rgba(118,119,121,0.1)' },
          },
          x: { ticks: { font: { family: 'Plus Jakarta Sans', size: 12 }, color: '#424242' }, grid: { display: false } },
        },
      },
    });
    return () => chartInstance.current?.destroy();
  }, [hasChartData, months6, maxVal]);

  const exportCSV = () => {
<<<<<<< HEAD
    const rows = [['Tanggal', 'Deskripsi', 'Kategori', 'Tipe', 'Jumlah', 'Status']];
=======
    const rows = [['Tanggal', 'Keterangan', 'Kategori', 'Tipe', 'Jumlah', 'Status']];
>>>>>>> frontmoneflo
    tableData.forEach(t => rows.push([t.date, t.desc, t.cat, t.type, t.amount, t.status]));
    const csv  = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'laporan.csv'; a.click();
    URL.revokeObjectURL(url);
  };

<<<<<<< HEAD
=======
  const exportPDF = () => window.print();

>>>>>>> frontmoneflo
  const handleDelete = (id) => {
    if (window.confirm('Hapus transaksi ini?')) { deleteTransaction(id); showToast('Transaksi dihapus', 'info'); }
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
<<<<<<< HEAD
            <button type="button" onClick={() => window.print()}
=======
            <button type="button" onClick={exportPDF}
>>>>>>> frontmoneflo
              className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors">
              <i className="fas fa-file-pdf" /> PDF
            </button>
          </>
        }
      />

      {/* Charts + Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
<<<<<<< HEAD
        <div className="lg:col-span-2 card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
=======
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-neutral-light/30">
>>>>>>> frontmoneflo
          <h3 className="font-semibold text-primary mb-4">Visualisasi Arus Kas</h3>
          {hasChartData ? (
            <div className="h-72"><canvas ref={chartRef} /></div>
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-neutral">
              <i className="fas fa-chart-line text-4xl text-neutral-light mb-3" />
              <p className="font-semibold text-sm text-neutral-dark">Belum ada data transaksi</p>
              <p className="text-xs mt-1">Tambah transaksi untuk melihat grafik arus kas</p>
            </div>
          )}
        </div>

<<<<<<< HEAD
        <div className="card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
=======
        <div className="bg-white rounded-2xl p-5 border border-neutral-light/30">
>>>>>>> frontmoneflo
          <h3 className="font-semibold text-primary mb-4">Alokasi Pengeluaran</h3>
          {allocations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-neutral">
              <i className="fas fa-pie-chart text-3xl text-neutral-light mb-3" />
              <p className="text-xs font-semibold text-neutral-dark">Belum ada pengeluaran</p>
              <p className="text-[11px] mt-1">Data alokasi muncul dari transaksi pengeluaran</p>
            </div>
          ) : (
            <>
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
          )}
        </div>
      </div>

      <TableWrapper>
        <TransactionTable
          data={tableData}
          onEdit={(id) => onOpenModal('editTxn', id)}
          onDelete={handleDelete}
<<<<<<< HEAD
        />
      </TableWrapper>
=======
          onViewProof={(id) => onOpenModal('editTxn', id)}
        />
      </TableWrapper>

      {/* ── Hidden Print Layout ─────────────────────────────────── */}
      <div className="print-layout">
        {/* Header */}
        <div className="print-no-break" style={{ borderBottom: '3px solid #083D56', paddingBottom: 12, marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#083D56', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, flexShrink: 0 }}>
              {(state.profile?.name || 'O').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#083D56', lineHeight: 1.1 }}>{state.profile?.name || 'Nama Organisasi'}</div>
              <div style={{ fontSize: 9, color: '#546e7a', marginTop: 2 }}>{[state.profile?.type, state.profile?.email].filter(Boolean).join(' · ')}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#083D56' }}>Laporan Keuangan</div>
            <div style={{ fontSize: 9, color: '#546e7a', marginTop: 3 }}>Dicetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
        </div>

        {/* Ringkasan */}
        <div style={{ fontSize: 9, fontWeight: 700, color: '#083D56', textTransform: 'uppercase', letterSpacing: '.05em', margin: '14px 0 8px', borderLeft: '3px solid #00695C', paddingLeft: 8 }}>Ringkasan Keuangan</div>
        <div className="print-no-break" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 4 }}>
          {[{ label: 'Saldo Kas', val: stats.saldo, cls: '#083D56', note: 'Total saldo akumulatif' },
            { label: 'Total Pemasukan', val: stats.masuk, cls: '#00695C', note: `${stats.mp >= 0 ? '+' : ''}${stats.mp}% dari bulan lalu` },
            { label: 'Total Pengeluaran', val: stats.keluar, cls: '#c62828', note: `${stats.kp >= 0 ? '+' : ''}${stats.kp}% dari bulan lalu` }]
            .map(({ label, val, cls, note }) => (
              <div key={label} style={{ border: '1.5px solid #e0e7ef', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontSize: 7.5, fontWeight: 700, color: '#546e7a', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 3 }}>{label}</div>
                <div className="font-display" style={{ fontSize: 13, fontWeight: 800, color: cls }}>{formatRupiah(val)}</div>
                <div style={{ fontSize: 7.5, color: '#546e7a', marginTop: 2 }}>{note}</div>
              </div>
            ))}
        </div>

        {/* Alokasi */}
        {allocations.length > 0 && (
          <div className="print-no-break">
            <div style={{ fontSize: 9, fontWeight: 700, color: '#083D56', textTransform: 'uppercase', letterSpacing: '.05em', margin: '14px 0 8px', borderLeft: '3px solid #00695C', paddingLeft: 8 }}>Alokasi Pengeluaran per Kategori</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9 }}>
              <thead><tr style={{ background: '#00695C' }}>
                <th style={{ color: '#fff', padding: '6px 10px', textAlign: 'left', fontWeight: 600 }}>Kategori</th>
                <th style={{ color: '#fff', padding: '6px 10px', textAlign: 'right', fontWeight: 600 }}>Jumlah</th>
                <th style={{ color: '#fff', padding: '6px 10px', textAlign: 'right', fontWeight: 600 }}>%</th>
              </tr></thead>
              <tbody>
                {allocations.map((a, i) => {
                  const pct = totalAlloc > 0 ? Math.round(a.amount / totalAlloc * 100) : 0;
                  return (<tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                    <td style={{ padding: '5px 10px', borderBottom: '1px solid #eceff1' }}>{a.name}</td>
                    <td style={{ padding: '5px 10px', borderBottom: '1px solid #eceff1', textAlign: 'right' }}>{formatRupiah(a.amount)}</td>
                    <td style={{ padding: '5px 10px', borderBottom: '1px solid #eceff1', textAlign: 'right' }}>{pct}%</td>
                  </tr>);
                })}
                <tr style={{ background: '#f0f4f8', fontWeight: 700 }}>
                  <td style={{ padding: '5px 10px', borderTop: '2px solid #083D56' }}>Total</td>
                  <td style={{ padding: '5px 10px', borderTop: '2px solid #083D56', textAlign: 'right' }}>{formatRupiah(totalAlloc)}</td>
                  <td style={{ padding: '5px 10px', borderTop: '2px solid #083D56', textAlign: 'right' }}>100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Transaksi */}
        <div style={{ fontSize: 9, fontWeight: 700, color: '#083D56', textTransform: 'uppercase', letterSpacing: '.05em', margin: '14px 0 8px', borderLeft: '3px solid #00695C', paddingLeft: 8 }}>Riwayat Transaksi ({tableData.length} transaksi)</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 8.5 }}>
          <thead><tr style={{ background: '#083D56' }}>
            {['Tanggal', 'Keterangan', 'Kategori', 'Tipe', 'Jumlah', 'Status'].map((h) => (
              <th key={h} style={{ color: '#fff', padding: '6px 8px', textAlign: h === 'Jumlah' ? 'right' : h === 'Status' ? 'center' : 'left', fontWeight: 600, fontSize: 8 }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {tableData.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#90a4ae', padding: 16 }}>Tidak ada transaksi</td></tr>
            )}
            {tableData.map((t, i) => {
              const isM = t.type === 'pemasukan';
              const [y, m, d] = (t.date || '').split('-');
              return (<tr key={t.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #eceff1', whiteSpace: 'nowrap' }}>{d}/{m}/{y}</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #eceff1' }}>{t.desc}</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #eceff1' }}>{t.cat}</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #eceff1', color: isM ? '#00695C' : '#c62828', fontWeight: 600 }}>{isM ? 'Pemasukan' : 'Pengeluaran'}</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #eceff1', textAlign: 'right', color: isM ? '#00695C' : '#c62828', fontWeight: 600 }}>{isM ? '+' : '-'}{formatRupiah(t.amount)}</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #eceff1', textAlign: 'center' }}><span style={{ background: '#e0f2f1', color: '#00695C', padding: '2px 7px', borderRadius: 4, fontSize: 7.5 }}>SELESAI</span></td>
              </tr>);
            })}
            {tableData.length > 0 && [['Total Pemasukan', stats.masuk, '#00695C', '+'], ['Total Pengeluaran', stats.keluar, '#c62828', '-'], ['Saldo Akhir', stats.saldo, '#083D56', '']].map(([lbl, val, clr, pfx]) => (
              <tr key={lbl} style={{ background: '#f0f4f8', fontWeight: 700 }}>
                <td colSpan={4} style={{ padding: '5px 8px', borderTop: '2px solid #083D56' }}>{lbl}</td>
                <td style={{ padding: '5px 8px', borderTop: '2px solid #083D56', textAlign: 'right', color: clr }}>{pfx}{formatRupiah(val)}</td>
                <td style={{ borderTop: '2px solid #083D56' }} />
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ marginTop: 20, paddingTop: 8, borderTop: '1.5px solid #e0e7ef', display: 'flex', justifyContent: 'space-between', fontSize: 7.5, color: '#90a4ae' }}>
          <span>MoneFlo — Sistem Manajemen Keuangan Organisasi</span>
          <span>Dokumen ini dibuat otomatis · {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>
>>>>>>> frontmoneflo
    </div>
  );
}
