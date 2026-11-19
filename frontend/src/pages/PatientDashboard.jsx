import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/appointmentService';
import { reminderService } from '../services/reminderService';
import { reportService } from '../services/reportService';
import {
  Calendar,
  Clock,
  AlertCircle,
  FileText,
  Plus,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  Circle,
  ShieldCheck,
  Stethoscope,
  Activity,
  HeartPulse,
  User,
  Sparkles
} from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [appRes, remRes, repRes] = await Promise.all([
        appointmentService.getAppointments(),
        reminderService.getReminders(),
        reportService.getReports()
      ]);
      setAppointments(appRes.appointments || []);
      setReminders(remRes.reminders || []);
      setReports(repRes.reports || []);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleReminder = async (rem) => {
    try {
      const updated = !rem.isCompleted;
      await reminderService.updateReminder(rem._id, { isCompleted: updated });
      setReminders(reminders.map((r) => (r._id === rem._id ? { ...r, isCompleted: updated } : r)));
    } catch (err) {
      console.error(err);
    }
  };

  const upcomingAppointments = appointments
    .filter((a) => a.status === 'Confirmed' || a.status === 'Pending')
    .slice(0, 3);

  const pendingReminders = reminders.filter((r) => !r.isCompleted).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-cyan-700 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-200" /> Patient Wellness Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Patient'}!
          </h1>
          <p className="text-teal-100 text-xs sm:text-sm leading-relaxed">
            Your centralized health management cockpit. Review your consultation schedule, track pending reminders, and coordinate with doctors effortlessly.
          </p>
        </div>

        {/* Quick Emergency Action */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
          <Link
            to="/book"
            className="w-full sm:w-auto btn-primary bg-white text-slate-900 hover:bg-slate-100 text-xs py-3 px-5 font-bold shadow-md flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-teal-700" /> Book Consultation
          </Link>
          <a
            href="tel:112"
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
          >
            <PhoneCall className="w-4 h-4" /> Emergency 112
          </a>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/book"
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-card hover:-translate-y-0.5 transition flex flex-col items-center text-center space-y-2 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition">
            <Calendar className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-900">Book Appointment</p>
          <p className="text-[11px] text-slate-400">Schedule specialist</p>
        </Link>

        <Link
          to="/report-problem"
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-card hover:-translate-y-0.5 transition flex flex-col items-center text-center space-y-2 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-900">Report Health Concern</p>
          <p className="text-[11px] text-slate-400">Clinical triage review</p>
        </Link>

        <Link
          to="/reminders"
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-card hover:-translate-y-0.5 transition flex flex-col items-center text-center space-y-2 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-900">Medicine Reminders</p>
          <p className="text-[11px] text-slate-400">Track doses & times</p>
        </Link>

        <Link
          to="/doctors"
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-card hover:-translate-y-0.5 transition flex flex-col items-center text-center space-y-2 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
            <Stethoscope className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-900">Doctor Directory</p>
          <p className="text-[11px] text-slate-400">Find trusted doctors</p>
        </Link>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols wide): Upcoming Appointments & Recent Reports */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Appointments Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Upcoming Appointments</h2>
                <p className="text-xs text-slate-400">Your scheduled doctor consultations</p>
              </div>
              <Link to="/appointments" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading appointments...</p>
            ) : upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-600 font-medium">No upcoming consultations scheduled.</p>
                <Link to="/book" className="btn-primary text-xs py-1.5 px-4 shadow-sm inline-flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Book Now
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((app) => (
                  <div
                    key={app._id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 transition flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={app.doctor?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150'}
                        alt={app.doctor?.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-teal-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{app.doctor?.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            app.status === 'Confirmed' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs text-teal-700 font-medium">{app.doctor?.specialization}</p>
                        <p className="text-[11px] text-slate-400">
                          {new Date(app.appointmentDate).toLocaleDateString()} at {app.timeSlot}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/appointments"
                      className="btn-secondary text-xs py-1.5 px-3 whitespace-nowrap"
                    >
                      Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Health Concern Reports */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Health Problem Reports</h2>
                <p className="text-xs text-slate-400">Track triage reviews by our clinical advisors</p>
              </div>
              <Link to="/reports" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading reports...</p>
            ) : reports.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-600 font-medium">No health concerns reported.</p>
                <Link to="/report-problem" className="btn-secondary text-xs py-1.5 px-4 inline-flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Submit Concern
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.slice(0, 3).map((rep) => (
                  <Link
                    key={rep._id}
                    to="/reports"
                    className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 transition block space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition truncate max-w-sm">
                        {rep.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{rep.description}</p>
                    {rep.advisorFeedback && (
                      <p className="text-[11px] text-teal-800 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Advisor feedback posted
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col wide): Today's Reminders & Patient Profile Card */}
        <div className="space-y-8">
          {/* Medicine Reminders Due */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Health Reminders</h2>
                <p className="text-xs text-slate-400">Scheduled medications</p>
              </div>
              <Link to="/reminders" className="text-xs font-bold text-teal-600 hover:text-teal-700">
                Manage
              </Link>
            </div>

            {pendingReminders.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                All daily medications completed!
              </p>
            ) : (
              <div className="space-y-2.5">
                {pendingReminders.map((rem) => (
                  <div
                    key={rem._id}
                    onClick={() => handleToggleReminder(rem)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-teal-400 transition cursor-pointer flex items-center gap-3 bg-slate-50/60"
                  >
                    <Circle className="w-5 h-5 text-slate-300 hover:text-teal-600 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{rem.medicineName}</p>
                      <p className="text-[11px] text-teal-700">{rem.dosage} • {rem.reminderTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link
              to="/reminders"
              className="w-full btn-secondary text-xs py-2 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Reminder
            </Link>
          </div>

          {/* User Profile Summary Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0d9488&color=fff`}
                alt={user?.name}
                className="w-14 h-14 rounded-2xl object-cover border border-teal-200"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900 truncate">{user?.name}</h3>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-100 text-teal-800 uppercase">
                  {user?.role}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="font-semibold">{user?.phone || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Blood Group:</span>
                <span className="font-bold text-teal-700">{user?.bloodGroup || 'Not specified'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Emergency Contact:</span>
                <span className="font-semibold">{user?.emergencyContact?.phone || 'Not set'}</span>
              </div>
            </div>

            <Link
              to="/profile"
              className="w-full btn-secondary text-xs py-2 flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" /> Edit Profile Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
