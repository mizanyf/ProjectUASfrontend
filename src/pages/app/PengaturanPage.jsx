import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import OtpInput from '../../components/ui/OtpInput';
import { getPasswordStrength, strengthColors, strengthLabels } from '../../utils/passwordStrength';

function PwdInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="input-styled w-full px-4 py-2.5 border border-neutral-light rounded-xl text-sm outline-none transition-all pr-10" />
      <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-light hover:text-neutral">
        <i className={`fas fa-eye${show ? '-slash' : ''} text-sm`}></i>
      </button>
    </div>
  );
}

export default function PengaturanPage() {
  const { showToast } = useApp();
  const [method, setMethod] = useState('old');
  const [emailStep, setEmailStep] = useState(1);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [emailAddr, setEmailAddr] = useState('');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [emailNewPass, setEmailNewPass] = useState('');
  const [emailConfirmPass, setEmailConfirmPass] = useState('');
  const score = getPasswordStrength(newPass);
  const emailScore = getPasswordStrength(emailNewPass);
  const labelCls = "block text-xs font-semibold text-neutral uppercase tracking-wider mb-1.5";
  const inputCls = "input-styled w-full px-4 py-2.5 border border-neutral-light rounded-xl text-sm outline-none transition-all";

  const btnCls = (active) => `flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${active ? 'bg-white shadow-sm' : 'hover:bg-white/50'} text-neutral-dark`;

  const handleChangeOld = () => {
    if (!oldPass) { showToast('Masukkan kata sandi lama', 'error'); return; }
    if (!newPass || newPass.length < 8) { showToast('Kata sandi baru minimal 8 karakter', 'error'); return; }
    if (newPass !== confirmPass) { showToast('Konfirmasi tidak cocok', 'error'); return; }
    if (score < 2) { showToast('Kata sandi terlalu lemah', 'error'); return; }
    setOldPass(''); setNewPass(''); setConfirmPass('');
    showToast('Kata sandi berhasil diubah', 'success');
  };

  const resetEmail = () => { setEmailStep(1); setEmailAddr(''); setOtp(Array(6).fill('')); setEmailNewPass(''); setEmailConfirmPass(''); };

  const StrengthBar = ({ sc }) => sc >= 0 && newPass ? (
    <div className="mt-2 flex gap-1 items-center">
      {[0,1,2,3,4].map(i => <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i <= sc ? strengthColors[sc] : '#ECEFF1' }} />)}
      <span className="text-[10px] ml-2 font-semibold" style={{ color: strengthColors[sc] }}>{strengthLabels[sc]}</span>
    </div>
  ) : null;

  return (
    <div className="space-y-6">
      <div className="card-hover bg-white rounded-2xl p-6 border border-neutral-light/30">
        <h3 className="font-semibold text-primary mb-5 flex items-center gap-2"><i className="fas fa-shield-alt text-secondary"></i> Ubah Kata Sandi</h3>
        <div className="bg-neutral-50 p-1 rounded-xl flex mb-6">
          <button type="button" onClick={() => setMethod('old')} className={btnCls(method === 'old')}><i className="fas fa-key mr-1.5"></i> Kata Sandi Lama</button>
          <button type="button" onClick={() => { setMethod('email'); resetEmail(); }} className={btnCls(method === 'email')}><i className="fas fa-envelope mr-1.5"></i> Verifikasi Email</button>
        </div>

        {method === 'old' && (
          <div className="space-y-4">
            <div><label className={labelCls}>Kata Sandi Lama</label><PwdInput value={oldPass} onChange={setOldPass} placeholder="Kata sandi lama" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Kata Sandi Baru</label>
                <PwdInput value={newPass} onChange={setNewPass} placeholder="Minimal 8 karakter" />
                <StrengthBar sc={score} />
              </div>
              <div>
                <label className={labelCls}>Konfirmasi</label>
                <PwdInput value={confirmPass} onChange={setConfirmPass} placeholder="Ulangi" />
                {confirmPass && <p className={`text-xs mt-1 px-3 py-2 rounded-lg ${newPass === confirmPass ? 'bg-tertiary-50 text-tertiary' : 'bg-red-50 text-red-500'}`}><i className={`fas fa-${newPass === confirmPass ? 'check' : 'times'}-circle mr-1`}></i>{newPass === confirmPass ? 'Cocok' : 'Tidak cocok'}</p>}
              </div>
            </div>
            <button type="button" onClick={handleChangeOld} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors">Ubah Kata Sandi</button>
          </div>
        )}

        {method === 'email' && emailStep === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-neutral">Masukkan email organisasi untuk menerima kode verifikasi.</p>
            <div><label className={labelCls}>Email Terdaftar</label><input type="email" value={emailAddr} onChange={e => setEmailAddr(e.target.value)} placeholder="nama@organisasi.com" className={inputCls} /></div>
            <button type="button" onClick={() => { if (!emailAddr) return; setEmailStep(2); showToast('Kode dikirim','info'); }} className="w-full py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors">Kirim Kode Verifikasi</button>
          </div>
        )}
        {method === 'email' && emailStep === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-neutral">Kode dikirim ke <strong className="text-primary">{emailAddr}</strong></p>
            <div><label className={labelCls}>Kode 6 Digit</label><OtpInput value={otp} onChange={setOtp} /></div>
            <button type="button" onClick={() => { if (otp.join('').length < 6) { showToast('Masukkan 6 digit','error'); return; } setEmailStep(3); }} className="w-full py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors">Verifikasi Kode</button>
            <button type="button" onClick={resetEmail} className="w-full text-xs text-neutral hover:text-neutral-dark underline">Batal</button>
          </div>
        )}
        {method === 'email' && emailStep === 3 && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Kata Sandi Baru</label>
              <PwdInput value={emailNewPass} onChange={setEmailNewPass} placeholder="Minimal 8 karakter" />
              {emailNewPass && (
                <div className="mt-2 flex gap-1 items-center">
                  {[0,1,2,3,4].map(i => <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i <= emailScore ? strengthColors[emailScore] : '#ECEFF1' }} />)}
                  <span className="text-[10px] ml-2 font-semibold" style={{ color: strengthColors[emailScore] }}>{strengthLabels[emailScore]}</span>
                </div>
              )}
            </div>
            <div>
              <label className={labelCls}>Konfirmasi</label>
              <PwdInput value={emailConfirmPass} onChange={setEmailConfirmPass} placeholder="Ulangi" />
              {emailConfirmPass && <p className={`text-xs mt-1 px-3 py-2 rounded-lg ${emailNewPass === emailConfirmPass ? 'bg-tertiary-50 text-tertiary' : 'bg-red-50 text-red-500'}`}><i className={`fas fa-${emailNewPass === emailConfirmPass ? 'check' : 'times'}-circle mr-1`}></i>{emailNewPass === emailConfirmPass ? 'Cocok' : 'Tidak cocok'}</p>}
            </div>
            <button type="button" onClick={() => { if (!emailNewPass || emailNewPass.length < 8 || emailNewPass !== emailConfirmPass) { showToast('Periksa kembali kata sandi','error'); return; } setEmailStep(4); showToast('Kata sandi berhasil diubah','success'); }} className="w-full py-3 bg-tertiary text-white rounded-xl text-sm font-semibold hover:bg-tertiary-light transition-colors">Simpan Kata Sandi Baru</button>
            <button type="button" onClick={resetEmail} className="w-full text-xs text-neutral hover:text-neutral-dark underline">Batal</button>
          </div>
        )}
        {method === 'email' && emailStep === 4 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-tertiary-50 flex items-center justify-center mx-auto mb-4"><i className="fas fa-check-circle text-tertiary text-3xl"></i></div>
            <h2 className="text-lg font-bold text-primary-dark mb-2">Kata Sandi Berhasil Diubah!</h2>
            <p className="text-sm text-neutral mb-6">Silakan gunakan kata sandi baru untuk login berikutnya.</p>
            <button type="button" onClick={() => setMethod('old')} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors">Kembali</button>
          </div>
        )}
      </div>
      <div className="card-hover bg-white rounded-2xl p-6 border border-neutral-light/30">
        <h4 className="text-sm font-semibold text-neutral-dark mb-2 flex items-center gap-2"><i className="fas fa-history text-secondary text-xs"></i> Riwayat Sesi</h4>
        <div className="flex items-center gap-3 p-3 bg-tertiary-50 rounded-xl border border-tertiary/10">
          <div className="w-9 h-9 rounded-lg bg-tertiary flex items-center justify-center flex-shrink-0"><i className="fas fa-desktop text-white text-sm"></i></div>
          <div className="flex-1 min-w-0"><p className="text-sm font-medium text-neutral-dark">Chrome di Windows</p><p className="text-xs text-neutral">Jakarta, Indonesia</p></div>
          <span className="text-[10px] font-semibold text-tertiary bg-tertiary-50 px-2 py-1 rounded-md">Aktif</span>
        </div>
      </div>
    </div>
  );
}
