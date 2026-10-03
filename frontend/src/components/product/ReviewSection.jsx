import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, MessageSquare } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';

export default function ReviewSection({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/product/${productId}`);
      setReviews(res.reviews || []);
    } catch (err) {
      console.warn('Failed to load reviews');
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return setError('Please write a review comment');

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await api.post(`/reviews/product/${productId}`, { rating, comment });
      setSuccess('Review submitted successfully!');
      setComment('');
      fetchReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pt-8 border-t border-white/10">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-accent" /> Verified Customer Reviews ({reviews.length})
        </h3>
      </div>

      {/* Review List */}
      {reviews.length === 0 ? (
        <p className="text-sm text-slate-400 italic">No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev._id} className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{rev.userName}</span>
                  {rev.verifiedPurchase && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" /> Verified Purchase
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 font-mono">{formatDate(rev.createdAt)}</span>
              </div>

              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'fill-current' : 'text-slate-700'}`} />
                ))}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Leave a Verified Review</h4>

          {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">{error}</div>}
          {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400">{success}</div>}

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-lg border transition-all ${
                    star <= rating ? 'border-amber-400 text-amber-400 bg-amber-400/10' : 'border-white/10 text-slate-600'
                  }`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Your Feedback</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about the fabric quality, print crispness, and fit..."
              className="w-full bg-brand-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-accent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      ) : (
        <p className="text-xs text-slate-400">
          Please <a href="/login" className="text-accent underline font-bold">login</a> to write a review.
        </p>
      )}
    </div>
  );
}
