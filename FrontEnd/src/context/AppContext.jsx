import { createContext, useContext, useState } from "react";

const TODAY = new Date();

const initialTransactions = [
  { id: 1, date: "2024-10-25", desc: "Pembelian Banner Dies Natalis", cat: "Event", type: "pengeluaran", amount: 350000, status: "SELESAI", docs: [] },
  { id: 2, date: "2024-10-24", desc: "Iuran Anggota Minggu Ini", cat: "Operasional", type: "pemasukan", amount: 800000, status: "SELESAI", docs: [] },
  { id: 3, date: "2024-10-23", desc: "Konsumsi Rapat Koordinasi", cat: "Operasional", type: "pengeluaran", amount: 375000, status: "SELESAI", docs: [] },
  { id: 4, date: "2024-10-22", desc: "Cetak Brosur", cat: "Operasional", type: "pengeluaran", amount: 420000, status: "SELESAI", docs: [] },
  { id: 5, date: "2024-10-21", desc: "Sponsorship PT. Maju Jaya", cat: "Sponsor", type: "pemasukan", amount: 5000000, status: "SELESAI", docs: ["Kontrak_Sponsor.pdf"] },
  { id: 6, date: "2024-09-15", desc: "Dana Kemahasiswaan Sep", cat: "Operasional", type: "pemasukan", amount: 3000000, status: "SELESAI", docs: [] },
  { id: 7, date: "2024-09-18", desc: "Pembelian ATK", cat: "Logistik", type: "pengeluaran", amount: 250000, status: "SELESAI", docs: [] },
  { id: 8, date: "2024-09-20", desc: "Iuran Anggota Sep", cat: "Operasional", type: "pemasukan", amount: 600000, status: "SELESAI", docs: [] },
];

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    name: "BEM Fakultas Furap",
    type: "Kemahasiswaan",
    email: "bem.furap@univ.ac.id",
    phone: "0812-3456-7890",
    photo: null,
    description: "BEM Fakultas Furap merupakan badan eksekutif mahasiswa yang bergerak dalam bidang pelayanan, advokasi, dan pengembangan kreativitas mahasiswa.",
  });

  const [transactions, setTransactions] = useState(initialTransactions);
  const [nextTxnId, setNextTxnId] = useState(9);

  const [members, setMembers] = useState([
    { id: 1, name: "Rafi Alfarizi", nim: "2210001", phone: "0812-1111-2222", color: "#083D56", isPaid: false },
    { id: 2, name: "Siti Nurhaliza", nim: "2210002", phone: "0812-2222-3333", color: "#00695C", isPaid: false },
    { id: 3, name: "Dimas Pratama", nim: "2210003", phone: "0812-3333-4444", color: "#546E7A", isPaid: false },
    { id: 4, name: "Anisa Rahma", nim: "2210004", phone: "0812-4444-5555", color: "#00897B", isPaid: false },
    { id: 5, name: "Mizan Furap", nim: "2211001", phone: "0812-3456-7890", color: "#0C5272", isPaid: false },
  ]);
  const [nextMemberId, setNextMemberId] = useState(6);

  const [duesSettings, setDuesSettings] = useState({ interval: 30, amount: 10000 });

  const [agendas, setAgendas] = useState([
    { id: 1, name: "Sewa Aula", amount: 2500000, date: "2024-10-15" },
    { id: 2, name: "Konsumsi Rapat", amount: 750000, date: "2024-10-18" },
    { id: 3, name: "Cetak Brosur", amount: 1200000, date: "2024-10-22" },
    { id: 4, name: "Bayar Listrik", amount: 480000, date: "2024-10-25" },
  ]);
  const [nextAgendaId, setNextAgendaId] = useState(5);

  const [programs, setPrograms] = useState([
    { name: "Program Umum", progress: 79 },
    { name: "Pendidikan", progress: 65 },
    { name: "Kesehatan", progress: 42 },
    { name: "Sosial", progress: 88 },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Transaksi berhasil ditambahkan", time: "5 menit lalu", read: false, icon: "fa-check-circle", iconColor: "text-[#00695c]" },
    { id: 2, text: "Pembayaran sewa aula jatuh tempo", time: "1 jam lalu", read: false, icon: "fa-exclamation-circle", iconColor: "text-amber-500" },
    { id: 3, text: "Laporan bulanan tersedia", time: "3 jam lalu", read: true, icon: "fa-file-alt", iconColor: "text-[#546E7A]" },
    { id: 4, text: "Anggota baru bergabung", time: "1 hari lalu", read: true, icon: "fa-user-plus", iconColor: "text-[#083d56]" },
  ]);

  const addTransaction = (txn) => {
    setTransactions(prev => [{ ...txn, id: nextTxnId, status: "SELESAI", docs: txn.docs || [] }, ...prev]);
    setNextTxnId(id => id + 1);
    setNotifications(prev => [
      { id: Date.now(), text: `Transaksi "${txn.desc}" berhasil ditambahkan`, time: "Baru saja", read: false, icon: "fa-check-circle", iconColor: "text-[#00695c]" },
      ...prev
    ]);
  };

  const addMember = (member) => {
    setMembers(prev => [...prev, { ...member, id: nextMemberId, isPaid: false }]);
    setNextMemberId(id => id + 1);
  };

  const deleteMember = (id) => setMembers(prev => prev.filter(m => m.id !== id));

  const toggleMemberPayment = (id) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, isPaid: !m.isPaid } : m));
  };

  const toggleAllPayments = (status) => {
    setMembers(prev => prev.map(m => ({ ...m, isPaid: status })));
  };

  const recordDues = () => {
    const todayStr = TODAY.toISOString().split("T")[0];
    const paidMembers = members.filter(m => m.isPaid);
    if (!paidMembers.length) return 0;
    paidMembers.forEach(m => {
      addTransaction({
        date: todayStr,
        desc: `Iuran ${duesSettings.interval} Hari - ${m.name}`,
        cat: "Iuran",
        type: "pemasukan",
        amount: duesSettings.amount,
        docs: [],
      });
    });
    toggleAllPayments(false);
    return paidMembers.length;
  };

  const saveAgenda = (agenda) => {
    if (agenda.id) {
      setAgendas(prev => prev.map(a => a.id === agenda.id ? agenda : a));
    } else {
      setAgendas(prev => [...prev, { ...agenda, id: nextAgendaId }]);
      setNextAgendaId(id => id + 1);
    }
  };

  const deleteAgenda = (id) => setAgendas(prev => prev.filter(a => a.id !== id));

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <AppContext.Provider value={{
      today: TODAY,
      profile, setProfile,
      transactions, addTransaction,
      members, addMember, deleteMember, toggleMemberPayment, toggleAllPayments, recordDues,
      duesSettings, setDuesSettings,
      agendas, saveAgenda, deleteAgenda,
      programs, setPrograms,
      notifications, setNotifications, markAllRead,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
