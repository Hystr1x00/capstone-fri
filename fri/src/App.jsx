import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, Edit, FileText, PenTool, Calendar, Users, Award, TrendingUp, BarChart3, Activity, Clock, CheckCheck, AlertCircle, Upload, X, LayoutDashboard, UploadCloud, LineChart } from 'lucide-react';
import Sidebar from './components/Sidebar';
import LoginScreen from './components/LoginScreen';
import StatusPill from './components/StatusPill';
import ActivityDetailModal from './components/ActivityDetailModal';
import ReportModal from './components/ReportModal';
import DashboardKKPage from './pages/DashboardKK';
import DashboardDosenPage from './pages/DashboardDosen';
import DashboardLabPage from './pages/DashboardLab';
import PlanPage from './pages/PlanPage';
import ReportPage from './pages/ReportPage';
import TrackingPage from './pages/TrackingPage';

const LabManagementSystem = () => {
  const [authRole, setAuthRole] = useState(null);
  const [currentRole, setCurrentRole] = useState('kk');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planActivity, setPlanActivity] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportActivity, setReportActivity] = useState(null);
  const [planGroups] = useState([
    {
      main: 'Invest in people',
      sasaran: [
        {
          sasaranStrategis: 'Meningkatkan jumlah mahasiswa yang terlibat aktif di lab',
          items: [
            { no: 1, indikator: 'Rasio mahasiswa aktif di lab dibandingkan jumlah terdaftar' }
          ]
        },
        {
          sasaranStrategis: 'Meningkatkan kapasitas dan kualitas jumlah asisten praktikum',
          items: [
            { no: 2, indikator: 'Jumlah asisten' },
            { no: 3, indikator: 'Jumlah Pelatihan asisten praktikum' }
          ]
        },
        {
          sasaranStrategis: 'Pengembangan learning factory',
          items: [
            { no: 4, indikator: 'Jumlah Pelatihan untuk anggota dengan sertifikasi' }
          ]
        },
        {
          sasaranStrategis: 'Unity',
          items: [
            { no: 5, indikator: 'Jumlah kegiatan kebersamaan' },
            { no: 6, indikator: 'Jumlah prototipe yang siap diajukan HKI atau menjadi startup' }
          ]
        }
      ]
    },
    {
      main: 'Digital transformation',
      sasaran: [
        {
          sasaranStrategis: 'Menghasilkan inovasi berbasis SDGs untuk mendukung visi Universitas Telkom',
          items: [
            { no: 7, indikator: 'Jumlah bootcamp dan kaderisasi persiapan lomba' },
            { no: 8, indikator: 'Jumlah lomba yang diikuti' },
            { no: 9, indikator: 'Jumlah HKI yang dihasilkan (Hak Cipta, Desain Industri, Paten)' }
          ]
        }
      ]
    },
    {
      main: 'Expansion of geographical footprint',
      sasaran: [
        {
          sasaranStrategis: 'Melihat hasil-hasil dan kerjasama dengan industri',
          items: [
            { no: 10, indikator: 'Jumlah kunjungan industri' },
            { no: 11, indikator: 'Jumlah kerjasama dengan industri' }
          ]
        }
      ]
    },
    {
      main: 'Alignment across domain',
      sasaran: [
        {
          sasaranStrategis: 'Menghasilkan lulusan yang diakui dan dicari oleh masyarakat / industri / pemerintah',
          items: [
            { no: 12, indikator: 'Jumlah pelatihan untuk menambah kemampuan / skill bagi mahasiswa' },
            { no: 13, indikator: 'Jumlah webinar sharing dari alumni / praktisi industri / kuliah umum' }
          ]
        },
        {
          sasaranStrategis: 'Melakukan program kerjasama eksternal',
          items: [
            { no: 14, indikator: 'Jumlah kerjasama eksternal (non-industri) yang telah dilakukan' },
            { no: 15, indikator: 'Jumlah lab/infrastruktur yang terbangun dari kerjasama eksternal' },
            { no: 16, indikator: 'Jumlah start-up yang terinisiasi dari lab riset' }
          ]
        }
      ]
    },
    {
      main: 'Sustainable growth',
      sasaran: [
        {
          sasaranStrategis: 'Membangun kemandirian finansial',
          items: [
            { no: 17, indikator: 'Jumlah proyek yang dikerjakan atau mendapatkan dana dari luar' },
            { no: 18, indikator: 'Jumlah kegiatan fund rising' }
          ]
        },
        {
          sasaranStrategis: 'Meningkatkan dukungan kegiatan jumlah riset dan abdimas',
          items: [
            { no: 19, indikator: 'Jumlah kegiatan riset dan abdimas yang melibatkan mahasiswa lab' },
            { no: 20, indikator: 'Jumlah mahasiswa yang terlibat aktif dalam riset' },
            { no: 21, indikator: 'Jumlah mahasiswa yang terlibat aktif dalam abdimas' },
            { no: 22, indikator: 'Jumlah kerjasama infrastruktur laboratorium' }
          ]
        }
      ]
    },
    {
      main: 'Lain-lain',
      sasaran: [
        {
          sasaranStrategis: 'Kegiatan Lain-lain',
          items: [
            { no: 23, indikator: 'Kegiatan Lain-lain' }
          ]
        }
      ]
    }
  ]);
  const [planForm, setPlanForm] = useState({});

  const handleLogin = (role) => {
    setAuthRole(role);
    setCurrentRole(role);
  };

  const handleLogout = () => {
    setAuthRole(null);
    setSelectedActivity(null);
    setShowModal(false);
  };

  const labData = {
    main: 'Invest in people',
    activities: [
      {
        no: 1,
        strategi: 'Meningkatkan jumlah mahasiswa yang terlibat aktif di lab',
        indicator: 'Rasio mahasiswa aktif di lab dibandingkan jumlah terdaftar',
        jumlah: '20:39',
        tw: '',
        ket: '',
        status: 'pending'
      },
      {
        no: 2,
        strategi: 'Meningkatkan kapasitas dan kualitas jumlah asisten praktikum',
        indicator: 'Jumlah asisten',
        jumlah: '21/matkul',
        tw: '',
        ket: '',
        status: 'pending'
      },
      {
        no: 3,
        strategi: 'Meningkatkan kapasitas dan kualitas jumlah asisten praktikum',
        indicator: 'Jumlah Pelatihan asisten praktikum',
        jumlah: '4',
        tw: 'TW 1, TW 2',
        ket: 'Maret, April, Mei',
        status: 'approved'
      },
      {
        no: 4,
        strategi: 'Unity',
        indicator: 'Jumlah kegiatan kebersamaan',
        jumlah: '2',
        tw: 'TW2, TW4',
        ket: '',
        status: 'completed'
      },
      {
        no: 5,
        strategi: 'Unity',
        indicator: 'Jumlah prototipe yang siap diujikan HKI atau diujukan menjadi startup',
        jumlah: '2',
        tw: 'T3, TW4',
        ket: '',
        status: 'pending'
      }
    ]
  };

  const stats = {
    totalUKM: 1,
    totalKegiatan: 13,
    belumTerlaksana: 11,
    terlaksana: 2,
    lpj: 2
  };

  const dummyUsers = [
    { username: 'kk1', password: '123456', role: 'kk', name: 'Ketua KK' },
    { username: 'dosen1', password: '123456', role: 'dosen', name: 'Dosen Pembina' },
    { username: 'lab1', password: '123456', role: 'lab', name: 'Laboratorium EISD' }
  ];

  const reportsData = [
    {
      id: 1,
      title: 'Pelatihan Asisten Praktikum TW1',
      date: '2025-03-15',
      description: 'Sesi pelatihan kompetensi dasar asisten praktikum.',
      status: 'pending',
      files: [
        { type: 'image', url: 'https://via.placeholder.com/600x350.png?text=Dokumentasi+1' },
        { type: 'pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
      ]
    },
    {
      id: 2,
      title: 'Kegiatan Unity TW2',
      date: '2025-06-10',
      description: 'Kegiatan kebersamaan laboratorium.',
      status: 'approved',
      files: [
        { type: 'image', url: 'https://via.placeholder.com/600x350.png?text=Dokumentasi+2' }
      ]
    }
  ];

  

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
                <span className="font-bold text-gray-800 text-lg">Enterprise Information Systems & Design</span>
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
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <Upload className="text-emerald-600" size={28} />
                  Input Bukti Kegiatan
                </h3>
                <button 
                  onClick={() => setShowReportForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                alert('Laporan kegiatan berhasil diajukan!');
                setShowReportForm(false);
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
                  <input
                    type="date"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    required
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
                    onClick={() => setShowReportForm(false)}
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

  if (!authRole) {
    return <LoginScreen onLogin={handleLogin} users={dummyUsers} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="flex">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} currentRole={currentRole} onLogout={handleLogout} />
        <main className="flex-1 min-h-screen p-8">
          {activeSection === 'dashboard' && (
            <>
              {currentRole === 'kk' && (
                <DashboardKKPage 
                  stats={stats} 
                  labData={labData} 
                  onOpenDetail={(activity) => { setSelectedActivity(activity); setShowModal(true); }}
                />
              )}
              {currentRole === 'dosen' && (
                <DashboardDosenPage labData={labData} />
              )}
              {currentRole === 'lab' && (
                <DashboardLabPage 
                  stats={stats} 
                  labData={labData} 
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
              onSubmitAll={()=>{
                const hasAny = Object.values(planForm).some(v=> (v?.jumlah||'').trim() || (v?.tw||'').trim() || (v?.ket||'').trim());
                if(!hasAny){ alert('Isi minimal satu rencana terlebih dahulu.'); return; }
                alert('Semua rencana berhasil diajukan! Menunggu persetujuan.');
              }}
            />
          )}

          {activeSection === 'report' && (
            <ReportPage 
              labData={labData}
              reportsData={reportsData}
              currentRole={currentRole}
              onOpenReport={(activity)=>{ setReportActivity(activity); setShowReportModal(true); }}
            />
          )}

          {activeSection === 'tracking' && (
            <TrackingPage reportsData={reportsData} />
          )}
        </main>
      </div>

      <ActivityDetailModal open={showModal} activity={selectedActivity} onClose={() => setShowModal(false)} />

      <ReportModal 
        open={showReportModal} 
        activity={reportActivity} 
        onClose={() => setShowReportModal(false)} 
        onSubmit={(e) => {
          e.preventDefault();
          alert('Laporan kegiatan berhasil diajukan!');
          setShowReportModal(false);
          setReportActivity(null);
        }}
      />
      {showPlanForm && planActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
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