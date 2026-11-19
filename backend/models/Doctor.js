const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide doctor name'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      default: ''
    },
    specialization: {
      type: String,
      required: [true, 'Please provide specialization'],
      trim: true
    },
    experience: {
      type: Number,
      required: [true, 'Please provide years of experience'],
      min: [0, 'Experience cannot be negative']
    },
    qualification: {
      type: String,
      required: [true, 'Please provide qualification']
    },
    hospital: {
      type: String,
      default: 'CareFlow Health Network'
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 24
    },
    consultationFee: {
      type: Number,
      required: [true, 'Please provide consultation fee'],
      min: 0
    },
    bio: {
      type: String,
      required: [true, 'Please provide doctor bio']
    },
    avatar: {
      type: String,
      default: ''
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    availableHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' }
    },
    slotDuration: {
      type: Number,
      default: 30 // minutes
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    isSample: {
      type: Boolean,
      default: true // Clearly labeled sample data
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);
