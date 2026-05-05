import { useState } from "react";
import { IconCalendar, IconClock, IconPlusCircle } from "./Icons";
import AgendaModal from "./AgendaModal";

// Data agenda awal (sinkron dengan window.state.agendas jika ada)
const initialAgendaItems = [
  { id: 1, title: "Sewa Aula", date: "2024-10-15", amount: "Rp2.500.000", rawAmount: 2500000 },
  { id: 2, title: "Konsumsi Rapat", date: "2024-10-18", amount: "Rp750.000", rawAmount: 750000 },
  { id: 3, title: "Cetak Brosur", date: "2024-10-22", amount: "Rp1.200.000", rawAmount: 1200000 },
  { id: 4, title: "Bayar Listrik", date: "2024-10-25", amount: "Rp480.000", rawAmount: 480000 },
];

// Fungsi format tanggal dari YYYY-MM-DD ke "DD MMM YYYY"
const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

// Fungsi format Rupiah
const formatRupiah = (amount) => {
  return `Rp${amount.toLocaleString("id-ID")}`;
};

export const PaymentAgendaSection = () => {
  const [agendaItems, setAgendaItems] = useState(initialAgendaItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState(null);
  const [nextId, setNextId] = useState(5);

  const handleOpenModal = (agenda = null) => {
    setEditingAgenda(agenda);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAgenda(null);
  };

  const handleSaveAgenda = (agendaData) => {
    if (editingAgenda) {
      // Edit agenda
      setAgendaItems(prev => prev.map(item =>
        item.id === editingAgenda.id
          ? {
              ...item,
              title: agendaData.name,
              rawAmount: agendaData.amount,
              amount: formatRupiah(agendaData.amount),
              date: agendaData.date,
            }
          : item
      ));
    } else {
      // Tambah agenda baru
      const newAgenda = {
        id: nextId,
        title: agendaData.name,
        rawAmount: agendaData.amount,
        amount: formatRupiah(agendaData.amount),
        date: agendaData.date,
      };
      setAgendaItems(prev => [...prev, newAgenda]);
      setNextId(prev => prev + 1);
    }
  };

  const handleDeleteAgenda = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus agenda ini?")) {
      setAgendaItems(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <>
      <AgendaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAgenda}
        agendaToEdit={editingAgenda ? {
          name: editingAgenda.title,
          amount: editingAgenda.rawAmount,
          date: editingAgenda.date,
        } : null}
      />

      <section className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-[#083d56] text-sm">
            Agenda Pembayaran
          </h2>
          <button
            onClick={() => handleOpenModal()}
            className="w-7 h-7 flex items-center justify-center bg-[#00695c1a] rounded-lg hover:bg-[#00695c30] transition"
          >
            <IconPlusCircle />
          </button>
        </div>

        <div className="space-y-3">
          {agendaItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-[#fffbeb] rounded-xl border border-amber-100 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-xl">
                  <IconClock />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <IconCalendar />
                    <p className="text-xs text-gray-400">{formatDisplayDate(item.date)}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-amber-700">{item.amount}</p>
                <div className="hidden group-hover:flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-1 text-gray-400 hover:text-[#00695c] transition"
                    title="Edit agenda"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteAgenda(item.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition"
                    title="Hapus agenda"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};