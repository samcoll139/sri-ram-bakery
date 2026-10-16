import { useEffect, useState } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import ReviewCard from '../components/ReviewCard.jsx';
import Loading from '../components/Loading.jsx';
import { useToast } from '../context/ToastContext.jsx';
import * as api from '../services/api.js';

const googleReviewUrl = import.meta.env.VITE_GOOGLE_REVIEW_URL;

export default function Reviews() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', rating: 0, feedback: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .getReviews()
      .then(setReviews)
      .catch((err) => showToast(err.message || 'Could not load reviews.', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.feedback.trim() || form.rating === 0) {
      setError('Please fill in your name, a rating, and your feedback.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const newReview = await api.createReview({
        name: form.name.trim(),
        rating: form.rating,
        feedback: form.feedback.trim(),
      });
      setReviews([newReview, ...reviews]);
      setForm({ name: '', rating: 0, feedback: '' });
      showToast('Thanks for your review!', 'success');
    } catch (err) {
      setError(err.message || 'Could not submit your review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="reviews-head flex-between section-head">
          <div>
            <span className="kicker">Customer voices</span>
            <h1>What Our Customers Say</h1>
          </div>
          {googleReviewUrl && (
            <a href={googleReviewUrl} target="_blank" rel="noreferrer" className="btn btn-outline-dark">
              Rate Us on Google <ExternalLink size={15} />
            </a>
          )}
        </div>

        <div className="reviews-layout">
          {loading ? (
            <Loading label="Loading reviews..." />
          ) : (
            <div className="grid grid-2 reviews-list">
              {reviews.length === 0 ? (
                <p className="muted">No reviews yet — be the first to share your experience!</p>
              ) : (
                reviews.map((r) => <ReviewCard key={r.id} review={r} />)
              )}
            </div>
          )}

          <form className="review-form card" onSubmit={handleSubmit} noValidate>
            <h3>Share Your Experience</h3>
            <div className="field">
              <label htmlFor="rname">Name</label>
              <input id="rname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Rating</label>
              <div className="star-picker">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setForm({ ...form, rating: i + 1 })}
                    aria-label={`Rate ${i + 1} stars`}
                  >
                    <Star size={22} fill={i < form.rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <label htmlFor="rfeedback">Feedback</label>
              <textarea id="rfeedback" value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} />
            </div>
            {error && <span className="field-error">{error}</span>}
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .reviews-layout {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 2.5rem;
          align-items: start;
        }
        .muted { color: var(--brown-soft); }
        .review-form { padding: 1.75rem; position: sticky; top: 100px; }
        .review-form h3 { margin-bottom: 1rem; }
        .star-picker { display: flex; gap: 0.3rem; color: var(--gold); }
        .star-picker button { background: none; border: none; padding: 0.2rem; }
        @media (max-width: 900px) {
          .reviews-layout { grid-template-columns: 1fr; }
          .reviews-list { grid-template-columns: 1fr !important; }
          .review-form { position: static; }
        }
      `}</style>
    </section>
  );
}
