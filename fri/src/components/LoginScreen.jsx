import React, { useState, useEffect, useMemo } from 'react';
import { Eye, EyeOff, Building2, Users, Book, GraduationCap, Lightbulb, Target, BarChart3, FileText, Calendar, CheckCircle, Laptop, Activity, Printer } from 'lucide-react';

const LoginScreen = ({ onLogin, users }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const rotatingTexts = [
    {
      title: "Kelola Laboratorium dengan Mudah",
      description: "Sistem manajemen laboratorium yang terintegrasi untuk monitoring dan evaluasi kinerja laboratorium secara real-time."
    },
    {
      title: "Tracking Kinerja & Aktivitas",
      description: "Pantau semua aktivitas, rencana kegiatan, dan laporan perkembangan laboratorium di satu tempat."
    },
    {
      title: "Kolaborasi yang Efektif",
      description: "Platform komunikasi yang memudahkan koordinasi antara Ketua KK, Dosen Pembina, dan Asisten Lab."
    },
    {
      title: "Laporan & Analisis Lengkap",
      description: "Generate laporan komprehensif dan analisis data untuk pengambilan keputusan yang lebih baik."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const found = users.find(u => u.username === username && u.password === password);
    if (!found) {
      setError('Username atau password salah.');
      return;
    }
    setError('');
    onLogin(found.role);
  };

  // Generate animated dots - hanya di area kosong, tidak overlap dengan form kiri dan content kanan
  const generateDots = (count, color, seed, side = 'left') => {
    let currentSeed = seed;
    const random = () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
    
    const dots = [];
    let attempts = 0;
    
    while (dots.length < count && attempts < count * 5) {
      attempts++;
      const left = random() * 100;
      const top = random() * 100;
      
      // Untuk sisi kiri: hindari area form (25% - 55% horizontal, 20% - 80% vertical)
      // Untuk sisi kanan: hindari area content (30% - 70% horizontal, 10% - 90% vertical)
      if (side === 'left') {
        if (left >= 25 && left <= 55 && top >= 20 && top <= 80) {
          continue; // Skip jika di area form
        }
      } else {
        if (left >= 30 && left <= 70 && top >= 10 && top <= 90) {
          continue; // Skip jika di area content/illustration
        }
      }
      
      dots.push({
        id: dots.length,
        size: random() * 16 + 12,
        left: left,
        top: top,
        delay: random() * 3,
        duration: random() * 3 + 4,
        color: color
      });
    }
    
    return dots;
  };

  // Use useMemo agar dots tidak regenerate setiap render
  const greenDotsLeft = useMemo(() => generateDots(10, 'green', 12345, 'left'), []);
  const orangeDotsLeft = useMemo(() => generateDots(6, 'orange', 67890, 'left'), []);
  const greenDotsRight = useMemo(() => generateDots(10, 'green', 54321, 'right'), []);
  const orangeDotsRight = useMemo(() => generateDots(6, 'orange', 98765, 'right'), []);

  return (
    <div className="min-h-screen flex">
      {/* Login Form - Full Width dengan Split Layout */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-6 sm:px-8 lg:px-16 py-12 relative overflow-hidden">
        {/* Animated Dots Background Kiri - Hanya di area kosong, tidak overlap dengan form */}
        {greenDotsLeft.map((dot) => (
          <div
            key={`green-left-${dot.id}`}
            className="absolute rounded-full bg-green-400 opacity-50 animate-float pointer-events-none"
            style={{
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              animationDelay: `${dot.delay}s`,
              animationDuration: `${dot.duration}s`,
              willChange: 'transform',
              zIndex: 1
            }}
          />
        ))}
        {orangeDotsLeft.map((dot) => (
          <div
            key={`orange-left-${dot.id}`}
            className="absolute rounded-full bg-orange-400 opacity-50 animate-float pointer-events-none"
            style={{
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              animationDelay: `${dot.delay}s`,
              animationDuration: `${dot.duration}s`,
              willChange: 'transform',
              zIndex: 1
            }}
          />
        ))}

        <div className="w-full max-w-md relative z-20">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
              <FileText className="text-white" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium leading-tight">Lab Management</p>
              <p className="text-xl font-bold text-green-600 leading-tight">System</p>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Login</h1>
          <p className="text-gray-500 mb-8">Silahkan input username dan password untuk masuk ke sistem</p>

          {/* Login Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-green-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                placeholder="barnabasghani@gmail.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-green-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-600">Ingat saya</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">Lupa Kata Sandi?</a>
            </div>

            <button 
              type="submit" 
              className="w-full bg-green-500 text-white py-3.5 rounded-lg hover:bg-green-600 transition-all font-semibold shadow-sm hover:shadow-md"
            >
              Login
            </button>

            <div className="text-center text-sm text-gray-600">
              Belum punya akun? <a href="#" className="text-green-600 font-semibold hover:underline">Register disini</a>
            </div>

            {/* Testing Info */}
            <div className="pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center mb-1">Gunakan data dummy untuk testing</div>
              <div className="text-xs text-gray-500 text-center">kk1/123456, dosen1/123456, lab1/123456</div>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 relative overflow-hidden">
        {/* Animated Dots Background Kanan - Hanya di area kosong, tidak overlap dengan content */}
        {greenDotsRight.map((dot) => (
          <div
            key={`green-right-${dot.id}`}
            className="absolute rounded-full bg-green-400 opacity-50 animate-float pointer-events-none"
            style={{
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              animationDelay: `${dot.delay}s`,
              animationDuration: `${dot.duration}s`,
              willChange: 'transform',
              zIndex: 1
            }}
          />
        ))}
        {orangeDotsRight.map((dot) => (
          <div
            key={`orange-right-${dot.id}`}
            className="absolute rounded-full bg-orange-400 opacity-50 animate-float pointer-events-none"
            style={{
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              animationDelay: `${dot.delay}s`,
              animationDuration: `${dot.duration}s`,
              willChange: 'transform',
              zIndex: 1
            }}
          />
        ))}

        <div className="w-full p-12 relative z-10 flex flex-col justify-center">
          {/* Illustration Area - Diperbaiki */}
          <div className="relative mb-10">
            {/* Main Dashboard/Monitor Illustration */}
            <div className="relative mx-auto w-full max-w-md">
              {/* Central Dashboard Card */}
              <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-2xl p-8">
                <div className="bg-white rounded-xl p-6 shadow-inner">
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="text-sm font-semibold text-gray-800">Dashboard</div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 rounded-lg p-3">
                      <BarChart3 className="text-green-600 mb-2" size={24} />
                      <div className="text-xs text-gray-600">Aktivitas</div>
                      <div className="text-lg font-bold text-green-600">156</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <Users className="text-blue-600 mb-2" size={24} />
                      <div className="text-xs text-gray-600">Anggota</div>
                      <div className="text-lg font-bold text-blue-600">89</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <CheckCircle className="text-purple-600 mb-2" size={24} />
                      <div className="text-xs text-gray-600">Selesai</div>
                      <div className="text-lg font-bold text-purple-600">94%</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <Activity className="text-orange-600 mb-2" size={24} />
                      <div className="text-xs text-gray-600">Progress</div>
                      <div className="text-lg font-bold text-orange-600">85%</div>
                    </div>
                  </div>

                  {/* Chart Bar */}
                  <div className="flex items-end gap-2 h-20">
                    {[40, 60, 45, 70, 55, 65, 50].map((height, idx) => (
                      <div
                        key={idx}
                        className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4 animate-bounce-slow">
                <FileText className="text-green-600" size={24} />
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                <Calendar className="text-blue-600" size={20} />
              </div>
              <div className="absolute -bottom-6 left-8 bg-white rounded-xl shadow-lg p-3 animate-bounce-slow" style={{ animationDelay: '1s' }}>
                <Target className="text-orange-600" size={20} />
              </div>
              <div className="absolute -bottom-4 -right-6 bg-white rounded-xl shadow-lg p-3 animate-bounce-slow" style={{ animationDelay: '1.5s' }}>
                <Lightbulb className="text-yellow-500" size={20} />
              </div>
            </div>
          </div>

          {/* Rotating Text - Hanya text yang berubah dengan fade smooth */}
          <div className="relative">
            <div className="relative min-h-[10rem]">
              {rotatingTexts.map((text, idx) => (
                <div
                  key={`text-${idx}`}
                  className={`absolute top-0 left-0 right-0 transition-opacity duration-1000 ease-in-out ${
                    idx === currentTextIndex 
                      ? 'opacity-100 z-10' 
                      : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {text.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {text.description}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Dots indicator - langsung di bawah kalimat running text */}
            <div className="flex gap-2 mt-4 relative z-20">
              {rotatingTexts.map((_, idx) => (
                <div
                  key={`dot-${idx}`}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    idx === currentTextIndex
                      ? 'w-8 bg-green-500'
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginScreen;


