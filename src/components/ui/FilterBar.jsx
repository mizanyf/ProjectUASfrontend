import { useApp } from '../../context/AppContext';

export default function FilterBar({ searchId, searchValue, onSearchChange }) {
  const { timeFilter, setTimeFilter, typeFilter, setTypeFilter,
    customStartDate, setCustomStartDate, customEndDate, setCustomEndDate } = useApp();

  const handlePreset = (t) => {
    setTimeFilter(t);
    setCustomStartDate(null);
    setCustomEndDate(null);
  };

  const handleCustomDate = (field, val) => {
    if (field === 'start') setCustomStartDate(val || null);
    else setCustomEndDate(val || null);
    if (val) setTimeFilter('custom');
  };

  return (
    <div className="flex flex-wrap items-center gap-2 no-print">
      <span className="text-xs text-neutral font-medium mr-1">
        <i className="fas fa-calendar-alt mr-1"></i>Periode:
      </span>
      <button
        type="button"
        onClick={() => handlePreset('bulan')}
        className={`filter-btn px-3 py-2 rounded-lg text-xs font-medium bg-neutral-50 text-neutral-dark hover:bg-neutral-100 transition-colors ${timeFilter === 'bulan' ? 'active-time' : ''}`}
      >Bulan Ini</button>
      <button
        type="button"
        onClick={() => handlePreset('semua')}
        className={`filter-btn px-3 py-2 rounded-lg text-xs font-medium bg-neutral-50 text-neutral-dark hover:bg-neutral-100 transition-colors ${timeFilter === 'semua' ? 'active-time' : ''}`}
      >Semua</button>

      <div className="flex items-center gap-2 border-l border-neutral-light pl-2 ml-1">
        <input
          type="date"
          value={customStartDate || ''}
          onChange={e => handleCustomDate('start', e.target.value)}
          className="px-2 py-2 border border-neutral-light rounded-lg text-xs text-neutral-dark outline-none focus:border-tertiary transition-colors w-32 sm:w-auto"
        />
        <span className="text-neutral-light text-xs">s/d</span>
        <input
          type="date"
          value={customEndDate || ''}
          onChange={e => handleCustomDate('end', e.target.value)}
          className="px-2 py-2 border border-neutral-light rounded-lg text-xs text-neutral-dark outline-none focus:border-tertiary transition-colors w-32 sm:w-auto"
        />
      </div>

      <span className="text-neutral-light mx-1">|</span>
      {['semua','pemasukan','pengeluaran'].map(tp => (
        <button
          key={tp}
          type="button"
          onClick={() => setTypeFilter(tp)}
          className={`filter-btn px-3 py-2 rounded-lg text-xs font-medium bg-neutral-50 text-neutral-dark hover:bg-neutral-100 transition-colors ${typeFilter === tp ? 'active-type' : ''}`}
        >
          {tp === 'semua' ? 'Semua' : tp === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
        </button>
      ))}

      <div className="ml-auto">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-light text-sm"></i>
          <input
            id={searchId}
            type="text"
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Cari..."
            className="pl-9 pr-4 py-2 border border-neutral-light rounded-lg text-sm outline-none focus:border-tertiary transition-colors w-36"
          />
        </div>
      </div>
    </div>
  );
}
