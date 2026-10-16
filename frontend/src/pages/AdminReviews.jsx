import { useEffect, useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import AdminLayout from '../components/AdminLayout.jsx';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useToast } from '../context/ToastContext.jsx';
import * as api from '../services/api.js';

export default function AdminReviews() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  function loadReviews() {
    setLoading(true);
    api
      .getReviews()
      .then(setReviews)
      .catch((err) => showToast(err.message || 'Could not load reviews.', 'error'))
      .finally(() => setLoading(false));
  }

  useEffect(loadReviews, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete(id) {
    try {
      await api.adminDeleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showToast('Review deleted', 'info');
    } catch (err) {
      showToast(err.message || 'Could not delete review.', 'error');
    } finally {
      setConfirmDeleteId(null);
    }
  }

  return (
    <AdminLayout title="Review Management" subtitle="Monitor and moderate customer reviews">
      {loading ? (
        <Loading label="Loading reviews..." />
      ) : reviews.length === 0 ? (
        <EmptyState title="No reviews yet" message="Customer reviews will appear here once submitted." />
      ) : (
        <div className="card table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Customer</th><th>Rating</th><th>Feedback</th><th>Date</th><th></th></tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>
                      <span className="stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={13} fill={i < r.rating ? 'currentColor' : 'none'} />
                        ))}
                      </span>
                    </td>
                    <td className="feedback-cell">{r.feedback}</td>
                    <td>{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <button className="delete-btn" onClick={() => setConfirmDeleteId(r.id)} aria-label={`Delete review from ${r.name}`}>
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="modal-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal-card card confirm-card" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this review?</h3>
            <p>This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn btn-outline-dark" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: 'var(--danger)' }} onClick={() => handleDelete(confirmDeleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .table-card { padding: 0.5rem; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
        th { text-align: left; padding: 0.7rem 0.9rem; color: var(--brown-soft); font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid var(--border); }
        td { padding: 0.7rem 0.9rem; border-bottom: 1px solid var(--border); vertical-align: top; }
        .stars { display: flex; gap: 1px; color: var(--gold); }
        .feedback-cell { max-width: 320px; }
        .delete-btn { background: var(--cream-soft); border: none; border-radius: 6px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; }
        .delete-btn:hover { color: var(--danger); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(61,35,23,0.5); display: flex; align-items: center; justify-content: center; z-index: 400; padding: 1rem; }
        .modal-card { padding: 1.75rem; width: 100%; max-width: 420px; }
        .confirm-card { text-align: center; }
        .confirm-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1.25rem; }
      `}</style>
    </AdminLayout>
  );
}
