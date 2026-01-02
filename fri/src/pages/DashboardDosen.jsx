import React, { useState } from 'react';
import { PenTool, Clock, CheckCircle, Activity, FileText, FolderPlus, X, Plus, XCircle, Eye } from 'lucide-react';
import StatusPill from '../components/StatusPill';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import ModernDatePicker from '../components/ModernDatePicker';
import SuccessAlert from '../components/SuccessAlert';

const DashboardDosen = ({ labData, projects, setProjects, showProjectModal, setShowProjectModal, submittedPlans, setSubmittedPlans }) => {
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    deadline: ''
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showTTDModal, setShowTTDModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleCreateProject = (e) => {
    e.preventDefault();
    const newProject = {
      id: projects.length + 1,
      title: projectForm.title,
      description: projectForm.description,
      deadline: projectForm.deadline,
      status: 'pending',
      assignedTo: null,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProjects([...projects, newProject]);
    setProjectForm({ title: '', description: '', deadline: '' });
    setShowProjectModal(false);
    setAlertMessage('Project berhasil dibuat dan diberikan ke Lab EISD!');
    setShowSuccessAlert(true);
  };

  const handleApprovePlan = (planId) => {
    setSubmittedPlans(submittedPlans.map(plan => 
      plan.id === planId 
        ? { ...plan, status: 'approved_by_dosen', approvedByDosen: new Date().toISOString() }
        : plan
    ));
    setAlertMessage('Plan berhasil disetujui! Menunggu persetujuan KK.');
    setShowSuccessAlert(true);
  };

  const handleRejectPlan = (planId) => {
    setSubmittedPlans(submittedPlans.filter(plan => plan.id !== planId));
    setAlertMessage('Plan ditolak.');
    setShowSuccessAlert(true);
  };

  const headerRef = useScrollAnimation({ threshold: 0, rootMargin: '0px' });
  const statsRef = useScrollAnimation({ threshold: 0.2 });
  const pendingRef = useScrollAnimation({ threshold: 0.1 });
  const approvedRef = useScrollAnimation({ threshold: 0.1 });
  const projectRef = useScrollAnimation({ threshold: 0.1 });
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold break-words leading-tight">Dashboard Dosen Pembina</h2>
            <p className="text-green-100 text-sm sm:text-base lg:text-lg mt-2">Persetujuan & Monitoring Lab EISD</p>
          </div>
        </div>
      </div>
    </div>

    <div ref={statsRef} className="scroll-animate grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-6 lg:p-8 border-l-4 border-amber-500 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-4 sm:p-5 rounded-2xl shrink-0">
            <Clock className="text-white sm:w-8 sm:h-8" size={28} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm sm:text-base text-gray-600 font-medium mb-2">Menunggu Persetujuan</div>
            <div className="text-4xl sm:text-5xl font-bold text-gray-800">3</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-6 lg:p-8 border-l-4 border-emerald-500 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-4 sm:p-5 rounded-2xl shrink-0">
            <CheckCircle className="text-white sm:w-8 sm:h-8" size={28} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm sm:text-base text-gray-600 font-medium mb-2">Disetujui</div>
            <div className="text-4xl sm:text-5xl font-bold text-gray-800">8</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-6 lg:p-8 border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 sm:p-5 rounded-2xl shrink-0">
            <Activity className="text-white sm:w-8 sm:h-8" size={28} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm sm:text-base text-gray-600 font-medium mb-2">Sedang Berjalan</div>
            <div className="text-4xl sm:text-5xl font-bold text-gray-800">5</div>
          </div>
        </div>
      </div>
    </div>

    <div ref={pendingRef} className="scroll-animate bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
      <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
        <FileText className="text-amber-600" size={24} />
        Dokumen Menunggu Persetujuan
      </h3>
      <div className="space-y-4">
        {labData.activities.filter(a => a.status === 'pending').map((activity, idx) => (
          <div key={idx} className="flex flex-col gap-4 p-5 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="bg-amber-100 p-3 sm:p-4 rounded-xl shrink-0">
                <FileText className="text-amber-600" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-800 text-base sm:text-lg mb-3 break-words leading-snug">{activity.indicator}</div>
                <div className="text-sm text-gray-600 flex items-center gap-2 flex-wrap">
                  <span className="font-medium">Target:</span>
                  <span className="px-3 py-1.5 bg-white rounded-full text-emerald-600 font-semibold text-sm">{activity.jumlah}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button 
                onClick={() => {
                  setAlertMessage(`Dokumen "${activity.indicator}" berhasil disetujui!`);
                  setShowSuccessAlert(true);
                }}
                className="flex-1 px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold text-base"
              >
                <CheckCircle size={20} />
                Setujui
              </button>
              <button 
                onClick={() => {
                  setAlertMessage(`Dokumen "${activity.indicator}" ditolak.`);
                  setShowSuccessAlert(true);
                }}
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

    <div ref={approvedRef} className="scroll-animate bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
      <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        Dokumen yang Disetujui
      </h3>
      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3">
        {labData.activities.filter(a => a.status === 'approved' || a.status === 'completed').map((activity, idx) => (
          <div key={idx} className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
            <div className="font-bold text-gray-800 text-sm mb-2 break-words">{activity.indicator}</div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">Target:</span>
              <span className="font-semibold text-emerald-600 text-sm">{activity.jumlah}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">Status:</span>
              <StatusPill status={activity.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Tanggal:</span>
              <span className="text-xs text-gray-600 font-medium">30 Sep 2025</span>
            </div>
            <button 
              onClick={() => {
                setSelectedActivity(activity);
                setShowTTDModal(true);
              }}
              className="mt-3 w-full py-2.5 text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center justify-center gap-2 rounded-lg hover:bg-emerald-100 transition-colors text-sm"
            >
              <Eye size={16} />
              Lihat TTD
            </button>
          </div>
        ))}
      </div>
      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-hidden rounded-lg sm:rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                <th className="px-4 py-3 text-left text-sm font-semibold">Indikator</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Target</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Tanggal Persetujuan</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">TTD Digital</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {labData.activities.filter(a => a.status === 'approved' || a.status === 'completed').map((activity, idx) => (
                <tr key={idx} className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors">
                  <td className="px-4 py-4 text-sm text-gray-700">{activity.indicator}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-emerald-600">{activity.jumlah}</td>
                  <td className="px-4 py-4">
                    <StatusPill status={activity.status} />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 font-medium">30 Sep 2025</td>
                  <td className="px-4 py-4 text-center">
                    <button 
                      onClick={() => {
                        setSelectedActivity(activity);
                        setShowTTDModal(true);
                      }}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors text-sm"
                    >
                      <Eye size={16} />
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

    {/* Section Plan Approval */}
    {submittedPlans.filter(p => p.status === 'pending').length > 0 && (
      <div ref={planPendingRef} className="scroll-animate bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
        <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <FileText className="text-amber-600" size={24} />
          Plan Menunggu Persetujuan ({submittedPlans.filter(p => p.status === 'pending').length})
        </h3>
        <div className="space-y-4">
          {submittedPlans.filter(p => p.status === 'pending').map((plan) => (
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
                    Diajukan: {new Date(plan.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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

    {submittedPlans.filter(p => p.status === 'approved_by_dosen').length > 0 && (
      <div ref={planApprovedRef} className="scroll-animate bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
        <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <CheckCircle className="text-emerald-600" size={24} />
          Plan yang Sudah Disetujui ({submittedPlans.filter(p => p.status === 'approved_by_dosen').length})
        </h3>
        <div className="space-y-4">
          {submittedPlans.filter(p => p.status === 'approved_by_dosen').map((plan) => (
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
                    Disetujui: {plan.approvedByDosen ? new Date(plan.approvedByDosen).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                  </div>
                  <div className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold inline-flex items-center gap-2">
                    <Clock size={14} />
                    Menunggu Persetujuan KK
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Section Project */}
    <div ref={projectRef} className="scroll-animate bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
          <FolderPlus className="text-emerald-600" size={24} />
          Manajemen Project
        </h3>
        <button
          onClick={() => setShowProjectModal(true)}
          className="px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold text-base"
        >
          <Plus size={20} />
          Buat Project Baru
        </button>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FolderPlus className="mx-auto mb-4 text-gray-400" size={48} />
            <p>Belum ada project yang dibuat</p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col gap-4 p-5 sm:p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="bg-emerald-100 p-3 sm:p-4 rounded-xl shrink-0">
                  <FolderPlus className="text-emerald-600" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-800 text-base sm:text-lg mb-2 break-words leading-snug">{project.title}</div>
                  <div className="text-sm text-gray-600 mb-3 break-words">{project.description}</div>
                  <div className="flex flex-col gap-2 text-xs sm:text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <Clock size={16} />
                      Deadline: {new Date(project.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-2">
                      Dibuat: {new Date(project.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-emerald-200">
                <div>
                  {project.status === 'pending' && (
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 inline-flex items-center gap-2">
                      <Clock size={16} />
                      Menunggu ACC Lab
                    </span>
                  )}
                  {project.status === 'accepted' && (
                    <div>
                      <span className="px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 inline-flex items-center gap-2 mb-2">
                        <CheckCircle size={16} />
                        Diterima Lab
                      </span>
                      {project.assignedTo && (
                        <div className="text-sm text-gray-600 break-words mt-2">
                          Dikerjakan oleh: <span className="font-semibold">
                            {Array.isArray(project.assignedTo) 
                              ? project.assignedTo.join(', ') 
                              : project.assignedTo}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>

    {/* Modal Create Project */}
    {showProjectModal && (
      <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-white border-opacity-20">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
              <FolderPlus className="text-emerald-600" size={24} />
              <span className="hidden sm:inline">Buat Project Baru untuk Lab EISD</span>
              <span className="sm:hidden">Buat Project</span>
            </h3>
            <button
              onClick={() => {
                setShowProjectModal(false);
                setProjectForm({ title: '', description: '', deadline: '' });
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
          <form onSubmit={handleCreateProject} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Judul Project <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm sm:text-base"
                placeholder="Masukkan judul project"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Deskripsi Project <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="4"
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm sm:text-base"
                placeholder="Jelaskan detail project yang akan diberikan ke Lab EISD..."
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Deadline Project <span className="text-red-500">*</span>
              </label>
              <ModernDatePicker
                value={projectForm.deadline}
                onChange={(date) => setProjectForm({ ...projectForm, deadline: date })}
                placeholder="Pilih deadline project"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Berikan Project ke Lab EISD</span>
                <span className="sm:hidden">Berikan Project</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProjectModal(false);
                  setProjectForm({ title: '', description: '', deadline: '' });
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:bg-gray-300 transition-all font-semibold text-sm sm:text-base"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Modal TTD Digital */}
    {showTTDModal && selectedActivity && (
      <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-white border-opacity-20">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
              <FileText className="text-emerald-600" size={24} />
              TTD Digital
            </h3>
            <button
              onClick={() => {
                setShowTTDModal(false);
                setSelectedActivity(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 sm:p-6 border border-emerald-200">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Informasi Dokumen</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Indikator:</span>
                  <span className="font-medium text-gray-800 text-right flex-1 ml-4">{selectedActivity.indicator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Target:</span>
                  <span className="font-semibold text-emerald-600">{selectedActivity.jumlah}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <StatusPill status={selectedActivity.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal Persetujuan:</span>
                  <span className="font-medium text-gray-800">30 Sep 2025</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-dashed border-gray-300">
              <div className="text-center py-8 sm:py-12">
                <div className="bg-emerald-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="text-emerald-600" size={40} />
                </div>
                <h4 className="font-bold text-gray-800 mb-2 text-lg sm:text-xl">Tanda Tangan Digital</h4>
                <p className="text-gray-600 text-sm sm:text-base mb-6">
                  Tanda tangan digital untuk dokumen ini
                </p>
                
                {/* Simulasi TTD */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 sm:p-8 border border-emerald-200 mb-4">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <CheckCircle className="text-emerald-600" size={48} />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-800 text-lg mb-2">Dosen Pembina</p>
                    <p className="text-gray-600 text-sm mb-4">Lab Management System</p>
                    <div className="border-t-2 border-emerald-600 w-32 mx-auto pt-2">
                      <p className="font-semibold text-gray-800">Tanda Tangan Digital</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">30 September 2025</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      setAlertMessage('TTD Digital berhasil diunduh!');
                      setShowSuccessAlert(true);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md font-semibold text-sm sm:text-base inline-flex items-center justify-center gap-2"
                  >
                    <FileText size={18} />
                    Unduh TTD
                  </button>
                  <button
                    onClick={() => {
                      setShowTTDModal(false);
                      setSelectedActivity(null);
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold text-sm sm:text-base"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  </>
  );
};

export default DashboardDosen;


