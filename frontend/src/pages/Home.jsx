import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Search,
  PhoneCall,
  Calendar,
  ShieldCheck,
  Award,
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Stethoscope,
  Brain,
  ShieldAlert,
  Baby,
  Smile,
  FlaskConical,
  Activity,
  Star,
  ChevronRight
} from 'lucide-react';
import { healthcareService } from '../services/healthcareService';
import { articleService } from '../services/articleService';
import { doctorService } from '../services/doctorService';

const serviceIcons = {
  Stethoscope,
  HeartPulse,
  Brain,
  ShieldAlert,
  Baby,
  Smile,
  FlaskConical,
  Activity
};

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, doctorsRes, articlesRes] = await Promise.all([
          healthcareService.getServices(),
          doctorService.getDoctors(),
          articleService.getArticles()
        ]);
        setServices(servicesRes.services?.slice(0, 8) || []);
        setDoctors(doctorsRes.doctors?.slice(0, 3) || []);
        setArticles(articlesRes.articles?.slice(0, 3) || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-cyan-50/40 to-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Search */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 text-teal-800 text-xs font-semibold tracking-wide border border-teal-200">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Trusted Healthcare Problem Solving Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Your Health, <br />
                <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Our Priority.
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                CareFlow connects you directly with certified doctors, tailored healthcare services, timely medicine reminders, and clinical problem triage — all in one unified, modern hub.
              </p>

              {/* Live Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="max-w-xl mx-auto lg:mx-0 bg-white p-2 rounded-2xl shadow-card border border-slate-200 flex items-center gap-2"
              >
                <div className="pl-3 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search symptoms, doctors, or healthcare services..."
                  className="w-full py-2.5 px-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="btn-primary text-sm whitespace-nowrap px-6 py-2.5"
                >
                  Search
                </button>
              </form>

              {/* Quick Actions & Emergency Link */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/book" className="btn-primary flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Book Appointment
                </Link>
                <Link to="/emergency" className="btn-secondary text-rose-700 hover:text-rose-800 border-rose-200 hover:bg-rose-50 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-rose-600" /> Emergency Help (112)
                </Link>
                <Link to="/report-problem" className="btn-secondary flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Report Concern
                </Link>
              </div>

              {/* Key Trust Metrics */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-2xl font-bold text-slate-900">24/7</p>
                  <p className="text-xs text-slate-500 font-medium">Care Access</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">100%</p>
                  <p className="text-xs text-slate-500 font-medium">Verified Doctors</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">&lt; 15 min</p>
                  <p className="text-xs text-slate-500 font-medium">Average Triage</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background decorative blob */}
                <div className="absolute -top-10 -right-10 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

                {/* Hero Image Card */}
                <div className="relative bg-white rounded-3xl p-3 shadow-2xl border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
                    alt="Healthcare Doctors in Consultation"
                    className="w-full h-80 object-cover rounded-2xl"
                  />

                  {/* Floating Notification Badge 1 */}
                  <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Appointment Confirmed</p>
                      <p className="text-[11px] text-slate-500">Dr. Arvind Mehra • 10:30 AM</p>
                    </div>
                  </div>

                  {/* Floating Emergency Badge 2 */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-rose-600 to-rose-500 text-white p-3.5 rounded-2xl shadow-lg flex items-center gap-2.5">
                    <PhoneCall className="w-5 h-5 animate-bounce" />
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wide">Emergency 112</p>
                      <p className="text-[10px] text-rose-100">Instant Critical Response</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Quick Access Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border border-rose-200/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Facing a Medical Emergency?</h3>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                Do not wait for appointment scheduling or online forms. If you or a loved one experiences severe chest pain, heavy bleeding, or breathlessness, call national emergency services immediately.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:112"
              className="px-6 py-3 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 flex items-center gap-2 transition"
            >
              <PhoneCall className="w-5 h-5" /> Call 112 (India)
            </a>
            <Link
              to="/emergency"
              className="px-5 py-3 rounded-xl font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition text-sm"
            >
              Emergency Protocols
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Healthcare Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Specialized Medical Care</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Featured Healthcare Services</h2>
            <p className="text-slate-500 text-sm mt-1 max-w-xl">
              Comprehensive clinical solutions tailored for every stage of your health journey.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 mt-4 md:mt-0 group"
          >
            Explore All 8 Categories <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = serviceIcons[service.icon] || Activity;
            return (
              <div
                key={service._id}
                className="card-healthcare p-6 flex flex-col justify-between hover:-translate-y-1 group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5 group-hover:bg-gradient-to-br group-hover:from-teal-500 group-hover:to-cyan-600 group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 mb-2">
                    {service.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Starting from</span>
                    <span className="text-sm font-bold text-slate-900">
                      {service.startingFee === 0 ? 'Free Triage' : `₹${service.startingFee}`}
                    </span>
                  </div>
                  <Link
                    to={`/services?category=${encodeURIComponent(service.category)}`}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How CareFlow Works */}
      <section className="bg-slate-100/60 py-20 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Seamless Healthcare</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">How CareFlow Works</h2>
            <p className="text-slate-500 text-sm mt-2">
              Four streamlined steps designed to solve real-world healthcare bottlenecks efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">Search Doctor or Service</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter by medical specialty, experience, location, and verified consultation fees.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">Select Date & Time Slot</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose convenient real-time available appointment slots without hospital waiting lines.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">Describe Health Concern</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Submit health concerns, track symptoms, and set medicine reminders for full adherence.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900">Receive Care & Track Health</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive certified clinical feedback, digital prescriptions, and continuous monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Qualified Specialists</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Meet Our Leading Physicians</h2>
            <p className="text-slate-500 text-sm mt-1">
              Sample provider profiles illustrating certified specialties, hospital affiliations, and verified reviews.
            </p>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 mt-4 md:mt-0 group"
          >
            View Doctor Directory <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {doctors.map((doc) => (
            <div
              key={doc._id}
              className="card-healthcare p-6 flex flex-col justify-between"
            >
              <div>
                <div className="relative mb-5">
                  <img
                    src={doc.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'}
                    alt={doc.name}
                    className="w-full h-52 object-cover rounded-2xl"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-slate-800 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {doc.rating} ({doc.reviewsCount})
                  </div>
                  {doc.isSample && (
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-medium">
                      Sample Data
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">{doc.name}</h3>
                  <p className="text-xs font-semibold text-teal-600">{doc.specialization}</p>
                  <p className="text-xs text-slate-500">{doc.qualification} • {doc.experience} yrs exp</p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{doc.bio}</p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Consultation Fee</span>
                  <span className="text-base font-bold text-slate-900">₹{doc.consultationFee}</span>
                </div>
                <Link
                  to={`/book?doctorId=${doc._id}`}
                  className="btn-primary text-xs py-2 px-4 shadow-sm"
                >
                  Book Slot
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Health Awareness Articles Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Educational Health Resources</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Recent Health Awareness Articles</h2>
            <p className="text-slate-500 text-sm mt-1">
              Clinically reviewed insights and preventive guidelines by qualified healthcare practitioners.
            </p>
          </div>
          <Link
            to="/articles"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 mt-4 md:mt-0 group"
          >
            Read All Articles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <Link
              key={art._id}
              to={`/articles/${art.slug || art._id}`}
              className="card-healthcare overflow-hidden flex flex-col group"
            >
              <div className="h-48 overflow-hidden bg-slate-100">
                <img
                  src={art.imageUrl || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600'}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-teal-600">{art.category}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {art.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition line-clamp-2 mb-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-400">
                  Reviewed by: <strong className="text-slate-600">{art.reviewedBy}</strong>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Patient Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mb-10">
            <span className="text-teal-300 text-xs font-bold uppercase tracking-wider">Patient Testimonials</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              Empowering Real Patients to Overcome Health Challenges
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "Booking an urgent consultation with Dr. Arvind was frictionless. The reminder alerts for my daily medications keep my hypertension completely under control."
              </p>
              <div>
                <p className="text-sm font-bold text-white">Ananya Deshmukh</p>
                <p className="text-[11px] text-teal-300">Patient since 2024</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "When I experienced severe anxiety, CareFlow's mental wellness portal provided confidential guidance and prompt behavioral advice. A true lifesaver."
              </p>
              <div>
                <p className="text-sm font-bold text-white">Karthik Menon</p>
                <p className="text-[11px] text-teal-300">Patient since 2025</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "The health concern reporting feature gave me a doctor review within hours. Clear instructions, no panic, and clear referral pathways."
              </p>
              <div>
                <p className="text-sm font-bold text-white">Sneha Roy</p>
                <p className="text-[11px] text-teal-300">Patient since 2025</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-600 text-white rounded-3xl p-10 sm:p-14 shadow-lg space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Prioritize Your Health?
          </h2>
          <p className="text-teal-50 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Create your CareFlow profile today to manage appointments, track concerns, and access medical guidance with complete peace of mind.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md transition"
            >
              Create Free Account
            </Link>
            <Link
              to="/doctors"
              className="px-8 py-3.5 rounded-xl font-bold text-white bg-teal-800/60 hover:bg-teal-800 border border-white/20 transition"
            >
              Browse Doctor Profiles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
