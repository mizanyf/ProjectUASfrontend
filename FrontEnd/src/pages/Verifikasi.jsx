import { useEffect, useMemo, useRef, useState } from "react";
import AuthLayout from "../components/common/AuthLayout";
import Toast from "../components/common/Toast";

export const Verifikasi = ({ 
  goToReset,      // untuk dari Lupa Password
  goToLogin, 
  goToBerhasilBuatAkun,  // untuk dari Register
  fromRegister = false,   // flag untuk menentukan asal halaman
  email = ""      // email yang dikirim dari halaman sebelumnya
}) => {
  const codeLength = 6;

  const [code, setCode] = useState(Array(codeLength).fill(""));
  const inputRefs = useRef([]);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  // TIMER RESEND
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    if (timer > 0) return;

    setToast({
      show: true,
      message: "Kode verifikasi dikirim ulang",
      type: "info",
    });

    setTimer(30);
  };

  const isComplete = useMemo(
    () => code.every((digit) => digit.trim() !== ""),
    [code]
  );

  const handleChange = (index, value) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);
    const nextCode = [...code];
    nextCode[index] = nextValue;
    setCode(nextCode);

    if (nextValue && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isComplete) {
      setToast({
        show: true,
        message: "Masukkan kode lengkap",
        type: "error",
      });
      return;
    }

    setToast({
      show: true,
      message: "Kode berhasil diverifikasi",
      type: "success",
    });

    setTimeout(() => {
      // Cek dari mana halaman ini diakses
      if (fromRegister) {
        // Jika dari Register, arahkan ke BerhasilBuatAkun
        goToBerhasilBuatAkun();
      } else {
        // Jika dari Lupa Password, arahkan ke BuatSandiBaru
        goToReset();
      }
    }, 1500);
  };

  // Format email untuk ditampilkan (maksimal 30 karakter)
  const displayEmail = email.length > 30 ? email.substring(0, 27) + "..." : email;

  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}

      <AuthLayout subtitle="Verifikasi Kode">
        <h1 className="text-xl font-bold text-[#083d56]">
          Masukkan Kode Verifikasi
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Kode dikirim ke <b>{displayEmail || "email Anda"}</b>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* OTP INPUT */}
          <div className="flex justify-between gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-12 h-14 border border-gray-300 rounded-xl text-center text-lg outline-none focus:border-[#083d56]"
              />
            ))}
          </div>

          {/* RESEND */}
          <div className="text-sm text-center">
            {timer > 0 ? (
              <span className="text-gray-400">
                Kirim ulang kode dalam {timer} detik
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-[#00695c] hover:underline"
              >
                Kirim ulang kode
              </button>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={!isComplete}
            className="w-full h-12 rounded-xl transition-all duration-200
            [font-family:'Plus_Jakarta_Sans-SemiBold',Helvetica] font-semibold text-white text-sm
            bg-[#083d56] hover:bg-[#062c3e]
            disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-70 disabled:pointer-events-none"
          >
            Verifikasi Kode
          </button>
        </form>

        {/* BACK */}
        <button
          type="button"
          onClick={goToLogin}
          className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2 mx-auto w-fit cursor-pointer transition-colors duration-200 hover:text-[#083d56]"
        >
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 448 512">
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
          </svg>
          <span className="[font-family:'Plus_Jakarta_Sans-SemiBold',Helvetica] font-semibold text-sm">
            Kembali ke Masuk
          </span>
        </button>
      </AuthLayout>
    </>
  );
};

export default Verifikasi;