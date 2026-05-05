import { useState, useEffect } from "react";
import Toast from "../common/Toast";

const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconCalendar = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export const AgendaModal = ({ isOpen, onClose, onSave, agendaToEdit = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: "",
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Reset form saat modal ditutup atau ada agenda yang diedit
  useEffect(() => {
    if (isOpen) {
      if (agendaToEdit) {
        // Mode edit
        setFormData({
          name: agendaToEdit.name || "",
          amount: agendaToEdit.amount ? agendaToEdit.amount.toString().replace(/\D/g, "") : "",
          date: agendaToEdit.date || "",
        });
      } else {
        // Mode tambah
        setFormData({
          name: "",
          amount: "",
          date: "",
        });
      }
    }
  }, [isOpen, agendaToEdit]);

  // Auto hide toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi
    if (!formData.name.trim()) {
      setToast({ show: true, message: "Harap isi nama pembayaran", type: "error" });
      return;
    }
    if (!formData.amount || parseInt(formData.amount) <= 0) {
      setToast({ show: true, message: "Harap isi jumlah yang valid", type: "error" });
      return;
    }
    if (!formData.date) {
      setToast({ show: true, message: "Harap pilih tanggal jatuh tempo", type: "error" });
      return;
    }

    const agendaData = {
      name: formData.name.trim(),
      amount: parseInt(formData.amount),
      date: formData.date,
    };

    setToast({
      show: true,
      message: agendaToEdit ? "Agenda berhasil diperbarui!" : "Agenda berhasil ditambahkan!",
      type: "success",
    });

    setTimeout(() => {
      if (onSave) onSave(agendaData);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}

      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl w-[400px] max-h-[90vh] overflow-y-auto shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white z-10">
            <h2 className="text-lg font-bold text-[#083d56]">
              {agendaToEdit ? "Edit Agenda" : "Tambah Agenda"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <IconClose />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Nama Pembayaran */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                NAMA PEMBAYARAN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Contoh: Sewa Aula"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#00695c] focus:outline-none"
              />
            </div>

            {/* Jumlah */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                JUMLAH (RP) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value.replace(/\D/g, ""))}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#00695c] focus:outline-none"
              />
            </div>

            {/* Tanggal Jatuh Tempo */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                TANGGAL JATUH TEMPO <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#00695c] focus:outline-none"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <IconCalendar />
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#00695c] rounded-lg text-white font-medium hover:bg-[#005147] transition"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AgendaModal;