import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';

<<<<<<< HEAD
const ORG_TYPES    = ['Kemahasiswaan', 'Himpunan Mahasiswa', 'Unit Kegiatan Mahasiswa', 'OSIS', 'Lembaga', 'Komunitas', 'Yayasan', 'Lainnya'];
const ORG_STATUSES = ['Aktif', 'Pending', 'Non-aktif'];
const EMPTY = { name: '', type: 'Kemahasiswaan', email: '', phone: '', status: 'Aktif', description: '' };
=======
const ORG_TYPES    = ['Kemahasiswaan','Himpunan Mahasiswa','Unit Kegiatan Mahasiswa','OSIS','Lembaga','Komunitas','Yayasan','Lainnya'];
const ORG_STATUSES = ['Aktif','Pending','Non-aktif'];
const EMPTY = { name:'', type:'Kemahasiswaan', email:'', phone:'', status:'Aktif', description:'' };
>>>>>>> frontmoneflo

export default function OrgFormModal({ isOpen, org, onClose }) {
  const { addOrg, editOrg } = useAdmin();
  const showToast = useToast();
  const isEdit = !!org;
<<<<<<< HEAD

=======
>>>>>>> frontmoneflo
  const [form, setForm] = useState(EMPTY);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    if (isOpen) {
      setForm(org
        ? { name: org.name, type: org.type, email: org.email, phone: org.phone, status: org.status, description: org.description }
        : EMPTY);
    }
  }, [isOpen, org]);

  if (!isOpen) return null;

  const handleSave = () => {
<<<<<<< HEAD
    if (!form.name || !form.type || !form.email || !form.phone) {
      showToast('Lengkapi semua data wajib', 'error'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      showToast('Format email tidak valid', 'error'); return;
    }
    if (isEdit) {
      editOrg(org.id, form);
      showToast('Data organisasi berhasil diperbarui', 'success');
    } else {
      addOrg(form);
      showToast('Organisasi berhasil ditambahkan', 'success');
    }
    onClose();
  };

  const LBL = 'block text-slate-300 text-sm font-medium mb-1.5';
  const INP = 'w-full px-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-indigo-500/60 transition-all placeholder-slate-500';

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
=======
    if (!form.name || !form.type || !form.email || !form.phone) { showToast('Lengkapi semua data wajib','error'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { showToast('Format email tidak valid','error'); return; }
    if (isEdit) { editOrg(org.id, form); showToast('Data organisasi berhasil diperbarui','success'); }
    else { addOrg(form); showToast('Organisasi berhasil ditambahkan','success'); }
    onClose();
  };

  const LBL = 'block text-neutral-dark text-sm font-medium mb-1.5';
  const INP = 'w-full px-4 py-2.5 bg-white border border-neutral-light rounded-xl text-neutral-dark text-sm outline-none focus:border-tertiary focus:ring-2 focus:ring-tertiary/15 transition-all placeholder-neutral';

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
>>>>>>> frontmoneflo
      <div className="admin-card-modal relative w-full max-w-lg rounded-2xl p-6 z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 flex items-center justify-center">
              <i className={`fas ${isEdit ? 'fa-pen' : 'fa-plus'} text-indigo-400 text-sm`} />
            </div>
            <h3 className="text-white font-display font-bold">{isEdit ? 'Edit Organisasi' : 'Tambah Organisasi'}</h3>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
=======
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <i className={`fas ${isEdit ? 'fa-pen' : 'fa-plus'} text-primary text-sm`} />
            </div>
            <h3 className="text-primary-dark font-display font-bold">{isEdit ? 'Edit Organisasi' : 'Tambah Organisasi'}</h3>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral hover:text-neutral-dark transition-colors">
>>>>>>> frontmoneflo
            <i className="fas fa-times text-sm" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
<<<<<<< HEAD
            <label className={LBL}>Nama Organisasi <span className="text-red-400">*</span></label>
            <input type="text" value={form.name} onChange={set('name')} placeholder="Contoh: BEM Fakultas Teknik" className={INP} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={LBL}>Jenis Organisasi <span className="text-red-400">*</span></label>
              <select value={form.type} onChange={set('type')} className={INP + ' cursor-pointer'}>
                {ORG_TYPES.map(t => <option key={t} value={t} className="bg-slate-800">{t}</option>)}
              </select>
            </div>
            <div>
              <label className={LBL}>Status <span className="text-red-400">*</span></label>
              <select value={form.status} onChange={set('status')} className={INP + ' cursor-pointer'}>
                {ORG_STATUSES.map(s => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={LBL}>Email Resmi <span className="text-red-400">*</span></label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="humas@organisasi.com" className={INP} />
          </div>

          <div>
            <label className={LBL}>No. Telepon <span className="text-red-400">*</span></label>
            <input type="tel" value={form.phone} onChange={set('phone')} placeholder="08xxxxxxxxxx" className={INP} />
          </div>

          <div>
            <label className={LBL}>Deskripsi</label>
            <textarea rows={3} value={form.description} onChange={set('description')}
              placeholder="Ceritakan sedikit tentang organisasi..."
              className={INP + ' resize-none'} />
=======
            <label className={LBL}>Nama Organisasi <span className="text-red-500">*</span></label>
            <input type="text" value={form.name} onChange={set('name')} placeholder="Contoh: BEM Fakultas Teknik" className={INP} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={LBL}>Jenis Organisasi <span className="text-red-500">*</span></label>
              <select value={form.type} onChange={set('type')} className={INP + ' admin-select'}>
                {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={LBL}>Status <span className="text-red-500">*</span></label>
              <select value={form.status} onChange={set('status')} className={INP + ' admin-select'}>
                {ORG_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={LBL}>Email Resmi <span className="text-red-500">*</span></label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="humas@organisasi.com" className={INP} />
          </div>
          <div>
            <label className={LBL}>No. Telepon <span className="text-red-500">*</span></label>
            <input type="tel" value={form.phone} onChange={set('phone')} placeholder="08xxxxxxxxxx" className={INP} />
          </div>
          <div>
            <label className={LBL}>Deskripsi</label>
            <textarea rows={3} value={form.description} onChange={set('description')}
              placeholder="Ceritakan sedikit tentang organisasi..." className={INP + ' resize-none'} />
>>>>>>> frontmoneflo
          </div>
        </div>

        {/* Footer */}
<<<<<<< HEAD
        <div className="flex gap-3 mt-6 pt-5 border-t border-white/5">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-semibold transition-all">
            Batal
          </button>
          <button type="button" onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/25">
=======
        <div className="flex gap-3 mt-6 pt-5 border-t border-neutral-light/30">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-neutral-light text-neutral-dark hover:bg-neutral-50 text-sm font-semibold transition-all">
            Batal
          </button>
          <button type="button" onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/20">
>>>>>>> frontmoneflo
            {isEdit ? 'Simpan Perubahan' : 'Tambah Organisasi'}
          </button>
        </div>
      </div>
    </div>
  );
}
