import React from 'react';
import { Users, LayoutDashboard, Edit, UploadCloud, LineChart } from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection, currentRole, onLogout }) => (
  <aside className="w-80 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-200 shadow-sm">
    <div className="px-6 py-5 border-b">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-2.5 rounded-xl shadow">
          <Users className="text-white" size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Lab Management System</h1>
          <p className="text-xs text-gray-500 font-medium">Sistem Tracking Kinerja</p>
        </div>
      </div>
    </div>

    <div className="px-4 py-6 space-y-2">
      <button onClick={() => setActiveSection('dashboard')} className={`${activeSection==='dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-800 hover:bg-gray-100'} w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition` }>
        <LayoutDashboard size={18} />
        Dashboard
      </button>
      <button onClick={() => setActiveSection('plan')} className={`${activeSection==='plan' ? 'bg-indigo-600 text-white' : 'text-gray-800 hover:bg-gray-100'} w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition` }>
        <Edit size={18} />
        Plan
      </button>
      <button onClick={() => setActiveSection('report')} className={`${activeSection==='report' ? 'bg-indigo-600 text-white' : 'text-gray-800 hover:bg-gray-100'} w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition` }>
        <UploadCloud size={18} />
        Laporan
      </button>
      <button onClick={() => setActiveSection('tracking')} className={`${activeSection==='tracking' ? 'bg-indigo-600 text-white' : 'text-gray-800 hover:bg-gray-100'} w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition` }>
        <LineChart size={18} />
        Status Tracking
      </button>
    </div>

    <div className="mt-auto px-4 py-5 border-t flex items-center justify-between gap-3">
      <span className="px-3 py-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white inline-flex items-center text-sm font-semibold">
        Peran:<span className="font-bold">{currentRole.toUpperCase()}</span>
      </span>
      <button onClick={onLogout} className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold text-sm">
        Logout
      </button>
    </div>
  </aside>
);

export default Sidebar;


