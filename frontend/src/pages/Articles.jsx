import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { articleService } from '../services/articleService';
import {
  BookOpen,
  Search,
  Clock,
  User,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';

const categories = [
  'All',
  'Cardiovascular Health',
  'Mental Wellness',
  'Emergency Preparedness',
  'Nutrition & Diet',
  'Preventive Healthcare',
  "Women's Health",
  'Child & Pediatric Care'
];

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, searchQuery]);

  const fetchArticles = async () => {
    try {
      setLoading(false);
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      const data = await articleService.getArticles(params);
      setArticles(data.articles || []);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-cyan-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-card">
        <span className="text-teal-300 font-bold text-xs uppercase tracking-wider">Clinical Education</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">Health Awareness & Insights</h1>
        <p className="text-teal-100 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
          Clinically reviewed articles, preventive healthcare roadmaps, and evidence-based wellness strategies authored and evaluated by certified physicians.
        </p>

        {/* Search */}
        <div className="mt-6 max-w-lg bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 flex items-center">
          <Search className="w-5 h-5 text-teal-200 ml-3 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search health topics, nutrition, emergency protocols..."
            className="w-full bg-transparent text-white placeholder-teal-200/80 text-sm focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 text-teal-200 hover:text-white mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Review Notice */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
        <span className="text-xs text-slate-600">
          <strong>Editorial Standard:</strong> All medical articles published on CareFlow undergo rigorous review by our certified clinical advisory board before publication.
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading articles...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <p className="text-lg font-bold text-slate-700">No articles match your criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="btn-secondary text-xs"
          >
            View All Articles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((art) => (
            <Link
              key={art._id}
              to={`/articles/${art.slug || art._id}`}
              className="card-healthcare overflow-hidden flex flex-col group"
            >
              <div className="h-52 overflow-hidden bg-slate-100">
                <img
                  src={art.imageUrl || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600'}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-bold text-teal-600">{art.category}</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" /> {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition line-clamp-2 mb-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[180px]">By {art.author}</span>
                  <span className="text-teal-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Articles;
