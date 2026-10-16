import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useOrders } from '../context/OrderContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import EmptyState from '../components/EmptyState.jsx';

const emptyAddressForm = { name: '', phone: '', address: '', city: '', pincode: '' };

export default function Checkout() {
  const { items, subtotal, discountTotal, deliveryFee, grandTotal } = useCart();
  const { user } = useAuth();
  const { getAddresses, addAddress, createOrder } = useOrders();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const savedAddresses = getAddresses();
  const defaultAddress = savedAddresses.find((a) => a.isDefault) || savedAddresses[0] || null;

  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id || null);
  const [addingNew, setAddingNew] = useState(savedAddresses.length === 0);
  const [newAddress, setNewAddress] = useState(emptyAddressForm);
  const [saveThisAddress, setSaveThisAddress] = useState(true);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <EmptyState title="Your cart is empty" message="Add a few treats before checking out." />
        </div>
      </section>
    );
  }

  function validateNewAddress() {
    const next = {};
    if (!newAddress.name.trim()) next.name = 'Name is required.';
    if (!/^\d{10}$/.test(newAddress.phone.trim())) next.phone = 'Enter a valid 10-digit phone number.';
    if (!newAddress.address.trim()) next.address = 'Address is required.';
    if (!newAddress.city.trim()) next.city = 'City is required.';
    if (!/^\d{6}$/.test(newAddress.pincode.trim())) next.pincode = 'Enter a valid 6-digit pincode.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let finalAddress;

    if (addingNew || !selectedAddressId) {
      if (!validateNewAddress()) return;
      finalAddress = { ...newAddress };
    } else {
      finalAddress = savedAddresses.find((a) => a.id === selectedAddressId);
    }

    setSubmitting(true);
    try {
      if (user && (addingNew || !selectedAddressId) && saveThisAddress) {
        await addAddress({ label: 'Home', ...newAddress });
      }

      const order = await createOrder({ items, address: finalAddress, paymentMethod, amount: grandTotal });
      navigate(paymentMethod === 'upi' ? `/payment?orderId=${order.id}` : `/payment?orderId=${order.id}&cod=1`);
    } catch (err) {
      showToast(err.message || 'Could not place your order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="kicker">Almost done</span>
          <h1>Checkout</h1>
        </div>

        {!user && (
          <p className="guest-notice">
            Checking out as a guest — <Link to="/login">log in</Link> to save addresses and track this order later.
          </p>
        )}

        <form className="checkout-grid" onSubmit={handleSubmit} noValidate>
          <div className="checkout-form card">
            <h3>Delivery Address</h3>

            {user && savedAddresses.length > 0 && (
              <div className="saved-address-list">
                {savedAddresses.map((a) => (
                  <label
                    key={a.id}
                    className={'saved-address-option' + (!addingNew && selectedAddressId === a.id ? ' selected' : '')}
                  >
                    <input
                      type="radio"
                      name="savedAddress"
                      checked={!addingNew && selectedAddressId === a.id}
                      onChange={() => { setSelectedAddressId(a.id); setAddingNew(false); }}
                    />
                    <MapPin size={16} />
                    <div>
                      <strong>{a.label} {a.isDefault && <span className="default-tag">Default</span>}</strong>
                      <span>{a.address}, {a.city} — {a.pincode}</span>
                    </div>
                  </label>
                ))}
                <button type="button" className="add-new-address-btn" onClick={() => setAddingNew(true)}>
                  <Plus size={15} /> Use a new address
                </button>
              </div>
            )}

            {(addingNew || savedAddresses.length === 0) && (
              <div className="new-address-form">
                <div className="field">
                  <label htmlFor="name">Customer Name</label>
                  <input id="name" value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="field">
                  <label htmlFor="phone">Phone</label>
                  <input id="phone" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} inputMode="numeric" />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
                <div className="field">
                  <label htmlFor="address">Address</label>
                  <textarea id="address" value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />
                  {errors.address && <span className="field-error">{errors.address}</span>}
                </div>
                <div className="grid grid-2">
                  <div className="field">
                    <label htmlFor="city">City</label>
                    <input id="city" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                    {errors.city && <span className="field-error">{errors.city}</span>}
                  </div>
                  <div className="field">
                    <label htmlFor="pincode">Pincode</label>
                    <input id="pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} inputMode="numeric" />
                    {errors.pincode && <span className="field-error">{errors.pincode}</span>}
                  </div>
                </div>
                {user && (
                  <label className="checkbox-row">
                    <input type="checkbox" checked={saveThisAddress} onChange={(e) => setSaveThisAddress(e.target.checked)} />
                    Save this address for next time
                  </label>
                )}
                {savedAddresses.length > 0 && (
                  <button type="button" className="cancel-new-address" onClick={() => setAddingNew(false)}>
                    Use a saved address instead
                  </button>
                )}
              </div>
            )}

            <h3 style={{ marginTop: '1.5rem' }}>Payment Method</h3>
            <div className="payment-options">
              <label className={'payment-option' + (paymentMethod === 'cod' ? ' selected' : '')}>
                <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                Cash on Delivery
              </label>
              <label className={'payment-option' + (paymentMethod === 'upi' ? ' selected' : '')}>
                <input type="radio" name="paymentMethod" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                Demo UPI Payment
              </label>
            </div>
          </div>

          <aside className="order-summary card">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
            {discountTotal > 0 && <div className="summary-row discount-row"><span>Discount</span><span>-₹{discountTotal}</span></div>}
            <div className="summary-row"><span>Delivery Fee</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
            <div className="summary-row total-row"><span>Grand Total</span><span>₹{grandTotal}</span></div>
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Placing Order...' : paymentMethod === 'upi' ? 'Continue to Payment' : 'Place Order'}
            </button>
          </aside>
        </form>
      </div>

      <style>{`
        .guest-notice {
          background: var(--cream-soft);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 0.8rem 1.1rem;
          font-size: 0.88rem;
          margin-bottom: 1.5rem;
        }
        .guest-notice a { color: var(--maroon); font-weight: 700; }
        .checkout-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 2.5rem; align-items: start; }
        .checkout-form { padding: 1.75rem; }
        .saved-address-list { display: flex; flex-direction: column; gap: 0.7rem; margin-bottom: 1rem; }
        .saved-address-option {
          display: flex; align-items: flex-start; gap: 0.7rem;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 0.9rem 1rem;
          cursor: pointer;
        }
        .saved-address-option.selected { border-color: var(--gold); background: var(--cream-soft); }
        .saved-address-option div { display: flex; flex-direction: column; gap: 0.15rem; }
        .saved-address-option strong { font-size: 0.9rem; }
        .default-tag { font-size: 0.7rem; color: var(--gold); font-weight: 700; margin-left: 0.4rem; }
        .saved-address-option span { font-size: 0.82rem; color: var(--brown-soft); }
        .add-new-address-btn {
          display: flex; align-items: center; gap: 0.4rem;
          background: none; border: 1.5px dashed var(--border);
          border-radius: var(--radius-sm);
          padding: 0.7rem 1rem;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--maroon);
          justify-content: center;
        }
        .cancel-new-address {
          background: none; border: none;
          color: var(--maroon);
          font-weight: 700;
          font-size: 0.82rem;
          margin-top: 0.4rem;
        }
        .checkbox-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; margin: 0.5rem 0 0; }
        .payment-options { display: flex; gap: 1rem; flex-wrap: wrap; }
        .payment-option {
          display: flex; align-items: center; gap: 0.5rem;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 0.8rem 1.1rem;
          font-weight: 600;
          cursor: pointer;
          flex: 1;
          min-width: 200px;
        }
        .payment-option.selected { border-color: var(--gold); background: var(--cream-soft); }
        .order-summary { padding: 1.5rem; position: sticky; top: 100px; }
        .order-summary h3 { margin-bottom: 1rem; }
        .summary-row { display: flex; justify-content: space-between; padding: 0.5rem 0; font-size: 0.92rem; color: var(--brown-soft); }
        .discount-row { color: var(--success); }
        .total-row { border-top: 1px solid var(--border); margin-top: 0.4rem; padding-top: 0.75rem; font-weight: 700; font-size: 1.1rem; color: var(--maroon-dark); }
        .order-summary .btn { margin-top: 1.25rem; }
        @media (max-width: 900px) {
          .checkout-grid { grid-template-columns: 1fr; }
          .order-summary { position: static; }
        }
      `}</style>
    </section>
  );
}
