import { useState } from "react";
import { StrengthBar } from "../../components/common/StrengthBar";
import { OtpInput } from "../../components/common/OtpInput";

export const EmailVerificationMethod = ({ showToast }) => {
  const [emailStep, setEmailStep] = useState(1);
  const [email, setEmail] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [emailNewPass, setEmailNewPass] = useState("");
  const [emailConfirmPass, setEmailConfirmPass] = useState("");
  const [showEmailNewPass, setShowEmailNewPass] = useState(false);
  const [showEmailConfirmPass, setShowEmailConfirmPass] = useState(false);

  const emailStrength = emailNewPass ? (
    (() => {
      let s = 0;
      if (emailNewPass.length >= 8) s++;
      if (emailNewPass.length >= 12) s++;
      if (/[a-z]/.test(emailNewPass) && /[A-Z]/.test(emailNewPass)) s++;
      if (/\d/.test(emailNewPass)) s++;
      if (/[^a-zA-Z0-9]/.test(emailNewPass)) s++;
      return s;
    })()
  ) : 0;

  const emailPassMatch = emailConfirmPass ? emailNewPass === emailConfirmPass : null;

  const handleSendEmail = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showToast("Masukkan email yang valid", "error");
      return;
    }
    setTempEmail(email);
    showToast("Kode verifikasi telah dikirim", "info");
    setEmailStep(2);
  };

  const handleVerifyOtp = (otp) => {
    if (otp.length < 6) {
      showToast("Masukkan 6 digit kode", "error");
      return;
    }
    showToast("Kode berhasil diverifikasi", "success");
    setEmailStep(3);
  };

  const handleSetNewPassword = () => {
    if (!emailNewPass || emailNewPass.length < 8) {
      showToast("Kata sandi baru minimal 8 karakter", "error");
      return;
    }
    if (emailNewPass !== emailConfirmPass) {
      showToast("Konfirmasi kata sandi tidak cocok", "error");
      return;
    }
    if (emailStrength < 2) {
      showToast("Kata sandi terlalu lemah", "error");
      return;
    }
    setEmailStep(4);
    showToast("Kata sandi berhasil diubah!");
  };

  const resetMethod = () => {
    setEmailStep(1);
    setEmail("");
    setTempEmail("");
    setEmailNewPass("");
    setEmailConfirmPass("");
  };

  if (emailStep === 1) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500">Masukkan email organisasi Anda untuk menerima kode verifikasi.</p>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Email Terdaftar
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@organisasi.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00695c] focus:ring-2 focus:ring-[#00695c]/15 transition-all"
          />
        </div>
        <button
          type="button"
          onClick={handleSendEmail}
          className="w-full py-3 bg-[#083d56] hover:bg-[#0C5272] text-white rounded-xl text-sm font-semibold transition-colors"
        >
          Kirim Kode Verifikasi
        </button>
      </div>
    );
  }

  if (emailStep === 2) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Kode dikirim ke <strong className="text-[#083d56]">{tempEmail}</strong>
        </p>
        <p className="text-xs text-gray-400">
          Kode berlaku 5 menit.{" "}
          <button type="button" onClick={handleSendEmail} className="text-[#00695c] font-semibold hover:underline">
            Kirim ulang
          </button>
        </p>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Kode 6 Digit
          </label>
          <OtpInput onComplete={handleVerifyOtp} />
        </div>
        <button type="button" onClick={resetMethod} className="w-full text-xs text-gray-500 hover:text-gray-700 underline">
          Batal
        </button>
      </div>
    );
  }

  if (emailStep === 3) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500">Verifikasi berhasil. Buat kata sandi baru.</p>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Kata Sandi Baru
          </label>
          <div className="relative">
            <input
              type={showEmailNewPass ? "text" : "password"}
              value={emailNewPass}
              onChange={(e) => setEmailNewPass(e.target.value)}
              placeholder="Minimal 8 karakter"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00695c] focus:ring-2 focus:ring-[#00695c]/15 transition-all pr-10"
            />
            <button
              type="button"
              onClick={() => setShowEmailNewPass((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i className={`fas fa-eye${showEmailNewPass ? "-slash" : ""} text-sm`} />
            </button>
          </div>
          {emailNewPass && <StrengthBar score={emailStrength} />}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Konfirmasi
          </label>
          <div className="relative">
            <input
              type={showEmailConfirmPass ? "text" : "password"}
              value={emailConfirmPass}
              onChange={(e) => setEmailConfirmPass(e.target.value)}
              placeholder="Ulangi kata sandi baru"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00695c] focus:ring-2 focus:ring-[#00695c]/15 transition-all pr-10"
            />
            <button
              type="button"
              onClick={() => setShowEmailConfirmPass((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i className={`fas fa-eye${showEmailConfirmPass ? "-slash" : ""} text-sm`} />
            </button>
          </div>
          {emailConfirmPass && (
            <div className={`mt-1 text-xs px-3 py-2 rounded-lg ${emailPassMatch ? "bg-[#e0f2f1] text-[#00695c]" : "bg-red-50 text-red-500"}`}>
              <i className={`fas ${emailPassMatch ? "fa-check-circle" : "fa-times-circle"} mr-1`} />
              {emailPassMatch ? "Kata sandi cocok" : "Kata sandi tidak cocok"}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSetNewPassword}
          className="w-full py-3 bg-[#00695c] hover:bg-[#005147] text-white rounded-xl text-sm font-semibold transition-colors"
        >
          Simpan Kata Sandi Baru
        </button>
        <button type="button" onClick={resetMethod} className="w-full text-xs text-gray-500 hover:text-gray-700 underline">
          Batal
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full bg-[#e0f2f1] flex items-center justify-center mx-auto mb-4">
        <i className="fas fa-check-circle text-[#00695c] text-3xl"></i>
      </div>
      <h2 className="text-lg font-bold text-[#083d56] mb-2">Kata Sandi Berhasil Diubah!</h2>
      <p className="text-sm text-gray-500 mb-6">Silakan gunakan kata sandi baru untuk login berikutnya.</p>
      <button
        type="button"
        onClick={resetMethod}
        className="px-6 py-2.5 bg-[#083d56] hover:bg-[#0C5272] text-white rounded-xl text-sm font-semibold transition-colors"
      >
        Kembali
      </button>
    </div>
  );
};