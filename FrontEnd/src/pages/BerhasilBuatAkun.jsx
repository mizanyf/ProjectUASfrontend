// BerhasilBuatAkun.jsx
import { useEffect, useState } from "react";
import AuthLayout from "../components/common/AuthLayout";
import Toast from "../components/common/Toast";

export const BerhasilBuatAkun = ({ goToLogin }) => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Tampilkan toast saat halaman pertama kali dimuat
  useEffect(() => {
    setToast({
      show: true,
      message: "Organisasi berhasil didaftarkan!",
      type: "success",
    });
  }, []);

  // Auto hide toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}

      <AuthLayout subtitle="Daftarkan Organisasi Anda">
        {/* Success Card */}
        <div className="w-full">
          {/* Check Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 flex items-center justify-center bg-[#e0f2f1] rounded-full">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00695c"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center [font-family:'Plus_Jakarta_Sans-Bold',Helvetica] font-bold text-[#083d56] text-xl mb-2">
            Berhasil!
          </h1>

          {/* Description */}
          <p className="text-center [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#767779] text-sm mb-8">
            Organisasi berhasil didaftarkan
          </p>

          {/* Primary Button - Masuk Sekarang */}
          <button
            type="button"
            onClick={goToLogin}
            className="w-full py-3 bg-[#083d56] hover:bg-[#062c3e] transition rounded-xl 
            [font-family:'Plus_Jakarta_Sans-SemiBold',Helvetica] font-semibold text-white text-sm flex items-center justify-center gap-2 mb-4"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Masuk Sekarang
          </button>

          {/* Secondary Button - Kembali ke Masuk */}
          <button
            type="button"
            onClick={goToLogin}
            className="mt-2 text-sm text-gray-500 flex items-center justify-center gap-2 mx-auto w-fit cursor-pointer transition-colors duration-200 hover:text-[#083d56]"
          >
            <i className="fas fa-arrow-left text-xs"></i>
            <span className="[font-family:'Plus_Jakarta_Sans-SemiBold',Helvetica] font-semibold text-grey text-sm text-center tracking-[0] leading-5">
              Kembali ke Masuk
            </span>
          </button>
        </div>
      </AuthLayout>
    </>
  );
};

export default BerhasilBuatAkun;