import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, X } from 'lucide-react';
import AdminLayout from '../components/AdminLayout.jsx';
import Loading from '../components/Loading.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import * as api from '../services/api.js';

const emptyForm = {
  id: null, name: '', category: 'cakes', originalPrice: '', costPrice: '', discount: '', weight: '', stock: '',
  manufacturingDate: '', expiryDate: '', image: '/images/placeholder-product.jpg',
};

export default function AdminProducts() {
  const { products, categories, loading, refresh } = useProducts();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  function openAddModal() {
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(product) {
    setForm({
      id: product.id, name: product.name, category: product.category,
      originalPrice: product.originalPrice, costPrice: product.costPrice ?? '', discount: product.discount, weight: product.weight,
      stock: product.stock, manufacturingDate: product.manufacturingDate || '', expiryDate: product.expiryDate || '',
      image: product.image,
    });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      category: form.category,
      weight: form.weight,
      originalPrice: Number(form.originalPrice),
      costPrice: Number(form.costPrice) || 0,
      discount: Number(form.discount) || 0,
      stock: Number(form.stock),
      manufacturingDate: form.manufacturingDate || null,
      expiryDate: form.expiryDate || null,
      image: form.image,
    };

    try {
      if (form.id) {
        await api.adminUpdateProduct(form.id, payload);
        showToast('Product updated', 'success');
      } else {
        await api.adminCreateProduct(payload);
        showToast('Product added', 'success');
      }
      await refresh();
      setModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Could not save product.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.adminDeleteProduct(id);
      showToast('Product deleted', 'info');
      await refresh();
    } catch (err) {
      showToast(err.message || 'Could not delete product.', 'error');
    } finally {
      setConfirmDeleteId(null);
    }
  }

  return (
    <AdminLayout title="Product Management" subtitle="Add, edit and manage your product catalogue">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." />
        </div>
        <button className="btn btn-primary" onClick={openAddModal}><Plus size={16} /> Add Product</button>
      </div>

      {loading ? (
        <Loading label="Loading products..." />
      ) : (
        <div className="card table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Category</th><th>Price</th><th>Cost</th><th>Discount</th><th>Weight</th><th>Stock</th><th>Expiry</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="product-name-cell"><img src={p.image} alt="" /> {p.name}</td>
                    <td>{categories.find((c) => c.id === p.category)?.name || p.category}</td>
                    <td>₹{p.originalPrice}</td>
                    <td>₹{p.costPrice || 0}</td>
                    <td>{p.discount}%</td>
                    <td>{p.weight}</td>
                    <td>{p.stock}</td>
                    <td>{p.expiryDate || '—'}</td>
                    <td className="row-actions">
                      <button onClick={() => openEditModal(p)} aria-label={`Edit ${p.name}`}><Pencil size={15} /></button>
                      <button onClick={() => setConfirmDeleteId(p.id)} aria-label={`Delete ${p.name}`}><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <form className="modal-card card" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <div className="modal-head">
              <h3>{form.id ? 'Edit Product' : 'Add Product'}</h3>
              <button type="button" className="icon-btn" onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>

            <div className="field">
              <label>Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-2">
              <div className="field">
                <label>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Weight</label>
                <input required value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="e.g. 500 g" />
              </div>
            </div>
            <div className="grid grid-2">
              <div className="field">
                <label>Price (₹)</label>
                <input required type="number" min="0" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
              </div>
              <div className="field">
                <label>Discount (%)</label>
                <input type="number" min="0" max="100" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label>Cost Price (₹) <span className="field-hint">— what it costs the shop to make this, used for expense/profit reports</span></label>
              <input type="number" min="0" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} />
            </div>
            <div className="grid grid-2">
              <div className="field">
                <label>Stock</label>
                <input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div className="field">
                <label>Expiry Date</label>
                <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label>Manufacturing Date</label>
              <input type="date" value={form.manufacturingDate} onChange={(e) => setForm({ ...form, manufacturingDate: e.target.value })} />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
              {saving ? 'Saving...' : form.id ? 'Save Changes' : 'Add Product'}
            </button>
          </form>
        </div>
      )}

      {confirmDeleteId && (
        <div className="modal-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal-card card confirm-card" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this product?</h3>
            <p>This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn btn-outline-dark" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: 'var(--danger)' }} onClick={() => handleDelete(confirmDeleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-toolbar { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .field-hint { font-weight: 400; font-size: 0.78rem; color: var(--brown-soft); }
        .admin-search { display: flex; align-items: center; gap: 0.5rem; background: var(--white); border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 0.55rem 0.9rem; min-width: 260px; }
        .admin-search input { border: none; outline: none; font-family: inherit; flex: 1; background: transparent; }
        .table-card { padding: 0.5rem; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
        th { text-align: left; padding: 0.7rem 0.9rem; color: var(--brown-soft); font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid var(--border); }
        td { padding: 0.7rem 0.9rem; border-bottom: 1px solid var(--border); }
        .product-name-cell { display: flex; align-items: center; gap: 0.6rem; font-weight: 600; }
        .product-name-cell img { width: 34px; height: 34px; border-radius: 6px; object-fit: cover; }
        .row-actions { display: flex; gap: 0.5rem; }
        .row-actions button { background: var(--cream-soft); border: none; border-radius: 6px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; }
        .row-actions button:last-child:hover { color: var(--danger); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(61,35,23,0.5); display: flex; align-items: center; justify-content: center; z-index: 400; padding: 1rem; }
        .modal-card { padding: 1.75rem; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }
        .modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .confirm-card { text-align: center; }
        .confirm-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1.25rem; }
      `}</style>
    </AdminLayout>
  );
}
