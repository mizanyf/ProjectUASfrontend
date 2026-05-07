import { useState, useRef, useEffect } from 'react';
import { formatRupiah, formatDate } from '../../utils/formatters';

/* ─── Inline mini date picker used in FilterBar ─────────────────────────── */
function MiniDatePicker({ value, onChange, placeholder = 'dd/mm/yyyy' }) {
  const formatForDisplay = (v) => {
    if (!v) return '';
    const [y, m, d] = v.split('-');
    return `${d}/${m}/${y}`;
  };
  const getTodayDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };

  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) { const [y, m] = value.split('-'); return new Date(parseInt(y), parseInt(m)-1, 1); }
    return new Date();
  });
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDay    = (y, m) => new Date(y, m, 1).getDay();

  const handleSelect = (day) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const sel = `${year}-${month}-${String(day).padStart(2,'0')}`;
    onChange(sel);
    setOpen(false);
  };

  const changeMonth = (inc) =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + inc, 1));

  const monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const year  = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const days  = [];
  for (let i = 0; i < getFirstDay(year, month); i++) days.push(<div key={`e${i}`} />);
  const today = getTodayDate();
  for (let d = 1; d <= getDaysInMonth(year, month); d++) {
    const cur  = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isSel = cur === value;
    const isTod = cur === today;
    days.push(
      <button key={d} onClick={() => handleSelect(d)}
        className={`h-7 w-7 rounded-md text-xs font-medium transition-all mx-auto flex items-center justify-center
          ${isSel ? 'bg-tertiary text-white' : 'hover:bg-neutral-50 text-neutral-dark'}
          ${isTod && !isSel ? 'border border-tertiary text-tertiary' : ''}`}>
        {d}
      </button>
    );
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <input
          type="text"
          readOnly
          value={formatForDisplay(value)}
          onClick={() => setOpen(o => !o)}
          placeholder={placeholder}
          className="input-styled px-2 py-2 pr-7 border border-neutral-light rounded-lg text-xs text-neutral-dark outline-none focus:border-tertiary transition-colors w-32 sm:w-auto cursor-pointer bg-white"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-light pointer-events-none">
          <i className="fas fa-calendar-alt text-xs" />
        </div>
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-[9999] bg-white border border-neutral-light/50 rounded-xl p-3 w-64"
          style={{ boxShadow: '0 8px 24px rgba(8,61,86,0.12)' }}>
          {/* Month nav */}
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => changeMonth(-1)} className="w-6 h-6 rounded-md hover:bg-neutral-50 flex items-center justify-center text-neutral">
              <i className="fas fa-chevron-left text-[10px]" />
            </button>
            <span className="text-xs font-semibold text-neutral-dark">{monthNames[month]} {year}</span>
            <button onClick={() => changeMonth(1)} className="w-6 h-6 rounded-md hover:bg-neutral-50 flex items-center justify-center text-neutral">
              <i className="fas fa-chevron-right text-[10px]" />
            </button>
          </div>
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {['Mi','Se','Se','Ra','Ka','Ju','Sa'].map((d, i) => (
              <div key={i} className="text-center text-[10px] font-medium text-neutral py-1">{d}</div>
            ))}
          </div>
          {/* Days */}
          <div className="grid grid-cols-7 gap-0.5">{days}</div>
          {/* Actions */}
          <div className="flex gap-1.5 mt-2 pt-2 border-t border-neutral-light/40">
            <button onClick={() => { onChange(''); setOpen(false); }}
              className="flex-1 py-1.5 text-[11px] font-medium text-neutral-dark hover:bg-neutral-50 rounded-md transition-colors">
              Hapus
            </button>
            <button onClick={() => { onChange(today); setOpen(false); }}
              className="flex-1 py-1.5 text-[11px] font-medium bg-tertiary text-white rounded-md hover:bg-tertiary-light transition-colors">
              Hari ini
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Shared FilterBar used in Transaksi and Laporan pages
 */
export function FilterBar({ timeFilter, typeFilter, customStart, customEnd, search, onSwitchTime, onSetType, onCustomDate, onSearch, pageKey, extraRight }) {
  return (
    <div className="flex flex-wrap items-center gap-2 no-print">
      <span className="text-xs text-neutral font-medium mr-1">
        <i className="fas fa-calendar-alt mr-1" />Periode:
      </span>

      <button type="button" onClick={() => onSwitchTime('bulan')}
        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${timeFilter === 'bulan' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-neutral-50 text-neutral-dark hover:bg-neutral-100'}`}>
        Bulan Ini
      </button>
      <button type="button" onClick={() => onSwitchTime('semua')}
        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${timeFilter === 'semua' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-neutral-50 text-neutral-dark hover:bg-neutral-100'}`}>
        Semua
      </button>

      {/* Custom date range — now using MiniDatePicker */}
      <div className="flex items-center gap-2 border-l border-neutral-light pl-2 ml-1">
        <MiniDatePicker
          value={customStart}
          onChange={(val) => onCustomDate(val, customEnd)}
          placeholder="Mulai"
        />
        <span className="text-neutral-light text-xs">s/d</span>
        <MiniDatePicker
          value={customEnd}
          onChange={(val) => onCustomDate(customStart, val)}
          placeholder="Selesai"
        />
      </div>

      <span className="text-neutral-light mx-1">|</span>

      {['semua', 'pemasukan', 'pengeluaran'].map((t) => (
        <button key={t} type="button" onClick={() => onSetType(t)}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${typeFilter === t ? 'bg-tertiary text-white shadow-md shadow-tertiary/20' : 'bg-neutral-50 text-neutral-dark hover:bg-neutral-100'}`}>
          {t === 'semua' ? 'Semua' : t === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
        </button>
      ))}

      <div className="ml-auto flex items-center gap-2">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-light text-sm" />
          <input type="text" placeholder="Cari..." value={search} onChange={(e) => onSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-neutral-light rounded-lg text-sm outline-none focus:border-tertiary transition-colors w-36" />
        </div>
        {extraRight}
      </div>
    </div>
  );
}

/**
 * Shared StatCards for Beranda, Transaksi, Laporan
 */
export function StatCards({ stats }) {
  const { saldo, masuk, keluar, mp, kp } = stats;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-neutral uppercase tracking-wider">Saldo Kas Organisasi</span>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${saldo < 0 ? 'bg-red-50' : 'bg-primary/10'}`}>
            <i className={`fas fa-wallet text-sm ${saldo < 0 ? 'text-red-500' : 'text-primary'}`} />
          </div>
        </div>
        <p className={`font-display font-bold text-2xl stat-number ${saldo < 0 ? 'text-red-500' : 'text-primary-dark'}`}>{formatRupiah(saldo)}</p>
        <p className={`text-xs mt-1 ${saldo < 0 ? 'text-red-400' : 'text-tertiary'}`}>
          <i className={`fas ${saldo < 0 ? 'fa-exclamation-circle' : 'fa-wallet'} mr-1`} />
          {saldo < 0 ? 'Saldo Minus — Periksa Pengeluaran' : 'Total Saldo Akumulatif'}
        </p>
      </div>


      <div className="card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-neutral uppercase tracking-wider">Pemasukan</span>
          <div className="w-9 h-9 rounded-lg bg-tertiary/10 flex items-center justify-center">
            <i className="fas fa-arrow-circle-down text-tertiary text-sm" />
          </div>
        </div>
        <p className="font-display font-bold text-2xl text-tertiary stat-number">{formatRupiah(masuk)}</p>
        <p className="text-xs text-tertiary mt-1">
          <i className={`fas fa-arrow-${mp >= 0 ? 'up' : 'down'} mr-1`} />
          {mp >= 0 ? '+' : ''}{mp}% dari Bulan Lalu
        </p>
      </div>

      <div className="card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-neutral uppercase tracking-wider">Pengeluaran</span>
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
            <i className="fas fa-arrow-circle-up text-red-400 text-sm" />
          </div>
        </div>
        <p className="font-display font-bold text-2xl text-red-500 stat-number">{formatRupiah(keluar)}</p>
        <p className="text-xs text-red-500 mt-1">
          <i className={`fas fa-arrow-${kp >= 0 ? 'up' : 'down'} mr-1`} />
          {kp >= 0 ? '+' : ''}{kp}% dari Bulan Lalu
        </p>
      </div>
    </div>
  );
}

/**
 * Shared Transaction Table Body
 */
export function TransactionTable({ data, onEdit, onDelete }) {
  if (!data.length) {
    return (
      <tr>
        <td colSpan="7" className="px-5 py-8 text-center text-neutral text-sm">Tidak ada transaksi ditemukan</td>
      </tr>
    );
  }
  return data.map((t) => {
    const isM = t.type === 'pemasukan';
    return (
      <tr key={t.id} className="border-t border-neutral-light/30 hover:bg-neutral-50/50 transition-colors">
        <td className="px-5 py-3 text-neutral whitespace-nowrap">{formatDate(t.date)}</td>
        <td className="px-5 py-3 text-neutral-dark font-medium">
          {t.desc}
          {t.docs?.length > 0 && (
            <span className="ml-1 inline-flex items-center text-[10px] text-neutral cursor-help" title={t.docs.join(', ')}>
              <i className="fas fa-paperclip" />{t.docs.length}
            </span>
          )}
        </td>
        <td className="px-5 py-3">
          <span className="px-2.5 py-1 bg-neutral-50 rounded-md text-xs font-medium text-neutral-dark">{t.cat}</span>
        </td>
        <td className="px-5 py-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${isM ? 'text-tertiary' : 'text-red-500'}`}>
            <i className={`fas ${isM ? 'fa-arrow-down' : 'fa-arrow-up'} text-[10px]`} />
            {isM ? 'Masuk' : 'Keluar'}
          </span>
        </td>
        <td className={`px-5 py-3 text-right font-display font-semibold ${isM ? 'text-tertiary' : 'text-red-500'}`}>
          {isM ? '+' : '-'}{formatRupiah(t.amount)}
        </td>
        <td className="px-5 py-3 text-center">
          <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold bg-tertiary-50 text-tertiary">SELESAI</span>
        </td>
        <td className="px-5 py-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <button type="button" onClick={() => onEdit(t.id)} className="text-neutral-light hover:text-primary transition-colors" title="Edit">
              <i className="fas fa-edit text-xs" />
            </button>
            <button type="button" onClick={() => onDelete(t.id)} className="text-neutral-light hover:text-red-500 transition-colors" title="Hapus">
              <i className="fas fa-trash-alt text-xs" />
            </button>
          </div>
        </td>
      </tr>
    );
  });
}

export function TableWrapper({ children }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-light/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50/80">
              {['Tanggal', 'Deskripsi', 'Kategori', 'Tipe', 'Jumlah', 'Status', 'Aksi'].map((h) => (
                <th key={h} className={`${h === 'Jumlah' ? 'text-right' : h === 'Status' || h === 'Aksi' ? 'text-center' : 'text-left'} px-5 py-3 font-semibold text-neutral text-xs uppercase tracking-wider`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}
