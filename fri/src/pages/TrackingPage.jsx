import React, { useState } from 'react';
import { LineChart, Activity, Eye, X, FileText, Calendar } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const TrackingPage = ({ reportsData }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const headerRef = useScrollAnimation();
  const tableRef = useScrollAnimation({ threshold: 0.1 });

  return (
  <div className="space-y-4 sm:space-y-6">
    <div ref={headerRef} className="scroll-animate visible relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
      <div className="relative z-10 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold break-words leading-tight">Status Tracking Laporan</h2>
        </div>
      </div>
    </div>
    <div ref={tableRef} className="scroll-animate bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
      <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
        <Activity className="text-emerald-600" size={24} />
        Daftar Laporan
      </h3>
      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3">
        {reportsData.map((rep, idx) => (
          <div key={rep.id} className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
            <div className="flex items-start justify-between mb-2">
              <div className="font-medium text-gray-700 text-sm">#{idx + 1}</div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                rep.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                rep.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                'bg-red-100 text-red-700'
              }`}>
                {rep.status === 'approved' ? 'Disetujui' : rep.status === 'pending' ? 'Menunggu' : 'Ditolak'}
              </span>
            </div>
            <div className="font-bold text-gray-800 text-base mb-2 break-words">{rep.title}</div>
            <div className="text-sm text-gray-600 mb-3">{new Date(rep.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <button 
              onClick={() => {
                setSelectedReport(rep);
                setShowDetailModal(true);
              }}
              className="w-full py-2.5 text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center justify-center gap-2 rounded-lg hover:bg-emerald-100 transition-colors text-sm border border-emerald-200"
            >
              <Eye size={18} />
              Lihat Detail
            </button>
          </div>
        ))}
      </div>
      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-hidden rounded-lg sm:rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                <th className="px-4 py-3 text-left text-sm font-semibold">No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Judul</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Tanggal</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reportsData.map((rep, idx) => (
                <tr key={rep.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors">
                  <td className="px-4 py-4 font-medium text-gray-700 text-sm">{idx + 1}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{rep.title}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{new Date(rep.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                  <td className="px-4 py-4">
                    <span className={`px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 ${
                      rep.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                      rep.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {rep.status === 'approved' ? 'Disetujui' : rep.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button 
                      onClick={() => {
                        setSelectedReport(rep);
                        setShowDetailModal(true);
                      }}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors text-sm"
                    >
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

    {/* Modal Detail Laporan */}
    {showDetailModal && selectedReport && (
      <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-white border-opacity-20">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
              <FileText className="text-emerald-600" size={24} />
              Detail Laporan
            </h3>
            <button
              onClick={() => {
                setShowDetailModal(false);
                setSelectedReport(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 sm:p-6 border border-emerald-200">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Informasi Laporan</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Judul:</span>
                  <span className="font-medium text-gray-800 text-right flex-1 ml-4">{selectedReport.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal:</span>
                  <span className="font-medium text-gray-800">{new Date(selectedReport.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedReport.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                    selectedReport.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {selectedReport.status === 'approved' ? 'Disetujui' : selectedReport.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-dashed border-gray-300">
              <h4 className="font-semibold text-gray-800 mb-4 text-sm sm:text-base">Dokumentasi</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedReport.files && selectedReport.files.map((f, i) => (
                  <div key={i} className="border rounded-xl overflow-hidden">
                    {f.type === 'image' ? (
                      <img src={f.url} alt={`bukti-${i}`} className="w-full h-40 object-cover" />
                    ) : (
                      <iframe title={`pdf-${i}`} src={f.url} className="w-full h-40"></iframe>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default TrackingPage;


