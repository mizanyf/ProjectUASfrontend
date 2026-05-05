import { useRef } from 'react';

export default function OtpInput({ value = [], onChange }) {
  const refs = useRef([]);

  const handleInput = (i, val) => {
    const cleaned = val.replace(/\D/g, '').slice(-1);
    const next = [...value];
    next[i] = cleaned;
    onChange(next);
    if (cleaned && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      const next = [...value];
      next[i - 1] = '';
      onChange(next);
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').substring(0, 6);
    const next = Array(6).fill('');
    data.split('').forEach((c, i) => { next[i] = c; });
    onChange(next);
    const focusIdx = Math.min(data.length, 5);
    refs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array(6).fill(0).map((_, i) => (
        <input
          key={i}
          ref={el => refs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={e => handleInput(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          className="otp-digit text-center text-xl font-bold border-2 border-neutral-light rounded-xl outline-none focus:border-tertiary transition-colors"
        />
      ))}
    </div>
  );
}
