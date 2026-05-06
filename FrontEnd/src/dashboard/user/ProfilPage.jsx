import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { getInitials } from '../../utils/formatters';

export default function ProfilPage({ onLogout, onNavigate }) {
  const { state, updateProfile } = useApp();
  const showToast = useToast();
  const { profile } = state;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', type: '', email: '', phone: '', description: '' });

  const initials = getInitials(profile.name);

  const openEdit = () => {
    setForm({ name: profile.name, type: profile.type, email: profile.email, phone: profile.phone, description: profile.description });
    setEditing(true);
  };

  const saveEdit = () => {
    if (!form.name || !form.type || !form.email || !form.phone) {
      showToast('Semua field wajib diisi', 'error'); return;
    }
    updateProfile(form);
    setEditing(false);
    showToast('Profil organisasi berhasil diperbarui', 'success');
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Hanya file gambar', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('Maksimal 5MB', 'error'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { updateProfile({ photo: ev.target.result }); showToast('Logo organisasi diperbarui', 'success'); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="page-enter space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-neutral-light/30 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary via-primary-light to-tertiary relative">
          <button type="button" onClick={editing ? () => setEditing(false) : openEdit}
            className="absolute top-4 right-4 px-4 py-2 bg-white/20 backdrop-blur text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-2">
            <i className={`fas ${editing ? 'fa-times' : 'fa-pen'} text-xs`} />
            {editing ? 'Batal Edit' : 'Edit Profil'}
          </button>
        </div>

        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Profile photo */}
            <div className="profile-photo-wrap bg-primary-light flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 ring-4 ring-white shadow-lg"
              onClick={() => document.getElementById('profile-photo-input').click()}>
              {profile.photo
                ? <img src={profile.photo} alt="" className="w-full h-full object-cover" />
                : <span>{initials}</span>
              }
              <div className="profile-photo-overlay">
                <i className="fas fa-camera text-white text-lg mb-1" />
                <span className="text-white text-[10px] font-medium">Ubah Logo</span>
              </div>
              <input type="file" id="profile-photo-input" accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={handlePhoto} />
            </div>

            <div className="pt-2 sm:pt-14 flex-1 w-full">
              <h3 className="text-xl font-bold text-primary-dark">{profile.name}</h3>
              <p className="text-sm text-neutral mt-0.5">{profile.type}</p>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="inline-flex items-center gap-1.5 text-xs text-neutral bg-neutral-50 px-3 py-1.5 rounded-lg">
                  <i className="fas fa-envelope text-tertiary" /> {profile.email}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-neutral bg-neutral-50 px-3 py-1.5 rounded-lg">
                  <i className="fas fa-phone text-tertiary" /> {profile.phone}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 border-t border-neutral-light/50 pt-4">
          <h4 className="text-xs font-semibold text-neutral uppercase tracking-wider mb-2">Tentang Kami</h4>
          <p className="text-sm text-neutral-dark leading-relaxed">{profile.description}</p>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="card-hover bg-white rounded-2xl p-6 border border-neutral-light/30 page-enter">
          <h3 className="font-semibold text-primary mb-5 flex items-center gap-2">
            <i className="fas fa-edit text-tertiary" /> Edit Data Organisasi
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral uppercase tracking-wider mb-1.5">Nama Organisasi</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-styled w-full px-4 py-2.5 border border-neutral-light rounded-xl text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral uppercase tracking-wider mb-1.5">Jenis</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="input-styled w-full px-4 py-2.5 border border-neutral-light rounded-xl text-sm outline-none transition-all text-neutral">
                  {['Kemahasiswaan', 'Yayasan', 'Komunitas', 'UKM'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral uppercase tracking-wider mb-1.5">Email</label>
                <div className="flex items-center gap-2">
                  <input type="email" value={form.email} readOnly disabled
                    className="input-styled flex-1 px-4 py-2.5 border border-neutral-light rounded-xl text-sm outline-none transition-all bg-neutral-50 text-neutral-dark cursor-not-allowed opacity-70" />
                  <button type="button" onClick={() => onNavigate('pengaturan')}
                    className="px-4 py-2.5 text-xs font-semibold text-tertiary bg-tertiary-50 hover:bg-tertiary/20 rounded-xl transition-colors whitespace-nowrap">
                    Ubah
                  </button>
                </div>
                <p className="text-[10px] text-neutral mt-1.5">
                  <i className="fas fa-shield-alt mr-1" />Untuk keamanan, perubahan email dilakukan di Pengaturan
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral uppercase tracking-wider mb-1.5">No. Telepon</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-styled w-full px-4 py-2.5 border border-neutral-light rounded-xl text-sm outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral uppercase tracking-wider mb-1.5">Deskripsi</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-styled w-full px-4 py-2.5 border border-neutral-light rounded-xl text-sm outline-none transition-all resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={saveEdit}
                className="px-6 py-2.5 bg-tertiary text-white rounded-xl text-sm font-semibold hover:bg-tertiary-light transition-colors">
                Simpan Perubahan
              </button>
              <button type="button" onClick={() => setEditing(false)}
                className="px-6 py-2.5 border border-neutral-light rounded-xl text-sm font-semibold text-neutral-dark hover:bg-neutral-50 transition-colors">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Card */}
      <div className="card-hover bg-white rounded-2xl p-6 border border-neutral-light/30">
        <h3 className="font-semibold text-primary mb-5 flex items-center gap-2">
          <i className="fas fa-shield-alt text-tertiary" /> Keamanan Akun
        </h3>
        <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl border border-primary/10">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-primary-dark">Keluar dari Sistem</p>
            <p className="text-sm text-neutral">Anda akan keluar dari akun organisasi ini.</p>
          </div>
          <button type="button" onClick={onLogout}
            className="px-4 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0 font-medium">
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
