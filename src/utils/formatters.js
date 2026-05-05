export function formatRupiah(n) {
  return 'Rp' + Number(n).toLocaleString('id-ID');
}

export function formatDate(d) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getInitials(n) {
  if (!n) return '?';
  return n.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}

export function getTodayISO() {
  return new Date().toISOString().split('T')[0];
}
