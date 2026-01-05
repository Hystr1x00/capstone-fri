import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building2, Calendar, Edit2, Save, X } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ProfilePage = ({ currentRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentRole === 'kk' ? 'Dr. Ketua KK' : currentRole === 'dosen' ? 'Dr. Dosen Pembina' : 'Ketua Lab EISD',
    email: currentRole === 'kk' ? 'kk@telkomuniversity.ac.id' : currentRole === 'dosen' ? 'dosen@telkomuniversity.ac.id' : 'lab@telkomuniversity.ac.id',
    phone: '+62 81234567890',
    address: 'Jl. Telekomunikasi. 1, Terusan Buahbatu, Bandung, Indonesia',
    department: 'S1 Sistem Informasi',
    university: 'Telkom University',
    joinDate: '1 Januari 2020',
    role: currentRole.toUpperCase()
  });

  const [editForm, setEditForm] = useState(profileData);

  const headerRef = useScrollAnimation();

  const handleSave = () => {
    setProfileData(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profileData);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div ref={headerRef} className="scroll-animate visible">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 text-2xl font-bold">{profileData.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
              <p className="text-sm text-gray-500">{profileData.role}</p>
            </div>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md flex items-center gap-2 font-medium text-sm"
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md flex items-center gap-2 font-medium text-sm"
              >
                <Save size={18} />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all flex items-center gap-2 font-medium text-sm"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="text-gray-400" />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
              ) : (
                <p className="px-4 py-2.5 bg-gray-50 rounded-lg text-sm text-gray-900">{profileData.email}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} className="text-gray-400" />
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
              ) : (
                <p className="px-4 py-2.5 bg-gray-50 rounded-lg text-sm text-gray-900">{profileData.phone}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="text-gray-400" />
                Address
              </label>
              {isEditing ? (
                <textarea
                  value={editForm.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm resize-none"
                />
              ) : (
                <p className="px-4 py-2.5 bg-gray-50 rounded-lg text-sm text-gray-900">{profileData.address}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Building2 size={16} className="text-gray-400" />
                Department
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
              ) : (
                <p className="px-4 py-2.5 bg-gray-50 rounded-lg text-sm text-gray-900">{profileData.department}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Building2 size={16} className="text-gray-400" />
                University
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.university}
                  onChange={(e) => handleChange('university', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
              ) : (
                <p className="px-4 py-2.5 bg-gray-50 rounded-lg text-sm text-gray-900">{profileData.university}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="text-gray-400" />
                Join Date
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.joinDate}
                  onChange={(e) => handleChange('joinDate', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
              ) : (
                <p className="px-4 py-2.5 bg-gray-50 rounded-lg text-sm text-gray-900">{profileData.joinDate}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="text-gray-400" />
                Role
              </label>
              <p className="px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold">{profileData.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

