import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import MoneFloLogo from "../assets/MoneFloLogo.png";

const getInitials = (n) =>
  n.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase();

export const Profil = ({ onLogout }) => {
  const { profile, setProfile, members } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const [toast, setToast] = useState(null);
  const photoInputRef = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("Hanya file gambar", "error"); return; }
    if (file.size > 5 * 1024 * 1024) { showToast("Maksimal 5MB", "error"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfile((p) => ({ ...p, photo: ev.target.result }));
      showToast("Logo organisasi diperbarui");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = () => {
    if (!form.name || !form.type || !form.email || !form.phone) {
      showToast("Semua field wajib diisi", "error");
      return;
    }
    setProfile({ ...profile, ...form });
    setEditing(false);
    showToast("Profil organisasi berhasil diperbarui");
  };

  const handleCancel = () => {
    setForm({ ...profile });
    setEditing(false);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium min-w-[260px] animate-zoom-in ${toast.type === "error" ? "bg-red-500" : "bg-[#00695c]"}`}>
          <i className={`fas ${toast.type === "error" ? "fa-exclamation-circle" : "fa-check-circle"}`} />
          {toast.msg}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-[#083D56] via-[#0C5272] to-[#00695C] relative">
          {!editing && (
            <button onClick={() => { setForm({ ...profile }); setEditing(true); }}
              className="absolute top-4 right-4 px-4 py-2 bg-white/20 backdrop-blur text-white rounded-lg text-sm font-medium hover:bg-white/30 transition flex items-center gap-2">
              <i className="fas fa-pen text-xs" /> Edit Profil
            </button>
          )}
        </div>

        <div className="px-6 pb-6 -mt-14 relative">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Photo */}
            <div
              onClick={() => photoInputRef.current?.click()}
              className="relative w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg cursor-pointer group flex-shrink-0 bg-[#0C5272] flex items-center justify-center"
            >
              {profile.photo ? (
                <img src={profile.photo} alt="Logo" className="w-full h-full object-cover" />
              ) : profile.photo === null ? (
                <img src={MoneFloLogo} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-white text-3xl font-bold">{getInitials(profile.name)}</span>
              )}
              <div className="absolute inset-0 bg-[#083D56]/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fas fa-camera text-white text-lg mb-1" />
                <span className="text-white text-[10px] font-medium">Ubah Logo</span>
              </div>
              <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={handlePhotoChange} />
            </div>

            {/* Info */}
            <div className="pt-2 sm:pt-16 flex-1 w-full">
              <h3 className="text-xl font-bold text-[#083D56]">{profile.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{profile.type}</p>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <i className="fas fa-envelope text-[#00695c]" /> {profile.email}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <i className="fas fa-phone text-[#00695c]" /> {profile.phone}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tentang Kami</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{profile.description}</p>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow animate-zoom-in">
          <h3 className="font-semibold text-[#083d56] mb-5 flex items-center gap-2">
            <i className="fas fa-edit text-[#00695c]" /> Edit Data Organisasi
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Nama Organisasi", id: "name", type: "text" },
                { label: "Email", id: "email", type: "email" },
                { label: "No. Telepon", id: "phone", type: "tel" },
              ].map((f) => (
                <div key={f.id}>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{f.label}</label>
                  <input type={f.type} value={form[f.id]} onChange={(e) => setForm((p) => ({ ...p, [f.id]: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00695c] transition" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Jenis</label>
                <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00695c] transition">
                  {["Kemahasiswaan", "Yayasan", "Komunitas", "UKM"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Deskripsi</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00695c] transition resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave}
                className="px-6 py-2.5 bg-[#00695c] hover:bg-[#005147] text-white rounded-xl text-sm font-semibold transition">
                Simpan Perubahan
              </button>
              <button onClick={handleCancel}
                className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members Summary + Logout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-[#083d56] mb-3 flex items-center gap-2">
            <i className="fas fa-users text-[#00695c]" /> Anggota Organisasi
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#e0f2f1] flex items-center justify-center">
              <span className="text-2xl font-bold text-[#00695c]">{members.length}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Total Anggota</p>
              <p className="text-xs text-gray-400">Terdaftar di sistem</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-[#083d56] mb-3 flex items-center gap-2">
            <i className="fas fa-shield-alt text-[#546E7A]" /> Keamanan
          </h3>
          <div className="flex items-center gap-4 p-4 bg-[#E8F0F4] rounded-xl border border-[#083d56]/10">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#083d56] text-sm">Keluar dari Sistem</p>
              <p className="text-xs text-gray-500">Keluar dari akun organisasi ini.</p>
            </div>
            <button onClick={onLogout}
              className="px-4 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition flex-shrink-0 font-medium">
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
