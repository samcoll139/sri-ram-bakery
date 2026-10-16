import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { categories } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();
  const categoryLabel = categories.find((c) => c.id === product.category)?.name || product.category;

  function handleAdd() {
    if (!user) {
      showToast('Please sign in with OTP before adding products to cart.', 'error');
      navigate('/login', { state: { from: { pathname: `/products/${product.id}` } } });
      return;
    }
    addToCart(product, 1);
    showToast(`${product.name} added to cart`, 'success');
  }

  return (
    <div className="product-card card">
      <Link to={`/products/${product.id}`} className="product-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.discount > 0 && <span className="badge product-discount">{product.discount}% OFF</span>}
        <span className="badge badge-outline product-category">{categoryLabel}</span>
      </Link>

      <div className="product-body">
        <Link to={`/products/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-desc">{product.description}</p>

        <div className="product-rating">
          <Star size={14} fill="currentColor" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="review-count">({product.reviews})</span>
        </div>

        <div className="product-price-row">
          <div>
            <span className="final-price">₹{product.finalPrice}</span>
            {product.discount > 0 && <span className="original-price">₹{product.originalPrice}</span>}
          </div>
          <span className="product-weight">{product.weight}</span>
        </div>

        <div className="product-actions">
          <Link to={`/products/${product.id}`} className="btn btn-outline-dark btn-block">View Details</Link>
          <button className="btn btn-primary btn-block" onClick={handleAdd}>
            <ShoppingCart size={16} /> Add to Cart
          </button>
        </div>
      </div>

      <style>{`
        .product-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .product-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lift); }
        .product-image-wrap { position: relative; display: block; aspect-ratio: 4/3; overflow: hidden; }
        .product-image-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
        .product-card:hover .product-image-wrap img { transform: scale(1.06); }
        .product-discount { position: absolute; top: 10px; left: 10px; }
        .product-category { position: absolute; top: 10px; right: 10px; background: var(--card-bg); }
        .product-body { padding: 1.1rem 1.2rem 1.3rem; display: flex; flex-direction: column; flex: 1; }
        .product-name { font-size: 1.05rem; margin-bottom: 0.3rem; }
        .product-desc {
          font-size: 0.85rem;
          color: var(--brown-soft);
          margin-bottom: 0.6rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .product-rating {
          display: flex; align-items: center; gap: 0.3rem;
          color: var(--gold);
          font-weight: 700;
          font-size: 0.85rem;
          margin-bottom: 0.7rem;
        }
        .review-count { color: var(--brown-soft); font-weight: 500; }
        .product-price-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1rem;
        }
        .final-price { font-family: var(--font-display); font-size: 1.25rem; color: var(--maroon-dark); font-weight: 600; }
        .original-price {
          margin-left: 0.5rem;
          text-decoration: line-through;
          color: var(--brown-soft);
          font-size: 0.85rem;
        }
        .product-weight { font-size: 0.8rem; color: var(--brown-soft); }
        .product-actions { display: flex; flex-direction: column; gap: 0.55rem; margin-top: auto; }
        .product-actions .btn { font-size: 0.85rem; padding: 0.65rem 1rem; }
      `}</style>
    </div>
  );
}
