import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import {
  User,
  Mail,
  Phone,
  Heart,
  Calendar,
  MapPin,
  Lock,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  FileText
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();

  // Personal Info Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bloodGroup: user?.bloodGroup || '',
    gender: user?.gender || 'unspecified',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    emergencyName: user?.emergencyContact?.name || '',
    emergencyPhone: user?.emergencyContact?.phone || '',
    emergencyRel: user?.emergencyContact?.relationship || '',
    medicalHistory: user?.medicalHistory || ''
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileErr('');

    try {
      setSavingProfile(true);
      const res = await authService.updateProfile({
        name: profileData.name,
        phone: profileData.phone,
        bloodGroup: profileData.bloodGroup,
        gender: profileData.gender,
        dateOfBirth: profileData.dateOfBirth || undefined,
        address: {
          street: profileData.street,
          city: profileData.city,
          state: profileData.state,
          postalCode: profileData.postalCode
        },
        emergencyContact: {
          name: profileData.emergencyName,
          phone: profileData.emergencyPhone,
          relationship: profileData.emergencyRel
        },
        medicalHistory: profileData.medicalHistory
      });

      updateUser(res.user);
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      setProfileErr(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setUploadingAvatar(true);
      const res = await authService.uploadAvatar(formData);
      updateUser(res.user);
      setProfileMsg('Profile picture updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      setProfileErr(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordErr('');

    if (passwordData.newPassword.length < 6) {
      setPasswordErr('New password must be at least 6 characters.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordErr('New passwords do not match.');
      return;
    }

    try {
      setSavingPassword(true);
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordMsg('Password changed successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setTimeout(() => setPasswordMsg(''), 3000);
    } catch (err) {
      setPasswordErr(err.response?.data?.message || 'Could not change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0d9488&color=fff`}
            alt={user?.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-teal-100 shadow-md"
          />
          <label className="absolute inset-0 flex items-center justify-center bg-slate-900/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition">
            <Upload className="w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="sr-only"
              disabled={uploadingAvatar}
            />
          </label>
        </div>

        <div className="text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
            <span className="badge-status bg-teal-100 text-teal-800 uppercase tracking-wider text-[10px]">
              {user?.role}
            </span>
          </div>
          <p className="text-xs text-slate-500">{user?.email}</p>
          <p className="text-xs text-slate-400">
            Registered on {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {profileMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{profileMsg}</span>
        </div>
      )}

      {profileErr && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{profileErr}</span>
        </div>
      )}

      {/* Personal & Medical Info Form */}
      <form onSubmit={handleProfileSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-teal-600" /> Personal & Medical Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
              placeholder="+91 98765 43210"
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Blood Group
            </label>
            <select
              name="bloodGroup"
              value={profileData.bloodGroup}
              onChange={handleProfileChange}
              className="form-input"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={profileData.gender}
              onChange={handleProfileChange}
              className="form-input"
            >
              <option value="unspecified">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={profileData.dateOfBirth}
              onChange={handleProfileChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              City / State
            </label>
            <input
              type="text"
              name="city"
              value={profileData.city}
              onChange={handleProfileChange}
              placeholder="e.g. Mumbai, Maharashtra"
              className="form-input"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            Emergency Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Contact Name</label>
              <input
                type="text"
                name="emergencyName"
                value={profileData.emergencyName}
                onChange={handleProfileChange}
                placeholder="Next of Kin Name"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Contact Phone</label>
              <input
                type="tel"
                name="emergencyPhone"
                value={profileData.emergencyPhone}
                onChange={handleProfileChange}
                placeholder="+91 98765 00000"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Relationship</label>
              <input
                type="text"
                name="emergencyRel"
                value={profileData.emergencyRel}
                onChange={handleProfileChange}
                placeholder="e.g. Spouse / Parent"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Known Medical History & Allergies
          </label>
          <textarea
            name="medicalHistory"
            rows="3"
            value={profileData.medicalHistory}
            onChange={handleProfileChange}
            placeholder="e.g. Asthma, Penicillin allergy, Hypertension..."
            className="form-input"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingProfile}
            className="btn-primary text-xs py-2 px-6 font-bold shadow-sm"
          >
            {savingProfile ? 'Saving Details...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>

      {/* Security & Password Form */}
      <form onSubmit={handlePasswordSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-teal-600" /> Account Security & Password
        </h2>

        {passwordMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{passwordMsg}</span>
          </div>
        )}

        {passwordErr && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{passwordErr}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingPassword}
            className="btn-primary text-xs py-2 px-6 font-bold shadow-sm"
          >
            {savingPassword ? 'Updating Password...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
