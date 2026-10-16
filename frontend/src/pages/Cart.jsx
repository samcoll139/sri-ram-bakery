import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Cart() {
  const { items, increaseQuantity, decreaseQuantity, removeFromCart, subtotal, discountTotal, deliveryFee, grandTotal, freeDeliveryThreshold } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <EmptyState
            title="Your cart is empty"
            message="Looks like you haven't added anything sweet yet."
            action={<Link to="/products" className="btn btn-primary">Browse Products</Link>}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="kicker">Almost there</span>
          <h1>Your Shopping Cart</h1>
        </div>

        <div className="cart-grid">
          <ul className="cart-items">
            {items.map((item) => (
              <li key={item.id} className="cart-item card">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <span className="cart-item-weight">{item.weight}</span>
                  <div className="cart-item-price">
                    ₹{item.finalPrice}
                    {item.originalPrice > item.finalPrice && (
                      <span className="original-price">₹{item.originalPrice}</span>
                    )}
                  </div>
                </div>
                <div className="cart-item-qty">
                  <div className="qty-selector">
                    <button onClick={() => decreaseQuantity(item.id)} aria-label="Decrease quantity"><Minus size={14} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)} aria-label="Increase quantity"><Plus size={14} /></button>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="order-summary card">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
            {discountTotal > 0 && (
              <div className="summary-row discount-row"><span>Discount</span><span>-₹{discountTotal}</span></div>
            )}
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
            </div>
            {deliveryFee > 0 && (
              <p className="delivery-hint">Add ₹{freeDeliveryThreshold - subtotal} more for free delivery.</p>
            )}
            <div className="summary-row total-row"><span>Grand Total</span><span>₹{grandTotal}</span></div>
            <button className="btn btn-primary btn-block" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </div>

      <style>{`
        .cart-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 2.5rem;
          align-items: start;
        }
        .cart-items { display: flex; flex-direction: column; gap: 1rem; }
        .cart-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          align-items: center;
        }
        .cart-item img { width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); }
        .cart-item-info { flex: 1; }
        .cart-item-info h3 { font-size: 1rem; margin-bottom: 0.15rem; }
        .cart-item-weight { font-size: 0.8rem; color: var(--brown-soft); }
        .cart-item-price { font-weight: 700; color: var(--maroon-dark); margin-top: 0.3rem; }
        .cart-item-price .original-price {
          margin-left: 0.5rem; font-weight: 500; font-size: 0.8rem;
          text-decoration: line-through; color: var(--brown-soft);
        }
        .cart-item-qty { display: flex; flex-direction: column; align-items: flex-end; gap: 0.6rem; }
        .qty-selector {
          display: flex; align-items: center;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }
        .qty-selector button { width: 30px; height: 32px; background: var(--cream-soft); border: none; display: flex; align-items: center; justify-content: center; }
        .qty-selector span { width: 28px; text-align: center; font-weight: 700; font-size: 0.9rem; }
        .remove-btn { background: none; border: none; color: var(--danger); }
        .order-summary { padding: 1.5rem; position: sticky; top: 100px; }
        .order-summary h3 { margin-bottom: 1rem; }
        .summary-row { display: flex; justify-content: space-between; padding: 0.5rem 0; font-size: 0.92rem; color: var(--brown-soft); }
        .discount-row { color: var(--success); }
        .delivery-hint { font-size: 0.78rem; color: var(--gold); margin: -0.2rem 0 0.4rem; }
        .total-row {
          border-top: 1px solid var(--border);
          margin-top: 0.4rem; padding-top: 0.75rem;
          font-weight: 700; font-size: 1.1rem;
          color: var(--maroon-dark);
        }
        .order-summary .btn { margin-top: 1.25rem; }
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr; }
          .order-summary { position: static; }
        }
      `}</style>
    </section>
  );
}
