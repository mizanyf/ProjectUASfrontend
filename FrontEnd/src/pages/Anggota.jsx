import { useState } from "react";
import { useApp } from "../context/AppContext";

const formatRupiah = (n) => "Rp" + Number(n).toLocaleString("id-ID");
const getInitials = (n) =>
  n.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase();

export const Anggota = ({ onDuesRecorded }) => {
  const {
    members, addMember, deleteMember, toggleMemberPayment, toggleAllPayments,
    duesSettings, setDuesSettings, recordDues,
  } = useApp();

  const [form, setForm] = useState({ name: "", nim: "", phone: "" });
  const [duesForm, setDuesForm] = useState({ interval: duesSettings.interval, amount: duesSettings.amount });
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddMember = () => {
    if (!form.name || !form.nim || !form.phone) {
      showToast("Lengkapi data anggota", "error");
      return;
    }
    const COLORS = ["#083D56", "#00695C", "#546E7A", "#00897B", "#0C5272", "#78909C"];
    addMember({ ...form, color: COLORS[Math.floor(Math.random() * COLORS.length)] });
    setForm({ name: "", nim: "", phone: "" });
    showToast("Anggota berhasil ditambahkan");
  };

  const handleSaveDues = () => {
    if (!duesForm.interval || duesForm.interval <= 0) { showToast("Periode tidak valid", "error"); return; }
    if (!duesForm.amount || duesForm.amount < 0) { showToast("Nominal tidak valid", "error"); return; }
    setDuesSettings({ interval: parseInt(duesForm.interval), amount: parseInt(duesForm.amount) });
    showToast("Pengaturan iuran disimpan");
  };

  const handleRecordDues = () => {
    const hasPaid = members.some((m) => m.isPaid);
    if (!hasPaid) { showToast("Pilih (centang) anggota terlebih dahulu", "error"); return; }
    const count = recordDues();
    showToast(`Berhasil mencatat iuran untuk ${count} anggota!`);
    if (onDuesRecorded) onDuesRecorded();
  };

  const handleDeleteMember = (id) => {
    if (window.confirm("Hapus anggota ini?")) {
      deleteMember(id);
      showToast("Anggota dihapus", "info");
    }
  };

  const paidCount = members.filter((m) => m.isPaid).length;

  return (
    <div className="p-4 lg:p-6 space-y-6 relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium min-w-[260px] animate-zoom-in ${toast.type === "error" ? "bg-red-500" : toast.type === "info" ? "bg-[#083d56]" : "bg-[#00695c]"}`}>
          <i className={`fas ${toast.type === "error" ? "fa-exclamation-circle" : "fa-check-circle"}`} />
          {toast.msg}
        </div>
      )}

      {/* Dues Settings */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <h3 className="font-semibold text-[#083d56] mb-4 flex items-center gap-2">
          <i className="fas fa-cogs text-[#546E7A]" /> Pengaturan Iuran Kas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Periode (Hari)</label>
            <input type="number" value={duesForm.interval} onChange={(e) => setDuesForm((p) => ({ ...p, interval: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00695c] transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Nominal (Rp)</label>
            <input type="number" value={duesForm.amount} onChange={(e) => setDuesForm((p) => ({ ...p, amount: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00695c] transition" />
          </div>
        </div>
        <button onClick={handleSaveDues}
          className="px-6 py-2.5 bg-[#546E7A] hover:bg-[#37474F] text-white rounded-xl text-sm font-semibold transition">
          <i className="fas fa-save mr-2" />Simpan Pengaturan Iuran
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Member Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-[#083d56] mb-4 flex items-center gap-2">
            <i className="fas fa-user-plus text-[#00695c]" /> Tambah Anggota
          </h3>
          <div className="space-y-4">
            {[
              { label: "Nama Lengkap", id: "name", type: "text", placeholder: "Nama anggota" },
              { label: "NIM", id: "nim", type: "text", placeholder: "Nomor Induk Mahasiswa" },
              { label: "No. Telepon", id: "phone", type: "tel", placeholder: "08xxxxxxxxxx" },
            ].map((f) => (
              <div key={f.id}>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{f.label}</label>
                <input type={f.type} value={form[f.id]} onChange={(e) => setForm((p) => ({ ...p, [f.id]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00695c] transition" />
              </div>
            ))}
            <button onClick={handleAddMember}
              className="w-full py-2.5 bg-[#00695c] hover:bg-[#005147] text-white rounded-xl text-sm font-semibold transition">
              Tambah Anggota
            </button>
          </div>
        </div>

        {/* Members List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#083d56]">Daftar Anggota</h3>
            <div className="flex items-center gap-2 text-xs">
              <button onClick={() => toggleAllPayments(true)} className="text-[#00695c] hover:underline">Centang Semua</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => toggleAllPayments(false)} className="text-red-500 hover:underline">Batal Centang</button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[380px]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="border-b border-gray-100">
                  {["Nama", "NIM", "Telepon", "Status Bayar", "Aksi"].map((h) => (
                    <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400 text-sm">Belum ada anggota</td></tr>
                ) : members.map((m) => (
                  <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{ background: m.color }}>
                          {getInitials(m.name)}
                        </div>
                        <span className="font-medium text-gray-800 text-sm">{m.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-500">{m.nim}</td>
                    <td className="py-3 px-2 text-sm text-gray-500">{m.phone}</td>
                    <td className="py-3 px-2 text-center">
                      <input type="checkbox" checked={m.isPaid} onChange={() => toggleMemberPayment(m.id)}
                        className="w-5 h-5 cursor-pointer accent-[#00695c]" />
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button onClick={() => handleDeleteMember(m.id)}
                        className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition">
                        <i className="fas fa-trash-alt text-xs" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <div className="text-xs text-gray-400">
              Sudah membayar: <span className="font-bold text-[#00695c]">{paidCount}</span> / <span>{members.length}</span>
            </div>
            <button onClick={handleRecordDues}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00695c] to-[#0d9488] text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              <i className="fas fa-hand-holding-usd" /> Catat Iuran Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Anggota;
