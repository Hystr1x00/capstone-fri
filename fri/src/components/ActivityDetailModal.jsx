import React from 'react';
import { Eye } from 'lucide-react';

const ActivityDetailModal = ({ open, activity, onClose }) => {
  if (!open || !activity) return null;
  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-3xl w-full mx-4 shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Eye className="text-emerald-600" size={28} />
          Detail Kegiatan
        </h3>
        <div className="space-y-5">
          <div className="p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
            <div className="text-sm text-gray-600 font-semibold mb-2">Indikator</div>
            <div className="font-bold text-gray-800 text-lg">{activity.indicator}</div>
          </div>
          <div className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <div className="text-sm text-gray-600 font-semibold mb-2">Strategi</div>
            <div className="font-bold text-gray-800 text-lg">{activity.strategi}</div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <div className="text-sm text-gray-600 font-semibold mb-2">Target</div>
              <div className="font-bold text-gray-800 text-2xl">{activity.jumlah}</div>
            </div>
            <div className="p-5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
              <div className="text-sm text-gray-600 font-semibold mb-2">Timeline</div>
              <div className="font-bold text-gray-800 text-2xl">{activity.tw}</div>
            </div>
          </div>
          <div className="p-5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl">
            <div className="text-sm text-gray-600 font-semibold mb-2">Keterangan</div>
            <div className="font-bold text-gray-800 text-lg">{activity.ket || '-'}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-8 w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default ActivityDetailModal;


