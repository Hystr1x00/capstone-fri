import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

const ModernDatePicker = ({ value, onChange, placeholder = "Pilih tanggal", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const pickerRef = useRef(null);
  const inputRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
      setCurrentMonth(new Date(value));
    }
  }, [value]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const updatePosition = () => {
        if (!inputRef.current) return;
        
        const rect = inputRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const pickerHeight = 400; // Approximate height of date picker
        const pickerWidth = window.innerWidth < 640 ? window.innerWidth - 32 : 350;
        
        let top = rect.bottom + 8;
        let left = rect.left;
        
        // If picker would go below viewport, show above instead
        if (top + pickerHeight > viewportHeight - 16) {
          top = rect.top - pickerHeight - 8;
          // If still doesn't fit, center it vertically
          if (top < 16) {
            top = Math.max(16, (viewportHeight - pickerHeight) / 2);
          }
        }
        
        // If picker would go off right edge, align to right
        if (left + pickerWidth > viewportWidth - 16) {
          left = viewportWidth - pickerWidth - 16;
        }
        
        // If picker would go off left edge, align to left
        if (left < 16) {
          left = 16;
        }
        
        setPosition({ top, left });
      };
      
      updatePosition();
      
      // Update position on resize
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isOpen]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add previous month's days
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthDays - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonthDays - i)
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(year, month, day);
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate: fullDate
      });
    }

    // Add next month's days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, day)
      });
    }

    return days;
  };

  const handleDateSelect = (day) => {
    if (!day.isCurrentMonth) {
      setCurrentMonth(new Date(day.fullDate.getFullYear(), day.fullDate.getMonth(), 1));
      return;
    }

    const selected = day.fullDate;
    setSelectedDate(selected);
    const formattedDate = selected.toISOString().split('T')[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
    const formattedDate = today.toISOString().split('T')[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedDate(null);
    onChange('');
    setIsOpen(false);
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <>
      <div ref={inputRef} className={`relative ${className}`}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all text-sm sm:text-base cursor-pointer bg-white hover:border-emerald-300 flex items-center justify-between"
        >
          <span className={value ? 'text-gray-800' : 'text-gray-400'}>
            {value ? formatDisplayDate(value) : placeholder}
          </span>
          <Calendar className="text-gray-400" size={20} />
        </div>
      </div>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <>
          {/* Backdrop - Transparent */}
          <div 
            className="fixed inset-0 z-[9998] bg-transparent"
            onClick={() => setIsOpen(false)}
          />
          {/* Date Picker Popup */}
          <div 
            ref={pickerRef}
            className="fixed z-[9999] bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-[calc(100vw-2rem)] sm:w-[350px]"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              maxHeight: '90vh',
            }}
          >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <select
                value={currentMonth.getMonth()}
                onChange={(e) => setCurrentMonth(new Date(currentMonth.getFullYear(), parseInt(e.target.value), 1))}
                className="text-sm font-semibold text-gray-800 bg-transparent border-none outline-none cursor-pointer"
              >
                {months.map((month, idx) => (
                  <option key={idx} value={idx}>{month}</option>
                ))}
              </select>
              <select
                value={currentMonth.getFullYear()}
                onChange={(e) => setCurrentMonth(new Date(parseInt(e.target.value), currentMonth.getMonth(), 1))}
                className="text-sm font-semibold text-gray-800 bg-transparent border-none outline-none cursor-pointer"
              >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day, idx) => (
              <div
                key={idx}
                className="text-xs font-semibold text-gray-500 text-center py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((day, idx) => {
              const isTodayDate = isToday(day.fullDate);
              const isSelectedDate = isSelected(day.fullDate);
              
              return (
                <button
                  key={idx}
                  onClick={() => handleDateSelect(day)}
                  className={`
                    h-9 sm:h-10 text-sm rounded-lg transition-all
                    ${!day.isCurrentMonth 
                      ? 'text-gray-300 hover:bg-gray-50' 
                      : isSelectedDate
                        ? 'bg-emerald-500 text-white font-semibold hover:bg-emerald-600'
                        : isTodayDate
                          ? 'bg-emerald-100 text-emerald-700 font-semibold hover:bg-emerald-200'
                          : 'text-gray-700 hover:bg-emerald-50'
                    }
                  `}
                >
                  {day.date}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleClear}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Hapus
            </button>
            <button
              onClick={handleToday}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
            >
              Hari Ini
            </button>
          </div>
        </div>
        </>,
        document.body
      )}
    </>
  );
};

export default ModernDatePicker;

