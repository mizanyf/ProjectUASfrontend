import { useId, useMemo, useState } from "react";
import logo from "../assets/MoneFloLogo.png";
import Toast from "../components/Toast";

export const Register = ({ goToLogin }) => {
  const formId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "",
    officialEmail: "",
    phone: "",
    description: "",
    password: "",
    confirmPassword: "",
  });

  const fieldIds = useMemo(
    () => ({
      organizationName: `${formId}-organization-name`,
      organizationType: `${formId}-organization-type`,
      officialEmail: `${formId}-official-email`,
      phone: `${formId}-phone`,
      description: `${formId}-description`,
      password: `${formId}-password`,
      confirmPassword: `${formId}-confirm-password`,
    }),
    [formId],
  );

  const organizationTypes = [
    "BEM",
    "Himpunan Mahasiswa",
    "UKM",
    "Komunitas",
    "Organisasi Sosial",
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setShowSuccess(true);

    setTimeout(() => {
        setShowSuccess(false);
        goToLogin();
    }, 2000);
  };

  return (
  <>
    {showSuccess && (
      <Toast
        message="Organisasi berhasil didaftarkan!"
        type="success"
        onClose={() => setShowSuccess(false)}
      />
    )}

    <main className="min-h-screen w-full flex bg-[linear-gradient(0deg,rgba(245,245,245,1)_0%,rgba(245,245,245,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)]">
      <section className="flex-1 relative overflow-hidden flex flex-col items-center justify-center p-4 py-12 md:p-8 bg-[linear-gradient(148deg,rgba(8,61,86,1)_0%,rgba(12,82,114,1)_40%,rgba(0,105,92,1)_100%)]">
        
        {/* Dekorasi Background */}
        <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#00695c26] rounded-full" />
        <div className="absolute -left-20 -bottom-20 w-[250px] h-[250px] md:w-[350px] md:h-[350px] bg-[#546e7a1f] rounded-full" />

        {/* Header App */}
        <div className="relative z-10 flex flex-col items-center mb-8">
           <img
                src={logo}
                alt="MoneFlo Logo"
                className="w-14 h-14 rounded-lg object-contain"
              />
          <h1 className="[font-family:'Space_Grotesk-Bold',Helvetica] font-bold text-white text-3xl text-center tracking-[0] leading-9 mb-1">
            MoneFlo
          </h1>
          <p className="[font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#ffffff99] text-sm text-center tracking-[0] leading-5">
            Daftarkan Organisasi Anda
          </p>
        </div>

        {/* Card Form */}
        <section className="relative z-10 w-full max-w-[500px] bg-white rounded-2xl shadow-[0px_25px_50px_-12px_#00000040] p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="[font-family:'Plus_Jakarta_Sans-Bold',Helvetica] font-bold text-[#083d56] text-xl tracking-[0] leading-7 mb-2">
              Buat Akun Organisasi
            </h2>
            <p className="[font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#767779] text-sm tracking-[0] leading-5">
              Lengkapi data identitas organisasi di bawah ini.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Nama Organisasi */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={fieldIds.organizationName}
                className="[font-family:'Plus_Jakarta_Sans-Medium',Helvetica] font-medium text-sm tracking-[0] leading-5"
              >
                <span className="text-[#424242]">Nama Organisasi </span>
                <span className="text-red-400">*</span>
              </label>
              <div className="flex bg-white rounded-xl overflow-hidden border border-solid border-[#9e9e9e] px-4 py-3">
                <input
                  id={fieldIds.organizationName}
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  autoComplete="organization"
                  required
                  className="w-full [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#424242] placeholder:text-gray-400 text-sm outline-none bg-transparent"
                  placeholder="Contoh: BEM Fakultas Teknik"
                  type="text"
                />
              </div>
            </div>

            {/* Jenis Organisasi */}
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={fieldIds.organizationType}
                className="[font-family:'Plus_Jakarta_Sans-Medium',Helvetica] font-medium text-sm tracking-[0] leading-5"
            >
                <span className="text-[#424242]">Jenis Organisasi </span>
                <span className="text-red-400">*</span>
            </label>

            <div className="relative">
                
                {/* INPUT */}
                <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-white border border-[#9e9e9e] rounded-xl px-4 py-3 text-sm text-[#424242] hover:border-[#083d56] transition"
                >
                <span className={formData.organizationType ? "text-[#424242]" : "text-gray-400"}>
                    {formData.organizationType || "Pilih jenis organisasi"}
                </span>

                <i className={`fas fa-chevron-down text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}></i>
                </button>

                {/* LIST */}
                {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    {organizationTypes.map((type) => (
                    <div
                        key={type}
                        onClick={() => {
                        setFormData((prev) => ({
                            ...prev,
                            organizationType: type,
                        }));
                        setIsOpen(false);
                        }}
                        className="px-4 py-3 text-sm text-[#424242] hover:bg-gray-100 cursor-pointer transition"
                    >
                        {type}
                    </div>
                    ))}
                </div>
                )}
            </div>
            </div>

            {/* Email Resmi */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={fieldIds.officialEmail}
                className="[font-family:'Plus_Jakarta_Sans-Medium',Helvetica] font-medium text-sm tracking-[0] leading-5"
              >
                <span className="text-[#424242]">Email Resmi </span>
                <span className="text-red-400">*</span>
              </label>
              <div className="flex bg-white rounded-xl overflow-hidden border border-solid border-[#9e9e9e] px-4 py-3">
                <input
                  id={fieldIds.officialEmail}
                  name="officialEmail"
                  value={formData.officialEmail}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  className="w-full [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#424242] placeholder:text-gray-400 text-sm outline-none bg-transparent"
                  placeholder="humas@organisasi.com"
                  type="email"
                />
              </div>
            </div>

            {/* Telepon */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={fieldIds.phone}
                className="[font-family:'Plus_Jakarta_Sans-Medium',Helvetica] font-medium text-sm tracking-[0] leading-5"
              >
                <span className="text-[#424242]">No. Telepon / WhatsApp </span>
                <span className="text-red-400">*</span>
              </label>
              <div className="flex bg-white rounded-xl overflow-hidden border border-solid border-[#9e9e9e] px-4 py-3">
                <input
                  id={fieldIds.phone}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  required
                  className="w-full [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#424242] placeholder:text-gray-400 text-sm outline-none bg-transparent"
                  placeholder="08xxxxxxxxxx"
                  type="tel"
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={fieldIds.description}
                className="[font-family:'Plus_Jakarta_Sans-Medium',Helvetica] font-medium text-[#424242] text-sm tracking-[0] leading-5"
              >
                Deskripsi Singkat
              </label>
              <div className="flex bg-white rounded-xl overflow-hidden border border-solid border-[#9e9e9e] px-4 py-3 min-h-[86px]">
                <textarea
                  id={fieldIds.description}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full h-full resize-none [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#424242] text-sm tracking-[0] leading-5 placeholder:text-gray-400 outline-none bg-transparent"
                  placeholder="Ceritakan sedikit tentang organisasi..."
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={fieldIds.password}
                className="[font-family:'Plus_Jakarta_Sans-Medium',Helvetica] font-medium text-sm tracking-[0] leading-5"
              >
                <span className="text-[#424242]">Kata Sandi </span>
                <span className="text-red-400">*</span>
              </label>
              <div className="flex relative items-center bg-white rounded-xl overflow-hidden border border-solid border-[#9e9e9e] px-4 py-3">
                <input
                  id={fieldIds.password}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full pr-8 [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#424242] placeholder:text-gray-400 text-sm outline-none bg-transparent"
                  placeholder="Minimal 8 karakter"
                  type={showPassword ? "text" : "password"}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={fieldIds.confirmPassword}
                className="[font-family:'Plus_Jakarta_Sans-Medium',Helvetica] font-medium text-sm tracking-[0] leading-5"
              >
                <span className="text-[#424242]">Konfirmasi Kata Sandi </span>
                <span className="text-red-400">*</span>
              </label>
              <div className="flex relative items-center bg-white rounded-xl overflow-hidden border border-solid border-[#9e9e9e] px-4 py-3">
                <input
                  id={fieldIds.confirmPassword}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full pr-8 [font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#424242] placeholder:text-gray-400 text-sm outline-none bg-transparent"
                  placeholder="Ulangi kata sandi"
                  type={showConfirmPassword ? "text" : "password"}
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 h-12 flex items-center justify-center bg-[#00695c] rounded-xl cursor-pointer hover:bg-[#00574b] transition-colors"
            >
              <span className="[font-family:'Plus_Jakarta_Sans-SemiBold',Helvetica] font-semibold text-white text-base text-center tracking-[0] leading-6">
                Daftarkan Sekarang
              </span>
            </button>
          </form>

          {/* Footer / Login Link */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <span className="[font-family:'Plus_Jakarta_Sans-Regular',Helvetica] font-normal text-[#767779] text-sm text-center tracking-[0] leading-5">
              Sudah punya akun?
            </span>
            <button
                    type="button"
                    onClick={goToLogin}
                    className="w-full sm:w-auto sm:min-w-[200px] h-11 px-6 bg-[#083d56] rounded-xl flex items-center justify-center gap-2 hover:bg-[#062c3e] transition-colors"
                    >
                    <i className="fas fa-sign-in-alt text-white text-sm"></i>

                    <span className="[font-family:'Plus_Jakarta_Sans-SemiBold',Helvetica] font-semibold text-white text-sm text-center tracking-[0] leading-5">
                        Masuk di Sini
                    </span>
                </button>
          </div>
        </section>
      </section>
    </main>
  </>
  );
};

export default Register;