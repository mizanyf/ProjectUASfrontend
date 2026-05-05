import { createContext, useContext, useState, useCallback } from 'react';
import {
  initialTransactions, initialMembers, initialAgendas, initialPrograms,
  initialAllocations, initialNotifications, initialProfile, TODAY,
} from '../data/initialState';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Navigation ──────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState('login');

  // ── Filter state ─────────────────────────────────────────────────
  const [timeFilter, setTimeFilter] = useState('bulan');
  const [typeFilter, setTypeFilter] = useState('semua');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  // ── Data state ────────────────────────────────────────────────────
  const [transactions, setTransactions] = useState(initialTransactions);
  const [members, setMembers] = useState(initialMembers);
  const [agendas, setAgendas] = useState(initialAgendas);
  const [programs, setPrograms] = useState(initialPrograms);
  const [allocations] = useState(initialAllocations);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [profile, setProfile] = useState(initialProfile);
  const [duesSettings, setDuesSettings] = useState({ interval: 30, amount: 10000 });

  // ── ID counters ───────────────────────────────────────────────────
  const [nextTxnId, setNextTxnId] = useState(24);
  const [nextAgendaId, setNextAgendaId] = useState(5);
  const [nextMemberId, setNextMemberId] = useState(6);

  // ── UI state ──────────────────────────────────────────────────────
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Toast ─────────────────────────────────────────────────────────
  const showToast = useCallback((msg, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  // ── Navigation ────────────────────────────────────────────────────
  const navigateTo = useCallback((page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  }, []);

  // ── Filter logic ──────────────────────────────────────────────────
  const getFilteredTransactions = useCallback(() => {
    const now = new Date(TODAY);
    now.setHours(0, 0, 0, 0);
    let filtered = [...transactions];
    let prevF = [];

    if (timeFilter === 'custom') {
      const sDate = customStartDate ? (() => { const d = new Date(customStartDate); d.setHours(0,0,0,0); return d; })() : null;
      const eDate = customEndDate ? (() => { const d = new Date(customEndDate); d.setHours(0,0,0,0); return d; })() : null;
      filtered = filtered.filter(t => {
        const d = new Date(t.date); d.setHours(0,0,0,0);
        if (sDate && d < sDate) return false;
        if (eDate && d > eDate) return false;
        return true;
      });
    } else if (timeFilter === 'bulan') {
      filtered = filtered.filter(t => {
        const d = new Date(t.date); d.setHours(0,0,0,0);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
      const pm = new Date(now); pm.setMonth(pm.getMonth() - 1);
      prevF = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === pm.getMonth() && d.getFullYear() === pm.getFullYear();
      });
    } else {
      const pm2 = new Date(now); pm2.setMonth(pm2.getMonth() - 1);
      prevF = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === pm2.getMonth() && d.getFullYear() === pm2.getFullYear();
      });
    }
    return { filtered, prevF };
  }, [transactions, timeFilter, customStartDate, customEndDate]);

  const getStats = useCallback(() => {
    const { filtered } = getFilteredTransactions();
    let masuk = 0, keluar = 0;
    filtered.forEach(t => t.type === 'pemasukan' ? (masuk += t.amount) : (keluar += t.amount));

    let totalMasuk = 0, totalKeluar = 0;
    transactions.forEach(t => t.type === 'pemasukan' ? (totalMasuk += t.amount) : (totalKeluar += t.amount));
    const saldo = totalMasuk - totalKeluar;

    const now = new Date(TODAY);
    const pm = new Date(now); pm.setMonth(pm.getMonth() - 1);
    let prevMasuk = 0, prevKeluar = 0;
    transactions.forEach(t => {
      const d = new Date(t.date);
      if (d.getMonth() === pm.getMonth() && d.getFullYear() === pm.getFullYear()) {
        t.type === 'pemasukan' ? (prevMasuk += t.amount) : (prevKeluar += t.amount);
      }
    });
    const mp = prevMasuk > 0 ? Math.round((masuk - prevMasuk) / prevMasuk * 100) : 0;
    const kp = prevKeluar > 0 ? Math.round((keluar - prevKeluar) / prevKeluar * 100) : 0;
    return { saldo, masuk, keluar, mp, kp };
  }, [transactions, getFilteredTransactions]);

  // ── Transaction actions ───────────────────────────────────────────
  const addTransaction = useCallback((txn) => {
    const id = nextTxnId;
    setNextTxnId(p => p + 1);
    setTransactions(prev => [...prev, { ...txn, id, status: 'SELESAI' }]);
    setNotifications(prev => [{ id: Date.now(), text: `Transaksi "${txn.desc}" ditambahkan`, time: 'Baru saja', read: false, icon: 'fa-check-circle', iconColor: 'text-tertiary' }, ...prev]);
    showToast('Transaksi berhasil ditambahkan', 'success');
  }, [nextTxnId, showToast]);

  const editTransaction = useCallback((id, data) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    showToast('Transaksi berhasil diperbarui', 'success');
  }, [showToast]);

  const deleteTransaction = useCallback((id) => {
    if (!window.confirm('Hapus transaksi ini?')) return;
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast('Transaksi dihapus', 'info');
  }, [showToast]);

  // ── Member actions ────────────────────────────────────────────────
  const MEMBER_COLORS = ['#083D56','#00695C','#546E7A','#00897B','#0C5272','#78909C'];
  const addMember = useCallback((member) => {
    const color = MEMBER_COLORS[Math.floor(Math.random() * MEMBER_COLORS.length)];
    setMembers(prev => [...prev, { ...member, id: nextMemberId, color, isPaid: false }]);
    setNextMemberId(p => p + 1);
    showToast('Anggota berhasil ditambahkan', 'success');
  }, [nextMemberId, showToast]);

  const deleteMember = useCallback((id) => {
    if (!window.confirm('Hapus anggota ini?')) return;
    setMembers(prev => prev.filter(m => m.id !== id));
    showToast('Anggota dihapus', 'info');
  }, [showToast]);

  const toggleMemberPayment = useCallback((id) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, isPaid: !m.isPaid } : m));
  }, []);

  const toggleAllPayments = useCallback((status) => {
    setMembers(prev => prev.map(m => ({ ...m, isPaid: status })));
  }, []);

  const recordAllDues = useCallback(() => {
    const checked = members.filter(m => m.isPaid);
    if (!checked.length) { showToast('Silakan centang anggota terlebih dahulu', 'error'); return; }
    const today = new Date(TODAY).toISOString().split('T')[0];
    const { amount, interval } = duesSettings;
    let id = nextTxnId;
    const newTxns = checked.map(m => ({
      id: id++, date: today, desc: `Iuran ${interval} Hari - ${m.name}`,
      cat: 'Iuran', type: 'pemasukan', amount, status: 'SELESAI', docs: [],
    }));
    setNextTxnId(id);
    setTransactions(prev => [...prev, ...newTxns]);
    showToast(`Berhasil mencatat iuran untuk ${checked.length} anggota!`, 'success');
    navigateTo('laporan');
  }, [members, duesSettings, nextTxnId, showToast, navigateTo]);

  // ── Agenda actions ────────────────────────────────────────────────
  const addAgenda = useCallback((agenda) => {
    setAgendas(prev => [...prev, { ...agenda, id: nextAgendaId }]);
    setNextAgendaId(p => p + 1);
    showToast('Agenda berhasil ditambahkan', 'success');
  }, [nextAgendaId, showToast]);

  const editAgenda = useCallback((id, data) => {
    setAgendas(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    showToast('Agenda diperbarui', 'success');
  }, [showToast]);

  const deleteAgenda = useCallback((id) => {
    setAgendas(prev => prev.filter(a => a.id !== id));
    showToast('Agenda dihapus', 'info');
  }, [showToast]);

  // ── Notifications ─────────────────────────────────────────────────
  const markAllRead = useCallback(() => setNotifications(prev => prev.map(n => ({ ...n, read: true }))), []);
  const unreadCount = notifications.filter(n => !n.read).length;

  // ── File upload ───────────────────────────────────────────────────
  const processFiles = useCallback((files) => {
    const maxSz = 10 * 1024 * 1024;
    const okTypes = ['image/jpeg','image/png','image/jpg','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const newFiles = [...uploadedFiles];
    Array.from(files).forEach(f => {
      if (!okTypes.includes(f.type)) { showToast(`Format "${f.name}" tidak didukung`, 'error'); return; }
      if (f.size > maxSz) { showToast(`"${f.name}" melebihi 10MB`, 'error'); return; }
      const dup = newFiles.some(x => x.name === f.name && x.size === f.size);
      if (!dup) newFiles.push(f);
    });
    setUploadedFiles(newFiles);
  }, [uploadedFiles, showToast]);

  const removeFile = useCallback((idx) => setUploadedFiles(prev => prev.filter((_, i) => i !== idx)), []);
  const clearFiles = useCallback(() => setUploadedFiles([]), []);

  const value = {
    currentPage, timeFilter, setTimeFilter, typeFilter, setTypeFilter,
    customStartDate, setCustomStartDate, customEndDate, setCustomEndDate,
    transactions, members, agendas, programs, setPrograms, allocations,
    notifications, profile, setProfile, duesSettings, setDuesSettings,
    uploadedFiles, toasts, unreadCount, sidebarOpen, setSidebarOpen,
    navigateTo, showToast, removeToast,
    getFilteredTransactions, getStats,
    addTransaction, editTransaction, deleteTransaction,
    addMember, deleteMember, toggleMemberPayment, toggleAllPayments, recordAllDues,
    addAgenda, editAgenda, deleteAgenda,
    markAllRead,
    processFiles, removeFile, clearFiles,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
