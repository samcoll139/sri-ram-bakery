import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Cake, Gift } from 'lucide-react';
import Hero from '../components/Hero.jsx';
import FeatureCard from '../components/FeatureCard.jsx';
import CategoryCard from '../components/CategoryCard.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useProducts } from '../context/ProductsContext.jsx';

const FEATURES = [
  { icon: Sparkles, title: 'Freshly Prepared', description: 'Fresh cakes and sweets prepared daily with quality ingredients.' },
  { icon: ShieldCheck, title: 'Premium Quality', description: 'Quality ingredients and hygienic preparation, every single batch.' },
  { icon: Cake, title: 'Custom Cakes', description: 'Personalised cakes for birthdays, weddings and celebrations.' },
  { icon: Gift, title: 'Gift Hampers', description: 'Curated sweets, dry-fruit and cookie hampers ready to gift.' },
];

export default function Home() {
  const { categories, getCategoryProductCount, getBestRated } = useProducts();
  const featured = getBestRated(8);

  return (
    <>
      <Hero />

      <section className="section">
        <div className="container grid grid-4">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--pastel-pink)' }}>
        <div className="container">
          <div className="section-head text-center" style={{ margin: '0 auto 2.5rem' }}>
            <span className="kicker">Browse</span>
            <h2>Shop by Category</h2>
          </div>
          <div className="grid grid-6">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} count={getCategoryProductCount(c.id)} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="flex-between section-head" style={{ margin: '0 0 2.5rem' }}>
            <div>
              <span className="kicker">Handpicked</span>
              <h2>Our Special Products</h2>
            </div>
            <Link to="/products" className="btn btn-outline-dark">View All</Link>
          </div>
          <div className="grid grid-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-inner">
          <div>
            <h2>Planning a celebration?</h2>
            <p>Tell us the flavour, size and date — we'll bake it exactly the way you imagine.</p>
          </div>
          <Link to="/custom-cake" className="btn btn-gold">Order a Custom Cake</Link>
        </div>
      </section>

      <style>{`
        .cta-band {
          position: relative;
          color: var(--white);
          padding: 4rem 0;
          background-image: linear-gradient(rgba(36,31,26,0.72), rgba(36,31,26,0.72)), url('/images/hero-bakery-spread.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
        @supports not (background-attachment: fixed) {
          .cta-band { background-attachment: scroll; }
        }
        @media (max-width: 768px) {
          .cta-band { background-attachment: scroll; }
        }
        .cta-band h2 { color: var(--white); margin-bottom: 0.4rem; }
        .cta-band p { color: rgba(255,255,255,0.82); margin-bottom: 0; }
        .cta-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }
      `}</style>
    </>
  );
}
