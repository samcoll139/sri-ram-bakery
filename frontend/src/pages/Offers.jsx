import { Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid.jsx';
import { useProducts } from '../context/ProductsContext.jsx';

export default function Offers() {
  const { getBiggestDiscounts } = useProducts();
  const offers = getBiggestDiscounts(12).filter((p) => p.discount > 0);

  return (
    <>
      <section className="offer-banner">
        <div className="container offer-banner-inner">
          <div>
            <span className="kicker">Limited time</span>
            <h1>Up to 30% Off</h1>
            <p>On selected cakes &amp; sweets — while stocks last.</p>
          </div>
          <Link to="/products" className="btn btn-gold">Shop All Products</Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Don't miss out</span>
            <h2>Today's Special Offers</h2>
          </div>
          <ProductGrid products={offers} />
        </div>
      </section>

      <style>{`
        .offer-banner {
          background: linear-gradient(135deg, var(--maroon), var(--maroon-dark));
          color: var(--white);
          padding: 3.5rem 0;
        }
        .offer-banner h1 { color: var(--white); }
        .offer-banner p { color: rgba(255,255,255,0.85); margin-bottom: 0; }
        .offer-banner-inner {
          display: flex; align-items: center; justify-content: space-between;
          gap: 2rem; flex-wrap: wrap;
        }
      `}</style>
    </>
  );
}
