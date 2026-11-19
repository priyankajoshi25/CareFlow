import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentService } from '../services/appointmentService';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  XCircle,
  CheckCircle,
  AlertCircle,
  CalendarPlus,
  Phone,
  MapPin,
  RefreshCw
} from 'lucide-react';

const statusBadges = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  Confirmed: 'bg-teal-100 text-teal-800 border-teal-200',
  Completed: 'bg-blue-100 text-blue-800 border-blue-200',
  Cancelled: 'bg-rose-100 text-rose-800 border-rose-200'
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await appointmentService.getAppointments();
      setAppointments(res.appointments || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled appointment?')) {
      return;
    }

    try {
      setActionLoadingId(id);
      await appointmentService.cancelAppointment(id);
      setSuccess('Appointment cancelled successfully.');
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel appointment.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (filterStatus === 'All') return true;
    return app.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">My Appointments</h1>
          <p className="text-slate-500 text-sm mt-1">
            Track upcoming doctor visits, review past consultation records, and manage booking statuses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAppointments}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            title="Refresh appointments"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <Link to="/book" className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm">
            <CalendarPlus className="w-4 h-4" /> Book Appointment
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-sm flex items-start gap-2">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterStatus === status
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading appointments...</div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-base font-bold text-slate-700">No appointments found in this view.</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Schedule a consultation with our verified doctors to start tracking your appointments here.
          </p>
          <Link to="/book" className="btn-primary text-xs py-2 px-5 inline-flex items-center gap-1.5">
            <CalendarPlus className="w-4 h-4" /> Schedule New Appointment
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-card transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              {/* Doctor & Appointment Details */}
              <div className="flex items-start gap-4">
                <img
                  src={app.doctor?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'}
                  alt={app.doctor?.name}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-teal-200"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{app.doctor?.name || 'Physician'}</h3>
                    <span className={`border px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusBadges[app.status]}`}>
                      {app.status}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-teal-700">
                    {app.doctor?.specialization} • {app.doctor?.hospital}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      {new Date(app.appointmentDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {app.timeSlot}
                    </span>
                    <span className="font-bold text-slate-900">
                      Fee: ₹{app.doctor?.consultationFee || 500}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 pt-1">
                    <strong>Reason:</strong> {app.reasonForVisit}
                  </div>

                  {app.adminNotes && (
                    <div className="text-xs text-teal-800 bg-teal-50 border border-teal-100 p-2 rounded-xl mt-2">
                      <strong>Clinic Note:</strong> {app.adminNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                {app.status !== 'Cancelled' && app.status !== 'Completed' && (
                  <button
                    onClick={() => handleCancel(app._id)}
                    disabled={actionLoadingId === app._id}
                    className="btn-secondary text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 py-2 px-3 flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    {actionLoadingId === app._id ? 'Cancelling...' : 'Cancel'}
                  </button>
                )}
                {app.status === 'Completed' && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Completed Visit
                  </span>
                )}
                {app.status === 'Cancelled' && (
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Cancelled
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
