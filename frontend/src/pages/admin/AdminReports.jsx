import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import {
  FileText,
  Search,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  Clock,
  ShieldCheck
} from 'lucide-react';

const statusBadgeStyle = {
  'Submitted': 'bg-slate-100 text-slate-700 border-slate-200',
  'Under Review': 'bg-amber-100 text-amber-800 border-amber-200',
  'Advisor Responded': 'bg-teal-100 text-teal-800 border-teal-200',
  'Resolved': 'bg-emerald-100 text-emerald-800 border-emerald-200'
};

const urgencyBadgeStyle = {
  Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  High: 'bg-rose-50 text-rose-700 border-rose-200'
};

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Response Modal State
  const [activeReport, setActiveReport] = useState(null);
  const [responseStatus, setResponseStatus] = useState('Advisor Responded');
  const [feedback, setFeedback] = useState('');
  const [advisorName, setAdvisorName] = useState('Dr. Evelyn Reed (CMO)');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportService.getReports();
      setReports(res.reports || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reports.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (rep) => {
    setActiveReport(rep);
    setResponseStatus(rep.status === 'Submitted' ? 'Under Review' : rep.status);
    setFeedback(rep.advisorFeedback || '');
    setAdvisorName(rep.advisorName || 'Dr. Evelyn Reed (CMO)');
  };

  const handleSaveResponse = async (e) => {
    e.preventDefault();
    if (!activeReport) return;

    try {
      setSubmitting(true);
      await reportService.updateReport(activeReport._id, {
        status: responseStatus,
        advisorFeedback: feedback,
        advisorName
      });
      setSuccess('Clinical advisor feedback submitted successfully.');
      setActiveReport(null);
      fetchReports();
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update report.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = reports.filter((rep) => {
    if (statusFilter !== 'All' && rep.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      rep.title?.toLowerCase().includes(term) ||
      rep.category?.toLowerCase().includes(term) ||
      rep.description?.toLowerCase().includes(term) ||
      rep.user?.name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Health Problem Reports</h1>
          <p className="text-slate-500 text-sm mt-1">
            Review patient triage submissions, assess symptoms, and provide certified clinical advisor feedback.
          </p>
        </div>
        <button
          onClick={fetchReports}
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search report title, patient, or symptoms..."
            className="form-input pl-10"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Submitted', 'Under Review', 'Advisor Responded', 'Resolved'].map((st) => (
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

      {/* Reports Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Patient User</th>
                <th className="py-3.5 px-6">Concern Title / Category</th>
                <th className="py-3.5 px-6">Urgency</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Submitted Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    Loading reports...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No problem reports found.
                  </td>
                </tr>
              ) : (
                filtered.map((rep) => (
                  <tr key={rep._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{rep.user?.name || 'Patient'}</p>
                      <p className="text-[11px] text-slate-400">{rep.user?.email}</p>
                    </td>

                    <td className="py-4 px-6 max-w-sm">
                      <p className="font-bold text-slate-900">{rep.title}</p>
                      <span className="text-[11px] text-teal-700 font-semibold">{rep.category}</span>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{rep.description}</p>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`border px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${urgencyBadgeStyle[rep.urgencyLevel]}`}>
                        {rep.urgencyLevel}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`border px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadgeStyle[rep.status]}`}>
                        {rep.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-slate-500">
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenModal(rep)}
                        className="btn-primary text-xs py-1.5 px-3 shadow-sm inline-flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        {rep.advisorFeedback ? 'Edit Feedback' : 'Respond'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advisor Feedback Response Modal */}
      {activeReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveReport(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="badge-status bg-teal-100 text-teal-800 text-[10px] uppercase font-bold mb-1">
                {activeReport.category}
              </span>
              <h2 className="text-xl font-bold text-slate-900">{activeReport.title}</h2>
              <p className="text-xs text-slate-500">Submitted by: {activeReport.user?.name}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2 text-slate-700">
              <p><strong>Description:</strong> {activeReport.description}</p>
              {activeReport.symptoms?.length > 0 && (
                <p><strong>Symptoms:</strong> {activeReport.symptoms.join(', ')}</p>
              )}
            </div>

            <form onSubmit={handleSaveResponse} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Status Progression *
                  </label>
                  <select
                    value={responseStatus}
                    onChange={(e) => setResponseStatus(e.target.value)}
                    className="form-input"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Advisor Responded">Advisor Responded</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Advisor Name *
                  </label>
                  <input
                    type="text"
                    value={advisorName}
                    onChange={(e) => setAdvisorName(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Clinical Recommendations & Feedback *
                </label>
                <textarea
                  rows="4"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide structured, empathetic clinical guidance, non-emergency triage advice, and suggest next steps..."
                  required
                  className="form-input"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveReport(null)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs py-2 px-5 font-bold shadow-sm"
                >
                  {submitting ? 'Submitting...' : 'Submit Advisor Response'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
