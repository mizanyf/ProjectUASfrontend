import { createContext, useContext, useState, useCallback } from 'react';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#14B8A6', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

const initialOrgs = [
  {
    id: 1,
    name: 'BEM Fakultas Furap',
    type: 'Kemahasiswaan',
    email: 'bem.furap@univ.ac.id',
    phone: '0812-3456-7890',
    status: 'Aktif',
    description: 'BEM Fakultas Furap merupakan badan eksekutif mahasiswa yang bergerak dalam bidang pelayanan, advokasi, dan pengembangan kreativitas mahasiswa.',
    color: '#6366F1',
    memberCount: 5,
    balance: 5301000,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'HMTI Universitas Nusantara',
    type: 'Himpunan Mahasiswa',
    email: 'hmti@nusantara.ac.id',
    phone: '0811-2233-4455',
    status: 'Aktif',
    description: 'Himpunan Mahasiswa Teknik Informatika Universitas Nusantara.',
    color: '#8B5CF6',
    memberCount: 32,
    balance: 12450000,
    createdAt: '2024-02-01',
  },
  {
    id: 3,
    name: 'UKM Paduan Suara Harmoni',
    type: 'Unit Kegiatan Mahasiswa',
    email: 'harmoni@kampus.ac.id',
    phone: '0822-5566-7788',
    status: 'Pending',
    description: 'UKM Paduan Suara yang aktif dalam berbagai perlombaan tingkat nasional.',
    color: '#14B8A6',
    memberCount: 45,
    balance: 3200000,
    createdAt: '2024-03-10',
  },
  {
    id: 4,
    name: 'Komunitas Wirausaha Muda',
    type: 'Komunitas',
    email: 'wirausaha@gmail.com',
    phone: '0833-9900-1122',
    status: 'Aktif',
    description: 'Komunitas yang mendorong jiwa wirausaha di kalangan mahasiswa.',
    color: '#F59E0B',
    memberCount: 18,
    balance: 7800000,
    createdAt: '2024-03-25',
  },
  {
    id: 5,
    name: 'LSM Peduli Lingkungan',
    type: 'Lembaga',
    email: 'lingkungan@lsm.org',
    phone: '0844-1122-3344',
    status: 'Non-aktif',
    description: 'Lembaga swadaya masyarakat yang fokus pada pelestarian lingkungan hidup.',
    color: '#10B981',
    memberCount: 12,
    balance: 1500000,
    createdAt: '2023-11-05',
  },
  {
    id: 6,
    name: 'OSIS SMAN 1 Cendekia',
    type: 'OSIS',
    email: 'osis@sman1cendekia.sch.id',
    phone: '0855-3344-5566',
    status: 'Pending',
    description: 'Organisasi siswa intra sekolah SMAN 1 Cendekia.',
    color: '#EC4899',
    memberCount: 28,
    balance: 4600000,
    createdAt: '2024-04-01',
  },
];

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [orgs, setOrgs] = useState(initialOrgs);
  const [nextId, setNextId] = useState(7);

  /* ---- CRUD Organisasi ---- */
  const addOrg = useCallback((data) => {
    setOrgs((prev) => [
      ...prev,
      {
        ...data,
        id: nextId,
        color: COLORS[nextId % COLORS.length],
        memberCount: 0,
        balance: 0,
        createdAt: new Date().toISOString().split('T')[0],
      },
    ]);
    setNextId((n) => n + 1);
  }, [nextId]);

  const editOrg = useCallback((id, data) => {
    setOrgs((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)));
  }, []);

  const deleteOrg = useCallback((id) => {
    setOrgs((prev) => prev.filter((o) => o.id !== id));
  }, []);

  /* ---- Stats ---- */
  const stats = {
    total: orgs.length,
    aktif: orgs.filter((o) => o.status === 'Aktif').length,
    pending: orgs.filter((o) => o.status === 'Pending').length,
    nonAktif: orgs.filter((o) => o.status === 'Non-aktif').length,
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
