const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res, next) => {
  try {
    const {
      doctorId,
      patientName,
      patientPhone,
      patientEmail,
      patientAge,
      patientGender,
      serviceType,
      appointmentDate,
      timeSlot,
      reasonForVisit,
      symptoms,
      notes
    } = req.body;

    if (!doctorId || !appointmentDate || !timeSlot || !reasonForVisit) {
      return res.status(400).json({
        success: false,
        message: 'Doctor, appointment date, time slot, and reason for visit are required.'
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Selected doctor could not be found.'
      });
    }

    // Check if slot is already booked for this doctor on that date & time
    const parsedDate = new Date(appointmentDate);
    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      timeSlot,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['Pending', 'Confirmed'] }
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: `The time slot (${timeSlot}) is already booked for this doctor. Please pick another available time slot.`
      });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      patientName: patientName || req.user.name,
      patientPhone: patientPhone || req.user.phone || 'Not provided',
      patientEmail: patientEmail || req.user.email,
      patientAge: patientAge || undefined,
      patientGender: patientGender || req.user.gender || 'unspecified',
      serviceType: serviceType || doctor.specialization,
      appointmentDate,
      timeSlot,
      reasonForVisit,
      symptoms: symptoms || '',
      notes: notes || '',
      status: 'Pending'
    });

    const populatedAppointment = await Appointment.findById(appointment._id).populate(
      'doctor',
      'name specialization hospital avatar consultationFee'
    );

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      appointment: populatedAppointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's appointments (or all appointments if admin)
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      // Patients only see their own appointments
      query.patient = req.user._id;
    }

    const appointments = await Appointment.find(query)
      .populate('doctor', 'name specialization hospital consultationFee avatar phone')
      .populate('patient', 'name email phone avatar')
      .sort({ appointmentDate: -1, createdAt: -1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor', 'name specialization hospital consultationFee avatar phone email')
      .populate('patient', 'name email phone avatar');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    // Authorization check
    if (
      req.user.role !== 'admin' &&
      appointment.patient._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this appointment record.'
      });
    }

    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment details or status
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    // Authorization check
    const isOwner = appointment.patient.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const {
      status,
      appointmentDate,
      timeSlot,
      reasonForVisit,
      notes,
      adminNotes
    } = req.body;

    if (status) {
      // Allowed statuses: Pending, Confirmed, Completed, Cancelled
      if (['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
        appointment.status = status;
      }
    }

    if (appointmentDate) appointment.appointmentDate = appointmentDate;
    if (timeSlot) appointment.timeSlot = timeSlot;
    if (reasonForVisit) appointment.reasonForVisit = reasonForVisit;
    if (notes !== undefined) appointment.notes = notes;
    if (isAdmin && adminNotes !== undefined) appointment.adminNotes = adminNotes;

    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate('doctor', 'name specialization hospital consultationFee avatar')
      .populate('patient', 'name email phone');

    res.json({
      success: true,
      message: 'Appointment updated successfully.',
      appointment: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    const isOwner = appointment.patient.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    // Rather than hard deletion, mark as Cancelled or delete if admin requested
    if (req.query.hardDelete === 'true' && isAdmin) {
      await Appointment.findByIdAndDelete(req.params.id);
      return res.json({
        success: true,
        message: 'Appointment record permanently deleted.'
      });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully.',
      appointment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
};
