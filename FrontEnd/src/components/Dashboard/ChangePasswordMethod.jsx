import { useState } from "react";
import { StrengthBar } from "../../components/common/StrengthBar";

export const ChangePasswordMethod = ({ showToast }) => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = newPass ? (
    (() => {
      let s = 0;
      if (newPass.length >= 8) s++;
      if (newPass.length >= 12) s++;
      if (/[a-z]/.test(newPass) && /[A-Z]/.test(newPass)) s++;
      if (/\d/.test(newPass)) s++;
      if (/[^a-zA-Z0-9]/.test(newPass)) s++;
      return s;
    })()
  ) : 0;

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
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
          Kata Sandi Lama
        </label>
        <div className="relative">
          <input
            type={showOld ? "text" : "password"}
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            placeholder="Kata sandi lama"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00695c] focus:ring-2 focus:ring-[#00695c]/15 transition-all pr-10"
          />
          <button
            type="button"
            onClick={() => setShowOld((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <i className={`fas fa-eye${showOld ? "-slash" : ""} text-sm`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Kata Sandi Baru
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Minimal 8 karakter"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00695c] focus:ring-2 focus:ring-[#00695c]/15 transition-all pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i className={`fas fa-eye${showNew ? "-slash" : ""} text-sm`} />
            </button>
          </div>
          {newPass && <StrengthBar score={strength} />}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Konfirmasi
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Ulangi kata sandi baru"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00695c] focus:ring-2 focus:ring-[#00695c]/15 transition-all pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i className={`fas fa-eye${showConfirm ? "-slash" : ""} text-sm`} />
            </button>
          </div>
          {confirmPass && (
            <div className={`mt-1 text-xs px-3 py-2 rounded-lg ${passMatch ? "bg-[#e0f2f1] text-[#00695c]" : "bg-red-50 text-red-500"}`}>
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
  );
};