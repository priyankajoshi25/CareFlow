import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { ProtectedRoute, AdminRoute } from './layouts/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Emergency from './pages/Emergency';

// Patient & User Protected Pages
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import Appointments from './pages/Appointments';
import ReportProblem from './pages/ReportProblem';
import HealthReports from './pages/HealthReports';
import Reminders from './pages/Reminders';
import Profile from './pages/Profile';

// Admin Protected Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminServices from './pages/admin/AdminServices';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminReports from './pages/admin/AdminReports';
import AdminArticles from './pages/admin/AdminArticles';

function App() {
  return (
    <Routes>
      {/* Public Pages with Standard Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:identifier" element={<ArticleDetail />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected Patient & User Portal with Dashboard Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<PatientDashboard />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/report-problem" element={<ReportProblem />} />
        <Route path="/reports" element={<HealthReports />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin Portal with Dashboard Layout */}
      <Route
        element={
          <AdminRoute>
            <DashboardLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/doctors" element={<AdminDoctors />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/articles" element={<AdminArticles />} />
      </Route>

      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
