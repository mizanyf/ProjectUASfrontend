import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getInitials } from '../../utils/formatters';

export default function AnggotaPage() {
  const { members, duesSettings, setDuesSettings, addMember, deleteMember, toggleMemberPayment, toggleAllPayments, recordAllDues, showToast } = useApp();
  const [form, setForm] = useState({ name: '', nim: '', phone: '' });
  const [duesForm, setDuesForm] = useState({ interval: duesSettings.interval, amount: duesSettings.amount });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inputCls = "input-styled w-full px-4 py-2.5 border border-neutral-light rounded-xl text-sm outline-none transition-all";
  const labelCls = "block text-xs font-semibold text-neutral uppercase tracking-wider mb-1.5";

  const handleAddMember = () => {
    if (!form.name.trim() || !form.nim.trim() || !form.phone.trim()) { showToast('Lengkapi data anggota', 'error'); return; }
    addMember({ name: form.name.trim(), nim: form.nim.trim(), phone: form.phone.trim() });
    setForm({ name: '', nim: '', phone: '' });
  };

  const handleSaveDues = () => {
    const days = parseInt(duesForm.interval), amt = parseInt(duesForm.amount);
    if (!days || days <= 0) { showToast('Periode tidak valid', 'error'); return; }
    if (!amt || amt < 0) { showToast('Nominal tidak valid', 'error'); return; }
    setDuesSettings({ interval: days, amount: amt });
    showToast('Pengaturan iuran disimpan', 'success');
  };

  const paidCount = members.filter(m => m.isPaid).length;

  return (
    <div className="space-y-6">
      {/* Pengaturan Iuran */}
      <div className="card-hover bg-white rounded-2xl p-6 border border-neutral-light/30">
        <h3 className="font-semibold text-primary mb-4 flex items-center gap-2"><i className="fas fa-cogs text-secondary"></i> Pengaturan Iuran Kas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelCls}>Periode (Hari)</label>
            <input type="number" value={duesForm.interval} onChange={e => setDuesForm(p => ({ ...p, interval: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Nominal (Rp)</label>
            <input type="number" value={duesForm.amount} onChange={e => setDuesForm(p => ({ ...p, amount: e.target.value }))} className={inputCls} />
          </div>
        </div>
        <button type="button" onClick={handleSaveDues} className="px-6 py-2.5 bg-secondary text-white rounded-xl text-sm font-semibold hover:bg-secondary-dark transition-colors">
          <i className="fas fa-save mr-2"></i>Simpan Pengaturan Iuran
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tambah */}
        <div className="card-hover bg-white rounded-2xl p-6 border border-neutral-light/30">
          <h3 className="font-semibold text-primary mb-4 flex items-center gap-2"><i className="fas fa-user-plus text-tertiary"></i> Tambah Anggota</h3>
          <div className="space-y-4">
            <div><label className={labelCls}>Nama Lengkap</label><input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nama anggota" className={inputCls} /></div>
            <div><label className={labelCls}>NIM</label><input type="text" value={form.nim} onChange={e => set('nim', e.target.value)} placeholder="Nomor Induk Mahasiswa" className={inputCls} /></div>
            <div><label className={labelCls}>No. Telepon</label><input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="08xxxxxxxxxx" className={inputCls} /></div>
            <button type="button" onClick={handleAddMember} className="w-full py-2.5 bg-tertiary text-white rounded-xl text-sm font-semibold hover:bg-tertiary-light transition-colors">Tambah Anggota</button>
          </div>
        </div>

        {/* Daftar Anggota */}
        <div className="lg:col-span-2 card-hover bg-white rounded-2xl p-6 border border-neutral-light/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary">Daftar Anggota</h3>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => toggleAllPayments(true)} className="text-xs text-tertiary hover:text-tertiary-dark underline">Centang Semua</button>
              <span className="text-neutral-light">|</span>
              <button type="button" onClick={() => toggleAllPayments(false)} className="text-xs text-red-500 hover:text-red-600 underline">Batal Centang</button>
            </div>
          </div>
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="border-b border-neutral-light">
                  {['Nama','NIM','Telepon','Status Bayar','Aksi'].map(h => (
                    <th key={h} className={`py-3 px-2 font-semibold text-neutral text-xs uppercase tracking-wider ${h === 'Status Bayar' || h === 'Aksi' ? 'text-center' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-neutral text-sm">Belum ada anggota</td></tr>
                ) : members.map(m => (
                  <tr key={m.id} className="member-row border-b border-neutral-light/30">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="member-avatar" style={{ background: m.color, width: 32, height: 32, fontSize: 10 }}>{getInitials(m.name)}</div>
                        <span className="font-medium text-neutral-dark text-sm">{m.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-neutral">{m.nim}</td>
                    <td className="py-3 px-2 text-sm text-neutral">{m.phone}</td>
                    <td className="py-3 px-2 text-center">
                      <input type="checkbox" checked={m.isPaid} onChange={() => toggleMemberPayment(m.id)} className="w-5 h-5 accent-tertiary cursor-pointer" />
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button type="button" onClick={() => deleteMember(m.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Hapus">
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 pt-6 border-t border-neutral-light/50 flex justify-between items-center">
            <div className="text-xs text-neutral">
              Sudah membayar: <span className="font-bold text-tertiary">{paidCount}</span> / <span>{members.length}</span>
            </div>
            <button type="button" onClick={recordAllDues} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-tertiary to-teal-600 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              <i className="fas fa-hand-holding-usd"></i> Catat Iuran Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
