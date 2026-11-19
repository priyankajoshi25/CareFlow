const express = require('express');
const router = express.Router();
const {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder
} = require('../controllers/reminderController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', createReminder);
router.get('/', getReminders);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

module.exports = router;
