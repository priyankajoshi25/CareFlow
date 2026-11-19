import React, { useState, useEffect } from 'react';
import { reminderService } from '../services/reminderService';
import {
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  AlertCircle,
  Info,
  Calendar,
  Pill,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';

const frequencyOptions = [
  'Once daily',
  'Twice daily',
  'Thrice daily',
  'Every 8 hours',
  'Before meals',
  'After meals',
  'As needed'
];

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '',
    frequency: 'Once daily',
    reminderTime: '08:00 AM',
    notes: ''
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const res = await reminderService.getReminders();
      setReminders(res.reminders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load medicine reminders.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (reminder) => {
    try {
      const updatedStatus = !reminder.isCompleted;
      await reminderService.updateReminder(reminder._id, {
        isCompleted: updatedStatus
      });
      setReminders(
        reminders.map((r) =>
          r._id === reminder._id ? { ...r, isCompleted: updatedStatus } : r
        )
      );
    } catch (err) {
      console.error('Failed to toggle reminder status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reminder?')) return;
    try {
      await reminderService.deleteReminder(id);
      setReminders(reminders.filter((r) => r._id !== id));
      setSuccess('Reminder removed.');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Could not delete reminder.');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.medicineName || !formData.dosage || !formData.reminderTime) {
      setError('Medicine name, dosage, and reminder time are required.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await reminderService.createReminder(formData);
      setReminders([res.reminder, ...reminders]);
      setModalOpen(false);
      setFormData({
        medicineName: '',
        dosage: '',
        frequency: 'Once daily',
        reminderTime: '08:00 AM',
        notes: ''
      });
      setSuccess('Medicine reminder added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create reminder.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeReminders = reminders.filter((r) => !r.isCompleted);
  const completedReminders = reminders.filter((r) => r.isCompleted);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Medicine & Health Reminders</h1>
          <p className="text-slate-500 text-sm mt-1">
            Personal medication schedule manager to track dosages and adherence.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchReminders}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Reminder
          </button>
        </div>
      </div>

      {/* Mandatory Non-Prescription Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 leading-relaxed">
          <strong>Personal Scheduling Disclaimer:</strong> CareFlow reminders are personal patient organization tools. CareFlow does not prescribe, endorse, or recommend any pharmaceutical medications. Always take medicines strictly as instructed by your licensed healthcare physician.
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
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading your medicine reminders...</div>
      ) : reminders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <Clock className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-base font-bold text-slate-700">No active medication reminders.</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Stay on track with prescribed vitamins, supplements, and medications by setting daily alerts.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary text-xs py-2 px-5 inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Your First Reminder
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Reminders */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" /> Pending & Today's Schedule ({activeReminders.length})
            </h2>

            {activeReminders.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-white p-4 rounded-2xl border border-slate-100">
                All scheduled medicines for today are marked as taken!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeReminders.map((rem) => (
                  <div
                    key={rem._id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-card transition flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <button
                        onClick={() => handleToggleComplete(rem)}
                        className="text-slate-300 hover:text-teal-600 transition mt-1"
                        title="Mark as taken"
                      >
                        <Circle className="w-6 h-6" />
                      </button>

                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900">{rem.medicineName}</h3>
                        <p className="text-xs font-semibold text-teal-700">
                          {rem.dosage} • {rem.frequency}
                        </p>
                        <p className="text-xs font-medium text-slate-600 flex items-center gap-1.5 pt-0.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Scheduled Time: <strong>{rem.reminderTime}</strong></span>
                        </p>
                        {rem.notes && (
                          <p className="text-xs text-slate-500 italic pt-1">
                            Note: {rem.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(rem._id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-50 transition"
                      title="Remove reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Reminders */}
          {completedReminders.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Taken / Completed ({completedReminders.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedReminders.map((rem) => (
                  <div
                    key={rem._id}
                    className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex items-start justify-between gap-4 opacity-80"
                  >
                    <div className="flex items-start gap-3.5">
                      <button
                        onClick={() => handleToggleComplete(rem)}
                        className="text-emerald-600 hover:text-slate-400 transition mt-1"
                        title="Unmark completed"
                      >
                        <CheckCircle2 className="w-6 h-6 fill-emerald-100" />
                      </button>

                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-600 line-through">{rem.medicineName}</h3>
                        <p className="text-xs text-slate-500">
                          {rem.dosage} • {rem.frequency} ({rem.reminderTime})
                        </p>
                        {rem.lastTakenAt && (
                          <p className="text-[11px] text-emerald-700 font-medium">
                            Taken on {new Date(rem.lastTakenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(rem._id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition"
                      title="Remove reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Reminder Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-slate-900">Add Medicine Reminder</h2>
              <p className="text-xs text-slate-500 mt-1">
                Configure your dose instructions and notification time.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Medicine / Supplement Name *
                </label>
                <input
                  type="text"
                  value={formData.medicineName}
                  onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                  placeholder="e.g. Amoxicillin or Vitamin D3"
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Dosage Instructions *
                </label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  placeholder="e.g. 500mg, 1 tablet with warm water"
                  required
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Frequency *
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="form-input"
                  >
                    {frequencyOptions.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Alert Time *
                  </label>
                  <input
                    type="text"
                    value={formData.reminderTime}
                    onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                    placeholder="08:30 AM"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Personal Instructions / Notes
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Take immediately after breakfast"
                  className="form-input"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs py-2 px-5 font-bold shadow-sm"
                >
                  {submitting ? 'Saving...' : 'Save Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminders;
