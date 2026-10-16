import { useState } from 'react';
import { Plus, Pencil, Trash2, X, MapPin, CheckCircle2 } from 'lucide-react';
import { useOrders } from '../context/OrderContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import EmptyState from '../components/EmptyState.jsx';

const emptyForm = { label: 'Home', name: '', phone: '', address: '', city: '', pincode: '' };

export default function Addresses() {
  const { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useOrders();
  const { showToast } = useToast();
  const addresses = getAddresses();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [errors, setErrors] = useState({});

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(addr) {
    setForm({ label: addr.label, name: addr.name, phone: addr.phone, address: addr.address, city: addr.city, pincode: addr.pincode });
    setEditingId(addr.id);
    setErrors({});
    setModalOpen(true);
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!/^\d{10}$/.test(form.phone.trim())) next.phone = 'Enter a valid 10-digit phone number.';
    if (!form.address.trim()) next.address = 'Address is required.';
    if (!form.city.trim()) next.city = 'City is required.';
    if (!/^\d{6}$/.test(form.pincode.trim())) next.pincode = 'Enter a valid 6-digit pincode.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editingId) {
        await updateAddress(editingId, form);
        showToast('Address updated', 'success');
      } else {
        await addAddress(form);
        showToast('Address saved', 'success');
      }
      setModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Could not save address.', 'error');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteAddress(id);
      showToast('Address removed', 'info');
    } catch (err) {
      showToast(err.message || 'Could not remove address.', 'error');
    } finally {
      setConfirmDeleteId(null);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="flex-between section-head">
          <div>
            <span className="kicker">Your account</span>
            <h1>Saved Addresses</h1>
          </div>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Address</button>
        </div>

        {addresses.length === 0 ? (
          <EmptyState
            title="No saved addresses yet"
            message="Add an address to make checkout faster next time."
            action={<button className="btn btn-primary" onClick={openAdd}>Add Your First Address</button>}
          />
        ) : (
          <div className="grid grid-3">
            {addresses.map((a) => (
              <div className="address-card card" key={a.id}>
                {a.isDefault && <span className="badge badge-gold default-badge"><CheckCircle2 size={12} /> Default</span>}
                <div className="address-label"><MapPin size={16} /> {a.label}</div>
                <strong>{a.name}</strong>
                <p>{a.address}</p>
                <p>{a.city} — {a.pincode}</p>
                <p className="address-phone">{a.phone}</p>
                <div className="address-actions">
                  {!a.isDefault && (
                    <button className="link-btn" onClick={() => { setDefaultAddress(a.id); showToast('Default address updated', 'success'); }}>
                      Set as Default
                    </button>
                  )}
                  <button className="icon-btn-sm" onClick={() => openEdit(a)} aria-label={`Edit ${a.label} address`}><Pencil size={14} /></button>
                  <button className="icon-btn-sm" onClick={() => setConfirmDeleteId(a.id)} aria-label={`Delete ${a.label} address`}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <form className="modal-card card" onClick={(e) => e.stopPropagation()} onSubmit={handleSave} noValidate>
            <div className="modal-head">
              <h3>{editingId ? 'Edit Address' : 'Add Address'}</h3>
              <button type="button" className="icon-btn" onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>

            <div className="field">
              <label>Label</label>
              <select value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}>
                <option>Home</option>
                <option>Work</option>
                <option>Other</option>
              </select>
            </div>
            <div className="field">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} inputMode="numeric" />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
            <div className="field">
              <label>Address</label>
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </div>
            <div className="grid grid-2">
              <div className="field">
                <label>City</label>
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                {errors.city && <span className="field-error">{errors.city}</span>}
              </div>
              <div className="field">
                <label>Pincode</label>
                <input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} inputMode="numeric" />
                {errors.pincode && <span className="field-error">{errors.pincode}</span>}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">{editingId ? 'Save Changes' : 'Add Address'}</button>
          </form>
        </div>
      )}

      {confirmDeleteId && (
        <div className="modal-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal-card card confirm-card" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this address?</h3>
            <p>This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn btn-outline-dark" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: 'var(--danger)' }} onClick={() => handleDelete(confirmDeleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .address-card { padding: 1.5rem; position: relative; }
        .default-badge { position: absolute; top: 1rem; right: 1rem; display: flex; align-items: center; gap: 0.25rem; }
        .address-label { display: flex; align-items: center; gap: 0.4rem; color: var(--maroon); font-weight: 700; font-size: 0.85rem; margin-bottom: 0.5rem; }
        .address-card strong { display: block; margin-bottom: 0.2rem; }
        .address-card p { font-size: 0.87rem; color: var(--brown-soft); margin-bottom: 0.15rem; }
        .address-phone { margin-top: 0.4rem !important; }
        .address-actions { display: flex; align-items: center; gap: 0.6rem; margin-top: 1rem; flex-wrap: wrap; }
        .link-btn { background: none; border: none; color: var(--maroon); font-weight: 700; font-size: 0.8rem; padding: 0; margin-right: auto; }
        .icon-btn-sm { background: var(--cream-soft); border: none; border-radius: 6px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; }
        .icon-btn-sm:hover { color: var(--maroon); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(61,35,23,0.5); display: flex; align-items: center; justify-content: center; z-index: 400; padding: 1rem; }
        .modal-card { padding: 1.75rem; width: 100%; max-width: 440px; max-height: 90vh; overflow-y: auto; }
        .modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .confirm-card { text-align: center; }
        .confirm-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1.25rem; }
      `}</style>
    </section>
  );
}
