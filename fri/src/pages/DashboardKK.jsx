import React from 'react';
import { BarChart3, TrendingUp, Award, Activity, Eye, CheckCheck, CheckCircle, Clock } from 'lucide-react';
import StatusPill from '../components/StatusPill';

const DashboardKK = ({ stats, labData, onOpenDetail }) => (
  <div className="space-y-6">
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white p-10 rounded-3xl shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-2xl backdrop-blur-sm">
            <BarChart3 size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-bold">Dashboard KK</h2>
            <p className="text-green-100 text-lg">Monitoring & Evaluasi Kinerja Laboratorium</p>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-5 gap-4">
      <div className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="relative z-10">
          <div className="text-sm opacity-90 mb-2 font-medium">Jumlah Laboratorium</div>
          <div className="text-5xl font-bold">{stats.totalUKM}</div>
        </div>
      </div>
      <div className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="relative z-10">
          <div className="text-sm opacity-90 mb-2 font-medium">Jumlah Kegiatan</div>
          <div className="text-5xl font-bold">{stats.totalKegiatan}</div>
        </div>
      </div>
      <div className="group relative overflow-hidden bg-gradient-to-br from-gray-500 to-gray-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="relative z-10">
          <div className="text-sm opacity-90 mb-2 font-medium">Belum Terlaksana</div>
          <div className="text-5xl font-bold">{stats.belumTerlaksana}</div>
        </div>
      </div>
      <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="relative z-10">
          <div className="text-sm opacity-90 mb-2 font-medium">Terlaksana</div>
          <div className="text-5xl font-bold">{stats.terlaksana}</div>
        </div>
      </div>
      <div className="group relative overflow-hidden bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="relative z-10">
          <div className="text-sm opacity-90 mb-2 font-medium">LPJ</div>
          <div className="text-5xl font-bold">{stats.lpj}</div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-xl text-white">
            <TrendingUp size={28} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Nilai Performansi</h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-md transition-shadow">
            <div>
              <span className="text-sm text-gray-600 block mb-1">Lab EISD</span>
              <span className="font-bold text-gray-800 text-lg">Enterprise Information Systems & Design</span>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">85.5</div>
              <div className="text-xs text-emerald-600 font-medium">Excellent</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-xl text-white">
            <Award size={28} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Jumlah Kegiatan</h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-md transition-shadow">
            <div>
              <span className="text-sm text-gray-600 block mb-1">Lab EISD</span>
              <span className="font-bold text-gray-800 text-lg">Total Aktivitas</span>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{stats.totalKegiatan}</div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Activity className="text-emerald-600" size={28} />
        Detail Kegiatan Lab EISD
      </h3>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                <th className="p-4 text-left font-semibold">No</th>
                <th className="p-4 text-left font-semibold">Indikator</th>
                <th className="p-4 text-left font-semibold">Target</th>
                <th className="p-4 text-left font-semibold">Timeline</th>
                <th className="p-4 text-left font-semibold">Keterangan</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {labData.activities.map((activity, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors">
                  <td className="p-4 font-medium text-gray-700">{activity.no}</td>
                  <td className="p-4 text-sm text-gray-700">{activity.indicator}</td>
                  <td className="p-4 font-semibold text-emerald-600">{activity.jumlah}</td>
                  <td className="p-4 text-sm text-gray-600">{activity.tw}</td>
                  <td className="p-4 text-sm text-gray-600">{activity.ket}</td>
                  <td className="p-4">
                    <StatusPill status={activity.status} />
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => onOpenDetail(activity)}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                      <Eye size={16} />
                      Detail
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

export default DashboardKK;


