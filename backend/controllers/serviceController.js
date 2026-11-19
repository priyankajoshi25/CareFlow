const HealthcareService = require('../models/HealthcareService');

// @desc    Get all healthcare services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
  try {
    const { category, search, isEmergency } = req.query;
    let query = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (isEmergency !== undefined) {
      query.isEmergency = isEmergency === 'true';
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { shortDescription: new RegExp(search, 'i') },
        { fullDescription: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') }
      ];
    }

    const services = await HealthcareService.find(query).sort({ category: 1, name: 1 });

    res.json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single healthcare service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res, next) => {
  try {
    const service = await HealthcareService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Healthcare service not found.'
      });
    }

    res.json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new healthcare service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res, next) => {
  try {
    const service = await HealthcareService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Healthcare service added successfully.',
      service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update healthcare service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res, next) => {
  try {
    const service = await HealthcareService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Healthcare service not found.'
      });
    }

    res.json({
      success: true,
      message: 'Healthcare service updated successfully.',
      service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete healthcare service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res, next) => {
  try {
    const service = await HealthcareService.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Healthcare service not found.'
      });
    }

    res.json({
      success: true,
      message: 'Healthcare service deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};
