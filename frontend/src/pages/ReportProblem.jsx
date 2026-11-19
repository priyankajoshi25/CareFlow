import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { reportService } from '../services/reportService';
import {
  AlertCircle,
  CheckCircle2,
  PhoneCall,
  Send,
  HelpCircle,
  ShieldAlert,
  FileText
} from 'lucide-react';

const categories = [
  'General Health',
  'Mental Wellness',
  "Women's Health",
  'Pediatric Concern',
  'Dental Issue',
  'Skin / Dermatology',
  'Chronic Illness Management',
  'Digestive Health',
  'Other'
];

const urgencyLevels = [
  {
    level: 'Low',
    color: 'border-emerald-500 bg-emerald-50 text-emerald-800',
    description: 'Mild symptoms, routine non-urgent questions, or general wellness advice.'
  },
  {
    level: 'Medium',
    color: 'border-amber-500 bg-amber-50 text-amber-800',
    description: 'Noticeable discomfort, recurring pain, or symptoms lasting over several days.'
  },
  {
    level: 'High',
    color: 'border-rose-500 bg-rose-50 text-rose-800',
    description: 'Moderate-to-severe concern requiring expedited advisor review.'
  }
];

const ReportProblem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'General Health',
    description: '',
    symptomsInput: '',
    urgencyLevel: 'Low',
    disclaimerAcknowledged: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.description) {
      setError('Title and problem description are required.');
      return;
    }

    if (!formData.disclaimerAcknowledged) {
      setError('Please acknowledge that this is not an emergency medical service.');
      return;
    }

    try {
      setLoading(true);
      const symptomsArray = formData.symptomsInput
        ? formData.symptomsInput.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      await reportService.createReport({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        symptoms: symptomsArray,
        urgencyLevel: formData.urgencyLevel,
        disclaimerAcknowledged: formData.disclaimerAcknowledged
      });

      setSuccess('Your health concern report has been submitted to clinical advisors.');
      setTimeout(() => {
        navigate('/reports');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit health concern report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Page Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">CareFlow Clinical Triage</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Report a Health Concern</h1>
        <p className="text-slate-500 text-sm mt-1">
          Describe non-emergency symptoms or health questions to receive written triage guidance from our clinical team.
        </p>
      </div>

      {/* Mandatory Non-Emergency Disclaimer */}
      <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-900">NOT AN EMERGENCY MEDICAL SERVICE</h4>
            <p className="text-xs text-rose-800 leading-relaxed">
              If you are experiencing severe chest pain, stroke symptoms, uncontrolled bleeding, or shortness of breath, do not submit this form. Call <strong>112</strong> immediately.
            </p>
          </div>
        </div>
        <a
          href="tel:112"
          className="btn-danger whitespace-nowrap text-xs py-2 px-4 flex items-center gap-1.5 shrink-0"
        >
          <PhoneCall className="w-3.5 h-3.5" /> Call 112
        </a>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-sm flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-slate-100 space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Concern Title / Summary *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Persistent tension headache after screen time"
            required
            className="form-input"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Problem Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-input"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Detailed Problem Description *
          </label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe when the symptoms started, severity, triggers, and what makes it better or worse..."
            required
            className="form-input"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Specific Symptoms (Comma Separated)
          </label>
          <input
            type="text"
            name="symptomsInput"
            value={formData.symptomsInput}
            onChange={handleChange}
            placeholder="e.g. throbbing temple pain, mild nausea, neck stiffness"
            className="form-input"
          />
        </div>

        {/* Urgency Level Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Select Urgency Level *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {urgencyLevels.map((u) => (
              <div
                key={u.level}
                onClick={() => setFormData({ ...formData, urgencyLevel: u.level })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  formData.urgencyLevel === u.level
                    ? `${u.color} ring-2 ring-teal-500/20 font-semibold shadow-sm`
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider">{u.level} Urgency</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{u.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Checkbox Acknowledgment */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.disclaimerAcknowledged}
              onChange={(e) => setFormData({ ...formData, disclaimerAcknowledged: e.target.checked })}
              className="mt-1 h-4 w-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              I understand that this report is for non-critical health guidance and does not replace emergency medical care or an in-person physical consultation.
            </span>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link to="/reports" className="btn-secondary text-xs py-2 px-4">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2 shadow-sm font-bold"
          >
            <Send className="w-3.5 h-3.5" />
            {loading ? 'Submitting...' : 'Submit Health Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportProblem;
