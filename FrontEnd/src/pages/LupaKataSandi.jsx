import { useId, useState, useEffect } from "react";
import AuthLayout from "../components/common/AuthLayout";
import Toast from "../components/common/Toast";

export const LupaKataSandi = ({ goToLogin, goToVerifikasi }) => {
  const emailId = useId();
  const [email, setEmail] = useState("");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  // auto hide toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) return;

    setToast({
      show: true,
      message: "Kode verifikasi telah dikirim",
      type: "info",
    });

    setTimeout(() => {
      // Kirim email dan flag dari Lupa Password
      goToVerifikasi({ 
        fromRegister: false,
        email: email  // kirim email yang dimasukkan
      });
    }, 1500);
  };

  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToast((prev) => ({ ...prev, show: false }))
          }
        />
      )}

      <AuthLayout subtitle="Pemulihan Kata Sandi">
        <h1 className="text-xl font-bold text-[#083d56]">
          Lupa Kata Sandi?
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Masukkan email organisasi yang terdaftar.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor={emailId}
              className="text-sm text-[#424242]"
            >
              Email Terdaftar
            </label>

            <input
              id={emailId}
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@organisasi.com"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#083d56]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#083d56] hover:bg-[#062c3e] transition rounded-xl 
            [font-family:'Plus_Jakarta_Sans-SemiBold',Helvetica] font-semibold text-white text-sm"
          >
            Kirim Kode Verifikasi
          </button>
        </form>

        <button
          type="button"
          onClick={goToLogin}
          className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2 mx-auto w-fit cursor-pointer transition-colors duration-200 hover:text-[#083d56]"
        >
          <i className="fas fa-arrow-left text-xs"></i>

          <span className="[font-family:'Plus_Jakarta_Sans-SemiBold',Helvetica] font-semibold text-grey text-sm text-center tracking-[0] leading-5">
          Kembali ke Masuk
          </span>
        </button>
      </AuthLayout>
    </>
  );
};

export default LupaKataSandi;