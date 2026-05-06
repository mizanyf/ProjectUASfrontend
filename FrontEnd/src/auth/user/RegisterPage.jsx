import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';
import OtpInput from '../../components/user/OtpInput';
import PasswordStrengthBars from '../../components/user/PasswordStrengthBars';
import CustomSelect from '../../components/user/CustomSelect';
import { getPasswordStrength } from '../../utils/passwordUtils';
import logoProject from '../../assets/MoneFloLogo.png';

export default function RegisterPage({ onShowLogin }) {
  const showToast = useToast();
  const { updateProfile } = useApp();

  // Multi-step: 1=form, 2=otp, 3=success
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: '', type: '', email: '', phone: '', desc: '', pass: '', passConfirm: '',
  });
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  /* ---------- Step 1: Validate & send OTP ---------- */
  const handleRegister = () => {
    if (!form.name || !form.type || !form.email || !form.phone || !form.pass) {
      showToast('Lengkapi semua data wajib', 'error'); return;
    }
    if (form.pass !== form.passConfirm) {
      showToast('Konfirmasi kata sandi tidak cocok', 'error'); return;
    }
    if (getPasswordStrength(form.pass) < 2) {
      showToast('Kata sandi terlalu lemah', 'error'); return;
    }
    showToast('Kode verifikasi dikirim ke email', 'info');
    setStep(2);
  };

  /* ---------- Step 2: Verify OTP ---------- */
  const handleVerifyOtp = () => {
    if (otp.join('').length < 6) { showToast('Masukkan 6 digit kode', 'error'); return; }
    updateProfile({ name: form.name, type: form.type, email: form.email, phone: form.phone, description: form.desc });
    showToast('Organisasi berhasil didaftarkan!', 'success');
    setStep(3);
  };

  return (
    <div className="auth-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-lg items-center justify-center flex-shrink-0 overflow-hidden">
            <img src={logoProject} alt="Logo MoneFlo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">MoneFlo</h1>
          <p className="text-white/60 mt-1 text-sm">
            {step === 1 && 'Daftarkan Organisasi Anda'}
            {step === 2 && 'Verifikasi Email'}
            {step === 3 && 'Pendaftaran Selesai'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">

          {/* ========== STEP 1: Registration Form ========== */}
          {step === 1 && (
            <div className="page-enter">
              <h2 className="text-xl font-bold text-primary mb-1">Buat Akun Organisasi</h2>
              <p className="text-sm text-neutral mb-6">Lengkapi data identitas organisasi di bawah ini.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1.5">Nama Organisasi <span className="text-red-400">*</span></label>
                  <input type="text" placeholder="Contoh: BEM Fakultas Teknik" value={form.name} onChange={set('name')}
                    className="input-styled w-full px-4 py-3 border border-neutral-light rounded-xl text-sm outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1.5">Jenis Organisasi <span className="text-red-400">*</span></label>
                  <CustomSelect value={form.type} onChange={set('type')}
                    className="input-styled w-full px-4 py-3 border border-neutral-light rounded-xl text-sm outline-none transition-all">
                    <option value="">Pilih jenis</option>
                    <option>Kemahasiswaan</option>
                    <option>Yayasan</option>
                    <option>Komunitas</option>
                    <option>UKM</option>
                  </CustomSelect>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1.5">Email Resmi <span className="text-red-400">*</span></label>
                  <input type="email" placeholder="humas@organisasi.com" value={form.email} onChange={set('email')}
                    className="input-styled w-full px-4 py-3 border border-neutral-light rounded-xl text-sm outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1.5">No. Telepon / WhatsApp <span className="text-red-400">*</span></label>
                  <input type="tel" placeholder="08xxxxxxxxxx" value={form.phone} onChange={set('phone')}
                    className="input-styled w-full px-4 py-3 border border-neutral-light rounded-xl text-sm outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1.5">Deskripsi Singkat</label>
                  <textarea rows={2} placeholder="Ceritakan sedikit tentang organisasi..." value={form.desc} onChange={set('desc')}
                    className="input-styled w-full px-4 py-3 border border-neutral-light rounded-xl text-sm outline-none transition-all resize-none" />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1.5">Kata Sandi <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} placeholder="Minimal 8 karakter" value={form.pass} onChange={set('pass')}
                      className="input-styled w-full px-4 py-3 border border-neutral-light rounded-xl text-sm outline-none transition-all pr-11" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="btn-show-pass">
                      <i className={`fa-regular ${showPass ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                    </button>
                  </div>
                  <PasswordStrengthBars score={getPasswordStrength(form.pass)} />
                  
                  {/* Keterangan kata sandi kuat */}
                  <div className="mt-3 p-3 bg-primary-50 rounded-lg border border-primary/20">
                    <p className="text-xs font-semibold text-primary mb-2">
                      <i className="fas fa-shield-alt mr-1" /> Tips Membuat Kata Sandi yang Kuat:
                    </p>
                    <ul className="text-xs text-primary-dark space-y-1.5">
                      <li className="flex items-start gap-2">
                        <i className="fas fa-check-circle text-tertiary text-[10px] mt-0.5" />
                        <span>Minimal <strong>8 karakter</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fas fa-check-circle text-tertiary text-[10px] mt-0.5" />
                        <span>Mengandung <strong>huruf kapital</strong> (A-Z) dan <strong>huruf kecil</strong> (a-z)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fas fa-check-circle text-tertiary text-[10px] mt-0.5" />
                        <span>Mengandung <strong>angka</strong> (0-9)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="fas fa-check-circle text-tertiary text-[10px] mt-0.5" />
                        <span>Mengandung <strong>simbol/karakter khusus</strong> (@, #, $, %, !, _, -, dll)</span>
                      </li>
                    </ul>
                    <div className="mt-3 pt-2 border-t border-primary/20">
                      <p className="text-[11px] text-primary/70 mb-1">
                        <i className="fas fa-lightbulb mr-1 text-yellow-500" /> Contoh kata sandi kuat:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <code className="text-[11px] bg-white px-2 py-1 rounded text-neutral-dark font-mono">User_12345</code>
                        <code className="text-[11px] bg-white px-2 py-1 rounded text-neutral-dark font-mono">MoneFlo#2024</code>
                        <code className="text-[11px] bg-white px-2 py-1 rounded text-neutral-dark font-mono">Nama@Saya99</code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1.5">Konfirmasi Kata Sandi <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <input type={showConfirm ? 'text' : 'password'} placeholder="Ulangi kata sandi" value={form.passConfirm} onChange={set('passConfirm')}
                      className="input-styled w-full px-4 py-3 border border-neutral-light rounded-xl text-sm outline-none transition-all pr-11" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="btn-show-pass">
                      <i className={`fa-regular ${showConfirm ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                    </button>
                  </div>
                  {form.passConfirm && (
                    <div className={`text-xs px-3 py-2 rounded-lg mt-2 ${form.pass === form.passConfirm ? 'bg-tertiary-50 text-tertiary' : 'bg-red-50 text-red-500'}`}>
                      <i className={`fas ${form.pass === form.passConfirm ? 'fa-check-circle' : 'fa-times-circle'} mr-1`} />
                      {form.pass === form.passConfirm ? 'Kata sandi cocok' : 'Kata sandi tidak cocok'}
                    </div>
                  )}
                </div>

                <button type="button" onClick={handleRegister}
                  className="w-full py-3 bg-tertiary text-white rounded-xl font-semibold hover:bg-tertiary-light transition-colors mt-2">
                  Daftarkan Sekarang
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-light"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs text-neutral">atau daftar dengan</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setForm(f => ({ ...f, email: 'akun.google@gmail.com' }));
                    showToast('Email terisi otomatis dari Google (Simulasi)', 'info');
                  }}
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
                <p className="text-sm text-neutral mb-3">Sudah punya akun?</p>
                <button type="button" onClick={onShowLogin}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors text-sm">
                  <i className="fas fa-sign-in-alt text-xs" /> Masuk di Sini
                </button>
              </div>
            </div>
          )}

          {/* ========== STEP 2: OTP Verification ========== */}
          {step === 2 && (
            <div className="page-enter">
              <h2 className="text-xl font-bold text-primary mb-1">Masukkan Kode Verifikasi</h2>
              <p className="text-sm text-neutral mb-1">Kode dikirim ke <strong className="text-primary">{form.email}</strong></p>
              <p className="text-xs text-neutral mb-6">Kode berlaku 5 menit.{' '}
                <button type="button" onClick={() => showToast('Kode verifikasi baru telah dikirim', 'info')}
                  className="text-tertiary font-semibold hover:text-tertiary-dark">Kirim ulang</button>
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-3 text-center">Kode 6 Digit</label>
                  <OtpInput value={otp} onChange={setOtp} />
                </div>
                <button type="button" onClick={handleVerifyOtp}
                  className="w-full py-3 bg-tertiary text-white rounded-xl font-semibold hover:bg-tertiary-light transition-colors">
                  Verifikasi & Daftarkan
                </button>
              </div>

              <div className="mt-4 text-center">
                <button type="button" onClick={() => setStep(1)}
                  className="text-sm text-neutral hover:text-neutral-dark font-medium flex items-center gap-2 mx-auto">
                  <i className="fas fa-arrow-left text-xs" /> Kembali
                </button>
              </div>
            </div>
          )}

          {/* ========== STEP 3: Success ========== */}
          {step === 3 && (
            <div className="page-enter text-center py-4">
              <div className="w-16 h-16 rounded-full bg-tertiary-50 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check-circle text-tertiary text-3xl" />
              </div>
              <h2 className="text-xl font-bold text-primary mb-2">Berhasil!</h2>
              <p className="text-sm text-neutral mb-6">Organisasi Anda berhasil didaftarkan.</p>
              <button type="button" onClick={onShowLogin}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors text-sm">
                <i className="fas fa-sign-in-alt text-xs" /> Masuk Sekarang
              </button>

              <div className="mt-6">
                <button type="button" onClick={onShowLogin}
                  className="text-sm text-neutral hover:text-neutral-dark font-medium flex items-center gap-2 mx-auto">
                  <i className="fas fa-arrow-left text-xs" /> Kembali ke Masuk
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}