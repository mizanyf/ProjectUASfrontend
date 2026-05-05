import { formatRupiah, formatDate } from '../../utils/formatters';

export default function TransactionTable({ data, onEdit, onDelete }) {
  if (!data.length) {
    return (
      <tr>
        <td colSpan={7} className="px-5 py-8 text-center text-neutral text-sm">
          Tidak ada transaksi ditemukan
        </td>
      </tr>
    );
  }

  return data.map(t => {
    const isM = t.type === 'pemasukan';
    return (
      <tr key={t.id} className="border-t border-neutral-light/30 hover:bg-neutral-50/50 transition-colors">
        <td className="px-5 py-3 text-neutral whitespace-nowrap">{formatDate(t.date)}</td>
        <td className="px-5 py-3 text-neutral-dark font-medium">
          {t.desc}
          {t.docs?.length > 0 && (
            <span className="ml-1 inline-flex items-center text-[10px] text-neutral">
              <i className="fas fa-paperclip"></i>{t.docs.length}
            </span>
          )}
        </td>
        <td className="px-5 py-3">
          <span className="px-2.5 py-1 bg-neutral-50 rounded-md text-xs font-medium text-neutral-dark">{t.cat}</span>
        </td>
        <td className="px-5 py-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${isM ? 'text-tertiary' : 'text-red-500'}`}>
            <i className={`fas ${isM ? 'fa-arrow-down' : 'fa-arrow-up'} text-[10px]`}></i>
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
            <button type="button" onClick={() => onEdit(t)} className="text-neutral-light hover:text-primary transition-colors" title="Edit">
              <i className="fas fa-edit text-xs"></i>
            </button>
            <button type="button" onClick={() => onDelete(t.id)} className="text-neutral-light hover:text-red-500 transition-colors" title="Hapus">
              <i className="fas fa-trash-alt text-xs"></i>
            </button>
          </div>
        </td>
      </tr>
    );
  });
}

export function TransactionTableWrapper({ children }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-light/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50/80">
              {['Tanggal','Deskripsi','Kategori','Tipe','Jumlah','Status','Aksi'].map(h => (
                <th key={h} className={`px-5 py-3 font-semibold text-neutral text-xs uppercase tracking-wider ${h === 'Jumlah' ? 'text-right' : h === 'Status' || h === 'Aksi' ? 'text-center' : 'text-left'}`}>
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
