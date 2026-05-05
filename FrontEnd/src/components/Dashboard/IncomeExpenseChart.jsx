import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const IconChart = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export const IncomeExpenseChart = ({ transactions = [] }) => {
  // Data untuk 6 bulan terakhir (Mei - Oktober)
  const months = ["Mei", "Jun", "Jul", "Agu", "Sep", "Okt"];
  
  // Data pemasukan dan pengeluaran per bulan
  const incomeData = [5800000, 5600000, 5300000, 5100000, 4800000, 4200000];
  const expenseData = [3135000, 3050000, 2900000, 2700000, 2400000, 2100000];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        align: "start",
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
          font: {
            size: 9,
            family: "Plus Jakarta Sans",
            weight: "500",
          },
          padding: 10,
        },
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#1e293b",
        bodyColor: "#475569",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 6,
        cornerRadius: 6,
        titleFont: {
          size: 10,
          weight: "bold",
          family: "Plus Jakarta Sans",
        },
        bodyFont: {
          size: 9,
          family: "Plus Jakarta Sans",
        },
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          },
          label: function(context) {
            let label = context.dataset.label || "";
            if (label) {
              label = `${label}: `;
            }
            const value = context.parsed.y;
            const formatted = new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value);
            return `${label}${formatted}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 8000000,
        ticks: {
          stepSize: 2000000,
          callback: function(value) {
            if (value === 0) return "Rp0";
            if (value === 2000000) return "Rp2Jt";
            if (value === 4000000) return "Rp4Jt";
            if (value === 6000000) return "Rp6Jt";
            if (value === 8000000) return "Rp8Jt";
            return "";
          },
          font: {
            size: 8,
            family: "Plus Jakarta Sans",
          },
          color: "#9ca3af",
        },
        grid: {
          color: "#e5e7eb",
          drawBorder: false,
        },
        border: {
          display: false,
        },
      },
      x: {
        ticks: {
          font: {
            size: 9,
            family: "Plus Jakarta Sans",
            weight: "500",
          },
          color: "#6b7280",
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  const data = {
    labels: months,
    datasets: [
      {
        label: "Pemasukan",
        data: incomeData,
        backgroundColor: "#00695c",
        borderRadius: 4,
        barPercentage: 0.65,
        categoryPercentage: 0.8,
      },
      {
        label: "Pengeluaran",
        data: expenseData,
        backgroundColor: "#083d56",
        borderRadius: 4,
        barPercentage: 0.65,
        categoryPercentage: 0.8,
      },
    ],
  };

  return (
    <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 md:p-5">
      <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 md:mb-4">
        <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[#00695c]">
          <IconChart />
        </div>
        <h2 className="font-semibold text-[#083d56] text-[10px] sm:text-xs md:text-sm">
          Pemasukan & Pengeluaran 6 Bulan Terakhir
        </h2>
      </div>
      <div className="h-40 sm:h-48 md:h-56 lg:h-64">
        <Bar options={options} data={data} />
      </div>
    </section>
  );
};