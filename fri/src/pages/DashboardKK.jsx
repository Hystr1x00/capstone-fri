import React, { useState } from 'react';
import { BarChart3, TrendingUp, Award, Activity, Eye, CheckCheck, CheckCircle, Clock, FileText, XCircle, Building2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatusPill from '../components/StatusPill';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import SuccessAlert from '../components/SuccessAlert';
import ConfirmAlert from '../components/ConfirmAlert';
import planService from '../services/planService';
import notificationService from '../services/notificationService';

const DashboardKK = ({ stats, labData, onOpenDetail, submittedPlans, setSubmittedPlans, onNotificationChange }) => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showConfirmApprove, setShowConfirmApprove] = useState(false);
  const [showConfirmReject, setShowConfirmReject] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const handleApprovePlan = (planId) => {
    setSelectedPlanId(planId);
    setShowConfirmApprove(true);
  };

  const confirmApprovePlan = () => {
    const plan = planService.getSubmittedPlans().find(p => p.id === selectedPlanId);
    planService.approveByKK(selectedPlanId);
    setSubmittedPlans(planService.getSubmittedPlans());
    setShowConfirmApprove(false);
    setAlertMessage('Plan berhasil disetujui!');
    setShowSuccessAlert(true);
    
    // Add notification
    notificationService.addNotification({
      type: 'plan',
      title: 'Plan Disetujui',
      message: `Plan dari Lab EISD telah disetujui oleh KK.`,
      time: new Date().toLocaleString('id-ID')
    });
    if (onNotificationChange) onNotificationChange();
  };

  const handleRejectPlan = (planId) => {
    setSelectedPlanId(planId);
    setShowConfirmReject(true);
  };

  const confirmRejectPlan = () => {
    const plan = planService.getSubmittedPlans().find(p => p.id === selectedPlanId);
    planService.rejectPlan(selectedPlanId, 'kk');
    setSubmittedPlans(planService.getSubmittedPlans());
    setShowConfirmReject(false);
    setAlertMessage('Plan ditolak dan dikembalikan ke dosen pembina.');
    setShowSuccessAlert(true);
    
    // Add notification
    notificationService.addNotification({
      type: 'plan',
      title: 'Plan Ditolak',
      message: `Plan dari Lab EISD ditolak oleh KK dan dikembalikan ke dosen pembina.`,
      time: new Date().toLocaleString('id-ID')
    });
    if (onNotificationChange) onNotificationChange();
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
    
    {/* Confirm Approve Modal */}
    <ConfirmAlert
      message="Apakah Anda yakin ingin menyetujui rencana kegiatan ini?"
      isVisible={showConfirmApprove}
      onConfirm={confirmApprovePlan}
      onCancel={() => setShowConfirmApprove(false)}
    />
    
    {/* Confirm Reject Modal */}
    <ConfirmAlert
      message="Apakah Anda yakin ingin menolak rencana kegiatan ini? Rencana akan dikembalikan ke dosen pembina."
      isVisible={showConfirmReject}
      onConfirm={confirmRejectPlan}
      onCancel={() => setShowConfirmReject(false)}
    />
  <div className="space-y-6">
    {/* Top Header - Clean Design */}
    <div ref={headerRef} className="scroll-animate visible">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard KK</h1>
        <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
    </div>

    <div ref={statsRef} className="scroll-animate grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      <div className="group relative overflow-hidden bg-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Building2 className="text-red-500" size={18} />
            </div>
            <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 font-medium leading-tight">Jumlah Laboratorium</div>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-800">{stats.totalUKM}</div>
        </div>
      </div>
      <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Activity className="text-gray-600" size={18} />
          </div>
          <div className="text-xs text-gray-600 font-medium">Jumlah Kegiatan</div>
        </div>
        <div className="text-3xl font-bold text-gray-900">{stats.totalKegiatan}</div>
      </div>
      <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-amber-50 rounded-lg">
            <Clock className="text-amber-600" size={18} />
          </div>
          <div className="text-xs text-gray-600 font-medium">Belum Terlaksana</div>
        </div>
        <div className="text-3xl font-bold text-gray-900">{stats.belumTerlaksana}</div>
      </div>
      <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <CheckCircle className="text-emerald-600" size={18} />
          </div>
          <div className="text-xs text-gray-600 font-medium">Terlaksana</div>
        </div>
        <div className="text-3xl font-bold text-gray-900">{stats.terlaksana}</div>
      </div>
      <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <FileText className="text-emerald-600" size={18} />
          </div>
          <div className="text-xs text-gray-600 font-medium">LPJ</div>
        </div>
        <div className="text-3xl font-bold text-gray-900">{stats.lpj}</div>
      </div>
    </div>

    <div ref={activitiesRef} className="scroll-animate grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-100 p-2.5 rounded-lg">
            <TrendingUp className="text-emerald-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Nilai Performansi</h3>
        </div>
        <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <span className="text-xs text-emerald-600 font-medium block mb-1">Lab EISD</span>
              <span className="text-sm text-gray-800 break-words leading-snug">Enterprise intelligence Systems and Development</span>
            </div>
            <div className="text-right ml-4">
              <div className="text-3xl font-bold text-emerald-600">85.5</div>
              <div className="text-xs text-emerald-600 font-medium">Excellent</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-100 p-2.5 rounded-lg">
            <Award className="text-emerald-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Jumlah Kegiatan</h3>
        </div>
        <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <span className="text-xs text-emerald-600 font-medium block mb-1">Lab EISD</span>
              <span className="text-sm text-gray-800">Total Aktivitas</span>
            </div>
            <div className="text-right ml-4">
              <div className="text-3xl font-bold text-emerald-600">{stats.totalKegiatan}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Line Chart for Kegiatan Terlaksana */}
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-100 p-2.5 rounded-lg">
          <TrendingUp className="text-emerald-600" size={20} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Grafik Kegiatan Terlaksana</h3>
      </div>
      <div className="w-full" style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={[
              { month: 'Jan', terlaksana: 5 },
              { month: 'Feb', terlaksana: 8 },
              { month: 'Mar', terlaksana: 12 },
              { month: 'Apr', terlaksana: 10 },
              { month: 'Mei', terlaksana: 15 },
              { month: 'Jun', terlaksana: stats.terlaksana }
            ]}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="terlaksana" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Section Plan Approval */}
    {submittedPlans && submittedPlans.filter(p => p.status === 'approved_by_dosen').length > 0 && (
      <div ref={planPendingRef} className="scroll-animate bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
          <FileText className="text-amber-600" size={20} />
          Plan Menunggu Persetujuan KK ({submittedPlans.filter(p => p.status === 'approved_by_dosen').length})
        </h3>
        <div className="space-y-4">
          {submittedPlans.filter(p => p.status === 'approved_by_dosen').map((plan) => (
            <div key={plan.id} className="flex flex-col gap-4 p-5 sm:p-6 bg-amber-50 rounded-xl border border-amber-200 hover:shadow-md transition-all">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="bg-amber-100 p-3 sm:p-4 rounded-xl shrink-0">
                  <FileText className="text-amber-600" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 text-base sm:text-lg mb-2 break-words">
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
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full sm:w-auto">
                <button 
                  onClick={() => handleApprovePlan(plan.id)}
                  className="flex-1 px-4 sm:px-5 py-3 sm:py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-semibold text-sm sm:text-base min-h-[44px]"
                >
                  <CheckCircle size={18} />
                  Setujui
                </button>
                <button 
                  onClick={() => handleRejectPlan(plan.id)}
                  className="flex-1 px-4 sm:px-5 py-3 sm:py-3.5 bg-red-100 text-red-700 rounded-lg sm:rounded-xl hover:bg-red-200 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-semibold text-sm sm:text-base min-h-[44px]"
                >
                  <XCircle size={18} />
                  Tolak
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {submittedPlans && submittedPlans.filter(p => p.status === 'approved_by_kk').length > 0 && (
      <div ref={planApprovedRef} className="scroll-animate bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-200">
        <h3 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <CheckCircle className="text-emerald-600" size={24} />
          Plan yang Sudah Disetujui ({submittedPlans.filter(p => p.status === 'approved_by_kk').length})
        </h3>
        <div className="space-y-4">
          {submittedPlans.filter(p => p.status === 'approved_by_kk').map((plan) => (
            <div key={plan.id} className="flex flex-col gap-4 p-5 sm:p-6 bg-emerald-50 rounded-xl border border-emerald-200 hover:shadow-md transition-all">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="bg-emerald-100 p-3 sm:p-4 rounded-xl shrink-0">
                  <FileText className="text-emerald-600" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 text-base sm:text-lg mb-2 break-words">
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

    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
        <Activity className="text-emerald-600" size={20} />
        Detail Kegiatan Lab EISD
      </h3>
      
      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3">
        {labData.activities.map((activity, idx) => (
          <div key={idx} className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="flex items-start justify-between mb-2">
              <div className="font-medium text-gray-700 text-sm">#{activity.no}</div>
              <StatusPill status={activity.status} />
            </div>
            <div className="font-semibold text-gray-800 text-sm mb-2 break-words">{activity.indicator}</div>
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
              className="w-full py-3 sm:py-2.5 text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center justify-center gap-2 rounded-lg hover:bg-emerald-100 transition-colors text-sm border border-emerald-200 min-h-[44px]"
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
                <tr key={idx} className="border-b border-gray-100 hover:bg-emerald-50 transition-colors">
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
