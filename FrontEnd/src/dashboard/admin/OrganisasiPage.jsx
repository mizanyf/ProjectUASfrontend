import { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import OrgFormModal from '../../modals/admin/OrgFormModal';
import OrgDetailModal from '../../modals/admin/OrgDetailModal';

/* Admin-themed dropdown — same API as CustomSelect but styled for dark panel */
function AdminSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const selected = options.find(o => o === value) ?? value;
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="flex items-center justify-between gap-2 px-3 py-2.5 bg-slate-700/50 border border-white/10 rounded-xl text-slate-300 text-sm focus:outline-none hover:border-indigo-500/40 transition-all min-w-[160px]"
      >
        <span className="flex-1 truncate text-left">{selected}</span>
        <i className={`fas fa-chevron-down text-slate-500 flex-shrink-0 text-[11px] transition-transform duration-200 ${open ? 'rotate-180 text-indigo-400' : ''}`} />
      </button>
      {open && (
        <div
          className="absolute z-[70] left-0 min-w-max mt-1.5 rounded-xl overflow-hidden border border-white/10"
          style={{ background: '#1e293b', boxShadow: '0 10px 32px rgba(0,0,0,0.4)' }}
        >
          {options.map(opt => {
            const isSel = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2.5 ${
                  isSel ? 'bg-indigo-500/15 text-indigo-300 font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={`w-3.5 flex-shrink-0 ${isSel ? '' : 'opacity-0'}`}>
                  <i className="fas fa-check text-[10px]" />
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const STATUS_STYLE = {
  'Aktif':     'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  'Pending':   'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  'Non-aktif': 'bg-slate-600/20 text-slate-400 border border-slate-600/40',
};

const ORG_TYPES = ['Semua', 'Kemahasiswaan', 'Himpunan Mahasiswa', 'Unit Kegiatan Mahasiswa', 'Komunitas', 'Lembaga', 'OSIS'];
const ORG_STATUSES = ['Semua', 'Aktif', 'Pending', 'Non-aktif'];

function ConfirmDeleteModal({ org, onConfirm, onCancel }) {
  if (!org) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="admin-card-modal relative w-full max-w-sm rounded-2xl p-6 z-10">
        <div className="w-14 h-14 rounded-2xl bg-red-500/15 flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-trash-alt text-red-400 text-xl" />
        </div>
        <h3 className="text-white font-display font-bold text-lg text-center mb-2">Hapus Organisasi?</h3>
        <p className="text-slate-400 text-sm text-center mb-6">
          Anda akan menghapus <span className="text-white font-semibold">"{org.name}"</span> dari sistem. Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-semibold transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

function OrgRow({ org, onDetail, onEdit, onDelete }) {
  const initials = org.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
               style={{ backgroundColor: org.color + '25', border: `1px solid ${org.color}40`, color: org.color }}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate max-w-[160px]">{org.name}</p>
            <p className="text-slate-500 text-xs">{org.type}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 hidden md:table-cell">
        <p className="text-slate-300 text-sm">{org.email}</p>
      </td>
      <td className="px-4 py-4 hidden lg:table-cell">
        <p className="text-slate-300 text-sm">{org.memberCount} anggota</p>
      </td>
      <td className="px-4 py-4 hidden lg:table-cell">
        <p className="text-slate-300 text-sm">{fmt(org.balance)}</p>
      </td>
      <td className="px-4 py-4">
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[org.status] || ''}`}>
          {org.status}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onDetail(org)}
            title="Lihat Detail"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
          >
            <i className="fas fa-eye text-xs" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(org)}
            title="Edit"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
          >
            <i className="fas fa-pen text-xs" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(org)}
            title="Hapus"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <i className="fas fa-trash-alt text-xs" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function OrganisasiPage() {
  const { orgs, deleteOrg } = useAdmin();
  const showToast = useToast();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  const [modalForm, setModalForm] = useState({ open: false, org: null });  // null=add, obj=edit
  const [modalDetail, setModalDetail] = useState({ open: false, org: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = orgs.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = !q || o.name.toLowerCase().includes(q) || o.email.toLowerCase().includes(q) || o.type.toLowerCase().includes(q);
    const matchType   = filterType   === 'Semua' || o.type   === filterType;
    const matchStatus = filterStatus === 'Semua' || o.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const handleDelete = () => {
    deleteOrg(deleteTarget.id);
    showToast(`Organisasi "${deleteTarget.name}" berhasil dihapus`, 'success');
    setDeleteTarget(null);
  };

  return (
    <div className="page-enter space-y-5">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-display font-bold text-xl">Manajemen Organisasi</h2>
          <p className="text-slate-400 text-sm mt-0.5">{orgs.length} organisasi terdaftar di sistem</p>
        </div>
        <button
          type="button"
          onClick={() => setModalForm({ open: true, org: null })}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/25 self-start sm:self-auto"
        >
          <i className="fas fa-plus text-xs" />
          Tambah Organisasi
        </button>
      </div>

      {/* Filters */}
      <div className="admin-card rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0 max-w-[420px]">
            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama, email, atau tipe organisasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-700/50 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <i className="fas fa-times text-xs" />
              </button>
            )}
          </div>

          {/* Tipe */}
          <AdminSelect value={filterType} onChange={setFilterType} options={ORG_TYPES} />

          {/* Status */}
          <AdminSelect value={filterStatus} onChange={setFilterStatus} options={ORG_STATUSES} />
        </div>
      </div>

      {/* Table */}
      <div className="admin-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Organisasi</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Anggota</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Saldo</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((org) => (
                <OrgRow
                  key={org.id}
                  org={org}
                  onDetail={(o) => setModalDetail({ open: true, org: o })}
                  onEdit={(o) => setModalForm({ open: true, org: o })}
                  onDelete={(o) => setDeleteTarget(o)}
                />
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-search text-slate-500 text-xl" />
              </div>
              <p className="text-slate-400 font-semibold">Tidak ada organisasi ditemukan</p>
              <p className="text-slate-600 text-sm mt-1">Coba ubah filter pencarian</p>
            </div>
          )}
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
            <p className="text-slate-500 text-xs">Menampilkan {filtered.length} dari {orgs.length} organisasi</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-slate-500 text-xs">{orgs.filter(o => o.status === 'Aktif').length} aktif</span>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <OrgFormModal
        isOpen={modalForm.open}
        org={modalForm.org}
        onClose={() => setModalForm({ open: false, org: null })}
      />
      <OrgDetailModal
        isOpen={modalDetail.open}
        org={modalDetail.org}
        onClose={() => setModalDetail({ open: false, org: null })}
        onEdit={(o) => { setModalDetail({ open: false, org: null }); setModalForm({ open: true, org: o }); }}
        onDelete={(o) => { setModalDetail({ open: false, org: null }); setDeleteTarget(o); }}
      />
      <ConfirmDeleteModal
        org={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
