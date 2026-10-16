import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useOrders, ORDER_STAGES } from '../context/OrderContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const STATUSES = [...ORDER_STAGES, 'Cancelled'];

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

export default function AdminOrders() {
  const { getAllOrders, refreshAllOrders, advanceOrderStatus } = useOrders();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshAllOrders()
      .catch((err) => showToast(err.message || 'Could not load orders.', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleStatusChange(id, status) {
    try {
      await advanceOrderStatus(id, status);
    } catch (err) {
      showToast(err.message || 'Could not update order status.', 'error');
    }
  }

  const orders = getAllOrders();

  return (
    <AdminLayout title="Order Management" subtitle="Track and update customer orders">
      {loading ? (
        <Loading label="Loading orders..." />
      ) : orders.length === 0 ? (
        <EmptyState title="No orders yet" message="Orders placed by customers will appear here." />
      ) : (
        <div className="card table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th><th>Customer</th><th>Date</th><th>Items</th><th>Amount</th><th>Payment</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.address?.name || 'Guest'}</td>
                    <td>{formatDate(o.date)}</td>
                    <td>{o.items.length}</td>
                    <td>₹{o.amount}</td>
                    <td>{o.paymentMethod === 'upi' ? 'UPI' : 'COD'}</td>
                    <td>
                      <select
                        className={`status-select ${STATUS_CLASS[o.status]}`}
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .table-card { padding: 0.5rem; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
        th { text-align: left; padding: 0.7rem 0.9rem; color: var(--brown-soft); font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid var(--border); }
        td { padding: 0.7rem 0.9rem; border-bottom: 1px solid var(--border); }
        .status-select {
          border: none;
          border-radius: 999px;
          padding: 0.35rem 0.7rem;
          font-size: 0.78rem;
          font-weight: 700;
          font-family: inherit;
        }
        .status-pending { background: rgba(200,155,60,0.18); color: #92721f; }
        .status-confirmed { background: rgba(110,143,201,0.18); color: #33538c; }
        .status-preparing { background: rgba(161,91,63,0.18); color: #7a3f27; }
        .status-ready { background: rgba(138,74,61,0.18); color: #6e3324; }
        .status-delivered { background: rgba(63,125,79,0.18); color: #2c5c37; }
        .status-cancelled { background: rgba(182,64,47,0.18); color: #8c2e1c; }
      `}</style>
    </AdminLayout>
  );
}
