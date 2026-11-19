import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { appointmentService } from '../../services/appointmentService';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Edit3,
  X
} from 'lucide-react';

const statusBadgeStyle = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  Confirmed: 'bg-teal-100 text-teal-800 border-teal-200',
  Completed: 'bg-blue-100 text-blue-800 border-blue-200',
  Cancelled: 'bg-rose-100 text-rose-800 border-rose-200'
};

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Edit Note Modal
  const [activeApp, setActiveApp] = useState(null);
  const [modalStatus, setModalStatus] = useState('Pending');
  const [modalAdminNotes, setModalAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      const res = await adminService.getAppointments(params);
      setAppointments(res.appointments || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch appointments.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (app) => {
    setActiveApp(app);
    setModalStatus(app.status);
    setModalAdminNotes(app.adminNotes || '');
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!activeApp) return;

    try {
      setSaving(true);
      await appointmentService.updateAppointment(activeApp._id, {
        status: modalStatus,
        adminNotes: modalAdminNotes
      });
      setSuccess('Appointment status and clinic notes updated.');
      setActiveApp(null);
      fetchAppointments();
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update appointment.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = appointments.filter((app) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      app.patientName?.toLowerCase().includes(term) ||
      app.doctor?.name?.toLowerCase().includes(term) ||
      app.doctor?.specialization?.toLowerCase().includes(term) ||
      app.reasonForVisit?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Manage Appointments</h1>
          <p className="text-slate-500 text-sm mt-1">
            Global schedule oversight, consultation triage, status progression, and clinical notes.
          </p>
        </div>
        <button
          onClick={fetchAppointments}
          className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
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

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient, doctor, or reason for visit..."
            className="form-input pl-10"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Patient</th>
                <th className="py-3.5 px-6">Doctor / Specialization</th>
                <th className="py-3.5 px-6">Schedule Date & Slot</th>
                <th className="py-3.5 px-6">Reason & Symptoms</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    Loading appointments...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No appointments match criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{app.patientName}</p>
                      <p className="text-[11px] text-slate-400">{app.patientPhone}</p>
                      <p className="text-[10px] text-slate-400">{app.patientEmail}</p>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-bold text-teal-800">{app.doctor?.name || 'Physician'}</p>
                      <p className="text-[11px] text-slate-500">{app.doctor?.specialization}</p>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-800">
                        {new Date(app.appointmentDate).toLocaleDateString()}
                      </p>
                      <p className="text-[11px] text-teal-700 font-medium">{app.timeSlot}</p>
                    </td>

                    <td className="py-4 px-6 max-w-xs">
                      <p className="font-medium text-slate-900 truncate">{app.reasonForVisit}</p>
                      {app.symptoms && (
                        <p className="text-[11px] text-slate-500 truncate">Symptoms: {app.symptoms}</p>
                      )}
                      {app.adminNotes && (
                        <span className="inline-block mt-1 text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded font-medium">
                          Note: {app.adminNotes}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span className={`border px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadgeStyle[app.status]}`}>
                        {app.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenEditModal(app)}
                        className="btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Status & Notes Modal */}
      {activeApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setActiveApp(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-slate-900">Manage Appointment</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeApp.patientName} with {activeApp.doctor?.name}
              </p>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Appointment Status *
                </label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  className="form-input"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Clinic / Administrative Notes
                </label>
                <textarea
                  rows="3"
                  value={modalAdminNotes}
                  onChange={(e) => setModalAdminNotes(e.target.value)}
                  placeholder="e.g. Confirmed with Dr. Sharma, patient advised 12-hr fasting for tests..."
                  className="form-input"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveApp(null)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary text-xs py-2 px-5 font-bold shadow-sm"
                >
                  {saving ? 'Updating...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
