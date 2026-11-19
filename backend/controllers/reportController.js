const HealthReport = require('../models/HealthReport');

// @desc    Submit a health problem concern report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res, next) => {
  try {
    const {
      title,
      category,
      description,
      symptoms,
      urgencyLevel,
      disclaimerAcknowledged
    } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and problem description are required.'
      });
    }

    const report = await HealthReport.create({
      user: req.user._id,
      title,
      category,
      description,
      symptoms: Array.isArray(symptoms) ? symptoms : (symptoms ? [symptoms] : []),
      urgencyLevel: urgencyLevel || 'Low',
      status: 'Submitted',
      disclaimerAcknowledged: disclaimerAcknowledged !== undefined ? disclaimerAcknowledged : true
    });

    res.status(201).json({
      success: true,
      message: 'Health concern report submitted successfully. An advisor will review your concern shortly.',
      report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's reports (or all if admin)
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const reports = await HealthReport.find(query)
      .populate('user', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single report by ID
// @route   GET /api/reports/:id
// @access  Private
const getReportById = async (req, res, next) => {
  try {
    const report = await HealthReport.findById(req.params.id).populate(
      'user',
      'name email phone avatar'
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Health report not found.'
      });
    }

    if (
      req.user.role !== 'admin' &&
      report.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this health report.'
      });
    }

    res.json({
      success: true,
      report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status or advisor feedback
// @route   PUT /api/reports/:id
// @access  Private
const updateReport = async (req, res, next) => {
  try {
    const report = await HealthReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Health report not found.'
      });
    }

    const isOwner = report.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const { status, advisorFeedback, advisorName, description, urgencyLevel } = req.body;

    if (isAdmin) {
      if (status) report.status = status;
      if (advisorFeedback !== undefined) report.advisorFeedback = advisorFeedback;
      if (advisorName) report.advisorName = advisorName;
      if (advisorFeedback || status === 'Advisor Responded' || status === 'Resolved') {
        report.respondedAt = new Date();
      }
    }

    if (isOwner && report.status === 'Submitted') {
      if (description) report.description = description;
      if (urgencyLevel) report.urgencyLevel = urgencyLevel;
    }

    await report.save();

    res.json({
      success: true,
      message: 'Health report updated successfully.',
      report
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReport
};
