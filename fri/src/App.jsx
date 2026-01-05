import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, XCircle, Eye, Edit, FileText, PenTool, Calendar, Users, Award, TrendingUp, BarChart3, Activity, Clock, CheckCheck, AlertCircle, Upload, X, LayoutDashboard, UploadCloud, LineChart } from 'lucide-react';
import Sidebar from './components/Sidebar';
import LoginScreen from './components/LoginScreen';
import StatusPill from './components/StatusPill';
import ActivityDetailModal from './components/ActivityDetailModal';
import ReportModal from './components/ReportModal';
import Notifications from './components/Notifications';
import ModernDatePicker from './components/ModernDatePicker';
import DashboardKKPage from './pages/DashboardKK';
import DashboardDosenPage from './pages/DashboardDosen';
import DashboardLabPage from './pages/DashboardLab';
import PlanPage from './pages/PlanPage';
import ReportPage from './pages/ReportPage';
import TrackingPage from './pages/TrackingPage';
import ProjectPage from './pages/ProjectPage';
import DivisiPage from './pages/DivisiPage';
// Import Services
import dashboardService from './services/dashboardService';
import planService from './services/planService';
import reportService from './services/reportService';
import projectService from './services/projectService';
import divisiService from './services/divisiService';
import trackingService from './services/trackingService';
import notificationService from './services/notificationService';

const LabManagementSystem = () => {
  // Load authRole from localStorage on mount
  const [authRole, setAuthRole] = useState(() => {
    const savedRole = localStorage.getItem('authRole');
    return savedRole || null;
  });
  const [currentRole, setCurrentRole] = useState(() => {
    const savedRole = localStorage.getItem('authRole');
    return savedRole || 'kk';
  });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planActivity, setPlanActivity] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportActivity, setReportActivity] = useState(null);
  const [reportDate, setReportDate] = useState('');
  const [showHamburger, setShowHamburger] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  // Initialize data from services
  const [projects, setProjects] = useState(() => projectService.getProjects());
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [planGroups] = useState(() => planService.getPlanGroups());
  const [planForm, setPlanForm] = useState({});
  const [submittedPlans, setSubmittedPlans] = useState(() => planService.getSubmittedPlans());
  
  // Load dashboard data from service
  const [stats, setStats] = useState(() => dashboardService.getStats());
  const [labData, setLabData] = useState(() => dashboardService.getLabData());
  const [reportsData, setReportsData] = useState(() => reportService.getReports());
  
  // Refresh data function
  const refreshData = () => {
    setStats(dashboardService.getStats());
    setLabData(dashboardService.getLabData());
    setProjects(projectService.getProjects());
    setSubmittedPlans(planService.getSubmittedPlans());
    setReportsData(reportService.getReports());
  };

  

  const handleLogin = (role) => {
    setAuthRole(role);
    setCurrentRole(role);
    // Save to localStorage for persistence
    localStorage.setItem('authRole', role);
  };

  const handleLogout = () => {
    setAuthRole(null);
    setCurrentRole('kk');
    setSelectedActivity(null);
    setShowModal(false);
    // Clear localStorage on logout
    localStorage.removeItem('authRole');
  };

  

  // Stats and labData now loaded from service in useState above

  const dummyUsers = [
    { username: 'kk1', password: '123456', role: 'kk', name: 'Ketua KK' },
    { username: 'dosen1', password: '123456', role: 'dosen', name: 'Dosen Pembina' },
    { username: 'lab1', password: '123456', role: 'lab', name: 'Laboratorium EISD' }
  ];

  // reportsData now loaded from service in useState above

  // State for notification refresh trigger
  const [notificationRefresh, setNotificationRefresh] = useState(0);

  // Handle notification change callback
  const handleNotificationChange = () => {
    setNotificationRefresh(prev => prev + 1);
  };

  // Compute per-role notifications after data declarations to avoid TDZ
  const notifications = useMemo(() => {
    const list = [];

    // Get notifications from notification service
    const serviceNotifications = notificationService.getNotifications();
    serviceNotifications.forEach(n => {
      list.push(n);
    });

    // Plans awaiting approval -> important for dosen
    submittedPlans.forEach((p) => {
      if (p.status === 'pending') {
        list.push({
          id: `plan-${p.id}`,
          type: 'plan',
          title: 'Rencana diajukan',
          message: 'Terdapat rencana baru yang menunggu persetujuan.',
          time: p.submittedAt || '',
          data: p
        });
      }
    });

    // Reports - show pending reports to dosen, approved to lab
    (reportsData || []).forEach((r) => {
      if (currentRole === 'dosen' && r.status === 'pending') {
        list.push({ id: `report-${r.id}`, type: 'report', title: `Laporan: ${r.title}`, message: 'Menunggu persetujuan', time: r.date, data: r });
      }
      if (currentRole === 'lab' && r.status === 'approved') {
        list.push({ id: `report-${r.id}-approved`, type: 'report', title: `Laporan disetujui: ${r.title}`, message: 'Laporan Anda telah disetujui.', time: r.date, data: r });
      }
    });

    // Projects - notify KK about new projects, dosen about accepted projects
    (projects || []).forEach((pr) => {
      if (currentRole === 'kk' && pr.status === 'pending') {
        list.push({ id: `project-${pr.id}`, type: 'project', title: `Project baru: ${pr.title}`, message: 'Project menunggu review.', time: pr.createdAt, data: pr });
      }
      if (currentRole === 'dosen' && pr.status === 'accepted') {
        list.push({ id: `project-${pr.id}-accepted`, type: 'project', title: `Project diterima: ${pr.title}`, message: 'Project telah diterima.', time: pr.createdAt, data: pr });
      }
    });

    // Lab activities - dosen sees pending activities, lab sees approved ones
    (labData.activities || []).forEach((a, idx) => {
      if (currentRole === 'dosen' && a.status === 'pending') {
        list.push({ id: `activity-${idx}`, type: 'activity', title: `Aktivitas menunggu: ${a.indicator}`, message: `${a.jumlah} • ${a.tw}`, time: a.tw, data: a });
      }
      if (currentRole === 'lab' && a.status === 'approved') {
        list.push({ id: `activity-${idx}-approved`, type: 'activity', title: `Aktivitas disetujui: ${a.indicator}`, message: `${a.jumlah}`, time: a.tw, data: a });
      }
    });

    // Sort by time if available (newest first)
    list.sort((a, b) => {
      const ta = a.time ? new Date(a.time).getTime() : 0;
      const tb = b.time ? new Date(b.time).getTime() : 0;
      return tb - ta;
    });

    return list;
  }, [submittedPlans, reportsData, projects, labData, currentRole, notificationRefresh]);

  const handleNotificationClick = (notif) => {
    if (!notif) return;
    if (notif.type === 'plan') {
      setActiveSection('plan');
    } else if (notif.type === 'report') {
      setActiveSection('report');
      if (notif.data) {
        setReportActivity(notif.data);
        setShowReportModal(true);
      }
    } else if (notif.type === 'project') {
      setActiveSection('project');
    } else if (notif.type === 'activity') {
      if (currentRole === 'dosen') {
        setSelectedActivity(notif.data);
        setShowModal(true);
      }
      setActiveSection('dashboard');
    }
  };

  

  /* moved to pages/DashboardKK */
  const DashboardKK = () => (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white p-10 rounded-3xl shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-2xl backdrop-blur-sm">
              <BarChart3 size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-bold">Dashboard KK</h2>
              <p className="text-green-100 text-lg">Monitoring & Evaluasi Kinerja Laboratorium</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="text-sm opacity-90 mb-2 font-medium">Jumlah Laboratorium</div>
            <div className="text-5xl font-bold">{stats.totalUKM}</div>
          </div>
        </div>
        <div className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="text-sm opacity-90 mb-2 font-medium">Jumlah Kegiatan</div>
            <div className="text-5xl font-bold">{stats.totalKegiatan}</div>
          </div>
        </div>
        <div className="group relative overflow-hidden bg-gradient-to-br from-gray-500 to-gray-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="text-sm opacity-90 mb-2 font-medium">Belum Terlaksana</div>
            <div className="text-5xl font-bold">{stats.belumTerlaksana}</div>
          </div>
        </div>
        <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="text-sm opacity-90 mb-2 font-medium">Terlaksana</div>
            <div className="text-5xl font-bold">{stats.terlaksana}</div>
          </div>
        </div>
        <div className="group relative overflow-hidden bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="text-sm opacity-90 mb-2 font-medium">LPJ</div>
            <div className="text-5xl font-bold">{stats.lpj}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-xl text-white">
              <TrendingUp size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Nilai Performansi</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-md transition-shadow">
              <div>
                <span className="text-sm text-gray-600 block mb-1">Lab EISD</span>
                <span className="font-bold text-gray-800 text-lg">Enterprise intelligence Systems and Development</span>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">85.5</div>
                <div className="text-xs text-emerald-600 font-medium">Excellent</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-xl text-white">
              <Award size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Jumlah Kegiatan</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-md transition-shadow">
              <div>
                <span className="text-sm text-gray-600 block mb-1">Lab EISD</span>
                <span className="font-bold text-gray-800 text-lg">Total Aktivitas</span>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{stats.totalKegiatan}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Activity className="text-emerald-600" size={28} />
          Detail Kegiatan Lab EISD
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
                  <th className="p-4 text-left font-semibold">Keterangan</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {labData.activities.map((activity, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors">
                    <td className="p-4 font-medium text-gray-700">{activity.no}</td>
                    <td className="p-4 text-sm text-gray-700">{activity.indicator}</td>
                    <td className="p-4 font-semibold text-emerald-600">{activity.jumlah}</td>
                    <td className="p-4 text-sm text-gray-600">{activity.tw}</td>
                    <td className="p-4 text-sm text-gray-600">{activity.ket}</td>
                    <td className="p-4">
                      <StatusPill status={activity.status} />
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => {
                          setSelectedActivity(activity);
                          setShowModal(true);
                        }}
                        className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
                      >
                        <Eye size={16} />
                        Detail
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
  );

  /* moved to pages/DashboardDosen */
  const DashboardDosen = () => (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white p-10 rounded-3xl shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-2xl backdrop-blur-sm">
              <PenTool size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-bold">Dashboard Dosen Pembina</h2>
              <p className="text-green-100 text-lg">Persetujuan & Monitoring Lab EISD</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-amber-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-5">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-5 rounded-2xl">
              <Clock className="text-white" size={36} />
            </div>
            <div>
              <div className="text-sm text-gray-600 font-medium mb-1">Menunggu Persetujuan</div>
              <div className="text-4xl font-bold text-gray-800">3</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-emerald-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-5">
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-5 rounded-2xl">
              <CheckCircle className="text-white" size={36} />
            </div>
            <div>
              <div className="text-sm text-gray-600 font-medium mb-1">Disetujui</div>
              <div className="text-4xl font-bold text-gray-800">8</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-5">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-5 rounded-2xl">
              <Activity className="text-white" size={36} />
            </div>
            <div>
              <div className="text-sm text-gray-600 font-medium mb-1">Sedang Berjalan</div>
              <div className="text-4xl font-bold text-gray-800">5</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <AlertCircle className="text-amber-600" size={28} />
          Dokumen Menunggu Persetujuan
        </h3>
        <div className="space-y-4">
          {labData.activities.filter(a => a.status === 'pending').map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 hover:shadow-lg transition-all">
              <div className="flex items-center gap-5">
                <div className="bg-amber-100 p-4 rounded-xl">
                  <FileText className="text-amber-600" size={28} />
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-lg mb-1">{activity.indicator}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="font-medium">Target:</span>
                    <span className="px-3 py-1 bg-white rounded-full text-emerald-600 font-semibold">{activity.jumlah}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-semibold">
                  <CheckCircle size={18} />
                  Setujui
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-semibold">
                  <XCircle size={18} />
                  Tolak
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <CheckCheck className="text-emerald-600" size={28} />
          Dokumen yang Disetujui
        </h3>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                  <th className="p-4 text-left font-semibold">Indikator</th>
                  <th className="p-4 text-left font-semibold">Target</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Tanggal Persetujuan</th>
                  <th className="p-4 text-center font-semibold">TTD Digital</th>
                </tr>
              </thead>
              <tbody>
                {labData.activities.filter(a => a.status === 'approved' || a.status === 'completed').map((activity, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors">
                    <td className="p-4 text-gray-700">{activity.indicator}</td>
                    <td className="p-4 font-semibold text-emerald-600">{activity.jumlah}</td>
                    <td className="p-4">
                      <span className="px-4 py-2 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 inline-flex items-center gap-2">
                        <CheckCircle size={14} />
                        Disetujui
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium">30 Sep 2025</td>
                    <td className="p-4 text-center">
                      <button className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors">
                        <PenTool size={16} />
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
    </div>
  );

  /* moved portions to pages/DashboardLab; keeping plan/report sections below */
  const DashboardLab = () => {
    const [formData, setFormData] = useState({
      indicator: '',
      target: '',
      timeline: '',
      keterangan: ''
    });
    const [showReportForm, setShowReportForm] = useState(false);
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

    

    const handleSubmitPlan = (e) => {
      e.preventDefault();
      alert('Rencana kegiatan berhasil diajukan! Menunggu persetujuan dosen pembina.');
      setFormData({ indicator: '', target: '', timeline: '', keterangan: '' });
    };

    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white p-10 rounded-3xl shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-2xl backdrop-blur-sm">
                <Users size={32} />
              </div>
              <div>
                <h2 className="text-4xl font-bold">Laboratorium EISD</h2>
                <p className="text-green-100 text-lg">Kelola Rencana & Laporan Kegiatan</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-sm text-gray-600 mb-2 font-medium">Total Kegiatan</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{stats.totalKegiatan}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-amber-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-sm text-gray-600 mb-2 font-medium">Menunggu Persetujuan</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">3</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-emerald-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-sm text-gray-600 mb-2 font-medium">Disetujui</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">8</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-purple-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-sm text-gray-600 mb-2 font-medium">Selesai</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">{stats.terlaksana}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-xl text-white">
              <Calendar size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Kalender Rencana per Triwulan</h3>
          </div>
          <TWCalendar monthToActivities={monthToActivities} monthNames={monthNames} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FileText className="text-emerald-600" size={28} />
            Daftar Kegiatan
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
                {labData.activities.slice(0, 5).map((activity, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors">
                      <td className="p-4 font-medium text-gray-700">{activity.no}</td>
                      <td className="p-4 text-sm text-gray-700">{activity.indicator}</td>
                      <td className="p-4 font-semibold text-emerald-600">{activity.jumlah}</td>
                      <td className="p-4 text-sm text-gray-600">{activity.tw}</td>
                      <td className="p-4">
                        <StatusPill status={activity.status} />
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => {
                            setReportActivity(activity);
                            setShowReportModal(true);
                          }}
                          className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
                        >
                          <Upload size={16} />
                          Lapor
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showReportForm && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-3xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-white border-opacity-20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <Upload className="text-emerald-600" size={28} />
                  Input Bukti Kegiatan
                </h3>
                <button 
                  onClick={() => {
                    setShowReportForm(false);
                    setReportDate('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                alert('Laporan kegiatan berhasil diajukan!');
                setShowReportForm(false);
                setReportDate('');
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Dokumentasi Kegiatan</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors">
                    <Upload className="mx-auto text-gray-400 mb-3" size={48} />
                    <input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      accept="image/*"
                      multiple
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-emerald-600 font-semibold hover:text-emerald-700">Upload foto</span>
                      <span className="text-gray-600"> atau drag and drop</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG, JPEG up to 10MB</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Deskripsi Pelaksanaan</label>
                  <textarea
                    rows="5"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="Jelaskan detail pelaksanaan kegiatan..."
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Tanggal Pelaksanaan</label>
                  <ModernDatePicker
                    value={reportDate}
                    onChange={setReportDate}
                    placeholder="Pilih tanggal pelaksanaan"
                    className="w-full"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-semibold"
                  >
                    Submit Laporan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReportForm(false);
                      setReportDate('');
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-300 transition-all font-semibold"
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

  // Scroll detection for hamburger button (only on mobile)
  useEffect(() => {
    const handleScroll = () => {
      // Only apply on mobile screens
      if (window.innerWidth >= 1024) {
        setShowHamburger(true);
        return;
      }

      const currentScrollY = window.scrollY;
      
      // Show hamburger when at top
      if (currentScrollY < 10) {
        setShowHamburger(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show button
        setShowHamburger(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down and past threshold - hide button
        setShowHamburger(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowHamburger(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [lastScrollY]);

  if (!authRole) {
    return <LoginScreen onLogin={handleLogin} users={dummyUsers} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="flex min-h-screen">
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          currentRole={currentRole} 
          onLogout={handleLogout}
          showHamburger={showHamburger}
        />
        <main className="flex-1 min-h-screen p-4 sm:p-6 lg:p-8">
          <div className="flex justify-end mb-4">
            <Notifications notifications={notifications} onSelect={handleNotificationClick} visible={showHamburger} />
          </div>
          {activeSection === 'dashboard' && (
            <>
              {currentRole === 'kk' && (
                <DashboardKKPage 
                  stats={stats}
                  labData={labData}
                  onOpenDetail={(activity) => { setSelectedActivity(activity); setShowModal(true); }}
                  submittedPlans={submittedPlans}
                  setSubmittedPlans={setSubmittedPlans}
                  onNotificationChange={handleNotificationChange}
                />
              )}
              {currentRole === 'dosen' && (
                <DashboardDosenPage 
                  labData={labData}
                  projects={projects}
                  setProjects={setProjects}
                  showProjectModal={showProjectModal}
                  setShowProjectModal={setShowProjectModal}
                  submittedPlans={submittedPlans}
                  setSubmittedPlans={setSubmittedPlans}
                  onNotificationChange={handleNotificationChange}
                />
              )}
              {currentRole === 'lab' && (
                <DashboardLabPage 
                  stats={stats} 
                  labData={labData} 
                  projects={projects}
                  setProjects={setProjects}
                  onOpenReport={(activity) => { setReportActivity(activity); setShowReportModal(true); }}
                />
              )}
            </>
          )}

          {activeSection === 'plan' && (
            <PlanPage 
              planGroups={planGroups} 
              planForm={planForm}
              setPlanForm={setPlanForm}
              currentRole={currentRole}
              submittedPlans={submittedPlans}
              setSubmittedPlans={setSubmittedPlans}
              onNotificationChange={handleNotificationChange}
              onSubmitAll={()=>{
                const hasAny = Object.values(planForm).some(v=> (v?.jumlah||'').trim() || (v?.tw||'').trim() || (v?.ket||'').trim());
                if(!hasAny){ alert('Isi minimal satu rencana terlebih dahulu.'); return; }
                
                // Use service to submit plan
                planService.submitPlan(planForm);
                setSubmittedPlans(planService.getSubmittedPlans());
                setPlanForm({});
                
                // Add notification
                notificationService.addNotification({
                  type: 'plan',
                  title: 'Rencana Diajukan',
                  message: 'Rencana kegiatan telah diajukan dan menunggu persetujuan dosen pembina.',
                  time: new Date().toLocaleString('id-ID')
                });
                handleNotificationChange();
                
                alert('Semua rencana berhasil diajukan! Menunggu persetujuan dosen pembina.');
              }}
            />
          )}

          {activeSection === 'report' && (
            <ReportPage 
              labData={labData}
              reportsData={reportsData}
              currentRole={currentRole}
              onOpenReport={(activity)=>{ setReportActivity(activity); setShowReportModal(true); }}
              onReportsUpdate={(updatedReports) => {
                setReportsData(updatedReports);
              }}
              onNotificationChange={handleNotificationChange}
            />
          )}

          {activeSection === 'tracking' && (
            <TrackingPage reportsData={reportsData} />
          )}

          {activeSection === 'project' && (
            <ProjectPage 
              currentRole={currentRole}
              projects={projects}
              setProjects={(updatedProjects) => {
                setProjects(updatedProjects);
                // Also update service if needed
                if (Array.isArray(updatedProjects)) {
                  // Data already updated via service calls in ProjectPage
                  setProjects(projectService.getProjects());
                }
              }}
              showProjectModal={showProjectModal}
              setShowProjectModal={setShowProjectModal}
            />
          )}

          {activeSection === 'anggota' && currentRole === 'lab' && (
            <DivisiPage />
          )}
        </main>
      </div>

      <ActivityDetailModal open={showModal} activity={selectedActivity} onClose={() => setShowModal(false)} />

      <ReportModal 
        open={showReportModal} 
        activity={reportActivity} 
        onClose={() => setShowReportModal(false)} 
        onSubmit={(e, reportData) => {
          e.preventDefault();
          // Use reportService to create report
          const newReport = reportService.createReport({
            activityId: reportActivity?.id || reportActivity?.no,
            title: reportData.title || `Laporan ${reportActivity?.indicator}`,
            date: reportData.date || new Date().toISOString().split('T')[0],
            description: reportData.description || '',
            files: reportData.files || []
          });
          setReportsData(reportService.getReports());
          
          // Add notification
          notificationService.addNotification({
            type: 'report',
            title: 'Laporan Diajukan',
            message: `Laporan "${newReport.title}" telah diajukan dan menunggu persetujuan.`,
            time: new Date().toLocaleString('id-ID'),
            data: newReport
          });
          handleNotificationChange();
          
          alert('Laporan kegiatan berhasil diajukan!');
          setShowReportModal(false);
          setReportActivity(null);
        }}
      />
      {showPlanForm && planActivity && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-3xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-white border-opacity-20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Edit className="text-emerald-600" size={28} />
                Isi Rencana Kegiatan
              </h3>
              <button
                onClick={() => setShowPlanForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Rencana kegiatan berhasil diajukan! Menunggu persetujuan dosen pembina.');
                setShowPlanForm(false);
                setPlanActivity(null);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Indikator</label>
                  <input
                    type="text"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700"
                    defaultValue={planActivity.indicator}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Strategi</label>
                  <input
                    type="text"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700"
                    defaultValue={planActivity.strategi}
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Target</label>
                  <input
                    type="text"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="Masukkan target"
                    defaultValue={planActivity.jumlah}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Timeline</label>
                  <input
                    type="text"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="Contoh: TW1, TW2"
                    defaultValue={planActivity.tw}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Keterangan</label>
                <textarea
                  rows="5"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="Tambahkan keterangan (opsional)"
                  defaultValue={planActivity.ket}
                ></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  Ajukan Rencana
                </button>
                <button
                  type="button"
                  onClick={() => setShowPlanForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-300 transition-all font-semibold"
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

export default LabManagementSystem;