import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, X } from 'lucide-react';

const Notifications = ({ notifications = [], onSelect, visible = true }) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const popupRef = useRef(null);
  const [popupStyle, setPopupStyle] = useState({});
  const HAMB_POPUP_GAP = 10; // px vertical gap between hamburger and popup on mobile
  
  // When opening, compute popup position so its right edge aligns with the button's right edge
  useLayoutEffect(() => {
    if (!open || !btnRef.current || !popupRef.current) return;

    const btnRect = btnRef.current.getBoundingClientRect();
    // On small screens (mobile) try to align popup right edge with the hamburger button if present
    if (window.innerWidth < 1024) {
      const hamb = document.getElementById('mobile-hamburger-btn');
      if (hamb) {
        const hambRect = hamb.getBoundingClientRect();
        const rightFromViewport = window.innerWidth - hambRect.right;
        setPopupStyle({ top: `${hambRect.bottom + HAMB_POPUP_GAP}px`, right: `${rightFromViewport}px`, left: 'auto', maxWidth: `calc(100% - 32px)` });
        return;
      }

      // fallback: fixed offset from right, vertical gap relative to bell
      setPopupStyle({ top: `${btnRect.bottom + HAMB_POPUP_GAP}px`, right: `16px`, left: 'auto', maxWidth: `calc(100% - 32px)` });
      return;
    }

    // Desktop: align to bell button's right edge (use right positioning)
    const rightFromViewport = window.innerWidth - btnRect.right;
    setPopupStyle({ top: `${btnRect.bottom + 8}px`, right: `${rightFromViewport}px`, left: 'auto' });
  }, [open]);

  // Keep position updated on resize/scroll while open
  useEffect(() => {
    if (!open) return;
    const fn = () => {
      if (!btnRef.current || !popupRef.current) return;
      const btnRect = btnRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      if (window.innerWidth < 1024) {
        const hamb = document.getElementById('mobile-hamburger-btn');
        if (hamb) {
          const hambRect = hamb.getBoundingClientRect();
          const rightFromViewport = window.innerWidth - hambRect.right;
          setPopupStyle({ top: `${hambRect.bottom + HAMB_POPUP_GAP}px`, right: `${rightFromViewport}px`, left: 'auto', maxWidth: `calc(100% - 32px)` });
          return;
        }
        setPopupStyle({ top: `${btnRect.bottom + HAMB_POPUP_GAP}px`, right: `16px`, left: 'auto', maxWidth: `calc(100% - 32px)` });
      } else {
        const rightFromViewport = window.innerWidth - btnRect.right;
        setPopupStyle({ top: `${btnRect.bottom + 8}px`, right: `${rightFromViewport}px`, left: 'auto' });
      }
    };
    window.addEventListener('resize', fn);
    window.addEventListener('scroll', fn, { passive: true });
    return () => {
      window.removeEventListener('resize', fn);
      window.removeEventListener('scroll', fn);
    };
  }, [open]);

  // Close popup when clicking or touching outside of the popup or button
  useEffect(() => {
    if (!open) return;

    const handleOutside = (e) => {
      if (!popupRef.current || !btnRef.current) return;
      const target = e.target;
      if (popupRef.current.contains(target)) return;
      if (btnRef.current.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [open]);

  const unreadCount = notifications.length;

  return (
    <div className={`lg:relative fixed top-4 right-16 lg:top-auto lg:right-auto transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`} style={{ zIndex: 9999 }}>
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className="relative h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition min-h-[44px] min-w-[44px]"
        aria-label="Notifications"
      >
        <Bell size={20} className="text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1 py-0.5 text-[10px] font-semibold leading-none text-white bg-red-500 rounded-full min-w-[18px] min-h-[18px]">{unreadCount}</span>
        )}
      </button>

      {open && createPortal(
        <div ref={popupRef} className="fixed mt-0 w-80 lg:w-96 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden" style={{ zIndex: 10000, ...popupStyle }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="font-semibold">Notifikasi</div>
            <button onClick={() => setOpen(false)} className="p-1 rounded text-gray-500 hover:text-gray-700"><X size={16} /></button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="p-4 text-sm text-gray-500">Tidak ada notifikasi.</div>
            )}

            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => { setOpen(false); onSelect && onSelect(n); }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-start gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-800 text-sm">{n.title}</div>
                    <div className="text-xs text-gray-400">{n.time || ''}</div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{n.message}</div>
                </div>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Notifications;
