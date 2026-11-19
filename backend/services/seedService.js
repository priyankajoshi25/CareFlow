const User = require('../models/User');
const Doctor = require('../models/Doctor');
const HealthcareService = require('../models/HealthcareService');
const HealthArticle = require('../models/HealthArticle');
const Appointment = require('../models/Appointment');
const HealthReport = require('../models/HealthReport');
const MedicineReminder = require('../models/MedicineReminder');

const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('ℹ️ Database already contains data. Skipping initial seeding.');
      return;
    }

    console.log('🌱 Seeding initial CareFlow healthcare data...');

    // 1. Seed Users
    const adminUser = await User.create({
      name: 'Dr. Evelyn Reed (Chief Medical Officer)',
      email: 'admin@careflow.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
      bloodGroup: 'O+',
      gender: 'female',
      address: {
        street: '42 Healthway Boulevard',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001'
      }
    });

    const patientUser = await User.create({
      name: 'Rahul Sharma',
      email: 'patient@careflow.com',
      password: 'patient123',
      role: 'patient',
      phone: '+91 91234 56789',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      bloodGroup: 'B+',
      gender: 'male',
      dateOfBirth: new Date('1994-06-15'),
      emergencyContact: {
        name: 'Pooja Sharma',
        phone: '+91 91234 56780',
        relationship: 'Spouse'
      },
      address: {
        street: '12 Silver Oak Residency',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001'
      },
      medicalHistory: 'Mild seasonal allergies. No history of hypertension or cardiac issues.'
    });

    // 2. Seed Healthcare Services (8 Categories)
    const services = await HealthcareService.insertMany([
      {
        name: 'Comprehensive General Consultation',
        category: 'General Consultation',
        shortDescription: 'Primary clinical checkups, routine health evaluations, and holistic diagnosis.',
        fullDescription: 'Our certified general physicians provide comprehensive medical assessments, vital sign reviews, symptom analysis, treatment planning, and guidance for everyday health concerns.',
        icon: 'Stethoscope',
        features: ['Digital Prescription', 'Symptom Triage', 'Referral Guidance', 'Follow-up Consultation'],
        estimatedDuration: '30 mins',
        startingFee: 499,
        isEmergency: false
      },
      {
        name: 'Confidential Mental Wellness & Therapy',
        category: 'Mental Wellness',
        shortDescription: 'Compassionate psychiatric counseling, anxiety support, and cognitive therapy.',
        fullDescription: 'Connect with licensed psychologists and psychiatrists for anxiety, stress, depression, insomnia, and behavioral counseling in a secure, stigma-free virtual clinic.',
        icon: 'Brain',
        features: ['1-on-1 Confidential Sessions', 'Anxiety & Mood Care', 'Stress Reduction Toolkits', 'Sleep Therapy'],
        estimatedDuration: '45 mins',
        startingFee: 999,
        isEmergency: false
      },
      {
        name: 'Emergency Medical Triage & Assistance',
        category: 'Emergency Assistance',
        shortDescription: 'Rapid crisis coordination, critical guidance, and immediate referral protocol.',
        fullDescription: 'Immediate triage advice for acute symptoms, connecting patients with emergency response helplines and nearest critical care trauma facilities. Dial 112 immediately in severe emergencies.',
        icon: 'ShieldAlert',
        features: ['Immediate Helplines (112)', 'Emergency First-Aid Guidance', 'Ambulance Dispatch Support', 'Critical Care Directions'],
        estimatedDuration: 'Instant',
        startingFee: 0,
        isEmergency: true
      },
      {
        name: "Holistic Women's Healthcare",
        category: "Women's Healthcare",
        shortDescription: 'Obstetrics, gynecological wellness, hormonal health, and prenatal consultation.',
        fullDescription: 'Specialized healthcare dedicated to women of all ages, covering reproductive health, PCOS management, prenatal tracking, menopause guidance, and preventive screenings.',
        icon: 'HeartPulse',
        features: ['PCOS & Hormonal Plans', 'Prenatal & Postnatal Care', 'Fertility Consultations', 'Cervical Health Screenings'],
        estimatedDuration: '35 mins',
        startingFee: 799,
        isEmergency: false
      },
      {
        name: 'Pediatric Care & Child Wellness',
        category: 'Child Healthcare',
        shortDescription: 'Dedicated pediatric physicians specializing in child growth and childhood illnesses.',
        fullDescription: 'Gentle, expert medical care for infants, children, and adolescents. From fever and common respiratory infections to developmental milestone assessments and immunization planning.',
        icon: 'Baby',
        features: ['Growth Monitoring', 'Immunization Schedules', 'Nutritional Advice for Kids', 'Adolescent Health Support'],
        estimatedDuration: '30 mins',
        startingFee: 650,
        isEmergency: false
      },
      {
        name: 'Advanced Dental Care & Oral Hygiene',
        category: 'Dental Care',
        shortDescription: 'Oral examinations, dental pain diagnosis, orthodontics, and cosmetic smiles.',
        fullDescription: 'Preventive dental cleaning, cavity treatments, root canal counseling, orthodontic evaluations, and periodontal disease therapy with modern dental equipment.',
        icon: 'Smile',
        features: ['Oral Cancer Screening', 'Cavity Diagnostics', 'Orthodontic Assessment', 'Teeth Whitening Guidance'],
        estimatedDuration: '40 mins',
        startingFee: 550,
        isEmergency: false
      },
      {
        name: 'Full Body Diagnostic Services & Lab Triage',
        category: 'Diagnostic Services',
        shortDescription: 'Accredited blood tests, pathology packages, and digital imaging referrals.',
        fullDescription: 'Doorstep home sample collection, NABL accredited laboratory testing, rapid digital report delivery within 24 hours, and automated doctor review.',
        icon: 'FlaskConical',
        features: ['Home Sample Pickup', 'Automated Lab Reports', 'Doctor Interpretation', 'Full Lipid & Metabolic Panels'],
        estimatedDuration: '15 mins sample collection',
        startingFee: 899,
        isEmergency: false
      },
      {
        name: 'Preventive Healthcare & Lifestyle Medicine',
        category: 'Preventive Healthcare',
        shortDescription: 'Proactive wellness roadmaps, metabolic screenings, and longevity plans.',
        fullDescription: 'Prevent disease before it strikes. Personalized cardiovascular risk scores, diabetes reversal plans, dietary guidance, and routine health maintenance schedules.',
        icon: 'Activity',
        features: ['Cardiovascular Risk Profiling', 'Diabetes Management', 'Nutritional Blueprint', 'Personalized Health Coach'],
        estimatedDuration: '45 mins',
        startingFee: 750,
        isEmergency: false
      }
    ]);

    // 3. Seed Doctors (Sample Data clearly marked)
    const doctors = await Doctor.insertMany([
      {
        name: 'Dr. Arvind Mehra',
        email: 'dr.arvind@careflow.com',
        phone: '+91 98201 11223',
        specialization: 'General Physician',
        experience: 14,
        qualification: 'MBBS, MD (Internal Medicine)',
        hospital: 'CareFlow Apollo Super-Speciality Hospital',
        rating: 4.9,
        reviewsCount: 142,
        consultationFee: 500,
        bio: 'Dr. Arvind Mehra is a distinguished general physician with over 14 years of clinical experience in adult internal medicine, lifestyle disorders, and viral management.',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableHours: { start: '09:00', end: '17:00' },
        isAvailable: true,
        isSample: true
      },
      {
        name: 'Dr. Priya Varma',
        email: 'dr.priya@careflow.com',
        phone: '+91 98332 22334',
        specialization: 'Cardiologist',
        experience: 16,
        qualification: 'MBBS, MD, DM (Cardiology), FACC',
        hospital: 'CareFlow Heart & Vascular Institute',
        rating: 4.95,
        reviewsCount: 188,
        consultationFee: 900,
        bio: 'Senior consultant cardiologist dedicated to preventive cardiology, hypertension control, coronary artery disease management, and cardiac rehabilitation.',
        avatar: 'https://images.unsplash.com/photo-1594824813583-b78c859d57a9?auto=format&fit=crop&q=80&w=300',
        availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        availableHours: { start: '10:00', end: '16:00' },
        isAvailable: true,
        isSample: true
      },
      {
        name: 'Dr. Natasha Sen',
        email: 'dr.natasha@careflow.com',
        phone: '+91 98443 33445',
        specialization: 'Psychiatrist & Mental Wellness Expert',
        experience: 11,
        qualification: 'MBBS, MD (Psychiatry), DPM',
        hospital: 'CareFlow Mind & Behavioral Center',
        rating: 4.88,
        reviewsCount: 96,
        consultationFee: 850,
        bio: 'Dr. Natasha specializes in cognitive behavioral therapy, anxiety alleviation, post-traumatic stress management, and modern psychopharmacology with utmost empathy.',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
        availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        availableHours: { start: '11:00', end: '18:00' },
        isAvailable: true,
        isSample: true
      },
      {
        name: 'Dr. Rajesh Nair',
        email: 'dr.rajesh@careflow.com',
        phone: '+91 98554 44556',
        specialization: 'Pediatrician',
        experience: 18,
        qualification: 'MBBS, DCH, MD (Pediatrics)',
        hospital: 'CareFlow Children & Maternity Hospital',
        rating: 4.92,
        reviewsCount: 210,
        consultationFee: 650,
        bio: 'Cherished by families for over 18 years, Dr. Nair is committed to child development, neonatal care, allergy treatments, and positive immunization experiences.',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableHours: { start: '09:30', end: '15:30' },
        isAvailable: true,
        isSample: true
      },
      {
        name: 'Dr. Sunita Kulkarni',
        email: 'dr.sunita@careflow.com',
        phone: '+91 98665 55667',
        specialization: 'Obstetrician & Gynecologist',
        experience: 15,
        qualification: 'MBBS, MS (OB-GYN), DGO',
        hospital: 'CareFlow Motherhood Pavilion',
        rating: 4.87,
        reviewsCount: 164,
        consultationFee: 750,
        bio: 'Dr. Kulkarni has guided thousands of expectant mothers through safe deliveries, specializing in high-risk pregnancies, PCOS remediation, and laparoscopic wellness.',
        avatar: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=300',
        availableDays: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
        availableHours: { start: '10:00', end: '17:00' },
        isAvailable: true,
        isSample: true
      },
      {
        name: 'Dr. Vikramaditya Roy',
        email: 'dr.vikram@careflow.com',
        phone: '+91 98776 66778',
        specialization: 'Dental Surgeon & Implantologist',
        experience: 12,
        qualification: 'BDS, MDS (Prosthodontics & Oral Implantology)',
        hospital: 'CareFlow Precision Dental Clinic',
        rating: 4.82,
        reviewsCount: 115,
        consultationFee: 550,
        bio: 'Expert in painless dental surgery, aesthetic smile design, micro-endodontics, and preventive periodontal disease therapies.',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
        availableDays: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
        availableHours: { start: '11:00', end: '19:00' },
        isAvailable: true,
        isSample: true
      }
    ]);

    // 4. Seed Health Awareness Articles (Clinically Reviewed)
    await HealthArticle.insertMany([
      {
        title: 'Understanding Early Warning Signs of Cardiovascular Strain',
        slug: 'early-warning-signs-of-cardiovascular-strain',
        category: 'Cardiovascular Health',
        summary: 'Learn how to detect subtle circulatory symptoms, manage everyday hypertension, and take immediate preventive action.',
        content: `Cardiovascular disease remains the leading cause of preventable mortality globally. However, the body frequently transmits early signals before acute cardiac episodes occur.

### Subtle Warning Signals:
1. **Unexplained Shortness of Breath**: Breathlessness during mild exertion, such as climbing a single flight of stairs.
2. **Persistent Upper Body Discomfort**: Dull aches radiating to the left shoulder, jaw, neck, or mid-back.
3. **Unusual Fatigue & Dizziness**: Feeling suddenly drained of energy or lightheaded upon mild physical exertion.
4. **Peripheral Edema**: Fluid retention causing noticeable swelling in ankles, feet, or lower legs.

### Action Steps for Prevention:
- Schedule a comprehensive lipid profile and ECG check once every 12 months.
- Limit dietary sodium intake to under 2,000 mg per day.
- Maintain at least 150 minutes of moderate aerobic activity weekly.

*Disclaimer: If you experience sudden crushing chest pressure radiating to the arm, call national emergency 112 immediately.*`,
        author: 'Dr. Priya Varma, DM (Cardiology)',
        authorRole: 'Senior Consultant Cardiologist',
        readTime: '5 min read',
        reviewedBy: 'CareFlow Clinical Review Board',
        imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600',
        tags: ['Cardiology', 'Heart Health', 'Hypertension', 'Prevention']
      },
      {
        title: 'Managing Everyday Anxiety: Cognitive Strategies That Actually Work',
        slug: 'managing-everyday-anxiety-cognitive-strategies',
        category: 'Mental Wellness',
        summary: 'Evidence-based cognitive restructuring methods, breath regulation protocols, and habits to overcome chronic worry.',
        content: `Chronic stress and acute anxiety activate the sympathetic nervous system, causing elevated heart rate, muscle tension, and catastrophic thinking loops.

### The 4-7-8 Respiratory Reset Protocol:
When feeling overwhelmed, engage your parasympathetic nervous system:
- Inhale quietly through your nose for a count of 4.
- Hold your breath steadily for a count of 7.
- Exhale completely through your mouth with a whoosh sound for 8.
- Repeat this sequence four times.

### Cognitive Reframing:
Identify "cognitive distortions" such as catastrophizing (assuming the worst outcome) or black-and-white thinking. Ask yourself:
1. What concrete factual evidence supports this worry?
2. What is the most realistic, probable outcome?
3. What constructive action can I take in the next 15 minutes?

Seek professional psychiatric or psychological guidance if anxiety interferes with sleep, work, or daily functioning.`,
        author: 'Dr. Natasha Sen, MD (Psychiatry)',
        authorRole: 'Head of Behavioral Health',
        readTime: '4 min read',
        reviewedBy: 'Dr. Ananya Sharma, MD',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
        tags: ['Mental Health', 'Anxiety', 'Wellness', 'Mindfulness']
      },
      {
        title: 'Essential First Aid Principles for Home and Workplace Emergencies',
        slug: 'essential-first-aid-principles-emergencies',
        category: 'Emergency Preparedness',
        summary: 'Crucial steps to take during burns, severe bleeding, choking, and sudden loss of consciousness before paramedics arrive.',
        content: `In an acute medical crisis, the first 5 minutes (often called the Golden Window) determine patient outcomes.

### The C-A-B First Aid Sequence:
- **C - Compressions**: If an adult is unresponsive and not breathing normally, place hands at the center of the chest and deliver hard, fast compressions (100–120 per minute) to the beat of "Stayin' Alive".
- **A - Airway**: Tilt head back gently, lift chin to ensure the respiratory passage is clear.
- **B - Breathing**: If trained, deliver rescue breaths or continue compression-only CPR until paramedics arrive.

### Severe Bleeding Control:
Apply firm, continuous direct pressure onto the wound using a clean cloth or sterile gauze. Do not remove saturated bandages; instead, place additional layers over them and maintain firm pressure.

### Burns Management:
Cool the burn under gentle, running cool tap water for 10-20 minutes. Never apply ice, butter, or greasy ointments.

*Important: For all life-threatening conditions in India, dial 112 immediately without delay.*`,
        author: 'Dr. Evelyn Reed, MD',
        authorRole: 'Chief Medical Officer',
        readTime: '6 min read',
        reviewedBy: 'CareFlow Emergency Trauma Committee',
        imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
        tags: ['First Aid', 'Emergency', 'CPR', 'Safety']
      },
      {
        title: 'Nutrition Blueprints: Balancing Blood Glucose for Sustained Vitality',
        slug: 'nutrition-blueprints-balancing-blood-glucose',
        category: 'Nutrition & Diet',
        summary: 'How strategic fiber, healthy fats, and protein timing reduce insulin resistance and enhance day-long cognitive stamina.',
        content: `Blood glucose volatility is responsible for mid-afternoon energy crashes, irritability, and long-term metabolic dysregulation.

### Food Sequencing Technique:
Clinical trials demonstrate that changing the order in which you consume nutrients profoundly affects glucose spikes:
1. **Fibers First**: Begin meals with salad or non-starchy vegetables. Fiber coats the digestive tract, slowing carbohydrate absorption.
2. **Proteins & Fats Second**: Follow with eggs, tofu, fish, chicken, or legumes.
3. **Starches & Sugars Last**: Consume rice, bread, or carbohydrates at the conclusion of the meal.

This simple routine can reduce post-meal glucose spikes by up to 40% without restrictive calorie counting!`,
        author: 'CareFlow Clinical Nutrition Department',
        authorRole: 'Registered Dietitians Panel',
        readTime: '4 min read',
        reviewedBy: 'Dr. Arvind Mehra, MD',
        imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600',
        tags: ['Nutrition', 'Diabetes Prevention', 'Energy', 'Metabolism']
      }
    ]);

    // 5. Seed Sample Appointments for Demo Patient
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);

    await Appointment.create({
      patient: patientUser._id,
      doctor: doctors[0]._id, // Dr. Arvind Mehra
      patientName: patientUser.name,
      patientPhone: patientUser.phone,
      patientEmail: patientUser.email,
      patientAge: 30,
      patientGender: 'male',
      serviceType: 'General Consultation',
      appointmentDate: tomorrow,
      timeSlot: '10:30 AM',
      reasonForVisit: 'Annual routine health checkup and seasonal allergy consultation.',
      symptoms: 'Mild morning sneezing and occasional fatigue.',
      notes: 'Prefers morning slot.',
      status: 'Confirmed',
      adminNotes: 'Confirmed by front desk. Patient requested digital prescription.'
    });

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);

    await Appointment.create({
      patient: patientUser._id,
      doctor: doctors[1]._id, // Dr. Priya Varma
      patientName: patientUser.name,
      patientPhone: patientUser.phone,
      patientEmail: patientUser.email,
      patientAge: 30,
      patientGender: 'male',
      serviceType: 'Cardiovascular Health',
      appointmentDate: pastDate,
      timeSlot: '02:00 PM',
      reasonForVisit: 'Preventive resting ECG and blood pressure review.',
      symptoms: 'Occasional elevated heart rate during work meetings.',
      status: 'Completed',
      adminNotes: 'ECG normal, advised regular aerobic exercise and stress management.'
    });

    // 6. Seed Sample Health Report for Demo Patient
    await HealthReport.create({
      user: patientUser._id,
      title: 'Persistent Lower Back Discomfort Following Desk Work',
      category: 'General Health',
      description: 'Experiencing a dull, persistent ache in the lumbar region after 6-8 hours of continuous desk work. Discomfort eases when walking.',
      symptoms: ['Lower back stiffness', 'Muscle tightness', 'Mild ache after sitting'],
      urgencyLevel: 'Low',
      status: 'Advisor Responded',
      advisorFeedback: 'Hello Rahul. The symptoms described are classic indicators of postural lumbar strain from prolonged seated posture. We recommend ergonomic lumbar support, taking a 3-minute walking break every 45 minutes, and gentle hamstring/core stretches. If pain radiates down either leg, please book an in-person physical therapy session.',
      advisorName: 'Dr. Evelyn Reed (CMO)',
      respondedAt: new Date(),
      disclaimerAcknowledged: true
    });

    // 7. Seed Sample Medicine Reminders for Demo Patient
    await MedicineReminder.create([
      {
        user: patientUser._id,
        medicineName: 'Vitamin D3 & Calcium Supplement',
        dosage: '1 Capsule (60,000 IU monthly or daily maintenance 1000 IU)',
        frequency: 'Once daily',
        reminderTime: '08:30 AM',
        startDate: new Date(),
        notes: 'Take after breakfast with water for optimal absorption.',
        isCompleted: true,
        lastTakenAt: new Date()
      },
      {
        user: patientUser._id,
        medicineName: 'Omega-3 Fish Oil (EPA / DHA)',
        dosage: '1 Softgel (1000mg)',
        frequency: 'Once daily',
        reminderTime: '01:30 PM',
        startDate: new Date(),
        notes: 'Take right after lunch.',
        isCompleted: false
      },
      {
        user: patientUser._id,
        medicineName: 'Hydration & Electrolyte Drink',
        dosage: '1 Glass (250ml)',
        frequency: 'Twice daily',
        reminderTime: '05:00 PM',
        startDate: new Date(),
        notes: 'Hydration reminder before evening workout.',
        isCompleted: false
      }
    ]);

    console.log('✅ CareFlow seed data successfully generated!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = { seedInitialData };
