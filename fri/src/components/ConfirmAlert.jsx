import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ConfirmAlert = ({ message, isVisible, onConfirm, onCancel }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-[10001] p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-6 max-w-md w-full mx-2 sm:mx-4 animate-slide-in">
        <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-amber-100 p-2 sm:p-3 rounded-lg shrink-0">
            <AlertCircle className="text-amber-600" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Konfirmasi</h3>
            <p className="text-sm sm:text-base text-gray-600 break-words">{message}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-semibold text-sm sm:text-base"
          >
            Ya
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-300 transition-all font-semibold text-sm sm:text-base"
          >
            Tidak
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAlert;

