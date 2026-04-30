import { useState } from "react";

const Toast = ({ message, type = "success", onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  // 🔥 HANDLE CLOSE DENGAN ANIMASI
  const handleClose = () => {
    setIsExiting(true);

    setTimeout(() => {
      onClose();
    }, 250); // sesuai durasi animasi
  };

  // 🔥 WARNA
  const bgColor =
    type === "success"
      ? "bg-[#00695c]"
      : type === "error"
      ? "bg-red-500"
      : type === "info"
      ? "bg-[#0f4c5c]"
      : "bg-gray-800";

  // 🔥 ICON
  const icon =
    type === "success"
      ? "fa-check-circle"
      : type === "error"
      ? "fa-times-circle"
      : type === "info"
      ? "fa-info-circle"
      : "fa-bell";

  return (
    <div className="fixed top-5 right-5 z-50">
      <div
        className={`flex items-center gap-3 text-white px-5 py-3 rounded-xl shadow-lg ${
          isExiting ? "toast-exit" : "toast-enter"
        } ${bgColor} min-w-[280px]`}
      >
        {/* ICON */}
        <i className={`fas ${icon}`}></i>

        {/* MESSAGE */}
        <span className="text-sm font-medium">{message}</span>

        {/* CLOSE BUTTON */}
        <button
          onClick={handleClose}
          className="ml-2 text-white/80 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;