export const TODAY = new Date();

export const initialProfile = {
  name: 'BEM Fakultas Furap',
  type: 'Kemahasiswaan',
  email: 'bem.furap@univ.ac.id',
  phone: '0812-3456-7890',
  photo: null,
  description: 'BEM Fakultas Furap merupakan badan eksekutif mahasiswa yang bergerak dalam bidang pelayanan, advokasi, dan pengembangan kreativitas mahasiswa.',
};

export const initialTransactions = [];

export const initialMembers = [
  { id: 1, name: 'Rafi Alfarizi', nim: '2210001', phone: '0812-1111-2222', color: '#083D56', isPaid: false },
  { id: 2, name: 'Siti Nurhaliza', nim: '2210002', phone: '0812-2222-3333', color: '#00695C', isPaid: false },
  { id: 3, name: 'Dimas Pratama', nim: '2210003', phone: '0812-3333-4444', color: '#546E7A', isPaid: false },
  { id: 4, name: 'Anisa Rahma', nim: '2210004', phone: '0812-4444-5555', color: '#00897B', isPaid: false },
  { id: 5, name: 'Mizan Furap', nim: '2211001', phone: '0812-3456-7890', color: '#0C5272', isPaid: false },
];

export const initialAgendas = [
  { id: 1, name: 'Sewa Aula', amount: 2500000, date: '2024-10-15' },
  { id: 2, name: 'Konsumsi Rapat', amount: 750000, date: '2024-10-18' },
  { id: 3, name: 'Cetak Brosur', amount: 1200000, date: '2024-10-22' },
  { id: 4, name: 'Bayar Listrik', amount: 480000, date: '2024-10-25' },
];

export const initialPrograms = [
  { name: 'Program Umum', progress: 79 },
  { name: 'Pendidikan', progress: 65 },
  { name: 'Kesehatan', progress: 42 },
  { name: 'Sosial', progress: 88 },
];

export const initialAllocations = [
  { name: 'Operasional', amount: 2400000, color: '#083D56' },
  { name: 'Event', amount: 1556000, color: '#00695C' },
  { name: 'Logistik', amount: 520000, color: '#546E7A' },
  { name: 'Kepegawaian', amount: 750000, color: '#00897B' },
  { name: 'Lainnya', amount: 75000, color: '#78909C' },
];

export const initialNotifications = [
  { id: 1, text: 'Transaksi berhasil ditambahkan', time: '5 menit lalu', read: false, icon: 'fa-check-circle', iconColor: 'text-tertiary' },
  { id: 2, text: 'Pembayaran sewa aula jatuh tempo', time: '1 jam lalu', read: false, icon: 'fa-exclamation-circle', iconColor: 'text-amber-500' },
  { id: 3, text: 'Laporan bulanan tersedia', time: '3 jam lalu', read: true, icon: 'fa-file-alt', iconColor: 'text-secondary' },
  { id: 4, text: 'Anggota baru bergabung', time: '1 hari lalu', read: true, icon: 'fa-user-plus', iconColor: 'text-primary' },
];
