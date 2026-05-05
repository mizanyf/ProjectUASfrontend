import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useApp } from '../../context/AppContext';

export default function EditTransaksiModal({ isOpen, onClose, transaction }) {
  const { editTransaction } = useApp();
  const [form, setForm] = useState({ date: '', type: 'pemasukan', desc: '', cat: 'Operasional', amount: '', note: '' });

  useEffect(() => {
    if (transaction) setForm({ date: transaction.date || '', type: transaction.type || 'pemasukan', desc: transaction.desc || '', cat: transaction.cat || 'Operasional', amount: transaction.amount || '', note: transaction.note || '' });
  }, [transaction]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inputCls = "input-styled w-full px-4 py-2.5 border border-neutral-light rounded-xl text-sm outline-none transition-all";
  const labelCls = "block text-xs font-semibold text-neutral uppercase tracking-wider mb-1.5";

  const handleSave = () => {
    if (!form.desc.trim() || !form.amount || Number(form.amount) <= 0) return;
    editTransaction(transaction.id, { ...form, amount: Number(form.amount) });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Transaksi"
      footer={<>
        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-neutral-light rounded-xl text-sm font-semibold text-neutral-dark hover:bg-neutral-50 transition-colors">Batal</button>
        <button type="button" onClick={handleSave} className="flex-1 py-2.5 bg-tertiary text-white rounded-xl text-sm font-semibold hover:bg-tertiary-light transition-colors">Simpan Perubahan</button>
      </>}
    >
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Tanggal</label><input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inputCls} /></div>
          <div><label className={labelCls}>Tipe</label>
            <select value={form.type} onChange={e => set('type', e.target.value)} className={inputCls}>
              <option value="pemasukan">Pemasukan</option>
              <option value="pengeluaran">Pengeluaran</option>
            </select>
          </div>
        </div>
        <div><label className={labelCls}>Deskripsi</label><input type="text" value={form.desc} onChange={e => set('desc', e.target.value)} className={inputCls} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Kategori</label>
            <select value={form.cat} onChange={e => set('cat', e.target.value)} className={inputCls}>
              {['Operasional','Event','Sponsor','Logistik','Kepegawaian','Iuran','Lainnya'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label className={labelCls}>Jumlah (Rp)</label><input type="number" value={form.amount} onChange={e => set('amount', e.target.value)} className={inputCls} /></div>
        </div>
        <div><label className={labelCls}>Catatan (Opsional)</label><textarea rows={2} value={form.note} onChange={e => set('note', e.target.value)} className={`${inputCls} resize-none`} /></div>
      </div>
    </Modal>
  );
}
