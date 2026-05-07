import { createContext, useContext, useState, useCallback } from 'react';

const TODAY = new Date();

const initialState = {
  profile: {
    name: 'Nama Organisasi',
    type: 'Kemahasiswaan',
    email: 'email@organisasi.com',
    phone: '08xx-xxxx-xxxx',
    photo: null,
    description: 'Deskripsi organisasi Anda.',
  },
  transactions: [],
  programs: [],
  allocations: [],
  agendas: [],
  members: [],
  duesSettings: { interval: 30, amount: 10000 },
  notifications: [],
  nextAgendaId: 1,
  nextTxnId:    1,
  nextMemberId: 1,
  nextNotifId:  1,
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
