import { useState, useEffect } from "react";
import Toast from "../components/common/Toast";
import AuthLayout from "../components/common/AuthLayout";

export const BuatSandiBaru = ({ goToLogin }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // LOGIKA KEKUATAN DIPERKETAT
  const getStrengthLevel = (password) => {
    if (!password) return 0;
    let points = 0;

    // Kriteria panjang
    if (password.length >= 8) points++;
    if (password.length >= 12) points++;
    
    // Kriteria kompleksitas
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) points++; // Ada besar & kecil
    if (/[0-9]/.test(password)) points++; // Ada angka
    if (/[^A-Za-z0-9]/.test(password)) points++; // Ada simbol

    // Penalti: Jika kurang dari 8 karakter, maksimal poin hanya 2 (Lemah)
    if (password.length < 8 && points > 2) points = 2;

    return Math.min(points, 5); 
  };

  const strengthLevel = getStrengthLevel(newPassword);

  const getStrengthInfo = (level) => {
    if (level === 0) return { label: "", color: "bg-gray-100", text: "text-gray-400" };
    if (level <= 2) return { label: "Lemah", color: "bg-red-500", text: "text-red-500" };
    if (level <= 3) return { label: "Cukup", color: "bg-yellow-500", text: "text-yellow-500" };
    if (level === 4) return { label: "Kuat", color: "bg-[#00a67e]", text: "text-[#00a67e]" };
    return { label: "Sangat Kuat", color: "bg-[#008966]", text: "text-[#008966]" };
  };

  const strength = getStrengthInfo(strengthLevel);
  const isMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  // AUTO HIDE TOAST
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newPassword) {
      setToast({ show: true, message: "Masukkan kata sandi", type: "error" });
      return;
    }

    if (newPassword.length < 8) {
      setToast({ show: true, message: "Kata sandi minimal 8 karakter", type: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({ show: true, message: "Kata sandi tidak cocok", type: "error" });
      return;
    }

    setToast({ show: true, message: "Kata sandi berhasil diubah", type: "success" });

    setTimeout(() => {
      goToLogin();
    }, 2000);
  };

  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}

      <AuthLayout subtitle="Pemulihan Kata Sandi">
        <h2 className="text-lg font-bold text-[#083d56]">
          Buat Kata Sandi Baru
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* PASSWORD BARU */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi Baru</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Masukkan password baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all pr-12 ${
                  newPassword ? 'border-[#00695c]' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {/* SVG Ikon Mata yang sama seperti sebelumnya */}
                {showNewPassword ? (
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 576 512"><path d="M572.52 241.4C518.29 135.59 407.4 64 288 64c-47.74 0-92.3 11.49-132.14 31.9l-25.47-19.9A16 16 0 1 0 110 96l37.28 29.13C93.17 154.66 49.71 196.61 3.48 241.4a48.35 48.35 0 0 0 0 29.2C57.71 376.41 168.6 448 288 448c47.74 0 92.3-11.49 132.14-31.9l25.47 19.9A16 16 0 0 0 466 416l-37.28-29.13c54.11-29.53 97.57-71.48 143.8-116.27a48.35 48.35 0 0 0 0-29.2zM288 400c-97 0-189.09-57.89-238.27-144a433.61 433.61 0 0 1 78.9-89.43l43.49 33.91A96 96 0 0 0 288 352a95.4 95.4 0 0 0 45.63-11.63l43.49 33.91A433.61 433.61 0 0 1 288 400zm0-144a48 48 0 0 1-48-48 47.35 47.35 0 0 1 4.42-20.1l63.68 49.6A47.66 47.66 0 0 1 288 256z"/></svg>
                ) : (
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 576 512"><path d="M572.52 241.4C518.29 135.59 407.4 64 288 64S57.71 135.59 3.48 241.4a48.35 48.35 0 0 0 0 29.2C57.71 376.41 168.6 448 288 448s230.29-71.59 284.52-177.4a48.35 48.35 0 0 0 0-29.2zM288 400c-97 0-189.09-57.89-238.27-144C98.91 169.89 191 112 288 112s189.09 57.89 238.27 144C477.09 342.11 385 400 288 400zm0-240a96 96 0 1 0 96 96 96 96 0 0 0-96-96zm0 144a48 48 0 1 1 48-48 48 48 0 0 1-48 48z"/></svg>
                )}
              </button>
            </div>

            {/* VISUAL STRENGTH METER */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex flex-1 gap-1.5">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      idx <= strengthLevel ? strength.color : "bg-gray-100"
                    }`}
                  />
                ))}
              </div>
              <span className={`text-[11px] font-bold min-w-[65px] text-right transition-colors ${strength.text}`}>
                {strength.label}
              </span>
            </div>
          </div>

          {/* KONFIRMASI PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Ulangi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all pr-12 ${
                  confirmPassword ? (isMatch ? 'border-green-500' : 'border-red-500') : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showConfirmPassword ? (
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 576 512"><path d="M572.52 241.4C518.29 135.59 407.4 64 288 64c-47.74 0-92.3 11.49-132.14 31.9l-25.47-19.9A16 16 0 1 0 110 96l37.28 29.13C93.17 154.66 49.71 196.61 3.48 241.4a48.35 48.35 0 0 0 0 29.2C57.71 376.41 168.6 448 288 448c47.74 0 92.3-11.49 132.14-31.9l25.47 19.9A16 16 0 0 0 466 416l-37.28-29.13c54.11-29.53 97.57-71.48 143.8-116.27a48.35 48.35 0 0 0 0-29.2zM288 400c-97 0-189.09-57.89-238.27-144a433.61 433.61 0 0 1 78.9-89.43l43.49 33.91A96 96 0 0 0 288 352a95.4 95.4 0 0 0 45.63-11.63l43.49 33.91A433.61 433.61 0 0 1 288 400zm0-144a48 48 0 0 1-48-48 47.35 47.35 0 0 1 4.42-20.1l63.68 49.6A47.66 47.66 0 0 1 288 256z"/></svg>
                ) : (
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 576 512"><path d="M572.52 241.4C518.29 135.59 407.4 64 288 64S57.71 135.59 3.48 241.4a48.35 48.35 0 0 0 0 29.2C57.71 376.41 168.6 448 288 448s230.29-71.59 284.52-177.4a48.35 48.35 0 0 0 0-29.2zM288 400c-97 0-189.09-57.89-238.27-144C98.91 169.89 191 112 288 112s189.09 57.89 238.27 144C477.09 342.11 385 400 288 400zm0-240a96 96 0 1 0 96 96 96 96 0 0 0-96-96zm0 144a48 48 0 1 1 48-48 48 48 0 0 1-48 48z"/></svg>
                )}
              </button>
            </div>

            {/* MATCH INDICATOR DENGAN SVG */}
            {confirmPassword && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium">
                {isMatch ? (
                  <>
                    <svg className="text-green-600" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-600">Kata sandi cocok</span>
                  </>
                ) : (
                  <>
                    <svg className="text-red-500" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-red-500">Kata sandi tidak cocok</span>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#00695c] text-white rounded-xl font-bold hover:bg-[#005147] transition shadow-lg shadow-[#00695c]/20 mt-2"
          >
            Simpan Kata Sandi Baru
          </button>
        </form>

        <button
          type="button"
          onClick={goToLogin}
          className="mt-8 text-sm text-gray-400 flex items-center justify-center gap-2 mx-auto w-fit cursor-pointer transition-colors duration-200 hover:text-[#083d56]"
        >
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
          <span className="[font-family:'Plus_Jakarta_Sans-SemiBold',Helvetica] font-semibold text-grey text-sm text-center tracking-[0] leading-5">
            Kembali ke Masuk
          </span>
        </button>
      </AuthLayout>
    </>
  );
};

export default BuatSandiBaru;