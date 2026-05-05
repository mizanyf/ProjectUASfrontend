import { useApp } from "../../context/AppContext";

const formatRupiah = (n) => "Rp" + Number(n).toLocaleString("id-ID");

const IconWallet = () => (
  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10H2V8h2V6a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m16-4h-4a2 2 0 100 4h4" />
    <circle cx="18" cy="14" r="1" fill="currentColor" />
  </svg>
);

const IconIncome = () => (
  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8l-8 8-8-8" />
  </svg>
);

const IconExpense = () => (
  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 20V4m-8 8l8-8 8 8" />
  </svg>
);

/**
 * SummaryCards — works for both Dashboard (beranda) and Transaksi / Laporan pages.
 * Props:
 *  - variant: "dashboard" | "transactions" | "laporan"
 *  - filteredTransactions: optional, used for masuk/keluar display in filtered view
 *  - allTransactions: optional, falls back to context data
 */
export const SummaryCards = ({
  variant = "dashboard",
  filteredTransactions,
  allTransactions,
}) => {
  const { transactions: ctxTransactions } = useApp();

  const allTxns = allTransactions ?? ctxTransactions;
  const displayTxns = filteredTransactions ?? allTxns;

  // Total accumulated balance always from ALL transactions
  const totalAllIncome = allTxns.reduce((s, t) => t.type === "pemasukan" ? s + t.amount : s, 0);
  const totalAllExpense = allTxns.reduce((s, t) => t.type === "pengeluaran" ? s + t.amount : s, 0);
  const saldo = totalAllIncome - totalAllExpense;

  // Displayed income/expense from filtered set
  const totalMasuk = displayTxns.reduce((s, t) => t.type === "pemasukan" ? s + t.amount : s, 0);
  const totalKeluar = displayTxns.reduce((s, t) => t.type === "pengeluaran" ? s + t.amount : s, 0);

  const cards = [
    {
      title: variant === "dashboard" ? "SALDO KAS ORGANISASI" : "SALDO SAAT INI",
      value: formatRupiah(saldo),
      sub: "Total Saldo Akumulatif",
      subColor: "text-[#00695c]",
      icon: <IconWallet />,
      iconBg: "bg-[#083d561a]",
      iconColor: "text-[#083d56]",
      valueColor: "text-[#083d56]",
      isSaldo: true,
    },
    {
      title: "PEMASUKAN",
      value: formatRupiah(totalMasuk),
      sub: "Periode terpilih",
      subColor: "text-[#00695c]",
      icon: <IconIncome />,
      iconBg: "bg-[#00695c1a]",
      iconColor: "text-[#00695c]",
      valueColor: "text-[#00695c]",
      isSaldo: false,
    },
    {
      title: "PENGELUARAN",
      value: formatRupiah(totalKeluar),
      sub: "Periode terpilih",
      subColor: "text-red-500",
      icon: <IconExpense />,
      iconBg: "bg-red-50",
      iconColor: "text-red-400",
      valueColor: "text-red-500",
      isSaldo: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
      {cards.map((card) => (
        <article key={card.title} className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.title}</span>
            <div className={`w-8 h-8 md:w-9 md:h-9 rounded-lg ${card.iconBg} flex items-center justify-center`}>
              <div className={card.iconColor}>{card.icon}</div>
            </div>
          </div>
          <p className={`font-bold text-xl md:text-2xl ${card.valueColor}`}>{card.value}</p>
          <p className={`text-xs mt-1 ${card.subColor}`}>
            {card.isSaldo
              ? <><i className="fas fa-wallet mr-1" />{card.sub}</>
              : card.sub
            }
          </p>
        </article>
      ))}
    </div>
  );
};

export default SummaryCards;