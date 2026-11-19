const mongoose = require('mongoose');

const healthcareServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide service name'],
      trim: true,
      unique: true
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      enum: [
        'General Consultation',
        'Mental Wellness',
        'Emergency Assistance',
        "Women's Healthcare",
        'Child Healthcare',
        'Dental Care',
        'Diagnostic Services',
        'Preventive Healthcare'
      ]
    },
    shortDescription: {
      type: String,
      required: [true, 'Please provide short description']
    },
    fullDescription: {
      type: String,
      required: [true, 'Please provide full description']
    },
    icon: {
      type: String,
      default: 'Activity'
    },
    features: {
      type: [String],
      default: []
    },
    estimatedDuration: {
      type: String,
      default: '30-45 mins'
    },
    startingFee: {
      type: Number,
      default: 0
    },
    isEmergency: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('HealthcareService', healthcareServiceSchema);
