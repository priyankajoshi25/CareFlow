const MedicineReminder = require('../models/MedicineReminder');

// @desc    Create a new medicine reminder
// @route   POST /api/reminders
// @access  Private
const createReminder = async (req, res, next) => {
  try {
    const {
      medicineName,
      dosage,
      frequency,
      reminderTime,
      startDate,
      endDate,
      notes
    } = req.body;

    if (!medicineName || !dosage || !frequency || !reminderTime) {
      return res.status(400).json({
        success: false,
        message: 'Medicine name, dosage, frequency, and reminder time are required.'
      });
    }

    const reminder = await MedicineReminder.create({
      user: req.user._id,
      medicineName,
      dosage,
      frequency,
      reminderTime,
      startDate: startDate || new Date(),
      endDate: endDate || undefined,
      notes: notes || '',
      isCompleted: false
    });

    res.status(201).json({
      success: true,
      message: 'Medicine reminder set successfully.',
      reminder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reminders for current user
// @route   GET /api/reminders
// @access  Private
const getReminders = async (req, res, next) => {
  try {
    const reminders = await MedicineReminder.find({ user: req.user._id }).sort({
      isCompleted: 1,
      reminderTime: 1
    });

    res.json({
      success: true,
      count: reminders.length,
      reminders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update reminder (toggle complete or update details)
// @route   PUT /api/reminders/:id
// @access  Private
const updateReminder = async (req, res, next) => {
  try {
    const reminder = await MedicineReminder.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found or access denied.'
      });
    }

    const {
      isCompleted,
      medicineName,
      dosage,
      frequency,
      reminderTime,
      notes
    } = req.body;

    if (isCompleted !== undefined) {
      reminder.isCompleted = isCompleted;
      if (isCompleted) {
        reminder.lastTakenAt = new Date();
      }
    }

    if (medicineName) reminder.medicineName = medicineName;
    if (dosage) reminder.dosage = dosage;
    if (frequency) reminder.frequency = frequency;
    if (reminderTime) reminder.reminderTime = reminderTime;
    if (notes !== undefined) reminder.notes = notes;

    await reminder.save();

    res.json({
      success: true,
      message: 'Reminder updated successfully.',
      reminder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
const deleteReminder = async (req, res, next) => {
  try {
    const reminder = await MedicineReminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found or access denied.'
      });
    }

    res.json({
      success: true,
      message: 'Reminder removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder
};
