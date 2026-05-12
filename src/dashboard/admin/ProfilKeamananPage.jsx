import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { useSystem } from '../../context/SystemContext';
import { getPasswordStrength, strengthColors, strengthLabels } from '../../utils/passwordStrength';

function PwdInput({ value, onChange, placeholder, id }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input id={id} type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-white border border-neutral-light rounded-xl text-neutral-dark text-sm outline-none focus:border-tertiary focus:ring-2 focus:ring-tertiary/15 transition-all pr-10 placeholder-neutral" />
      <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral hover:text-neutral-dark">
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
      {[0,1,2,3,4].map(i => <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i <= sc ? strengthColors[sc] : '#ECEFF1' }} />)}
      <span className="text-[10px] ml-2 font-semibold" style={{ color: strengthColors[sc] }}>{strengthLabels[sc]}</span>
    </div>
  );
}

const LBL = 'block text-neutral text-xs font-semibold uppercase tracking-wider mb-1.5';

function InfoRow({ icon, label, value, green }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-light/30 last:border-0">
      <div className="flex items-center gap-2.5">
        <i className={`fas ${icon} text-neutral-light text-xs w-4`} />
        <span className="text-neutral text-sm">{label}</span>
      </div>
      <span className={`text-sm font-medium flex items-center gap-1.5 ${green ? 'text-tertiary' : 'text-neutral-dark'}`}>
        {green && <span className="w-1.5 h-1.5 rounded-full bg-tertiary inline-block animate-pulse" />}
        {value}
      </span>
    </div>
  );
}

function ActivityCard({ icon, iconBg, label, value, valueColor = 'text-neutral-dark' }) {
  return (
    <div className="flex items-center gap-3.5 py-3 px-4 rounded-xl bg-neutral-50 border border-neutral-light/50 hover:border-neutral-light transition-all">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <i className={`fas ${icon} text-base`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-neutral text-xs">{label}</p>
        <p className={`text-sm font-semibold mt-0.5 truncate ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
}

export default function ProfilKeamananPage() {
  const showToast = useToast();
  const { settings } = useSystem();
  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const [sysInfo] = useState({
    appVersion: 'v1.0.0', feFramework: 'React + Vite', beFramework: 'Laravel 11',
    styling: 'Tailwind CSS', dbEngine: 'PostgreSQL', storageMode: 'Local Storage',
    serverStatus: 'Online', language: 'Indonesia', ipAddress: '192.168.1.1', timezone: 'Asia/Jakarta'
  });

  const [activeSession, setActiveSession] = useState({ device: 'Desktop', os: 'Windows', browser: 'Chrome', location: 'Jakarta, Indonesia', icon: 'fa-desktop' });

  useEffect(() => {
    const ua = navigator.userAgent;
    let os = 'Unknown OS', browser = 'Unknown Browser', device = 'Desktop', icon = 'fa-desktop';
    if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Mac/i.test(ua)) os = 'MacOS';
    else if (/Android/i.test(ua)) { os = 'Android'; device = 'Mobile'; icon = 'fa-mobile-alt'; }
    else if (/iPhone/i.test(ua)) { os = 'iOS'; device = 'Mobile'; icon = 'fa-mobile-alt'; }
    if (/Edge|Edg/i.test(ua)) browser = 'Edge';
    else if (/Chrome/i.test(ua)) browser = 'Chrome';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Safari/i.test(ua)) browser = 'Safari';
    setActiveSession({ device, os, browser, location: 'Mendeteksi lokasi...', icon });
    fetch('https://ipapi.co/json/').then(r => r.json()).then(d => {
      if (d.city && d.country_name) setActiveSession(p => ({ ...p, location: `${d.city}, ${d.country_name}` }));
    }).catch(() => {
      try {
        const city = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop().replace(/_/g,' ');
        setActiveSession(p => ({ ...p, location: `${city} (Berdasarkan Zona Waktu)` }));
      } catch { setActiveSession(p => ({ ...p, location: 'Lokasi tidak diketahui' })); }
    });
  }, []);

  const [adminName, setAdminName] = useState('Super Admin');
  const [adminEmail, setAdminEmail] = useState('admin@moneflo.com');
  const handleUpdateProfile = () => { if (!adminName || !adminEmail) { showToast('Nama dan Email wajib diisi','error'); return; } showToast('Profil berhasil diperbarui','success'); };

  const [passMethod, setPassMethod] = useState('profile');
  const [oldPass, setOldPass] = useState(''); const [newPass, setNewPass] = useState(''); const [confirmPass, setConfirmPass] = useState('');
  const handleChangeOld = () => {
    if (!oldPass) { showToast('Masukkan kata sandi lama','error'); return; }
    if (!newPass || newPass.length < 8) { showToast('Kata sandi baru minimal 8 karakter','error'); return; }
    if (newPass !== confirmPass) { showToast('Konfirmasi tidak cocok','error'); return; }
    if (getPasswordStrength(newPass) < 2) { showToast('Kata sandi terlalu lemah','error'); return; }
    setOldPass(''); setNewPass(''); setConfirmPass(''); showToast('Kata sandi berhasil diubah','success');
  };

  const [forgotStep, setForgotStep] = useState(1);
  const [verifyPass, setVerifyPass] = useState('');
  const [fpNew, setFpNew] = useState(''); const [fpConfirm, setFpConfirm] = useState(''); const [fpSuccess, setFpSuccess] = useState(false);
  const resetForgot = () => { setForgotStep(1); setVerifyPass(''); setFpNew(''); setFpConfirm(''); setFpSuccess(false); };
  const handleForgotStep1 = () => { if (!verifyPass) { showToast('Masukkan kata sandi verifikasi','error'); return; } showToast('Verifikasi berhasil','success'); setForgotStep(2); };
  const handleForgotStep2 = () => {
    if (!fpNew || fpNew.length < 8) { showToast('Kata sandi minimal 8 karakter','error'); return; }
    if (fpNew !== fpConfirm) { showToast('Konfirmasi tidak cocok','error'); return; }
    if (getPasswordStrength(fpNew) < 2) { showToast('Kata sandi terlalu lemah','error'); return; }
    setFpSuccess(true); showToast('Kata sandi berhasil diubah','success');
  };

  const tabBtn = (active) => `flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${active ? 'bg-white text-primary shadow-sm' : 'text-neutral hover:bg-white/60'}`;

  return (
    <div className="page-enter space-y-6">
      <div>
        <h2 className="text-primary-dark font-display font-bold text-xl">Profil & Keamanan</h2>
        <p className="text-neutral text-sm mt-0.5">Kelola profil dan keamanan akun administrator</p>
      </div>

      {/* Profile Card */}
      <div className="admin-card rounded-2xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <i className="fas fa-user-tie text-primary text-2xl" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-primary-dark font-display font-bold text-lg">Administrator</h3>
            <p className="text-neutral text-sm">{adminName} · {adminEmail}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-tertiary/10 text-tertiary border border-tertiary/30">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" /> Aktif
              </span>
              <span className="text-neutral text-xs">Terakhir login: baru saja</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="admin-card rounded-2xl p-6">
        <h3 className="font-semibold text-primary-dark mb-5 flex items-center gap-2">
          <i className="fas fa-user-cog text-primary" /> Pengaturan Akun
        </h3>
        <div className="bg-neutral-50 p-1 rounded-xl flex mb-6">
          <button type="button" onClick={() => setPassMethod('profile')} className={tabBtn(passMethod==='profile')}><i className="fas fa-user-edit mr-1.5"/>Profil</button>
          <button type="button" onClick={() => setPassMethod('old')} className={tabBtn(passMethod==='old')}><i className="fas fa-key mr-1.5"/>Kata Sandi</button>
          <button type="button" onClick={() => { setPassMethod('forgot'); resetForgot(); }} className={tabBtn(passMethod==='forgot')}><i className="fas fa-unlock-alt mr-1.5"/>Lupa Sandi</button>
        </div>

        {passMethod === 'profile' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LBL}>Nama Lengkap</label>
                <input type="text" value={adminName} onChange={e => setAdminName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-neutral-light rounded-xl text-neutral-dark text-sm outline-none focus:border-tertiary focus:ring-2 focus:ring-tertiary/15 transition-all" />
              </div>
              <div>
                <label className={LBL}>Email Administrator</label>
                <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-neutral-light rounded-xl text-neutral-dark text-sm outline-none focus:border-tertiary focus:ring-2 focus:ring-tertiary/15 transition-all" />
              </div>
            </div>
            <button type="button" onClick={handleUpdateProfile}
              className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-all">
              Simpan Perubahan
            </button>
          </div>
        )}

        {passMethod === 'old' && (
          <div className="space-y-4">
            <div><label className={LBL}>Kata Sandi Lama</label><PwdInput value={oldPass} onChange={setOldPass} placeholder="Kata sandi lama"/></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LBL}>Kata Sandi Baru</label>
                <PwdInput value={newPass} onChange={setNewPass} placeholder="Minimal 8 karakter"/>
                <StrengthBar pass={newPass}/>
              </div>
              <div>
                <label className={LBL}>Konfirmasi</label>
                <PwdInput value={confirmPass} onChange={setConfirmPass} placeholder="Ulangi kata sandi baru"/>
                {confirmPass && (
                  <div className={`text-xs px-3 py-2 rounded-lg mt-1 ${newPass===confirmPass?'bg-tertiary/10 text-tertiary':'bg-red-50 text-red-500'}`}>
                    <i className={`fas fa-${newPass===confirmPass?'check':'times'}-circle mr-1`}/>{newPass===confirmPass?'Cocok':'Tidak cocok'}
                  </div>
                )}
              </div>
            </div>
            <button type="button" onClick={handleChangeOld} className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-all">Ubah Kata Sandi</button>
          </div>
        )}

        {passMethod === 'forgot' && !fpSuccess && forgotStep === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-neutral mb-2">Masukkan kata sandi akun saat ini untuk memverifikasi identitas Anda.</p>
            <div><label className={LBL}>Verifikasi Kata Sandi</label><PwdInput value={verifyPass} onChange={setVerifyPass} placeholder="Masukkan kata sandi saat ini"/></div>
            <button type="button" onClick={handleForgotStep1} className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-all">Verifikasi &amp; Lanjutkan</button>
            <button type="button" onClick={() => setPassMethod('old')} className="w-full text-xs text-neutral hover:text-neutral-dark underline">Kembali</button>
          </div>
        )}

        {passMethod === 'forgot' && !fpSuccess && forgotStep === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-neutral mb-2">Verifikasi berhasil. Buat kata sandi baru Anda.</p>
            <div><label className={LBL}>Kata Sandi Baru</label><PwdInput value={fpNew} onChange={setFpNew} placeholder="Minimal 8 karakter"/><StrengthBar pass={fpNew}/></div>
            <div>
              <label className={LBL}>Konfirmasi Kata Sandi Baru</label>
              <PwdInput value={fpConfirm} onChange={setFpConfirm} placeholder="Ulangi kata sandi baru"/>
              {fpConfirm && <div className={`text-xs px-3 py-2 rounded-lg mt-1 ${fpNew===fpConfirm?'bg-tertiary/10 text-tertiary':'bg-red-50 text-red-500'}`}><i className={`fas fa-${fpNew===fpConfirm?'check':'times'}-circle mr-1`}/>{fpNew===fpConfirm?'Cocok':'Tidak cocok'}</div>}
            </div>
            <button type="button" onClick={handleForgotStep2} className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-all">Simpan Kata Sandi Baru</button>
            <button type="button" onClick={resetForgot} className="w-full text-xs text-neutral hover:text-neutral-dark underline">Batal</button>
          </div>
        )}

        {passMethod === 'forgot' && fpSuccess && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check-circle text-tertiary text-3xl" />
            </div>
            <h2 className="text-lg font-bold text-primary-dark mb-2">Kata Sandi Berhasil Diubah!</h2>
            <p className="text-sm text-neutral mb-6">Gunakan kata sandi baru untuk login berikutnya.</p>
            <button type="button" onClick={() => { setPassMethod('old'); resetForgot(); }}
              className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-all">Kembali</button>
          </div>
        )}
      </div>

      {/* Active Session */}
      <div className="admin-card rounded-2xl p-6">
        <h4 className="text-sm font-semibold text-primary-dark mb-4 flex items-center gap-2">
          <i className="fas fa-history text-primary text-xs" /> Sesi Aktif
        </h4>
        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/15">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <i className={`fas ${activeSession.icon} text-primary text-sm`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-dark">{activeSession.browser} di {activeSession.os}</p>
            <p className="text-xs text-neutral">{activeSession.location}</p>
          </div>
          <span className="text-[10px] font-semibold text-tertiary bg-tertiary/10 px-2 py-1 rounded-md flex-shrink-0">Aktif</span>
        </div>
      </div>

      {/* Bottom 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="admin-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-tertiary/10 flex items-center justify-center flex-shrink-0"><i className="fas fa-info-circle text-tertiary text-sm"/></div>
            <h3 className="text-primary-dark font-display font-semibold">Informasi Sistem</h3>
          </div>
          <InfoRow icon="fa-code-branch" label="Versi Aplikasi" value={sysInfo.appVersion}/>
          <InfoRow icon="fa-layer-group" label="Frontend"       value={sysInfo.feFramework}/>
          <InfoRow icon="fa-server"      label="Backend"        value={sysInfo.beFramework}/>
          <InfoRow icon="fa-palette"     label="Styling"        value={sysInfo.styling}/>
          <InfoRow icon="fa-signal"      label="Status Server"  value={sysInfo.serverStatus} green={sysInfo.serverStatus==='Online'}/>
          <InfoRow icon="fa-hdd"         label="Storage"        value={sysInfo.storageMode}/>
          <InfoRow icon="fa-database"    label="Database"       value={sysInfo.dbEngine}/>
        </div>

        <div className="admin-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0"><i className="fas fa-cog text-secondary text-sm"/></div>
            <h3 className="text-primary-dark font-display font-semibold">Konfigurasi Aktif</h3>
          </div>
          <InfoRow icon="fa-font"      label="Nama Aplikasi" value={settings.appName}/>
          <InfoRow icon="fa-comment"   label="Tagline"       value={settings.tagline.length>22?settings.tagline.slice(0,20)+'…':settings.tagline}/>
          <InfoRow icon="fa-envelope"  label="Email Kontak"  value={settings.contactEmail}/>
          <InfoRow icon="fa-door-open" label="Pendaftaran"   value={settings.registOpen?'Dibuka':'Ditutup'} green={settings.registOpen}/>
          <InfoRow icon="fa-bullhorn"  label="Pengumuman"    value={settings.announcement?'Aktif':'Tidak Ada'} green={!!settings.announcement}/>
          <InfoRow icon="fa-clock"     label="Zona Waktu"    value={sysInfo.timezone}/>
          <InfoRow icon="fa-language"  label="Bahasa"        value={sysInfo.language}/>
        </div>

        <div className="admin-card rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><i className="fas fa-chart-simple text-primary text-sm"/></div>
            <h3 className="text-primary-dark font-display font-semibold">Aktivitas Sistem</h3>
          </div>
          <div className="space-y-2.5">
            <ActivityCard icon="fa-circle-check"  iconBg="bg-tertiary/15 text-tertiary"   label="Status Sesi"      value="1 Sesi Aktif"  valueColor="text-tertiary"/>
            <ActivityCard icon="fa-calendar-check" iconBg="bg-primary/10 text-primary"    label="Hari Beroperasi" value="1 Hari"         valueColor="text-primary"/>
            <ActivityCard icon="fa-clock"          iconBg="bg-secondary/10 text-secondary" label="Tanggal Login"   value={today}         valueColor="text-neutral-dark"/>
            <ActivityCard icon="fa-code"           iconBg="bg-amber-50 text-amber-500"    label="Mode Deployment" value="Development"    valueColor="text-amber-600"/>
            <ActivityCard icon="fa-shield-halved"  iconBg="bg-primary/10 text-primary"    label="Level Akses"     value="Super Admin"   valueColor="text-primary"/>
            <ActivityCard icon="fa-network-wired"  iconBg="bg-tertiary/10 text-tertiary"  label="IP Address"      value={sysInfo.ipAddress} valueColor="text-neutral-dark"/>
            <ActivityCard icon="fa-server"         iconBg="bg-tertiary/10 text-tertiary"  label="Uptime Server"   value="Online"        valueColor="text-tertiary"/>
          </div>
        </div>
      </div>
    </div>
  );
}
