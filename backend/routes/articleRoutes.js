const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle
} = require('../controllers/articleController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getArticles);
router.get('/:identifier', getArticle);
router.post('/', verifyToken, requireAdmin, createArticle);
router.put('/:id', verifyToken, requireAdmin, updateArticle);
router.delete('/:id', verifyToken, requireAdmin, deleteArticle);

module.exports = router;
