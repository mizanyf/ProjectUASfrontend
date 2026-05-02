import { useState } from "react";

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

export const TopBar = ({ organizationName = "BEM Fakultas Vokasi" }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Contoh data notifikasi
  const notifications = [
    { id: 1, title: "Transaksi baru", message: "Pembayaran iuran anggota", time: "5 menit lalu", read: false },
    { id: 2, title: "Laporan bulanan", message: "Laporan keuangan Oktober telah tersedia", time: "1 jam lalu", read: false },
    { id: 3, title: "Pengingat", message: "Agenda pembayaran sewa aula", time: "3 jam lalu", read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Title */}
        <div>
          <h1 className="text-xl font-bold text-[#083d56]">Dashboard</h1>
          <p className="text-xs text-gray-500 mt-0.5">Selamat datang kembali!</p>
        </div>

        {/* Right side - Notifications & User */}
        <div className="flex items-center gap-4">
          {/* Tombol Notifikasi */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <IconNotification />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Notifikasi */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${
                          !notif.read ? "bg-blue-50/30" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${!notif.read ? "bg-blue-500" : "bg-gray-300"}`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Tidak ada notifikasi
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-100">
                  <button className="w-full text-center text-xs text-[#00695c] py-1 hover:underline">
                    Tandai semua sudah dibaca
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tombol User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00897b] to-[#00695c] flex items-center justify-center text-white font-bold shadow-md">
                BF
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800">{organizationName}</p>
                <p className="text-xs text-gray-500">Akun Organisasi</p>
              </div>
              <IconChevronDown />
            </button>

            {/* Dropdown User Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">{organizationName}</p>
                  <p className="text-xs text-gray-500">bem@fakultas.ac.id</p>
                </div>
                <div className="py-2">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                    Profil Organisasi
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                    Pengaturan Akun
                  </button>
                  <hr className="my-1" />
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;