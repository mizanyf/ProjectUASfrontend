import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getInitials } from '../../utils/formatters';

export default function ProfilPage() {
  const { profile, setProfile, navigateTo, showToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', type: '', email: '', phone: '', description: '' });
  const inputCls = "input-styled w-full px-4 py-2.5 border border-neutral-light rounded-xl text-sm outline-none transition-all";
  const labelCls = "block text-xs font-semibold text-neutral uppercase tracking-wider mb-1.5";

  const startEdit = () => {
    setForm({ name: profile.name, type: profile.type, email: profile.email, phone: profile.phone, description: profile.description });
    setEditing(true);
  };

  const saveEdit = () => {
    if (!form.name.trim() || !form.type || !form.email.trim() || !form.phone.trim()) { showToast('Semua field wajib diisi', 'error'); return; }
    setProfile(p => ({ ...p, ...form }));
    setEditing(false);
    showToast('Profil organisasi berhasil diperbarui', 'success');
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Hanya file gambar', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('Maksimal 5MB', 'error'); return; }
    const reader = new FileReader();
    reader.onload = ev => { setProfile(p => ({ ...p, photo: ev.target.result })); showToast('Logo organisasi diperbarui', 'success'); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleLogout = () => { showToast('Anda telah keluar', 'info'); setTimeout(() => navigateTo('login'), 600); };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-light/30 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary via-primary-light to-tertiary relative">
          <button type="button" onClick={editing ? () => setEditing(false) : startEdit} className="absolute top-4 right-4 px-4 py-2 bg-white/20 backdrop-blur text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-2">
            <i className={`fas fa-${editing ? 'times' : 'pen'} text-xs`}></i> {editing ? 'Batal Edit' : 'Edit Profil'}
          </button>
        </div>
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="profile-photo-wrap bg-primary-light flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 ring-4 ring-white shadow-lg" onClick={() => document.getElementById('profile-photo-input').click()}>
              {profile.photo ? <img src={profile.photo} alt="logo" /> : <span>{getInitials(profile.name)}</span>}
              <div className="profile-photo-overlay"><i className="fas fa-camera text-white text-lg mb-1"></i><span className="text-white text-[10px] font-medium">Ubah Logo</span></div>
              <input type="file" id="profile-photo-input" accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={handlePhoto} />
            </div>
            <div className="pt-2 sm:pt-14 flex-1 w-full">
              <h3 className="text-xl font-bold text-primary-dark">{profile.name}</h3>
              <p className="text-sm text-neutral mt-0.5">{profile.type}</p>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="inline-flex items-center gap-1.5 text-xs text-neutral bg-neutral-50 px-3 py-1.5 rounded-lg"><i className="fas fa-envelope text-tertiary"></i>{profile.email}</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-neutral bg-neutral-50 px-3 py-1.5 rounded-lg"><i className="fas fa-phone text-tertiary"></i>{profile.phone}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 border-t border-neutral-light/50 pt-4">
          <h4 className="text-xs font-semibold text-neutral uppercase tracking-wider mb-2">Tentang Kami</h4>
          <p className="text-sm text-neutral-dark leading-relaxed">{profile.description}</p>
        </div>
      </div>

      {editing && (
        <div className="card-hover bg-white rounded-2xl p-6 border border-neutral-light/30 page-enter">
          <h3 className="font-semibold text-primary mb-5 flex items-center gap-2"><i className="fas fa-edit text-tertiary"></i> Edit Data Organisasi</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Nama Organisasi</label><input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Jenis</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className={inputCls}>
                  {['Kemahasiswaan','Yayasan','Komunitas','UKM'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Email</label><input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>No. Telepon</label><input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={inputCls} /></div>
            </div>
            <div><label className={labelCls}>Deskripsi</label><textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={`${inputCls} resize-none`} /></div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={saveEdit} className="px-6 py-2.5 bg-tertiary text-white rounded-xl text-sm font-semibold hover:bg-tertiary-light transition-colors">Simpan Perubahan</button>
              <button type="button" onClick={() => setEditing(false)} className="px-6 py-2.5 border border-neutral-light rounded-xl text-sm font-semibold text-neutral-dark hover:bg-neutral-50 transition-colors">Batal</button>
            </div>
          </div>
        </div>
      )}

      <div className="card-hover bg-white rounded-2xl p-6 border border-neutral-light/30">
        <h3 className="font-semibold text-primary mb-5 flex items-center gap-2"><i className="fas fa-shield-alt text-tertiary"></i> Keamanan Akun</h3>
        <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl border border-primary/10">
          <div className="flex-1 min-w-0"><p className="font-semibold text-primary-dark">Keluar dari Sistem</p><p className="text-sm text-neutral">Anda akan keluar dari akun organisasi ini.</p></div>
          <button type="button" onClick={handleLogout} className="px-4 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0 font-medium">Keluar</button>
        </div>
      </div>
    </div>
  );
}
