import React from 'react';
import { PenTool, Clock, CheckCircle, Activity, FileText } from 'lucide-react';
import StatusPill from '../components/StatusPill';

const DashboardDosen = ({ labData }) => (
  <div className="space-y-6">
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white p-10 rounded-3xl shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-2xl backdrop-blur-sm">
            <PenTool size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-bold">Dashboard Dosen Pembina</h2>
            <p className="text-green-100 text-lg">Persetujuan & Monitoring Lab EISD</p>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-amber-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center gap-5">
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-5 rounded-2xl">
            <Clock className="text-white" size={36} />
          </div>
          <div>
            <div className="text-sm text-gray-600 font-medium mb-1">Menunggu Persetujuan</div>
            <div className="text-4xl font-bold text-gray-800">3</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-emerald-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center gap-5">
          <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-5 rounded-2xl">
            <CheckCircle className="text-white" size={36} />
          </div>
          <div>
            <div className="text-sm text-gray-600 font-medium mb-1">Disetujui</div>
            <div className="text-4xl font-bold text-gray-800">8</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center gap-5">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-5 rounded-2xl">
            <Activity className="text-white" size={36} />
          </div>
          <div>
            <div className="text-sm text-gray-600 font-medium mb-1">Sedang Berjalan</div>
            <div className="text-4xl font-bold text-gray-800">5</div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <FileText className="text-amber-600" size={28} />
        Dokumen Menunggu Persetujuan
      </h3>
      <div className="space-y-4">
        {labData.activities.filter(a => a.status === 'pending').map((activity, idx) => (
          <div key={idx} className="flex items-center justify-between p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 hover:shadow-lg transition-all">
            <div className="flex items-center gap-5">
              <div className="bg-amber-100 p-4 rounded-xl">
                <FileText className="text-amber-600" size={28} />
              </div>
              <div>
                <div className="font-bold text-gray-800 text-lg mb-1">{activity.indicator}</div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="font-medium">Target:</span>
                  <span className="px-3 py-1 bg-white rounded-full text-emerald-600 font-semibold">{activity.jumlah}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-semibold">
                <CheckCircle size={18} />
                Setujui
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-semibold">
                Tolak
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        Dokumen yang Disetujui
      </h3>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                <th className="p-4 text-left font-semibold">Indikator</th>
                <th className="p-4 text-left font-semibold">Target</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Tanggal Persetujuan</th>
                <th className="p-4 text-center font-semibold">TTD Digital</th>
              </tr>
            </thead>
            <tbody>
              {labData.activities.filter(a => a.status === 'approved' || a.status === 'completed').map((activity, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors">
                  <td className="p-4 text-gray-700">{activity.indicator}</td>
                  <td className="p-4 font-semibold text-emerald-600">{activity.jumlah}</td>
                  <td className="p-4">
                    <StatusPill status={activity.status} />
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-medium">30 Sep 2025</td>
                  <td className="p-4 text-center">
                    <button className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors">
                      Lihat TTD
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

export default DashboardDosen;


