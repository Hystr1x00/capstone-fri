import React, { useState } from 'react';

const LoginScreen = ({ onLogin, users }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white p-10 rounded-3xl shadow-2xl mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold">Lab Management System</h1>
            <p className="text-green-100 text-lg mt-2">Masuk untuk melanjutkan</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Masukkan username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Masukkan password"
                required
              />
            </div>
            {error && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">{error}</div>
            )}
            <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-semibold">
              Masuk
            </button>
            <div className="text-xs text-gray-500 text-center">Gunakan data dummy untuk testing</div>
            <div className="text-xs text-gray-500 text-center">kk1/123456, dosen1/123456, lab1/123456</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;


