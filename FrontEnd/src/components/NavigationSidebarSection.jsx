import { useState } from "react";
import MoneFloLogo from "../assets/MoneFloLogo2.png";
import { OrganizationProfile } from "./OrganizationProfile";

const navigationItems = [
  { label: "Beranda" },
  { label: "Transaksi" },
  { label: "Laporan" },
  { label: "Anggota" },
  { label: "Pengaturan" },
];

// SVG Icons
const IconDashboard = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const IconTransaction = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const IconReport = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconMember = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const IconSetting = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
);

const IconChevronRight = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);

export const NavigationSidebarSection = ({ onNavigate, activePage = "Beranda" }) => {
  const [activeItem, setActiveItem] = useState(activePage);
  const [isOrgProfileOpen, setIsOrgProfileOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getIcon = (label) => {
    switch (label) {
      case "Beranda": return <IconDashboard />;
      case "Transaksi": return <IconTransaction />;
      case "Laporan": return <IconReport />;
      case "Anggota": return <IconMember />;
      case "Pengaturan": return <IconSetting />;
      default: return <IconDashboard />;
    }
  };

  const handleNavigation = (label) => {
    if (label === activeItem) return;
    
    setIsTransitioning(true);
    setActiveItem(label);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <>
      {/* Modal Profil Organisasi */}
      <OrganizationProfile isOpen={isOrgProfileOpen} onClose={() => setIsOrgProfileOpen(false)} />

      <aside className="fixed h-full top-0 left-0 w-64 z-20 bg-[#083d56] flex flex-col">
        {/* Logo Section */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img 
              src={MoneFloLogo} 
              alt="MoneFlo Logo"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <div>
              <div className="text-white font-bold text-base">MoneFlo</div>
              <div className="text-white/40 text-[9px] tracking-wider">KEUANGAN ORGANISASI</div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.label)}
              className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                activeItem === item.label
                  ? "bg-[#00897b1a] text-[#00897b]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              } ${isTransitioning ? "scale-98" : ""}`}
            >
              {/* Icon dengan animasi scale saat transisi */}
              <span className={`text-white/70 ml-1 transition-transform duration-300 ${activeItem === item.label ? "scale-110" : "scale-100"}`}>
                {getIcon(item.label)}
              </span>
              
              <span className="text-sm transition-all duration-300">
                {item.label}
              </span>
              
              {/* Garis indikator dengan animasi slide-in */}
              {activeItem === item.label && (
                <div 
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#00897b] rounded-r-full transition-all duration-300 ease-out ${
                    isTransitioning ? "animate-slide-in" : ""
                  }`}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Tombol Tambah Transaksi */}
        <div className="px-4 pb-3">
          <button className="w-full py-2.5 bg-[#00695c] rounded-lg text-white text-sm font-medium hover:bg-[#005147] transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95">
            <IconPlus />
            Tambah Transaksi
          </button>
        </div>

        {/* Tombol Organisasi - di BAWAH tombol Tambah Transaksi */}
        <div className="px-4 pb-4 pt-2 border-t border-white/10">
          <button
            onClick={() => setIsOrgProfileOpen(true)}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/5 group transform hover:scale-[1.02] active:scale-95"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00897b] to-[#00695c] flex items-center justify-center text-white font-bold text-sm shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
              BF
            </div>
            <div className="flex-1 text-left">
              <div className="text-white text-sm font-medium transition-colors duration-300 group-hover:text-[#00897b]">
                BEM Fakultas Vo..
              </div>
              <div className="text-white/40 text-[10px] transition-colors duration-300 group-hover:text-white/60">
                Akun Organisasi
              </div>
            </div>
            <div className="transition-transform duration-300 group-hover:translate-x-1">
              <IconChevronRight />
            </div>
          </button>
        </div>
      </aside>

      {/* Tambahkan keyframes CSS untuk animasi */}
      <style>{`
        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: translate(-100%, -50%);
          }
          100% {
            opacity: 1;
            transform: translate(0, -50%);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        
        .scale-98 {
          transform: scale(0.98);
        }
        
        .scale-100 {
          transform: scale(1);
        }
        
        .scale-110 {
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
};