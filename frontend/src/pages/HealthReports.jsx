import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportService } from '../services/reportService';
import {
  FileText,
  AlertCircle,
  Clock,
  CheckCircle,
  MessageSquare,
  Plus,
  RefreshCw,
  PhoneCall,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const statusBadgeStyle = {
  'Submitted': 'bg-slate-100 text-slate-700 border-slate-200',
  'Under Review': 'bg-amber-100 text-amber-800 border-amber-200',
  'Advisor Responded': 'bg-teal-100 text-teal-800 border-teal-200',
  'Resolved': 'bg-emerald-100 text-emerald-800 border-emerald-200'
};

const urgencyBadgeStyle = {
  'Low': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Medium': 'bg-amber-50 text-amber-700 border-amber-200',
  'High': 'bg-rose-50 text-rose-700 border-rose-200'
};

const HealthReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReportId, setExpandedReportId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportService.getReports();
      setReports(res.reports || []);
      if (res.reports?.length > 0 && !expandedReportId) {
        setExpandedReportId(res.reports[0]._id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch health reports.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedReportId(expandedReportId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Health Problem Reports</h1>
          <p className="text-slate-500 text-sm mt-1">
            Track submitted health concerns, review clinical feedback, and monitor progress.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchReports}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <Link
            to="/report-problem"
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Report New Concern
          </Link>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          Reports are reviewed by medical advisors within 2-4 hours. In life-threatening emergencies, always call <strong>112</strong>.
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading your health concern reports...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-base font-bold text-slate-700">No health concerns reported yet.</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You can report non-emergency symptoms or questions anytime to receive triage feedback.
          </p>
          <Link to="/report-problem" className="btn-primary text-xs py-2 px-5 inline-flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Report Concern Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const isExpanded = expandedReportId === report._id;
            return (
              <div
                key={report._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-card transition"
              >
                {/* Summary Header */}
                <div
                  onClick={() => toggleExpand(report._id)}
                  className="p-5 sm:p-6 cursor-pointer flex items-start sm:items-center justify-between gap-4 select-none"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{report.title}</h3>
                      <span className={`border px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadgeStyle[report.status] || 'bg-slate-100'}`}>
                        {report.status}
                      </span>
                      <span className={`border px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${urgencyBadgeStyle[report.urgencyLevel] || 'bg-slate-100'}`}>
                        {report.urgencyLevel} Urgency
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="font-semibold text-teal-700">{report.category}</span>
                      <span>•</span>
                      <span>
                        Reported on {new Date(report.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      {report.advisorFeedback && (
                        <>
                          <span>•</span>
                          <span className="text-teal-700 font-bold flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" /> Advisor Feedback Available
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-slate-400 p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-4 animate-in fade-in">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Reported Concern Details
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        {report.description}
                      </p>
                    </div>

                    {report.symptoms && report.symptoms.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Reported Symptoms
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {report.symptoms.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-medium border border-teal-100"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Advisor Response Box */}
                    {report.advisorFeedback ? (
                      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 p-5 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4 text-teal-700" />
                            Clinical Advisor Review:
                          </span>
                          <span className="text-[11px] text-teal-700 font-medium">
                            {report.advisorName || 'CareFlow Medical Team'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                          {report.advisorFeedback}
                        </p>
                        {report.respondedAt && (
                          <p className="text-[10px] text-teal-600 pt-1">
                            Responded on {new Date(report.respondedAt).toLocaleDateString()} at {new Date(report.respondedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>A medical advisor has been assigned to your concern and will post feedback shortly.</span>
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <Link
                        to={`/book?service=${encodeURIComponent(report.category)}`}
                        className="btn-primary text-xs py-2 px-4 shadow-sm"
                      >
                        Book Dedicated Doctor Consultation
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HealthReports;
