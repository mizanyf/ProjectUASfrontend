const STATUS_STYLE = {
  'Aktif':     'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  'Pending':   'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  'Non-aktif': 'bg-slate-600/20 text-slate-400 border border-slate-600/40',
};

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center flex-shrink-0 mt-0.5">
        <i className={`fas ${icon} text-slate-400 text-xs`} />
      </div>
      <div>
        <p className="text-slate-500 text-xs">{label}</p>
        <p className="text-slate-200 text-sm font-medium mt-0.5">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function OrgDetailModal({ isOpen, org, onClose, onEdit, onDelete }) {
  if (!isOpen || !org) return null;

  const initials = org.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="admin-card-modal relative w-full max-w-md rounded-2xl z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 flex-shrink-0">
          <h3 className="text-white font-display font-bold">Detail Organisasi</h3>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all">
            <i className="fas fa-times text-sm" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-5 p-4 rounded-2xl"
               style={{ background: org.color + '12', border: `1px solid ${org.color}25` }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-display font-bold flex-shrink-0"
                 style={{ background: org.color + '30', color: org.color, border: `2px solid ${org.color}50` }}>
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white font-display font-bold text-base leading-snug">{org.name}</p>
              <p className="text-slate-400 text-sm mt-0.5">{org.type}</p>
              <span className={`inline-block mt-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLE[org.status] || ''}`}>
                {org.status}
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="admin-card-inner rounded-xl p-3.5 text-center">
              <p className="text-2xl font-display font-bold text-white">{org.memberCount}</p>
              <p className="text-slate-500 text-xs mt-0.5">Anggota</p>
            </div>
            <div className="admin-card-inner rounded-xl p-3.5 text-center">
              <p className="text-xl font-display font-bold text-white">{fmt(org.balance)}</p>
              <p className="text-slate-500 text-xs mt-0.5">Saldo</p>
            </div>
          </div>

          {/* Info */}
          <InfoRow icon="fa-envelope" label="Email"              value={org.email} />
          <InfoRow icon="fa-phone"   label="Telepon"            value={org.phone} />
          <InfoRow icon="fa-calendar" label="Terdaftar Sejak"   value={formatDate(org.createdAt)} />
          <InfoRow icon="fa-align-left" label="Deskripsi"       value={org.description} />
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-white/8 flex-shrink-0 flex gap-2">
          <button
            type="button"
            onClick={() => onDelete(org)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-semibold transition-all"
          >
            <i className="fas fa-trash-alt text-xs" /> Hapus
          </button>
          <button
            type="button"
            onClick={() => onEdit(org)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all"
          >
            <i className="fas fa-pen text-xs" /> Edit Organisasi
          </button>
        </div>
      </div>
    </div>
  );
}
