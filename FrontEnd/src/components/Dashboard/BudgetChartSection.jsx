import { IconChart } from "./Icons";

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

export const BudgetChartSection = () => {
  return (
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
  );
};