import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse,
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  FileText,
  Clock,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  PhoneCall,
  Shield,
  Users,
  Stethoscope,
  Briefcase,
  AlertCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard' || path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const patientNavItems = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Appointments', path: '/appointments', icon: Calendar },
    { name: 'Book Appointment', path: '/book', icon: CalendarPlus },
    { name: 'Report Health Concern', path: '/report-problem', icon: AlertCircle },
    { name: 'Medicine Reminders', path: '/reminders', icon: Clock },
    { name: 'Doctor Directory', path: '/doctors', icon: Stethoscope },
    { name: 'Healthcare Services', path: '/services', icon: Briefcase },
    { name: 'Health Articles', path: '/articles', icon: BookOpen },
    { name: 'My Profile', path: '/profile', icon: User }
  ];

  const adminNavItems = [
    { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Manage Doctors', path: '/admin/doctors', icon: Stethoscope },
    { name: 'Healthcare Services', path: '/admin/services', icon: Briefcase },
    { name: 'All Appointments', path: '/admin/appointments', icon: Calendar },
    { name: 'Health Concern Reports', path: '/admin/reports', icon: FileText },
    { name: 'Manage Articles', path: '/admin/articles', icon: BookOpen },
    { name: 'My Profile', path: '/profile', icon: User }
  ];

  const navItems = isAdmin ? adminNavItems : patientNavItems;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent">
                CareFlow
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {isAdmin ? 'Admin Console' : 'Patient Portal'}
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card in Sidebar */}
        <div className="p-4 mx-4 my-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0d9488&color=fff`}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover border border-teal-200"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
              isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700'
            }`}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span className="flex-1">{item.name}</span>
                {active && <ChevronRight className="w-4 h-4 text-white/70" />}
              </Link>
            );
          })}
        </nav>

        {/* Emergency Call Box in Sidebar */}
        <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-1">
            <AlertCircle className="w-4 h-4 text-rose-600" /> Emergency Hotline
          </div>
          <p className="text-xs text-slate-600 mb-2">Immediate 24/7 medical crisis assistance in India.</p>
          <a
            href="tel:112"
            className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Call 112
          </a>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <HeartPulse className="w-4 h-4 text-slate-400" />
            <span>Return to Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">
                {isAdmin ? 'CareFlow Healthcare Administration' : `Welcome, ${user?.name || 'Patient'}`}
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                {isAdmin ? 'System-wide clinical management and oversight' : 'Manage your consultations, reminders, and health activities'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/emergency"
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition"
            >
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Emergency 112</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2 p-1.5 rounded-full border border-slate-200 hover:border-teal-400 bg-white transition"
              title="View Profile"
            >
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0d9488&color=fff`}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            </Link>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-4 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
