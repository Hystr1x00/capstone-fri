import React, { useState } from 'react';
import { Edit, FileText, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import SuccessAlert from '../components/SuccessAlert';

const PlanPage = ({ planGroups, planForm, setPlanForm, currentRole, submittedPlans, setSubmittedPlans, onSubmitAll }) => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleApprovePlan = (planId) => {
    if (currentRole === 'dosen') {
      setSubmittedPlans(submittedPlans.map(plan => 
        plan.id === planId 
          ? { ...plan, status: 'approved_by_dosen', approvedByDosen: new Date().toISOString() }
          : plan
      ));
      setAlertMessage('Plan berhasil disetujui! Menunggu persetujuan KK.');
      setShowSuccessAlert(true);
    } else if (currentRole === 'kk') {
      setSubmittedPlans(submittedPlans.map(plan => 
        plan.id === planId 
          ? { ...plan, status: 'approved_by_kk', approvedByKK: new Date().toISOString() }
          : plan
      ));
      setAlertMessage('Plan berhasil disetujui!');
      setShowSuccessAlert(true);
    }
  };

  const handleRejectPlan = (planId) => {
    if (currentRole === 'dosen') {
      setSubmittedPlans(submittedPlans.filter(plan => plan.id !== planId));
      setAlertMessage('Plan ditolak.');
      setShowSuccessAlert(true);
    } else if (currentRole === 'kk') {
      setSubmittedPlans(submittedPlans.map(plan => 
        plan.id === planId 
          ? { ...plan, status: 'pending', approvedByDosen: null }
          : plan
      ));
      setAlertMessage('Plan ditolak dan dikembalikan ke dosen pembina.');
      setShowSuccessAlert(true);
    }
  };
  const headerRef = useScrollAnimation();
  const formRef = useScrollAnimation({ threshold: 0.1 });

  // Get pending plans for dosen, approved_by_dosen for kk
  const plansToApprove = currentRole === 'dosen' 
    ? submittedPlans?.filter(p => p.status === 'pending') || []
    : currentRole === 'kk'
    ? submittedPlans?.filter(p => p.status === 'approved_by_dosen') || []
    : [];

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
      <div className="relative z-10 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold break-words leading-tight">Input Rencana Kegiatan (Periode)</h2>
        </div>
      </div>
    </div>
    <div ref={formRef} className="scroll-animate bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
      <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
        <FileText className="text-emerald-600" size={24} />
        Daftar Rencana Berdasarkan Indikator
      </h3>
      <div className="space-y-4 sm:space-y-8">
        {planGroups && planGroups.length > 0 ? planGroups.map((group, gi) => (
          <div key={gi} className="rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-4 sm:px-6 py-3 sm:py-4 font-bold text-gray-800 border-b border-emerald-100 text-sm sm:text-base">
              Main: {group.main}
            </div>
            {group.sasaran.map((s, si) => (
              <div key={si} className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
                <div className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base break-words">Sasaran Strategis: {s.sasaranStrategis}</div>
                {/* Mobile Card View */}
                <div className="block sm:hidden space-y-3">
                  {s.items.map((it, ii) => {
                    const key = `${group.main}|${s.sasaranStrategis}|${it.no}`;
                    const value = planForm[key] || { jumlah: '', tw: '', ket: '' };
                    return (
                      <div key={ii} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="font-medium text-gray-700 mb-2 text-sm">No. {it.no}</div>
                        <div className="text-sm text-gray-700 mb-3 break-words">{it.indikator}</div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Target (Jumlah)</label>
                            <input 
                              disabled={currentRole!=='lab'} 
                              value={value.jumlah} 
                              onChange={(e)=>setPlanForm(prev=>({...prev,[key]:{...value,jumlah:e.target.value}}))} 
                              type="text" 
                              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm" 
                              placeholder="cth: 2, 21/matkul" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Timeline (TW)</label>
                            <input 
                              disabled={currentRole!=='lab'} 
                              value={value.tw} 
                              onChange={(e)=>setPlanForm(prev=>({...prev,[key]:{...value,tw:e.target.value}}))} 
                              type="text" 
                              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm" 
                              placeholder="cth: TW1, TW2" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Keterangan</label>
                            <input 
                              disabled={currentRole!=='lab'} 
                              value={value.ket} 
                              onChange={(e)=>setPlanForm(prev=>({...prev,[key]:{...value,ket:e.target.value}}))} 
                              type="text" 
                              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm" 
                              placeholder="keterangan" 
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-hidden rounded-xl border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                          <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">No</th>
                          <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">Indikator</th>
                          <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">Target (Jumlah)</th>
                          <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">Timeline (TW)</th>
                          <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.items.map((it, ii) => {
                          const key = `${group.main}|${s.sasaranStrategis}|${it.no}`;
                          const value = planForm[key] || { jumlah: '', tw: '', ket: '' };
                          return (
                            <tr key={ii} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors">
                              <td className="px-3 sm:px-4 py-3 sm:py-4 font-medium text-gray-700 text-sm">{it.no}</td>
                              <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{it.indikator}</td>
                              <td className="px-3 sm:px-4 py-3 sm:py-4">
                                <input disabled={currentRole!=='lab'} value={value.jumlah} onChange={(e)=>setPlanForm(prev=>({...prev,[key]:{...value,jumlah:e.target.value}}))} type="text" className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm" placeholder="cth: 2, 21/matkul" />
                              </td>
                              <td className="px-3 sm:px-4 py-3 sm:py-4">
                                <input disabled={currentRole!=='lab'} value={value.tw} onChange={(e)=>setPlanForm(prev=>({...prev,[key]:{...value,tw:e.target.value}}))} type="text" className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm" placeholder="cth: TW1, TW2" />
                              </td>
                              <td className="px-3 sm:px-4 py-3 sm:py-4">
                                <input disabled={currentRole!=='lab'} value={value.ket} onChange={(e)=>setPlanForm(prev=>({...prev,[key]:{...value,ket:e.target.value}}))} type="text" className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm" placeholder="keterangan" />
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
        )) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm sm:text-base">Belum ada data rencana kegiatan.</p>
          </div>
        )}
      </div>
      {currentRole === 'lab' ? (
        <div className="flex justify-end pt-4 sm:pt-6">
          <button onClick={onSubmitAll} className="w-full sm:w-auto px-5 sm:px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-md font-semibold text-sm sm:text-base">
            Ajukan Semua Rencana
          </button>
        </div>
      ) : plansToApprove.length > 0 ? (
        <div className="mt-4 sm:mt-6 space-y-4">
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
              Plan Menunggu Persetujuan ({plansToApprove.length})
            </h4>
            <div className="space-y-3">
              {plansToApprove.map((plan) => (
                <div key={plan.id} className="p-4 bg-white rounded-lg border border-amber-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-800 mb-1">
                        Rencana Kegiatan dari Lab EISD
                      </div>
                      <div className="text-xs text-gray-600">
                        {plan.submittedAt ? `Diajukan: ${new Date(plan.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}` : ''}
                        {plan.approvedByDosen && currentRole === 'kk' && ` | Disetujui Dosen: ${new Date(plan.approvedByDosen).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Jumlah indikator: {Object.keys(plan.planData).length}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                      <button 
                        onClick={() => handleApprovePlan(plan.id)}
                        className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold text-sm"
                      >
                        <CheckCircle size={18} />
                        Setujui
                      </button>
                      <button 
                        onClick={() => handleRejectPlan(plan.id)}
                        className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold text-sm"
                      >
                        <XCircle size={18} />
                        Tolak
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 sm:mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 text-xs sm:text-sm text-gray-700">
          {currentRole === 'dosen' 
            ? 'Tidak ada plan yang menunggu persetujuan.'
            : currentRole === 'kk'
            ? 'Tidak ada plan yang sudah disetujui dosen dan menunggu persetujuan KK.'
            : 'Peran hanya melihat rencana.'}
        </div>
      )}
    </div>
    {/* Kalender Visualisasi Plan per TW - tetap di App agar konsisten dengan data contoh
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Calendar className="text-emerald-600" size={28} />
        Kalender Rencana (TW)
      </h3> */}
      {/* Bagian ini dibiarkan untuk App jika diperlukan. */}
    {/* </div> */}
  </div>
  </>
  );
};

export default PlanPage;


