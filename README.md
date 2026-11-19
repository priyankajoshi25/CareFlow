# CareFlow – Healthcare Problem Solving Platform

> **"Your Health, Our Priority."**

CareFlow is a modern, full-stack healthcare web application designed to solve real-life healthcare challenges by connecting patients with certified medical providers, organizing doctor appointments, tracking non-emergency health concerns, managing daily medication reminders, and delivering reviewed health awareness education.

---

## 🌟 Key Features

### 1. Homepage & Medical Hero
- Clean healthcare SaaS interface with soft teal, cyan, and blue accents.
- Live search across healthcare services, doctors, and health topics.
- Rapid emergency access banner (Dial **112** for India).
- Featured healthcare services across 8 clinical categories.
- Educational health awareness articles preview.
- 4-step "How CareFlow Works" walkthrough.
- Verified patient testimonials.
- Comprehensive footer with emergency helplines and legal medical disclaimers.

### 2. User Authentication & Security
- User registration and login with JWT and bcrypt password hashing.
- Role-Based Access Control (RBAC): Separate **Patient** and **Administrator** privileges.
- Pre-seeded quick demo accounts (One-click login for demo Patient and Admin).
- Password change and simulated password reset workflows.
- Profile picture uploads via Multer with file type and size restrictions.

### 3. Patient Dashboard
- Personalized welcome greeting and profile summary.
- Upcoming appointments with real-time status badges (`Pending`, `Confirmed`, `Completed`, `Cancelled`).
- Quick actions for booking appointments, reporting health concerns, adding reminders, and emergency assistance.
- Daily medication reminders with one-click completion toggle.
- Health problem report status tracking.

### 4. Healthcare Services Directory
Full catalog across all **8 mandatory categories**:
1. General Consultation
2. Mental Wellness
3. Emergency Assistance (Hotline 112)
4. Women's Healthcare
5. Child Healthcare (Pediatrics)
6. Dental Care
7. Diagnostic Services
8. Preventive Healthcare
- Real-time search, category filtering, and modal detail inspection.

### 5. Doctor Directory & Sample Provider Transparency
- Certified doctor profiles with qualifications, years of experience, hospital affiliations, consultation fees, and available hours.
- **Sample Data Transparency Notice**: Clearly labeled sample doctor profiles for demo purposes until live hospital systems are integrated.
- Direct booking link with preselected doctor.

### 6. Appointment Booking System
- Physician selection from directory.
- Date picker with same-day minimum restriction.
- Available slot selection (Morning & Afternoon slots).
- Patient information collection (name, phone, email, age, gender, visit reason, symptoms, notes).
- Slot conflict prevention.
- Appointment lifecycle management: Cancel, confirm, or complete visits.

### 7. Health Problem Reporting & Triage
- Non-emergency health concern submission form (title, category, detailed description, symptoms, urgency level: `Low`, `Medium`, `High`).
- **Prominent Emergency Warning**: Clear notice that this tool does not replace emergency medical care.
- Status tracking: `Submitted` ➔ `Under Review` ➔ `Advisor Responded` ➔ `Resolved`.
- Clinical advisor review notes and recommendations.

### 8. Medicine & Health Reminders
- Add daily reminders with medicine/supplement name, dosage instructions, frequency, and reminder time.
- Interactive toggle to mark medication as taken.
- Active vs. completed reminder history.
- **Disclaimer**: Scheduling tool only; does not prescribe or endorse medicines.

### 9. Emergency Assistance (India 112)
- Direct click-to-call for India's National Emergency Hotline (**112**).
- Helplines for Ambulance (**108/102**), Mental Health (**14416 - Tele-MANAS**), Women Safety (**1091**), and Poison Control.
- Basic First-Aid protocols: Chest pain/heart attack, severe bleeding control, adult CPR, stroke FAST protocol, and burns management.
- Zero-delay directive: Never wait for online forms during life-threatening crises.

### 10. Health Awareness Articles
- Clinically reviewed educational articles with read times and author details.
- Category search and filtering.
- Full markdown reading view.

### 11. User Profile Management
- Manage personal details, phone, blood group, emergency contact, date of birth, address, and medical history.
- Profile picture upload.
- Secure password change.

### 12. Administrator Dashboard
- Executive stats: Registered users, appointments, doctors, services, health problem reports, articles.
- Appointment status breakdown charts and instant status modification.
- User management: Toggle roles between `patient` and `admin`, delete users.
- Doctor management: Add, edit, and delete doctor profiles.
- Healthcare services management: Add, edit, and delete services.
- Health problem reports review: Submit clinical advisor feedback and update triage status.
- Article management: Publish, edit, and delete educational articles.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js 18, Tailwind CSS, React Router DOM v6, Axios, Lucide React Icons, Vite |
| **Backend** | Node.js, Express.js REST API |
| **Database** | MongoDB with Mongoose ODM (Zero-config embedded MongoDB runner included) |
| **Authentication**| JWT (JSON Web Tokens), bcryptjs |
| **File Storage** | Multer for secure avatar uploads |

---

## 📁 Project Folder Structure

```
CareFlow/
  frontend/
    public/
    src/
      assets/
      components/
        common/          # Navbar, Footer, etc.
      context/
        AuthContext.jsx  # Authentication state & session manager
      hooks/
        useAuth.js
      layouts/
        MainLayout.jsx       # Public layout
        DashboardLayout.jsx  # Responsive sidebar dashboard layout
        ProtectedRoute.jsx   # Patient & Admin route guards
      pages/
        Home.jsx
        Login.jsx
        Register.jsx
        ForgotPassword.jsx
        Services.jsx
        Doctors.jsx
        BookAppointment.jsx
        Appointments.jsx
        ReportProblem.jsx
        HealthReports.jsx
        Reminders.jsx
        Emergency.jsx
        Articles.jsx
        ArticleDetail.jsx
        Profile.jsx
        admin/
          AdminDashboard.jsx
          AdminUsers.jsx
          AdminDoctors.jsx
          AdminServices.jsx
          AdminAppointments.jsx
          AdminReports.jsx
          AdminArticles.jsx
      services/          # Axios API service clients
        api.js
        authService.js
        doctorService.js
        appointmentService.js
        healthcareService.js
        reportService.js
        reminderService.js
        articleService.js
        adminService.js
      App.jsx
      main.jsx
      index.css
    package.json
    vite.config.js
    tailwind.config.js
  backend/
    config/
      db.js              # MongoDB Atlas / local / embedded runner
    controllers/
      authController.js
      doctorController.js
      appointmentController.js
      serviceController.js
      reportController.js
      reminderController.js
      articleController.js
      adminController.js
    middleware/
      authMiddleware.js   # verifyToken, requireAdmin
      uploadMiddleware.js # Multer avatar upload handler
      errorHandler.js     # Centralized error handler
    models/
      User.js
      Doctor.js
      Appointment.js
      HealthcareService.js
      HealthReport.js
      MedicineReminder.js
      HealthArticle.js
    routes/
      authRoutes.js
      doctorRoutes.js
      appointmentRoutes.js
      serviceRoutes.js
      reportRoutes.js
      reminderRoutes.js
      articleRoutes.js
      adminRoutes.js
    services/
      seedService.js      # Auto-seeds realistic doctors, services, articles, demo accounts
    uploads/
    server.js
    .env
    .env.example
    package.json
```

---

## 🚀 Step-by-Step Instructions to Run

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

> **Zero-Config Database**: If you do not have a local MongoDB daemon running, CareFlow automatically initializes a high-performance embedded MongoDB instance on startup, seeds it with realistic healthcare data, and starts the server immediately. You can also specify an external URI in `backend/.env`.

---

### Step 1: Start the Backend Server

Open a terminal window:

```bash
# Navigate to the backend directory
cd backend

# Install dependencies (if not already installed)
npm install

# Start the backend server
npm start
```

*The backend server will start on `http://localhost:5000`.*
*Health check endpoint:* `http://localhost:5000/api/health`

---

### Step 2: Start the Frontend Application

Open a second terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start the Vite development server
npm run dev
```

*The frontend application will be accessible at `http://localhost:5173`.*

---

## 🔑 Demo Login Accounts

CareFlow comes pre-populated with sample accounts for instant testing:

| Role | Email | Password | Description |
|---|---|---|---|
| **Patient** | `patient@careflow.com` | `patient123` | Pre-loaded with appointments, health reports, and reminders |
| **Admin** | `admin@careflow.com` | `admin123` | Full access to the Admin Console, User management, Doctors, Services |

*(You can also register a new account on the registration page at `/register`)*

---

## 📡 REST API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Create patient/admin account
- `POST /api/auth/login` - Authenticate and receive JWT
- `GET /api/auth/profile` - Get logged-in user profile
- `PUT /api/auth/profile` - Update personal & emergency information
- `POST /api/auth/upload-avatar` - Upload profile image
- `PUT /api/auth/change-password` - Update password

### Healthcare Services
- `GET /api/services` - List services (with category and keyword filters)
- `GET /api/services/:id` - Service details
- `POST /api/services` - Add service (Admin)
- `PUT /api/services/:id` - Update service (Admin)
- `DELETE /api/services/:id` - Delete service (Admin)

### Doctors
- `GET /api/doctors` - Directory of doctors (specialty, search filters)
- `GET /api/doctors/:id` - Doctor details
- `POST /api/doctors` - Create doctor profile (Admin)
- `PUT /api/doctors/:id` - Update doctor profile (Admin)
- `DELETE /api/doctors/:id` - Delete doctor profile (Admin)

### Appointments
- `POST /api/appointments` - Book a consultation
- `GET /api/appointments` - Patient's appointments (or all for Admin)
- `GET /api/appointments/:id` - Appointment details
- `PUT /api/appointments/:id` - Update status or notes
- `DELETE /api/appointments/:id` - Cancel appointment

### Health Reports
- `POST /api/reports` - Submit health concern
- `GET /api/reports` - Get health reports
- `GET /api/reports/:id` - Get report detail
- `PUT /api/reports/:id` - Update status / Advisor feedback

### Medicine Reminders
- `POST /api/reminders` - Add medication reminder
- `GET /api/reminders` - Get reminders for current patient
- `PUT /api/reminders/:id` - Toggle completed / update reminder
- `DELETE /api/reminders/:id` - Remove reminder

### Admin
- `GET /api/admin/dashboard` - Platform statistics
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/role` - Toggle user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/appointments` - Admin appointment management

---

## 🔒 Security & Privacy Practices

- Passwords hashed using `bcryptjs` with salt rounds.
- Stateless authentication using signed JWT tokens stored securely.
- Role-based route authorization guards for patient and admin views.
- Strict input validation and sanitization on all controllers.
- Ownership checks: Users can only view and mutate their own private appointments and health reports.
- File upload restrictions: Image mime-types only, limited to 5MB.

---

## ⚖️ Medical & Emergency Disclaimer

All information, services, and content provided on CareFlow are for educational, organizational, and non-emergency triage purposes only. They do not constitute formal medical diagnosis, individualized treatment, or pharmaceutical prescription.

In life-threatening situations (sudden chest pain, stroke symptoms, uncontrolled bleeding, severe trauma, or acute breathing difficulties), **immediately dial 112 in India** or visit the nearest hospital casualty emergency ward.
