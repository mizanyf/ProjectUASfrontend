import React, { useState, useEffect } from "react";

const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconChevronRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);

// Data dummy anggota
const membersData = [
  { id: 1, name: "Rafi Alfarizi", nim: "2210001", color: "#083D56" },
  { id: 2, name: "Siti Nurhaliza", nim: "2210002", color: "#00695C" },
  { id: 3, name: "Dimas Pratama", nim: "2210003", color: "#546E7A" },
  { id: 4, name: "Anisa Rahma", nim: "2210004", color: "#00897B" },
  { id: 5, name: "Mizan Furap", nim: "2211001", color: "#0C5272" },
];

const getInitials = (name) => {
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
};

export const OrganizationProfile = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState({
    name: "BEM Fakultas Furap",
    type: "Kemahasiswaan",
    email: "bem.furap@univ.ac.id",
    phone: "0812-3456-7890",
    description: "BEM Fakultas Furap merupakan badan eksekutif mahasiswa yang bertanggung jawab atas kegiatan kemahasiswaan di lingkungan Fakultas Furap.",
    photo: null,
  });

  const [members, setMembers] = useState(membersData);

  if (!isOpen) return null;

  const logoHtml = profile.photo ? (
    <img src={profile.photo} className="w-full h-full object-cover rounded-2xl" alt="Logo" />
  ) : (
    <span className="text-white text-2xl font-bold">{getInitials(profile.name)}</span>
  );

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
            <h3 className="font-semibold text-[#083d56] text-lg">Profil Organisasi</h3>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
            >
              <IconClose />
            </button>
          </div>

          {/* Body - Tanpa scroll bar di luar */}
          <div className="flex-1 overflow-y-visible">
            {/* Header with Gradient Background */}
            <div className="bg-gradient-to-br from-[#083d56] via-[#0C5272] to-[#00695c] px-6 pt-8 pb-10 text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold mx-auto ring-4 ring-white/20 shadow-lg overflow-hidden">
                {logoHtml}
              </div>
              <h4 className="text-xl font-bold text-white mt-4">{profile.name}</h4>
              <p className="text-white/70 text-sm mt-1">{profile.type}</p>
            </div>

            {/* Grid Info - 3 kolom */}
            <div className="px-6 pt-5 pb-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-3.5 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1.5">
                    <i className="fas fa-users text-[#00695c] text-xs"></i>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Anggota</span>
                  </div>
                  <p className="font-display font-bold text-xl text-[#083d56]">{members.length}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <i className="fas fa-envelope text-[#00695c] text-xs"></i>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Email</span>
                  </div>
                  <p className="text-xs font-medium text-gray-600 truncate">{profile.email}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <i className="fas fa-phone text-[#00695c] text-xs"></i>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Telepon</span>
                  </div>
                  <p className="text-xs font-medium text-gray-600">{profile.phone}</p>
                </div>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="px-6 pb-4">
              <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Deskripsi</h5>
              <p className="text-sm text-gray-600 leading-relaxed">{profile.description}</p>
            </div>

            {/* Garis Pemisah */}
            <div className="mx-6 border-t border-gray-100"></div>

            {/* Daftar Anggota dengan Scroll Bar Kustom */}
            <div className="px-6 pt-4 pb-5">
              <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Daftar Anggota</h5>
              <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1 custom-scroll">
                {members.map((member) => (
                  <div key={member.id} className="member-row flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: member.color }}
                    >
                      {getInitials(member.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{member.name}</p>
                      <p className="text-xs text-[#00695c] mt-0.5">{member.nim}</p>
                    </div>
                    <IconChevronRight />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer - Tombol Tutup */}
          <div className="flex gap-3 p-5 border-t border-gray-100 flex-shrink-0">
            <button 
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganizationProfile;