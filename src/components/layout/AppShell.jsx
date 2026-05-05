import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BerandaPage from '../../pages/app/BerandaPage';
import TransaksiPage from '../../pages/app/TransaksiPage';
import LaporanPage from '../../pages/app/LaporanPage';
import AnggotaPage from '../../pages/app/AnggotaPage';
import PengaturanPage from '../../pages/app/PengaturanPage';
import ProfilPage from '../../pages/app/ProfilPage';
import TambahTransaksiModal from '../modals/TambahTransaksiModal';
import NotifModal from '../modals/NotifModal';
import OrgInfoModal from '../modals/OrgInfoModal';

export default function AppShell() {
  const { currentPage, sidebarOpen, setSidebarOpen } = useApp();
  const [showTambah, setShowTambah] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showOrg, setShowOrg] = useState(false);

  const pages = { beranda: BerandaPage, transaksi: TransaksiPage, laporan: LaporanPage, anggota: AnggotaPage, pengaturan: PengaturanPage, profil: ProfilPage };
  const PageComponent = pages[currentPage] || BerandaPage;

  return (
    <div>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-[45] lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar onTambah={() => setShowTambah(true)} onOrgClick={() => setShowOrg(true)} />

      <div className="main-scroll">
        <Topbar onNotifClick={() => setShowNotif(true)} />
        <div className="content-scroll">
          <main className="p-4 lg:p-8">
            <div className="page-enter">
              <PageComponent />
            </div>
          </main>
        </div>
      </div>

      <TambahTransaksiModal isOpen={showTambah} onClose={() => setShowTambah(false)} />
      <NotifModal isOpen={showNotif} onClose={() => setShowNotif(false)} />
      <OrgInfoModal isOpen={showOrg} onClose={() => setShowOrg(false)} />
    </div>
  );
}
