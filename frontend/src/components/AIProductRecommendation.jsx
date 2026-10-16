import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function AIProductRecommendation({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleAdd() {
    if (!user) {
      showToast('Please sign in with OTP before adding products to cart.', 'error');
      navigate('/login');
      return;
    }
    addToCart(product, 1);
    showToast(`${product.name} added to cart`, 'success');
  }

  return (
    <div className="ai-product-card">
      <img src={product.image} alt={product.name} />
      <div className="ai-product-info">
        <strong>{product.name}</strong>
        <div className="ai-product-rating">
          <Star size={12} fill="currentColor" /> {product.rating.toFixed(1)}
        </div>
        <span className="ai-product-price">₹{product.finalPrice}</span>
        <div className="ai-product-actions">
          <Link to={`/products/${product.id}`}>View Details</Link>
          <button onClick={handleAdd} aria-label={`Add ${product.name} to cart`}>
            <ShoppingCart size={13} /> Add
          </button>
        </div>
      </div>

      <style>{`
        .ai-product-card {
          display: flex;
          gap: 0.65rem;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 0.6rem;
        }
        .ai-product-card img { width: 56px; height: 56px; object-fit: cover; border-radius: 6px; flex-shrink: 0; }
        .ai-product-info { display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }
        .ai-product-info strong { font-size: 0.85rem; color: var(--brown); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ai-product-rating { font-size: 0.72rem; color: var(--gold); display: flex; align-items: center; gap: 0.2rem; }
        .ai-product-price { font-size: 0.85rem; font-weight: 700; color: var(--maroon-dark); }
        .ai-product-actions { display: flex; gap: 0.6rem; margin-top: 0.15rem; }
        .ai-product-actions a { font-size: 0.72rem; color: var(--maroon); font-weight: 700; }
        .ai-product-actions button {
          font-size: 0.72rem; font-weight: 700;
          display: flex; align-items: center; gap: 0.2rem;
          background: none; border: none; color: var(--success);
        }
      `}</style>
    </div>
  );
}
