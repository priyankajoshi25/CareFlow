const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
} = require('../controllers/doctorController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.post('/', verifyToken, requireAdmin, createDoctor);
router.put('/:id', verifyToken, requireAdmin, updateDoctor);
router.delete('/:id', verifyToken, requireAdmin, deleteDoctor);

module.exports = router;
