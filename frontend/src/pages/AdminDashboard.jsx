import { useEffect, useState } from 'react';
import { IndianRupee, Package, Users, ShoppingBag } from 'lucide-react';
import AdminLayout from '../components/AdminLayout.jsx';
import AnalyticsCard from '../components/AnalyticsCard.jsx';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import * as api from '../services/api.js';

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

export default function AdminDashboard() {
  const { products } = useProducts();
  const { showToast } = useToast();
  const [summary, setSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getAnalyticsSummary(), api.adminGetAllOrders()])
      .then(([s, orders]) => {
        setSummary(s);
        setRecentOrders(orders.slice(0, 8));
      })
      .catch((err) => showToast(err.message || 'Could not load dashboard data.', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminLayout title="Dashboard" subtitle="An overview of your shop's performance">
      {loading || !summary ? (
        <Loading label="Loading dashboard..." />
      ) : (
        <>
          <div className="admin-stat-grid">
            <AnalyticsCard icon={Package} label="Total Products" value={products.length} />
            <AnalyticsCard icon={ShoppingBag} label="Total Orders" value={summary.totalOrders} />
            <AnalyticsCard icon={Users} label="Total Customers" value={summary.totalCustomers} />
            <AnalyticsCard icon={IndianRupee} label="Total Revenue" value={`₹${summary.totalRevenue.toLocaleString('en-IN')}`} />
          </div>

          <div className="card recent-orders">
            <h3>Recent Orders</h3>
            {recentOrders.length === 0 ? (
              <EmptyState title="No orders yet" message="Orders placed by customers will appear here." />
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o) => (
                      <tr key={o.id}>
                        <td>{o.id}</td>
                        <td>{o.address?.name || 'Guest'}</td>
                        <td>{formatDate(o.date)}</td>
                        <td>{o.items.length}</td>
                        <td>₹{o.amount}</td>
                        <td>{o.paymentMethod === 'upi' ? 'UPI' : 'COD'}</td>
                        <td><span className={`status-pill ${STATUS_CLASS[o.status]}`}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        .admin-stat-grid { display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:18px; }
        .recent-orders { padding: 18px 20px; border-radius:15px!important; }
        .recent-orders h3 { margin-bottom: 1rem; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
        th { text-align: left; padding: 0.6rem 0.75rem; color: var(--brown-soft); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid var(--border); }
        td { padding: 0.7rem 0.75rem; border-bottom: 1px solid var(--border); }
        .status-pill { padding: 0.25rem 0.65rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; }
        .status-pending { background: rgba(200,155,60,0.18); color: #e0bd4c; }
        .status-confirmed { background: rgba(110,143,201,0.18); color: #82a8f5; }
        .status-preparing { background: rgba(161,91,63,0.18); color: #d08b69; }
        .status-ready { background: rgba(138,74,61,0.18); color: #dc8a73; }
        .status-delivered { background: rgba(63,125,79,0.18); color: #68d48a; }
        .status-cancelled { background: rgba(182,64,47,0.18); color: #ef8b78; }
        @media (max-width: 950px) { .admin-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr));} }
        @media (max-width: 560px) { .admin-stat-grid{grid-template-columns:1fr;} }
      `}</style>
    </AdminLayout>
  );
}
