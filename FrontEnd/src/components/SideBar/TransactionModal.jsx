import { useState, useEffect } from "react";
import Toast from "../Toast";
import { useApp } from "../../context/AppContext";

const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconUpload = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const IconCalendar = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconChevronDown = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

const categories = [
  "Operasional",
  "Pemasukan",
  "Konsumsi",
  "Transportasi",
  "Pendidikan",
  "Kesehatan",
  "Sosial",
  "Lainnya"
];

// Initial state untuk reset form
const initialState = {
  date: "",
  type: "Pemasukan",
  description: "",
  category: "Operasional",
  amount: "",
  note: "",
  receipt: null,
};

export const TransactionModal = ({ isOpen, onClose, onSuccess }) => {
  const { addTransaction } = useApp();
  const [formData, setFormData] = useState(initialState);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Reset form ketika modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialState);
      setIsCategoryOpen(false);
    }
  }, [isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setToast({
          show: true,
          message: "Ukuran file maksimal 10MB",
          type: "error",
        });
        return;
      }
      setFormData(prev => ({ ...prev, receipt: file }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setToast({
          show: true,
          message: "Ukuran file maksimal 10MB",
          type: "error",
        });
        return;
      }
      setFormData(prev => ({ ...prev, receipt: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi
    if (!formData.date) {
      setToast({ show: true, message: "Harap pilih tanggal", type: "error" });
      return;
    }
    if (!formData.description) {
      setToast({ show: true, message: "Harap isi deskripsi", type: "error" });
      return;
    }
    if (!formData.amount || formData.amount === "0") {
      setToast({ show: true, message: "Harap isi jumlah yang valid", type: "error" });
      return;
    }

    // Simpan ke context (shared state)
    addTransaction({
      date: formData.date,
      desc: formData.description,
      cat: formData.category || "Operasional",
      type: formData.type === "Pemasukan" ? "pemasukan" : "pengeluaran",
      amount: parseInt(formData.amount.replace(/\D/g, "")) || 0,
      docs: formData.receipt ? [formData.receipt.name] : [],
    });

    setToast({ show: true, message: "Transaksi berhasil ditambahkan!", type: "success" });

    setTimeout(() => {
      if (onSuccess) onSuccess(formData);
      onClose();
    }, 1200);
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
          className="bg-white rounded-2xl w-[500px] max-h-[90vh] overflow-y-auto shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white z-10">
            <h2 className="text-lg font-bold text-[#083d56]">Tambah Transaksi</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <IconClose />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Tanggal */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                TANGGAL <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#00695c] focus:outline-none"
              />
            </div>

            {/* Tipe Transaksi */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                TIPE <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleChange("type", "Pemasukan")}
                  className={`flex-1 py-2 rounded-lg border transition ${
                    formData.type === "Pemasukan"
                      ? "bg-[#00695c] border-[#00695c] text-white"
                      : "border-gray-300 text-gray-600 hover:border-[#00695c]"
                  }`}
                >
                  Pemasukan
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("type", "Pengeluaran")}
                  className={`flex-1 py-2 rounded-lg border transition ${
                    formData.type === "Pengeluaran"
                      ? "bg-red-500 border-red-500 text-white"
                      : "border-gray-300 text-gray-600 hover:border-red-500"
                  }`}
                >
                  Pengeluaran
                </button>
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                DESKRIPSI <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Contoh: Pembelian ATK"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#00695c] focus:outline-none"
              />
            </div>

            {/* Kategori - Custom Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                KATEGORI <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
                >
                  <span>{formData.category || "Pilih kategori"}</span>
                  <IconChevronDown />
                </button>
                {isCategoryOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {categories.map((cat) => (
                      <div
                        key={cat}
                        onClick={() => {
                          handleChange("category", cat);
                          setIsCategoryOpen(false);
                        }}
                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Jumlah */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                JUMLAH (RP) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#00695c] focus:outline-none"
              />
            </div>

            {/* Catatan (Opsional) */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                CATATAN (OPSIONAL)
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => handleChange("note", e.target.value)}
                placeholder="Tambahkan catatan..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#00695c] focus:outline-none resize-none"
              />
            </div>

            {/* Bukti Transaksi */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                BUKTI TRANSAKSI
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
                  isDragging
                    ? "border-[#00695c] bg-[#00695c]/5"
                    : "border-gray-300 hover:border-[#00695c]"
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {formData.receipt ? (
                  <div className="text-center">
                    <div className="text-green-600 text-sm font-medium mb-1">
                      {formData.receipt.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange("receipt", null)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Hapus file
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer block"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <IconUpload />
                      <p className="text-sm text-gray-500">
                        Klik atau seret file ke sini
                      </p>
                      <p className="text-xs text-gray-400">
                        JPG, PNG, PDF, DOC (Maks. 10MB)
                      </p>
                    </div>
                  </label>
                )}
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

export default TransactionModal;