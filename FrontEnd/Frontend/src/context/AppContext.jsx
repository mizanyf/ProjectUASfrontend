import { createContext, useContext, useState, useCallback } from 'react';

const TODAY = new Date();

const initialState = {
  profile: {
    name: 'BEM Fakultas Furap',
    type: 'Kemahasiswaan',
    email: 'bem.furap@univ.ac.id',
    phone: '0812-3456-7890',
    photo: null,
    description: 'BEM Fakultas Furap merupakan badan eksekutif mahasiswa yang bergerak dalam bidang pelayanan, advokasi, dan pengembangan kreativitas mahasiswa.',
  },
  transactions: [],
  programs: [
    { name: 'Program Umum', progress: 79 },
    { name: 'Pendidikan',   progress: 65 },
    { name: 'Kesehatan',    progress: 42 },
    { name: 'Sosial',       progress: 88 },
  ],
  allocations: [
    { name: 'Operasional',  amount: 2400000, color: '#083D56' },
    { name: 'Event',        amount: 1556000, color: '#00695C' },
    { name: 'Logistik',     amount:  520000, color: '#546E7A' },
    { name: 'Kepegawaian',  amount:  750000, color: '#00897B' },
    { name: 'Lainnya',      amount:   75000, color: '#78909C' },
  ],
  agendas: [
    { id: 1, name: 'Sewa Aula',       amount: 2500000, date: '2024-10-15' },
    { id: 2, name: 'Konsumsi Rapat',  amount:  750000, date: '2024-10-18' },
    { id: 3, name: 'Cetak Brosur',    amount: 1200000, date: '2024-10-22' },
    { id: 4, name: 'Bayar Listrik',   amount:  480000, date: '2024-10-25' },
  ],
  members: [
    { id: 1, name: 'Rafi Alfarizi',   nim: '2210001', phone: '0812-1111-2222', color: '#083D56', isPaid: false },
    { id: 2, name: 'Siti Nurhaliza',  nim: '2210002', phone: '0812-2222-3333', color: '#00695C', isPaid: false },
    { id: 3, name: 'Dimas Pratama',   nim: '2210003', phone: '0812-3333-4444', color: '#546E7A', isPaid: false },
    { id: 4, name: 'Anisa Rahma',     nim: '2210004', phone: '0812-4444-5555', color: '#00897B', isPaid: false },
    { id: 5, name: 'Mizan Furap',     nim: '2211001', phone: '0812-3456-7890', color: '#0C5272', isPaid: false },
  ],
  duesSettings: { interval: 30, amount: 10000 },
  notifications: [
    { id: 1, text: 'Transaksi berhasil ditambahkan',  time: '5 menit lalu', read: false, icon: 'fa-check-circle',       iconColor: 'text-tertiary'     },
    { id: 2, text: 'Pembayaran sewa aula jatuh tempo', time: '1 jam lalu',  read: false, icon: 'fa-exclamation-circle', iconColor: 'text-amber-500'    },
    { id: 3, text: 'Laporan bulanan tersedia',         time: '3 jam lalu',  read: true,  icon: 'fa-file-alt',           iconColor: 'text-secondary'    },
    { id: 4, text: 'Anggota baru bergabung',           time: '1 hari lalu', read: true,  icon: 'fa-user-plus',          iconColor: 'text-primary'      },
  ],
  nextAgendaId: 5,
  nextTxnId:    24,
  nextMemberId: 6,
  nextNotifId:  5,
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(initialState);

  /* ---------- helpers ---------- */
  const update = useCallback((patch) => setState((s) => ({ ...s, ...patch })), []);

  /* ---------- profile ---------- */
  const updateProfile = useCallback((data) => update({ profile: { ...state.profile, ...data } }), [state.profile, update]);

  /* ---------- transactions ---------- */
  const addTransaction = useCallback((txn) => {
    setState((s) => ({
      ...s,
      transactions: [...s.transactions, { ...txn, id: s.nextTxnId, status: 'SELESAI', docs: txn.docs || [] }],
      nextTxnId: s.nextTxnId + 1,
      notifications: [
        { id: s.nextNotifId, text: `Transaksi "${txn.desc}" berhasil ditambahkan`, time: 'Baru saja', read: false, icon: 'fa-check-circle', iconColor: 'text-tertiary' },
        ...s.notifications,
      ],
      nextNotifId: s.nextNotifId + 1,
    }));
  }, []);

  const editTransaction = useCallback((id, data) => {
    setState((s) => ({
      ...s,
      transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
  }, []);

  const deleteTransaction = useCallback((id) => {
    setState((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) }));
  }, []);

  /* ---------- programs ---------- */
  const updatePrograms = useCallback((programs) => update({ programs }), [update]);

  /* ---------- agendas ---------- */
  const addAgenda = useCallback((agenda) => {
    setState((s) => ({
      ...s,
      agendas: [...s.agendas, { ...agenda, id: s.nextAgendaId }],
      nextAgendaId: s.nextAgendaId + 1,
    }));
  }, []);

  const editAgenda = useCallback((id, data) => {
    setState((s) => ({ ...s, agendas: s.agendas.map((a) => (a.id === id ? { ...a, ...data } : a)) }));
  }, []);

  const deleteAgenda = useCallback((id) => {
    setState((s) => ({ ...s, agendas: s.agendas.filter((a) => a.id !== id) }));
  }, []);

  /* ---------- members ---------- */
  const addMember = useCallback((member) => {
    setState((s) => ({
      ...s,
      members: [...s.members, { ...member, id: s.nextMemberId }],
      nextMemberId: s.nextMemberId + 1,
    }));
  }, []);

  const toggleMemberPayment = useCallback((id) => {
    setState((s) => ({
      ...s,
      members: s.members.map((m) => (m.id === id ? { ...m, isPaid: !m.isPaid } : m)),
    }));
  }, []);

  const toggleAllPayments = useCallback((status) => {
    setState((s) => ({ ...s, members: s.members.map((m) => ({ ...m, isPaid: status })) }));
  }, []);

  const deleteMember = useCallback((id) => {
    setState((s) => ({ ...s, members: s.members.filter((m) => m.id !== id) }));
  }, []);

  const saveDuesSettings = useCallback((settings) => {
    setState((s) => ({ ...s, duesSettings: settings }));
  }, []);

  const recordAllDues = useCallback(() => {
    setState((s) => {
      const today = TODAY.toISOString().split('T')[0];
      const days = s.duesSettings.interval;
      const amount = s.duesSettings.amount;
      const paidMembers = s.members.filter((m) => m.isPaid);
      if (!paidMembers.length) return s;
      let nextId = s.nextTxnId;
      const newTxns = paidMembers.map((m) => ({
        id: nextId++,
        date: today,
        desc: `Iuran ${days} Hari - ${m.name}`,
        cat: 'Iuran',
        type: 'pemasukan',
        amount,
        status: 'SELESAI',
        docs: [],
      }));
      return { ...s, transactions: [...s.transactions, ...newTxns], nextTxnId: nextId };
    });
  }, []);

  /* ---------- notifications ---------- */
  const markAllRead = useCallback(() => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const markOneRead = useCallback((id) => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider value={{
      state, TODAY,
      updateProfile,
      addTransaction, editTransaction, deleteTransaction,
      updatePrograms,
      addAgenda, editAgenda, deleteAgenda,
      addMember, toggleMemberPayment, toggleAllPayments, deleteMember, saveDuesSettings, recordAllDues,
      markAllRead, markOneRead,
      unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
