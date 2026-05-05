import { useState, useRef } from "react";

export const OtpInput = ({ onComplete }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputs.current[index + 1]?.focus();
    if (newOtp.join("").length === 6 && onComplete) onComplete(newOtp.join(""));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    if (pasted.length === 6 && onComplete) onComplete(pasted);
    inputs.current[pasted.length - 1]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {otp.map((digit, idx) => (
        <input key={idx} ref={el => inputs.current[idx] = el} type="text" maxLength={1}
          value={digit} onChange={e => handleChange(idx, e.target.value)}
          onKeyDown={e => handleKeyDown(idx, e)}
          className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-xl outline-none focus:border-[#00695c]" />
      ))}
    </div>
  );
};