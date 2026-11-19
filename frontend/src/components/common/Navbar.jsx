import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HeartPulse,
  Menu,
  X,
  PhoneCall,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Calendar,
  AlertCircle,
  FileText,
  Shield,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      {/* Emergency Notice Top Ribbon */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>24/7 Medical Emergency Hotline: Dial <strong>112</strong> immediately. Do not delay emergency care.</span>
          </div>
          <a
            href="tel:112"
            className="hidden sm:inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-0.5 rounded-full font-semibold text-[11px] transition"
          >
            <PhoneCall className="w-3 h-3" /> Call 112
          </a>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-700 via-cyan-700 to-blue-700 bg-clip-text text-transparent tracking-tight">
                CareFlow
              </span>
              <span className="block text-[10px] font-semibold text-slate-600 uppercase tracking-widest -mt-1">
                Healthcare Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                isActive('/') ? 'text-teal-700 bg-teal-50/80 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/services"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                isActive('/services') ? 'text-teal-700 bg-teal-50/80 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Services
            </Link>
            <Link
              to="/doctors"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                isActive('/doctors') ? 'text-teal-700 bg-teal-50/80 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Doctors
            </Link>
            <Link
              to="/articles"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                isActive('/articles') ? 'text-teal-700 bg-teal-50/80 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Health Awareness
            </Link>
            <Link
              to="/emergency"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                isActive('/emergency') ? 'text-rose-700 bg-rose-50 font-semibold' : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50/60'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-rose-500" />
              Emergency Help
            </Link>
          </div>

          {/* Desktop Action / Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition shadow-sm"
                >
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0d9488&color=fff`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border border-teal-200"
                  />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight max-w-[120px] truncate">{user?.name}</p>
                    <p className="text-[10px] text-teal-600 font-medium capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>

                    {isAdmin ? (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <Shield className="w-4 h-4 text-teal-600" />
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <LayoutDashboard className="w-4 h-4 text-teal-600" />
                        Patient Dashboard
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                    >
                      <UserIcon className="w-4 h-4 text-teal-600" />
                      My Profile
                    </Link>

                    {!isAdmin && (
                      <>
                        <Link
                          to="/appointments"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                        >
                          <Calendar className="w-4 h-4 text-teal-600" />
                          My Appointments
                        </Link>
                        <Link
                          to="/reports"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                        >
                          <FileText className="w-4 h-4 text-teal-600" />
                          Health Problem Reports
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/emergency"
              className="p-2 rounded-xl text-rose-600 bg-rose-50"
              title="Emergency Help"
            >
              <AlertCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-2 animate-in slide-in-from-top-4 duration-200">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Healthcare Services
            </Link>
            <Link
              to="/doctors"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Doctor Directory
            </Link>
            <Link
              to="/articles"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Health Awareness Articles
            </Link>
            <Link
              to="/emergency"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-medium text-rose-600 bg-rose-50"
            >
              <AlertCircle className="w-5 h-5" />
              Emergency Assistance (112)
            </Link>

            <div className="border-t border-slate-100 pt-3">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 flex items-center gap-3">
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0d9488&color=fff`}
                      alt={user?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  {isAdmin ? (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-teal-700 bg-teal-50"
                    >
                      <Shield className="w-4 h-4" /> Admin Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-teal-700 bg-teal-50"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Patient Dashboard
                      </Link>
                      <Link
                        to="/appointments"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700"
                      >
                        <Calendar className="w-4 h-4" /> My Appointments
                      </Link>
                      <Link
                        to="/reports"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700"
                      >
                        <FileText className="w-4 h-4" /> Health Reports
                      </Link>
                    </>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700"
                  >
                    <UserIcon className="w-4 h-4" /> Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2 px-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-secondary text-center text-sm py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary text-center text-sm py-2"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
