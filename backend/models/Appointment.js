const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    },
    patientName: {
      type: String,
      required: [true, 'Please provide patient name'],
      trim: true
    },
    patientPhone: {
      type: String,
      required: [true, 'Please provide contact phone number']
    },
    patientEmail: {
      type: String,
      trim: true
    },
    patientAge: {
      type: Number,
      min: 0,
      max: 125
    },
    patientGender: {
      type: String,
      enum: ['male', 'female', 'other', 'unspecified'],
      default: 'unspecified'
    },
    serviceType: {
      type: String,
      default: 'General Consultation'
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Please provide appointment date']
    },
    timeSlot: {
      type: String,
      required: [true, 'Please provide appointment time slot']
    },
    reasonForVisit: {
      type: String,
      required: [true, 'Please provide reason for visit']
    },
    symptoms: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
