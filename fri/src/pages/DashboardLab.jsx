import React, { useState } from 'react';
import { Users, Calendar, FileText, Upload, FolderPlus, CheckCircle, X, UserPlus, Clock } from 'lucide-react';
import TWCalendar from '../components/TWCalendar';
import StatusPill from '../components/StatusPill';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const DashboardLab = ({ stats, labData, onOpenReport, projects, setProjects }) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [assignedMember, setAssignedMember] = useState('');
  
  // Dummy list anggota lab
  const labMembers = ['Ahmad Fauzi', 'Siti Nurhaliza', 'Budi Santoso', 'Dewi Lestari', 'Eko Prasetyo', 'Fina Andriani'];
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

  const handleAcceptProject = (projectId) => {
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, status: 'accepted' } : p
    );
    setProjects(updatedProjects);
    alert('Project berhasil diterima! Silakan assign anggota yang akan mengerjakan.');
  };

  const handleAssignMember = (e) => {
    e.preventDefault();
    if (!assignedMember.trim()) {
      alert('Pilih anggota yang akan mengerjakan project!');
      return;
    }
    const updatedProjects = projects.map(p => 
      p.id === selectedProject.id ? { ...p, assignedTo: assignedMember } : p
    );
    setProjects(updatedProjects);
    setShowAssignModal(false);
    setSelectedProject(null);
    setAssignedMember('');
    alert(`Project berhasil di-assign ke ${assignedMember}!`);
  };

  const pendingProjects = projects.filter(p => p.status === 'pending');
  const acceptedProjects = projects.filter(p => p.status === 'accepted');

  const headerRef = useScrollAnimation();
  const statsRef = useScrollAnimation({ threshold: 0.2 });
  const calendarRef = useScrollAnimation({ threshold: 0.1 });
  const projectRef = useScrollAnimation({ threshold: 0.1 });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div ref={headerRef} className="scroll-animate visible relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold break-words leading-tight">Laboratorium EISD</h2>
              <p className="text-green-100 text-sm sm:text-base lg:text-lg mt-2">Kelola Rencana & Laporan Kegiatan</p>
            </div>
          </div>
        </div>
      </div>

      <div ref={statsRef} className="scroll-animate grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">Total Kegiatan</div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{stats.totalKegiatan}</div>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-l-4 border-amber-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">Menunggu Persetujuan</div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">3</div>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-l-4 border-emerald-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">Disetujui</div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">8</div>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-l-4 border-purple-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">Selesai</div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">{stats.terlaksana}</div>
        </div>
      </div>

      <div ref={calendarRef} className="scroll-animate bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-2 sm:p-3 rounded-xl text-white shrink-0">
            <Calendar className="sm:w-7 sm:h-7" size={24} />
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 break-words">Kalender Rencana per Triwulan</h3>
        </div>
        <div className="overflow-x-auto">
          <TWCalendar monthToActivities={monthToActivities} monthNames={monthNames} />
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <FileText className="text-emerald-600 sm:w-7 sm:h-7" size={24} />
          Daftar Kegiatan
        </h3>
        
        {/* Mobile Card View */}
        <div className="block sm:hidden space-y-3">
          {labData.activities.slice(0, 5).map((activity, idx) => (
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
              <button 
                onClick={() => onOpenReport(activity)}
                className="w-full py-2.5 text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center justify-center gap-2 rounded-lg hover:bg-emerald-100 transition-colors text-sm border border-emerald-200"
              >
                <Upload size={16} />
                Lapor
              </button>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-hidden rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
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
                {labData.activities.slice(0, 5).map((activity, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors">
                    <td className="px-3 sm:px-4 py-3 sm:py-4 font-medium text-gray-700 text-sm">{activity.no}</td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 break-words">{activity.indicator}</td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 font-semibold text-emerald-600 text-sm">{activity.jumlah}</td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">{activity.tw}</td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4"><StatusPill status={activity.status} /></td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-center">
                      <button 
                        onClick={() => onOpenReport(activity)}
                        className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors text-xs sm:text-sm"
                      >
                        <Upload size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden md:inline">Lapor</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section Project dari Dosen Pembina */}
      <div ref={projectRef} className="scroll-animate bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <FolderPlus className="text-emerald-600 sm:w-7 sm:h-7" size={24} />
          Project dari Dosen Pembina
        </h3>

        {/* Project Menunggu ACC */}
        {pendingProjects.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
              <Clock className="text-amber-600" size={20} />
              Project Menunggu ACC ({pendingProjects.length})
            </h4>
            <div className="space-y-3 sm:space-y-4">
              {pendingProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-5 flex-1 min-w-0">
                    <div className="bg-amber-100 p-3 sm:p-4 rounded-xl shrink-0">
                      <FolderPlus className="text-amber-600" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-800 text-base sm:text-lg mb-1 break-words">{project.title}</div>
                      <div className="text-xs sm:text-sm text-gray-600 mb-2 break-words">{project.description}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Clock size={14} />
                          Deadline: {new Date(project.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                    <button
                      onClick={() => handleAcceptProject(project.id)}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
                    >
                      <CheckCircle size={18} />
                      <span className="hidden sm:inline">Terima Project</span>
                      <span className="sm:hidden">Terima</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project yang Sudah Diterima */}
        {acceptedProjects.length > 0 && (
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
              <CheckCircle className="text-emerald-600" size={20} />
              Project yang Diterima ({acceptedProjects.length})
            </h4>
            <div className="space-y-3 sm:space-y-4">
              {acceptedProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-5 flex-1 min-w-0">
                    <div className="bg-emerald-100 p-3 sm:p-4 rounded-xl shrink-0">
                      <FolderPlus className="text-emerald-600" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-800 text-base sm:text-lg mb-1 break-words">{project.title}</div>
                      <div className="text-xs sm:text-sm text-gray-600 mb-2 break-words">{project.description}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Clock size={14} />
                          Deadline: {new Date(project.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      {project.assignedTo ? (
                        <div className="text-xs sm:text-sm text-emerald-700 font-semibold break-words">
                          ✓ Dikerjakan oleh: {project.assignedTo}
                        </div>
                      ) : (
                        <div className="text-xs sm:text-sm text-amber-700 font-semibold">
                          ⚠ Belum ada anggota yang di-assign
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                    {!project.assignedTo ? (
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setShowAssignModal(true);
                        }}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
                      >
                        <UserPlus size={18} />
                        <span className="hidden sm:inline">Assign Anggota</span>
                        <span className="sm:hidden">Assign</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setAssignedMember(project.assignedTo);
                          setShowAssignModal(true);
                        }}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
                      >
                        <UserPlus size={18} />
                        <span className="hidden sm:inline">Ubah Assign</span>
                        <span className="sm:hidden">Ubah</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.length === 0 && (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <FolderPlus className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-sm sm:text-base">Belum ada project dari dosen pembina</p>
          </div>
        )}
      </div>

      {/* Modal Assign Anggota */}
      {showAssignModal && selectedProject && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-white border-opacity-20">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
                <UserPlus className="text-emerald-600" size={24} />
                <span className="hidden sm:inline">Assign Anggota untuk Project</span>
                <span className="sm:hidden">Assign Anggota</span>
              </h3>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedProject(null);
                  setAssignedMember('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-xl">
              <div className="font-semibold text-gray-800 mb-2 text-sm sm:text-base break-words">{selectedProject.title}</div>
              <div className="text-xs sm:text-sm text-gray-600 break-words">{selectedProject.description}</div>
            </div>
            <form onSubmit={handleAssignMember} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Pilih Anggota Lab yang Akan Mengerjakan <span className="text-red-500">*</span>
                </label>
                <select
                  value={assignedMember}
                  onChange={(e) => setAssignedMember(e.target.value)}
                  className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm sm:text-base"
                  required
                >
                  <option value="">-- Pilih Anggota --</option>
                  {labMembers.map((member, idx) => (
                    <option key={idx} value={member}>{member}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
                >
                  Assign Anggota
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedProject(null);
                    setAssignedMember('');
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
    </div>
  );
};

export default DashboardLab;


