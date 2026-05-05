import { useState } from 'react';
import { useApp } from '../../context/AppContext';

function PasswordToggle({ id, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input id={id} type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} className="input-styled w-full px-4 py-3 border border-neutral-light rounded-xl text-sm outline-none transition-all pr-10" />
      <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-light hover:text-neutral">
        <i className={`fas fa-eye${show ? '-slash' : ''} text-sm`}></i>
      </button>
    </div>
  );
}

export default function LoginPage() {
  const { navigateTo, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !pass.trim()) { showToast('Harap isi email dan kata sandi', 'error'); return; }
    showToast('Berhasil masuk!', 'success');
    setTimeout(() => navigateTo('beranda'), 600);
  };

  return (
    <div className="auth-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-lg items-center justify-center flex-shrink-0 overflow-hidden mx-auto">
            <img src="/logoproject.jpeg" alt="Logo MoneFlo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">MoneFlo</h1>
          <p className="text-white/60 mt-1 text-sm">Sistem Keuangan Organisasi</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-primary mb-1">Gunakan email dan password bebas!</h2>
          <p className="text-sm text-neutral mb-6">Kelola keuangan organisasi Anda dengan mudah.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1.5">Email Organisasi</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@organisasi.com"
                className="input-styled w-full px-4 py-3 border border-neutral-light rounded-xl text-sm outline-none transition-all"
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1.5">Kata Sandi</label>
              <PasswordToggle value={pass} onChange={setPass} placeholder="Masukkan kata sandi" />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-neutral cursor-pointer">
                <input type="checkbox" className="accent-tertiary w-4 h-4 rounded" /> Ingat saya
              </label>
              <button type="button" onClick={() => navigateTo('forgot')} className="text-sm text-tertiary hover:text-tertiary-dark font-medium">Lupa sandi?</button>
            </div>
            <button type="button" onClick={handleLogin} className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors">Masuk</button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral mb-3">Belum mendaftarkan organisasi?</p>
            <button type="button" onClick={() => navigateTo('register')} className="inline-flex items-center gap-2 px-6 py-3 bg-tertiary text-white rounded-xl font-semibold hover:bg-tertiary-light transition-colors text-sm">
              <i className="fas fa-plus-circle text-xs"></i> Daftar Organisasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
