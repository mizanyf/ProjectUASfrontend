import { useState } from 'react';
import { useApp } from '../../context/AppContext';
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

export default function RegisterPage() {
  const { navigateTo, setProfile, showToast } = useApp();
  const [form, setForm] = useState({ name: '', type: '', email: '', phone: '', desc: '', pass: '', confirm: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const score = getPasswordStrength(form.pass);

  const handleRegister = () => {
    if (!form.name || !form.type || !form.email || !form.phone || !form.pass) { showToast('Lengkapi semua data wajib', 'error'); return; }
    if (form.pass !== form.confirm) { showToast('Konfirmasi kata sandi salah', 'error'); return; }
    setProfile(p => ({ ...p, name: form.name, type: form.type, email: form.email, phone: form.phone, description: form.desc || p.description }));
    showToast('Organisasi berhasil didaftarkan!', 'success');
    setTimeout(() => navigateTo('login'), 800);
  };

  const inputCls = "input-styled w-full px-4 py-3 border border-neutral-light rounded-xl text-sm outline-none transition-all";
  const labelCls = "block text-sm font-medium text-neutral-dark mb-1.5";

  return (
    <div className="auth-bg flex items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-md relative z-10 my-8">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-lg items-center justify-center flex-shrink-0 overflow-hidden mx-auto">
            <img src="/logoproject.jpeg" alt="Logo MoneFlo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">MoneFlo</h1>
          <p className="text-white/60 mt-1 text-sm">Daftarkan Organisasi Anda</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-primary mb-1">Buat Akun Organisasi</h2>
          <p className="text-sm text-neutral mb-6">Lengkapi data identitas organisasi di bawah ini.</p>
          <div className="space-y-4">
            <div><label className={labelCls}>Nama Organisasi <span className="text-red-400">*</span></label><input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Contoh: BEM Fakultas Teknik" className={inputCls} /></div>
            <div><label className={labelCls}>Jenis Organisasi <span className="text-red-400">*</span></label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className={`${inputCls} text-neutral`}>
                <option value="">Pilih jenis</option>
                {['Kemahasiswaan','Yayasan','Komunitas','UKM'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Email Resmi <span className="text-red-400">*</span></label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="humas@organisasi.com" className={inputCls} /></div>
            <div><label className={labelCls}>No. Telepon / WhatsApp <span className="text-red-400">*</span></label><input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="08xxxxxxxxxx" className={inputCls} /></div>
            <div><label className={labelCls}>Deskripsi Singkat</label><textarea rows={3} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Ceritakan sedikit tentang organisasi..." className={`${inputCls} resize-none`} /></div>
            <div>
              <label className={labelCls}>Kata Sandi <span className="text-red-400">*</span></label>
              <PwdInput value={form.pass} onChange={v => set('pass', v)} placeholder="Minimal 8 karakter" />
              {form.pass && (
                <div className="mt-2 flex gap-1 items-center">
                  {[0,1,2,3,4].map(i => <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i <= score ? strengthColors[score] : '#ECEFF1' }} />)}
                  <span className="text-[10px] ml-2 font-semibold" style={{ color: strengthColors[score] }}>{strengthLabels[score]}</span>
                </div>
              )}
            </div>
            <div><label className={labelCls}>Konfirmasi Kata Sandi <span className="text-red-400">*</span></label>
              <PwdInput value={form.confirm} onChange={v => set('confirm', v)} placeholder="Ulangi kata sandi" />
              {form.confirm && (
                <p className={`text-xs mt-1 px-3 py-2 rounded-lg ${form.pass === form.confirm ? 'bg-tertiary-50 text-tertiary' : 'bg-red-50 text-red-500'}`}>
                  <i className={`fas fa-${form.pass === form.confirm ? 'check' : 'times'}-circle mr-1`}></i>
                  {form.pass === form.confirm ? 'Kata sandi cocok' : 'Kata sandi tidak cocok'}
                </p>
              )}
            </div>
            <button type="button" onClick={handleRegister} className="w-full py-3 bg-tertiary text-white rounded-xl font-semibold hover:bg-tertiary-light transition-colors mt-2">Daftarkan Sekarang</button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral mb-3">Sudah punya akun?</p>
            <button type="button" onClick={() => navigateTo('login')} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors text-sm">
              <i className="fas fa-sign-in-alt text-xs"></i> Masuk di Sini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
