import { useId, useMemo, useState, useEffect } from "react";
import AuthLayout from "../components/AuthLayout";
import Toast from "../components/Toast";

export const Register = ({ goToLogin, goToVerifikasi }) => {
  const formId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "",
    officialEmail: "",
    phone: "",
    description: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // LOGIKA KEKUATAN DIPERKETAT (sama dengan BuatSandiBaru)
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

  const strengthLevel = getStrengthLevel(formData.password);

  const getStrengthInfo = (level) => {
    if (level === 0) return { label: "", color: "bg-gray-100", text: "text-gray-400" };
    if (level <= 2) return { label: "Lemah", color: "bg-red-500", text: "text-red-500" };
    if (level <= 3) return { label: "Cukup", color: "bg-yellow-500", text: "text-yellow-500" };
    if (level === 4) return { label: "Kuat", color: "bg-[#00a67e]", text: "text-[#00a67e]" };
    return { label: "Sangat Kuat", color: "bg-[#008966]", text: "text-[#008966]" };
  };

  const strength = getStrengthInfo(strengthLevel);
  const isPasswordMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  const organizationTypes = ["BEM", "Himpunan Mahasiswa", "UKM", "Komunitas", "Organisasi Sosial"];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isPasswordMatch) return;

    setToast({
      show: true,
      message: "Kode verifikasi telah dikirim",
      type: "info",
    });

    setTimeout(() => {
      /// Kirim email dan flag dari Register
      goToVerifikasi({ 
        fromRegister: true,
        email: formData.officialEmail  // kirim email yang didaftarkan
      });
    }, 1500);
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

      <AuthLayout subtitle="Daftarkan Organisasi Anda">
        <h1 className="text-xl font-bold text-[#083d56]">Buat Akun Organisasi</h1>
        <p className="text-sm text-gray-500 mt-1">Lengkapi data identitas organisasi di bawah ini.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Nama Organisasi */}
          <div>
            <label className="text-sm text-[#083d56]">Nama Organisasi <span className="text-red-500">*</span></label>
            <input
              name="organizationName"
              type="text"
              required
              value={formData.organizationName}
              onChange={handleChange}
              placeholder="Contoh: BEM Fakultas Teknik"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00897b]"
            />
          </div>

          {/* Jenis Organisasi */}
          <div>
            <label className="text-sm text-[#083d56]">Jenis Organisasi <span className="text-red-500">*</span></label>
            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-[#424242]"
              >
                <span className={formData.organizationType ? "text-[#424242]" : "text-gray-400"}>
                  {formData.organizationType || "Pilih jenis organisasi"}
                </span>
                <i className={`fas fa-chevron-down text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}></i>
              </button>
              {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  {organizationTypes.map((type) => (
                    <div
                      key={type}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, organizationType: type }));
                        setIsOpen(false);
                      }}
                      className="px-4 py-3 text-sm text-[#424242] hover:bg-gray-100 cursor-pointer"
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Email Resmi */}
          <div>
            <label className="text-sm text-[#083d56]">Email Resmi <span className="text-red-500">*</span></label>
            <input
              name="officialEmail"
              type="email"
              required
              value={formData.officialEmail}
              onChange={handleChange}
              placeholder="humas@organisasi.com"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00897b]"
            />
          </div>

          {/* Telepon */}
          <div>
            <label className="text-sm text-[#083d56]">No. Telepon / WhatsApp <span className="text-red-500">*</span></label>
            <input
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="08xxxxxxxxxx"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00897b]"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="text-sm text-[#083d56]">Deskripsi Singkat</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ceritakan sedikit tentang organisasi..."
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#00897b] min-h-[80px] resize-none"
            />
          </div>

          {/* Kata Sandi */}
          <div>
            <label className="text-sm text-[#083d56]">Kata Sandi <span className="text-red-500">*</span></label>
            <div className="relative mt-1">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password baru"
                className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all pr-12 ${
                  formData.password ? 'border-[#00695c]' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? (
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 576 512">
                    <path d="M572.52 241.4C518.29 135.59 407.4 64 288 64c-47.74 0-92.3 11.49-132.14 31.9l-25.47-19.9A16 16 0 1 0 110 96l37.28 29.13C93.17 154.66 49.71 196.61 3.48 241.4a48.35 48.35 0 0 0 0 29.2C57.71 376.41 168.6 448 288 448c47.74 0 92.3-11.49 132.14-31.9l25.47 19.9A16 16 0 0 0 466 416l-37.28-29.13c54.11-29.53 97.57-71.48 143.8-116.27a48.35 48.35 0 0 0 0-29.2zM288 400c-97 0-189.09-57.89-238.27-144a433.61 433.61 0 0 1 78.9-89.43l43.49 33.91A96 96 0 0 0 288 352a95.4 95.4 0 0 0 45.63-11.63l43.49 33.91A433.61 433.61 0 0 1 288 400zm0-144a48 48 0 0 1-48-48 47.35 47.35 0 0 1 4.42-20.1l63.68 49.6A47.66 47.66 0 0 1 288 256z"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 576 512">
                    <path d="M572.52 241.4C518.29 135.59 407.4 64 288 64S57.71 135.59 3.48 241.4a48.35 48.35 0 0 0 0 29.2C57.71 376.41 168.6 448 288 448s230.29-71.59 284.52-177.4a48.35 48.35 0 0 0 0-29.2zM288 400c-97 0-189.09-57.89-238.27-144C98.91 169.89 191 112 288 112s189.09 57.89 238.27 144C477.09 342.11 385 400 288 400zm0-240a96 96 0 1 0 96 96 96 96 0 0 0-96-96zm0 144a48 48 0 1 1 48-48 48 48 0 0 1-48 48z"/>
                  </svg>
                )}
              </button>
            </div>

            {/* VISUAL STRENGTH METER */}
            {formData.password && (
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
            )}
          </div>

          {/* Konfirmasi Kata Sandi */}
          <div>
            <label className="text-sm text-[#083d56]">Konfirmasi Password <span className="text-red-500">*</span></label>
            <div className="relative mt-1">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Ulangi password baru"
                className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all pr-12 ${
                  formData.confirmPassword 
                    ? (isPasswordMatch ? 'border-green-500' : 'border-red-500') 
                    : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showConfirmPassword ? (
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 576 512">
                    <path d="M572.52 241.4C518.29 135.59 407.4 64 288 64c-47.74 0-92.3 11.49-132.14 31.9l-25.47-19.9A16 16 0 1 0 110 96l37.28 29.13C93.17 154.66 49.71 196.61 3.48 241.4a48.35 48.35 0 0 0 0 29.2C57.71 376.41 168.6 448 288 448c47.74 0 92.3-11.49 132.14-31.9l25.47 19.9A16 16 0 0 0 466 416l-37.28-29.13c54.11-29.53 97.57-71.48 143.8-116.27a48.35 48.35 0 0 0 0-29.2zM288 400c-97 0-189.09-57.89-238.27-144a433.61 433.61 0 0 1 78.9-89.43l43.49 33.91A96 96 0 0 0 288 352a95.4 95.4 0 0 0 45.63-11.63l43.49 33.91A433.61 433.61 0 0 1 288 400zm0-144a48 48 0 0 1-48-48 47.35 47.35 0 0 1 4.42-20.1l63.68 49.6A47.66 47.66 0 0 1 288 256z"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 576 512">
                    <path d="M572.52 241.4C518.29 135.59 407.4 64 288 64S57.71 135.59 3.48 241.4a48.35 48.35 0 0 0 0 29.2C57.71 376.41 168.6 448 288 448s230.29-71.59 284.52-177.4a48.35 48.35 0 0 0 0-29.2zM288 400c-97 0-189.09-57.89-238.27-144C98.91 169.89 191 112 288 112s189.09 57.89 238.27 144C477.09 342.11 385 400 288 400zm0-240a96 96 0 1 0 96 96 96 96 0 0 0-96-96zm0 144a48 48 0 1 1 48-48 48 48 0 0 1-48 48z"/>
                  </svg>
                )}
              </button>
            </div>

            {/* MATCH INDICATOR DENGAN SVG */}
            {formData.confirmPassword && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium">
                {isPasswordMatch ? (
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
            disabled={!isPasswordMatch || strengthLevel < 2}
            className="w-full py-3.5 text-white rounded-2xl font-bold text-sm transition-all"
            style={{ 
              backgroundColor: isPasswordMatch && strengthLevel >= 2 ? '#00695c' : '#c5c9d1',
              cursor: isPasswordMatch && strengthLevel >= 2 ? 'pointer' : 'not-allowed'
            }}
          >
            Daftarkan Sekarang
          </button>
        </form>

        <button
          type="button"
          onClick={goToLogin}
          className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2 mx-auto w-fit hover:text-[#083d56] transition-colors"
        >
          <i className="fas fa-arrow-left text-xs"></i>
          <span className="[font-family:'Plus_Jakarta_Sans-SemiBold',Helvetica] font-semibold text-grey text-sm text-center tracking-[0] leading-5">Kembali ke Masuk</span>
        </button>
      </AuthLayout>
    </>
  );
};

export default Register;