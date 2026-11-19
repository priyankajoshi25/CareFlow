import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2, Shield, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res?.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from === '/login' ? '/dashboard' : from);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoPatient = () => {
    setEmail('patient@careflow.com');
    setPassword('patient123');
    setError('');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@careflow.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <HeartPulse className="w-6 h-6" />
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to CareFlow
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Access your patient dashboard, health records, and doctor consultations.
          </p>
        </div>

        {/* Demo Quick-Fill Credentials Card */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-teal-600" /> Quick Demo Accounts
          </div>
          <p className="text-xs text-slate-600">Click below to test without manual registration:</p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={fillDemoPatient}
              className="py-2 px-3 rounded-xl bg-white border border-teal-200 hover:border-teal-400 text-teal-800 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <User className="w-3.5 h-3.5 text-teal-600" /> Demo Patient
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="py-2 px-3 rounded-xl bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-800 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-600" /> Demo Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-5 bg-white p-8 rounded-3xl shadow-card border border-slate-100" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="form-input pl-10"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-teal-600 hover:text-teal-700 font-semibold">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="form-input pl-10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-teal-600 hover:text-teal-700">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
