import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getMemberPeriodStatus } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { getInitials } from '../../utils/formatters';

const MEMBER_COLORS = ['#083D56', '#00695C', '#546E7A', '#00897B', '#0C5272', '#78909C'];

/* ── Status config ─────────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  recorded: {
    label: 'Sudah Dicatat',
    badgeClass: 'bg-gray-100 text-gray-500 border border-gray-200',
    rowClass: 'bg-gray-50 opacity-75',
    icon: 'fa-check-circle',
    iconColor: 'text-gray-400',
    tooltip: 'Iuran sudah dicatat untuk periode ini',
  },
  overdue: {
    label: 'Terlambat',
    badgeClass: 'bg-red-50 text-red-600 border border-red-200',
    rowClass: 'bg-red-50/60',
    icon: 'fa-exclamation-circle',
    iconColor: 'text-red-500',
    tooltip: 'Periode iuran telah lewat dan belum dibayar',
  },
  pending: {
    label: 'Belum Bayar',
    badgeClass: 'bg-amber-50 text-amber-600 border border-amber-200',
    rowClass: '',
    icon: 'fa-clock',
    iconColor: 'text-amber-500',
    tooltip: 'Belum membayar iuran periode ini',
  },
};

/* ── Format date helper ─────────────────────────────────────────────────── */
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ── Period info helper ─────────────────────────────────────────────────── */
function getPeriodInfo(duesPeriodStart, duesSettings) {
  if (!duesPeriodStart) return null;
  const start = new Date(duesPeriodStart);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + duesSettings.interval - 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isActive = today <= end;
  const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return { start, end, isActive, daysLeft };
}

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
    const eligibleChecked = state.members.filter((m) => {
      const st = getMemberPeriodStatus(m, state.duesSettings, state.duesPeriodStart);
      return m.isPaid && st !== 'recorded';
    });
    if (!eligibleChecked.length) {
      showToast('Silakan pilih (centang) anggota terlebih dahulu', 'error');
      return;
    }
    recordAllDues();
    showToast(`Berhasil mencatat iuran untuk ${eligibleChecked.length} anggota!`, 'success');
    setTimeout(() => onNavigate('laporan'), 400);
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus anggota ini?')) {
      deleteMember(id);
      showToast('Anggota dihapus', 'info');
    }
  };

  // Derive per-member statuses
  const membersWithStatus = state.members.map((m) => ({
    ...m,
    _status: getMemberPeriodStatus(m, state.duesSettings, state.duesPeriodStart),
  }));

  const periodInfo = getPeriodInfo(state.duesPeriodStart, state.duesSettings);
  const recordedCount = membersWithStatus.filter((m) => m._status === 'recorded').length;
  const overdueCount  = membersWithStatus.filter((m) => m._status === 'overdue').length;
  const checkedCount  = state.members.filter((m) => m.isPaid).length;

  return (
    <div className="page-enter space-y-6">

      {/* ── Period Status Banner ─────────────────────────────────────────── */}
      {periodInfo && (
        <div className={`rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 border ${
          periodInfo.isActive
            ? 'bg-teal-50 border-teal-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
            periodInfo.isActive ? 'bg-teal-100' : 'bg-red-100'
          }`}>
            <i className={`fas ${periodInfo.isActive ? 'fa-calendar-check text-teal-600' : 'fa-calendar-times text-red-500'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm ${periodInfo.isActive ? 'text-teal-800' : 'text-red-700'}`}>
              {periodInfo.isActive ? 'Periode Iuran Aktif' : 'Periode Iuran Berakhir'}
            </p>
            <p className={`text-xs mt-0.5 ${periodInfo.isActive ? 'text-teal-600' : 'text-red-500'}`}>
              {formatDate(state.duesPeriodStart)} – {formatDate(periodInfo.end.toISOString().split('T')[0])}
              {periodInfo.isActive
                ? ` · Sisa ${periodInfo.daysLeft} hari`
                : ' · Harap segera catat iuran baru'}
            </p>
          </div>
          <div className="flex gap-3 text-center">
            <div className="bg-white/70 rounded-xl px-4 py-2 border border-teal-200/50">
              <p className="text-lg font-bold text-teal-700">{recordedCount}</p>
              <p className="text-xs text-teal-600">Sudah Bayar</p>
            </div>
            {overdueCount > 0 && (
              <div className="bg-white/70 rounded-xl px-4 py-2 border border-red-200/50">
                <p className="text-lg font-bold text-red-600">{overdueCount}</p>
                <p className="text-xs text-red-500">Terlambat</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Dues Settings ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-light/30">
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
        {/* ── Add Member Form ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-light/30">
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

          {/* ── Legend ──────────────────────────────────────────────────── */}
          <div className="mt-6 pt-5 border-t border-neutral-light/40">
            <p className="text-xs font-semibold text-neutral uppercase tracking-wider mb-3">Keterangan Status</p>
            <div className="space-y-2">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badgeClass}`}>
                    <i className={`fas ${cfg.icon} text-[10px]`} />
                    {cfg.label}
                  </span>
                  <span className="text-xs text-neutral">{cfg.tooltip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Member List ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-neutral-light/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-semibold text-primary flex items-center gap-2">
              <i className="fas fa-users text-secondary" />
              Daftar Anggota
              <span className="ml-1 text-xs font-normal bg-neutral-light/30 text-neutral px-2 py-0.5 rounded-full">
                {state.members.length} orang
              </span>
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button type="button" onClick={() => toggleAllPayments(true)}
                className="text-xs text-tertiary hover:text-tertiary-dark font-medium underline underline-offset-2">
                Centang Semua
              </button>
              <span className="text-neutral-light text-xs">|</span>
              <button type="button" onClick={() => toggleAllPayments(false)}
                className="text-xs text-red-500 hover:text-red-600 font-medium underline underline-offset-2">
                Batal Centang
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[420px]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b-2 border-neutral-light/40">
                  {[
                    { label: 'Anggota', align: 'left' },
                    { label: 'NIM', align: 'left' },
                    { label: 'Telepon', align: 'left' },
                    { label: 'Status Iuran', align: 'center' },
                    { label: 'Catat', align: 'center' },
                    { label: 'Aksi', align: 'center' },
                  ].map((h) => (
                    <th key={h.label}
                      className={`text-${h.align} py-3 px-2 font-semibold text-neutral text-xs uppercase tracking-wider`}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {state.members.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-neutral-light/20 flex items-center justify-center">
                          <i className="fas fa-users text-2xl text-neutral-light" />
                        </div>
                        <p className="text-neutral text-sm">Belum ada anggota terdaftar</p>
                      </div>
                    </td>
                  </tr>
                ) : membersWithStatus.map((m) => {
                  const cfg = STATUS_CONFIG[m._status];
                  const isRecorded = m._status === 'recorded';
                  const isOverdue  = m._status === 'overdue';

                  return (
                    <tr key={m.id}
                      className={`border-b border-neutral-light/20 transition-colors ${cfg.rowClass} ${!isRecorded ? 'hover:bg-teal-50/30' : ''}`}>

                      {/* Nama */}
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="member-avatar flex-shrink-0"
                            style={{
                              background: isRecorded ? '#9E9E9E' : m.color,
                              width: 32, height: 32, fontSize: 10,
                              opacity: isRecorded ? 0.6 : 1,
                            }}>
                            {getInitials(m.name)}
                          </div>
                          <div>
                            <span className={`font-medium text-sm block ${isRecorded ? 'text-gray-400' : isOverdue ? 'text-red-700' : 'text-neutral-dark'}`}>
                              {m.name}
                            </span>
                            {m.lastPaidDate && (
                              <span className="text-[10px] text-gray-400">
                                Terakhir bayar: {formatDate(m.lastPaidDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* NIM */}
                      <td className={`py-3 px-2 text-sm ${isRecorded ? 'text-gray-400' : isOverdue ? 'text-red-500' : 'text-neutral'}`}>
                        {m.nim}
                      </td>

                      {/* Telepon */}
                      <td className={`py-3 px-2 text-sm ${isRecorded ? 'text-gray-400' : 'text-neutral'}`}>
                        {m.phone}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-2 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.badgeClass}`}>
                          <i className={`fas ${cfg.icon} text-[10px] ${cfg.iconColor}`} />
                          {cfg.label}
                        </span>
                      </td>

                      {/* Checkbox catat */}
                      <td className="py-3 px-2 text-center">
                        {isRecorded ? (
                          <div className="flex justify-center" title="Sudah dicatat periode ini">
                            <div className="w-5 h-5 rounded border-2 border-gray-200 bg-gray-100 flex items-center justify-center cursor-not-allowed">
                              <i className="fas fa-check text-gray-400 text-[8px]" />
                            </div>
                          </div>
                        ) : (
                          <input
                            type="checkbox"
                            className={`w-5 h-5 cursor-pointer rounded ${isOverdue ? 'accent-red-500' : 'accent-tertiary'}`}
                            checked={m.isPaid}
                            onChange={() => toggleMemberPayment(m.id)}
                            title={isOverdue ? 'Centang untuk catat iuran (terlambat)' : 'Centang untuk catat iuran'}
                          />
                        )}
                      </td>

                      {/* Hapus */}
                      <td className="py-3 px-2 text-center">
                        <button type="button" onClick={() => handleDelete(m.id)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Hapus Anggota">
                          <i className="fas fa-trash-alt text-xs" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Footer ──────────────────────────────────────────────────── */}
          <div className="mt-5 pt-5 border-t border-neutral-light/40">
            {/* Summary pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-full text-xs">
                <i className="fas fa-check-circle text-teal-500" />
                <span className="font-semibold text-teal-700">{recordedCount}</span>
                <span className="text-teal-600">sudah dicatat</span>
              </div>
              {overdueCount > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full text-xs">
                  <i className="fas fa-exclamation-circle text-red-500" />
                  <span className="font-semibold text-red-600">{overdueCount}</span>
                  <span className="text-red-500">terlambat</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs">
                <i className="fas fa-hand-pointer text-amber-500" />
                <span className="font-semibold text-amber-700">{checkedCount}</span>
                <span className="text-amber-600">dipilih</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-xs text-neutral">
                Total anggota: <span className="font-bold text-primary">{state.members.length}</span>
              </p>
              <button type="button" onClick={handleRecordDues}
                disabled={checkedCount === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all ${
                  checkedCount > 0
                    ? 'bg-gradient-to-r from-tertiary to-teal-600 text-white hover:shadow-xl hover:scale-105 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                }`}>
                <i className="fas fa-hand-holding-usd" />
                Catat Iuran Sekarang
                {checkedCount > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{checkedCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
