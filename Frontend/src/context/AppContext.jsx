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
  // periodStart: tanggal dimulainya periode iuran saat ini (ISO string YYYY-MM-DD)
  duesPeriodStart: null,
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
      members: [...s.members, { ...member, id: s.nextMemberId, isPaid: false, lastPaidDate: null }],
      nextMemberId: s.nextMemberId + 1,
    }));
  }, []);

  const toggleMemberPayment = useCallback((id) => {
    setState((s) => ({
      ...s,
      members: s.members.map((m) => {
        if (m.id !== id) return m;
        // Jika sudah dicatat iurannya di periode ini, tidak bisa diubah
        const status = getMemberPeriodStatus(m, s.duesSettings, s.duesPeriodStart);
        if (status === 'recorded') return m;
        return { ...m, isPaid: !m.isPaid };
      }),
    }));
  }, []);

  const toggleAllPayments = useCallback((status) => {
    setState((s) => ({
      ...s,
      members: s.members.map((m) => {
        const periodStatus = getMemberPeriodStatus(m, s.duesSettings, s.duesPeriodStart);
        // Jangan ubah anggota yang sudah dicatat iurannya di periode ini
        if (periodStatus === 'recorded') return m;
        return { ...m, isPaid: status };
      }),
    }));
  }, []);

  const deleteMember = useCallback((id) => {
    setState((s) => ({ ...s, members: s.members.filter((m) => m.id !== id) }));
  }, []);

  const saveDuesSettings = useCallback((settings) => {
    setState((s) => ({ ...s, duesSettings: settings }));
  }, []);

  const recordAllDues = useCallback(() => {
    setState((s) => {
      const today = new Date().toISOString().split('T')[0];
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

      // Tentukan period start: jika belum ada, gunakan hari ini
      const newPeriodStart = s.duesPeriodStart || today;

      return {
        ...s,
        transactions: [...s.transactions, ...newTxns],
        nextTxnId: nextId,
        // Tandai anggota yang sudah dicatat: simpan lastPaidDate & reset isPaid
        members: s.members.map((m) =>
          m.isPaid
            ? { ...m, isPaid: false, lastPaidDate: today }
            : m
        ),
        // Simpan tanggal mulai periode (atau tetap dari sebelumnya jika sudah ada)
        duesPeriodStart: newPeriodStart,
      };
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

/**
 * Menentukan status pembayaran iuran anggota terhadap periode saat ini.
 * @param {object} member - data anggota
 * @param {object} duesSettings - { interval: number (hari), amount: number }
 * @param {string|null} duesPeriodStart - tanggal mulai periode (YYYY-MM-DD) atau null
 * @returns {'recorded'|'overdue'|'pending'}
 *   - 'recorded' : sudah dibayar di periode ini → abu-abu, tidak bisa dicentang
 *   - 'overdue'  : periode telah lewat tapi belum bayar → merah
 *   - 'pending'  : belum bayar, masih dalam periode → normal
 */
export function getMemberPeriodStatus(member, duesSettings, duesPeriodStart) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!duesPeriodStart) {
    // Belum ada periode dimulai sama sekali → semua pending
    return 'pending';
  }

  const periodStart = new Date(duesPeriodStart);
  periodStart.setHours(0, 0, 0, 0);
  const periodEnd = new Date(periodStart);
  periodEnd.setDate(periodEnd.getDate() + duesSettings.interval - 1);

  // Cek apakah sudah membayar di periode ini
  if (member.lastPaidDate) {
    const paid = new Date(member.lastPaidDate);
    paid.setHours(0, 0, 0, 0);
    if (paid >= periodStart && paid <= periodEnd) {
      return 'recorded';
    }
  }

  // Jika periode sudah lewat dan belum bayar
  if (today > periodEnd) {
    return 'overdue';
  }

  return 'pending';
}
