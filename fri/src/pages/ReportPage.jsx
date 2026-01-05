import React, { useState } from 'react';
import { UploadCloud, FileText, Upload, CheckCircle, XCircle, Calendar, Clock } from 'lucide-react';
import StatusPill from '../components/StatusPill';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import SuccessAlert from '../components/SuccessAlert';
import ConfirmAlert from '../components/ConfirmAlert';
import reportService from '../services/reportService';
import notificationService from '../services/notificationService';

const ReportPage = ({ labData, reportsData, currentRole, onOpenReport, onReportsUpdate, onNotificationChange }) => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showConfirmApprove, setShowConfirmApprove] = useState(false);
  const [showConfirmReject, setShowConfirmReject] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const headerRef = useScrollAnimation();
  const reportsRef = useScrollAnimation({ threshold: 0.1 });

  const handleApproveReport = (reportId) => {
    setSelectedReportId(reportId);
    setShowConfirmApprove(true);
  };

  const confirmApproveReport = () => {
    const report = reportService.getReports().find(r => r.id === selectedReportId);
    reportService.approveReport(selectedReportId, currentRole);
    if (onReportsUpdate) {
      onReportsUpdate(reportService.getReports());
    }
    setShowConfirmApprove(false);
    setAlertMessage('Laporan berhasil disetujui!');
    setShowSuccessAlert(true);
    
    // Add notification
    notificationService.addNotification({
      type: 'report',
      title: 'Laporan Disetujui',
      message: `Laporan "${report?.title || 'Kegiatan'}" telah disetujui oleh ${currentRole === 'kk' ? 'Ketua KK' : 'Dosen Pembina'}.`,
      time: new Date().toLocaleString('id-ID'),
      data: report
    });
    if (onNotificationChange) onNotificationChange();
  };

  const handleRejectReport = (reportId) => {
    setSelectedReportId(reportId);
    setShowConfirmReject(true);
  };

  const confirmRejectReport = () => {
    const report = reportService.getReports().find(r => r.id === selectedReportId);
    reportService.rejectReport(selectedReportId, currentRole);
    if (onReportsUpdate) {
      onReportsUpdate(reportService.getReports());
    }
    setShowConfirmReject(false);
    setAlertMessage('Laporan ditolak.');
    setShowSuccessAlert(true);
    
    // Add notification
    notificationService.addNotification({
      type: 'report',
      title: 'Laporan Ditolak',
      message: `Laporan "${report?.title || 'Kegiatan'}" ditolak oleh ${currentRole === 'kk' ? 'Ketua KK' : 'Dosen Pembina'}.`,
      time: new Date().toLocaleString('id-ID'),
      data: report
    });
    if (onNotificationChange) onNotificationChange();
  };

  return (
  <>
    <SuccessAlert
      message={alertMessage}
      isVisible={showSuccessAlert}
      onClose={() => setShowSuccessAlert(false)}
    />
    
    {/* Confirm Approve Modal */}
    <ConfirmAlert
      message="Apakah Anda yakin ingin menyetujui laporan ini?"
      isVisible={showConfirmApprove}
      onConfirm={confirmApproveReport}
      onCancel={() => setShowConfirmApprove(false)}
    />
    
    {/* Confirm Reject Modal */}
    <ConfirmAlert
      message="Apakah Anda yakin ingin menolak laporan ini?"
      isVisible={showConfirmReject}
      onConfirm={confirmRejectReport}
      onCancel={() => setShowConfirmReject(false)}
    />
    <div className="space-y-4 sm:space-y-6">
    <div ref={headerRef} className="scroll-animate visible relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 sm:gap-4 mb-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold break-words leading-tight">Laporan Kegiatan</h2>
            <p className="text-green-100 text-sm sm:text-base lg:text-lg mt-2">Upload & Kelola Laporan Kegiatan Lab</p>
          </div>
        </div>
      </div>
    </div>
    <div ref={reportsRef} className="scroll-animate grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 w-full mx-0 shadow-xl sm:shadow-2xl border border-gray-100">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <FileText className="text-emerald-600 sm:w-7 sm:h-7" size={24} />
          Daftar Kegiatan Disetujui
        </h3>
        
        {/* Mobile Card View */}
        <div className="block sm:hidden space-y-3">
          {labData.activities.filter(a => a.status === 'approved').length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">Belum ada kegiatan yang disetujui.</div>
          ) : (
            labData.activities.filter(a => a.status === 'approved').map((activity, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-gray-700 text-sm">#{activity.no}</div>
                  <StatusPill status={activity.status} />
                </div>
                <div className="font-bold text-gray-800 text-sm mb-2 break-words">{activity.indicator}</div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">Target:</span>
                  <span className="font-semibold text-emerald-600 text-sm">{activity.jumlah}</span>
                </div>
                {activity.tw && (
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-600">Timeline:</span>
                    <span className="text-xs text-gray-600">{activity.tw}</span>
                  </div>
                )}
                {currentRole === 'lab' && (
                  <button 
                    onClick={() => onOpenReport(activity)} 
                    className="w-full py-2.5 text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center justify-center gap-2 rounded-lg hover:bg-emerald-100 transition-colors text-sm border border-emerald-200"
                  >
                    <Upload size={16} />
                    Lapor
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-hidden rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">No</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">Indikator</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">Target</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">Timeline</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">Status</th>
                  <th className="px-3 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {labData.activities.filter(a => a.status === 'approved').length === 0 && (
                  <tr>
                    <td className="p-6 text-center text-gray-500 text-sm" colSpan={6}>Belum ada kegiatan yang disetujui.</td>
                  </tr>
                )}
                {labData.activities.filter(a => a.status === 'approved').map((activity, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors">
                    <td className="px-3 sm:px-4 py-3 sm:py-4 font-medium text-gray-700 text-sm">{activity.no}</td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 break-words">{activity.indicator}</td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 font-semibold text-emerald-600 text-sm">{activity.jumlah}</td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">{activity.tw || '-'}</td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4"><StatusPill status={activity.status} /></td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-center">
                      {currentRole === 'lab' && (
                        <button 
                          onClick={() => onOpenReport(activity)} 
                          className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors text-xs sm:text-sm"
                        >
                          <Upload size={14} className="sm:w-4 sm:h-4" />
                          <span className="hidden md:inline">Lapor</span>
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
      
      <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 w-full mx-0 shadow-xl sm:shadow-2xl border border-gray-100">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <FileText className="text-emerald-600 sm:w-7 sm:h-7" size={24} />
          Daftar Laporan Diajukan
        </h3>
        <div className="space-y-4 sm:space-y-5">
          {reportsData.map((rep) => (
            <div key={rep.id} className="p-5 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all bg-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-emerald-100 p-1.5 rounded-lg">
                      <FileText className="text-emerald-600" size={16} />
                    </div>
                    <div className="font-bold text-gray-800 text-base sm:text-lg break-words">{rep.title}</div>
                  </div>
                  <div className="flex items-center gap-3 pl-7">
                    <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="text-gray-400" size={14} />
                      {new Date(rep.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shrink-0 inline-flex items-center gap-2 ${rep.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : rep.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                  {rep.status === 'approved' ? <CheckCircle size={14} /> : rep.status === 'pending' ? <Clock size={14} /> : <XCircle size={14} />}
                  {rep.status === 'approved' ? 'Disetujui' : rep.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rep.files && rep.files.map((f, i) => (
                  <div key={i} className="border rounded-xl overflow-hidden">
                    {f.type === 'image' ? (
                      <img src={f.url} alt={`bukti-${i}`} className="w-full h-32 sm:h-40 object-cover" />
                    ) : (
                      <iframe title={`pdf-${i}`} src={f.url} className="w-full h-32 sm:h-40"></iframe>
                    )}
                  </div>
                ))}
              </div>
              {(currentRole === 'kk' || currentRole === 'dosen') && (
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => handleApproveReport(rep.id)}
                    className="flex-1 sm:flex-initial px-5 sm:px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-semibold inline-flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <CheckCircle size={18} /> 
                    <span>Setujui</span>
                  </button>
                  <button 
                    onClick={() => handleRejectReport(rep.id)}
                    className="flex-1 sm:flex-initial px-5 sm:px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg sm:rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg font-semibold inline-flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <XCircle size={18} /> 
                    <span>Tolak</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  </>
  );
};

export default ReportPage;


