import React, { useState, useEffect, useRef } from 'react';
import { Users, LayoutDashboard, Edit, UploadCloud, LineChart, FolderPlus, Menu, X, Building2 } from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection, currentRole, onLogout, showHamburger, onSwipeStart, onSwipeMove, onSwipeEnd }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  // Handle swipe gesture from left edge
  useEffect(() => {
    const handleTouchStart = (e) => {
      // Only trigger from left edge (first 20px) when sidebar is closed
      if (e.touches[0].clientX < 20 && !isMobileMenuOpen) {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        isSwiping.current = false;
      }
    };

    const handleTouchMove = (e) => {
      if (!touchStartX.current || isMobileMenuOpen) return;
      
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const deltaX = touchX - touchStartX.current;
      const deltaY = Math.abs(touchY - touchStartY.current);
      
      // Check if horizontal swipe (more horizontal than vertical)
      if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > deltaY && deltaX > 0) {
        isSwiping.current = true;
        e.preventDefault();
        const progress = Math.min(deltaX / 300, 1);
        if (sidebarRef.current) {
          sidebarRef.current.style.transform = `translateX(${-100 + progress * 100}%)`;
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (!touchStartX.current) return;
      
      const touchX = e.changedTouches[0].clientX;
      const deltaX = touchX - touchStartX.current;
      
      if (isSwiping.current && deltaX > 80) {
        setIsMobileMenuOpen(true);
      }
      
      // Reset transform
      if (sidebarRef.current) {
        sidebarRef.current.style.transform = '';
      }
      
      touchStartX.current = 0;
      touchStartY.current = 0;
      isSwiping.current = false;
    };

    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Menu Button - Top Right */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        id="mobile-hamburger-btn"
        className={`lg:hidden fixed top-4 right-4 z-50 h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300 min-h-[44px] min-w-[44px] ${
          showHamburger ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {isMobileMenuOpen ? <X size={20} className="text-gray-700" /> : <Menu size={20} className="text-gray-700" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-transparent backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside 
        ref={sidebarRef}
        className={`fixed lg:sticky lg:top-0 w-72 sm:w-80 shrink-0 h-screen bg-white border-r border-gray-200 shadow-lg lg:shadow-sm z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
    <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 shrink-0">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-2.5 rounded-xl shadow">
          <Users className="text-white" size={22} />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Lab Management System</h1>
          <p className="text-xs text-gray-500 font-medium">Sistem Tracking Kinerja</p>
        </div>
      </div>
    </div>

    <div className="px-4 py-6 space-y-2 overflow-y-auto flex-1 min-h-0">
      <button 
        onClick={() => { setActiveSection('dashboard'); setIsMobileMenuOpen(false); }} 
        className={`${activeSection==='dashboard' ? 'bg-emerald-600 text-white' : 'text-gray-800 hover:bg-gray-100'} w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors min-h-[44px]` }
      >
        <LayoutDashboard size={18} />
        Dashboard
      </button>
      <button 
        onClick={() => { setActiveSection('plan'); setIsMobileMenuOpen(false); }} 
        className={`${activeSection==='plan' ? 'bg-emerald-600 text-white' : 'text-gray-800 hover:bg-gray-100'} w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors min-h-[44px]` }
      >
        <Edit size={18} />
        Plan
      </button>
      <button 
        onClick={() => { setActiveSection('report'); setIsMobileMenuOpen(false); }} 
        className={`${activeSection==='report' ? 'bg-emerald-600 text-white' : 'text-gray-800 hover:bg-gray-100'} w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors min-h-[44px]` }
      >
        <UploadCloud size={18} />
        Laporan
      </button>
      <button 
        onClick={() => { setActiveSection('tracking'); setIsMobileMenuOpen(false); }} 
        className={`${activeSection==='tracking' ? 'bg-emerald-600 text-white' : 'text-gray-800 hover:bg-gray-100'} w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors min-h-[44px]` }
      >
        <LineChart size={18} />
        Status Tracking
      </button>
      <button 
        onClick={() => { setActiveSection('project'); setIsMobileMenuOpen(false); }} 
        className={`${activeSection==='project' ? 'bg-emerald-600 text-white' : 'text-gray-800 hover:bg-gray-100'} w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors min-h-[44px]` }
      >
        <FolderPlus size={18} />
        Project
      </button>
      {currentRole === 'lab' && (
        <button 
          onClick={() => { setActiveSection('anggota'); setIsMobileMenuOpen(false); }} 
          className={`${activeSection==='anggota' ? 'bg-emerald-600 text-white' : 'text-gray-800 hover:bg-gray-100'} w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors min-h-[44px]` }
        >
          <Users size={18} />
          Anggota
        </button>
      )}
    </div>

    <div className="mt-auto px-4 py-5 border-t border-gray-200 flex items-center justify-between gap-3 shrink-0">
      <span className="px-3 py-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white inline-flex items-center text-sm font-semibold">
        Peran:<span className="font-bold ml-1">{currentRole.toUpperCase()}</span>
      </span>
      <button onClick={onLogout} className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold text-sm transition-colors">
        Logout
      </button>
    </div>
  </aside>
    </>
  );
};

export default Sidebar;


