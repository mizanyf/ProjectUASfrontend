import { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import OrgFormModal from '../../modals/admin/OrgFormModal';
import OrgDetailModal from '../../modals/admin/OrgDetailModal';

const STATUS_STYLE = {
  'Aktif':     'bg-tertiary/10 text-tertiary border border-tertiary/30',
  'Pending':   'bg-amber-50 text-amber-600 border border-amber-200',
  'Non-aktif': 'bg-neutral-50 text-neutral border border-neutral-light',
};
const ORG_TYPES    = ['Semua','Kemahasiswaan','Himpunan Mahasiswa','Unit Kegiatan Mahasiswa','OSIS','Lembaga','Komunitas','Yayasan','Lainnya'];
const ORG_STATUSES = ['Semua','Aktif','Pending','Non-aktif'];

function AdminSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(p => !p)}
        className="flex items-center justify-between gap-2 px-3 py-2.5 bg-white border border-neutral-light rounded-xl text-neutral-dark text-sm hover:border-tertiary/50 transition-all min-w-[160px]">
        <span className="flex-1 truncate text-left">{value}</span>
        <i className={`fas fa-chevron-down text-neutral flex-shrink-0 text-[11px] transition-transform ${open ? 'rotate-180 text-tertiary' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-[70] left-0 min-w-max mt-1.5 rounded-xl overflow-hidden border border-neutral-light/50 bg-white"
          style={{ boxShadow: '0 10px 32px rgba(8,61,86,0.12)' }}>
          {options.map(opt => {
            const sel = opt === value;
            return (
              <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors
                  ${sel ? 'bg-tertiary/10 text-tertiary font-semibold' : 'text-neutral-dark hover:bg-neutral-50'}`}>
                <span className={`w-3.5 ${sel ? '' : 'opacity-0'}`}><i className="fas fa-check text-[10px]"/></span>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ConfirmDeleteModal({ org, onConfirm, onCancel }) {
  if (!org) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="admin-card-modal relative w-full max-w-sm rounded-2xl p-6 z-10">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-trash-alt text-red-500 text-xl" />
        </div>
        <h3 className="text-primary-dark font-display font-bold text-lg text-center mb-2">Hapus Organisasi?</h3>
        <p className="text-neutral text-sm text-center mb-6">Anda akan menghapus <span className="text-neutral-dark font-semibold">"{org.name}"</span>. Tindakan ini tidak dapat dibatalkan.</p>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-neutral-light text-neutral-dark hover:bg-neutral-50 text-sm font-semibold transition-all">Batal</button>
          <button type="button" onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all">Hapus</button>
        </div>
      </div>
    </div>
  );
}

function OrgRow({ org, onDetail, onEdit, onDelete }) {
  const initials = org.name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
  const fmt = (n) => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
  return (
    <tr className="border-t border-neutral-light/30 hover:bg-neutral-50/50 transition-colors group">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
            style={{ backgroundColor: org.color+'22', border:`1px solid ${org.color}40`, color: org.color }}>{initials}</div>
          <div className="min-w-0">
            <p className="text-neutral-dark text-sm font-semibold truncate max-w-[160px]">{org.name}</p>
            <p className="text-neutral text-xs">{org.type}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 hidden md:table-cell"><p className="text-neutral-dark text-sm">{org.email}</p></td>
      <td className="px-4 py-4 hidden lg:table-cell"><p className="text-neutral-dark text-sm">{org.memberCount} anggota</p></td>
      <td className="px-4 py-4 hidden lg:table-cell"><p className="text-neutral-dark text-sm">{fmt(org.balance)}</p></td>
      <td className="px-4 py-4"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[org.status]||''}`}>{org.status}</span></td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button type="button" onClick={() => onDetail(org)} title="Lihat" className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-light hover:text-primary hover:bg-primary/10 transition-all"><i className="fas fa-eye text-xs"/></button>
          <button type="button" onClick={() => onEdit(org)} title="Edit" className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-light hover:text-amber-500 hover:bg-amber-50 transition-all"><i className="fas fa-pen text-xs"/></button>
          <button type="button" onClick={() => onDelete(org)} title="Hapus" className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-light hover:text-red-500 hover:bg-red-50 transition-all"><i className="fas fa-trash-alt text-xs"/></button>
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
  const [modalForm, setModalForm] = useState({ open: false, org: null });
  const [modalDetail, setModalDetail] = useState({ open: false, org: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = orgs.filter(o => {
    const q = search.toLowerCase();
    return (!q || o.name.toLowerCase().includes(q) || o.email.toLowerCase().includes(q) || o.type.toLowerCase().includes(q))
      && (filterType   === 'Semua' || o.type   === filterType)
      && (filterStatus === 'Semua' || o.status === filterStatus);
  });

  const handleDelete = () => { deleteOrg(deleteTarget.id); showToast(`"${deleteTarget.name}" dihapus`, 'success'); setDeleteTarget(null); };

  return (
    <div className="page-enter space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-primary-dark font-display font-bold text-xl">Manajemen Organisasi</h2>
          <p className="text-neutral text-sm mt-0.5">{orgs.length} organisasi terdaftar di sistem</p>
        </div>
        <button type="button" onClick={() => setModalForm({ open: true, org: null })}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/20 self-start sm:self-auto">
          <i className="fas fa-plus text-xs" /> Tambah Organisasi
        </button>
      </div>

      <div className="admin-card rounded-2xl p-4 relative z-20">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 min-w-0 max-w-[420px]">
            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral text-sm pointer-events-none" />
            <input type="text" placeholder="Cari nama, email, atau tipe..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-light rounded-xl text-neutral-dark text-sm placeholder-neutral focus:outline-none focus:border-tertiary focus:ring-2 focus:ring-tertiary/15 transition-all" />
            {search && <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral hover:text-neutral-dark"><i className="fas fa-times text-xs"/></button>}
          </div>
          <AdminSelect value={filterType}   onChange={setFilterType}   options={ORG_TYPES} />
          <AdminSelect value={filterStatus} onChange={setFilterStatus} options={ORG_STATUSES} />
        </div>
      </div>

      <div className="admin-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50/80">
                {['Organisasi','Email','Anggota','Saldo','Status','Aksi'].map((h,i) => (
                  <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold text-neutral uppercase tracking-wider ${i===1?'hidden md:table-cell':''} ${i===2||i===3?'hidden lg:table-cell':''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(org => (
                <OrgRow key={org.id} org={org}
                  onDetail={o => setModalDetail({ open: true, org: o })}
                  onEdit={o => setModalForm({ open: true, org: o })}
                  onDelete={o => setDeleteTarget(o)} />
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center mx-auto mb-4"><i className="fas fa-search text-neutral-light text-xl"/></div>
              <p className="text-neutral-dark font-semibold">Tidak ada organisasi ditemukan</p>
              <p className="text-neutral text-sm mt-1">Coba ubah filter pencarian</p>
            </div>
          )}
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-neutral-light/30 flex items-center justify-between">
            <p className="text-neutral text-xs">Menampilkan {filtered.length} dari {orgs.length} organisasi</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-tertiary" />
              <span className="text-neutral text-xs">{orgs.filter(o => o.status==='Aktif').length} aktif</span>
            </div>
          </div>
        )}
      </div>

      <OrgFormModal isOpen={modalForm.open} org={modalForm.org} onClose={() => setModalForm({ open: false, org: null })} />
      <OrgDetailModal isOpen={modalDetail.open} org={modalDetail.org} onClose={() => setModalDetail({ open: false, org: null })}
        onEdit={o => { setModalDetail({ open: false, org: null }); setModalForm({ open: true, org: o }); }}
        onDelete={o => { setModalDetail({ open: false, org: null }); setDeleteTarget(o); }} />
      <ConfirmDeleteModal org={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
