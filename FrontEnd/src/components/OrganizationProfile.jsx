import React from "react";

const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const OrganizationProfile = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div 
          className="bg-white rounded-2xl w-[450px] max-h-[85vh] overflow-y-auto shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white z-10">
            <h2 className="text-lg font-bold text-[#083d56]">Profil Organisasi</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <IconClose />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5">
            {/* Nama dan Bidang Organisasi */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00897b] to-[#00695c] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-lg">
                BF
              </div>
              <h3 className="text-lg font-bold text-[#083d56]">BEM Fakultas Furap</h3>
              <p className="text-sm text-gray-500 mt-1">Kemahasiswaan</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-[#083d56]">5</p>
                <p className="text-xs text-gray-500">Anggota</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 truncate">bem.furap@univ.a...</p>
                <p className="text-xs text-gray-400 mt-1">Email</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-sm font-medium text-gray-700">0812-3456-7890</p>
                <p className="text-xs text-gray-400 mt-1">Telepon</p>
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <h4 className="text-sm font-semibold text-[#083d56] mb-2">DESKRIPSI</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                BEM Fakultas Furap merupakan badan eksekutif mahasiswa yang bertanggung jawab 
                atas kegiatan kemahasiswaan di lingkungan Fakultas Furap.
              </p>
            </div>

            {/* Daftar Anggota */}
            <div>
              <h4 className="text-sm font-semibold text-[#083d56] mb-3">DAFTAR ANGGOTA</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00897b] to-[#00695c] flex items-center justify-center text-white text-xs font-bold">
                    SN
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Siti Nurhaliza</p>
                    <p className="text-xs text-gray-400">22100002</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00897b] to-[#00695c] flex items-center justify-center text-white text-xs font-bold">
                    DP
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Dimas Pratama</p>
                    <p className="text-xs text-gray-400">22100003</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00897b] to-[#00695c] flex items-center justify-center text-white text-xs font-bold">
                    AR
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Anisa Rahma</p>
                    <p className="text-xs text-gray-400">22100004</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t">
            <button 
              onClick={onClose}
              className="w-full py-2.5 border border-gray-300 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </>
  );
};