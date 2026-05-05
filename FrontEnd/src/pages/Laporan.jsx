import { useState, useMemo, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";

const formatRupiah = (n) => "Rp" + Number(n).toLocaleString("id-ID");
const formatDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

const COLORS = ["#083D56", "#00695C", "#546E7A", "#00897B", "#78909C"];

export const Laporan = () => {
  const { transactions } = useApp();
  const [timeFilter, setTimeFilter] = useState("bulan");
  const [typeFilter, setTypeFilter] = useState("semua");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const today = new Date();

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
  }, [transactions, timeFilter, typeFilter, search, startDate, endDate]);

  const totalMasuk = filtered.reduce((s, t) => t.type === "pemasukan" ? s + t.amount : s, 0);
  const totalKeluar = filtered.reduce((s, t) => t.type === "pengeluaran" ? s + t.amount : s, 0);
  const totalSaldo = transactions.reduce((s, t) => t.type === "pemasukan" ? s + t.amount : s - t.amount, 0);

  // Alokasi by category
  const allocations = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "pengeluaran").forEach(t => {
      map[t.cat] = (map[t.cat] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, amount], i) => ({ name, amount, color: COLORS[i % COLORS.length] }));
  }, [transactions]);
  const totalAlokasi = allocations.reduce((s, a) => s + a.amount, 0);

  // Chart.js
  useEffect(() => {
    const Chart = window.Chart;
    if (!Chart || !chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const labels = ["Mei", "Jun", "Jul", "Agu", "Sep", "Okt"];
    const income = [5200000, 4800000, 6500000, 5800000, 7200000, 8400000];
    const expense = [3100000, 2800000, 4200000, 3600000, 4800000, 5300000];

    chartInstance.current = new Chart(chartRef.current.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "Pemasukan", data: income, borderColor: "#00695C", backgroundColor: "rgba(0,105,92,0.08)", fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: "#00695C", borderWidth: 2 },
          { label: "Pengeluaran", data: expense, borderColor: "#083D56", backgroundColor: "rgba(8,61,86,0.08)", fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: "#083D56", borderWidth: 2 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: "top", labels: { usePointStyle: true, padding: 16, font: { size: 12 } } } },
        scales: {
          y: { beginAtZero: true, max: 10000000, ticks: { callback: (v) => "Rp" + (v / 1000000).toFixed(0) + "jt", stepSize: 2000000 }, grid: { color: "rgba(118,119,121,0.1)" } },
          x: { grid: { display: false } },
        },
      },
    });
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, []);

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

  const exportCSV = () => {
    let csv = "Tanggal,Deskripsi,Kategori,Tipe,Jumlah,Status\n";
    filtered.forEach((t) => {
      csv += `"${t.date}","${t.desc}","${t.cat}","${t.type}",${t.amount},"${t.status}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `laporan_moneflo_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => window.print();

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Saldo Saat Ini" value={formatRupiah(totalSaldo)} sub="Total Saldo Akumulatif" icon="fa-wallet" iconBg="bg-[#083d561a]" iconColor="text-[#083d56]" valueColor="text-[#083d56]" />
        <StatCard label="Pemasukan" value={formatRupiah(totalMasuk)} sub="Periode terpilih" icon="fa-arrow-circle-down" iconBg="bg-[#00695c1a]" iconColor="text-[#00695c]" valueColor="text-[#00695c]" />
        <StatCard label="Pengeluaran" value={formatRupiah(totalKeluar)} sub="Periode terpilih" icon="fa-arrow-circle-up" iconBg="bg-red-50" iconColor="text-red-400" valueColor="text-red-500" />
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 font-medium"><i className="fas fa-calendar-alt mr-1" />Periode:</span>
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

          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Cari..."
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#00695c] transition w-36" />
            </div>
            <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 bg-[#00695c1a] text-[#00695c] rounded-lg text-xs font-medium hover:bg-[#00695c30] transition no-print">
              <i className="fas fa-file-excel" /> CSV
            </button>
            <button onClick={exportPDF} className="flex items-center gap-1.5 px-3 py-2 bg-[#083d561a] text-[#083d56] rounded-lg text-xs font-medium hover:bg-[#083d5630] transition no-print">
              <i className="fas fa-file-pdf" /> PDF
            </button>
          </div>
        </div>
      </div>

      {/* Chart + Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-[#083d56] mb-4">Visualisasi Arus Kas</h3>
          <div className="h-72"><canvas ref={chartRef} /></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-[#083d56] mb-4">Alokasi Pengeluaran</h3>
          <div className="space-y-3">
            {allocations.map((a) => {
              const pct = totalAlokasi > 0 ? Math.round((a.amount / totalAlokasi) * 100) : 0;
              return (
                <div key={a.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{a.name}</span>
                    <span className="text-gray-500">{pct}% · {formatRupiah(a.amount)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: a.color }} />
                  </div>
                </div>
              );
            })}
          </div>
          {allocations.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Belum ada data pengeluaran</p>}
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Pengeluaran</span>
            <span className="font-bold text-sm text-gray-700">{formatRupiah(totalAlokasi)}</span>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Tanggal", "Deskripsi", "Kategori", "Tipe", "Jumlah", "Status"].map((h, i) => (
                  <th key={h} className={`px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${i >= 4 ? "text-right" : "text-left"} ${h === "Status" ? "text-center" : ""}`}>{h}</th>
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
                      {t.docs?.length > 0 && <span className="ml-1 text-[10px] text-gray-400"><i className="fas fa-paperclip" />{t.docs.length}</span>}
                    </td>
                    <td className="px-5 py-3"><span className="px-2.5 py-1 bg-gray-50 rounded-md text-xs font-medium text-gray-700">{t.cat}</span></td>
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

const StatCard = ({ label, value, sub, icon, iconBg, iconColor, valueColor }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
        <i className={`fas ${icon} ${iconColor} text-sm`} />
      </div>
    </div>
    <p className={`font-bold text-2xl ${valueColor}`}>{value}</p>
    <p className="text-xs text-gray-400 mt-1">{sub}</p>
  </div>
);

export default Laporan;
