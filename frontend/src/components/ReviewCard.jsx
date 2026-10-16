import { Star } from 'lucide-react';

export default function ReviewCard({ review }) {
  const initial = review.name.trim().charAt(0).toUpperCase();

  return (
    <div className="review-card card">
      <div className="review-head">
        <span className="review-avatar">{initial}</span>
        <div>
          <strong>{review.name}</strong>
          <div className="review-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={13} fill={i < review.rating ? 'currentColor' : 'none'} />
            ))}
          </div>
        </div>
      </div>
      <p>{review.feedback}</p>
      <span className="review-date">{review.date}</span>

      <style>{`
        .review-card { padding: 1.5rem; }
        .review-head { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
        .review-avatar {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: var(--maroon);
          color: var(--white);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }
        .review-stars { color: var(--gold); display: flex; gap: 1px; margin-top: 0.15rem; }
        .review-card p { font-size: 0.92rem; color: var(--brown); margin-bottom: 0.6rem; }
        .review-date { font-size: 0.78rem; color: var(--brown-soft); }
      `}</style>
    </div>
  );
}
