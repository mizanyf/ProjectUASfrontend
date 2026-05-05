import { formatRupiah } from '../../utils/formatters';

export default function StatCard({ label, value, icon, iconBg, valueColor, subText, subIcon }) {
  return (
    <div className="card-hover bg-white rounded-2xl p-5 border border-neutral-light/30">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-neutral uppercase tracking-wider">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
          <i className={`fas ${icon} text-sm ${valueColor}`}></i>
        </div>
      </div>
      <p className={`font-display font-bold text-2xl stat-number ${valueColor}`}>{formatRupiah(value)}</p>
      {subText && (
        <p className={`text-xs mt-1 ${valueColor}`}>
          {subIcon && <i className={`fas ${subIcon} mr-1`}></i>}
          {subText}
        </p>
      )}
    </div>
  );
}
