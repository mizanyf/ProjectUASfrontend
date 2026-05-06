import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useSystem } from '../../context/SystemContext';

/* ---- Sub-components ---- */
function Section({ title, icon, accent = 'indigo', children }) {
  const colors = {
    indigo:  'bg-indigo-600/20 text-indigo-400',
    violet:  'bg-violet-600/20 text-violet-400',
    emerald: 'bg-emerald-600/20 text-emerald-400',
    slate:   'bg-slate-600/20 text-slate-400',
    sky:     'bg-sky-600/20 text-sky-400',
  };
  return (
    <div className="admin-card rounded-2xl p-5 lg:p-6 h-full">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[accent]}`}>
          <i className={`fas ${icon} text-sm`} />
        </div>
        <h3 className="text-white font-display font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function PassInput({ field, label, placeholder, passData, setPassData, showPass, setShowPass }) {
  return (
    <div>
      <label className="block text-slate-400 text-sm mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={showPass[field] ? 'text' : 'password'}
          placeholder={placeholder}
          value={passData[field]}
          onChange={(e) => setPassData(p => ({ ...p, [field]: e.target.value }))}
          className="w-full px-4 py-2.5 bg-slate-700/50 border border-white/10 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPass(p => ({ ...p, [field]: !p[field] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <i className={`fa-regular ${showPass[field] ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
        </button>
      </div>
    </div>
  );
}

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

/* Kartu Aktivitas dengan icon besar */
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

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function ProfilKeamananPage() {
  const showToast = useToast();
  const { settings } = useSystem();

  const [passData, setPassData] = useState({ current: '', newPass: '', confirm: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const passProps = { passData, setPassData, showPass, setShowPass };

  const handleChangePass = () => {
    if (!passData.current || !passData.newPass || !passData.confirm) {
      showToast('Harap isi semua field kata sandi', 'error'); return;
    }
    if (passData.newPass !== passData.confirm) {
      showToast('Kata sandi baru tidak cocok', 'error'); return;
    }
    if (passData.newPass.length < 6) {
      showToast('Kata sandi minimal 6 karakter', 'error'); return;
    }
    showToast('Kata sandi berhasil diubah', 'success');
    setPassData({ current: '', newPass: '', confirm: '' });
  };

  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const ACTIVITY_ITEMS = [
    {
      icon: 'fa-circle-check',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      label: 'Status Sesi',
      value: '1 Sesi Aktif',
      valueColor: 'text-emerald-400',
    },
    {
      icon: 'fa-calendar-check',
      iconBg: 'bg-indigo-500/20 text-indigo-400',
      label: 'Hari Beroperasi',
      value: '1 Hari',
      valueColor: 'text-indigo-300',
    },
    {
      icon: 'fa-clock',
      iconBg: 'bg-sky-500/20 text-sky-400',
      label: 'Tanggal Login',
      value: today,
      valueColor: 'text-sky-300',
    },
    {
      icon: 'fa-code',
      iconBg: 'bg-amber-500/20 text-amber-400',
      label: 'Mode Deployment',
      value: 'Development',
      valueColor: 'text-amber-300',
    },
    {
      icon: 'fa-shield-halved',
      iconBg: 'bg-violet-500/20 text-violet-400',
      label: 'Level Akses',
      value: 'Super Admin',
      valueColor: 'text-violet-300',
    },
    {
      icon: 'fa-server',
      iconBg: 'bg-rose-500/20 text-rose-400',
      label: 'Uptime Server',
      value: 'Online',
      valueColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="page-enter space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-white font-display font-bold text-xl">Profil & Keamanan</h2>
        <p className="text-slate-400 text-sm mt-0.5">Kelola informasi akun dan keamanan administrator sistem</p>
      </div>

      {/* Top row — Info + Password */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Informasi Profil */}
        <Section title="Informasi Profil Administrator" icon="fa-user-shield" accent="indigo">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-600/15 to-violet-600/10 border border-indigo-500/20 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
              <i className="fas fa-user-shield text-white text-xl" />
            </div>
            <div>
              <p className="text-white font-semibold text-base">Administrator</p>
              <p className="text-slate-400 text-sm">{settings.contactEmail || 'admin@moneflo.com'}</p>
              <span className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                <i className="fas fa-shield-alt text-[10px]" /> Super Admin
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Username',       value: 'admin',                                              icon: 'fa-user' },
              { label: 'Role',           value: 'Super Admin',                                        icon: 'fa-id-badge' },
              { label: 'Email',          value: settings.contactEmail || 'admin@moneflo.com',         icon: 'fa-envelope' },
              { label: 'Terakhir Login', value: today,                                                icon: 'fa-clock' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="p-3 rounded-xl bg-slate-700/30 border border-white/5">
                <div className="flex items-center gap-1.5 mb-1">
                  <i className={`fas ${icon} text-slate-500 text-[11px]`} />
                  <p className="text-slate-500 text-xs">{label}</p>
                </div>
                <p className="text-slate-200 text-sm font-medium truncate">{value}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Ubah Kata Sandi */}
        <Section title="Ubah Kata Sandi" icon="fa-key" accent="violet">
          <div className="space-y-4">
            <PassInput field="current" label="Kata Sandi Saat Ini"        placeholder="••••••••"               {...passProps} />
            <PassInput field="newPass" label="Kata Sandi Baru"            placeholder="Minimal 6 karakter"    {...passProps} />
            <PassInput field="confirm" label="Konfirmasi Kata Sandi Baru" placeholder="Ulangi kata sandi baru" {...passProps} />
            <button
              type="button"
              onClick={handleChangePass}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/20 mt-2"
            >
              <i className="fas fa-save mr-2" />Simpan Kata Sandi
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
            {[
              'Minimal 6 karakter',
              'Kombinasi huruf & angka direkomendasikan',
              'Jangan gunakan kata sandi yang sama dengan yang lama',
            ].map(tip => (
              <div key={tip} className="flex items-start gap-2">
                <i className="fas fa-check-circle text-indigo-400 text-xs mt-0.5 flex-shrink-0" />
                <p className="text-slate-500 text-xs">{tip}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Bottom row — Info Sistem + Konfigurasi Aktif + Aktivitas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Informasi Sistem */}
        <Section title="Informasi Sistem" icon="fa-info-circle" accent="emerald">
          <div>
            <InfoRow icon="fa-code-branch" label="Versi Aplikasi" value="v1.0.0" />
            <InfoRow icon="fa-layer-group" label="Framework"      value="React + Vite" />
            <InfoRow icon="fa-palette"     label="Styling"        value="Tailwind CSS" />
            <InfoRow icon="fa-server"      label="Status Server"  value="Online" green />
            <InfoRow icon="fa-database"    label="Storage"        value="In-Memory" />
          </div>
        </Section>

        {/* Konfigurasi Aktif */}
        <Section title="Konfigurasi Aktif" icon="fa-cog" accent="slate">
          <div>
            <InfoRow icon="fa-font"       label="Nama Aplikasi" value={settings.appName} />
            <InfoRow
              icon="fa-comment"
              label="Tagline"
              value={settings.tagline.length > 22 ? settings.tagline.slice(0, 20) + '…' : settings.tagline}
            />
            <InfoRow icon="fa-envelope"  label="Email Kontak"  value={settings.contactEmail} />
            <InfoRow
              icon="fa-door-open"
              label="Pendaftaran"
              value={settings.registOpen ? 'Dibuka' : 'Ditutup'}
              green={settings.registOpen}
            />
            <InfoRow
              icon="fa-bullhorn"
              label="Pengumuman"
              value={settings.announcement ? 'Aktif' : 'Tidak Ada'}
              green={!!settings.announcement}
            />
          </div>
        </Section>

        {/* Aktivitas Sistem — icon besar */}
        <Section title="Aktivitas Sistem" icon="fa-chart-simple" accent="sky">
          <div className="space-y-2.5">
            {ACTIVITY_ITEMS.map((item) => (
              <ActivityCard key={item.label} {...item} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
