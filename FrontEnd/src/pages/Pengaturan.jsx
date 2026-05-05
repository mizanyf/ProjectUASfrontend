import { useState } from "react";

const getPasswordStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  return s;
};

const StrengthBar = ({ score }) => {
  const colors = ["#EF4444", "#F59E0B", "#F59E0B", "#10B981", "#00695C"];
  const labels = ["Sangat Lemah", "Lemah", "Cukup", "Kuat", "Sangat Kuat"];
  return (
    <div className="flex gap-1 items-center mt-2">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex-1 h-1.5 rounded-full transition-all"
          style={{ background: i <= score ? colors[score] : "#ECEFF1" }}
        />
      ))}
      <span className="text-[10px] ml-2 font-semibold" style={{ color: colors[score] }}>
        {labels[score]}
      </span>
    </div>
  );
};

export const Pengaturan = () => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const strength = newPass ? getPasswordStrength(newPass) : 0;
  const passMatch = confirmPass ? newPass === confirmPass : null;

  const handleChangePassword = () => {
    if (!oldPass) { showToast("Masukkan kata sandi lama", "error"); return; }
    if (!newPass || newPass.length < 8) { showToast("Kata sandi baru minimal 8 karakter", "error"); return; }
    if (newPass !== confirmPass) { showToast("Konfirmasi kata sandi tidak cocok", "error"); return; }
    if (strength < 2) { showToast("Kata sandi terlalu lemah", "error"); return; }
    setOldPass(""); setNewPass(""); setConfirmPass("");
    showToast("Kata sandi berhasil diubah");
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium min-w-[260px] animate-zoom-in ${
            toast.type === "error" ? "bg-red-500" : "bg-[#00695c]"
          }`}
        >
          <i className={`fas ${toast.type === "error" ? "fa-exclamation-circle" : "fa-check-circle"}`} />
          {toast.msg}
        </div>
      )}

      {/* Security Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <h3 className="font-semibold text-[#083d56] mb-5 flex items-center gap-2">
          <i className="fas fa-shield-alt text-[#546E7A]" /> Keamanan Akun
        </h3>

        <div className="space-y-4">
          {/* Old Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Kata Sandi Lama
            </label>
            <div className="relative">
              <input
                id="setting-old-pass"
                type={showOld ? "text" : "password"}
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="Kata sandi lama"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00695c] focus:ring-2 focus:ring-[#00695c]/15 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowOld((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className={`fas fa-eye${showOld ? "-slash" : ""} text-sm`} />
              </button>
            </div>
          </div>

          {/* New + Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  id="setting-new-pass"
                  type={showNew ? "text" : "password"}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00695c] focus:ring-2 focus:ring-[#00695c]/15 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className={`fas fa-eye${showNew ? "-slash" : ""} text-sm`} />
                </button>
              </div>
              {/* Strength bar — only show when user has typed */}
              {newPass && <StrengthBar score={strength} />}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Konfirmasi
              </label>
              <div className="relative">
                <input
                  id="setting-confirm-pass"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00695c] focus:ring-2 focus:ring-[#00695c]/15 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className={`fas fa-eye${showConfirm ? "-slash" : ""} text-sm`} />
                </button>
              </div>
              {/* Match indicator — only show when confirm field has a value */}
              {confirmPass && (
                <div
                  className={`mt-1 text-xs px-3 py-2 rounded-lg ${
                    passMatch
                      ? "bg-[#e0f2f1] text-[#00695c]"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  <i className={`fas ${passMatch ? "fa-check-circle" : "fa-times-circle"} mr-1`} />
                  {passMatch ? "Kata sandi cocok" : "Kata sandi tidak cocok"}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleChangePassword}
            className="px-6 py-2.5 bg-[#083d56] hover:bg-[#0C5272] text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Ubah Kata Sandi
          </button>
        </div>

        {/* Session History */}
        <div className="border-t border-gray-100 pt-5 mt-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <i className="fas fa-history text-[#546E7A] text-xs" /> Riwayat Sesi
          </h4>
          <div className="flex items-center gap-3 p-3 bg-[#e0f2f1] rounded-xl border border-[#00695c]/10">
            <div className="w-9 h-9 rounded-lg bg-[#00695c] flex items-center justify-center flex-shrink-0">
              <i className="fas fa-desktop text-white text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">Chrome di Windows</p>
              <p className="text-xs text-gray-500">Jakarta, Indonesia</p>
            </div>
            <span className="text-[10px] font-semibold text-[#00695c] bg-white px-2 py-1 rounded-md flex-shrink-0">
              Aktif
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengaturan;
