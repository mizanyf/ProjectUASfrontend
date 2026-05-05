import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useApp } from '../../context/AppContext';
import { getTodayISO } from '../../utils/formatters';

const ICON_MAP = { PDF:'fa-file-pdf text-red-400', JPG:'fa-file-image text-blue-400', JPEG:'fa-file-image text-blue-400', PNG:'fa-file-image text-emerald-400', DOC:'fa-file-word text-blue-500', DOCX:'fa-file-word text-blue-500' };

export default function TambahTransaksiModal({ isOpen, onClose }) {
  const { addTransaction, uploadedFiles, processFiles, removeFile, clearFiles } = useApp();
  const [form, setForm] = useState({ date: getTodayISO(), type: 'pemasukan', desc: '', cat: 'Operasional', amount: '', note: '' });
  const [dragging, setDragging] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.date) return alert('Pilih tanggal');
    if (!form.desc.trim()) return alert('Isi deskripsi');
    if (!form.amount || Number(form.amount) <= 0) return alert('Masukkan jumlah yang valid');
    addTransaction({ date: form.date, type: form.type, desc: form.desc.trim(), cat: form.cat, amount: Number(form.amount), note: form.note, docs: uploadedFiles.map(f => f.name) });
    clearFiles();
    setForm({ date: getTodayISO(), type: 'pemasukan', desc: '', cat: 'Operasional', amount: '', note: '' });
    onClose();
  };

  const inputCls = "input-styled w-full px-4 py-2.5 border border-neutral-light rounded-xl text-sm outline-none transition-all";
  const labelCls = "block text-xs font-semibold text-neutral uppercase tracking-wider mb-1.5";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Transaksi"
      footer={<>
        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-neutral-light rounded-xl text-sm font-semibold text-neutral-dark hover:bg-neutral-50 transition-colors">Batal</button>
        <button type="button" onClick={handleSave} className="flex-1 py-2.5 bg-tertiary text-white rounded-xl text-sm font-semibold hover:bg-tertiary-light transition-colors">Simpan</button>
      </>}
    >
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Tanggal</label><input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inputCls} /></div>
          <div><label className={labelCls}>Tipe</label>
            <select value={form.type} onChange={e => set('type', e.target.value)} className={inputCls}>
              <option value="pemasukan">Pemasukan</option>
              <option value="pengeluaran">Pengeluaran</option>
            </select>
          </div>
        </div>
        <div><label className={labelCls}>Deskripsi</label><input type="text" value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Contoh: Pembelian ATK" className={inputCls} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Kategori</label>
            <select value={form.cat} onChange={e => set('cat', e.target.value)} className={inputCls}>
              {['Operasional','Event','Sponsor','Logistik','Kepegawaian','Iuran','Lainnya'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label className={labelCls}>Jumlah (Rp)</label><input type="number" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0" className={inputCls} /></div>
        </div>
        <div><label className={labelCls}>Catatan (Opsional)</label><textarea rows={2} value={form.note} onChange={e => set('note', e.target.value)} placeholder="Tambahkan catatan..." className={`${inputCls} resize-none`} /></div>
        <div>
          <label className={labelCls}>Bukti Transaksi</label>
          <div
            className={`upload-zone p-5 text-center cursor-pointer ${uploadedFiles.length ? 'has-file' : ''} ${dragging ? 'drag-over' : ''}`}
            onClick={() => document.getElementById('txn-file-input').click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); }}
          >
            <input id="txn-file-input" type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" multiple onChange={e => { processFiles(e.target.files); e.target.value = ''; }} />
            {!uploadedFiles.length ? (
              <div>
                <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center mx-auto mb-3"><i className="fas fa-cloud-upload-alt text-neutral-light text-xl"></i></div>
                <p className="text-sm font-medium text-neutral-dark">Klik atau seret file ke sini</p>
                <p className="text-xs text-neutral mt-1">JPG, PNG, PDF, DOC (Maks. 10MB)</p>
              </div>
            ) : (
              <div className="space-y-2" onClick={e => e.stopPropagation()}>
                {uploadedFiles.map((f, i) => {
                  const ext = f.name.split('.').pop().toUpperCase();
                  const sz = f.size < 1048576 ? (f.size/1024).toFixed(1)+' KB' : (f.size/1048576).toFixed(1)+' MB';
                  const ic = ICON_MAP[ext] || 'fa-file text-neutral-light';
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm"><i className={`fas ${ic}`}></i></div>
                      <div className="flex-1 min-w-0"><p className="text-sm font-medium text-neutral-dark truncate">{f.name}</p><p className="text-[11px] text-neutral">{sz}</p></div>
                      <button type="button" onClick={() => removeFile(i)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-neutral-light hover:text-red-500 transition-colors"><i className="fas fa-times text-sm"></i></button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
