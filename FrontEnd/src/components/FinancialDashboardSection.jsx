import { useState } from "react";
import TopBar from "./TopBar";

// SVG Icons untuk Summary Cards
const IconWallet = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10H2V8h2V6a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m16-4h-4a2 2 0 100 4h4" />
    <circle cx="18" cy="14" r="1" fill="currentColor" />
  </svg>
);

const IconIncome = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconExpense = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 9l-6 6M9 9l6 6" />
  </svg>
);

// SVG Icons untuk Transaksi
const IconExpenseArrow = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
  </svg>
);

const IconIncomeArrow = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
  </svg>
);

const IconCalendar = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconAttachment = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
);

const IconClock = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconPlusCircle = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconChart = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const summaryCards = [
  {
    title: "SALDO KAS ORGANISASI",
    value: "Rp5.605.000",
    subtitle: "Total Saldo Akumulatif",
    icon: <IconWallet />,
    iconBg: "bg-[#083d561a]",
    iconColor: "text-[#083d56]",
  },
  {
    title: "PEMASUKAN",
    value: "Rp8.400.000",
    changeIcon: "↑",
    changeText: "+79% dari Bulan Lalu",
    changeColor: "text-[#00695c]",
    icon: <IconIncome />,
    iconBg: "bg-[#00695c1a]",
    iconColor: "text-[#00695c]",
  },
  {
    title: "PENGELUARAN",
    value: "Rp3.985.000",
    changeIcon: "↑",
    changeText: "+14% dari Bulan Lalu",
    changeColor: "text-red-500",
    icon: <IconExpense />,
    iconBg: "bg-red-50",
    iconColor: "text-red-400",
  },
];

const budgetItems = [
  {
    name: "Program Umum",
    percentage: "79%",
    color: "bg-[#00695c]",
    textColor: "text-[#00695c]",
    barWidth: "w-[79%]",
  },
  {
    name: "Pendidikan",
    percentage: "65%",
    color: "bg-[#083d56]",
    textColor: "text-[#083d56]",
    barWidth: "w-[65%]",
  },
  {
    name: "Kesehatan",
    percentage: "42%",
    color: "bg-[#00897b]",
    textColor: "text-[#00897b]",
    barWidth: "w-[42%]",
  },
  {
    name: "Sosial",
    percentage: "88%",
    color: "bg-[#546e7a]",
    textColor: "text-[#546e7a]",
    barWidth: "w-[88%]",
  },
];

const transactions = [
  {
    iconBg: "bg-red-50",
    iconColor: "text-red-400",
    icon: <IconExpenseArrow />,
    title: "Pembelian Banner Dies Natalis",
    date: "25 Okt 2024",
    amount: "-Rp350.000",
    amountColor: "text-red-500",
  },
  {
    iconBg: "bg-[#e0f2f1]",
    iconColor: "text-[#00695c]",
    icon: <IconIncomeArrow />,
    title: "Iuran Anggota Minggu Ini",
    date: "24 Okt 2024",
    amount: "+Rp800.000",
    amountColor: "text-[#00695c]",
  },
  {
    iconBg: "bg-red-50",
    iconColor: "text-red-400",
    icon: <IconExpenseArrow />,
    title: "Konsumsi Rapat Koordinasi",
    date: "23 Okt 2024",
    amount: "-Rp375.000",
    amountColor: "text-red-500",
  },
  {
    iconBg: "bg-red-50",
    iconColor: "text-red-400",
    icon: <IconExpenseArrow />,
    title: "Cetak Brosur",
    date: "22 Okt 2024",
    amount: "-Rp420.000",
    amountColor: "text-red-500",
  },
  {
    iconBg: "bg-[#e0f2f1]",
    iconColor: "text-[#00695c]",
    icon: <IconIncomeArrow />,
    title: "Sponsorship PT. Maju Jaya",
    date: "21 Okt 2024",
    amount: "+Rp5.000.000",
    amountColor: "text-[#00695c]",
    attachment: "1 file",
  },
];

const paymentAgendaItems = [
  {
    title: "Sewa Aula",
    date: "15 Okt 2024",
    amount: "Rp2.500.000",
  },
  {
    title: "Konsumsi Rapat",
    date: "18 Okt 2024",
    amount: "Rp750.000",
  },
  {
    title: "Cetak Brosur",
    date: "22 Okt 2024",
    amount: "Rp1.200.000",
  },
  {
    title: "Bayar Listrik",
    date: "25 Okt 2024",
    amount: "Rp480.000",
  },
];

export const FinancialDashboardSection = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <TopBar organizationName="BEM Fakultas Vokasi" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {summaryCards.map((card, index) => (
              <article
                key={card.title}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-400 tracking-wide">{card.title}</p>
                    <p className="text-2xl font-bold text-[#083d56] mt-2">{card.value}</p>
                    {card.subtitle && (
                      <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
                    )}
                    {card.changeText && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className={`text-xs ${card.changeColor}`}>{card.changeIcon}</span>
                        <span className={`text-xs ${card.changeColor}`}>{card.changeText}</span>
                      </div>
                    )}
                  </div>
                  <div className={`w-10 h-10 flex items-center justify-center ${card.iconBg} rounded-lg`}>
                    <div className={`${card.iconColor}`}>{card.icon}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Chart Section */}
            <section className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-[#00695c]">
                  <IconChart />
                </div>
                <h2 className="font-semibold text-[#083d56] text-sm">
                  Pemasukan & Pengeluaran 6 Bulan Terakhir
                </h2>
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Grafik akan ditampilkan di sini</p>
              </div>
            </section>

            {/* Budget Realization */}
            <section className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-[#083d56] text-sm">
                  Realisasi Anggaran
                </h2>
                <button className="text-[#00695c] text-xs font-semibold hover:underline">
                  Revisi
                </button>
              </div>
              
              <div className="space-y-4">
                {budgetItems.map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{item.name}</span>
                      <span className={item.textColor}>{item.percentage}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} ${item.barWidth} rounded-full transition-all duration-500`} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Transactions & Payment Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <section className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-[#083d56] text-sm">
                  Transaksi Terakhir
                </h2>
                <button className="text-[#00695c] text-xs font-semibold hover:underline">
                  Lihat Semua
                </button>
              </div>
              
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 flex items-center justify-center ${transaction.iconBg} rounded-xl`}>
                        <div className={`${transaction.iconColor}`}>{transaction.icon}</div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{transaction.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <IconCalendar />
                          <p className="text-xs text-gray-400">{transaction.date}</p>
                        </div>
                        {transaction.attachment && (
                          <div className="flex items-center gap-1 mt-1">
                            <IconAttachment />
                            <p className="text-xs text-gray-400">{transaction.attachment}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className={`text-sm font-bold ${transaction.amountColor}`}>
                      {transaction.amount}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Payment Agenda */}
            <section className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-[#083d56] text-sm">
                  Agenda Pembayaran
                </h2>
                <button className="w-7 h-7 flex items-center justify-center bg-[#00695c1a] rounded-lg hover:bg-[#00695c30] transition">
                  <IconPlusCircle />
                </button>
              </div>
              
              <div className="space-y-3">
                {paymentAgendaItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[#fffbeb] rounded-xl border border-amber-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-xl">
                        <IconClock />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <IconCalendar />
                          <p className="text-xs text-gray-400">{item.date}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-amber-700">{item.amount}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};