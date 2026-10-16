import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { CheckCircle2, Circle, XCircle } from 'lucide-react';
import { useOrders, ORDER_STAGES } from '../context/OrderContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Loading from '../components/Loading.jsx';

const CUSTOMER_CANCELLABLE_STATUSES = ['Pending', 'Confirmed', 'Preparing'];

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function OrderDetails() {
  const { id } = useParams();
  const { fetchOrderById, cancelOrder } = useOrders();
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchOrderById(id)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, fetchOrderById]);

  async function handleCancel() {
    setCancelling(true);
    try {
      const updated = await cancelOrder(id);
      setOrder(updated);
      showToast('Order cancelled', 'info');
    } catch (err) {
      showToast(err.message || 'Could not cancel this order.', 'error');
    } finally {
      setCancelling(false);
      setConfirmCancelOpen(false);
    }
  }

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <Loading label="Loading order details..." />
        </div>
      </section>
    );
  }

  if (notFound || !order) {
    return <Navigate to="/account/orders" replace />;
  }

  const isCancelled = order.status === 'Cancelled';
  const currentStageIndex = ORDER_STAGES.indexOf(order.status);
  const canCancel = CUSTOMER_CANCELLABLE_STATUSES.includes(order.status);

  return (
    <section className="section">
      <div className="container">
        <div className="flex-between section-head">
          <div>
            <span className="kicker">Order tracking</span>
            <h1>{order.id}</h1>
            <p>Placed on {formatDateTime(order.date)}</p>
          </div>
          {canCancel && (
            <button className="btn btn-outline-dark cancel-order-btn" onClick={() => setConfirmCancelOpen(true)}>
              Cancel Order
            </button>
          )}
        </div>

        <div className="order-details-grid">
          <div className="card tracking-card">
            <h3>Order Status</h3>

            {isCancelled ? (
              <div className="cancelled-banner">
                <XCircle size={22} />
                This order was cancelled.
              </div>
            ) : (
              <div className="tracker">
                {ORDER_STAGES.map((stage, i) => {
                  const done = i <= currentStageIndex;
                  const historyEntry = (order.statusHistory || []).find((h) => h.status === stage);
                  return (
                    <div className={'tracker-step' + (done ? ' done' : '')} key={stage}>
                      <div className="tracker-icon">
                        {done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                      </div>
                      <div className="tracker-label">
                        <strong>{stage}</strong>
                        {historyEntry && <span>{formatDateTime(historyEntry.at)}</span>}
                      </div>
                      {i < ORDER_STAGES.length - 1 && <div className={'tracker-line' + (done ? ' done' : '')} />}
                    </div>
                  );
                })}
              </div>
            )}

            <h3 style={{ marginTop: '2rem' }}>Delivery Address</h3>
            {order.address ? (
              <div className="address-block">
                <strong>{order.address.name}</strong>
                <p>{order.address.address}</p>
                <p>{order.address.city} — {order.address.pincode}</p>
                <p>{order.address.phone}</p>
              </div>
            ) : (
              <p className="muted">No address on file for this order.</p>
            )}
          </div>

          <aside className="card order-summary-card">
            <h3>Items</h3>
            <ul className="order-items-list">
              {order.items.map((item) => (
                <li key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <span>Qty {item.quantity} · ₹{item.finalPrice}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="summary-row total-row">
              <span>Total Paid</span>
              <span>₹{order.amount}</span>
            </div>
            <div className="summary-row">
              <span>Payment Method</span>
              <span>{order.paymentMethod === 'upi' ? 'Demo UPI' : 'Cash on Delivery'}</span>
            </div>
            <Link to="/account/orders" className="btn btn-outline-dark btn-block" style={{ marginTop: '1.25rem' }}>
              Back to Orders
            </Link>
          </aside>
        </div>
      </div>

      {confirmCancelOpen && (
        <div className="modal-overlay" onClick={() => setConfirmCancelOpen(false)}>
          <div className="modal-card card confirm-card" onClick={(e) => e.stopPropagation()}>
            <h3>Cancel this order?</h3>
            <p>This can't be undone. We'll email you a cancellation confirmation.</p>
            <div className="confirm-actions">
              <button className="btn btn-outline-dark" onClick={() => setConfirmCancelOpen(false)} disabled={cancelling}>
                Keep Order
              </button>
              <button className="btn btn-primary" style={{ background: 'var(--danger)' }} onClick={handleCancel} disabled={cancelling}>
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cancel-order-btn { color: var(--danger); border-color: var(--danger); white-space: nowrap; }
        .cancel-order-btn:hover { background: var(--danger); color: var(--white); }
        .order-details-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2.5rem; align-items: start; }
        .tracking-card { padding: 1.75rem; }
        .cancelled-banner {
          display: flex; align-items: center; gap: 0.6rem;
          background: rgba(182,64,47,0.1);
          color: var(--danger);
          border: 1px solid rgba(182,64,47,0.3);
          border-radius: var(--radius-sm);
          padding: 0.9rem 1.1rem;
          font-weight: 600;
        }
        .tracker { display: flex; flex-direction: column; }
        .tracker-step { display: flex; align-items: flex-start; gap: 0.9rem; position: relative; padding-bottom: 1.6rem; }
        .tracker-step:last-child { padding-bottom: 0; }
        .tracker-icon { color: var(--border); flex-shrink: 0; z-index: 1; background: var(--card-bg); }
        .tracker-step.done .tracker-icon { color: var(--success); }
        .tracker-label { display: flex; flex-direction: column; padding-top: 1px; }
        .tracker-label strong { color: var(--brown-soft); font-size: 0.95rem; }
        .tracker-step.done .tracker-label strong { color: var(--brown); }
        .tracker-label span { font-size: 0.78rem; color: var(--brown-soft); }
        .tracker-line {
          position: absolute;
          left: 9px; top: 26px; bottom: -4px;
          width: 2px;
          background: var(--border);
        }
        .tracker-line.done { background: var(--success); }
        .address-block p { font-size: 0.9rem; color: var(--brown-soft); margin-bottom: 0.15rem; }
        .muted { color: var(--brown-soft); }
        .order-summary-card { padding: 1.5rem; position: sticky; top: 100px; }
        .order-items-list { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1rem; }
        .order-items-list li { display: flex; align-items: center; gap: 0.7rem; }
        .order-items-list img { width: 46px; height: 46px; object-fit: cover; border-radius: 6px; }
        .order-items-list strong { display: block; font-size: 0.88rem; }
        .order-items-list span { font-size: 0.78rem; color: var(--brown-soft); }
        .summary-row { display: flex; justify-content: space-between; padding: 0.5rem 0; font-size: 0.9rem; color: var(--brown-soft); border-top: 1px solid var(--border); }
        .total-row { font-weight: 700; color: var(--maroon-dark); font-size: 1.05rem; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(61,35,23,0.5); display: flex; align-items: center; justify-content: center; z-index: 400; padding: 1rem; }
        .modal-card { padding: 1.75rem; width: 100%; max-width: 420px; }
        .confirm-card { text-align: center; }
        .confirm-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1.25rem; flex-wrap: wrap; }
        @media (max-width: 900px) {
          .order-details-grid { grid-template-columns: 1fr; }
          .order-summary-card { position: static; }
        }
      `}</style>
    </section>
  );
}
