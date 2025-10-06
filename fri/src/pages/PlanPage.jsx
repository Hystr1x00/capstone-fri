import React from 'react';
import { Edit, FileText, Calendar } from 'lucide-react';

const PlanPage = ({ planGroups, planForm, setPlanForm, currentRole, onSubmitAll }) => (
  <div className="space-y-6">
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white p-10 rounded-3xl shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
      <div className="relative z-10 flex items-center gap-3">
        <Edit size={32} />
        <h2 className="text-4xl font-bold">Input Rencana Kegiatan (Periode)</h2>
      </div>
    </div>
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <FileText className="text-emerald-600" size={28} />
        Daftar Rencana Berdasarkan Indikator
      </h3>
      <div className="space-y-8">
        {planGroups.map((group, gi) => (
          <div key={gi} className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 font-bold text-gray-800 border-b border-emerald-100">
              Main: {group.main}
            </div>
            {group.sasaran.map((s, si) => (
              <div key={si} className="px-6 py-5 border-b border-gray-100">
                <div className="font-semibold text-gray-800 mb-4">Sasaran Strategis: {s.sasaranStrategis}</div>
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                          <th className="p-4 text-left font-semibold">No</th>
                          <th className="p-4 text-left font-semibold">Indikator</th>
                          <th className="p-4 text-left font-semibold">Target (Jumlah)</th>
                          <th className="p-4 text-left font-semibold">Timeline (TW)</th>
                          <th className="p-4 text-left font-semibold">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.items.map((it, ii) => {
                          const key = `${group.main}|${s.sasaranStrategis}|${it.no}`;
                          const value = planForm[key] || { jumlah: '', tw: '', ket: '' };
                          return (
                            <tr key={ii} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors">
                              <td className="p-4 font-medium text-gray-700">{it.no}</td>
                              <td className="p-4 text-sm text-gray-700">{it.indikator}</td>
                              <td className="p-4">
                                <input disabled={currentRole!=='lab'} value={value.jumlah} onChange={(e)=>setPlanForm(prev=>({...prev,[key]:{...value,jumlah:e.target.value}}))} type="text" className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="cth: 2, 21/matkul" />
                              </td>
                              <td className="p-4">
                                <input disabled={currentRole!=='lab'} value={value.tw} onChange={(e)=>setPlanForm(prev=>({...prev,[key]:{...value,tw:e.target.value}}))} type="text" className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="cth: TW1, TW2" />
                              </td>
                              <td className="p-4">
                                <input disabled={currentRole!=='lab'} value={value.ket} onChange={(e)=>setPlanForm(prev=>({...prev,[key]:{...value,ket:e.target.value}}))} type="text" className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="keterangan" />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {currentRole === 'lab' ? (
        <div className="flex justify-end pt-6">
          <button onClick={onSubmitAll} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-md font-semibold">Ajukan Semua Rencana</button>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 text-sm text-gray-700">
          Peran {currentRole.toUpperCase()} hanya melihat rencana. Persetujuan dilakukan via dashboard.
        </div>
      )}
    </div>
    {/* Kalender Visualisasi Plan per TW - tetap di App agar konsisten dengan data contoh */}
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Calendar className="text-emerald-600" size={28} />
        Kalender Rencana (TW)
      </h3>
      {/* Bagian ini dibiarkan untuk App jika diperlukan. */}
    </div>
  </div>
);

export default PlanPage;


