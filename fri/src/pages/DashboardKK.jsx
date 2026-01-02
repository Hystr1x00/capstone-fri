import React, { useState } from 'react';
import { BarChart3, TrendingUp, Award, Activity, Eye, CheckCheck, CheckCircle, Clock, FileText, XCircle } from 'lucide-react';
import StatusPill from '../components/StatusPill';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import SuccessAlert from '../components/SuccessAlert';

const DashboardKK = ({ stats, labData, onOpenDetail, submittedPlans, setSubmittedPlans }) => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleApprovePlan = (planId) => {
    setSubmittedPlans(submittedPlans.map(plan => 
      plan.id === planId 
        ? { ...plan, status: 'approved_by_kk', approvedByKK: new Date().toISOString() }
        : plan
    ));
    setAlertMessage('Plan berhasil disetujui!');
    setShowSuccessAlert(true);
  };

  const handleRejectPlan = (planId) => {
    setSubmittedPlans(submittedPlans.map(plan => 
      plan.id === planId 
        ? { ...plan, status: 'pending', approvedByDosen: null }
        : plan
    ));
    setAlertMessage('Plan ditolak dan dikembalikan ke dosen pembina.');
    setShowSuccessAlert(true);
  };
  const headerRef = useScrollAnimation();
  const statsRef = useScrollAnimation({ threshold: 0.2 });
  const activitiesRef = useScrollAnimation({ threshold: 0.1 });
  const planPendingRef = useScrollAnimation({ threshold: 0.1 });
  const planApprovedRef = useScrollAnimation({ threshold: 0.1 });

  return (
  <>
    {/* Success Alert */}
    <SuccessAlert
      message={alertMessage}
      isVisible={showSuccessAlert}
      onClose={() => setShowSuccessAlert(false)}
    />
  <div className="space-y-4 sm:space-y-6">
    <div ref={headerRef} className="scroll-animate visible relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 sm:gap-4 mb-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold break-words leading-tight">Dashboard KK</h2>
            <p className="text-green-100 text-sm sm:text-base lg:text-lg mt-2">Monitoring & Evaluasi Kinerja Laboratorium</p>
          </div>
        </div>
      </div>
    </div>

    <div ref={statsRef} className="scroll-animate grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
      <div className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 text-white p-3 sm:p-4 lg:p-5 xl:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 sm:-mr-12 sm:-mt-12 lg:-mr-16 lg:-mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="relative z-10">
          <div className="text-[10px] sm:text-xs lg:text-sm opacity-90 mb-1 sm:mb-2 font-medium leading-tight">Jumlah Laboratorium</div>
          <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">{stats.totalUKM}</div>
        </div>
      </div>
      <div className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white p-3 sm:p-4 lg:p-5 xl:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 sm:-mr-12 sm:-mt-12 lg:-mr-16 lg:-mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="relative z-10">
          <div className="text-[10px] sm:text-xs lg:text-sm opacity-90 mb-1 sm:mb-2 font-medium leading-tight">Jumlah Kegiatan</div>
          <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">{stats.totalKegiatan}</div>
        </div>
      </div>
      <div className="group relative overflow-hidden bg-gradient-to-br from-gray-500 to-gray-600 text-white p-3 sm:p-4 lg:p-5 xl:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 sm:-mr-12 sm:-mt-12 lg:-mr-16 lg:-mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="relative z-10">
          <div className="text-[10px] sm:text-xs lg:text-sm opacity-90 mb-1 sm:mb-2 font-medium leading-tight">Belum Terlaksana</div>
          <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">{stats.belumTerlaksana}</div>
        </div>
      </div>
      <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-3 sm:p-4 lg:p-5 xl:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 sm:-mr-12 sm:-mt-12 lg:-mr-16 lg:-mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="relative z-10">
          <div className="text-[10px] sm:text-xs lg:text-sm opacity-90 mb-1 sm:mb-2 font-medium leading-tight">Terlaksana</div>
          <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">{stats.terlaksana}</div>
        </div>
      </div>
      <div className="group relative overflow-hidden bg-gradient-to-br from-teal-500 to-teal-600 text-white p-3 sm:p-4 lg:p-5 xl:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 sm:-mr-12 sm:-mt-12 lg:-mr-16 lg:-mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="relative z-10">
          <div className="text-[10px] sm:text-xs lg:text-sm opacity-90 mb-1 sm:mb-2 font-medium leading-tight">LPJ</div>
          <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">{stats.lpj}</div>
        </div>
      </div>
    </div>

    <div ref={activitiesRef} className="scroll-animate grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-2 sm:p-3 rounded-xl text-white shrink-0">
            <TrendingUp className="sm:w-7 sm:h-7" size={24} />
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Nilai Performansi</h3>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-md transition-shadow">
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm text-gray-600 block mb-1">Lab EISD</span>
              <span className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg break-words">Enterprise intelligence Systems and Development</span>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">85.5</div>
              <div className="text-xs text-emerald-600 font-medium">Excellent</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-2 sm:p-3 rounded-xl text-white shrink-0">
            <Award className="sm:w-7 sm:h-7" size={24} />
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Jumlah Kegiatan</h3>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-md transition-shadow">
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm text-gray-600 block mb-1">Lab EISD</span>
              <span className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg">Total Aktivitas</span>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent shrink-0">{stats.totalKegiatan}</div>
          </div>
        </div>
      </div>
    </div>

    {/* Section Plan Approval */}
    {submittedPlans && submittedPlans.filter(p => p.status === 'approved_by_dosen').length > 0 && (
      <div ref={planPendingRef} className="scroll-animate bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
        <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <FileText className="text-amber-600" size={24} />
          Plan Menunggu Persetujuan KK ({submittedPlans.filter(p => p.status === 'approved_by_dosen').length})
        </h3>
        <div className="space-y-4">
          {submittedPlans.filter(p => p.status === 'approved_by_dosen').map((plan) => (
            <div key={plan.id} className="flex flex-col gap-4 p-5 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="bg-amber-100 p-3 sm:p-4 rounded-xl shrink-0">
                  <FileText className="text-amber-600" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-800 text-base sm:text-lg mb-2 break-words">
                    Rencana Kegiatan dari Lab EISD
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-2">
                    Disetujui Dosen: {plan.approvedByDosen ? new Date(plan.approvedByDosen).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Jumlah indikator: {Object.keys(plan.planData).length}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button 
                  onClick={() => handleApprovePlan(plan.id)}
                  className="flex-1 px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold text-base"
                >
                  <CheckCircle size={20} />
                  Setujui
                </button>
                <button 
                  onClick={() => handleRejectPlan(plan.id)}
                  className="flex-1 px-5 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold text-base"
                >
                  <XCircle size={20} />
                  Tolak
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {submittedPlans && submittedPlans.filter(p => p.status === 'approved_by_kk').length > 0 && (
      <div ref={planApprovedRef} className="scroll-animate bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
        <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <CheckCircle className="text-emerald-600" size={24} />
          Plan yang Sudah Disetujui ({submittedPlans.filter(p => p.status === 'approved_by_kk').length})
        </h3>
        <div className="space-y-4">
          {submittedPlans.filter(p => p.status === 'approved_by_kk').map((plan) => (
            <div key={plan.id} className="flex flex-col gap-4 p-5 sm:p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="bg-emerald-100 p-3 sm:p-4 rounded-xl shrink-0">
                  <FileText className="text-emerald-600" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-800 text-base sm:text-lg mb-2 break-words">
                    Rencana Kegiatan dari Lab EISD
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-2">
                    Disetujui KK: {plan.approvedByKK ? new Date(plan.approvedByKK).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                  </div>
                  <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold inline-flex items-center gap-2">
                    <CheckCircle size={14} />
                    Disetujui Lengkap
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
        <Activity className="text-emerald-600 sm:w-7 sm:h-7" size={24} />
        Detail Kegiatan Lab EISD
      </h3>
      
      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3">
        {labData.activities.map((activity, idx) => (
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
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Timeline:</span>
                <span className="text-xs text-gray-600">{activity.tw}</span>
              </div>
            )}
            {activity.ket && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-600">Keterangan:</span>
                <span className="text-xs text-gray-600 break-words text-right flex-1 ml-2">{activity.ket}</span>
              </div>
            )}
            <button 
              onClick={() => onOpenDetail(activity)}
              className="w-full py-2.5 text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center justify-center gap-2 rounded-lg hover:bg-emerald-100 transition-colors text-sm border border-emerald-200"
            >
              <Eye size={16} />
              Lihat Detail
            </button>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-hidden rounded-lg sm:rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">No</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">Indikator</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">Target</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">Timeline</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">Keterangan</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">Status</th>
                <th className="px-3 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {labData.activities.map((activity, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors">
                  <td className="px-3 sm:px-4 py-3 sm:py-4 font-medium text-gray-700 text-sm">{activity.no}</td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 break-words">{activity.indicator}</td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 font-semibold text-emerald-600 text-sm">{activity.jumlah}</td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">{activity.tw || '-'}</td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 break-words">{activity.ket || '-'}</td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4">
                    <StatusPill status={activity.status} />
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 text-center">
                    <button 
                      onClick={() => onOpenDetail(activity)}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors text-xs sm:text-sm"
                    >
                      <Eye size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden md:inline">Detail</span>
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
  </>
  );
};

export default DashboardKK;


