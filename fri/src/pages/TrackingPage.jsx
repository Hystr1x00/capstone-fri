import React from 'react';
import { LineChart, Activity, Eye } from 'lucide-react';

const TrackingPage = ({ reportsData }) => (
  <div className="space-y-6">
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white p-10 rounded-3xl shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
      <div className="relative z-10 flex items-center gap-3">
        <LineChart size={32} />
        <h2 className="text-4xl font-bold">Status Tracking Laporan</h2>
      </div>
    </div>
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Activity className="text-emerald-600" size={28} />Daftar Laporan</h3>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                <th className="p-4 text-left font-semibold">No</th>
                <th className="p-4 text-left font-semibold">Judul</th>
                <th className="p-4 text-left font-semibold">Tanggal</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reportsData.map((rep, idx) => (
                <tr key={rep.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors">
                  <td className="p-4 font-medium text-gray-700">{idx + 1}</td>
                  <td className="p-4 text-sm text-gray-700">{rep.title}</td>
                  <td className="p-4 text-sm text-gray-600">{new Date(rep.date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 ${rep.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : rep.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {rep.status === 'approved' ? 'Disetujui' : rep.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors">
                      <Eye size={16} />
                      Lihat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default TrackingPage;


