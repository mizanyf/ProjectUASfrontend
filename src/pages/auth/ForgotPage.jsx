import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import OtpInput from '../../components/ui/OtpInput';
import { getPasswordStrength, strengthColors, strengthLabels } from '../../utils/passwordStrength';

function PwdInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} className="input-styled w-full px-4 py-3 border border-neutral-light rounded-xl text-sm outline-none transition-all pr-10" />
      <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-light hover:text-neutral">
        <i className={`fas fa-eye${show ? '-slash' : ''} text-sm`}></i>
      </button>
    </div>
  );
}

export default function ForgotPage() {
  const { navigateTo, showToast } = useApp();
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=newpass, 4=success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const score = getPasswordStrength(newPass);

  const inputCls = "input-styled w-full px-4 py-3 border border-neutral-light rounded-xl text-sm outline-none transition-all";
  const labelCls = "block text-sm font-medium text-neutral-dark mb-1.5";

  const step1 = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) { showToast('Masukkan email yang valid', 'error'); return; }
    setStep(2); showToast('Kode verifikasi telah dikirim', 'info');
  };
  const step2 = () => {
    if (otp.join('').length < 6) { showToast('Masukkan 6 digit kode', 'error'); return; }
    setStep(3);
  };
  const step3 = () => {
    if (!newPass || newPass.length < 8) { showToast('Kata sandi baru minimal 8 karakter', 'error'); return; }
    if (newPass !== confirm) { showToast('Konfirmasi kata sandi tidak cocok', 'error'); return; }
    if (score < 2) { showToast('Kata sandi terlalu lemah', 'error'); return; }
    setStep(4); showToast('Kata sandi berhasil diubah', 'success');
  };

  return (
    <div className="auth-bg flex items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-lg items-center justify-center flex-shrink-0 overflow-hidden mx-auto">
            <img src="/logoproject.jpeg" alt="Logo MoneFlo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">MoneFlo</h1>
          <p className="text-white/60 mt-1 text-sm">Pemulihan Kata Sandi</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-primary mb-1">Lupa Kata Sandi?</h2>
              <p className="text-sm text-neutral">Masukkan email organisasi yang terdaftar.</p>
              <div><label className={labelCls}>Email Terdaftar</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@organisasi.com" className={inputCls} onKeyDown={e => e.key === 'Enter' && step1()} /></div>
              <button type="button" onClick={step1} className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors">Kirim Kode Verifikasi</button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-primary mb-1">Masukkan Kode Verifikasi</h2>
              <p className="text-sm text-neutral">Kode dikirim ke <strong className="text-primary">{email}</strong></p>
              <p className="text-xs text-neutral">Kode berlaku 5 menit. <button type="button" onClick={() => showToast('Kode baru telah dikirim','info')} className="text-tertiary font-semibold hover:text-tertiary-dark">Kirim ulang</button></p>
              <div><label className={labelCls}>Kode 6 Digit</label><OtpInput value={otp} onChange={setOtp} /></div>
              <button type="button" onClick={step2} className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors">Verifikasi Kode</button>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-primary mb-1">Buat Kata Sandi Baru</h2>
              <p className="text-sm text-neutral">Masukkan kata sandi baru yang kuat.</p>
              <div>
                <label className={labelCls}>Kata Sandi Baru</label>
                <PwdInput value={newPass} onChange={setNewPass} placeholder="Minimal 8 karakter" />
                {newPass && (
                  <div className="mt-2 flex gap-1 items-center">
                    {[0,1,2,3,4].map(i => <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i <= score ? strengthColors[score] : '#ECEFF1' }} />)}
                    <span className="text-[10px] ml-2 font-semibold" style={{ color: strengthColors[score] }}>{strengthLabels[score]}</span>
                  </div>
                )}
              </div>
              <div>
                <label className={labelCls}>Konfirmasi</label>
                <PwdInput value={confirm} onChange={setConfirm} placeholder="Ulangi kata sandi baru" />
                {confirm && <p className={`text-xs mt-1 px-3 py-2 rounded-lg ${newPass === confirm ? 'bg-tertiary-50 text-tertiary' : 'bg-red-50 text-red-500'}`}><i className={`fas fa-${newPass === confirm ? 'check' : 'times'}-circle mr-1`}></i>{newPass === confirm ? 'Kata sandi cocok' : 'Kata sandi tidak cocok'}</p>}
              </div>
              <button type="button" onClick={step3} className="w-full py-3 bg-tertiary text-white rounded-xl font-semibold hover:bg-tertiary-light transition-colors">Simpan Kata Sandi Baru</button>
            </div>
          )}
          {step === 4 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-tertiary-50 flex items-center justify-center mx-auto mb-4"><i className="fas fa-check-circle text-tertiary text-3xl"></i></div>
              <h2 className="text-xl font-bold text-primary mb-2">Berhasil!</h2>
              <p className="text-sm text-neutral mb-6">Kata sandi berhasil diubah.</p>
              <button type="button" onClick={() => navigateTo('login')} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors text-sm">
                <i className="fas fa-sign-in-alt text-xs"></i> Masuk Sekarang
              </button>
            </div>
          )}
          <div className="mt-6 text-center">
            <button type="button" onClick={() => navigateTo('login')} className="text-sm text-neutral hover:text-neutral-dark font-medium flex items-center gap-2 mx-auto">
              <i className="fas fa-arrow-left text-xs"></i> Kembali ke Masuk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
