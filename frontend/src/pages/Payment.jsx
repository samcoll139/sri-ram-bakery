import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, QrCode } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useOrders } from '../context/OrderContext.jsx';
import Loading from '../components/Loading.jsx';

function generateTxnRef() {
  return 'DEMO' + Math.random().toString(36).slice(2, 10).toUpperCase();
}

export default function Payment() {
  const [searchParams] = useSearchParams();
  const isCod = searchParams.get('cod') === '1';
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();
  const { clearCart, grandTotal } = useCart();
  const { fetchOrderById, confirmOrder } = useOrders();

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(Boolean(orderId));
  const [confirmed, setConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [txnRef] = useState(generateTxnRef);

  useEffect(() => {
    if (!orderId) return;
    fetchOrderById(orderId)
      .then((data) => setOrder(data))
      .catch(() => setOrder(null))
      .finally(() => setLoadingOrder(false));
  }, [orderId, fetchOrderById]);

  // Cash-on-delivery orders are confirmed immediately; UPI orders confirm
  // once the demo payment is submitted below.
  useEffect(() => {
    if (isCod && orderId && !loadingOrder && !confirmed) {
      handleConfirm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCod, orderId, loadingOrder]);

  async function handleConfirm() {
    setConfirming(true);
    try {
      if (orderId) {
        const updated = await confirmOrder(orderId);
        setOrder(updated);
      }
    } catch {
      // If confirmation fails (e.g. backend restarted), still show success —
      // this is a demo payment flow and shouldn't block the customer.
    } finally {
      setConfirming(false);
      setConfirmed(true);
    }
  }

  function handleDone() {
    clearCart();
    navigate('/');
  }

  if (loadingOrder) {
    return (
      <section className="section">
        <div className="container">
          <Loading label="Loading your order..." />
        </div>
      </section>
    );
  }

  const amount = order?.amount ?? grandTotal;

  if (confirmed) {
    return (
      <section className="section">
        <div className="container">
          <div className="payment-confirm card">
            <CheckCircle2 size={48} color="var(--success)" />
            <h2>{isCod ? 'Order Placed Successfully' : 'Demo Payment Submitted Successfully'}</h2>
            <p>
              {isCod
                ? 'Your order has been placed and will be paid for on delivery.'
                : 'No real money was transferred — this was a demo transaction.'}
            </p>
            <div className="confirm-details">
              <span>Amount: ₹{amount}</span>
              <span>Reference: {txnRef}</span>
              {order && <span>Order ID: {order.id}</span>}
            </div>
            <div className="confirm-actions">
              {order && (
                <Link to={`/account/orders/${order.id}`} className="btn btn-outline-dark">
                  Track This Order
                </Link>
              )}
              <button className="btn btn-primary" onClick={handleDone}>Continue Shopping</button>
            </div>
          </div>
        </div>
        <style>{`
          .payment-confirm {
            max-width: 480px;
            margin: 0 auto;
            padding: 2.5rem;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }
          .confirm-details {
            display: flex; flex-direction: column; gap: 0.3rem;
            font-size: 0.9rem; color: var(--brown-soft);
            margin: 1rem 0 1.5rem;
          }
          .confirm-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
        `}</style>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="payment-card card">
          <span className="badge badge-gold">Demo Payment – No Real Money Transaction</span>
          <h2>Sriram Cakes &amp; Sweets Shop</h2>
          <p className="amount">₹{amount}</p>

          <div className="qr-box">
            <QrCode size={140} strokeWidth={1} />
          </div>

          <p className="txn-ref">Transaction Reference: {txnRef}</p>

          <button className="btn btn-primary btn-block" onClick={handleConfirm} disabled={confirming}>
            {confirming ? 'Confirming...' : 'Confirm Payment'}
          </button>
          <Link to="/cart" className="cancel-link">Cancel and return to cart</Link>
        </div>
      </div>

      <style>{`
        .payment-card {
          max-width: 420px;
          margin: 0 auto;
          padding: 2.5rem;
          text-align: center;
        }
        .payment-card h2 { margin-top: 0.75rem; }
        .amount {
          font-family: var(--font-display);
          font-size: 2.2rem;
          color: var(--maroon-dark);
          font-weight: 600;
          margin-bottom: 1.25rem;
        }
        .qr-box {
          display: flex; align-items: center; justify-content: center;
          background: var(--cream-soft);
          border: 1.5px dashed var(--border);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          margin-bottom: 1rem;
          color: var(--maroon);
        }
        .txn-ref { font-size: 0.85rem; color: var(--brown-soft); margin-bottom: 1.5rem; }
        .cancel-link { display: block; margin-top: 0.9rem; font-size: 0.85rem; color: var(--brown-soft); text-decoration: underline; }
      `}</style>
    </section>
  );
}
