import React, { useState } from 'react';
import { Users, Calendar, FileText, Upload, FolderPlus, CheckCircle, X, UserPlus, Clock, Activity, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TWCalendar from '../components/TWCalendar';
import StatusPill from '../components/StatusPill';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const DashboardLab = ({ stats, labData, onOpenReport, projects, setProjects }) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  
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

  const handleToggleMember = (member) => {
    setSelectedMembers(prev => 
      prev.includes(member) 
        ? prev.filter(m => m !== member)
        : [...prev, member]
    );
  };

  const handleAssignMember = (e) => {
    e.preventDefault();
    if (selectedMembers.length === 0) {
      alert('Pilih minimal satu anggota yang akan mengerjakan project!');
      return;
    }
    const updatedProjects = projects.map(p => 
      p.id === selectedProject.id ? { ...p, assignedTo: selectedMembers } : p
    );
    setProjects(updatedProjects);
    setShowAssignModal(false);
    setSelectedProject(null);
    setSelectedMembers([]);
    alert(`Project berhasil di-assign ke ${selectedMembers.length} anggota!`);
  };

  const pendingProjects = projects.filter(p => p.status === 'pending');
  const acceptedProjects = projects.filter(p => p.status === 'accepted');

  const headerRef = useScrollAnimation();
  const statsRef = useScrollAnimation({ threshold: 0.2 });
  const calendarRef = useScrollAnimation({ threshold: 0.1 });
  const projectRef = useScrollAnimation({ threshold: 0.1 });

  return (
    <div className="space-y-6">
      <div ref={headerRef} className="scroll-animate visible">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Laboratorium EISD</h1>
          <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div ref={statsRef} className="scroll-animate grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Activity className="text-gray-600" size={18} />
            </div>
            <div className="text-xs text-gray-600 font-medium">Total Kegiatan</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalKegiatan}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="text-amber-600" size={18} />
            </div>
            <div className="text-xs text-gray-600 font-medium">Menunggu Persetujuan</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">3</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle className="text-emerald-600" size={18} />
            </div>
            <div className="text-xs text-gray-600 font-medium">Disetujui</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">8</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle className="text-emerald-600" size={18} />
            </div>
            <div className="text-xs text-gray-600 font-medium">Selesai</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.terlaksana}</div>
        </div>
      </div>

      {/* Line Chart for Kegiatan Terlaksana */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
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
                { month: 'Jan', terlaksana: 2 },
                { month: 'Feb', terlaksana: 5 },
                { month: 'Mar', terlaksana: 7 },
                { month: 'Apr', terlaksana: 6 },
                { month: 'Mei', terlaksana: 9 },
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

      <div ref={calendarRef} className="scroll-animate bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-100 p-2.5 rounded-lg">
            <Calendar className="text-emerald-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 break-words">Kalender Rencana per Triwulan</h3>
        </div>
        <div className="overflow-x-auto">
          <TWCalendar monthToActivities={monthToActivities} monthNames={monthNames} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
          <FileText className="text-emerald-600" size={20} />
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
      <div ref={projectRef} className="scroll-animate bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
          <FolderPlus className="text-emerald-600" size={20} />
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
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-5 flex-1 min-w-0">
                    <div className="bg-emerald-100 p-2.5 rounded-lg shrink-0">
                      <FolderPlus className="text-emerald-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 text-base sm:text-lg mb-1 break-words">{project.title}</div>
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
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
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
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-5 flex-1 min-w-0">
                    <div className="bg-emerald-100 p-2.5 rounded-lg shrink-0">
                      <FolderPlus className="text-emerald-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 text-base sm:text-lg mb-1 break-words">{project.title}</div>
                      <div className="text-xs sm:text-sm text-gray-600 mb-2 break-words">{project.description}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Clock size={14} />
                          Deadline: {new Date(project.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      {project.assignedTo && (Array.isArray(project.assignedTo) ? project.assignedTo.length > 0 : project.assignedTo) ? (
                        <div className="mt-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
                          <div className="text-xs font-medium text-emerald-700 mb-1">Dikerjakan oleh:</div>
                          <div className="text-xs text-gray-800 break-words">
                            {Array.isArray(project.assignedTo) 
                              ? project.assignedTo.map((name, idx) => (
                                  <span key={idx}>
                                    {name}
                                    {idx < project.assignedTo.length - 1 && ', '}
                                  </span>
                                ))
                              : project.assignedTo}
                          </div>
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
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
                      >
                        <UserPlus size={18} />
                        <span className="hidden sm:inline">Assign Anggota</span>
                        <span className="sm:hidden">Assign</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setSelectedMembers(Array.isArray(project.assignedTo) ? project.assignedTo : (project.assignedTo ? [project.assignedTo] : []));
                          setShowAssignModal(true);
                        }}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
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
                  setSelectedMembers([]);
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
                <div className="rounded-lg sm:rounded-xl">
                  <div className="max-h-48 sm:max-h-64 overflow-y-auto p-2">
                    {labMembers.map((member, idx) => (
                      <label
                        key={idx}
                        className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl cursor-pointer transition-all ${
                          selectedMembers.includes(member) 
                            ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 shadow-sm' 
                            : 'hover:bg-gray-50 border-2 border-transparent'
                        }`}
                      >
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(member)}
                            onChange={() => handleToggleMember(member)}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer transition-all appearance-none checked:bg-emerald-600 checked:border-emerald-600"
                            style={{
                              backgroundImage: selectedMembers.includes(member) 
                                ? "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z'/%3E%3C/svg%3E\")"
                                : 'none',
                              backgroundSize: 'contain',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat'
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-sm sm:text-base break-words ${
                            selectedMembers.includes(member) ? 'text-emerald-800' : 'text-gray-800'
                          }`}>
                            {member}
                          </div>
                        </div>
                        {selectedMembers.includes(member) && (
                          <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 flex items-center gap-1.5">
                            <CheckCircle size={14} />
                            <span className="hidden sm:inline">Dipilih</span>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
                {selectedMembers.length > 0 && (
                  <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-emerald-700 font-semibold break-words">
                    {selectedMembers.length} anggota dipilih: {selectedMembers.join(', ')}
                  </div>
                )}
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
                    setSelectedMembers([]);
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


