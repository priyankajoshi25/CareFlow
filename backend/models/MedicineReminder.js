const mongoose = require('mongoose');

const medicineReminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    medicineName: {
      type: String,
      required: [true, 'Please provide medicine or supplement name'],
      trim: true
    },
    dosage: {
      type: String,
      required: [true, 'Please provide dosage instructions (e.g., 500mg, 1 tablet)']
    },
    frequency: {
      type: String,
      required: [true, 'Please provide reminder frequency'],
      enum: ['Once daily', 'Twice daily', 'Thrice daily', 'Every 8 hours', 'Before meals', 'After meals', 'As needed']
    },
    reminderTime: {
      type: String,
      required: [true, 'Please set reminder time (e.g., 08:30 AM)']
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    notes: {
      type: String,
      default: ''
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    lastTakenAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('MedicineReminder', medicineReminderSchema);
