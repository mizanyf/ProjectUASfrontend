import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useApp } from '../../context/AppContext';
import { getTodayISO } from '../../utils/formatters';

export default function AgendaModal({ isOpen, onClose, editItem }) {
  const { addAgenda, editAgenda } = useApp();
  const [form, setForm] = useState({ name: '', amount: '', date: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inputCls = "input-styled w-full px-4 py-2.5 border border-neutral-light rounded-xl text-sm outline-none transition-all";
  const labelCls = "block text-xs font-semibold text-neutral uppercase tracking-wider mb-1.5";

  useEffect(() => {
    if (editItem) setForm({ name: editItem.name, amount: editItem.amount, date: editItem.date });
    else setForm({ name: '', amount: '', date: '' });
  }, [editItem, isOpen]);

  const handleSave = () => {
    if (!form.name.trim() || !form.amount || !form.date) return;
    if (editItem) editAgenda(editItem.id, { name: form.name.trim(), amount: Number(form.amount), date: form.date });
    else addAgenda({ name: form.name.trim(), amount: Number(form.amount), date: form.date });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editItem ? 'Edit Agenda' : 'Tambah Agenda'} maxWidth="max-w-sm"
      footer={<>
        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-neutral-light rounded-xl text-sm font-semibold text-neutral-dark hover:bg-neutral-50 transition-colors">Batal</button>
        <button type="button" onClick={handleSave} className="flex-1 py-2.5 bg-tertiary text-white rounded-xl text-sm font-semibold hover:bg-tertiary-light transition-colors">Simpan</button>
      </>}
    >
      <div className="p-5 space-y-4">
        <div><label className={labelCls}>Nama Pembayaran</label><input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Contoh: Sewa Aula" className={inputCls} /></div>
        <div><label className={labelCls}>Jumlah (Rp)</label><input type="number" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0" className={inputCls} /></div>
        <div><label className={labelCls}>Tanggal Jatuh Tempo</label><input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inputCls} /></div>
      </div>
    </Modal>
  );
}
