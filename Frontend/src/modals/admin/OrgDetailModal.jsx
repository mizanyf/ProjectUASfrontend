const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const STATUS_STYLE = {
  'Aktif':     'bg-tertiary/10 text-tertiary border-tertiary/30',
  'Pending':   'bg-amber-50 text-amber-600 border-amber-200',
  'Non-aktif': 'bg-neutral-50 text-neutral border-neutral-light',
};

export default function OrgDetailModal({ isOpen, org, onClose, onEdit, onDelete }) {
  if (!isOpen || !org) return null;
  const initials = org.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="admin-card-modal relative w-full max-w-md rounded-2xl p-6 z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
              style={{ backgroundColor: org.color + '22', border: `2px solid ${org.color}50`, color: org.color }}>
              {initials}
            </div>
            <div className="min-w-0">
              <h3 className="text-primary-dark font-display font-bold text-lg leading-tight">{org.name}</h3>
              <p className="text-neutral text-sm mt-0.5">{org.type}</p>
              <span className={`inline-block mt-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_STYLE[org.status] || ''}`}>
                {org.status}
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral hover:text-neutral-dark transition-colors flex-shrink-0">
            <i className="fas fa-times text-sm" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
            <p className="text-neutral text-xs">Total Anggota</p>
            <p className="text-primary-dark font-display font-bold text-xl mt-0.5">{org.memberCount}</p>
          </div>
          <div className="p-3 bg-tertiary/5 rounded-xl border border-tertiary/10">
            <p className="text-neutral text-xs">Saldo Organisasi</p>
            <p className="text-tertiary font-display font-bold text-base mt-0.5 truncate">{fmt(org.balance)}</p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
            <i className="fas fa-envelope text-neutral-light w-4 text-center" />
            <p className="text-neutral-dark text-sm truncate">{org.email}</p>
          </div>
          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
            <i className="fas fa-phone text-neutral-light w-4 text-center" />
            <p className="text-neutral-dark text-sm">{org.phone}</p>
          </div>
          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
            <i className="fas fa-calendar text-neutral-light w-4 text-center" />
            <p className="text-neutral-dark text-sm">Terdaftar: {org.createdAt}</p>
          </div>
        </div>

        {org.description && (
          <div className="p-3 bg-neutral-50 rounded-xl mb-5">
            <p className="text-neutral text-xs mb-1">Deskripsi</p>
            <p className="text-neutral-dark text-sm leading-relaxed">{org.description}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-neutral-light/30">
          <button type="button" onClick={() => onDelete(org)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm font-semibold transition-all">
            <i className="fas fa-trash-alt text-xs" /> Hapus
          </button>
          <button type="button" onClick={() => onEdit(org)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/20">
            <i className="fas fa-pen text-xs" /> Edit Organisasi
          </button>
        </div>
      </div>
    </div>
  );
}
