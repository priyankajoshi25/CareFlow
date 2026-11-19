import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  Info
} from 'lucide-react';

const timeSlots = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:30 PM',
  '05:00 PM'
];

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const initialDoctorId = searchParams.get('doctorId') || '';
  const initialService = searchParams.get('service') || '';

  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctorId);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');

  // Patient profile details
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');
  const [patientEmail, setPatientEmail] = useState(user?.email || '');
  const [patientAge, setPatientAge] = useState(user?.age || '');
  const [patientGender, setPatientGender] = useState(user?.gender || 'unspecified');

  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Min date is today
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await doctorService.getDoctors();
        setDoctors(res.doctors || []);
        if (!selectedDoctorId && res.doctors?.length > 0) {
          setSelectedDoctorId(res.doctors[0]._id);
        }
      } catch (err) {
        console.error('Failed to load doctors:', err);
      } finally {
        setFetchingDoctors(false);
      }
    };
    loadDoctors();
  }, []);

  const selectedDoctor = doctors.find((d) => d._id === selectedDoctorId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedDoctorId) {
      setError('Please select a healthcare physician.');
      return;
    }
    if (!appointmentDate) {
      setError('Please select your preferred appointment date.');
      return;
    }
    if (!timeSlot) {
      setError('Please choose an available appointment time slot.');
      return;
    }
    if (!patientName || !patientPhone || !reasonForVisit) {
      setError('Patient name, contact phone, and visit reason are required.');
      return;
    }

    try {
      setLoading(true);
      const res = await appointmentService.createAppointment({
        doctorId: selectedDoctorId,
        patientName,
        patientPhone,
        patientEmail,
        patientAge: patientAge ? parseInt(patientAge, 10) : undefined,
        patientGender,
        serviceType: initialService || selectedDoctor?.specialization,
        appointmentDate,
        timeSlot,
        reasonForVisit,
        symptoms,
        notes
      });

      setSuccess('Appointment successfully scheduled! Redirecting to appointments list...');
      setTimeout(() => {
        navigate('/appointments');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not schedule appointment. Please choose another slot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">CareFlow Scheduling</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Book an Appointment</h1>
        <p className="text-slate-500 text-sm mt-1">
          Select a verified physician, choose an open date and time slot, and confirm your clinical consultation.
        </p>
      </div>

      {/* Emergency Guidance Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 leading-relaxed">
          <strong>Non-Emergency Notice:</strong> Scheduled consultations are for routine and non-critical care. In the event of an acute, life-threatening emergency, please dial <strong>112</strong> or visit the nearest casualty center immediately.
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-sm flex items-start gap-2 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-sm flex items-start gap-2 mb-6">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Select Doctor */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-slate-100 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" /> 1. Select Healthcare Provider
          </h2>

          {fetchingDoctors ? (
            <p className="text-xs text-slate-400">Loading physicians...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => setSelectedDoctorId(doc._id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
                    selectedDoctorId === doc._id
                      ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <img
                    src={doc.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150'}
                    alt={doc.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-teal-200"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">{doc.name}</p>
                    <p className="text-xs text-teal-700 font-semibold truncate">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-400">{doc.experience} yrs exp • Fee: ₹{doc.consultationFee}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Date & Slot Selection */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-slate-100 space-y-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" /> 2. Appointment Date & Time Slot
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Consultation Date
              </label>
              <input
                type="date"
                min={todayStr}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Available Time Slots
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition ${
                      timeSlot === slot
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Patient Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-slate-100 space-y-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-teal-600" /> 3. Patient Details & Medical Concern
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Patient Full Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                placeholder="Patient Name"
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Contact Phone
              </label>
              <input
                type="tel"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                required
                placeholder="+91 98765 43210"
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="patient@example.com"
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  min="0"
                  max="125"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="30"
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Gender
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="form-input"
                >
                  <option value="unspecified">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Primary Reason for Consultation *
            </label>
            <input
              type="text"
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
              placeholder="e.g. Follow-up blood pressure check, seasonal allergy, persistent headache"
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Symptoms Experienced (Optional)
            </label>
            <textarea
              rows="2"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Mild headache since 3 days, fever peaking at night, dizziness..."
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Additional Notes for the Doctor
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Allergic to penicillin, previous lab test attached..."
              className="form-input"
            />
          </div>
        </div>

        {/* Booking Summary & Confirmation */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <p className="text-xs text-teal-400 font-bold uppercase tracking-wider">Consultation Summary</p>
              <p className="text-lg font-bold text-white">
                {selectedDoctor?.name || 'Selected Doctor'}
              </p>
              <p className="text-xs text-slate-400">
                {appointmentDate || 'Date not picked'} • {timeSlot || 'Slot not selected'}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block">Consultation Fee</span>
              <span className="text-2xl font-extrabold text-teal-300">
                ₹{selectedDoctor?.consultationFee || 500}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-400">
              By confirming, you book an appointment slot. Status will be marked as <strong>Pending</strong> until confirmed by clinic.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 transition flex items-center justify-center gap-2 shrink-0"
            >
              {loading ? 'Confirming Booking...' : 'Confirm Appointment'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookAppointment;
