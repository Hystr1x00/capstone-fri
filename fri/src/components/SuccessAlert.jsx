import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

const SuccessAlert = ({ message, isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-2 sm:right-4 z-[10000] animate-slide-in max-w-[calc(100vw-1rem)] sm:max-w-none">
      <div className="bg-white rounded-xl shadow-2xl border border-emerald-200 p-3 sm:p-4 flex items-center gap-2 sm:gap-3 min-w-[280px] sm:min-w-[300px]">
        <div className="bg-emerald-100 p-2 rounded-lg shrink-0">
          <CheckCircle className="text-emerald-600" size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 break-words">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors shrink-0"
        >
          <X size={18} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default SuccessAlert;

