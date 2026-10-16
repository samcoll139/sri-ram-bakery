import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import * as api from '../services/api.js';

const FLAVORS = ['Chocolate', 'Vanilla', 'Butterscotch', 'Black Forest', 'Red Velvet'];
const WEIGHTS = ['500g', '1kg', '2kg', '3kg'];

const initialForm = {
  name: '', phone: '', flavor: '', cakeType: '', weight: '', requiredDate: '', message: '', notes: '',
};

export default function CustomCake() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!/^\d{10}$/.test(form.phone.trim())) next.phone = 'Enter a valid 10-digit phone number.';
    if (!form.flavor) next.flavor = 'Please choose a flavour.';
    if (!form.cakeType.trim()) next.cakeType = 'Please describe the cake type.';
    if (!form.weight) next.weight = 'Please choose a weight.';
    if (!form.requiredDate) next.requiredDate = 'Please choose a required date.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      await api.createCustomCakeOrder({
        customerName: form.name,
        phone: form.phone,
        flavor: form.flavor,
        cakeType: form.cakeType,
        weight: form.weight,
        requiredDate: form.requiredDate,
        message: form.message,
        notes: form.notes,
      });
      setSubmitted(true);
      setForm(initialForm);
    } catch (err) {
      setSubmitError(err.message || 'Could not submit your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="kicker">Made for you</span>
          <h1>Create Your Perfect Cake</h1>
        </div>

        {submitted && (
          <div className="success-banner">
            <CheckCircle2 size={20} />
            Your custom cake request has been received. We'll call you shortly to confirm details.
          </div>
        )}

        <form className="custom-cake-form card" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-2">
            <div className="field">
              <label htmlFor="name">Customer Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="field">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} inputMode="numeric" />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
          </div>

          <div className="grid grid-2">
            <div className="field">
              <label htmlFor="flavor">Cake Flavor</label>
              <select id="flavor" name="flavor" value={form.flavor} onChange={handleChange}>
                <option value="">Select a flavour</option>
                {FLAVORS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              {errors.flavor && <span className="field-error">{errors.flavor}</span>}
            </div>
            <div className="field">
              <label htmlFor="cakeType">Cake Type</label>
              <input id="cakeType" name="cakeType" placeholder="e.g. Birthday, Wedding, Anniversary" value={form.cakeType} onChange={handleChange} />
              {errors.cakeType && <span className="field-error">{errors.cakeType}</span>}
            </div>
          </div>

          <div className="grid grid-2">
            <div className="field">
              <label htmlFor="weight">Cake Weight</label>
              <select id="weight" name="weight" value={form.weight} onChange={handleChange}>
                <option value="">Select weight</option>
                {WEIGHTS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
              {errors.weight && <span className="field-error">{errors.weight}</span>}
            </div>
            <div className="field">
              <label htmlFor="requiredDate">Required Date</label>
              <input id="requiredDate" name="requiredDate" type="date" value={form.requiredDate} onChange={handleChange} />
              {errors.requiredDate && <span className="field-error">{errors.requiredDate}</span>}
            </div>
          </div>

          <div className="field">
            <label htmlFor="message">Message on Cake</label>
            <input id="message" name="message" placeholder="e.g. Happy Birthday Priya!" value={form.message} onChange={handleChange} />
          </div>

          <div className="field">
            <label htmlFor="notes">Additional Notes</label>
            <textarea id="notes" name="notes" placeholder="Any allergies, design references, or special requests" value={form.notes} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Custom Order'}
          </button>
          {submitError && <p className="field-error" style={{ marginTop: '0.75rem' }}>{submitError}</p>}
        </form>
      </div>

      <style>{`
        .custom-cake-form { padding: 2rem; max-width: 760px; }
        .success-banner {
          display: flex; align-items: center; gap: 0.6rem;
          background: rgba(63,125,79,0.12);
          color: var(--success);
          border: 1px solid rgba(63,125,79,0.3);
          border-radius: var(--radius-sm);
          padding: 0.9rem 1.1rem;
          margin-bottom: 1.5rem;
          font-weight: 600;
          max-width: 760px;
        }
      `}</style>
    </section>
  );
}
