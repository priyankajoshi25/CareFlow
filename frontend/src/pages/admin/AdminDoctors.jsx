import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import {
  Stethoscope,
  Plus,
  Edit2,
  Trash2,
  Search,
  Star,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw
} from 'lucide-react';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    experience: 5,
    qualification: '',
    hospital: '',
    consultationFee: 500,
    bio: '',
    avatar: '',
    availableDays: 'Monday, Tuesday, Wednesday, Thursday, Friday',
    rating: 4.8
  });

  useEffect(() => {
    fetchDoctors();
  }, [search]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await doctorService.getDoctors({ search });
      setDoctors(res.doctors || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch doctors.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingDoctor(null);
    setFormData({
      name: '',
      specialization: '',
      experience: 5,
      qualification: '',
      hospital: 'CareFlow Health Network',
      consultationFee: 500,
      bio: '',
      avatar: '',
      availableDays: 'Monday, Tuesday, Wednesday, Thursday, Friday',
      rating: 4.8
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setEditingDoctor(doc);
    setFormData({
      name: doc.name,
      specialization: doc.specialization,
      experience: doc.experience,
      qualification: doc.qualification,
      hospital: doc.hospital,
      consultationFee: doc.consultationFee,
      bio: doc.bio,
      avatar: doc.avatar || '',
      availableDays: doc.availableDays?.join(', ') || 'Monday, Tuesday, Wednesday',
      rating: doc.rating || 4.8
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor profile?')) return;
    try {
      await doctorService.deleteDoctor(id);
      setSuccess('Doctor profile removed.');
      fetchDoctors();
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError('Could not delete doctor.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const daysArray = formData.availableDays
      ? formData.availableDays.split(',').map((d) => d.trim()).filter(Boolean)
      : ['Monday', 'Tuesday'];

    const payload = {
      ...formData,
      experience: Number(formData.experience),
      consultationFee: Number(formData.consultationFee),
      availableDays: daysArray,
      isSample: true
    };

    try {
      if (editingDoctor) {
        await doctorService.updateDoctor(editingDoctor._id, payload);
        setSuccess('Doctor profile updated.');
      } else {
        await doctorService.createDoctor(payload);
        setSuccess('Doctor profile created successfully.');
      }
      setModalOpen(false);
      fetchDoctors();
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Manage Doctors</h1>
          <p className="text-slate-500 text-sm mt-1">
            Add, update, and manage doctor directory profiles, specializations, and schedules.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDoctors}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button
            onClick={handleOpenAdd}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Doctor
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search doctor by name, specialty, or hospital..."
          className="form-input pl-10"
        />
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-3 text-center py-16 text-slate-400">Loading doctor profiles...</p>
        ) : doctors.length === 0 ? (
          <p className="col-span-3 text-center py-16 text-slate-400">No doctors found.</p>
        ) : (
          doctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={doc.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'}
                    alt={doc.name}
                    className="w-14 h-14 rounded-xl object-cover border border-teal-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 truncate">{doc.name}</h3>
                    <p className="text-xs font-semibold text-teal-700 truncate">{doc.specialization}</p>
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{doc.rating || 4.8}</span>
                      <span className="text-slate-400 font-normal">({doc.experience} yrs exp)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">{doc.bio}</p>
                <p className="text-[11px] text-slate-400">
                  Fee: <strong className="text-slate-800">₹{doc.consultationFee}</strong> • {doc.hospital}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(doc)}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition"
                  title="Delete doctor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Doctor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor Profile'}
              </h2>
              <p className="text-xs text-slate-500">CareFlow sample provider directory.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Doctor Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  required
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="e.g. Cardiologist"
                    required
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Experience (Years) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Qualifications *
                  </label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="MBBS, MD"
                    required
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Consultation Fee (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Hospital Affiliation
                </label>
                <input
                  type="text"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  placeholder="CareFlow Hospital Network"
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Available Days (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.availableDays}
                  onChange={(e) => setFormData({ ...formData, availableDays: e.target.value })}
                  placeholder="Monday, Tuesday, Wednesday"
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Clinical Bio *
                </label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Doctor's background, areas of clinical focus, and philosophy..."
                  required
                  className="form-input"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5 font-bold shadow-sm"
                >
                  {editingDoctor ? 'Update Profile' : 'Save Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;
