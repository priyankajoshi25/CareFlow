import React, { useState, useEffect } from 'react';
import { articleService } from '../../services/articleService';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Clock,
  ShieldCheck
} from 'lucide-react';

const articleCategories = [
  'Preventive Healthcare',
  'Mental Wellness',
  'Nutrition & Diet',
  'Cardiovascular Health',
  "Women's Health",
  'Child & Pediatric Care',
  'Emergency Preparedness',
  'Healthy Living'
];

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Preventive Healthcare',
    summary: '',
    content: '',
    author: 'CareFlow Medical Advisory Panel',
    authorRole: 'Health Specialist',
    readTime: '4 min read',
    reviewedBy: 'Dr. Evelyn Reed (CMO)',
    imageUrl: '',
    tags: 'Health, Wellness, Preventive'
  });

  useEffect(() => {
    fetchArticles();
  }, [search]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await articleService.getArticles({ search });
      setArticles(res.articles || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load articles.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      category: 'Preventive Healthcare',
      summary: '',
      content: '',
      author: 'CareFlow Medical Advisory Panel',
      authorRole: 'Board Certified Health Specialist',
      readTime: '4 min read',
      reviewedBy: 'Dr. Evelyn Reed (CMO)',
      imageUrl: '',
      tags: 'Prevention, Wellness'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (art) => {
    setEditingArticle(art);
    setFormData({
      title: art.title,
      category: art.category,
      summary: art.summary,
      content: art.content,
      author: art.author,
      authorRole: art.authorRole || 'Health Specialist',
      readTime: art.readTime || '4 min read',
      reviewedBy: art.reviewedBy || 'CareFlow Clinical Board',
      imageUrl: art.imageUrl || '',
      tags: art.tags?.join(', ') || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this health awareness article?')) return;
    try {
      await articleService.deleteArticle(id);
      setSuccess('Article removed.');
      fetchArticles();
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError('Could not delete article.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const tagsArray = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      tags: tagsArray
    };

    try {
      if (editingArticle) {
        await articleService.updateArticle(editingArticle._id, payload);
        setSuccess('Article updated successfully.');
      } else {
        await articleService.createArticle(payload);
        setSuccess('Article published successfully.');
      }
      setModalOpen(false);
      fetchArticles();
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save article.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Manage Health Articles</h1>
          <p className="text-slate-500 text-sm mt-1">
            Author and edit clinically reviewed awareness articles and preventive health roadmaps.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchArticles}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button
            onClick={handleOpenAdd}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Publish Article
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by article title or category..."
          className="form-input pl-10"
        />
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-3 text-center py-16 text-slate-400">Loading articles...</p>
        ) : articles.length === 0 ? (
          <p className="col-span-3 text-center py-16 text-slate-400">No articles found.</p>
        ) : (
          articles.map((art) => (
            <div
              key={art._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div>
                {art.imageUrl && (
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-teal-700">{art.category}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {art.readTime}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-2">{art.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{art.summary}</p>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Reviewer: <strong>{art.reviewedBy}</strong>
                  </p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
                <button
                  onClick={() => handleOpenEdit(art)}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(art._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200/50 transition"
                  title="Delete article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Article Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editingArticle ? 'Edit Article' : 'Publish New Health Article'}
              </h2>
              <p className="text-xs text-slate-500">Clinical awareness and educational resources.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Understanding Early Cardiovascular Warning Signs"
                  required
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-input"
                  >
                    {articleCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="4 min read"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Reviewed By (Clinical Panel)
                  </label>
                  <input
                    type="text"
                    value={formData.reviewedBy}
                    onChange={(e) => setFormData({ ...formData, reviewedBy: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Article Summary / Excerpt *
                </label>
                <textarea
                  rows="2"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Concise overview shown in preview cards..."
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Article Body *
                </label>
                <textarea
                  rows="6"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Comprehensive educational content, clinical guidelines, and prevention tips..."
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Cardiology, Blood Pressure, Heart"
                  className="form-input"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5 font-bold shadow-sm"
                >
                  {editingArticle ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticles;
