import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useSystem } from '../../context/SystemContext';
import logoProject from '../../assets/MoneFloLogo.png';

// Admin email yang diakui oleh sistem
const ADMIN_EMAIL    = 'admin@moneflo.com';
const ADMIN_PASSWORD = 'admin123';

export default function LoginPage({ onLogin, onShowRegister, onShowForgot, onAdminLogin }) {
  const showToast = useToast();
  const { settings: sys } = useSystem();
  const logoSrc = sys.logoUrl || logoProject;

  const [email,    setEmail]    = useState('');
  const [pass,     setPass]     = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    if (!email || !pass) { showToast('Harap isi email dan kata sandi', 'error'); return; }

    // Deteksi login admin dari email
    if (email.trim().toLowerCase() === ADMIN_EMAIL) {
      if (pass === ADMIN_PASSWORD) {
        showToast('Selamat datang, Administrator!', 'success');
        setTimeout(onAdminLogin, 600);
      } else {
        showToast('Kata sandi admin salah', 'error');
      }
      return;
    }

    // Login pengguna biasa (email/karakter apapun)
    showToast('Berhasil masuk!', 'success');
    setTimeout(onLogin, 600);
  };

  return (
    <div className="auth-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-lg items-center justify-center flex-shrink-0 overflow-hidden">
            <img src={logoSrc} alt="Logo MoneFlo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">{sys.appName}</h1>
          <p className="text-white/60 mt-1 text-sm">{sys.tagline}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-primary mb-1">Masuk ke akun Organisasi</h2>
          <p className="text-sm text-neutral mb-6">Kelola keuangan organisasi Anda dengan mudah.</p>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1.5">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="nama@organisasi.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="input-styled w-full px-4 py-3 border border-neutral-light rounded-xl text-sm outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1.5">Kata Sandi</label>
              <div className="relative">
                <input
                  id="login-pass"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Masukkan kata sandi"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="input-styled w-full px-4 py-3 border border-neutral-light rounded-xl text-sm outline-none transition-all pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="btn-show-pass">
                  <i className={`fa-regular ${showPass ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-neutral cursor-pointer">
                <input type="checkbox" className="accent-tertiary w-4 h-4 rounded" />
                Ingat saya
              </label>
              <button type="button" onClick={onShowForgot} className="text-sm text-tertiary hover:text-tertiary-dark font-medium">
                Lupa sandi?
              </button>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors"
            >
              Masuk
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-light"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-neutral">atau masuk dengan</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast('Login dengan Google (Simulasi)', 'info')}
              className="w-full py-2.5 bg-white border border-neutral-light text-neutral-dark rounded-xl font-semibold hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>

          <div className="mt-6 text-center">
            {sys.registOpen ? (
              <>
                <p className="text-sm text-neutral mb-3">Belum mendaftarkan organisasi?</p>
                <button
                  type="button"
                  onClick={onShowRegister}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-tertiary text-white rounded-xl font-semibold hover:bg-tertiary-light transition-colors text-sm"
                >
                  <i className="fas fa-plus-circle text-xs" /> Daftar Organisasi
                </button>
              </>
            ) : (
              <p className="text-xs text-neutral/60 italic">
                <i className="fas fa-lock mr-1" />Pendaftaran organisasi baru saat ini ditutup.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
