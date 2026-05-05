import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import FilterBar from '../../components/ui/FilterBar';
import TransactionTable, { TransactionTableWrapper } from '../../components/ui/TransactionTable';
import EditTransaksiModal from '../../components/modals/EditTransaksiModal';

export default function TransaksiPage() {
  const { getStats, getFilteredTransactions, typeFilter, deleteTransaction } = useApp();
  const [search, setSearch] = useState('');
  const [editTxn, setEditTxn] = useState(null);

  const { saldo, masuk, keluar, mp, kp } = getStats();
  const { filtered } = getFilteredTransactions();

  let tableData = typeFilter !== 'semua' ? filtered.filter(t => t.type === typeFilter) : [...filtered];
  if (search) tableData = tableData.filter(t => t.desc.toLowerCase().includes(search.toLowerCase()) || t.cat.toLowerCase().includes(search.toLowerCase()));
  tableData.sort((a, b) => new Date(b.date) - new Date(a.date));

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

      <FilterBar searchValue={search} onSearchChange={setSearch} />

      <TransactionTableWrapper>
        <TransactionTable data={tableData} onEdit={t => setEditTxn(t)} onDelete={deleteTransaction} />
      </TransactionTableWrapper>

      <EditTransaksiModal isOpen={!!editTxn} onClose={() => setEditTxn(null)} transaction={editTxn} />
    </div>
  );
}
