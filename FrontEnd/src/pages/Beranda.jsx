import Sidebar from "../components/Sidebar";

function Beranda() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-6 space-y-6">

        {/* CARD */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow">
            <p>Saldo Kas</p>
            <h2 className="text-2xl font-bold">Rp4.415.000</h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p>Pemasukan</p>
            <h2 className="text-2xl font-bold text-green-600">Rp8.400.000</h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p>Pengeluaran</p>
            <h2 className="text-2xl font-bold text-red-500">Rp3.985.000</h2>
          </div>
        </div>

        {/* CHART */}
        <div className="bg-white p-5 rounded-2xl">
          Chart di sini
        </div>

        {/* TRANSAKSI */}
        <div className="bg-white p-5 rounded-2xl">
          <h3 className="font-semibold mb-3">Transaksi Terakhir</h3>
          <p>- Pembelian Banner</p>
          <p>+ Iuran Anggota</p>
        </div>

      </div>
    </div>
  );
}

export default Beranda;