// URL Logo MoneFlo Baru
const LOGO_MONEFLO = "logoproject.jpeg";

var TODAY = new Date(2024, 9, 25);

// UPDATED: Logika default diubah ke 'bulan' sesuai instruksi (Awal masuk Beranda tampil bulan ini/bulan lalu)
var state = {
    currentPage: 'login', 
    currentTimeFilter: 'bulan', // DIUBAH DARI 'minggu' KE 'bulan'
    currentTypeFilter: 'semua',
    charts: {}, uploadedFiles: [], profileEditOpen: false, forgotEmail: '',
    // Set default foto profil ke Logo MoneFlo
    profile: { name: 'BEM Fakultas Furap', type: 'Kemahasiswaan', email: 'bem.furap@univ.ac.id', phone: '0812-3456-7890', photo: LOGO_MONEFLO, description: 'BEM Fakultas Furap merupakan badan eksekutif mahasiswa.' },
    // UPDATED: Status 'DIPROSES' removed from dummy data. All 'SELESAI'.
    transactions: [
        { id: 1, date: '2024-10-25', desc: 'Pembelian Banner Dies Natalis', cat: 'Event', type: 'pengeluaran', amount: 350000, status: 'SELESAI', docs: [] },
        { id: 2, date: '2024-10-24', desc: 'Iuran Anggota Minggu Ini', cat: 'Operasional', type: 'pemasukan', amount: 800000, status: 'SELESAI', docs: [] },
        { id: 3, date: '2024-10-23', desc: 'Konsumsi Rapat Koordinasi', cat: 'Operasional', type: 'pengeluaran', amount: 375000, status: 'SELESAI', docs: [] },
        { id: 4, date: '2024-10-22', desc: 'Cetak Brosur', cat: 'Operasional', type: 'pengeluaran', amount: 420000, status: 'SELESAI', docs: [] },
        { id: 5, date: '2024-10-21', desc: 'Sponsorship PT. Maju Jaya', cat: 'Sponsor', type: 'pemasukan', amount: 5000000, status: 'SELESAI', docs: ['invoice.pdf'] },
        { id: 6, date: '2024-10-19', desc: 'Dana Kepegawaian', cat: 'Kepegawaian', type: 'pengeluaran', amount: 750000, status: 'SELESAI', docs: [] },
        { id: 7, date: '2024-10-18', desc: 'Logistik & Alat Tulis', cat: 'Logistik', type: 'pengeluaran', amount: 1240000, status: 'SELESAI', docs: ['nota_atk.jpg'] },
        { id: 8, date: '2024-10-15', desc: 'Sewa Sound System', cat: 'Event', type: 'pengeluaran', amount: 850000, status: 'SELESAI', docs: ['kwitansi.jpg'] },
        { id: 9, date: '2024-10-14', desc: 'Dana Donatur Alumni', cat: 'Sponsor', type: 'pemasukan', amount: 1500000, status: 'SELESAI', docs: ['donasi.pdf'] },
        { id: 10, date: '2024-10-10', desc: 'Iuran Anggota Awal Bulan', cat: 'Operasional', type: 'pemasukan', amount: 1100000, status: 'SELESAI', docs: [] },
        { id: 11, date: '2024-09-28', desc: 'Bayar Listrik', cat: 'Operasional', type: 'pengeluaran', amount: 480000, status: 'SELESAI', docs: [] },
        { id: 12, date: '2024-09-25', desc: 'Sponsor Kegiatan', cat: 'Sponsor', type: 'pemasukan', amount: 2500000, status: 'SELESAI', docs: [] },
        { id: 13, date: '2024-09-22', desc: 'Sponsor Kecil', cat: 'Sponsor', type: 'pemasukan', amount: 800000, status: 'SELESAI', docs: [] },
        { id: 14, date: '2024-09-18', desc: 'Konsumsi Rapat', cat: 'Operasional', type: 'pengeluaran', amount: 450000, status: 'SELESAI', docs: [] },
        { id: 15, date: '2024-09-15', desc: 'ATK Mingguan', cat: 'Logistik', type: 'pengeluaran', amount: 280000, status: 'SELESAI', docs: [] },
        { id: 16, date: '2024-09-12', desc: 'Keamanan Acara', cat: 'Event', type: 'pengeluaran', amount: 350000, status: 'SELESAI', docs: [] },
        { id: 17, date: '2024-09-10', desc: 'Iuran Anggota', cat: 'Operasional', type: 'pemasukan', amount: 500000, status: 'SELESAI', docs: [] },
        { id: 18, date: '2024-09-08', desc: 'Iuran Awal Bulan', cat: 'Operasional', type: 'pemasukan', amount: 600000, status: 'SELESAI', docs: [] },
        { id: 19, date: '2024-09-05', desc: 'Kebersihan', cat: 'Operasional', type: 'pengeluaran', amount: 300000, status: 'SELESAI', docs: [] },
        { id: 20, date: '2024-09-03', desc: 'Konsumsi', cat: 'Operasional', type: 'pengeluaran', amount: 400000, status: 'SELESAI', docs: [] },
        { id: 21, date: '2024-09-20', desc: 'Operasional Umum', cat: 'Operasional', type: 'pengeluaran', amount: 750000, status: 'SELESAI', docs: [] },
        { id: 22, date: '2024-09-15', desc: 'Kegiatan Sosial', cat: 'Operasional', type: 'pengeluaran', amount: 500000, status: 'SELESAI', docs: [] },
        { id: 23, date: '2024-09-20', desc: 'Donatur Rutin', cat: 'Sponsor', type: 'pemasukan', amount: 300000, status: 'SELESAI', docs: [] }
    ],
    programs: [{ name: 'Program Umum', progress: 79 }, { name: 'Pendidikan', progress: 65 }, { name: 'Kesehatan', progress: 42 }, { name: 'Sosial', progress: 88 }],
    allocations: [{ name: 'Operasional', amount: 2400000, color: '#083D56' }, { name: 'Event', amount: 1556000, color: '#00695C' }, { name: 'Logistik', amount: 520000, color: '#546E7A' }, { name: 'Kepegawaian', amount: 750000, color: '#00897B' }, { name: 'Lainnya', amount: 75000, color: '#78909C' }],
    // UPDATED: Dates changed to YYYY-MM-DD format for native date picker compatibility
    agendas: [{ id: 1, name: 'Sewa Aula', amount: 2500000, date: '2024-10-15' }, { id: 2, name: 'Konsumsi Rapat', amount: 750000, date: '2024-10-18' }, { id: 3, name: 'Cetak Brosur', amount: 1200000, date: '2024-10-22' }, { id: 4, name: 'Bayar Listrik', amount: 480000, date: '2024-10-25' }],
    nextAgendaId: 5, nextTxnId: 24, nextMemberId: 6,
    members: [
        { id: 1, name: 'Rafi Alfarizi', nim: '2210001', phone: '0812-1111-2222', color: '#083D56', isPaid: false },
        { id: 2, name: 'Siti Nurhaliza', nim: '2210002', phone: '0812-2222-3333', color: '#00695C', isPaid: false },
        { id: 3, name: 'Dimas Pratama', nim: '2210003', phone: '0812-3333-4444', color: '#546E7A', isPaid: false },
        { id: 4, name: 'Anisa Rahma', nim: '2210004', phone: '0812-4444-5555', color: '#00897B', isPaid: false },
        { id: 5, name: 'Mizan Furap', nim: '2211001', phone: '0812-3456-7890', color: '#0C5272', isPaid: false }
    ],
    duesSettings: { interval: 30, amount: 10000 },
    notifications: [
        { text: 'Transaksi berhasil ditambahkan', time: '5 menit lalu', read: false, icon: 'fa-check-circle', iconColor: 'text-tertiary' },
        { text: 'Pembayaran sewa aula jatuh tempo', time: '1 jam lalu', read: false, icon: 'fa-exclamation-circle', iconColor: 'text-amber-500' },
        { text: 'Laporan bulanan tersedia', time: '3 jam lalu', read: true, icon: 'fa-file-alt', iconColor: 'text-secondary' },
        { text: 'Anggota baru bergabung', time: '1 hari lalu', read: true, icon: 'fa-user-plus', iconColor: 'text-primary' }
    ],
    // State untuk filter custom date
    customStartDate: null,
    customEndDate: null
};

// UPDATED: Helper function to format YYYY-MM-DD to "15 Okt2024" for display
function formatDisplayDate(dateString) {
    // Check if it contains space (old format) or dash (new format)
    if (dateString && dateString.includes(' ')) return dateString;
    
    if (!dateString) return '-';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
        return dateString;
    }
}

function formatRupiah(n) { return 'Rp' + Number(n).toLocaleString('id-ID'); }
function formatDate(d) { return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); }
function getInitials(n) { return n.split(' ').map(function (w) { return w[0]; }).join('').substring(0, 2).toUpperCase(); }
function togglePass(id, btn) { var inp = typeof id === 'string' ? document.getElementById(id) : id, show = inp.type === 'password'; inp.type = show ? 'text' : 'password'; btn.innerHTML = '<i class="fas fa-eye' + (show ? '-slash' : '') + ' text-sm"></i>'; }

function showToast(msg, type) {
    var c = document.getElementById('toast-container');
    var colors = { success: 'bg-tertiary text-white', error: 'bg-red-500 text-white', info: 'bg-primary text-white' };
    var icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    var cls = colors[type] || colors.info, ic = icons[type] || icons.info;
    var el = document.createElement('div');
    el.className = 'toast-enter flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg ' + cls + ' min-w-[280px]';
    el.innerHTML = '<i class="fas ' + ic + ' text-sm flex-shrink-0"></i><span class="text-sm font-medium flex-1">' + msg + '</span><button type="button" onclick="this.parentElement.classList.add(\'toast-exit\');setTimeout(function(){this.remove()}.bind(this.parentElement),300)" class="flex-shrink-0 hover:opacity-70"><i class="fas fa-times text-xs"></i></button>';
    c.appendChild(el);
    setTimeout(function () { if (el.parentElement) { el.classList.add('toast-exit'); setTimeout(function () { if (el.parentElement) el.remove(); }, 300); } }, 3500);
}

function openModal(id) { var el = document.getElementById(id); el.classList.remove('hidden'); el.style.opacity = '0'; requestAnimationFrame(function () { el.style.opacity = '1'; }); document.body.style.overflow = 'hidden'; if (id === 'modal-notif') renderNotifList(); if (id === 'modal-org-info') renderOrgPanel(); }
function closeModal(id) { var el = document.getElementById(id); el.style.opacity = '0'; setTimeout(function () { el.classList.add('hidden'); document.body.style.overflow = ''; }, 200); }

function openOrgPanel() { openModal('modal-org-info'); }

function renderOrgPanel() {
    var o = state.profile;
    // Gunakan logo MoneFlo jika ada foto, atau inisial
    var logoHtml = o.photo ? '<img src="' + o.photo + '" class="w-full h-full object-cover rounded-2xl">' : getInitials(o.name);

    document.getElementById('org-info-header').innerHTML = '<div class="bg-gradient-to-br from-primary via-primary-light to-tertiary px-6 pt-8 pb-10 text-center"><div class="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold mx-auto ring-4 ring-white/20 shadow-lg overflow-hidden" id="panel-logo-img-wrap">' + logoHtml + '</div><h4 class="text-xl font-bold text-white mt-4">' + o.name + '</h4><p class="text-white/70 text-sm mt-1">' + o.type + '</p></div>';
    document.getElementById('org-info-grid').innerHTML = '<div class="grid grid-cols-3 gap-3"><div class="bg-neutral-50 rounded-xl p-3.5 text-center"><div class="flex items-center justify-center gap-1.5 mb-1.5"><i class="fas fa-users text-tertiary text-xs"></i><span class="text-[10px] font-semibold text-neutral uppercase tracking-wider">Anggota</span></div><p class="font-display font-bold text-xl text-primary-dark">' + state.members.length + '</p></div><div class="bg-neutral-50 rounded-xl p-3.5"><div class="flex items-center gap-1.5 mb-1.5"><i class="fas fa-envelope text-tertiary text-xs"></i><span class="text-[10px] font-semibold text-neutral uppercase tracking-wider">Email</span></div><p class="text-xs font-medium text-neutral-dark truncate">' + o.email + '</p></div><div class="bg-neutral-50 rounded-xl p-3.5"><div class="flex items-center gap-1.5 mb-1.5"><i class="fas fa-phone text-tertiary text-xs"></i><span class="text-[10px] font-semibold text-neutral uppercase tracking-wider">Telepon</span></div><p class="text-xs font-medium text-neutral-dark">' + o.phone + '</p></div></div>';
    document.getElementById('org-info-desc').innerHTML = '<h5 class="text-xs font-semibold text-neutral uppercase tracking-wider mb-2">Deskripsi</h5><p class="text-sm text-neutral-dark leading-relaxed">' + o.description + '</p>';
    var html = '<h5 class="text-xs font-semibold text-neutral uppercase tracking-wider mb-3">Daftar Anggota</h5><div class="space-y-1.5 max-h-[240px] overflow-y-auto pr-1">';
    for (var i = 0; i < state.members.length; i++) {
        var m = state.members[i];
        html += '<div class="member-row flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-light/50 shadow-sm"><div class="member-avatar" style="background:' + m.color + '">' + getInitials(m.name) + '</div><div class="flex-1 min-w-0"><p class="text-sm font-semibold text-neutral-dark truncate">' + m.name + '</p><p class="text-xs text-tertiary mt-0.5">' + m.nim + '</p></div></div>';
    }
    html += '</div>';
    document.getElementById('org-info-members').innerHTML = html;
}

function getFiltered() {
    var now = new Date(TODAY), filtered = state.transactions.slice(), prevF = [];
    
    // Custom Date Filter Logic
    if (state.currentTimeFilter === 'custom') {
        var sDate = state.customStartDate ? new Date(state.customStartDate) : null;
        var eDate = state.customEndDate ? new Date(state.customEndDate) : null;

        if (sDate) sDate.setHours(0, 0, 0, 0);
        if (eDate) eDate.setHours(23, 59, 59, 999);

        filtered = filtered.filter(function (t) {
            var d = new Date(t.date);
            var valid = true;
            if (sDate && d < sDate) valid = false;
            if (eDate && d > eDate) valid = false;
            return valid;
        });
        // Untuk custom range, kita set prevF kosong agar perhitungan % tidak error atau menampilkan data palsu
        prevF = [];
    } 
    else if (state.currentTimeFilter === 'minggu') { 
        var wa = new Date(now); wa.setDate(wa.getDate() - 7); filtered = filtered.filter(function (t) { return new Date(t.date) >= wa; }); var pwa = new Date(wa); pwa.setDate(pwa.getDate() - 7); prevF = state.transactions.filter(function (t) { return new Date(t.date) >= pwa && new Date(t.date) < wa; }); 
    }
    else if (state.currentTimeFilter === 'bulan') { filtered = filtered.filter(function (t) { var d = new Date(t.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }); var pm = new Date(now); pm.setMonth(pm.getMonth() - 1); prevF = state.transactions.filter(function (t) { var d = new Date(t.date); return d.getMonth() === pm.getMonth() && d.getFullYear() === pm.getFullYear(); }); }
    else { var pm2 = new Date(now); pm2.setMonth(pm2.getMonth() - 1); prevF = state.transactions.filter(function (t) { var d = new Date(t.date); return d.getMonth() === pm2.getMonth() && d.getFullYear() === pm2.getFullYear(); }); }
    return { filtered: filtered, prevF: prevF };
}

function handleCustomDate(pageType) {
    // Tentukan ID input berdasarkan halaman
    var startId = 'filter-start-' + pageType;
    var endId = 'filter-end-' + pageType;
    var sVal = document.getElementById(startId).value;
    var eVal = document.getElementById(endId).value;

    // Jika ada salah satu tanggal yang diisi, aktifkan mode custom
    if (sVal || eVal) {
        state.currentTimeFilter = 'custom';
        state.customStartDate = sVal;
        state.customEndDate = eVal;

        // Hapus kelas aktif dari tombol preset
        document.querySelectorAll('.filter-btn[data-time]').forEach(function (b) { b.classList.remove('active-time'); });
        
        applyFilters();
    }
}

function getSearchValue() { var v1 = document.getElementById('txn-search') ? document.getElementById('txn-search').value : ''; var v2 = document.getElementById('lap-txn-search') ? document.getElementById('lap-txn-search').value : ''; return (v1 + v2).toLowerCase(); }
function updateAllStatCards() {
    // 1. Hitung Pemasukan & Pengeluaran TAMPILAN berdasarkan Filter (Standard behavior)
    var result = getFiltered(), filtered = result.filtered;
    var masuk = 0, keluar = 0;
    for (var i = 0; i < filtered.length; i++) { if (filtered[i].type === 'pemasukan') masuk += filtered[i].amount; else keluar += filtered[i].amount; }
    
    // 2. Hitung Total Saldo dari SEMUA transaksi (Pakem Total Saldo)
    var totalMasuk = 0, totalKeluar = 0;
    for (var k = 0; k < state.transactions.length; k++) {
        if (state.transactions[k].type === 'pemasukan') totalMasuk += state.transactions[k].amount;
        else totalKeluar += state.transactions[k].amount;
    }
    var saldo = totalMasuk - totalKeluar;

    // 3. Hitung Bulan Lalu secara independen (Hardcoded ke Bulan Lalu kalender)
    var now = TODAY;
    var prevMonthDate = new Date(now);
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1); // Mundur 1 bulan

    var prevMasuk = 0, prevKeluar = 0;
    for (var j = 0; j < state.transactions.length; j++) {
        var t = state.transactions[j];
        var d = new Date(t.date);
        // Cek apakah transaksi berada di bulan lalu
        if (d.getMonth() === prevMonthDate.getMonth() && d.getFullYear() === prevMonthDate.getFullYear()) {
            if (t.type === 'pemasukan') prevMasuk += t.amount;
            else prevKeluar += t.amount;
        }
    }

    var mp = prevMasuk > 0 ? Math.round((masuk - prevMasuk) / prevMasuk * 100) : 0;
    var kp = prevKeluar > 0 ? Math.round((keluar - prevKeluar) / prevKeluar * 100) : 0;

    // Render ke UI
    var prefixes = ['home', 'txn', 'lap'];
    for (var p = 0; p < prefixes.length; p++) {
        var px = prefixes[p];
        var se = document.getElementById(px + '-saldo'), me = document.getElementById(px + '-masuk'), ke = document.getElementById(px + '-keluar');
        var spe = document.getElementById(px + '-saldo-pct'), mpe = document.getElementById(px + '-masuk-pct'), kpe = document.getElementById(px + '-keluar-pct');
        
        // UPDATE SALDO ke Total Saldo
        if (se) se.textContent = formatRupiah(saldo);
        
        // UPDATE MASUK & KELUAR tetap Filtered
        if (me) me.textContent = formatRupiah(masuk);
        if (ke) ke.textContent = formatRupiah(keluar);
        
        // UPDATE TEKS PERSENTASE
        // Saldo: Tampilkan info statis karena nilainya adalah Total Akumulatif
        if (spe) spe.innerHTML = '<i class="fas fa-wallet mr-1"></i>Total Saldo Akumulatif';
        
        // Masuk & Keluar: Selalu tampilkan persentase dibandingkan Bulan Lalu
        if (mpe) mpe.innerHTML = '<i class="fas fa-arrow-' + (mp >= 0 ? 'up' : 'down') + ' mr-1"></i>' + (mp >= 0 ? '+' : '') + mp + '% dari Bulan Lalu';
        if (kpe) kpe.innerHTML = '<i class="fas fa-arrow-' + (kp >= 0 ? 'up' : 'down') + ' mr-1"></i>' + (kp >= 0 ? '+' : '') + kp + '% dari Bulan Lalu';
    }
}
function renderFilteredTable(bodyId, data) {
    var el = document.getElementById(bodyId); if (!el) return; var html = '';
    // UPDATED: Status logic simplified. Always 'SELESAI'.
    for (var i = 0; i < data.length; i++) {
        var t = data[i], isM = t.type === 'pemasukan'; var docS = t.docs.length ? ' <span class="ml-1 inline-flex items-center text-[10px] text-neutral cursor-help" title="' + t.docs.join(', ') + '"><i class="fas fa-paperclip"></i>' + t.docs.length + '</span>' : '';
        var stC = 'bg-tertiary-50 text-tertiary'; // Always Completed

        html += '<tr class="border-t border-neutral-light/30 hover:bg-neutral-50/50 transition-colors"><td class="px-5 py-3 text-neutral whitespace-nowrap">' + formatDate(t.date) + '</td><td class="px-5 py-3 text-neutral-dark font-medium">' + t.desc + docS + '</td><td class="px-5 py-3"><span class="px-2.5 py-1 bg-neutral-50 rounded-md text-xs font-medium text-neutral-dark">' + t.cat + '</span></td><td class="px-5 py-3"><span class="inline-flex items-center gap-1.5 text-xs font-semibold ' + (isM ? 'text-tertiary' : 'text-red-500') + '"><i class="fas ' + (isM ? 'fa-arrow-down' : 'fa-arrow-up') + ' text-[10px]"></i>' + (isM ? 'Masuk' : 'Keluar') + '</span></td><td class="px-5 py-3 text-right font-display font-semibold ' + (isM ? 'text-tertiary' : 'text-red-500') + '">' + (isM ? '+' : '-') + formatRupiah(t.amount) + '</td><td class="px-5 py-3 text-center"><span class="inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold ' + stC + '">SELESAI</span></td></tr>';
    }
    if (!data.length) html = '<tr><td colspan="6" class="px-5 py-8 text-center text-neutral text-sm">Tidak ada transaksi ditemukan</td></tr>';
    el.innerHTML = html;
}
function applyFilters() {
    var result = getFiltered(), filtered = result.filtered; var tableFiltered = filtered;
    if (state.currentTypeFilter !== 'semua') tableFiltered = tableFiltered.filter(function (t) { return t.type === state.currentTypeFilter; });
    var s = getSearchValue(); if (s) tableFiltered = tableFiltered.filter(function (t) { return t.desc.toLowerCase().includes(s) || t.cat.toLowerCase().includes(s); });
    tableFiltered.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    updateAllStatCards(); renderFilteredTable('txn-table-body', tableFiltered); renderFilteredTable('lap-txn-table-body', tableFiltered); renderRecentTransactions(filtered.slice(0, 5));
}
function filterTime(t) { 
    state.currentTimeFilter = t; 
    
    // Reset Custom Date State when switching presets
    state.customStartDate = null;
    state.customEndDate = null;
    
    // Reset UI inputs
    var inputs = ['filter-start-txn', 'filter-end-txn', 'filter-start-lap', 'filter-end-lap'];
    inputs.forEach(function(id) {
        var el = document.getElementById(id);
        if(el) el.value = '';
    });

    document.querySelectorAll('.filter-btn[data-time]').forEach(function (b) { b.classList.toggle('active-time', b.dataset.time === t); }); applyFilters(); 
}
function filterType(t) { state.currentTypeFilter = t; document.querySelectorAll('.filter-btn[data-type]').forEach(function (b) { b.classList.toggle('active-type', b.dataset.type === t); }); applyFilters(); }

function handleProfilePhoto(input) { var file = input.files[0]; if (!file) return; if (!file.type.startsWith('image/')) { showToast('Hanya file gambar', 'error'); return; } if (file.size > 5 * 1024 * 1024) { showToast('Maksimal 5MB', 'error'); return; } var reader = new FileReader(); reader.onload = function (e) { state.profile.photo = e.target.result; updateProfilePhotoDisplay(); showToast('Logo organisasi diperbarui', 'success'); }; reader.readAsDataURL(file); input.value = ''; }
function updateProfilePhotoDisplay() {
    var initials = getInitials(state.profile.name);
    var img = document.getElementById('profile-photo-img'), init = document.getElementById('profile-photo-initial'), wrap = img.parentElement;
    if (state.profile.photo) { img.src = state.profile.photo; img.classList.remove('hidden'); init.classList.add('hidden'); wrap.classList.remove('bg-primary-light'); } else { img.classList.add('hidden'); init.classList.remove('hidden'); init.textContent = initials; wrap.classList.add('bg-primary-light'); }
    var sbLogo = document.getElementById('sidebar-org-logo');
    var tbAvatar = document.getElementById('topbar-avatar');
    var tbName = document.getElementById('topbar-name');
    var sbName = document.getElementById('sidebar-org-name');
    sbName.textContent = state.profile.name;
    tbName.textContent = state.profile.name;
    var htmlImg = state.profile.photo ? '<img src="' + state.profile.photo + '" alt="Logo">' : '<span>' + initials + '</span>';
    sbLogo.innerHTML = htmlImg;
    tbAvatar.innerHTML = htmlImg;
    if (!state.profile.photo) {
        sbLogo.classList.add('bg-tertiary/40');
        tbAvatar.classList.add('bg-primary');
    } else {
        sbLogo.classList.remove('bg-tertiary/40');
        tbAvatar.classList.remove('bg-primary');
        sbLogo.querySelector('img').className = "w-full h-full object-cover";
        tbAvatar.querySelector('img').className = "w-full h-full object-cover";
    }
    document.getElementById('profile-display-name').textContent = state.profile.name;
    document.getElementById('profile-display-type').textContent = state.profile.type;
    document.getElementById('profile-email-text').textContent = state.profile.email;
    document.getElementById('profile-phone-text').textContent = state.profile.phone;
    document.getElementById('profile-desc-text').textContent = state.profile.description;
}
function toggleProfileEdit() { state.profileEditOpen = !state.profileEditOpen; var s = document.getElementById('profile-edit-section'), b = document.getElementById('btn-edit-profil'); if (state.profileEditOpen) { s.classList.remove('hidden'); s.classList.add('page-enter'); document.getElementById('edit-name').value = state.profile.name; document.getElementById('edit-type').value = state.profile.type; document.getElementById('edit-email').value = state.profile.email; document.getElementById('edit-phone').value = state.profile.phone; document.getElementById('edit-desc').value = state.profile.description; b.innerHTML = '<i class="fas fa-times text-xs"></i> Batal Edit'; } else { s.classList.add('hidden'); b.innerHTML = '<i class="fas fa-pen text-xs"></i> Edit Profil'; } }
function saveProfileEdit() { var n = document.getElementById('edit-name').value.trim(), type = document.getElementById('edit-type').value, e = document.getElementById('edit-email').value.trim(), p = document.getElementById('edit-phone').value.trim(), d = document.getElementById('edit-desc').value.trim(); if (!n || !type || !e || !p) { showToast('Semua field wajib diisi', 'error'); return; } state.profile.name = n; state.profile.type = type; state.profile.email = e; state.profile.phone = p; state.profile.description = d; updateProfilePhotoDisplay(); toggleProfileEdit(); showToast('Profil organisasi berhasil diperbarui', 'success'); }

function getPasswordStrength(pw) { var s = 0; if (pw.length >= 8) s++; if (pw.length >= 12) s++; if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++; if (/\d/.test(pw)) s++; if (/[^a-zA-Z0-9]/.test(pw)) s++; return s; }
function renderStrengthBars(cid, score) { var c = document.getElementById(cid); if (!c) return; var colors = ['#EF4444', '#F59E0B', '#F59E0B', '#10B981', '#00695C'], labels = ['Sangat Lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'], html = ''; for (var i = 0; i < 5; i++)html += '<div class="flex-1 h-1.5 rounded-full" style="background:' + (i <= score ? colors[score] : '#ECEFF1') + '"></div>'; c.innerHTML = html; if (score > 0) c.innerHTML += '<span class="text-[10px] ml-2 font-semibold" style="color:' + colors[score] + '">' + labels[score] + '</span>'; }
function updateSettingPassStrength() { renderStrengthBars('setting-pass-strength', getPasswordStrength(document.getElementById('setting-new-pass').value)); checkSettingPassMatch(); }
function checkSettingPassMatch() { var pw = document.getElementById('setting-new-pass').value, cf = document.getElementById('setting-confirm-pass').value, el = document.getElementById('setting-pass-match'); if (!cf) { el.classList.add('hidden'); return; } el.classList.remove('hidden'); if (pw === cf) { el.className = 'text-xs px-3 py-2 rounded-lg mt-1 bg-tertiary-50 text-tertiary'; el.innerHTML = '<i class="fas fa-check-circle mr-1"></i>Kata sandi cocok'; } else { el.className = 'text-xs px-3 py-2 rounded-lg mt-1 bg-red-50 text-red-500'; el.innerHTML = '<i class="fas fa-times-circle mr-1"></i>Kata sandi tidak cocok'; } }
function handleSettingChangePassword() { var old = document.getElementById('setting-old-pass').value, np = document.getElementById('setting-new-pass').value, cf = document.getElementById('setting-confirm-pass').value; if (!old) { showToast('Masukkan kata sandi lama', 'error'); return; } if (!np || np.length < 8) { showToast('Kata sandi baru minimal 8 karakter', 'error'); return; } if (np !== cf) { showToast('Konfirmasi kata sandi tidak cocok', 'error'); return; } if (getPasswordStrength(np) < 2) { showToast('Kata sandi terlalu lemah', 'error'); return; } document.getElementById('setting-old-pass').value = ''; document.getElementById('setting-new-pass').value = ''; document.getElementById('setting-confirm-pass').value = ''; document.getElementById('setting-pass-strength').innerHTML = ''; document.getElementById('setting-pass-match').classList.add('hidden'); showToast('Kata sandi berhasil diubah', 'success'); }

function resetForgotView() { document.getElementById('forgot-step-1').classList.remove('hidden'); document.getElementById('forgot-step-2').classList.add('hidden'); document.getElementById('forgot-step-3').classList.add('hidden'); document.getElementById('forgot-success').classList.add('hidden'); }
function buildOtpInputs() { var c = document.getElementById('otp-inputs'), html = ''; for (var i = 0; i < 6; i++)html += '<input type="text" maxlength="1" class="otp-digit text-center text-xl font-bold border-2 border-neutral-light rounded-xl outline-none focus:border-tertiary transition-colors" data-idx="' + i + '" oninput="onOtpInput(this)" onkeydown="onOtpKeydown(event,this)" onpaste="onOtpPaste(event)">'; c.innerHTML = html; c.querySelector('.otp-digit').focus(); }
function onOtpInput(el) { el.value = el.value.replace(/\D/g, ''); if (el.value && el.dataset.idx < 5) { var nx = document.querySelector('.otp-digit[data-idx="' + (parseInt(el.dataset.idx) + 1) + '"]'); if (nx) nx.focus(); } }
function onOtpKeydown(e, el) { if (e.key === 'Backspace' && !el.value && el.dataset.idx > 0) { var pv = document.querySelector('.otp-digit[data-idx="' + (parseInt(el.dataset.idx) - 1) + '"]'); if (pv) { pv.focus(); pv.value = ''; } } }
function onOtpPaste(e) { e.preventDefault(); var data = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').substring(0, 6), digits = document.querySelectorAll('.otp-digit'); for (var i = 0; i < data.length && i < digits.length; i++)digits[i].value = data[i]; if (data.length > 0 && data.length < digits.length) digits[data.length].focus(); }
function getOtpValue() { var digits = document.querySelectorAll('.otp-digit'), code = ''; for (var i = 0; i < digits.length; i++)code += digits[i].value; return code; }
function handleForgotStep1() { var email = document.getElementById('forgot-email').value.trim(); if (!email || !/\S+@\S+\.\S+/.test(email)) { showToast('Masukkan email yang valid', 'error'); return; } state.forgotEmail = email; document.getElementById('forgot-email-display').textContent = email; document.getElementById('forgot-step-1').classList.add('hidden'); document.getElementById('forgot-step-2').classList.remove('hidden'); document.getElementById('forgot-step-2').classList.add('page-enter'); buildOtpInputs(); showToast('Kode verifikasi telah dikirim', 'info'); }
function handleResendCode() { showToast('Kode verifikasi baru telah dikirim', 'info'); }
function handleForgotStep2() { var code = getOtpValue(); if (code.length < 6) { showToast('Masukkan 6 digit kode', 'error'); return; } document.getElementById('forgot-step-2').classList.add('hidden'); document.getElementById('forgot-step-3').classList.remove('hidden'); document.getElementById('forgot-step-3').classList.add('page-enter'); document.getElementById('forgot-new-pass').focus(); }
function handleForgotStep3() { var np = document.getElementById('forgot-new-pass').value, cf = document.getElementById('forgot-confirm-pass').value; if (!np || np.length < 8) { showToast('Kata sandi baru minimal 8 karakter', 'error'); return; } if (np !== cf) { showToast('Konfirmasi kata sandi tidak cocok', 'error'); return; } if (getPasswordStrength(np) < 2) { showToast('Kata sandi terlalu lemah', 'error'); return; } document.getElementById('forgot-step-3').classList.add('hidden'); document.getElementById('forgot-success').classList.remove('hidden'); document.getElementById('forgot-success').classList.add('page-enter'); showToast('Kata sandi berhasil diubah', 'success'); }

function showPage(p) { document.getElementById('auth-login').classList.add('hidden'); document.getElementById('auth-register').classList.add('hidden'); document.getElementById('auth-forgot').classList.add('hidden'); document.getElementById('app').classList.add('hidden'); if (p === 'login') document.getElementById('auth-login').classList.remove('hidden'); else if (p === 'register') document.getElementById('auth-register').classList.remove('hidden'); else if (p === 'forgot') { document.getElementById('auth-forgot').classList.remove('hidden'); resetForgotView(); } else { document.getElementById('app').classList.remove('hidden'); navigateTo(p === 'app' ? 'beranda' : p); } state.currentPage = p; }
var pageTitles = { beranda: 'Beranda', transaksi: 'Transaksi', laporan: 'Laporan', anggota: 'Manajemen Anggota', pengaturan: 'Pengaturan', profil: 'Profil Organisasi' };
function navigateTo(p) { document.querySelectorAll('[id^="page-"]').forEach(function (el) { el.classList.add('hidden'); }); var target = document.getElementById('page-' + p); if (target) { target.classList.remove('hidden'); target.classList.remove('page-enter'); void target.offsetWidth; target.classList.add('page-enter'); } document.querySelectorAll('.nav-item').forEach(function (el) { el.classList.toggle('active', el.dataset.page === p); }); document.getElementById('page-title').textContent = pageTitles[p] || 'Beranda'; if (p !== 'profil' && state.profileEditOpen) { state.profileEditOpen = false; document.getElementById('profile-edit-section').classList.add('hidden'); document.getElementById('btn-edit-profil').innerHTML = '<i class="fas fa-pen text-xs"></i> Edit Profil'; } if (p === 'beranda') initBeranda(); if (p === 'transaksi') applyFilters(); if (p === 'laporan') initLaporan(); if (p === 'anggota') renderAnggotaPage(); if (p === 'profil') updateProfilePhotoDisplay(); document.querySelector('.content-scroll').scrollTop = 0; document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebar-overlay').classList.add('hidden'); }
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); document.getElementById('sidebar-overlay').classList.toggle('hidden'); }

function handleLogin() { var e = document.getElementById('login-email').value.trim(), p = document.getElementById('login-pass').value.trim(); if (!e || !p) { showToast('Harap isi email dan kata sandi', 'error'); return; } showToast('Berhasil masuk!', 'success'); setTimeout(function () { showPage('app'); }, 600); }
function handleRegister() { var n = document.getElementById('reg-name').value.trim(); var t = document.getElementById('reg-type').value; var e = document.getElementById('reg-email').value.trim(); var p = document.getElementById('reg-phone').value.trim(); var d = document.getElementById('reg-desc').value.trim(); var pass = document.getElementById('reg-pass').value; var cpass = document.getElementById('reg-pass-confirm').value; if (!n || !t || !e || !p || !pass) { showToast('Lengkapi semua data wajib', 'error'); return; } if (pass !== cpass) { showToast('Konfirmasi kata sandi salah', 'error'); return; } state.profile.name = n; state.profile.type = t; state.profile.email = e; state.profile.phone = p; state.profile.description = d; showToast('Organisasi berhasil didaftarkan!', 'success'); setTimeout(function () { showPage('login'); }, 800); }
function handleLogout() { showToast('Anda telah keluar', 'info'); setTimeout(function () { showPage('login'); }, 600); }

// --- ANGGOTA LOGIC ---

function renderAnggotaPage() {
    document.getElementById('dues-days').value = state.duesSettings.interval;
    document.getElementById('dues-amount').value = state.duesSettings.amount;
    renderMemberList();
}

function saveDuesSettings() {
    var days = parseInt(document.getElementById('dues-days').value);
    var amt = parseInt(document.getElementById('dues-amount').value);
    if (!days || days <= 0) { showToast('Periode tidak valid', 'error'); return; }
    if (!amt || amt < 0) { showToast('Nominal tidak valid', 'error'); return; }
    state.duesSettings.interval = days;
    state.duesSettings.amount = amt;
    showToast('Pengaturan iuran disimpan', 'success');
}

function addNewMember() {
    var name = document.getElementById('m-name').value.trim();
    var nim = document.getElementById('m-nim').value.trim();
    var phone = document.getElementById('m-phone').value.trim();

    if (!name || !nim || !phone) { showToast('Lengkapi data anggota', 'error'); return; }

    var colors = ['#083D56', '#00695C', '#546E7A', '#00897B', '#0C5272', '#78909C'];
    var color = colors[Math.floor(Math.random() * colors.length)];

    state.members.push({
        id: state.nextMemberId++,
        name: name,
        nim: nim,
        phone: phone,
        color: color,
        isPaid: false
    });

    document.getElementById('m-name').value = '';
    document.getElementById('m-nim').value = '';
    document.getElementById('m-phone').value = '';

    renderMemberList();
    showToast('Anggota berhasil ditambahkan', 'success');
}

function toggleMemberPayment(id) {
    var m = state.members.find(x => x.id === id);
    if (m) {
        m.isPaid = !m.isPaid;
        renderMemberList();
    }
}

function toggleAllPayments(status) {
    state.members.forEach(m => m.isPaid = status);
    renderMemberList();
}

function deleteMember(id) {
    if (confirm('Hapus anggota ini?')) {
        state.members = state.members.filter(function (m) { return m.id !== id; });
        renderMemberList();
        showToast('Anggota dihapus', 'info');
    }
}

function renderMemberList() {
    var tbody = document.getElementById('members-table-body');
    document.getElementById('total-count').textContent = state.members.length;

    var paidCount = state.members.filter(m => m.isPaid).length;
    document.getElementById('paid-count').textContent = paidCount;

    if (state.members.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="py-8 text-center text-neutral text-sm">Belum ada anggota</td></tr>';
        return;
    }

    var html = '';
    for (var i = 0; i < state.members.length; i++) {
        var m = state.members[i];
        html += '<tr class="border-b border-neutral-light/30 hover:bg-neutral-50/50 transition-colors">';
        html += '<td class="py-3 px-2"><div class="flex items-center gap-2"><div class="member-avatar" style="background:' + m.color + '; width:32px; height:32px; font-size:10px;">' + getInitials(m.name) + '</div><span class="font-medium text-neutral-dark text-sm">' + m.name + '</span></div></td>';
        html += '<td class="py-3 px-2 text-sm text-neutral">' + m.nim + '</td>';
        html += '<td class="py-3 px-2 text-sm text-neutral">' + m.phone + '</td>';
        html += '<td class="py-3 px-2 text-center"><input type="checkbox" class="w-5 h-5 accent-tertiary cursor-pointer" ' + (m.isPaid ? 'checked' : '') + ' onchange="toggleMemberPayment(' + m.id + ')"></td>';
        html += '<td class="py-3 px-2 text-center"><button type="button" onclick="deleteMember(' + m.id + ')" class="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Hapus Anggota"><i class="fas fa-trash-alt text-xs"></i></button></td>';
        html += '</tr>';
    }
    tbody.innerHTML = html;
}

// UPDATED: Fix logic to only record selected (checked) members
function recordAllDues() {
    if (state.members.length === 0) {
        showToast('Tidak ada anggota untuk dicatat', 'error');
        return;
    }

    // Cek apakah ada yang dicentang
    var hasChecked = state.members.some(m => m.isPaid);
    if (!hasChecked) {
        showToast('Silakan pilih (centang) anggota terlebih dahulu', 'error');
        return;
    }

    var amount = state.duesSettings.amount;
    var days = state.duesSettings.interval;
    
    // PERBAIKAN DI SINI: Menggunakan variabel TODAY (Tanggal Simulasi) agar transaksi muncul di filter Bulan Ini
    var today = TODAY.toISOString().split('T')[0];
    
    var count = 0;

    for (var i = 0; i < state.members.length; i++) {
        var m = state.members[i];
        
        // FIX: Hanya masukkan transaksi jika anggota DICENTANG (isPaid true)
        if (m.isPaid) {
            state.transactions.push({
                id: state.nextTxnId++,
                date: today,
                desc: 'Iuran ' + days + ' Hari - ' + m.name,
                cat: 'Iuran',
                type: 'pemasukan',
                amount: amount,
                status: 'SELESAI',
                docs: []
            });
            count++;
        }
    }

    showToast('Berhasil mencatat iuran untuk ' + count + ' anggota!', 'success');
    navigateTo('laporan');
}

// --- END ANGGOTA LOGIC ---

document.addEventListener('keydown', function (e) { if (e.key !== 'Enter') return; if (!document.getElementById('app').classList.contains('hidden')) return; if (document.querySelector('.modal-backdrop:not(.hidden)')) return; e.preventDefault(); if (!document.getElementById('auth-login').classList.contains('hidden')) { handleLogin(); return; } if (!document.getElementById('auth-forgot').classList.contains('hidden')) { if (!document.getElementById('forgot-step-3').classList.contains('hidden')) { handleForgotStep3(); return; } if (!document.getElementById('forgot-step-2').classList.contains('hidden')) { handleForgotStep2(); return; } handleForgotStep1(); } });

document.addEventListener('input', function (e) { if (e.target.id === 'forgot-new-pass') renderStrengthBars('pass-strength', getPasswordStrength(e.target.value)); if (e.target.id === 'forgot-confirm-pass') { var pw = document.getElementById('forgot-new-pass').value, cf = e.target.value, el = document.getElementById('forgot-pass-match'); if (!cf) { el.classList.add('hidden'); return; } el.classList.remove('hidden'); if (pw === cf) { el.className = 'text-xs px-3 py-2 rounded-lg bg-tertiary-50 text-tertiary'; el.innerHTML = '<i class="fas fa-check-circle mr-1"></i>Kata sandi cocok'; } else { el.className = 'text-xs px-3 py-2 rounded-lg bg-red-50 text-red-500'; el.innerHTML = '<i class="fas fa-times-circle mr-1"></i>Kata sandi tidak cocok'; } } });

function handleFileSelect(inp) { processFiles(inp.files); inp.value = ''; }
function handleFileDrop(e) { e.preventDefault(); e.currentTarget.classList.remove('drag-over'); processFiles(e.dataTransfer.files); }
function processFiles(files) { var maxSz = 10 * 1024 * 1024, okT = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']; for (var i = 0; i < files.length; i++) { var f = files[i]; if (!okT.includes(f.type)) { showToast('Format "' + f.name + '" tidak didukung', 'error'); continue; } if (f.size > maxSz) { showToast('"' + f.name + '" melebihi 10MB', 'error'); continue; } var dup = false; for (var j = 0; j < state.uploadedFiles.length; j++) { if (state.uploadedFiles[j].name === f.name && state.uploadedFiles[j].size === f.size) { dup = true; break; } } if (!dup) state.uploadedFiles.push(f); } renderFilePreview(); }
function renderFilePreview() { var zone = document.getElementById('upload-zone'), ph = document.getElementById('upload-placeholder'), pv = document.getElementById('upload-preview'); if (!state.uploadedFiles.length) { ph.classList.remove('hidden'); pv.classList.add('hidden'); zone.classList.remove('has-file'); return; } ph.classList.add('hidden'); pv.classList.remove('hidden'); zone.classList.add('has-file'); var iconMap = { PDF: 'fa-file-pdf text-red-400', JPG: 'fa-file-image text-blue-400', JPEG: 'fa-file-image text-blue-400', PNG: 'fa-file-image text-emerald-400', DOC: 'fa-file-word text-blue-500', DOCX: 'fa-file-word text-blue-500' }, html = ''; for (var i = 0; i < state.uploadedFiles.length; i++) { var f = state.uploadedFiles[i], ext = f.name.split('.').pop().toUpperCase(), sz = f.size < 1048576 ? (f.size / 1024).toFixed(1) + ' KB' : (f.size / 1048576).toFixed(1) + ' MB', ic = iconMap[ext] || 'fa-file text-neutral-light'; html += '<div class="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl"><div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm"><i class="fas ' + ic + '"></i></div><div class="flex-1 min-w-0"><p class="text-sm font-medium text-neutral-dark truncate">' + f.name + '</p><p class="text-[11px] text-neutral">' + sz + '</p></div><button type="button" onclick="removeFile(' + i + ')" class="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-neutral-light hover:text-red-500 transition-colors flex-shrink-0"><i class="fas fa-times text-sm"></i></button></div>'; } pv.innerHTML = html; }
function removeFile(idx) { state.uploadedFiles.splice(idx, 1); renderFilePreview(); }

function addTransaction() {
    var date = document.getElementById('txn-date').value, desc = document.getElementById('txn-desc').value.trim(), cat = document.getElementById('txn-cat').value, type = document.getElementById('txn-type').value, amount = parseInt(document.getElementById('txn-amount').value); if (!date) { showToast('Pilih tanggal', 'error'); return; } if (!desc) { showToast('Isi deskripsi', 'error'); return; } if (!amount || amount <= 0) { showToast('Masukkan jumlah yang valid', 'error'); return; } var docs = []; for (var i = 0; i < state.uploadedFiles.length; i++)docs.push(state.uploadedFiles[i].name);
    // UPDATED: Set status to 'SELESAI' directly
    state.transactions.push({ id: state.nextTxnId++, date: date, desc: desc, cat: cat, type: type, amount: amount, status: 'SELESAI', docs: docs });
    state.uploadedFiles = []; document.getElementById('txn-date').value = ''; document.getElementById('txn-desc').value = ''; document.getElementById('txn-amount').value = ''; document.getElementById('txn-note').value = ''; renderFilePreview(); closeModal('modal-tambah'); showToast('Transaksi berhasil ditambahkan', 'success'); applyFilters(); state.notifications.unshift({ text: 'Transaksi "' + desc + '" berhasil ditambahkan', time: 'Baru saja', read: false, icon: 'fa-check-circle', iconColor: 'text-tertiary' }); updateNotifBadge();
}

function initBeranda() {
    // SAFETY CHECK: Cek apakah Chart.js sudah dimuat
    if (typeof Chart !== 'undefined') {
        renderBerandaChart();
    } else {
        console.error("Chart.js gagal dimuat. Grafik Beranda tidak akan tampil.");
        document.getElementById('chart-beranda').parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-neutral text-sm">Grafik tidak tersedia (Offline/CDN Error)</div>';
    }
    renderProgressBars(); renderAgenda(); applyFilters();
}
function renderBerandaChart() {
    // SAFETY CHECK: Cek lagi di dalam fungsi render
    if (typeof Chart === 'undefined') return;
    if (state.charts.beranda) state.charts.beranda.destroy();
    state.charts.beranda = new Chart(document.getElementById('chart-beranda').getContext('2d'), { type: 'bar', data: { labels: ['Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'], datasets: [{ label: 'Pemasukan', data: [5200000, 4800000, 6500000, 5800000, 7200000, 8400000], backgroundColor: '#00695C', borderRadius: 6, barPercentage: 0.55 }, { label: 'Pengeluaran', data: [3100000, 2800000, 4200000, 3600000, 4800000, 5300000], backgroundColor: '#083D56', borderRadius: 6, barPercentage: 0.55 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'rectRounded', padding: 16, font: { family: 'Plus Jakarta Sans', size: 12 } } } }, scales: { y: { beginAtZero: true, max: 10000000, ticks: { callback: function (v) { return 'Rp' + (v / 1000000).toFixed(0) + 'jt'; }, font: { family: 'Space Grotesk', size: 11 }, color: '#767779', stepSize: 2000000 }, grid: { color: 'rgba(118,119,121,0.1)' } }, x: { ticks: { font: { family: 'Plus Jakarta Sans', size: 12 }, color: '#424242' }, grid: { display: false } } } } });
}
function renderProgressBars() { var c = document.getElementById('progress-bars'), colors = ['#00695C', '#083D56', '#00897B', '#546E7A', '#78909C', '#0C5272']; if (!state.programs.length) { c.innerHTML = '<p class="text-sm text-neutral text-center py-4">Belum ada program</p>'; return; } var html = ''; for (var i = 0; i < state.programs.length; i++) { var p = state.programs[i], clr = colors[i % colors.length]; html += '<div class="prog-row flex items-center gap-3 p-2.5 rounded-xl"><div class="flex-1 min-w-0"><div class="flex justify-between items-center mb-1"><span class="text-xs text-neutral-dark font-medium truncate">' + p.name + '</span><span class="text-[11px] font-semibold flex-shrink-0 ml-2" style="color:' + clr + '">' + p.progress + '%</span></div><div class="h-1.5 bg-neutral-100 rounded-full overflow-hidden"><div class="progress-fill h-full rounded-full" style="width:0%;background:' + clr + '" data-width="' + p.progress + '%"></div></div></div></div>'; } c.innerHTML = html; setTimeout(function () { c.querySelectorAll('.progress-fill').forEach(function (el) { el.style.width = el.dataset.width; }); }, 100); }
function renderRecentTransactions(data) { var html = ''; for (var i = 0; i < data.length; i++) { var t = data[i], isM = t.type === 'pemasukan', doc = t.docs.length ? '<p class="text-[10px] text-neutral mt-0.5"><i class="fas fa-paperclip mr-0.5"></i>' + t.docs.length + ' file</p>' : ''; html += '<div class="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors"><div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ' + (isM ? 'bg-tertiary-50' : 'bg-red-50') + '"><i class="fas ' + (isM ? 'fa-arrow-down text-tertiary' : 'fa-arrow-up text-red-400') + ' text-sm"></i></div><div class="flex-1 min-w-0"><p class="text-sm font-medium text-neutral-dark truncate">' + t.desc + '</p><p class="text-xs text-neutral">' + formatDate(t.date) + '</p></div><div class="text-right flex-shrink-0"><p class="font-display font-semibold text-sm ' + (isM ? 'text-tertiary' : 'text-red-500') + '">' + (isM ? '+' : '-') + formatRupiah(t.amount) + '</p>' + doc + '</div></div>'; } document.getElementById('recent-transactions').innerHTML = html; }

var editProgramsTemp = [];
function openEditAllPrograms() { editProgramsTemp = state.programs.map(function (p) { return { name: p.name, progress: p.progress }; }); renderEditProgramsForm(); openModal('modal-edit-real'); }
function renderEditProgramsForm() { var colors = ['#00695C', '#083D56', '#00897B', '#546E7A', '#78909C', '#0C5272'], f = document.getElementById('edit-real-form'), html = ''; for (var i = 0; i < editProgramsTemp.length; i++) { var p = editProgramsTemp[i], clr = colors[i % colors.length]; html += '<div class="prog-row p-3 rounded-xl border border-neutral-light/50"><div class="flex items-center gap-2 mb-2"><input type="text" value="' + p.name + '" data-field="name" data-idx="' + i + '" placeholder="Nama program" class="input-styled flex-1 px-3 py-2 border border-neutral-light rounded-lg text-sm outline-none transition-all font-medium"><button type="button" onclick="removeEditProgram(' + i + ')" class="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-neutral-light hover:text-red-500 transition-colors"><i class="fas fa-trash text-xs"></i></button></div><div class="flex items-center gap-3"><input type="number" value="' + p.progress + '" data-field="progress" data-idx="' + i + '" min="0" max="100" class="input-styled w-20 px-3 py-2 border border-neutral-light rounded-lg text-sm outline-none transition-all text-center"><span class="text-sm text-neutral font-semibold">%</span><div class="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden"><div class="h-full rounded-full transition-all" style="width:' + p.progress + '%;background:' + clr + '"></div></div></div><input type="range" min="0" max="100" value="' + p.progress + '" data-field="progress" data-idx="' + i + '" class="w-full mt-1" style="accent-color:' + clr + '" oninput="syncEditProgram(this)"></div>'; } html += '<button type="button" onclick="addEditProgram()" class="w-full py-2.5 border-2 border-dashed border-neutral-light rounded-xl text-sm font-medium text-neutral hover:border-tertiary hover:text-tertiary transition-colors flex items-center justify-center gap-2"><i class="fas fa-plus text-xs"></i> Tambah Program</button>'; f.innerHTML = html; f.querySelectorAll('input[type="number"][data-field="progress"]').forEach(function (inp) { inp.addEventListener('input', function () { var idx = parseInt(this.dataset.idx); editProgramsTemp[idx].progress = Math.min(100, Math.max(0, parseInt(this.value) || 0)); var row = this.closest('.prog-row'), slider = row.querySelector('input[type="range"]'), bar = row.querySelector('.h-2 > div'); if (slider) slider.value = this.value; if (bar) bar.style.width = this.value + '%'; }); }); };
function syncEditProgram(slider) { var idx = parseInt(slider.dataset.idx); editProgramsTemp[idx].progress = parseInt(slider.value); var row = slider.closest('.prog-row'), numInput = row.querySelector('input[type="number"]'), bar = row.querySelector('.h-2 > div'); if (numInput) numInput.value = slider.value; if (bar) bar.style.width = slider.value + '%'; }
function addEditProgram() { editProgramsTemp.push({ name: '', progress: 0 }); renderEditProgramsForm(); var inputs = document.querySelectorAll('#edit-real-form input[data-field="name"]'); if (inputs.length) inputs[inputs.length - 1].focus(); }
function removeEditProgram(idx) { if (editProgramsTemp.length <= 1) { showToast('Minimal 1 program', 'error'); return; } editProgramsTemp.splice(idx, 1); renderEditProgramsForm(); }
function saveEditAllPrograms() { for (var i = 0; i < editProgramsTemp.length; i++) { if (!editProgramsTemp[i].name.trim()) { showToast('Nama program ke-' + (i + 1) + ' kosong', 'error'); return; } editProgramsTemp[i].name = editProgramsTemp[i].name.trim(); editProgramsTemp[i].progress = Math.min(100, Math.max(0, parseInt(editProgramsTemp[i].progress) || 0)); } state.programs = editProgramsTemp.map(function (p) { return { name: p.name, progress: p.progress }; }); closeModal('modal-edit-real'); renderProgressBars(); showToast('Realisasi anggaran direvisi', 'success'); }

function renderAgenda() { var c = document.getElementById('agenda-list'); if (!state.agendas.length) { c.innerHTML = '<p class="text-sm text-neutral text-center py-6">Belum ada agenda</p>'; return; } var html = ''; for (var i = 0; i < state.agendas.length; i++) { var a = state.agendas[i]; 
    // UPDATED: Use formatDisplayDate to keep UI pretty ("15 Okt2024") while storing "2024-10-15"
    var displayDate = formatDisplayDate(a.date);
    html += '<div class="agenda-item flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100"><div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0"><i class="fas fa-clock text-amber-600 text-sm"></i></div><div class="flex-1 min-w-0"><p class="text-sm font-medium text-neutral-dark truncate">' + a.name + '</p><p class="text-xs text-neutral">' + displayDate + '</p></div><p class="font-display font-semibold text-sm text-amber-700 flex-shrink-0">' + formatRupiah(a.amount) + '</p><div class="agenda-actions flex items-center gap-1 flex-shrink-0"><button type="button" onclick="editAgenda(' + a.id + ')" class="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-neutral-light hover:text-tertiary transition-colors"><i class="fas fa-pen text-[10px]"></i></button><button type="button" onclick="deleteAgenda(' + a.id + ')" class="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-neutral-light hover:text-red-500 transition-colors"><i class="fas fa-trash text-[10px]"></i></button></div></div>'; } c.innerHTML = html; }
function openAgendaModal(eid) { var title = document.getElementById('agenda-modal-title'), hidden = document.getElementById('agenda-edit-id'); if (eid) { title.textContent = 'Edit Agenda'; hidden.value = eid; var a = state.agendas.find(function (x) { return x.id === eid; }); if (a) { document.getElementById('agenda-name').value = a.name; document.getElementById('agenda-amount').value = a.amount; 
    // UPDATED: Set date value directly from state (which is now YYYY-MM-DD)
    document.getElementById('agenda-date').value = a.date; } } else { title.textContent = 'Tambah Agenda'; hidden.value = ''; document.getElementById('agenda-name').value = ''; document.getElementById('agenda-amount').value = ''; document.getElementById('agenda-date').value = ''; } openModal('modal-agenda'); }
function editAgenda(id) { openAgendaModal(id); }
function saveAgenda() { var n = document.getElementById('agenda-name').value.trim(), a = parseInt(document.getElementById('agenda-amount').value), d = document.getElementById('agenda-date').value, eid = document.getElementById('agenda-edit-id').value; if (!n || !a || !d) { showToast('Lengkapi semua field', 'error'); return; } if (eid) { var ag = state.agendas.find(function (x) { return x.id === parseInt(eid); }); if (ag) { ag.name = n; ag.amount = a; ag.date = d; } showToast('Agenda diperbarui', 'success'); } else { state.agendas.push({ id: state.nextAgendaId++, name: n, amount: a, date: d }); showToast('Agenda ditambahkan', 'success'); } closeModal('modal-agenda'); renderAgenda(); }
function deleteAgenda(id) { state.agendas = state.agendas.filter(function (x) { return x.id !== id; }); showToast('Agenda dihapus', 'info'); renderAgenda(); }

function renderNotifList() { var c = document.getElementById('notif-list'); if (!state.notifications.length) { c.innerHTML = '<p class="text-sm text-neutral text-center py-8">Tidak ada notifikasi</p>'; return; } var html = ''; for (var i = 0; i < state.notifications.length; i++) { var n = state.notifications[i]; html += '<div class="flex items-start gap-3 p-4 border-b border-neutral-light/30 hover:bg-neutral-50/50 transition-colors ' + (n.read ? 'opacity-60' : '') + '"><div class="w-9 h-9 rounded-lg bg-neutral-50 flex items-center justify-center flex-shrink-0 mt-0.5"><i class="fas ' + n.icon + ' ' + n.iconColor + ' text-sm"></i></div><div class="flex-1 min-w-0"><p class="text-sm text-neutral-dark leading-snug">' + n.text + '</p><p class="text-[11px] text-neutral mt-1">' + n.time + '</p></div>' + (n.read ? '' : '<div class="w-2 h-2 rounded-full bg-tertiary flex-shrink-0 mt-2"></div>') + '</div>'; } c.innerHTML = html; }
function updateNotifBadge() { var unread = 0; for (var i = 0; i < state.notifications.length; i++) { if (!state.notifications[i].read) unread++; } var badge = document.getElementById('notif-badge'); if (unread > 0) { badge.textContent = unread; badge.classList.remove('hidden'); } else { badge.classList.add('hidden'); } }
function markAllRead() { for (var i = 0; i < state.notifications.length; i++)state.notifications[i].read = true; renderNotifList(); updateNotifBadge(); showToast('Semua notifikasi ditandai dibaca', 'info'); }

function initLaporan() {
    // SAFETY CHECK: Cek Chart.js untuk Laporan juga
    if (typeof Chart !== 'undefined') {
        renderArusKasChart();
    } else {
        document.getElementById('chart-arus-kas').parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-neutral text-sm">Grafik tidak tersedia (Offline/CDN Error)</div>';
    }
    renderAlokasiPct(); applyFilters();
}
function renderArusKasChart() {
    if (typeof Chart === 'undefined') return;
    if (state.charts.arusKas) state.charts.arusKas.destroy();
    state.charts.arusKas = new Chart(document.getElementById('chart-arus-kas').getContext('2d'), { type: 'line', data: { labels: ['Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'], datasets: [{ label: 'Pemasukan', data: [5200000, 4800000, 6500000, 5800000, 7200000, 8400000], borderColor: '#00695C', backgroundColor: 'rgba(0,105,92,0.08)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#00695C', borderWidth: 2 }, { label: 'Pengeluaran', data: [3100000, 2800000, 4200000, 3600000, 4800000, 5300000], borderColor: '#083D56', backgroundColor: 'rgba(8,61,86,0.08)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#083D56', borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { family: 'Plus Jakarta Sans', size: 12 } } } }, scales: { y: { beginAtZero: true, max: 10000000, ticks: { callback: function (v) { return 'Rp' + (v / 1000000).toFixed(0) + 'jt'; }, font: { family: 'Space Grotesk', size: 11 }, color: '#767779', stepSize: 2000000 }, grid: { color: 'rgba(118,119,121,0.1)' } }, x: { ticks: { font: { family: 'Plus Jakarta Sans', size: 12 }, color: '#424242' }, grid: { display: false } } } } });
}
function renderAlokasiPct() { var c = document.getElementById('alokasi-pct-list'), total = 0; for (var i = 0; i < state.allocations.length; i++)total += state.allocations[i].amount; document.getElementById('alokasi-total').textContent = formatRupiah(total); var html = ''; for (var j = 0; j < state.allocations.length; j++) { var a = state.allocations[j], pct = total > 0 ? Math.round(a.amount / total * 100) : 0; html += '<div><div class="flex justify-between items-center mb-1.5"><span class="text-sm font-medium text-neutral-dark">' + a.name + '</span><span class="text-xs font-semibold text-neutral">' + pct + '% &middot; ' + formatRupiah(a.amount) + '</span></div><div class="pct-bar-track"><div class="pct-bar-fill" style="width:0%;background:' + a.color + '" data-width="' + pct + '%"></div></div></div>'; } c.innerHTML = html; setTimeout(function () { c.querySelectorAll('.pct-bar-fill').forEach(function (el) { el.style.width = el.dataset.width; }); }, 150); }

function exportCSV() { var result = getFiltered(), filtered = result.filtered; if (state.currentTypeFilter !== 'semua') filtered = filtered.filter(function (t) { return t.type === state.currentTypeFilter; }); filtered.sort(function (a, b) { return new Date(b.date) - new Date(a.date); }); var csv = 'Tanggal,Deskripsi,Kategori,Tipe,Jumlah,Status\n'; for (var i = 0; i < filtered.length; i++) { var t = filtered[i]; csv += '"' + t.date + '","' + t.desc + '","' + t.cat + '","' + t.type + '",' + t.amount + ',"' + t.status + '"\n'; } var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }), url = URL.createObjectURL(blob), link = document.createElement('a'); link.href = url; link.download = 'laporan_moneflo_' + new Date().toISOString().slice(0, 10) + '.csv'; link.click(); URL.revokeObjectURL(url); showToast('File CSV berhasil diunduh', 'success'); }
function exportPDF() { window.print(); showToast('Dialog cetak dibuka', 'info'); }

updateNotifBadge();