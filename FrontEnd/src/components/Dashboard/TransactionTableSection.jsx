import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { SummaryCards } from "./SummaryCards";

const formatRupiah = (n) => "Rp" + Number(n).toLocaleString("id-ID");
const formatDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

export const TransactionTableSection = () => {
  const { transactions } = useApp();
  const today = new Date();

  const [timeFilter, setTimeFilter] = useState("bulan");
  const [typeFilter, setTypeFilter] = useState("semua");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filtered = useMemo(() => {
    let data = transactions.slice();
    if (timeFilter === "bulan") {
      data = data.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      });
    } else if (timeFilter === "custom" && (startDate || endDate)) {
      data = data.filter((t) => {
        const d = new Date(t.date);
        if (startDate && d < new Date(startDate)) return false;
        if (endDate && d > new Date(endDate)) return false;
        return true;
      });
    }
    if (typeFilter !== "semua") {
      data = data.filter((t) => t.type === typeFilter);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      data = data.filter((t) => t.desc.toLowerCase().includes(s) || t.cat.toLowerCase().includes(s));
    }
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, timeFilter, typeFilter, search, startDate, endDate, today]);

  const handleTimeFilter = (t) => {
    setTimeFilter(t);
    setStartDate("");
    setEndDate("");
  };

  const handleCustomDate = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    if (start || end) setTimeFilter("custom");
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Summary Cards */}
      <SummaryCards variant="transactions" filteredTransactions={filtered} allTransactions={transactions} />

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">
            <i className="fas fa-calendar-alt mr-1" />Periode:
          </span>

          {[{ id: "bulan", label: "Bulan Ini" }, { id: "semua", label: "Semua" }].map((b) => (
            <button key={b.id} onClick={() => handleTimeFilter(b.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${timeFilter === b.id ? "bg-[#083d56] text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}>
              {b.label}
            </button>
          ))}

          <div className="flex items-center gap-2 border-l border-gray-200 pl-2 ml-1">
            <input type="date" value={startDate} onChange={(e) => handleCustomDate(e.target.value, endDate)}
              className={`px-2 py-2 border rounded-lg text-xs outline-none transition ${timeFilter === "custom" && startDate ? "border-[#00695c]" : "border-gray-300"} focus:border-[#00695c]`} />
            <span className="text-gray-400 text-xs">s/d</span>
            <input type="date" value={endDate} onChange={(e) => handleCustomDate(startDate, e.target.value)}
              className={`px-2 py-2 border rounded-lg text-xs outline-none transition ${timeFilter === "custom" && endDate ? "border-[#00695c]" : "border-gray-300"} focus:border-[#00695c]`} />
          </div>

          <span className="text-gray-300 mx-1">|</span>

          {[{ id: "semua", label: "Semua" }, { id: "pemasukan", label: "Pemasukan" }, { id: "pengeluaran", label: "Pengeluaran" }].map((b) => (
            <button key={b.id} onClick={() => setTypeFilter(b.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${typeFilter === b.id ? "bg-[#00695c] text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}>
              {b.label}
            </button>
          ))}

          <div className="ml-auto relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Cari..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#00695c] transition w-36" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Tanggal", "Deskripsi", "Kategori", "Tipe", "Jumlah", "Status"].map((h) => (
                  <th key={h} className={`px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${h === "Jumlah" ? "text-right" : h === "Status" ? "text-center" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">Tidak ada transaksi ditemukan</td></tr>
              ) : filtered.map((t) => {
                const isM = t.type === "pemasukan";
                return (
                  <tr key={t.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{formatDate(t.date)}</td>
                    <td className="px-5 py-3 font-medium text-gray-800">
                      {t.desc}
                      {t.docs?.length > 0 && (
                        <span className="ml-1 text-[10px] text-gray-400">
                          <i className="fas fa-paperclip" />{t.docs.length}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 bg-gray-50 rounded-md text-xs font-medium text-gray-700">{t.cat}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${isM ? "text-[#00695c]" : "text-red-500"}`}>
                        <i className={`fas ${isM ? "fa-arrow-down" : "fa-arrow-up"} text-[10px]`} />
                        {isM ? "Masuk" : "Keluar"}
                      </span>
                    </td>
                    <td className={`px-5 py-3 text-right font-bold ${isM ? "text-[#00695c]" : "text-red-500"}`}>
                      {isM ? "+" : "-"}{formatRupiah(t.amount)}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#e0f2f1] text-[#00695c]">SELESAI</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionTableSection;