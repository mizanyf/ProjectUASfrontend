import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';

const TODAY = new Date();

export function useFilters() {
  const { state } = useApp();
  const [timeFilter, setTimeFilter] = useState('bulan');
  const [typeFilter, setTypeFilter] = useState('semua');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [search, setSearch] = useState('');

  const getFiltered = useCallback(() => {
    const now = new Date(TODAY);
    now.setHours(0, 0, 0, 0);
    let filtered = [...state.transactions];

    if (timeFilter === 'custom') {
      const sDate = customStart ? new Date(customStart) : null;
      const eDate = customEnd   ? new Date(customEnd)   : null;
      if (sDate) sDate.setHours(0, 0, 0, 0);
      if (eDate) eDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((t) => {
        const d = new Date(t.date); d.setHours(0, 0, 0, 0);
        if (sDate && d < sDate) return false;
        if (eDate && d > eDate) return false;
        return true;
      });
    } else if (timeFilter === 'bulan') {
      filtered = filtered.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    }
    // 'semua' → no filter

    return filtered;
  }, [state.transactions, timeFilter, customStart, customEnd]);

  const getPrevMonth = useCallback(() => {
    const pm = new Date(TODAY);
    pm.setMonth(pm.getMonth() - 1);
    return state.transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === pm.getMonth() && d.getFullYear() === pm.getFullYear();
    });
  }, [state.transactions]);

  const getStats = useCallback(() => {
    const filtered = getFiltered();
    let masuk = 0, keluar = 0;
    filtered.forEach((t) => { t.type === 'pemasukan' ? (masuk += t.amount) : (keluar += t.amount); });

    let totalMasuk = 0, totalKeluar = 0;
    state.transactions.forEach((t) => { t.type === 'pemasukan' ? (totalMasuk += t.amount) : (totalKeluar += t.amount); });
    const saldo = totalMasuk - totalKeluar;

    const prev = getPrevMonth();
    let prevMasuk = 0, prevKeluar = 0;
    prev.forEach((t) => { t.type === 'pemasukan' ? (prevMasuk += t.amount) : (prevKeluar += t.amount); });

    const mp = prevMasuk  > 0 ? Math.round((masuk  - prevMasuk)  / prevMasuk  * 100) : 0;
    const kp = prevKeluar > 0 ? Math.round((keluar - prevKeluar) / prevKeluar * 100) : 0;

    return { saldo, masuk, keluar, mp, kp };
  }, [getFiltered, getPrevMonth, state.transactions]);

  const getTableData = useCallback(() => {
    let data = getFiltered();
    if (typeFilter !== 'semua') data = data.filter((t) => t.type === typeFilter);
    if (search) data = data.filter((t) => t.desc.toLowerCase().includes(search) || t.cat.toLowerCase().includes(search));
    return data.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [getFiltered, typeFilter, search]);

  const switchTime = useCallback((t) => {
    setTimeFilter(t);
    setCustomStart('');
    setCustomEnd('');
  }, []);

  const handleCustomDate = useCallback((start, end) => {
    setCustomStart(start);
    setCustomEnd(end);
    if (start || end) setTimeFilter('custom');
  }, []);

  return {
    timeFilter, typeFilter, customStart, customEnd, search,
    setTypeFilter, setSearch,
    switchTime, handleCustomDate,
    getFiltered, getStats, getTableData,
  };
}
