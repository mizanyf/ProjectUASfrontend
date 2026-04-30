function Sidebar() {
  return (
    <div className="sidebar bg-primary text-white p-4 w-64">
      <h1 className="font-bold mb-6">MoneFlo</h1>

      <button className="block mb-3">Beranda</button>
      <button className="block mb-3">Transaksi</button>
      <button className="block mb-3">Laporan</button>
    </div>
  );
}

export default Sidebar;