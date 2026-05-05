import { useState } from "react";
import Toast from "../components/common/Toast";
import { StrengthBar } from "../components/common/StrengthBar";
import { OtpInput } from "../components/common/OtpInput";
import { ChangePasswordMethod } from "./../components/Dashboard/ChangePasswordMethod";
import { EmailVerificationMethod } from "./../components/Dashboard/EmailVerificationMethod";

export const Pengaturan = () => {
  const [activeMethod, setActiveMethod] = useState("old");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 relative">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-[#083d56] mb-5 flex items-center gap-2">
          <i className="fas fa-shield-alt text-[#546E7A]" /> Ubah Kata Sandi
        </h3>

        {/* Tab Pilihan */}
        <div className="bg-gray-50 p-1 rounded-xl flex mb-6">
          <button onClick={() => setActiveMethod("old")} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeMethod === "old" ? "bg-white text-[#083d56] shadow-sm" : "text-gray-500"}`}>
            <i className="fas fa-key mr-1.5"></i> Kata Sandi Lama
          </button>
          <button onClick={() => setActiveMethod("email")} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeMethod === "email" ? "bg-white text-[#083d56] shadow-sm" : "text-gray-500"}`}>
            <i className="fas fa-envelope mr-1.5"></i> Verifikasi Email
          </button>
        </div>

        {activeMethod === "old" && <ChangePasswordMethod showToast={showToast} />}
        {activeMethod === "email" && <EmailVerificationMethod showToast={showToast} />}

        {/* Riwayat Sesi */}
        <div className="border-t border-gray-100 pt-5 mt-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <i className="fas fa-history text-[#546E7A] text-xs" /> Riwayat Sesi
          </h4>
          <div className="flex items-center gap-3 p-3 bg-[#e0f2f1] rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-[#00695c] flex items-center justify-center">
              <i className="fas fa-desktop text-white text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Chrome di Windows</p>
              <p className="text-xs text-gray-500">Jakarta, Indonesia</p>
            </div>
            <span className="text-[10px] font-semibold text-[#00695c] bg-white px-2 py-1 rounded-md">Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengaturan;
