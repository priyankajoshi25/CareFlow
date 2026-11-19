import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { doctorService } from '../services/doctorService';
import {
  Stethoscope,
  Search,
  Star,
  MapPin,
  Calendar,
  Clock,
  Award,
  CheckCircle,
  Info,
  Phone,
  ArrowRight,
  X
} from 'lucide-react';

const specializations = [
  'All',
  'General Physician',
  'Cardiologist',
  'Psychiatrist & Mental Wellness Expert',
  'Pediatrician',
  'Obstetrician & Gynecologist',
  'Dental Surgeon & Implantologist'
];

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSpec, setSelectedSpec] = useState(searchParams.get('specialization') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpec, searchQuery]);

  const fetchDoctors = async () => {
    try {
      setLoading(false);
      const params = {};
      if (selectedSpec && selectedSpec !== 'All') {
        params.specialization = selectedSpec;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      const data = await doctorService.getDoctors(params);
      setDoctors(data.doctors || []);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecChange = (spec) => {
    setSelectedSpec(spec);
    if (spec === 'All') {
      searchParams.delete('specialization');
    } else {
      searchParams.set('specialization', spec);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-cyan-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-card">
        <span className="text-teal-300 font-bold text-xs uppercase tracking-wider">Clinical Directory</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">Certified Doctor Directory</h1>
        <p className="text-teal-100 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
          Find and consult leading doctors across key specializations. View clinical background, verified ratings, and real-time appointment availability.
        </p>

        {/* Search Bar */}
        <div className="mt-6 max-w-lg bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 flex items-center">
          <Search className="w-5 h-5 text-teal-200 ml-3 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor name, specialty, or hospital..."
            className="w-full bg-transparent text-white placeholder-teal-200/80 text-sm focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 text-teal-200 hover:text-white mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Required Clarification Banner: Sample Data */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 leading-relaxed">
          <strong>Notice Regarding Clinical Profiles:</strong> CareFlow uses clearly labeled sample doctor profiles for platform demonstration until real, verified institutional healthcare providers are connected. All consultation bookings within the demo environment are simulated.
        </div>
      </div>

      {/* Specialization Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {specializations.map((spec) => (
          <button
            key={spec}
            onClick={() => handleSpecChange(spec)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSpec === spec
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading doctor profiles...</div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <p className="text-lg font-bold text-slate-700">No doctors found matching criteria.</p>
          <p className="text-sm text-slate-500">Try adjusting your search terms or clearing the filter.</p>
          <button
            onClick={() => {
              setSelectedSpec('All');
              setSearchQuery('');
            }}
            className="btn-secondary text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="card-healthcare p-6 flex flex-col justify-between"
            >
              <div>
                <div className="relative mb-5">
                  <img
                    src={doctor.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'}
                    alt={doctor.name}
                    className="w-full h-56 object-cover rounded-2xl"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-slate-800 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {doctor.rating} ({doctor.reviewsCount})
                  </div>
                  <div className="absolute bottom-3 left-3 bg-amber-500/90 text-slate-900 font-bold px-2 py-0.5 rounded-md text-[10px] tracking-wide uppercase">
                    Sample Data
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900">{doctor.name}</h3>
                  <p className="text-xs font-bold text-teal-600">{doctor.specialization}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doctor.qualification} • {doctor.experience} Years Experience</span>
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{doctor.hospital}</span>
                  </p>
                  <p className="text-xs text-slate-600 pt-2 line-clamp-3 leading-relaxed">
                    {doctor.bio}
                  </p>

                  <div className="pt-3 flex flex-wrap gap-1">
                    {doctor.availableDays?.map((day, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium">
                        {day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Consultation Fee</span>
                  <span className="text-base font-extrabold text-slate-900">₹{doctor.consultationFee}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDoctor(doctor)}
                    className="btn-secondary text-xs py-2 px-3"
                  >
                    Details
                  </button>
                  <Link
                    to={`/book?doctorId=${doctor._id}`}
                    className="btn-primary text-xs py-2 px-4 shadow-sm"
                  >
                    Book Slot
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <img
                src={selectedDoctor.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'}
                alt={selectedDoctor.name}
                className="w-16 h-16 rounded-2xl object-cover border border-teal-200"
              />
              <div>
                <span className="badge-status bg-amber-100 text-amber-800 text-[10px] uppercase font-bold mb-1">
                  Sample Provider
                </span>
                <h2 className="text-xl font-bold text-slate-900">{selectedDoctor.name}</h2>
                <p className="text-xs font-semibold text-teal-600">{selectedDoctor.specialization}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p><strong>Affiliation:</strong> {selectedDoctor.hospital}</p>
              <p><strong>Qualifications:</strong> {selectedDoctor.qualification}</p>
              <p><strong>Clinical Experience:</strong> {selectedDoctor.experience} years</p>
              <p><strong>Available Days:</strong> {selectedDoctor.availableDays?.join(', ')}</p>
              <p><strong>Clinic Hours:</strong> {selectedDoctor.availableHours?.start} - {selectedDoctor.availableHours?.end}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Clinical Biography</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedDoctor.bio}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 block">Fee per Consultation</span>
                <span className="text-lg font-bold text-slate-900">₹{selectedDoctor.consultationFee}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Close
                </button>
                <Link
                  to={`/book?doctorId=${selectedDoctor._id}`}
                  onClick={() => setSelectedDoctor(null)}
                  className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
