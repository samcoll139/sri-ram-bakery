import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import ProductGrid from '../components/ProductGrid.jsx';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ProductDetails() {
  const { id } = useParams();
  const { getProductById, getRelatedProducts } = useProducts();
  const product = getProductById(id);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const related = getRelatedProducts(product);

  function handleAdd() {
    if (!user) {
      showToast('Please sign in with OTP before adding products to cart.', 'error');
      return;
    }
    addToCart(product, qty);
    showToast(`${qty} x ${product.name} added to cart`, 'success');
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <section className="section">
      <div className="container">
        <div className="pd-grid">
          <div className="pd-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="pd-info">
            <span className="badge badge-gold">{product.weight}</span>
            <h1>{product.name}</h1>

            <div className="product-rating">
              <Star size={16} fill="currentColor" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="review-count">({product.reviews} reviews)</span>
            </div>

            <p>{product.description}</p>

            <div className="pd-ingredients">
              <strong>Ingredients: </strong>
              {product.ingredients.join(', ')}
            </div>

            <div className="pd-dates">
              <span>Manufactured: {formatDate(product.manufacturingDate)}</span>
              <span>Best before: {formatDate(product.expiryDate)}</span>
            </div>

            <div className="pd-price-row">
              <span className="final-price">₹{product.finalPrice}</span>
              {product.discount > 0 && (
                <>
                  <span className="original-price">₹{product.originalPrice}</span>
                  <span className="badge">{product.discount}% OFF</span>
                </>
              )}
            </div>

            <p className="pd-stock">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>

            <div className="pd-actions">
              <div className="qty-selector">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus size={16} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Increase quantity"><Plus size={16} /></button>
              </div>
              <button className="btn btn-primary" onClick={handleAdd} disabled={product.stock === 0}>
                <ShoppingCart size={17} /> {added ? 'Added!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="related-section">
            <div className="section-head" style={{ marginTop: '3.5rem' }}>
              <span className="kicker">You may also like</span>
              <h2>Related Products</h2>
            </div>
            <ProductGrid products={related} />
          </div>
        )}
      </div>

      <style>{`
        .pd-grid {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 3rem;
        }
        .pd-image img {
          width: 100%;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lift);
          aspect-ratio: 1;
          object-fit: cover;
        }
        .pd-info .product-rating {
          display: flex; align-items: center; gap: 0.35rem;
          color: var(--gold); font-weight: 700;
          margin: 0.6rem 0 1rem;
        }
        .review-count { color: var(--brown-soft); font-weight: 500; }
        .pd-ingredients { font-size: 0.9rem; color: var(--brown-soft); margin-bottom: 0.8rem; }
        .pd-dates {
          display: flex; gap: 1.5rem;
          font-size: 0.85rem;
          color: var(--brown-soft);
          margin-bottom: 1.2rem;
          flex-wrap: wrap;
        }
        .pd-price-row { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.4rem; }
        .final-price { font-family: var(--font-display); font-size: 2rem; color: var(--maroon-dark); font-weight: 600; }
        .original-price { text-decoration: line-through; color: var(--brown-soft); }
        .pd-stock { font-size: 0.88rem; color: var(--success); margin-bottom: 1.5rem; }
        .pd-actions { display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap; }
        .qty-selector {
          display: flex; align-items: center; gap: 0;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }
        .qty-selector button {
          width: 40px; height: 44px;
          background: var(--cream-soft);
          border: none;
          display: flex; align-items: center; justify-content: center;
        }
        .qty-selector span { width: 42px; text-align: center; font-weight: 700; }
        @media (max-width: 860px) {
          .pd-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
