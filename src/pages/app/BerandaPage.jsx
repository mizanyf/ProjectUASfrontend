import { useEffect, useRef, useState } from 'react';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDate } from '../../utils/formatters';
import AgendaModal from '../../components/modals/AgendaModal';
import EditRealisasiModal from '../../components/modals/EditRealisasiModal';

Chart.register(BarController, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

export default function BerandaPage() {
  const { getStats, getFilteredTransactions, programs, agendas, deleteAgenda, navigateTo } = useApp();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [showAgenda, setShowAgenda] = useState(false);
  const [editAgendaItem, setEditAgendaItem] = useState(null);
  const [showEditReal, setShowEditReal] = useState(false);

  const { saldo, masuk, keluar, mp, kp } = getStats();
  const { filtered } = getFilteredTransactions();
  const recent = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const COLORS = ['#00695C','#083D56','#00897B','#546E7A','#78909C','#0C5272'];

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
    // Small delay to ensure canvas is free in StrictMode
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
        plugins: { legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'rectRounded', padding: 16, font: { family: 'Plus Jakarta Sans', size: 12 } } } },
        scales: {
          y: { beginAtZero: true, max: 10000000, ticks: { callback: v => 'Rp'+(v/1000000).toFixed(0)+'jt', font: { family: 'Space Grotesk', size: 11 }, color: '#767779', stepSize: 2000000 }, grid: { color: 'rgba(118,119,121,0.1)' } },
          x: { ticks: { font: { family: 'Plus Jakarta Sans', size: 12 }, color: '#424242' }, grid: { display: false } },
        },
      },
    });
    }, 0);
    return () => {
      clearTimeout(timeout);
      if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null; }
    };
  }, []);

  const today = new Date();
  const diffDays = d => Math.ceil((new Date(d) - today) / 86400000);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Saldo Kas Organisasi', val: saldo, icon: 'fa-wallet', iconBg: 'bg-primary/10', color: 'text-primary-dark', sub: 'Total Saldo Akumulatif', subIcon: 'fa-wallet' },
          { label: 'Pemasukan', val: masuk, icon: 'fa-arrow-circle-down', iconBg: 'bg-tertiary/10', color: 'text-tertiary', sub: `${mp >= 0 ? '+' : ''}${mp}% dari Bulan Lalu`, subIcon: `fa-arrow-${mp >= 0 ? 'up' : 'down'}` },
          { label: 'Pengeluaran', val: keluar, icon: 'fa-arrow-circle-up', iconBg: 'bg-red-50', color: 'text-red-500', sub: `${kp >= 0 ? '+' : ''}${kp}% dari Bulan Lalu`, subIcon: `fa-arrow-${kp >= 0 ? 'up' : 'down'}` },
        ].map(c => (
          <div key={c.label} className="card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral uppercase tracking-wider">{c.label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.iconBg}`}><i className={`fas ${c.icon} text-sm ${c.color}`}></i></div>
            </div>
            <p className={`font-display font-bold text-2xl stat-number ${c.color}`}>{formatRupiah(c.val)}</p>
            <p className={`text-xs mt-1 ${c.color}`}><i className={`fas ${c.subIcon} mr-1`}></i>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + Realisasi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
          <h3 className="font-semibold text-primary mb-4 text-sm">Pemasukan & Pengeluaran 6 Bulan Terakhir</h3>
          <div className="h-64"><canvas ref={chartRef}></canvas></div>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary text-sm">Realisasi Anggaran</h3>
            <button type="button" onClick={() => setShowEditReal(true)} className="text-[11px] text-tertiary font-semibold hover:text-tertiary-dark flex items-center gap-1"><i className="fas fa-pen text-[9px]"></i> Revisi</button>
          </div>
          <div className="space-y-3">
            {programs.map((p, i) => {
              const clr = COLORS[i % COLORS.length];
              return (
                <div key={p.name} className="prog-row flex items-center gap-3 p-2.5 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-neutral-dark font-medium truncate">{p.name}</span>
                      <span className="text-[11px] font-semibold flex-shrink-0 ml-2" style={{ color: clr }}>{p.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="progress-fill h-full rounded-full" style={{ width: `${p.progress}%`, background: clr }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Txn + Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary text-sm">Transaksi Terakhir</h3>
            <button type="button" onClick={() => navigateTo('transaksi')} className="text-xs text-tertiary font-semibold hover:text-tertiary-dark">Lihat Semua</button>
          </div>
          <div className="space-y-3">
            {recent.length === 0 && <p className="text-sm text-neutral text-center py-4">Belum ada transaksi bulan ini</p>}
            {recent.map(t => {
              const isM = t.type === 'pemasukan';
              return (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isM ? 'bg-tertiary-50' : 'bg-red-50'}`}>
                    <i className={`fas ${isM ? 'fa-arrow-down text-tertiary' : 'fa-arrow-up text-red-400'} text-sm`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-dark truncate">{t.desc}</p>
                    <p className="text-xs text-neutral">{formatDate(t.date)}</p>
                  </div>
                  <p className={`font-display font-semibold text-sm flex-shrink-0 ${isM ? 'text-tertiary' : 'text-red-500'}`}>{isM ? '+' : '-'}{formatRupiah(t.amount)}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary text-sm">Agenda Pembayaran</h3>
            <button type="button" onClick={() => { setEditAgendaItem(null); setShowAgenda(true); }} className="w-7 h-7 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary hover:bg-tertiary/20 transition-colors"><i className="fas fa-plus text-xs"></i></button>
          </div>
          <div className="space-y-2">
            {agendas.length === 0 && <p className="text-sm text-neutral text-center py-4">Belum ada agenda</p>}
            {agendas.map(a => {
              const diff = diffDays(a.date);
              const urgent = diff <= 3;
              return (
                <div key={a.id} className="agenda-item flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${urgent ? 'bg-red-50' : 'bg-primary-50'}`}>
                    <i className={`fas fa-calendar-alt text-sm ${urgent ? 'text-red-400' : 'text-primary'}`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-dark truncate">{a.name}</p>
                    <p className="text-xs text-neutral">{formatRupiah(a.amount)}</p>
                  </div>
                  <div className="text-right flex-shrink-0 agenda-actions flex gap-1">
                    <button type="button" onClick={() => { setEditAgendaItem(a); setShowAgenda(true); }} className="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-light hover:text-primary transition-colors"><i className="fas fa-edit text-xs"></i></button>
                    <button type="button" onClick={() => deleteAgenda(a.id)} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-neutral-light hover:text-red-500 transition-colors"><i className="fas fa-trash-alt text-xs"></i></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AgendaModal isOpen={showAgenda} onClose={() => setShowAgenda(false)} editItem={editAgendaItem} />
      <EditRealisasiModal isOpen={showEditReal} onClose={() => setShowEditReal(false)} />
    </div>
  );
}
