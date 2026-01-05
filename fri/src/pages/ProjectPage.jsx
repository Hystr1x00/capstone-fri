import React, { useState } from 'react';
import { FolderPlus, Plus, X, CheckCircle, Clock, UserPlus, Users } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import ModernDatePicker from '../components/ModernDatePicker';
import projectService from '../services/projectService';

const ProjectPage = ({ 
  currentRole, 
  projects, 
  setProjects, 
  showProjectModal, 
  setShowProjectModal 
}) => {
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    deadline: ''
  });
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // Helper function to refresh projects from service
  const refreshProjects = () => {
    setProjects(projectService.getProjects());
  };
  
  // Dummy list anggota lab (bisa diambil dari divisiService.getAllAnggota() jika diperlukan)
  const labMembers = ['Ahmad Fauzi', 'Siti Nurhaliza', 'Budi Santoso', 'Dewi Lestari', 'Eko Prasetyo', 'Fina Andriani'];

  const handleCreateProject = (e) => {
    e.preventDefault();
    projectService.createProject({
      title: projectForm.title,
      description: projectForm.description,
      deadline: projectForm.deadline
    });
    refreshProjects();
    setProjectForm({ title: '', description: '', deadline: '' });
    setShowProjectModal(false);
    setAlertMessage('Project berhasil dibuat dan diberikan ke Lab EISD!');
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleAcceptProject = (projectId) => {
    projectService.acceptProject(projectId);
    refreshProjects();
    setAlertMessage('Project berhasil diterima! Silakan assign anggota yang akan mengerjakan.');
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
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
      setAlertMessage('Pilih minimal satu anggota yang akan mengerjakan project!');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      return;
    }
    projectService.assignMembers(selectedProject.id, selectedMembers);
    refreshProjects();
    setShowAssignModal(false);
    setSelectedProject(null);
    setSelectedMembers([]);
    setAlertMessage(`Project berhasil di-assign ke ${selectedMembers.length} anggota!`);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const pendingProjects = projects.filter(p => p.status === 'pending');
  const acceptedProjects = projects.filter(p => p.status === 'accepted');

  const headerRef = useScrollAnimation();
  const dosenListRef = useScrollAnimation({ threshold: 0.1 });
  const pendingRef = useScrollAnimation({ threshold: 0.1 });
  const acceptedRef = useScrollAnimation({ threshold: 0.1 });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="fixed top-4 right-2 sm:right-4 z-50 animate-slide-in max-w-[calc(100vw-1rem)] sm:max-w-none">
          <div className="bg-white rounded-xl shadow-2xl border border-emerald-200 p-3 sm:p-4 flex items-center gap-2 sm:gap-3 min-w-[280px] sm:min-w-[300px]">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <CheckCircle className="text-emerald-600" size={24} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">{alertMessage}</p>
            </div>
            <button
              onClick={() => setShowSuccessAlert(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>
      )}

      <div ref={headerRef} className="scroll-animate visible">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Project</h1>
          <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Dosen Pembina View */}
      {currentRole === 'dosen' && (
        <div ref={dosenListRef} className="scroll-animate bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
              <FolderPlus className="text-emerald-600" size={20} />
              Daftar Project
            </h3>
            <button
              onClick={() => setShowProjectModal(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Buat Project Baru</span>
              <span className="sm:hidden">Buat Project</span>
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
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-5 flex-1 min-w-0">
                    <div className="bg-emerald-100 p-3 sm:p-4 rounded-xl shrink-0">
                      <FolderPlus className="text-emerald-600" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-800 text-base sm:text-lg mb-1 break-words">{project.title}</div>
                      <div className="text-xs sm:text-sm text-gray-600 mb-2 break-words">{project.description}</div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Clock size={14} />
                          Deadline: {new Date(project.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          Dibuat: {new Date(project.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end sm:justify-start gap-4 flex-shrink-0">
                    <div className="text-right sm:text-left">
                      {project.status === 'pending' && (
                        <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 inline-flex items-center gap-2">
                          <Clock size={14} />
                          <span className="hidden sm:inline">Menunggu ACC Lab</span>
                          <span className="sm:hidden">Pending</span>
                        </span>
                      )}
                      {project.status === 'accepted' && (
                        <div className="text-right sm:text-left">
                          <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 inline-flex items-center gap-2 mb-2">
                            <CheckCircle size={14} />
                            <span className="hidden sm:inline">Diterima Lab</span>
                            <span className="sm:hidden">Diterima</span>
                          </span>
                          {project.assignedTo && (
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
      )}

      {/* KK View - Read Only */}
      {currentRole === 'kk' && (
        <div ref={dosenListRef} className="scroll-animate bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
              <FolderPlus className="text-emerald-600" size={24} />
              Daftar Project
            </h3>
            <div className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg sm:rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-700 font-semibold">
              Mode Lihat Saja
            </div>
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
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-5 p-5 sm:p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl border-2 border-emerald-200 hover:border-emerald-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start sm:items-center gap-4 sm:gap-5 flex-1 min-w-0">
                    <div className="bg-emerald-100 p-3 sm:p-4 rounded-xl shrink-0 shadow-sm">
                      <FolderPlus className="text-emerald-600" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-800 text-base sm:text-lg mb-2 break-words">{project.title}</div>
                      <div className="text-xs sm:text-sm text-gray-600 mb-3 break-words leading-relaxed">{project.description}</div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1.5 whitespace-nowrap px-2 py-1 bg-white rounded-lg">
                          <Clock size={14} className="text-amber-600" />
                          Deadline: {new Date(project.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5 whitespace-nowrap px-2 py-1 bg-white rounded-lg">
                          Dibuat: {new Date(project.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start justify-end gap-3 flex-shrink-0 min-w-[140px] sm:min-w-[200px]">
                    <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                      {project.status === 'pending' && (
                        <span className="px-4 py-2 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200 inline-flex items-center gap-2 shadow-sm whitespace-nowrap">
                          <Clock size={14} />
                          <span className="hidden sm:inline">Menunggu ACC Lab</span>
                          <span className="sm:hidden">Pending</span>
                        </span>
                      )}
                      {project.status === 'accepted' && (
                        <>
                          <span className="px-4 py-2 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 inline-flex items-center gap-2 shadow-sm whitespace-nowrap">
                            <CheckCircle size={14} />
                            <span className="hidden sm:inline">Diterima Lab</span>
                            <span className="sm:hidden">Diterima</span>
                          </span>
                          {project.assignedTo && (
                            <div className="mt-3 px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm w-full">
                              <div className="text-xs font-medium text-emerald-700 mb-2">Dikerjakan oleh:</div>
                              <div className="text-sm text-gray-800">
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
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Lab View */}
      {currentRole === 'lab' && (
        <>
          {/* Project Menunggu ACC */}
          {pendingProjects.length > 0 && (
            <div ref={pendingRef} className="scroll-animate bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <Clock className="text-amber-600" size={24} />
                Project Menunggu ACC ({pendingProjects.length})
              </h3>
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
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold text-sm sm:text-base w-full sm:w-auto"
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
            <div ref={acceptedRef} className="scroll-animate bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <CheckCircle className="text-emerald-600" size={24} />
                Project yang Diterima ({acceptedProjects.length})
              </h3>
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
                        {project.assignedTo && project.assignedTo.length > 0 ? (
                          <div className="text-xs sm:text-sm text-emerald-700 font-semibold flex items-center gap-2 break-words">
                            <Users size={14} />
                            Dikerjakan oleh: {Array.isArray(project.assignedTo) ? project.assignedTo.join(', ') : project.assignedTo}
                          </div>
                        ) : (
                          <div className="text-xs sm:text-sm text-amber-700 font-semibold">
                            ⚠ Belum ada anggota yang di-assign
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setSelectedMembers(Array.isArray(project.assignedTo) ? project.assignedTo : (project.assignedTo ? [project.assignedTo] : []));
                          setShowAssignModal(true);
                        }}
                        className={`px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r text-white rounded-lg sm:rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold text-sm sm:text-base w-full sm:w-auto ${
                          project.assignedTo && project.assignedTo.length > 0
                            ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                            : 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
                        }`}
                      >
                        <UserPlus size={18} />
                        <span className="hidden sm:inline">{project.assignedTo && project.assignedTo.length > 0 ? 'Ubah Assign' : 'Assign Anggota'}</span>
                        <span className="sm:hidden">Assign</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length === 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center py-12 text-gray-500">
                <FolderPlus className="mx-auto mb-4 text-gray-400" size={48} />
                <p>Belum ada project dari dosen pembina</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal Create Project (Dosen) */}
      {showProjectModal && currentRole === 'dosen' && (
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

      {/* Modal Assign Anggota (Lab) */}
      {showAssignModal && selectedProject && currentRole === 'lab' && (
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
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg sm:rounded-xl border border-emerald-200">
              <div className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base break-words">{selectedProject.title}</div>
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
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
                >
                  Assign {selectedMembers.length > 0 ? `${selectedMembers.length} Anggota` : 'Anggota'}
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

export default ProjectPage;
