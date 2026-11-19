import React from 'react';
import {
  PhoneCall,
  ShieldAlert,
  AlertTriangle,
  HeartPulse,
  Activity,
  Flame,
  UserCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

const emergencyContacts = [
  {
    title: 'National Emergency Hotline (India)',
    number: '112',
    description: 'All-in-one unified emergency response for Police, Fire, and Medical emergencies nationwide.',
    primary: true
  },
  {
    title: 'Ambulance Emergency Dispatch',
    number: '108 / 102',
    description: 'Toll-free emergency medical transport and paramedic casualty dispatch.',
    primary: false
  },
  {
    title: 'Tele-MANAS National Mental Health Helpline',
    number: '14416',
    description: '24/7 round-the-clock psychological crisis, suicide prevention, and emotional counseling.',
    primary: false
  },
  {
    title: 'National Women Safety Helpline',
    number: '1091',
    description: 'Dedicated immediate assistance for women in distress, domestic trauma, or emergencies.',
    primary: false
  },
  {
    title: 'National Poison Information Center (AIIMS)',
    number: '1800-116-117',
    description: 'Expert toxicological medical triage and ingestion emergency guidance.',
    primary: false
  }
];

const guidanceProtocols = [
  {
    title: 'Acute Chest Pain & Suspected Heart Attack',
    icon: HeartPulse,
    steps: [
      'Immediately dial 112 for ambulance transit. Do not drive yourself to hospital.',
      'Have the patient sit in a half-reclined position with knees bent to ease cardiac stress.',
      'Loosen restrictive clothing around the neck, chest, and waist.',
      'If not allergic and advised by a medical professional or paramedic, chew one adult aspirin (300mg).',
      'Be prepared to initiate CPR if the person loses responsiveness.'
    ]
  },
  {
    title: 'Severe Uncontrolled Bleeding',
    icon: ShieldAlert,
    steps: [
      'Call 112 without delay.',
      'Apply continuous, firm direct pressure over the bleeding site using sterile gauze or clean cloth.',
      'Do not remove blood-soaked dressings; add more pads directly on top and continue pressing.',
      'If bleeding continues from an extremity, elevate the limb above heart level while applying pressure.',
      'Keep the patient warm and lying down to prevent circulatory shock.'
    ]
  },
  {
    title: 'CPR (Adult Resuscitation)',
    icon: Activity,
    steps: [
      'Confirm the person is unresponsive and not breathing normally.',
      'Place heel of one hand in the center of the chest; place your other hand on top and interlock fingers.',
      'Push hard and fast: compress at least 2 inches deep at a rate of 100 to 120 beats per minute.',
      'Continue chest compressions continuously until emergency responders take over.'
    ]
  },
  {
    title: 'Stroke FAST Protocol',
    icon: UserCheck,
    steps: [
      'F - Face Drooping: Ask the person to smile. Does one side of the face droop?',
      'A - Arm Weakness: Ask them to raise both arms. Does one arm drift downward?',
      'S - Speech Difficulty: Ask them to repeat a simple sentence. Is speech slurred or strange?',
      'T - Time to Call 112: If you observe any of these symptoms, call 112 immediately. Note the exact time symptoms began.'
    ]
  },
  {
    title: 'Burns & Scalds',
    icon: Flame,
    steps: [
      'Immediately cool the burn under running cool tap water for 10 to 20 minutes.',
      'Never apply ice, iced water, butter, oil, or home ointments to an acute burn.',
      'Gently remove rings, watches, or restrictive items before swelling starts.',
      'Cover loosely with clean, non-stick plastic wrap or sterile dressing and seek immediate medical evaluation.'
    ]
  }
];

const Emergency = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Critical Non-Delay Warning Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 animate-pulse" /> Critical Emergency Notice
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Do Not Delay Emergency Care.
          </h1>
          <p className="text-rose-100 text-sm sm:text-base max-w-2xl leading-relaxed">
            CareFlow web tools are strictly for non-critical coordination. If you or someone around you is in immediate danger, dial <strong>112</strong> immediately. Never wait for website responses or email consultations during medical emergencies.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <a
            href="tel:112"
            className="px-8 py-4 rounded-2xl font-extrabold text-rose-950 bg-white hover:bg-rose-50 shadow-lg text-lg flex items-center gap-3 transition transform active:scale-95"
          >
            <PhoneCall className="w-6 h-6 text-rose-600 animate-bounce" /> Dial 112 (India)
          </a>
          <a
            href="tel:108"
            className="px-6 py-4 rounded-2xl font-bold text-white bg-rose-900/60 hover:bg-rose-900 border border-white/20 text-base flex items-center gap-2 transition"
          >
            <PhoneCall className="w-5 h-5" /> Dial 108 (Ambulance)
          </a>
        </div>
      </div>

      {/* Emergency Contact Numbers Grid */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Quick Directory</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Direct Emergency Numbers (India)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencyContacts.map((contact, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition flex flex-col justify-between ${
                contact.primary
                  ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20 shadow-md'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="space-y-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  contact.primary ? 'bg-rose-200 text-rose-900' : 'bg-slate-100 text-slate-700'
                }`}>
                  {contact.primary ? 'National Primary' : 'Specialized Helpline'}
                </span>
                <h3 className="text-base font-bold text-slate-900">{contact.title}</h3>
                <p className="text-2xl font-black text-rose-600 tracking-wide">{contact.number}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{contact.description}</p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100">
                <a
                  href={`tel:${contact.number.split(' ')[0]}`}
                  className="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call {contact.number}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Basic Emergency Guidance Protocols */}
      <div className="space-y-6 pt-6 border-t border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">First-Aid Guidelines</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Basic Life Support & Emergency Guidance</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
            Critical actions to take in the first crucial moments while emergency medical services are en route.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guidanceProtocols.map((protocol, idx) => {
            const Icon = protocol.icon;
            return (
              <div key={idx} className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{protocol.title}</h3>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600">
                  {protocol.steps.map((step, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {sIdx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Emergency;
