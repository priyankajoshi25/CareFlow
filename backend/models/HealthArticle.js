const mongoose = require('mongoose');

const healthArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide article title'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    category: {
      type: String,
      required: [true, 'Please provide article category'],
      enum: [
        'Preventive Healthcare',
        'Mental Wellness',
        'Nutrition & Diet',
        'Cardiovascular Health',
        "Women's Health",
        'Child & Pediatric Care',
        'Emergency Preparedness',
        'Healthy Living'
      ]
    },
    summary: {
      type: String,
      required: [true, 'Please provide summary']
    },
    content: {
      type: String,
      required: [true, 'Please provide article content']
    },
    author: {
      type: String,
      default: 'CareFlow Medical Advisory Panel'
    },
    authorRole: {
      type: String,
      default: 'Board Certified Health Specialist'
    },
    readTime: {
      type: String,
      default: '4 min read'
    },
    reviewedBy: {
      type: String,
      default: 'Dr. Ananya Sharma, MD, Senior Medical Reviewer'
    },
    imageUrl: {
      type: String,
      default: ''
    },
    tags: {
      type: [String],
      default: []
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    publishedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('HealthArticle', healthArticleSchema);
