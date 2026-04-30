import { useState, useEffect } from "react";
import Toast from "../components/Toast";
import AuthLayout from "../components/AuthLayout";

export const BuatSandiBaru = ({ goToLogin }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // 🔥 CEK KEKUATAN PASSWORD
  const getStrength = (password) => {
    if (!password) return "";
    if (password.length < 6) return "Lemah";
    if (password.match(/^(?=.*[a-zA-Z])(?=.*\d).+$/)) {
      return password.length >= 8 ? "Kuat" : "Cukup";
    }
    return "Lemah";
  };

  const strength = getStrength(newPassword);
  const isMatch =
    newPassword && confirmPassword && newPassword === confirmPassword;

  // 🔥 AUTO HIDE TOAST
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

    // ❌ 1. kosong
    if (!newPassword) {
      setToast({
        show: true,
        message: "Masukkan kata sandi",
        type: "error",
      });
      return;
    }

    // ❌ 2. kurang dari 8
    if (newPassword.length < 8) {
      setToast({
        show: true,
        message: "Kata sandi minimal 8 karakter",
        type: "error",
      });
      return;
    }

    // ❌ 3. tidak cocok
    if (newPassword !== confirmPassword) {
      setToast({
        show: true,
        message: "Kata sandi tidak cocok",
        type: "error",
      });
      return;
    }

    // ✅ success
    setToast({
      show: true,
      message: "Kata sandi berhasil diubah",
      type: "success",
    });

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
          {/* PASSWORD */}
          <div>
            <input
              type="password"
              placeholder="Password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#083d56]"
            />

            {/* STRENGTH */}
            {newPassword && (
              <div className="mt-1 text-xs">
                <span
                  className={`font-semibold ${
                    strength === "Kuat"
                      ? "text-green-600"
                      : strength === "Cukup"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {strength}
                </span>
              </div>
            )}
          </div>

          {/* CONFIRM */}
          <div>
            <input
              type="password"
              placeholder="Konfirmasi password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#083d56]"
            />

            {/* MATCH */}
            {confirmPassword && (
              <div className="mt-1 text-xs">
                {isMatch ? (
                  <span className="text-green-600">
                    ✔ Kata sandi cocok
                  </span>
                ) : (
                  <span className="text-red-500">
                    ✖ Kata sandi tidak cocok
                  </span>
                )}
              </div>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-3 bg-[#00695c] text-white rounded-xl hover:bg-[#005147] transition"
          >
            Simpan Kata Sandi Baru
          </button>
        </form>

        {/* BACK */}
        <button
          type="button"
          onClick={goToLogin}
          className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2 mx-auto w-fit cursor-pointer transition-colors duration-200 hover:text-[#083d56]"
        >
          <i className="fas fa-arrow-left text-xs"></i>
          Kembali ke Masuk
        </button>
      </AuthLayout>
    </>
  );
};

export default BuatSandiBaru;