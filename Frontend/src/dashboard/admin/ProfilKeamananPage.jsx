import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { useSystem } from '../../context/SystemContext';
import { getPasswordStrength, strengthColors, strengthLabels } from '../../utils/passwordStrength';

function PwdInput({ value, onChange, placeholder, id }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input id={id} type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-indigo-500/60 transition-all pr-10 placeholder-slate-500" />
      <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
        <i className={`fas fa-eye${show ? '-slash' : ''} text-sm`} />
      </button>
    </div>
  );
}

function StrengthBar({ pass }) {
  const sc = getPasswordStrength(pass);
  if (!pass || sc < 0) return null;
  return (
    <div className="mt-2 flex gap-1 items-center">
      {[0,1,2,3,4].map(i => <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i <= sc ? strengthColors[sc] : '#334155' }} />)}
      <span className="text-[10px] ml-2 font-semibold" style={{ color: strengthColors[sc] }}>{strengthLabels[sc]}</span>
    </div>
  );
}

const LBL = 'block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5';

/* ---- Info row (tabel info sistem) ---- */
function InfoRow({ icon, label, value, green }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2.5">
        <i className={`fas ${icon} text-slate-500 text-xs w-4`} />
        <span className="text-slate-400 text-sm">{label}</span>
      </div>
      <span className={`text-sm font-medium flex items-center gap-1.5 ${green ? 'text-emerald-400' : 'text-slate-300'}`}>
        {green && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />}
        {value}
      </span>
    </div>
  );
}

/* ---- Activity card dengan icon badge besar ---- */
function ActivityCard({ icon, iconBg, label, value, valueColor = 'text-slate-200' }) {
  return (
    <div className="flex items-center gap-3.5 py-3 px-4 rounded-xl bg-slate-800/60 border border-white/5 hover:border-white/10 transition-all">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <i className={`fas ${icon} text-base`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-slate-500 text-xs">{label}</p>
        <p className={`text-sm font-semibold mt-0.5 truncate ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
}

export default function ProfilKeamananPage() {
  const showToast = useToast();
  const { settings } = useSystem();
  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  // Placeholder untuk data dari backend (nantinya di-fetch dari API)
  const [sysInfo, setSysInfo] = useState({
    appVersion: 'v1.0.0',
    feFramework: 'React + Vite',
    beFramework: 'Laravel 11',
    styling: 'Tailwind CSS',
    dbEngine: 'PostgreSQL',
    storageMode: 'Local Storage',
    serverStatus: 'Online',
    language: 'Indonesia',
    ipAddress: '192.168.1.1',
    timezone: 'Asia/Jakarta'
  });

  // Placeholder active session dari backend
  const [activeSession, setActiveSession] = useState({
    device: 'Desktop',
    os: 'Windows',
    browser: 'Chrome',
    location: 'Jakarta, Indonesia',
    icon: 'fa-desktop'
  });

  // Simulasi fetch / parsing info session sementara backend belum connect
  useEffect(() => {
    const ua = navigator.userAgent;
    let os = 'Unknown OS';
    let browser = 'Unknown Browser';
    let device = 'Desktop';
    let icon = 'fa-desktop';

    if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Mac/i.test(ua)) os = 'MacOS';
    else if (/Linux/i.test(ua)) os = 'Linux';
    else if (/Android/i.test(ua)) { os = 'Android'; device = 'Mobile'; icon = 'fa-mobile-alt'; }
    else if (/iPhone/i.test(ua)) { os = 'iOS'; device = 'Mobile'; icon = 'fa-mobile-alt'; }
    else if (/iPad/i.test(ua)) { os = 'iOS'; device = 'Tablet'; icon = 'fa-tablet-alt'; }

    // Deteksi browser (Edge harus dicek lebih dulu karena string UA nya mengandung Chrome/Safari)
    if (/Edge|Edg/i.test(ua)) browser = 'Edge';
    else if (/Chrome/i.test(ua)) browser = 'Chrome';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Safari/i.test(ua)) browser = 'Safari';

    setActiveSession({
      device,
      os,
      browser,
      location: 'Mendeteksi lokasi...',
      icon
    });

    // Ambil lokasi dari IP (sebagai simulasi data dari backend)
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.city && data.country_name) {
          setActiveSession(prev => ({ ...prev, location: `${data.city}, ${data.country_name}` }));
        }
      })
      .catch(() => {
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (tz) {
            const city = tz.split('/').pop().replace(/_/g, ' ');
            setActiveSession(prev => ({ ...prev, location: `${city} (Berdasarkan Zona Waktu)` }));
          } else {
            setActiveSession(prev => ({ ...prev, location: 'Lokasi tidak diketahui' }));
          }
        } catch(e) {
          setActiveSession(prev => ({ ...prev, location: 'Lokasi tidak diketahui' }));
        }
      });
  }, []);

  /* ── Profile ── */
  const [adminName, setAdminName] = useState('Super Admin');
  const [adminEmail, setAdminEmail] = useState('admin@moneflo.com');

  const handleUpdateProfile = () => {
    if (!adminName || !adminEmail) { showToast('Nama dan Email wajib diisi', 'error'); return; }
    showToast('Profil berhasil diperbarui', 'success');
  };

  /* ── Password change ── */
  const [passMethod, setPassMethod] = useState('profile');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleChangeOld = () => {
    if (!oldPass) { showToast('Masukkan kata sandi lama', 'error'); return; }
    if (!newPass || newPass.length < 8) { showToast('Kata sandi baru minimal 8 karakter', 'error'); return; }
    if (newPass !== confirmPass) { showToast('Konfirmasi tidak cocok', 'error'); return; }
    if (getPasswordStrength(newPass) < 2) { showToast('Kata sandi terlalu lemah', 'error'); return; }
    setOldPass(''); setNewPass(''); setConfirmPass('');
    showToast('Kata sandi berhasil diubah', 'success');
  };

  /* ── Forgot flow ── */
  const [forgotStep, setForgotStep] = useState(1);
  const [verifyPass, setVerifyPass] = useState('');
  const [fpNew, setFpNew] = useState('');
  const [fpConfirm, setFpConfirm] = useState('');
  const [fpSuccess, setFpSuccess] = useState(false);

  const resetForgot = () => { setForgotStep(1); setVerifyPass(''); setFpNew(''); setFpConfirm(''); setFpSuccess(false); };

  const handleForgotStep1 = () => {
    if (!verifyPass) { showToast('Masukkan kata sandi verifikasi', 'error'); return; }
    showToast('Verifikasi berhasil', 'success'); setForgotStep(2);
  };

  const handleForgotStep2 = () => {
    if (!fpNew || fpNew.length < 8) { showToast('Kata sandi minimal 8 karakter', 'error'); return; }
    if (fpNew !== fpConfirm) { showToast('Konfirmasi tidak cocok', 'error'); return; }
    if (getPasswordStrength(fpNew) < 2) { showToast('Kata sandi terlalu lemah', 'error'); return; }
    setFpSuccess(true); showToast('Kata sandi berhasil diubah', 'success');
  };

  const tabBtn = (active) => `flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${active ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-700/50'}`;

  return (
    <div className="page-enter space-y-6">
      <div>
        <h2 className="text-white font-display font-bold text-xl">Profil & Keamanan</h2>
        <p className="text-slate-400 text-sm mt-0.5">Kelola profil dan keamanan akun administrator</p>
      </div>

      {/* Admin Profile Card */}
      <div className="admin-card rounded-2xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center flex-shrink-0">
            <i className="fas fa-user-tie text-indigo-400 text-2xl" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-display font-bold text-lg">Administrator</h3>
            <p className="text-slate-400 text-sm">{adminName} · {adminEmail}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Aktif
              </span>
              <span className="text-slate-600 text-xs">Terakhir login: baru saja</span>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="admin-card rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
          <i className="fas fa-user-cog text-indigo-400" /> Pengaturan Akun
        </h3>
        <div className="bg-slate-800/60 p-1 rounded-xl flex mb-6">
          <button type="button" onClick={() => setPassMethod('profile')} className={tabBtn(passMethod === 'profile')}><i className="fas fa-user-edit mr-1.5" /> Profil</button>
          <button type="button" onClick={() => setPassMethod('old')} className={tabBtn(passMethod === 'old')}><i className="fas fa-key mr-1.5" /> Kata Sandi</button>
          <button type="button" onClick={() => { setPassMethod('forgot'); resetForgot(); }} className={tabBtn(passMethod === 'forgot')}><i className="fas fa-unlock-alt mr-1.5" /> Lupa Sandi</button>
        </div>

        {passMethod === 'profile' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LBL}>Nama Lengkap</label>
                <input type="text" value={adminName} onChange={e => setAdminName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-indigo-500/60 transition-all placeholder-slate-500" />
              </div>
              <div>
                <label className={LBL}>Email Administrator</label>
                <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-indigo-500/60 transition-all placeholder-slate-500" />
              </div>
            </div>
            <button type="button" onClick={handleUpdateProfile}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all">
              Simpan Perubahan
            </button>
          </div>
        )}

        {passMethod === 'old' && (
          <div className="space-y-4">
            <div><label className={LBL}>Kata Sandi Lama</label><PwdInput value={oldPass} onChange={setOldPass} placeholder="Kata sandi lama" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LBL}>Kata Sandi Baru</label>
                <PwdInput value={newPass} onChange={setNewPass} placeholder="Minimal 8 karakter" />
                <StrengthBar pass={newPass} />
              </div>
              <div>
                <label className={LBL}>Konfirmasi</label>
                <PwdInput value={confirmPass} onChange={setConfirmPass} placeholder="Ulangi kata sandi baru" />
                {confirmPass && (
                  <div className={`text-xs px-3 py-2 rounded-lg mt-1 ${newPass === confirmPass ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    <i className={`fas fa-${newPass === confirmPass ? 'check' : 'times'}-circle mr-1`} />
                    {newPass === confirmPass ? 'Cocok' : 'Tidak cocok'}
                  </div>
                )}
              </div>
            </div>
            <button type="button" onClick={handleChangeOld}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all">
              Ubah Kata Sandi
            </button>
          </div>
        )}

        {passMethod === 'forgot' && !fpSuccess && forgotStep === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400 mb-2">Masukkan kata sandi akun saat ini untuk memverifikasi identitas Anda.</p>
            <div><label className={LBL}>Verifikasi Kata Sandi</label><PwdInput value={verifyPass} onChange={setVerifyPass} placeholder="Masukkan kata sandi saat ini" /></div>
            <button type="button" onClick={handleForgotStep1} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all">Verifikasi &amp; Lanjutkan</button>
            <button type="button" onClick={() => setPassMethod('old')} className="w-full text-xs text-slate-500 hover:text-slate-300 underline">Kembali</button>
          </div>
        )}

        {passMethod === 'forgot' && !fpSuccess && forgotStep === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400 mb-2">Verifikasi berhasil. Buat kata sandi baru Anda.</p>
            <div><label className={LBL}>Kata Sandi Baru</label><PwdInput value={fpNew} onChange={setFpNew} placeholder="Minimal 8 karakter" /><StrengthBar pass={fpNew} /></div>
            <div>
              <label className={LBL}>Konfirmasi Kata Sandi Baru</label>
              <PwdInput value={fpConfirm} onChange={setFpConfirm} placeholder="Ulangi kata sandi baru" />
              {fpConfirm && <div className={`text-xs px-3 py-2 rounded-lg mt-1 ${fpNew === fpConfirm ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}><i className={`fas fa-${fpNew === fpConfirm ? 'check' : 'times'}-circle mr-1`} />{fpNew === fpConfirm ? 'Cocok' : 'Tidak cocok'}</div>}
            </div>
            <button type="button" onClick={handleForgotStep2} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all">Simpan Kata Sandi Baru</button>
            <button type="button" onClick={resetForgot} className="w-full text-xs text-slate-500 hover:text-slate-300 underline">Batal</button>
          </div>
        )}

        {passMethod === 'forgot' && fpSuccess && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check-circle text-emerald-400 text-3xl" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Kata Sandi Berhasil Diubah!</h2>
            <p className="text-sm text-slate-400 mb-6">Gunakan kata sandi baru untuk login berikutnya.</p>
            <button type="button" onClick={() => { setPassMethod('old'); resetForgot(); }}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all">Kembali</button>
          </div>
        )}
      </div>

      {/* Session Info */}
      <div className="admin-card rounded-2xl p-6">
        <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-history text-indigo-400 text-xs" /> Sesi Aktif
        </h4>
        <div className="flex items-center gap-3 p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
          <div className="w-9 h-9 rounded-lg bg-indigo-600/30 flex items-center justify-center flex-shrink-0">
            <i className={`fas ${activeSession.icon} text-indigo-400 text-sm`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">{activeSession.browser} di {activeSession.os}</p>
            <p className="text-xs text-slate-500">{activeSession.location}</p>
          </div>
          <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md flex-shrink-0">Aktif</span>
        </div>
      </div>

      {/* Bottom 3-col — Info Sistem + Konfigurasi Aktif + Aktivitas Sistem */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Informasi Sistem */}
        <div className="admin-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-info-circle text-emerald-400 text-sm" />
            </div>
            <h3 className="text-white font-display font-semibold">Informasi Sistem</h3>
          </div>
          <InfoRow icon="fa-code-branch" label="Versi Aplikasi" value={sysInfo.appVersion} />
          <InfoRow icon="fa-layer-group" label="Frontend"       value={sysInfo.feFramework} />
          <InfoRow icon="fa-server"      label="Backend"        value={sysInfo.beFramework} />
          <InfoRow icon="fa-palette"     label="Styling"        value={sysInfo.styling} />
          <InfoRow icon="fa-signal"      label="Status Server"  value={sysInfo.serverStatus} green={sysInfo.serverStatus === 'Online'} />
          <InfoRow icon="fa-hdd"         label="Storage"        value={sysInfo.storageMode} />
          <InfoRow icon="fa-database"    label="Database"       value={sysInfo.dbEngine} />
        </div>

        {/* Konfigurasi Aktif */}
        <div className="admin-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-slate-600/20 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-cog text-slate-400 text-sm" />
            </div>
            <h3 className="text-white font-display font-semibold">Konfigurasi Aktif</h3>
          </div>
          <InfoRow icon="fa-font"      label="Nama Aplikasi" value={settings.appName} />
          <InfoRow icon="fa-comment"   label="Tagline"        value={settings.tagline.length > 22 ? settings.tagline.slice(0,20)+'…' : settings.tagline} />
          <InfoRow icon="fa-envelope"  label="Email Kontak"   value={settings.contactEmail} />
          <InfoRow icon="fa-door-open" label="Pendaftaran"     value={settings.registOpen ? 'Dibuka' : 'Ditutup'} green={settings.registOpen} />
          <InfoRow icon="fa-bullhorn"  label="Pengumuman"      value={settings.announcement ? 'Aktif' : 'Tidak Ada'} green={!!settings.announcement} />
          <InfoRow icon="fa-clock"     label="Zona Waktu"      value={sysInfo.timezone} />
          <InfoRow icon="fa-language"  label="Bahasa"          value={sysInfo.language} />
        </div>

        {/* Aktivitas Sistem — icon badge berwarna besar */}
        <div className="admin-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-sky-600/20 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-chart-simple text-sky-400 text-sm" />
            </div>
            <h3 className="text-white font-display font-semibold">Aktivitas Sistem</h3>
          </div>
          <div className="space-y-2.5">
            <ActivityCard icon="fa-circle-check"  iconBg="bg-emerald-500/20 text-emerald-400" label="Status Sesi"      value="1 Sesi Aktif"  valueColor="text-emerald-400" />
            <ActivityCard icon="fa-calendar-check" iconBg="bg-indigo-500/20 text-indigo-400"  label="Hari Beroperasi" value="1 Hari"        valueColor="text-indigo-300" />
            <ActivityCard icon="fa-clock"          iconBg="bg-sky-500/20 text-sky-400"         label="Tanggal Login"   value={today}        valueColor="text-sky-300" />
            <ActivityCard icon="fa-code"           iconBg="bg-amber-500/20 text-amber-400"    label="Mode Deployment" value="Development"   valueColor="text-amber-300" />
            <ActivityCard icon="fa-shield-halved"  iconBg="bg-violet-500/20 text-violet-400"  label="Level Akses"     value="Super Admin"  valueColor="text-violet-300" />
            <ActivityCard icon="fa-network-wired"  iconBg="bg-fuchsia-500/20 text-fuchsia-400" label="IP Address"      value={sysInfo.ipAddress} valueColor="text-fuchsia-300" />
            <ActivityCard icon="fa-server"         iconBg="bg-rose-500/20 text-rose-400"      label="Uptime Server"   value="Online"       valueColor="text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
