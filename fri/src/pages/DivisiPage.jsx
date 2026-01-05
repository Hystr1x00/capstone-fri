import React, { useState, useRef, useEffect } from 'react';
import { Users, Building2, FolderPlus, Plus, X, UserPlus, Edit, Trash2, ChevronDown, Check } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import SuccessAlert from '../components/SuccessAlert';
import ConfirmAlert from '../components/ConfirmAlert';
import divisiService from '../services/divisiService';

const DivisiPage = () => {
  const [divisiData, setDivisiData] = useState(() => divisiService.getDivisi());

  const [showAddDivisiModal, setShowAddDivisiModal] = useState(false);
  const [showAddAnggotaModal, setShowAddAnggotaModal] = useState(false);
  const [selectedDivisi, setSelectedDivisi] = useState(null);
  const [newDivisiNama, setNewDivisiNama] = useState('');
  const [newAnggota, setNewAnggota] = useState({ nama: '', jenis: 'Anggota' });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showJenisDropdown, setShowJenisDropdown] = useState(false);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  const jenisAnggota = ['Ketua Lab', 'Wakil Ketua Lab', 'Sekben', 'Koordinator divisi', 'Anggota'];
  const dropdownRef = useRef(null);

  const headerRef = useScrollAnimation();
  const anggotaRef = useScrollAnimation({ threshold: 0.1 });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowJenisDropdown(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowJenisDropdown(false);
      }
    };

    if (showJenisDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showJenisDropdown]);

  const handleAddDivisi = (e) => {
    e.preventDefault();
    if (!newDivisiNama.trim()) {
      setAlertMessage('Nama divisi tidak boleh kosong!');
      setShowSuccessAlert(true);
      return;
    }
    divisiService.createDivisi(newDivisiNama);
    setDivisiData(divisiService.getDivisi());
    setNewDivisiNama('');
    setShowAddDivisiModal(false);
    setAlertMessage('Divisi berhasil ditambahkan!');
    setShowSuccessAlert(true);
  };

  const handleAddAnggota = (e) => {
    e.preventDefault();
    if (!newAnggota.nama.trim()) {
      setAlertMessage('Nama anggota tidak boleh kosong!');
      setShowSuccessAlert(true);
      return;
    }
    divisiService.addAnggota(selectedDivisi.id, newAnggota);
    setDivisiData(divisiService.getDivisi());
    setNewAnggota({ nama: '', jenis: 'Anggota' });
    setShowAddAnggotaModal(false);
    setSelectedDivisi(null);
    setShowJenisDropdown(false);
    setAlertMessage('Anggota berhasil ditambahkan!');
    setShowSuccessAlert(true);
  };

  const handleDeleteDivisi = (divisiId) => {
    setConfirmMessage('Apakah Anda yakin ingin menghapus divisi ini?');
    setConfirmAction(() => () => {
      divisiService.deleteDivisi(divisiId);
      setDivisiData(divisiService.getDivisi());
      setAlertMessage('Divisi berhasil dihapus!');
      setShowSuccessAlert(true);
      setShowConfirmAlert(false);
    });
    setShowConfirmAlert(true);
  };

  const handleDeleteAnggota = (divisiId, anggotaId) => {
    setConfirmMessage('Apakah Anda yakin ingin menghapus anggota ini?');
    setConfirmAction(() => () => {
      divisiService.deleteAnggota(divisiId, anggotaId);
      setDivisiData(divisiService.getDivisi());
      setAlertMessage('Anggota berhasil dihapus!');
      setShowSuccessAlert(true);
      setShowConfirmAlert(false);
    });
    setShowConfirmAlert(true);
  };

  const getJenisColor = (jenis) => {
    switch(jenis) {
      case 'Ketua Lab':
        return 'bg-purple-100 text-purple-700';
      case 'Wakil Ketua Lab':
        return 'bg-blue-100 text-blue-700';
      case 'Sekben':
        return 'bg-amber-100 text-amber-700';
      case 'Koordinator divisi':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <SuccessAlert
        message={alertMessage}
        isVisible={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
      />
      <ConfirmAlert
        message={confirmMessage}
        isVisible={showConfirmAlert}
        onConfirm={() => {
          if (confirmAction) {
            confirmAction();
          }
        }}
        onCancel={() => {
          setShowConfirmAlert(false);
          setConfirmAction(null);
        }}
      />
      <div className="space-y-4 sm:space-y-6">
        <div ref={headerRef} className="scroll-animate visible relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold break-words leading-tight">Anggota Laboratorium</h2>
                <p className="text-green-100 text-sm sm:text-base lg:text-lg mt-2">Kelola Divisi dan Anggota Lab EISD</p>
              </div>
              <button
                onClick={() => setShowAddDivisiModal(true)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-emerald-600 hover:bg-emerald-50 rounded-lg sm:rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-semibold text-sm sm:text-base shrink-0 border-2 border-white border-opacity-30"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Tambah Divisi</span>
                <span className="sm:hidden">Tambah</span>
              </button>
            </div>
          </div>
        </div>

        <div ref={anggotaRef} className="scroll-animate space-y-4 sm:space-y-6">
          {divisiData.map((divisi) => (
            <div key={divisi.id} className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 lg:p-8 border-2 border-gray-100 hover:border-emerald-200 hover:shadow-2xl transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5 mb-5 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-xl shadow-md">
                      <Building2 className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                      {divisi.nama}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm pl-14">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium border border-emerald-200">
                      <Users size={14} />
                      {divisi.anggota.length} anggota
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-medium border border-blue-200">
                      <FolderPlus size={14} />
                      {divisi.project} project
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setSelectedDivisi(divisi);
                      setShowAddAnggotaModal(true);
                    }}
                    className="flex-1 sm:flex-none px-4 sm:px-5 py-3 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm min-h-[44px]"
                  >
                    <UserPlus size={16} />
                    <span className="hidden sm:inline">Tambah Anggota</span>
                    <span className="sm:hidden">Tambah</span>
                  </button>
                  <button
                    onClick={() => handleDeleteDivisi(divisi.id)}
                    className="flex-1 sm:flex-none px-4 sm:px-5 py-3 sm:py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm min-h-[44px]"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Hapus</span>
                    <span className="sm:hidden">Hapus</span>
                  </button>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="block sm:hidden space-y-3">
                {divisi.anggota.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    Belum ada anggota di divisi ini
                  </div>
                ) : (
                  divisi.anggota.map((anggota) => (
                    <div key={anggota.id} className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 hover:border-emerald-300 hover:shadow-md transition-all flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 text-sm mb-2 break-words">{anggota.nama}</div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block border ${getJenisColor(anggota.jenis)}`}>
                          {anggota.jenis}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteAnggota(divisi.id, anggota.id)}
                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 ml-2 border border-red-200 hover:border-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-hidden rounded-xl border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                        <th className="px-4 py-3 text-left text-sm font-semibold">Nama</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Jenis</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {divisi.anggota.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-4 py-6 text-center text-gray-500 text-sm">
                            Belum ada anggota di divisi ini
                          </td>
                        </tr>
                      ) : (
                        divisi.anggota.map((anggota) => (
                          <tr key={anggota.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-800 text-sm">{anggota.nama}</td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getJenisColor(anggota.jenis)}`}>
                                {anggota.jenis}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleDeleteAnggota(divisi.id, anggota.id)}
                                className="text-red-500 hover:text-red-700 font-semibold inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm"
                              >
                                <Trash2 size={16} />
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}

          {divisiData.length === 0 && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-100 text-center">
              <Building2 className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-500 text-sm sm:text-base">Belum ada divisi. Tambahkan divisi pertama Anda!</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Tambah Divisi */}
      {showAddDivisiModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 max-w-md w-full mx-2 sm:mx-4 shadow-2xl border border-white border-opacity-20">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
                <Plus className="text-emerald-600" size={24} />
                Tambah Divisi
              </h3>
              <button
                onClick={() => {
                  setShowAddDivisiModal(false);
                  setNewDivisiNama('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleAddDivisi} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Nama Divisi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newDivisiNama}
                  onChange={(e) => setNewDivisiNama(e.target.value)}
                  className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm sm:text-base"
                  placeholder="Contoh: Divisi Backend Development"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
                >
                  Tambah Divisi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddDivisiModal(false);
                    setNewDivisiNama('');
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

      {/* Modal Tambah Anggota */}
      {showAddAnggotaModal && selectedDivisi && (
        <div 
          className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddAnggotaModal(false);
              setSelectedDivisi(null);
              setNewAnggota({ nama: '', jenis: 'Anggota' });
              setShowJenisDropdown(false);
            }
          }}
        >
          <div 
            className="bg-white bg-opacity-95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 max-w-md w-full mx-2 sm:mx-4 shadow-2xl border border-white border-opacity-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
                <UserPlus className="text-emerald-600" size={24} />
                Tambah Anggota
              </h3>
              <button
                onClick={() => {
                  setShowAddAnggotaModal(false);
                  setSelectedDivisi(null);
                  setNewAnggota({ nama: '', jenis: 'Anggota' });
                  setShowJenisDropdown(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg sm:rounded-xl border border-emerald-200">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Divisi:</div>
              <div className="font-semibold text-gray-800 text-sm sm:text-base break-words">{selectedDivisi.nama}</div>
            </div>
            <form onSubmit={handleAddAnggota} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Nama Anggota <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAnggota.nama}
                  onChange={(e) => setNewAnggota({ ...newAnggota, nama: e.target.value })}
                  className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm sm:text-base"
                  placeholder="Masukkan nama anggota"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Jenis Anggota <span className="text-red-500">*</span>
                </label>
                <div ref={dropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowJenisDropdown(!showJenisDropdown);
                    }}
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm sm:text-base bg-white hover:border-emerald-300 flex items-center justify-between text-left"
                  >
                    <span className={`${newAnggota.jenis ? 'text-gray-800' : 'text-gray-400'}`}>
                      {newAnggota.jenis || 'Pilih jenis anggota'}
                    </span>
                    <ChevronDown className={`text-gray-400 transition-transform ${showJenisDropdown ? 'rotate-180' : ''}`} size={20} />
                  </button>
                  
                  {showJenisDropdown && (
                    <div className="absolute z-[60] w-full mt-2 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                      {jenisAnggota.map((jenis) => (
                        <button
                          key={jenis}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setNewAnggota({ ...newAnggota, jenis });
                            setShowJenisDropdown(false);
                          }}
                          className={`w-full px-4 py-3 sm:py-3.5 text-left text-sm sm:text-base transition-all flex items-center justify-between ${
                            newAnggota.jenis === jenis
                              ? 'bg-emerald-50 text-emerald-700 font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span>{jenis}</span>
                          {newAnggota.jenis === jenis && (
                            <Check className="text-emerald-600" size={18} />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
                >
                  Tambah Anggota
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAnggotaModal(false);
                    setSelectedDivisi(null);
                    setNewAnggota({ nama: '', jenis: 'Anggota' });
                    setShowJenisDropdown(false);
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
    </>
  );
};

export default DivisiPage;
