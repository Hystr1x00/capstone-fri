import React from 'react';
import { UploadCloud, FileText, Upload, CheckCircle, XCircle } from 'lucide-react';
import StatusPill from '../components/StatusPill';

const ReportPage = ({ labData, reportsData, currentRole, onOpenReport }) => (
  <div className="space-y-6">
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white p-10 rounded-3xl shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
      <div className="relative z-10 flex items-center gap-3">
        <UploadCloud size={32} />
        <h2 className="text-4xl font-bold">Laporan Kegiatan</h2>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl p-8 w-full mx-0 shadow-2xl border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FileText className="text-emerald-600" size={28} />
          Daftar Kegiatan Disetujui
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
                {labData.activities.filter(a => a.status === 'approved').length === 0 && (
                  <tr>
                    <td className="p-6 text-center text-gray-500" colSpan={6}>Belum ada kegiatan yang disetujui.</td>
                  </tr>
                )}
                {labData.activities.filter(a => a.status === 'approved').map((activity, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors">
                    <td className="p-4 font-medium text-gray-700">{activity.no}</td>
                    <td className="p-4 text-sm text-gray-700">{activity.indicator}</td>
                    <td className="p-4 font-semibold text-emerald-600">{activity.jumlah}</td>
                    <td className="p-4 text-sm text-gray-600">{activity.tw}</td>
                    <td className="p-4"><StatusPill status={activity.status} /></td>
                    <td className="p-4 text-center">
                      {currentRole === 'lab' && (
                        <button onClick={() => onOpenReport(activity)} className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors">
                          <Upload size={16} />
                          Lapor
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-3xl p-8 w-full mx-0 shadow-2xl border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FileText className="text-emerald-600" size={28} />
          Daftar Laporan Diajukan
        </h3>
        <div className="space-y-5">
          {reportsData.map((rep) => (
            <div key={rep.id} className="p-5 rounded-2xl border border-gray-200 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-bold text-gray-800 text-lg">{rep.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{new Date(rep.date).toLocaleDateString()}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rep.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : rep.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>{rep.status === 'approved' ? 'Disetujui' : rep.status === 'pending' ? 'Menunggu' : 'Ditolak'}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {rep.files.map((f, i) => (
                  <div key={i} className="border rounded-xl overflow-hidden">
                    {f.type === 'image' ? (
                      <img src={f.url} alt={`bukti-${i}`} className="w-full h-40 object-cover" />
                    ) : (
                      <iframe title={`pdf-${i}`} src={f.url} className="w-full h-40"></iframe>
                    )}
                  </div>
                ))}
              </div>
              {(currentRole === 'kk' || currentRole === 'dosen') && (
                <div className="mt-4 flex gap-3">
                  <button className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition shadow-md font-semibold inline-flex items-center gap-2">
                    <CheckCircle size={16} /> Setujui
                  </button>
                  <button className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition shadow-md font-semibold inline-flex items-center gap-2">
                    <XCircle size={16} /> Tolak
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ReportPage;


