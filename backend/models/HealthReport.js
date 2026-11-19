const mongoose = require('mongoose');

const healthReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide report title'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select category'],
      enum: [
        'General Health',
        'Mental Wellness',
        "Women's Health",
        'Pediatric Concern',
        'Dental Issue',
        'Skin / Dermatology',
        'Chronic Illness Management',
        'Digestive Health',
        'Other'
      ]
    },
    description: {
      type: String,
      required: [true, 'Please provide problem description']
    },
    symptoms: {
      type: [String],
      default: []
    },
    urgencyLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
      required: true
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Advisor Responded', 'Resolved'],
      default: 'Submitted'
    },
    advisorFeedback: {
      type: String,
      default: ''
    },
    advisorName: {
      type: String,
      default: ''
    },
    respondedAt: {
      type: Date
    },
    disclaimerAcknowledged: {
      type: Boolean,
      default: true // Not an emergency service
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('HealthReport', healthReportSchema);
