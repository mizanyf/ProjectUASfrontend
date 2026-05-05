import { useState, useEffect } from "react";
import { NavigationSidebarSection } from "../SideBar/NavigationSidebarSection";
import { FinancialDashboardSection } from "./FinancialDashboardSection";
import { TransactionTableSection } from "./TransactionTableSection";
import TopBar from "../TopBar/TopBar";
import { Laporan } from "../../pages/Laporan";
import { Anggota } from "../../pages/Anggota";
import { Pengaturan } from "../../pages/Pengaturan";
import { Profil } from "../../pages/Profil";

export const DashboardLayout = ({ onLogout }) => {
  const [activePage, setActivePage] = useState("Beranda");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Tutup sidebar saat layar di-resize ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Tutup sidebar saat ESC ditekan
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isSidebarOpen) setIsSidebarOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isSidebarOpen]);

  const handleNavigate = (page) => {
    setActivePage(page);
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activePage) {
      case "Beranda":
        return <FinancialDashboardSection onViewAll={() => setActivePage("Transaksi")} />;
      case "Transaksi":
        return <TransactionTableSection />;
      case "Laporan":
        return <Laporan />;
      case "Anggota":
        return (
          <Anggota onDuesRecorded={() => setActivePage("Laporan")} />
        );
      case "Pengaturan":
        return <Pengaturan />;
      case "Profil":
        return <Profil onLogout={onLogout} />;
      default:
        return <FinancialDashboardSection onViewAll={() => setActivePage("Transaksi")} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block shrink-0">
        <NavigationSidebarSection
          activePage={activePage}
          onNavigate={handleNavigate}
          onProfileClick={() => handleNavigate("Profil")}
        />
      </div>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute top-0 left-0 h-full z-50 shadow-xl animate-slide-in-left">
            <NavigationSidebarSection
              activePage={activePage}
              onNavigate={handleNavigate}
              onProfileClick={() => handleNavigate("Profil")}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          activePage={activePage}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          onNavigate={handleNavigate}
          onLogout={onLogout}
        />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;