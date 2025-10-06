import React, { useState } from 'react';
import { Users, Calendar, FileText, Upload } from 'lucide-react';
import TWCalendar from '../components/TWCalendar';
import StatusPill from '../components/StatusPill';

const DashboardLab = ({ stats, labData, onOpenReport }) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const getMonthsByTW = (tw) => {
    const set = new Set();
    const tws = (tw || '').toUpperCase().split(',').map(s=>s.trim());
    tws.forEach(t=>{
      if(t==='TW1' || t==='T1' || t==='Q1'){ set.add(0); set.add(1); set.add(2); }
      if(t==='TW2' || t==='T2' || t==='Q2'){ set.add(3); set.add(4); set.add(5); }
      if(t==='TW3' || t==='T3' || t==='Q3'){ set.add(6); set.add(7); set.add(8); }
      if(t==='TW4' || t==='T4' || t==='Q4'){ set.add(9); set.add(10); set.add(11); }
    });
    return Array.from(set.values()).sort((a,b)=>a-b);
  };
  const monthToActivities = Array.from({length:12}, (_,m)=>({
    monthIndex: m,
    items: labData.activities.filter(a=>getMonthsByTW(a.tw).includes(m))
  }));

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white p-10 rounded-3xl shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-2xl backdrop-blur-sm">
              <Users size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-bold">Laboratorium EISD</h2>
              <p className="text-green-100 text-lg">Kelola Rencana & Laporan Kegiatan</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="text-sm text-gray-600 mb-2 font-medium">Total Kegiatan</div>
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{stats.totalKegiatan}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-amber-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="text-sm text-gray-600 mb-2 font-medium">Menunggu Persetujuan</div>
          <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">3</div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-emerald-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="text-sm text-gray-600 mb-2 font-medium">Disetujui</div>
          <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">8</div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-purple-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="text-sm text-gray-600 mb-2 font-medium">Selesai</div>
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">{stats.terlaksana}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-xl text-white">
            <Calendar size={28} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Kalender Rencana per Triwulan</h3>
        </div>
        <TWCalendar monthToActivities={monthToActivities} monthNames={monthNames} />
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FileText className="text-emerald-600" size={28} />
          Daftar Kegiatan
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
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {labData.activities.slice(0, 5).map((activity, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors">
                    <td className="p-4 font-medium text-gray-700">{activity.no}</td>
                    <td className="p-4 text-sm text-gray-700">{activity.indicator}</td>
                    <td className="p-4 font-semibold text-emerald-600">{activity.jumlah}</td>
                    <td className="p-4 text-sm text-gray-600">{activity.tw}</td>
                    <td className="p-4"><StatusPill status={activity.status} /></td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => onOpenReport(activity)}
                        className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
                      >
                        <Upload size={16} />
                        Lapor
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
};

export default DashboardLab;


