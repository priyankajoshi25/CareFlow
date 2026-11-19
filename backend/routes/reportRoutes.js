const express = require('express');
const router = express.Router();
const {
  createReport,
  getReports,
  getReportById,
  updateReport
} = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', createReport);
router.get('/', getReports);
router.get('/:id', getReportById);
router.put('/:id', updateReport);

module.exports = router;
