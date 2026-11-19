import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService } from '../services/articleService';
import {
  Clock,
  User,
  ShieldCheck,
  Calendar,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const ArticleDetail = () => {
  const { identifier } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await articleService.getArticle(identifier);
        setArticle(res.article);
      } catch (err) {
        setError(err.response?.data?.message || 'Article not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [identifier]);

  if (loading) {
    return <div className="text-center py-24 text-slate-400">Loading article...</div>;
  }

  if (error || !article) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center px-4 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Article Not Found</h2>
        <p className="text-sm text-slate-500">The requested health article could not be retrieved.</p>
        <Link to="/articles" className="btn-primary text-xs inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Return to Articles Directory
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        to="/articles"
        className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 hover:text-teal-800 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Articles
      </Link>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge-status bg-teal-100 text-teal-800 text-xs font-bold">
            {article.category}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.readTime}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {new Date(article.publishedAt).toLocaleDateString()}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          {article.summary}
        </p>

        {/* Author & Reviewer Banner */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-0.5">
            <p className="font-bold text-slate-900">Author: {article.author}</p>
            <p className="text-slate-500">{article.authorRole}</p>
          </div>
          <div className="flex items-center gap-2 text-teal-800 bg-white px-3 py-1.5 rounded-xl border border-teal-200 shadow-sm font-semibold">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Reviewed by: {article.reviewedBy}</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.imageUrl && (
        <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-100 max-h-96">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Body */}
      <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 space-y-4 whitespace-pre-line bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
        {article.content}
      </div>

      {/* Medical Content Review Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong>Clinical Content Disclaimer:</strong> All medical and preventive content provided on CareFlow is educational and reviewed by qualified healthcare professionals. It does not replace individualized diagnosis or treatment from a physician. In case of urgent symptoms, dial <strong>112</strong> immediately.
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div>
          <h3 className="text-xl font-bold">Have concerns regarding your symptoms?</h3>
          <p className="text-xs text-teal-100 mt-1">
            Consult one of our licensed healthcare specialists today.
          </p>
        </div>
        <Link to="/book" className="px-6 py-3 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-sm transition text-xs whitespace-nowrap">
          Schedule Consultation
        </Link>
      </div>
    </article>
  );
};

export default ArticleDetail;
