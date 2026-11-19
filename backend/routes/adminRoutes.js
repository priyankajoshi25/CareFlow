const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getAdminUsers,
  updateUserRole,
  deleteUser,
  getAdminAppointments
} = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken, requireAdmin);

router.get('/dashboard', getAdminDashboardStats);
router.get('/users', getAdminUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/appointments', getAdminAppointments);

module.exports = router;
