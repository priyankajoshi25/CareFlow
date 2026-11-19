import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, PhoneCall, Mail, MapPin, ShieldCheck, Heart, AlertTriangle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Emergency */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 shadow-md">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">CareFlow</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your Health, Our Priority. CareFlow empowers patients and medical providers through unified appointment booking, clinical problem tracking, health reminders, and verified awareness.
            </p>

            {/* Emergency Hotline Box */}
            <div className="bg-rose-950/60 border border-rose-800/80 rounded-2xl p-4 max-w-sm">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">
                <AlertTriangle className="w-4 h-4" /> 24/7 National Emergency
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-white text-xl font-extrabold tracking-wide">Dial 112</p>
                  <p className="text-rose-200 text-xs">Police, Fire & Medical Response (India)</p>
                </div>
                <a
                  href="tel:112"
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call Now
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Healthcare Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">Healthcare Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/services" className="hover:text-teal-400 transition">General Consultation</Link></li>
              <li><Link to="/services" className="hover:text-teal-400 transition">Mental Wellness</Link></li>
              <li><Link to="/services" className="hover:text-teal-400 transition">Women's Healthcare</Link></li>
              <li><Link to="/services" className="hover:text-teal-400 transition">Child Healthcare</Link></li>
              <li><Link to="/services" className="hover:text-teal-400 transition">Dental Care</Link></li>
              <li><Link to="/services" className="hover:text-teal-400 transition">Diagnostic Services</Link></li>
              <li><Link to="/services" className="hover:text-teal-400 transition">Preventive Medicine</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform & Patient Portals */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">Patient Portals</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/doctors" className="hover:text-teal-400 transition">Find Verified Doctors</Link></li>
              <li><Link to="/book" className="hover:text-teal-400 transition">Book Appointment</Link></li>
              <li><Link to="/dashboard" className="hover:text-teal-400 transition">Patient Dashboard</Link></li>
              <li><Link to="/report-problem" className="hover:text-teal-400 transition">Report Health Concern</Link></li>
              <li><Link to="/reminders" className="hover:text-teal-400 transition">Medicine Reminders</Link></li>
              <li><Link to="/articles" className="hover:text-teal-400 transition">Health Awareness</Link></li>
              <li><Link to="/emergency" className="hover:text-teal-400 transition">Emergency Protocols</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Helplines */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">Contact & Helplines</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-xs">CareFlow Healthcare Center, Metro Health Boulevard, Mumbai & Bengaluru</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="mailto:support@careflow.com" className="text-xs hover:text-teal-300">support@careflow.com</a>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-xs">Ambulance: <strong>108 / 102</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-xs">Mental Health (Tele-MANAS): <strong>14416</strong></span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Safety Disclaimer */}
        <div className="py-6 border-b border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
          <p className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
            <span>
              <strong>Medical Disclaimer:</strong> CareFlow is an informational and health coordination platform. Content and tools provided on this website are for educational and scheduling purposes only and do not constitute formal medical diagnosis, treatment, or prescription.
            </span>
          </p>
          <p className="pl-6 text-slate-400">
            In case of medical emergencies, sudden chest pain, breathing difficulties, or severe trauma, immediately dial national emergency <strong>112</strong> or proceed to the nearest emergency room. Never delay professional medical intervention.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CareFlow Healthcare Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Doctor Verification Standards</span>
            <span className="flex items-center gap-1 text-slate-300">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Healthcare
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
