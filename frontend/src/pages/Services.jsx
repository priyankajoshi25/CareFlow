import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { healthcareService } from '../services/healthcareService';
import {
  Stethoscope,
  Brain,
  ShieldAlert,
  HeartPulse,
  Baby,
  Smile,
  FlaskConical,
  Activity,
  Search,
  CheckCircle,
  Clock,
  ArrowRight,
  PhoneCall,
  Calendar,
  X
} from 'lucide-react';

const iconMap = {
  Stethoscope,
  HeartPulse,
  Brain,
  ShieldAlert,
  Baby,
  Smile,
  FlaskConical,
  Activity
};

const categories = [
  'All',
  'General Consultation',
  'Mental Wellness',
  'Emergency Assistance',
  "Women's Healthcare",
  'Child Healthcare',
  'Dental Care',
  'Diagnostic Services',
  'Preventive Healthcare'
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeModalService, setActiveModalService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, searchQuery]);

  const fetchServices = async () => {
    try {
      setLoading(false);
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      const data = await healthcareService.getServices(params);
      setServices(data.services || []);
    } catch (error) {
      console.error('Error fetching healthcare services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-teal-700 via-cyan-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-card">
        <span className="text-teal-300 font-bold text-xs uppercase tracking-wider">Comprehensive Care</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">Healthcare Services</h1>
        <p className="text-teal-100 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
          Explore certified medical care across 8 primary disciplines. Filter by category, review procedural details, and schedule appointments online.
        </p>

        {/* Search Input in Header */}
        <div className="mt-6 max-w-lg bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 flex items-center">
          <Search className="w-5 h-5 text-teal-200 ml-3 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service name, features, or description..."
            className="w-full bg-transparent text-white placeholder-teal-200/80 text-sm focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 text-teal-200 hover:text-white mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading healthcare services...</div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <p className="text-lg font-bold text-slate-700">No services match your search.</p>
          <p className="text-sm text-slate-500">Try adjusting your keyword or selecting "All" categories.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="btn-secondary text-xs"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Activity;
            return (
              <div
                key={service._id}
                className="card-healthcare p-6 flex flex-col justify-between hover:-translate-y-1 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    {service.isEmergency ? (
                      <span className="badge-status bg-rose-100 text-rose-700 flex items-center gap-1">
                        <PhoneCall className="w-3 h-3" /> Emergency
                      </span>
                    ) : (
                      <span className="badge-status bg-slate-100 text-slate-700">
                        {service.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {service.shortDescription}
                  </p>

                  {/* Feature Highlights */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-1.5 mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {service.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {service.estimatedDuration}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {service.startingFee === 0 ? 'Complimentary' : `₹${service.startingFee}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveModalService(service)}
                      className="btn-secondary text-xs py-2"
                    >
                      Learn More
                    </button>
                    {service.isEmergency ? (
                      <Link
                        to="/emergency"
                        className="btn-danger text-xs py-2 flex items-center justify-center gap-1.5"
                      >
                        <PhoneCall className="w-3 h-3" /> Call 112
                      </Link>
                    ) : (
                      <Link
                        to={`/book?service=${encodeURIComponent(service.name)}`}
                        className="btn-primary text-xs py-2 flex items-center justify-center gap-1"
                      >
                        Book Now <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Service Detail Modal */}
      {activeModalService && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="badge-status bg-teal-100 text-teal-800 mb-2">
                {activeModalService.category}
              </span>
              <h2 className="text-2xl font-bold text-slate-900">{activeModalService.name}</h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {activeModalService.fullDescription}
            </p>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Included Features & Benefits:
              </h4>
              <ul className="space-y-2">
                {activeModalService.features?.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-sm">
              <div>
                <p className="text-xs text-slate-400">Duration</p>
                <p className="font-bold text-slate-800">{activeModalService.estimatedDuration}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Consultation Fee</p>
                <p className="font-bold text-teal-700">
                  {activeModalService.startingFee === 0 ? 'Free Triage' : `₹${activeModalService.startingFee}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setActiveModalService(null)}
                className="btn-secondary text-sm flex-1"
              >
                Close
              </button>
              {activeModalService.isEmergency ? (
                <Link
                  to="/emergency"
                  onClick={() => setActiveModalService(null)}
                  className="btn-danger text-sm flex-1 flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" /> Emergency 112
                </Link>
              ) : (
                <Link
                  to={`/book?service=${encodeURIComponent(activeModalService.name)}`}
                  onClick={() => setActiveModalService(null)}
                  className="btn-primary text-sm flex-1 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Book Appointment
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
