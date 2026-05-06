import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useFilters } from '../../hooks/useFilters';
import { StatCards, FilterBar, TransactionTable, TableWrapper } from './shared';
import { useToast } from '../../context/ToastContext';

export default function TransaksiPage({ onOpenModal }) {
  const { deleteTransaction } = useApp();
  const showToast = useToast();
  const filters = useFilters();

  const stats    = filters.getStats();
  const tableData = filters.getTableData();

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
      />

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
