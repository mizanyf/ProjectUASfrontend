import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useApp } from '../../context/AppContext';

export default function EditRealisasiModal({ isOpen, onClose }) {
  const { programs, setPrograms, showToast } = useApp();
  const [local, setLocal] = useState([]);
  const COLORS = ['#00695C','#083D56','#00897B','#546E7A','#78909C','#0C5272'];

  useEffect(() => { if (isOpen) setLocal(programs.map(p => ({ ...p }))); }, [isOpen, programs]);

  const update = (i, k, v) => setLocal(prev => prev.map((p, idx) => idx === i ? { ...p, [k]: v } : p));
  const remove = (i) => { if (local.length <= 1) { showToast('Minimal 1 program', 'error'); return; } setLocal(prev => prev.filter((_, idx) => idx !== i)); };
  const add = () => setLocal(prev => [...prev, { name: '', progress: 0 }]);

  const handleSave = () => {
    if (local.some(p => !p.name.trim())) { showToast('Nama program tidak boleh kosong', 'error'); return; }
    setPrograms(local);
    showToast('Realisasi anggaran disimpan', 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Revisi Realisasi Anggaran" maxWidth="max-w-md"
      footer={<>
        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-neutral-light rounded-xl text-sm font-semibold text-neutral-dark hover:bg-neutral-50 transition-colors">Batal</button>
        <button type="button" onClick={handleSave} className="flex-1 py-2.5 bg-tertiary text-white rounded-xl text-sm font-semibold hover:bg-tertiary-light transition-colors">Simpan</button>
      </>}
    >
      <div className="p-5 space-y-3">
        {local.map((p, i) => {
          const clr = COLORS[i % COLORS.length];
          return (
            <div key={i} className="prog-row p-3 rounded-xl border border-neutral-light/50">
              <div className="flex items-center gap-2 mb-2">
                <input type="text" value={p.name} onChange={e => update(i, 'name', e.target.value)} placeholder="Nama program" className="input-styled flex-1 px-3 py-2 border border-neutral-light rounded-lg text-sm outline-none transition-all" />
                <button type="button" onClick={() => remove(i)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-neutral-light hover:text-red-500 transition-colors"><i className="fas fa-trash text-xs"></i></button>
              </div>
              <div className="flex items-center gap-3">
                <input type="number" value={p.progress} min={0} max={100} onChange={e => update(i, 'progress', Math.min(100, Math.max(0, Number(e.target.value))))} className="input-styled w-20 px-3 py-2 border border-neutral-light rounded-lg text-sm outline-none text-center" />
                <span className="text-sm text-neutral font-semibold">%</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: clr }}></div>
                </div>
              </div>
              <input type="range" min={0} max={100} value={p.progress} onChange={e => update(i, 'progress', Number(e.target.value))} className="w-full mt-1" style={{ accentColor: clr }} />
            </div>
          );
        })}
        <button type="button" onClick={add} className="w-full py-2.5 border-2 border-dashed border-neutral-light rounded-xl text-sm font-medium text-neutral hover:border-tertiary hover:text-tertiary transition-colors flex items-center justify-center gap-2">
          <i className="fas fa-plus text-xs"></i> Tambah Program
        </button>
      </div>
    </Modal>
  );
}
