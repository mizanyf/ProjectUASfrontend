import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';

const ORG_TYPES = ['Kemahasiswaan', 'Himpunan Mahasiswa', 'Unit Kegiatan Mahasiswa', 'Komunitas', 'Lembaga', 'OSIS', 'Lainnya'];
const ORG_STATUSES = ['Aktif', 'Pending', 'Non-aktif'];

const EMPTY = { name: '', type: 'Kemahasiswaan', email: '', phone: '', status: 'Aktif', description: '' };

export default function OrgFormModal({ isOpen, org, onClose }) {
  const { addOrg, editOrg } = useAdmin();
  const showToast = useToast();
  const isEdit = !!org;

  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (isOpen) {
      setForm(org ? { name: org.name, type: org.type, email: org.email, phone: org.phone, status: org.status, description: org.description } : EMPTY);
    }
  }, [isOpen, org]);

  if (!isOpen) return null;

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.name.trim())  { showToast('Nama organisasi wajib diisi', 'error'); return; }
    if (!form.email.trim()) { showToast('Email wajib diisi', 'error'); return; }
    if (isEdit) {
      editOrg(org.id, form);
      showToast('Organisasi berhasil diperbarui', 'success');
    } else {
      addOrg(form);
      showToast('Organisasi berhasil ditambahkan', 'success');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="admin-card-modal relative w-full max-w-lg rounded-2xl z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 flex items-center justify-center">
              <i className={`fas ${isEdit ? 'fa-pen' : 'fa-plus'} text-indigo-400 text-sm`} />
            </div>
            <div>
              <h3 className="text-white font-display font-bold">{isEdit ? 'Edit Organisasi' : 'Tambah Organisasi'}</h3>
              <p className="text-slate-500 text-xs">{isEdit ? `Memperbarui data "${org.name}"` : 'Daftarkan organisasi baru'}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all">
            <i className="fas fa-times text-sm" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Nama Organisasi <span className="text-red-400">*</span></label>
            <input
              type="text"
              placeholder="Contoh: BEM Fakultas Ilmu Komputer"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="admin-input w-full px-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          {/* Tipe + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-sm mb-1.5">Tipe Organisasi</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)} className="admin-input admin-select w-full px-3 py-2.5 rounded-xl text-sm">
                {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className="admin-input admin-select w-full px-3 py-2.5 rounded-xl text-sm">
                {ORG_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Email <span className="text-red-400">*</span></label>
            <input
              type="email"
              placeholder="email@organisasi.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className="admin-input w-full px-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          {/* Telepon */}
          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Nomor Telepon</label>
            <input
              type="text"
              placeholder="08xx-xxxx-xxxx"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              className="admin-input w-full px-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Deskripsi</label>
            <textarea
              rows={3}
              placeholder="Deskripsi singkat tentang organisasi ini..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              className="admin-input w-full px-4 py-2.5 rounded-xl text-sm resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/8 flex-shrink-0 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-semibold transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/20"
          >
            <i className={`fas ${isEdit ? 'fa-save' : 'fa-plus'} mr-1.5`} />
            {isEdit ? 'Simpan Perubahan' : 'Tambah Organisasi'}
          </button>
        </div>
      </div>
    </div>
  );
}
