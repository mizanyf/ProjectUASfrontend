import { IconCalendar, IconClock, IconPlusCircle } from "./Icons";

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

export const PaymentAgendaSection = () => {
  return (
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
  );
};