import { Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import { useOrders } from '../context/OrderContext.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Loading from '../components/Loading.jsx';

const STATUS_CLASS = {
  Pending: 'status-pending',
  Confirmed: 'status-confirmed',
  Preparing: 'status-preparing',
  Ready: 'status-ready',
  Delivered: 'status-delivered',
  Cancelled: 'status-cancelled',
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function OrderHistory() {
  const { getOrders, loading } = useOrders();
  const orders = getOrders();

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <Loading label="Loading your orders..." />
        </div>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <EmptyState
            title="No orders yet"
            message="Your past orders will show up here once you place one."
            action={<Link to="/products" className="btn btn-primary">Start Shopping</Link>}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="kicker">Your account</span>
          <h1>Order History</h1>
        </div>

        <div className="order-list">
          {orders.map((o) => (
            <Link to={`/account/orders/${o.id}`} key={o.id} className="order-row card">
              <div className="order-row-main">
                <div className="order-row-icon"><PackageSearch size={18} /></div>
                <div>
                  <strong>{o.id}</strong>
                  <span className="order-row-date">{formatDate(o.date)} · {o.items.length} item{o.items.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="order-row-end">
                <span className={`status-pill ${STATUS_CLASS[o.status]}`}>{o.status}</span>
                <strong className="order-row-amount">₹{o.amount}</strong>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .order-list { display: flex; flex-direction: column; gap: 0.9rem; }
        .order-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 1.4rem;
          gap: 1rem;
          flex-wrap: wrap;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .order-row:hover { transform: translateY(-2px); box-shadow: var(--shadow-lift); }
        .order-row-main { display: flex; align-items: center; gap: 0.9rem; }
        .order-row-icon {
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--cream-soft); color: var(--maroon);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .order-row-main strong { display: block; color: var(--brown); }
        .order-row-date { font-size: 0.82rem; color: var(--brown-soft); }
        .order-row-end { display: flex; align-items: center; gap: 1rem; }
        .order-row-amount { color: var(--maroon-dark); font-family: var(--font-display); }
        .status-pill { padding: 0.3rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; }
        .status-pending { background: rgba(200,155,60,0.18); color: #92721f; }
        .status-confirmed { background: rgba(110,143,201,0.18); color: #33538c; }
        .status-preparing { background: rgba(161,91,63,0.18); color: #7a3f27; }
        .status-ready { background: rgba(138,74,61,0.18); color: #6e3324; }
        .status-delivered { background: rgba(63,125,79,0.18); color: #2c5c37; }
        .status-cancelled { background: rgba(182,64,47,0.18); color: #8c2e1c; }
      `}</style>
    </section>
  );
}
