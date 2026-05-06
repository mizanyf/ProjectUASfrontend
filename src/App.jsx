import { useState } from 'react';
import { useToast } from './context/ToastContext';

// Auth — src/auth/user/
import LoginPage          from './auth/user/LoginPage';
import RegisterPage       from './auth/user/RegisterPage';
import ForgotPasswordPage from './auth/user/ForgotPasswordPage';

// Layout — src/layout/user/
import Sidebar from './layout/user/Sidebar';
import Topbar  from './layout/user/Topbar';

// Dashboard Pages — src/dashboard/user/
import BerandaPage    from './dashboard/user/BerandaPage';
import TransaksiPage  from './dashboard/user/TransaksiPage';
import LaporanPage    from './dashboard/user/LaporanPage';
import AnggotaPage    from './dashboard/user/AnggotaPage';
import PengaturanPage from './dashboard/user/PengaturanPage';
import ProfilPage     from './dashboard/user/ProfilPage';

// Modals — src/modals/user/
import TambahTransaksiModal from './modals/user/TambahTransaksiModal';
import EditTransaksiModal   from './modals/user/EditTransaksiModal';
import EditRealisasiModal   from './modals/user/EditRealisasiModal';
import AgendaModal          from './modals/user/AgendaModal';
import NotifikasiModal      from './modals/user/NotifikasiModal';
import OrgInfoModal         from './modals/user/OrgInfoModal';

// Admin — layout + dashboard
import AdminSidebar        from './layout/admin/AdminSidebar';
import AdminTopbar         from './layout/admin/AdminTopbar';
import DashboardAdminPage  from './dashboard/admin/DashboardAdminPage';
import OrganisasiPage      from './dashboard/admin/OrganisasiPage';
import LaporanAdminPage    from './dashboard/admin/LaporanAdminPage';
import SistemPage          from './dashboard/admin/SistemPage';
import ProfilKeamananPage from './dashboard/admin/ProfilKeamananPage';

import { useApp } from './context/AppContext';

/* ============================================================
   ADMIN SUB-APP — rendered inside App when view === 'admin'
   ============================================================ */
function AdminApp({ onLogout }) {
  const [adminPage,   setAdminPage]   = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (page) => { setAdminPage(page); setSidebarOpen(false); };

  return (
    <div className="admin-layout h-screen overflow-hidden">
      <AdminSidebar
        currentPage={adminPage}
        onNavigate={navigate}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="admin-main-scroll">
        <AdminTopbar
          currentPage={adminPage}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={onLogout}
        />

        <div className="admin-content-scroll">
          <main className="p-4 lg:p-8">
            {adminPage === 'dashboard'  && <DashboardAdminPage  onNavigate={navigate} />}
            {adminPage === 'organisasi' && <OrganisasiPage />}
            {adminPage === 'laporan'    && <LaporanAdminPage />}
            {adminPage === 'sistem'     && <SistemPage />}
            {adminPage === 'pengaturan' && <ProfilKeamananPage />}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function App() {
  const showToast = useToast();
  const { unreadCount } = useApp();

  // View state
  const [view,        setView]        = useState('login'); // login | register | forgot | app | admin
  const [currentPage, setCurrentPage] = useState('beranda');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal state
  const [modals, setModals] = useState({
    tambah:  false,
    editTxn: false,
    editReal: false,
    agenda:  false,
    notif:   false,
    orgInfo: false,
  });
  const [editTxnId, setEditTxnId]   = useState(null);
  const [agendaData, setAgendaData] = useState(null);

  /* ---- Modal helpers ---- */
  const openModal = (name, data) => {
    if (name === 'editTxn') setEditTxnId(data);
    if (name === 'agenda')  setAgendaData(data || null);
    setModals((m) => ({ ...m, [name]: true }));
  };
  const closeModal = (name) => setModals((m) => ({ ...m, [name]: false }));

  /* ---- Navigation ---- */
  const navigate = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  /* ---- Auth ---- */
  const handleLogin       = () => { setView('app');   setCurrentPage('beranda'); };
  const handleLogout      = () => { showToast('Anda telah keluar', 'info'); setTimeout(() => setView('login'), 600); };
  const handleAdminLogin  = () => { setView('admin'); };
  const handleAdminLogout = () => { showToast('Anda telah keluar dari Admin Panel', 'info'); setTimeout(() => setView('login'), 600); };

  /* ---- Render auth views ---- */
  if (view === 'login')    return <LoginPage onLogin={handleLogin} onShowRegister={() => setView('register')} onShowForgot={() => setView('forgot')} onAdminLogin={handleAdminLogin} />;
  if (view === 'register') return <RegisterPage onShowLogin={() => setView('login')} />;
  if (view === 'forgot')   return <ForgotPasswordPage onBackToLogin={() => setView('login')} />;

  /* ---- Admin Dashboard ---- */
  if (view === 'admin') return <AdminApp onLogout={handleAdminLogout} />;

  /* ---- User Dashboard ---- */
  return (
    <div className="h-screen overflow-hidden">
      <Sidebar
        currentPage={currentPage}
        onNavigate={navigate}
        onOpenModal={openModal}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="main-scroll">
        <Topbar
          currentPage={currentPage}
          onNavigate={navigate}
          onOpenModal={openModal}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          unreadCount={unreadCount}
        />

        <div className="content-scroll">
          <main className="p-4 lg:p-8">
            {currentPage === 'beranda'    && <BerandaPage    onOpenModal={openModal} onNavigate={navigate} />}
            {currentPage === 'transaksi'  && <TransaksiPage  onOpenModal={openModal} />}
            {currentPage === 'laporan'    && <LaporanPage    onOpenModal={openModal} />}
            {currentPage === 'anggota'    && <AnggotaPage    onNavigate={navigate} />}
            {currentPage === 'pengaturan' && <PengaturanPage onLogout={handleLogout} />}
            {currentPage === 'profil'     && <ProfilPage     onLogout={handleLogout} onNavigate={navigate} />}
          </main>
        </div>
      </div>

      {/* Modals */}
      <TambahTransaksiModal isOpen={modals.tambah}   onClose={() => closeModal('tambah')} />
      <EditTransaksiModal   isOpen={modals.editTxn}  txnId={editTxnId} onClose={() => closeModal('editTxn')} />
      <EditRealisasiModal   isOpen={modals.editReal} onClose={() => closeModal('editReal')} />
      <AgendaModal          isOpen={modals.agenda}   agenda={agendaData} onClose={() => closeModal('agenda')} />
      <NotifikasiModal      isOpen={modals.notif}    onClose={() => closeModal('notif')} />
      <OrgInfoModal         isOpen={modals.orgInfo}  onClose={() => closeModal('orgInfo')} />
    </div>
  );
}
