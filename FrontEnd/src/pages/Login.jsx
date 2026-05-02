import { useId, useState, useEffect } from "react";
import AuthLayout from "../components/AuthLayout";
import Toast from "../components/Toast";

export const Login = ({ onLogin, goToRegister, goToForgot }) => {
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Auto hide toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleChange = (field) => (event) => {
    const value =
      field === "remember" ? event.target.checked : event.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validasi: cek email dan password kosong
    if (!formData.email || !formData.password) {
      setToast({
        show: true,
        message: "Harap isi email dan kata sandi terlebih dahulu",
        type: "error",
      });
      return;
    }

    // Untuk sementara, validasi sederhana (email dan password bisa apa saja asal tidak kosong)
    // Simulasi login berhasil
    setToast({
      show: true,
      message: "Berhasil masuk!",
      type: "success",
    });

    // Setelah 1.5 detik, panggil onLogin untuk navigasi ke Beranda
    setTimeout(() => {
      onLogin();
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

      <AuthLayout subtitle="Sistem Keuangan Organisasi">
        <h1 className="text-xl font-bold text-[#083d56]">
          Masuk Akun Organisasi
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Kelola keuangan organisasi Anda dengan mudah.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-700">
              Email Organisasi
            </label>
            <input
              id={emailId}
              name="email"
              value={formData.email}
              onChange={handleChange("email")}
              type="email"
              placeholder="nama@organisasi.com"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#083d56]"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-700">
              Kata Sandi
            </label>

            <div className="relative mt-1">
              <input
                id={passwordId}
                name="password"
                value={formData.password}
                onChange={handleChange("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#083d56]"
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
          </div>

          {/* REMEMBER */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                id={rememberId}
                type="checkbox"
                checked={formData.remember}
                onChange={handleChange("remember")}
              />
              Ingat saya
            </label>

            <button
              type="button"
              onClick={goToForgot}
              className="text-[#00695c] hover:underline"
            >
              Lupa sandi?
            </button>
          </div>

          {/* BUTTON LOGIN */}
          <button
            type="submit"
            className="w-full py-3 bg-[#083d56] hover:bg-[#062c3e] transition rounded-xl 
            [font-family:'Plus_Jakarta_Sans-SemiBold',Helvetica] font-semibold text-white text-sm"
          >
            Masuk
          </button>
        </form>

        {/* REGISTER */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Belum mendaftarkan organisasi?
        </div>

        <button
          type="button"
          onClick={goToRegister}
          className="w-full mt-3 py-3 bg-[#00695c] hover:bg-[#005147] transition rounded-xl text-white"
        >
          <i className="fas fa-plus mr-2"></i>
          <span className="[font-family:'Plus_Jakarta_Sans-SemiBold',Helvetica] font-semibold text-sm">
            Daftar Organisasi
          </span>
        </button>
      </AuthLayout>
    </>
  );
};

export default Login;