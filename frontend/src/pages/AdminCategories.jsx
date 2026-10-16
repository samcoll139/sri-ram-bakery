import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import AdminLayout from '../components/AdminLayout.jsx';
import Loading from '../components/Loading.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import * as api from '../services/api.js';

export default function AdminCategories() {
  const { categories, loading, refresh } = useProducts();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: '', emoji: '🍰' });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  function openAdd() {
    setForm({ id: null, name: '', emoji: '🍰' });
    setModalOpen(true);
  }

  function openEdit(cat) {
    setForm({ id: cat.id, name: cat.name, emoji: cat.emoji });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (form.id) {
        await api.adminUpdateCategory(form.id, { name: form.name, emoji: form.emoji });
        showToast('Category updated', 'success');
      } else {
        await api.adminCreateCategory({ name: form.name, emoji: form.emoji });
        showToast('Category added', 'success');
      }
      await refresh();
      setModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Could not save category.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.adminDeleteCategory(id);
      showToast('Category removed', 'info');
      await refresh();
    } catch (err) {
      showToast(err.message || 'Could not delete category.', 'error');
    } finally {
      setConfirmDeleteId(null);
    }
  }

  return (
    <AdminLayout title="Category Management" subtitle="Organise your product categories">
      <div className="admin-toolbar">
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Category</button>
      </div>

      {loading ? (
        <Loading label="Loading categories..." />
      ) : (
        <div className="grid grid-3">
          {categories.map((c) => (
            <div className="category-admin-card card" key={c.id}>
              <h3>{c.emoji} {c.name}</h3>
              <p>{c.productCount ?? 0} products</p>
              <div className="row-actions">
                <button onClick={() => openEdit(c)} aria-label={`Edit ${c.name}`}><Pencil size={15} /></button>
                <button onClick={() => setConfirmDeleteId(c.id)} aria-label={`Delete ${c.name}`}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <form className="modal-card card" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <div className="modal-head">
              <h3>{form.id ? 'Edit Category' : 'Add Category'}</h3>
              <button type="button" className="icon-btn" onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="field">
              <label>Category Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Emoji</label>
              <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} maxLength={2} />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
              {saving ? 'Saving...' : form.id ? 'Save Changes' : 'Add Category'}
            </button>
          </form>
        </div>
      )}

      {confirmDeleteId && (
        <div className="modal-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal-card card confirm-card" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this category?</h3>
            <p>Products in this category will need to be reassigned.</p>
            <div className="confirm-actions">
              <button className="btn btn-outline-dark" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: 'var(--danger)' }} onClick={() => handleDelete(confirmDeleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-toolbar { margin-bottom: 1.5rem; }
        .category-admin-card { padding: 1.5rem; }
        .category-admin-card h3 { margin-bottom: 0.2rem; }
        .category-admin-card p { color: var(--brown-soft); font-size: 0.85rem; margin-bottom: 1rem; }
        .row-actions { display: flex; gap: 0.5rem; }
        .row-actions button { background: var(--cream-soft); border: none; border-radius: 6px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; }
        .row-actions button:last-child:hover { color: var(--danger); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(61,35,23,0.5); display: flex; align-items: center; justify-content: center; z-index: 400; padding: 1rem; }
        .modal-card { padding: 1.75rem; width: 100%; max-width: 420px; }
        .modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .confirm-card { text-align: center; }
        .confirm-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1.25rem; }
      `}</style>
    </AdminLayout>
  );
}
