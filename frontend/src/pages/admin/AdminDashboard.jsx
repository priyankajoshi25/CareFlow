import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { appointmentService } from '../../services/appointmentService';
import {
  Users,
  Calendar,
  Stethoscope,
  Briefcase,
  FileText,
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboardStats();
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admin stats.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusChange = async (appointmentId, newStatus) => {
    try {
      setUpdatingId(appointmentId);
      await appointmentService.updateAppointment(appointmentId, { status: newStatus });
      fetchStats();
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = data?.stats || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Executive Console</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Admin Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time platform activity metrics, user appointments, and clinical review status.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Statistics
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Users</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats.totalUsers || 0}</p>
          <Link to="/admin/users" className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 block pt-1">
            Manage users →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Appointments</span>
            <Calendar className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats.totalAppointments || 0}</p>
          <Link to="/admin/appointments" className="text-[11px] font-semibold text-cyan-600 hover:text-cyan-700 block pt-1">
            Review all →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Doctors</span>
            <Stethoscope className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats.totalDoctors || 0}</p>
          <Link to="/admin/doctors" className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 block pt-1">
            Manage doctors →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Services</span>
            <Briefcase className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats.totalServices || 0}</p>
          <Link to="/admin/services" className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 block pt-1">
            Manage services →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Reports</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats.totalReports || 0}</p>
          <Link to="/admin/reports" className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 block pt-1">
            Review concerns →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Articles</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats.totalArticles || 0}</p>
          <Link to="/admin/articles" className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 block pt-1">
            Manage articles →
          </Link>
        </div>
      </div>

      {/* Appointment Status Breakdown */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Appointment Status Distribution</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Pending</p>
            <p className="text-2xl font-extrabold text-amber-900 mt-1">{stats.pendingAppointments || 0}</p>
          </div>
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-800">Confirmed</p>
            <p className="text-2xl font-extrabold text-teal-900 mt-1">{stats.confirmedAppointments || 0}</p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-800">Completed</p>
            <p className="text-2xl font-extrabold text-blue-900 mt-1">{stats.completedAppointments || 0}</p>
          </div>
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-800">Cancelled</p>
            <p className="text-2xl font-extrabold text-rose-900 mt-1">{stats.cancelledAppointments || 0}</p>
          </div>
        </div>
      </div>

      {/* Two-Column Management Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Appointments</h2>
            <Link to="/admin/appointments" className="text-xs font-bold text-teal-600 hover:text-teal-700">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentAppointments?.map((app) => (
              <div
                key={app._id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900 truncate">{app.patientName}</p>
                    <span className="text-[10px] text-slate-400">with</span>
                    <p className="text-xs font-semibold text-teal-700 truncate">{app.doctor?.name}</p>
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(app.appointmentDate).toLocaleDateString()} at {app.timeSlot}
                  </p>
                </div>

                <select
                  value={app.status}
                  disabled={updatingId === app._id}
                  onChange={(e) => handleQuickStatusChange(app._id, e.target.value)}
                  className="form-input text-xs py-1.5 px-2.5 w-auto"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Health Problem Reports */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Health Problem Concerns</h2>
            <Link to="/admin/reports" className="text-xs font-bold text-teal-600 hover:text-teal-700">
              Review Reports
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentReports?.map((rep) => (
              <div
                key={rep._id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900 truncate">{rep.title}</p>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {rep.urgencyLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{rep.description}</p>
                  <p className="text-[11px] text-teal-700 font-medium">User: {rep.user?.name || 'Anonymous'}</p>
                </div>

                <Link
                  to="/admin/reports"
                  className="btn-secondary text-xs py-1.5 px-3 shrink-0"
                >
                  Respond
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
