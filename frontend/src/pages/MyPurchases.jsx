import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, IndianRupee, Package } from 'lucide-react';
import AnalyticsCard from '../components/AnalyticsCard.jsx';
import SalesChart from '../components/SalesChart.jsx';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useToast } from '../context/ToastContext.jsx';
import * as api from '../services/api.js';

const STATUS_CLASS = {
  Pending: 'status-pending', Confirmed: 'status-confirmed', Preparing: 'status-preparing',
  Ready: 'status-ready', Delivered: 'status-delivered', Cancelled: 'status-cancelled',
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MyPurchases() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [spending, setSpending] = useState([]);

  useEffect(() => {
    Promise.all([api.getMyPurchases(), api.getMySpending()])
      .then(([purchases, spend]) => {
        setData(purchases);
        setSpending(spend.map((s) => ({ label: s.label, sales: s.amount })));
      })
      .catch((err) => showToast(err.message || 'Could not load your purchase history.', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <Loading label="Loading your purchases..." />
        </div>
      </section>
    );
  }

  if (!data || data.totalOrders === 0) {
    return (
      <section className="section">
        <div className="container">
          <EmptyState
            title="No purchases yet"
            message="Once you place an order, your personal purchase analytics will show up here."
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
          <h1>My Purchases</h1>
        </div>

        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          <AnalyticsCard icon={ShoppingBag} label="Total Orders" value={data.totalOrders} />
          <AnalyticsCard icon={IndianRupee} label="Total Spent" value={`₹${data.totalSpent.toLocaleString('en-IN')}`} />
          <AnalyticsCard icon={Package} label="Products Purchased" value={data.purchases.length} />
        </div>

        {spending.length > 0 && (
          <div className="card my-purchases-section">
            <h3>My Spending (Last 30 Days)</h3>
            <SalesChart data={spending} />
          </div>
        )}

        <div className="card my-purchases-section">
          <h3>Products I've Purchased</h3>
          <ul className="purchased-list">
            {data.purchases.map((p) => (
              <li key={p.productName}>
                <span>{p.productName} × {p.quantity}</span>
                <strong>₹{p.totalAmount.toLocaleString('en-IN')}</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="card my-purchases-section">
          <h3>Recent Orders</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Order ID</th><th>Date</th><th>Items</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {data.recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td><Link to={`/account/orders/${o.id}`}>{o.id}</Link></td>
                    <td>{formatDate(o.date)}</td>
                    <td>{o.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}</td>
                    <td>₹{o.amount}</td>
                    <td><span className={`status-pill ${STATUS_CLASS[o.status]}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .my-purchases-section { padding: 1.5rem; margin-bottom: 1.5rem; }
        .my-purchases-section h3 { margin-bottom: 1.1rem; }
        .purchased-list { display: flex; flex-direction: column; gap: 0.6rem; }
        .purchased-list li { display: flex; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px solid var(--border); font-size: 0.92rem; }
        .purchased-list strong { color: var(--maroon-dark); }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
        th { text-align: left; padding: 0.7rem 0.9rem; color: var(--brown-soft); font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid var(--border); }
        td { padding: 0.7rem 0.9rem; border-bottom: 1px solid var(--border); }
        td a { color: var(--maroon); font-weight: 700; }
        .status-pill { padding: 0.25rem 0.65rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; }
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
