const HealthArticle = require('../models/HealthArticle');

// @desc    Get all health awareness articles
// @route   GET /api/articles
// @access  Public
const getArticles = async (req, res, next) => {
  try {
    const { category, search, tag } = req.query;
    let query = { isPublished: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { summary: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') }
      ];
    }

    const articles = await HealthArticle.find(query).sort({ publishedAt: -1 });

    res.json({
      success: true,
      count: articles.length,
      articles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get article by slug or ID
// @route   GET /api/articles/:identifier
// @access  Public
const getArticle = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let article;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      article = await HealthArticle.findById(identifier);
    } else {
      article = await HealthArticle.findOne({ slug: identifier });
    }

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Health awareness article not found.'
      });
    }

    res.json({
      success: true,
      article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create health article
// @route   POST /api/articles
// @access  Private/Admin
const createArticle = async (req, res, next) => {
  try {
    const { title, category, summary, content, author, authorRole, readTime, reviewedBy, imageUrl, tags } = req.body;

    if (!title || !category || !summary || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, summary, and content are required.'
      });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const article = await HealthArticle.create({
      title,
      slug,
      category,
      summary,
      content,
      author: author || 'CareFlow Medical Advisory Panel',
      authorRole: authorRole || 'Medical Specialist',
      readTime: readTime || '4 min read',
      reviewedBy: reviewedBy || 'CareFlow Clinical Review Board',
      imageUrl: imageUrl || '',
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : [])
    });

    res.status(201).json({
      success: true,
      message: 'Article published successfully.',
      article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update health article
// @route   PUT /api/articles/:id
// @access  Private/Admin
const updateArticle = async (req, res, next) => {
  try {
    const article = await HealthArticle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.'
      });
    }

    res.json({
      success: true,
      message: 'Article updated successfully.',
      article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete health article
// @route   DELETE /api/articles/:id
// @access  Private/Admin
const deleteArticle = async (req, res, next) => {
  try {
    const article = await HealthArticle.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.'
      });
    }

    res.json({
      success: true,
      message: 'Article removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle
};
