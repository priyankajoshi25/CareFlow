import React, { useState, useEffect } from 'react';
import { healthcareService } from '../../services/healthcareService';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  PhoneCall
} from 'lucide-react';

const availableCategories = [
  'General Consultation',
  'Mental Wellness',
  'Emergency Assistance',
  "Women's Healthcare",
  'Child Healthcare',
  'Dental Care',
  'Diagnostic Services',
  'Preventive Healthcare'
];

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'General Consultation',
    shortDescription: '',
    fullDescription: '',
    features: 'Doctor Consultation, Digital Prescription',
    estimatedDuration: '30 mins',
    startingFee: 499,
    isEmergency: false
  });

  useEffect(() => {
    fetchServices();
  }, [categoryFilter, search]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = {};
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (search.trim()) params.search = search.trim();
      const res = await healthcareService.getServices(params);
      setServices(res.services || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      name: '',
      category: 'General Consultation',
      shortDescription: '',
      fullDescription: '',
      features: 'Doctor Consultation, Digital Prescription',
      estimatedDuration: '30 mins',
      startingFee: 499,
      isEmergency: false
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (svc) => {
    setEditingService(svc);
    setFormData({
      name: svc.name,
      category: svc.category,
      shortDescription: svc.shortDescription,
      fullDescription: svc.fullDescription,
      features: svc.features?.join(', ') || '',
      estimatedDuration: svc.estimatedDuration || '30 mins',
      startingFee: svc.startingFee || 0,
      isEmergency: !!svc.isEmergency
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this healthcare service?')) return;
    try {
      await healthcareService.deleteService(id);
      setSuccess('Healthcare service deleted.');
      fetchServices();
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError('Could not delete service.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const featuresArray = formData.features
      ? formData.features.split(',').map((f) => f.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      startingFee: Number(formData.startingFee),
      features: featuresArray
    };

    try {
      if (editingService) {
        await healthcareService.updateService(editingService._id, payload);
        setSuccess('Healthcare service updated successfully.');
      } else {
        await healthcareService.createService(payload);
        setSuccess('Healthcare service created successfully.');
      }
      setModalOpen(false);
      fetchServices();
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save service.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Healthcare Services</h1>
          <p className="text-slate-500 text-sm mt-1">
            Configure clinical service catalog, category definitions, and consultation fee schedules.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchServices}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button
            onClick={handleOpenAdd}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Service
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

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service name or description..."
            className="form-input pl-10"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="form-input sm:w-60"
        >
          <option value="All">All 8 Categories</option>
          {availableCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-3 text-center py-16 text-slate-400">Loading healthcare services...</p>
        ) : services.length === 0 ? (
          <p className="col-span-3 text-center py-16 text-slate-400">No services found.</p>
        ) : (
          services.map((svc) => (
            <div
              key={svc._id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="badge-status bg-teal-100 text-teal-800 text-[10px]">
                    {svc.category}
                  </span>
                  {svc.isEmergency && (
                    <span className="badge-status bg-rose-100 text-rose-800 text-[10px] flex items-center gap-1">
                      <PhoneCall className="w-3 h-3" /> Emergency
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base">{svc.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-3">{svc.shortDescription}</p>

                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span>Duration: <strong>{svc.estimatedDuration}</strong></span>
                  <span>Fee: <strong>{svc.startingFee === 0 ? 'Free Triage' : `₹${svc.startingFee}`}</strong></span>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(svc)}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(svc._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition"
                  title="Delete service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Service Modal */}
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
                {editingService ? 'Edit Healthcare Service' : 'Add New Healthcare Service'}
              </h2>
              <p className="text-xs text-slate-500">Service definitions for patient booking & directory.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Comprehensive General Consultation"
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-input"
                >
                  {availableCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                    placeholder="30 mins"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Starting Fee (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.startingFee}
                    onChange={(e) => setFormData({ ...formData, startingFee: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Short Summary *
                </label>
                <textarea
                  rows="2"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief summary shown on catalog cards..."
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Detailed Description *
                </label>
                <textarea
                  rows="3"
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Comprehensive procedural information..."
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Key Features (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Digital Prescription, Follow-up Consultation"
                  className="form-input"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isEmergency}
                    onChange={(e) => setFormData({ ...formData, isEmergency: e.target.checked })}
                    className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                  />
                  <span className="text-xs font-semibold text-rose-700">
                    Flag as Emergency Triage Service
                  </span>
                </label>
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
                  {editingService ? 'Update Service' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
