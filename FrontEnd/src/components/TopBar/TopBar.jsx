import { useState, useEffect } from "react";
import Toast from "../Toast";

const IconMenu = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const IconNotification = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const IconChevronDown = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

const IconCheckCircle = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Icon untuk setiap jenis notifikasi
const IconTransaction = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const IconPayment = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconReport = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconMember = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const PAGE_TITLES = { Beranda: "Beranda", Transaksi: "Transaksi", Laporan: "Laporan", Anggota: "Manajemen Anggota", Pengaturan: "Pengaturan", Profil: "Profil Organisasi" };

export const TopBar = ({ onMenuClick, activePage = "Beranda", onNavigate, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Transaksi berhasil ditambahkan", time: "5 menit lalu", read: false, icon: <IconTransaction />, iconBg: "bg-green-100", iconColor: "text-green-600" },
    { id: 2, title: "Pembayaran sewa aula jatuh tempo", time: "1 jam lalu", read: false, icon: <IconPayment />, iconBg: "bg-red-100", iconColor: "text-red-500" },
    { id: 3, title: "Laporan bulanan tersedia", time: "3 jam lalu", read: false, icon: <IconReport />, iconBg: "bg-blue-100", iconColor: "text-blue-500" },
    { id: 4, title: "Anggota baru bergabung", time: "1 hari lalu", read: false, icon: <IconMember />, iconBg: "bg-purple-100", iconColor: "text-purple-500" },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setToast({ show: true, message: "Semua notifikasi telah ditandai dibaca", type: "success" });
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, read: true } : notif));
  };

  return (
    <>
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(prev => ({ ...prev, show: false }))} />
      )}

      {/* TopBar dengan background transparan agar menyatu */}
      <header className="sticky top-0 z-10 bg-white/60 backdrop-blur-sm border-b border-gray-100 px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left side - Menu Button hanya untuk mobile */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
              aria-label="Buka menu"
            >
              <IconMenu />
            </button>
            {/* Judul halaman - akan ditampilkan di mobile saja */}
            <h1 className="text-base font-semibold text-[#083d56]">{PAGE_TITLES[activePage] || activePage}</h1>
          </div>

          {/* Right side - Notifications & User */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Notifikasi */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition"
              >
                <IconNotification />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                  <div className="flex justify-between items-center p-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-sm">Notifikasi</h3>
                    <button onClick={markAllAsRead} className="text-[10px] text-[#00695c] hover:underline flex items-center gap-1">
                      <IconCheckCircle /> Tandai semua
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} onClick={() => markAsRead(notif.id)} className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notif.read ? "bg-blue-50/20" : "opacity-60"}`}>
                        <div className="flex items-start gap-2">
                          <div className={`w-7 h-7 flex items-center justify-center ${notif.iconBg} rounded-full shrink-0`}>
                            <div className={notif.iconColor}>{notif.icon}</div>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-800">{notif.title}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{notif.time}</p>
                          </div>
                          {!notif.read && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00897b] to-[#00695c] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  BF
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-gray-700">BEM Fakultas Vokasi</p>
                  <p className="text-[10px] text-gray-400">Akun Organisasi</p>
                </div>
                <IconChevronDown />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                  <div className="p-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-800 truncate">BEM Fakultas Vokasi</p>
                    <p className="text-[10px] text-gray-500 truncate">bem@fakultas.ac.id</p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => { setShowUserMenu(false); if(onNavigate) onNavigate("Profil"); }} className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">Profil Organisasi</button>
                    <button onClick={() => { setShowUserMenu(false); if(onNavigate) onNavigate("Pengaturan"); }} className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">Pengaturan Akun</button>
                    <hr className="my-1" />
                    <button onClick={() => { setShowUserMenu(false); if(onLogout) onLogout(); }} className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">Keluar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default TopBar;