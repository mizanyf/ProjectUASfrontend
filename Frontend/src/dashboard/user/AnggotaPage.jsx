import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { getInitials } from '../../utils/formatters';

const MEMBER_COLORS = ['#083D56', '#00695C', '#546E7A', '#00897B', '#0C5272', '#78909C'];

export default function AnggotaPage({ onNavigate }) {
  const {
    state, addMember, deleteMember, toggleMemberPayment, toggleAllPayments,
    saveDuesSettings, recordAllDues,
  } = useApp();
  const showToast = useToast();

  const [form, setForm] = useState({ name: '', nim: '', phone: '' });
  const [duesDays,   setDuesDays]   = useState(state.duesSettings.interval);
  const [duesAmount, setDuesAmount] = useState(state.duesSettings.amount);

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleAddMember = () => {
    if (!form.name || !form.nim || !form.phone) { showToast('Lengkapi data anggota', 'error'); return; }
    const color = MEMBER_COLORS[Math.floor(Math.random() * MEMBER_COLORS.length)];
    addMember({ ...form, color, isPaid: false });
    setForm({ name: '', nim: '', phone: '' });
    showToast('Anggota berhasil ditambahkan', 'success');
  };

  const handleSaveDues = () => {
    if (!duesDays || duesDays <= 0) { showToast('Periode tidak valid', 'error'); return; }
    if (!duesAmount || duesAmount < 0) { showToast('Nominal tidak valid', 'error'); return; }
    saveDuesSettings({ interval: Number(duesDays), amount: Number(duesAmount) });
    showToast('Pengaturan iuran disimpan', 'success');
  };

  const handleRecordDues = () => {
    const hasChecked = state.members.some((m) => m.isPaid);
    if (!hasChecked) { showToast('Silakan pilih (centang) anggota terlebih dahulu', 'error'); return; }
    const count = state.members.filter((m) => m.isPaid).length;
    recordAllDues();
    showToast(`Berhasil mencatat iuran untuk ${count} anggota!`, 'success');
    setTimeout(() => onNavigate('laporan'), 400);
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus anggota ini?')) {
      deleteMember(id);
      showToast('Anggota dihapus', 'info');
    }
  };

  const paidCount = state.members.filter((m) => m.isPaid).length;

  return (
    <div className="page-enter space-y-6">
      {/* Dues Settings */}
      <div className="card-hover bg-white rounded-2xl p-6 border border-neutral-light/30">
        <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
          <i className="fas fa-cogs text-secondary" /> Pengaturan Iuran Kas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-neutral uppercase tracking-wider mb-1.5">Periode (Hari)</label>
            <input type="number" value={duesDays} onChange={(e) => setDuesDays(e.target.value)}
              className="input-styled w-full px-4 py-2.5 border border-neutral-light rounded-xl text-sm outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral uppercase tracking-wider mb-1.5">Nominal (Rp)</label>
            <input type="number" value={duesAmount} onChange={(e) => setDuesAmount(e.target.value)}
              className="input-styled w-full px-4 py-2.5 border border-neutral-light rounded-xl text-sm outline-none transition-all" />
          </div>
        </div>
        <button type="button" onClick={handleSaveDues}
          className="px-6 py-2.5 bg-secondary text-white rounded-xl text-sm font-semibold hover:bg-secondary-dark transition-colors">
          <i className="fas fa-save mr-2" />Simpan Pengaturan Iuran
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Member Form */}
        <div className="card-hover bg-white rounded-2xl p-6 border border-neutral-light/30">
          <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
            <i className="fas fa-user-plus text-tertiary" /> Tambah Anggota
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Nama Lengkap', key: 'name', placeholder: 'Nama anggota', type: 'text' },
              { label: 'NIM', key: 'nim', placeholder: 'Nomor Induk Mahasiswa', type: 'text' },
              { label: 'No. Telepon', key: 'phone', placeholder: '08xxxxxxxxxx', type: 'tel' },
            ].map(({ label, key, placeholder, type }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-neutral uppercase tracking-wider mb-1.5">{label}</label>
                <input type={type} placeholder={placeholder} value={form[key]} onChange={setF(key)}
                  className="input-styled w-full px-4 py-2.5 border border-neutral-light rounded-xl text-sm outline-none transition-all" />
              </div>
            ))}
            <button type="button" onClick={handleAddMember}
              className="w-full py-2.5 bg-tertiary text-white rounded-xl text-sm font-semibold hover:bg-tertiary-light transition-colors">
              Tambah Anggota
            </button>
          </div>
        </div>

        {/* Member List */}
        <div className="lg:col-span-2 card-hover bg-white rounded-2xl p-6 border border-neutral-light/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary">Daftar Anggota</h3>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => toggleAllPayments(true)}
                className="text-xs text-tertiary hover:text-tertiary-dark underline">Centang Semua</button>
              <span className="text-neutral-light">|</span>
              <button type="button" onClick={() => toggleAllPayments(false)}
                className="text-xs text-red-500 hover:text-red-600 underline">Batal Centang</button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="border-b border-neutral-light">
                  {['Nama', 'NIM', 'Telepon', 'Status Bayar', 'Aksi'].map((h) => (
                    <th key={h} className={`${h === 'Status Bayar' || h === 'Aksi' ? 'text-center' : 'text-left'} py-3 px-2 font-semibold text-neutral text-xs uppercase tracking-wider`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {state.members.length === 0 ? (
                  <tr><td colSpan="5" className="py-8 text-center text-neutral text-sm">Belum ada anggota</td></tr>
                ) : state.members.map((m) => (
                  <tr key={m.id} className="member-row border-b border-neutral-light/30 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="member-avatar" style={{ background: m.color, width: 32, height: 32, fontSize: 10 }}>
                          {getInitials(m.name)}
                        </div>
                        <span className="font-medium text-neutral-dark text-sm">{m.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-neutral">{m.nim}</td>
                    <td className="py-3 px-2 text-sm text-neutral">{m.phone}</td>
                    <td className="py-3 px-2 text-center">
                      <input type="checkbox" className="w-5 h-5 accent-tertiary cursor-pointer"
                        checked={m.isPaid} onChange={() => toggleMemberPayment(m.id)} />
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button type="button" onClick={() => handleDelete(m.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Hapus Anggota">
                        <i className="fas fa-trash-alt text-xs" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-light/50 flex justify-between items-center">
            <div className="text-xs text-neutral">
              Sudah membayar: <span className="font-bold text-tertiary">{paidCount}</span> / <span>{state.members.length}</span>
            </div>
            <button type="button" onClick={handleRecordDues}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-tertiary to-teal-600 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              <i className="fas fa-hand-holding-usd" /> Catat Iuran Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
