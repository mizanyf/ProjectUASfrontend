import { useState, useRef } from 'react';
import { useSystem, DEFAULTS } from '../../context/SystemContext';
import { useToast } from '../../context/ToastContext';
import defaultLogo  from '../../assets/MoneFloLogo.png';
import defaultLogo2 from '../../assets/MoneFloLogo2.png';

/* ---- helpers ---- */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

function Section({ title, icon, children, accent = 'indigo' }) {
  const colors = {
    indigo: 'bg-indigo-600/20 text-indigo-400',
    violet: 'bg-violet-600/20 text-violet-400',
    emerald: 'bg-emerald-600/20 text-emerald-400',
    amber: 'bg-amber-600/20 text-amber-400',
    rose: 'bg-rose-600/20 text-rose-400',
    sky: 'bg-sky-600/20 text-sky-400',
  };
  return (
    <div className="admin-card rounded-2xl p-5 lg:p-6">
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

function FieldRow({ label, hint, children }) {
  return (
    <div>
      <label className="block text-slate-300 text-sm font-medium mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-slate-600 text-xs mt-1.5">{hint}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, maxLength, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className="admin-input w-full px-4 py-2.5 rounded-xl text-sm"
    />
  );
}

function Toggle({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-800/60 border border-white/5">
      <div>
        <p className="text-slate-200 text-sm font-medium">{label}</p>
        {desc && <p className="text-slate-500 text-xs mt-0.5">{desc}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${
          checked ? 'bg-indigo-600' : 'bg-slate-600'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 mt-0.5 ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

function UploadZone({ label, hint, currentUrl, fallbackSrc, onUpload, onClear }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) { alert('Ukuran file maksimal 2MB'); return; }
    const dataUrl = await readFileAsDataURL(file);
    onUpload(dataUrl);
  };

  return (
    <div
      className={`rounded-xl border-2 border-dashed transition-all cursor-pointer p-4 ${
        drag ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.02]'
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-slate-700/60 flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/10">
          {currentUrl
            ? <img src={currentUrl} alt="preview" className="w-full h-full object-contain" />
            : fallbackSrc
              ? <img src={fallbackSrc} alt="default" className="w-full h-full object-contain opacity-40" />
              : <i className="fas fa-image text-slate-500 text-xl" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-300 text-sm font-medium">{currentUrl ? 'Klik/seret untuk ganti' : 'Klik atau seret file ke sini'}</p>
          <p className="text-slate-500 text-xs mt-0.5">{hint}</p>
          {currentUrl && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="mt-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              <i className="fas fa-times mr-1" />Hapus (gunakan default)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Live Preview (mini) ---- */
function LivePreview({ d }) {
  const logoSrc  = d.logoUrl  || defaultLogo;
  const logo2Src = d.logo2Url || defaultLogo2;
  return (
    <div className="space-y-4">
      {/* Login card */}
      <div>
        <p className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold mb-2">Halaman Login</p>
        <div className="bg-gradient-to-br from-[#083D56] to-[#00695C] rounded-xl p-4 flex items-center justify-center">
          <div className="bg-white rounded-xl p-4 w-full max-w-[200px] text-center shadow-lg">
            <div className="w-9 h-9 rounded-lg mx-auto overflow-hidden mb-1.5">
              <img src={logoSrc} alt="logo" className="w-full h-full object-contain" />
            </div>
            <p className="font-display font-bold text-[#083D56] text-sm truncate">{d.appName || '—'}</p>
            <p className="text-[#767779] text-[10px] mt-0.5 truncate">{d.tagline || '—'}</p>
          </div>
        </div>
      </div>
      {/* Sidebar */}
      <div>
        <p className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold mb-2">Sidebar Pengguna</p>
        <div className="bg-[#083D56] rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
            <img src={logo2Src} alt="icon" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-white text-sm truncate">{d.appName || '—'}</p>
            <p className="text-white/40 text-[9px] tracking-wider uppercase truncate">{d.sidebarSub || '—'}</p>
          </div>
        </div>
      </div>
      {/* Pengumuman */}
      {d.announcement && (
        <div>
          <p className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold mb-2">Banner Pengumuman</p>
          <div className="rounded-xl bg-amber-500/15 border border-amber-500/30 px-3 py-2">
            <p className="text-amber-300 text-xs"><i className="fas fa-bullhorn mr-1.5" />{d.announcement}</p>
          </div>
        </div>
      )}
      {/* Status pendaftaran */}
      <div>
        <p className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold mb-2">Status Pendaftaran</p>
        <div className={`rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-2 ${
          d.registOpen
            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/15 border border-red-500/30 text-red-400'
        }`}>
          <i className={`fas ${d.registOpen ? 'fa-door-open' : 'fa-door-closed'}`} />
          {d.registOpen ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function SistemPage() {
  const { settings, updateSettings, resetSettings } = useSystem();
  const showToast = useToast();

  /* Local draft — init from live context */
  const [draft, setDraft] = useState({ ...settings });
  const [confirmReset, setConfirmReset] = useState(false); // inline confirm state
  const set = (key, val) => setDraft((d) => ({ ...d, [key]: val }));

  /* ---------- handlers ---------- */
  const handleSave = () => {
    updateSettings(draft);
    setConfirmReset(false);
    showToast('Pengaturan sistem berhasil disimpan', 'success');
  };

  /* Reset: step 1 — show inline confirm */
  const handleResetClick = () => setConfirmReset(true);

  /* Reset: step 2 — actually reset */
  const handleResetConfirm = () => {
    resetSettings();            // reset context ke DEFAULTS
    setDraft({ ...DEFAULTS });  // reset draft ke DEFAULTS (diimport, pasti sinkron)
    setConfirmReset(false);
    showToast('Pengaturan direset ke default', 'info');
  };

  /* ---------- render ---------- */
  return (
    <div className="page-enter space-y-5">
      {/* ---- Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-display font-bold text-xl">Pengaturan Sistem</h2>
          <p className="text-slate-400 text-sm mt-0.5">Kelola identitas, branding, dan konfigurasi aplikasi</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleResetClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 text-sm font-semibold transition-all"
          >
            <i className="fas fa-undo text-xs" /> Reset Default
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/25"
          >
            <i className="fas fa-save text-xs" /> Simpan Perubahan
          </button>
        </div>
      </div>

      {/* ---- Inline Reset Confirmation ---- */}
      {confirmReset && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <i className="fas fa-exclamation-triangle text-red-400" />
          <p className="text-red-300 text-sm flex-1">
            Semua pengaturan akan dikembalikan ke <strong>default</strong>. Perubahan yang belum disimpan akan hilang.
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white text-xs font-semibold transition-all"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleResetConfirm}
              className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-all"
            >
              Ya, Reset
            </button>
          </div>
        </div>
      )}

      {/* ---- Main grid ---- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* === LEFT COLUMN (forms) === */}
        <div className="xl:col-span-2 space-y-5">

          {/* Identitas */}
          <Section title="Identitas Aplikasi" icon="fa-font" accent="indigo">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldRow label="Nama Aplikasi" hint={`${draft.appName.length}/30 karakter`}>
                <TextInput value={draft.appName} onChange={(v) => set('appName', v)} placeholder="MoneFlo" maxLength={30} />
              </FieldRow>
              <FieldRow label="Sub-label Sidebar" hint="Teks kecil di bawah nama pada sidebar">
                <TextInput value={draft.sidebarSub} onChange={(v) => set('sidebarSub', v)} placeholder="Keuangan Organisasi" maxLength={30} />
              </FieldRow>
              <FieldRow label="Tagline / Subjudul" hint="Muncul di halaman login & judul tab browser" >
                <TextInput value={draft.tagline} onChange={(v) => set('tagline', v)} placeholder="Sistem Keuangan Organisasi" maxLength={60} />
              </FieldRow>
              <FieldRow label="Email Kontak" hint="Ditampilkan di halaman pengaturan & info sistem">
                <TextInput value={draft.contactEmail} onChange={(v) => set('contactEmail', v)} placeholder="admin@moneflo.com" type="email" />
              </FieldRow>
            </div>
          </Section>

          {/* Logo & Ikon */}
          <Section title="Logo & Ikon" icon="fa-image" accent="violet">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldRow label="Logo Halaman Login" hint="PNG/SVG · Transparan · Maks 2MB · Rasio 1:1">
                <UploadZone
                  currentUrl={draft.logoUrl}
                  fallbackSrc={defaultLogo}
                  hint="PNG/SVG/JPG · Maks 2MB"
                  onUpload={(url) => set('logoUrl', url)}
                  onClear={() => set('logoUrl', null)}
                />
              </FieldRow>
              <FieldRow label="Ikon Sidebar" hint="PNG/SVG · Transparan · Maks 2MB · Rasio 1:1">
                <UploadZone
                  currentUrl={draft.logo2Url}
                  fallbackSrc={defaultLogo2}
                  hint="PNG/SVG/ICO · Maks 2MB"
                  onUpload={(url) => set('logo2Url', url)}
                  onClear={() => set('logo2Url', null)}
                />
              </FieldRow>
            </div>
          </Section>

          {/* Favicon */}
          <Section title="Favicon Browser" icon="fa-globe" accent="sky">
            <FieldRow label="Ikon Tab Browser" hint="ICO/PNG/SVG · Rasio 1:1 · Disarankan 32×32 atau 64×64 px">
              <UploadZone
                currentUrl={draft.faviconUrl}
                fallbackSrc={null}
                hint="ICO/PNG/SVG · Maks 2MB"
                onUpload={(url) => set('faviconUrl', url)}
                onClear={() => set('faviconUrl', null)}
              />
            </FieldRow>
            <p className="text-slate-600 text-xs mt-3">
              <i className="fas fa-info-circle mr-1" />Favicon berubah di tab browser segera setelah disimpan.
            </p>
          </Section>

          {/* Pengumuman & Konfigurasi */}
          <Section title="Pengumuman & Konfigurasi" icon="fa-cog" accent="amber">
            <div className="space-y-4">
              <FieldRow label="Banner Pengumuman" hint="Isi untuk menampilkan banner pengumuman — kosongkan untuk menyembunyikan">
                <textarea
                  value={draft.announcement}
                  onChange={(e) => set('announcement', e.target.value)}
                  placeholder="Contoh: Sistem akan maintenance pada tanggal 10 Mei pukul 00.00–02.00 WIB"
                  rows={3}
                  maxLength={200}
                  className="admin-input w-full px-4 py-2.5 rounded-xl text-sm resize-none"
                />
                <p className="text-slate-600 text-xs mt-1">{draft.announcement.length}/200 karakter</p>
              </FieldRow>

              <div className="space-y-3 pt-1">
                <Toggle
                  checked={draft.registOpen}
                  onChange={(v) => set('registOpen', v)}
                  label="Pendaftaran Organisasi Baru"
                  desc="Jika dimatikan, tombol 'Daftar Organisasi' di halaman login disembunyikan"
                />
              </div>
            </div>
          </Section>
        </div>

        {/* === RIGHT COLUMN (live preview) === */}
        <div className="xl:col-span-1">
          <div className="admin-card rounded-2xl p-5 sticky top-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                <i className="fas fa-eye text-indigo-400 text-xs" />
              </div>
              <h3 className="text-white font-display font-semibold text-sm">Live Preview</h3>
            </div>
            <LivePreview d={draft} />
            <div className="mt-5 pt-4 border-t border-white/5">
              <p className="text-slate-600 text-[11px] text-center">
                Preview berubah real-time. Klik <span className="text-slate-400 font-semibold">Simpan</span> untuk menerapkan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
