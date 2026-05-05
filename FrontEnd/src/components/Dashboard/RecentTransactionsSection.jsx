const formatRupiah = (n) => "Rp" + Number(n).toLocaleString("id-ID");
const formatDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

export const RecentTransactionsSection = ({ transactions = [], onViewAll }) => {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-[#083d56] text-sm">Transaksi Terakhir</h2>
        <button onClick={onViewAll} className="text-[#00695c] text-xs font-semibold hover:underline">
          Lihat Semua
        </button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">Belum ada transaksi</div>
        ) : transactions.map((t) => {
          const isM = t.type === "pemasukan";
          return (
            <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isM ? "bg-[#e0f2f1]" : "bg-red-50"}`}>
                <svg className={`w-4 h-4 ${isM ? "text-[#00695c]" : "text-red-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isM
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m-8-8l8 8 8-8" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20V4m-8 8l8-8 8 8" />
                  }
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{t.desc}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(t.date)}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`font-bold text-sm ${isM ? "text-[#00695c]" : "text-red-500"}`}>
                  {isM ? "+" : "-"}{formatRupiah(t.amount)}
                </p>
                {t.docs?.length > 0 && (
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    <i className="fas fa-paperclip mr-0.5" />{t.docs.length} file
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecentTransactionsSection;