import { createContext, useContext, useState, useCallback } from 'react';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#14B8A6', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

const initialOrgs = [];

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [orgs, setOrgs] = useState(initialOrgs);
  const [nextId, setNextId] = useState(1);

  const addOrg = useCallback((data) => {
    setOrgs((prev) => [
      ...prev,
      { ...data, id: nextId, color: COLORS[nextId % COLORS.length], memberCount: 0, balance: 0, createdAt: new Date().toISOString().split('T')[0] },
    ]);
    setNextId((n) => n + 1);
  }, [nextId]);

  const editOrg = useCallback((id, data) => {
    setOrgs((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)));
  }, []);

  const deleteOrg = useCallback((id) => {
    setOrgs((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const stats = {
    total:        orgs.length,
    aktif:        orgs.filter((o) => o.status === 'Aktif').length,
    pending:      orgs.filter((o) => o.status === 'Pending').length,
    nonAktif:     orgs.filter((o) => o.status === 'Non-aktif').length,
    totalBalance: orgs.reduce((s, o) => s + o.balance, 0),
    totalMembers: orgs.reduce((s, o) => s + o.memberCount, 0),
  };

  return (
    <AdminContext.Provider value={{ orgs, stats, addOrg, editOrg, deleteOrg }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
