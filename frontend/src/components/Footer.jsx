import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useProducts } from '../context/ProductsContext.jsx';

const DEFAULT_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=142+Gandhi+Bazaar+Main+Road+Chennai+Tamil+Nadu+600004';

const SOCIALS = [
  { icon: Instagram, label: 'Instagram', href: import.meta.env.VITE_INSTAGRAM_URL || '#' },
  { icon: Facebook, label: 'Facebook', href: import.meta.env.VITE_FACEBOOK_URL || '#' },
  { icon: MessageCircle, label: 'WhatsApp', href: import.meta.env.VITE_WHATSAPP_URL || '#' },
  { icon: MapPin, label: 'Google Maps', href: import.meta.env.VITE_GOOGLE_MAPS_URL || DEFAULT_MAPS_URL },
];

const BRANCHES = [
  { label: 'Corporate Office', address: '142, Gandhi Bazaar Main Road, Chennai, Tamil Nadu 600004' },
  { label: 'Branch - 1', address: '27, T. Nagar High Road, Near Panagal Park, Chennai 600017' },
  { label: 'Branch - 2', address: '9, Anna Nagar 2nd Avenue, Chennai 600040' },
];

export default function Footer() {
  const { categories } = useProducts();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col footer-brand">
          <div className="brand">
            <div>
              <strong>Sriram Cakes &amp; Sweets Shop</strong>
              <p className="tagline">Where Tradition Speaks</p>
            </div>
          </div>
          <p className="footer-story">
            The sweet and savoury story of Sriram Cakes &amp; Sweets started in 1998, bringing
            fresh cakes and traditional Indian sweets to every celebration.
          </p>
          <div className="social-row">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                <Icon size={17} />
              </a>
            ))}
          </div>
          <div className="quality-badge">
            <ShieldCheck size={22} />
            <span>FSSAI<br />Certified</span>
          </div>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/offers">Offers</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Categories</h3>
          <ul>
            {categories.map((c) => (
              <li key={c.id}><Link to={`/products?category=${c.id}`}>{c.name}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h3>Contact</h3>
          <ul className="contact-list">
            <li><MapPin size={14} /> 142, Gandhi Bazaar Main Road, Chennai, Tamil Nadu 600004</li>
            <li><Phone size={14} /> +91 98765 43210</li>
            <li>hello@sriramcakes.in</li>
            <li>Daily · 9:00 AM – 9:30 PM</li>
          </ul>
        </div>
      </div>

      <div className="footer-divider container" />

      <div className="container branch-grid">
        {BRANCHES.map((b) => (
          <div className="branch-card" key={b.label}>
            <h4>{b.label}</h4>
            <p><MapPin size={13} /> {b.address}</p>
            <p><Phone size={13} /> +91 98765 43210</p>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <span>© {year} Sriram Cakes &amp; Sweets Shop. All rights reserved.</span>
      </div>

      <style>{`
        .site-footer {
          background: var(--brown);
          color: var(--cream);
          color: var(--brown);
          padding-top: 3rem;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
          gap: 2rem;
          padding-bottom: 2.5rem;
        }
        .footer-brand strong { font-family: var(--font-display); color: var(--gold-soft); font-size: 1.15rem; }
        .footer-brand .tagline { margin: 0.15rem 0 0.9rem; font-size: 0.85rem; font-style: italic; color: rgba(255,248,236,.72); }
        .footer-story { font-size: 0.85rem; color: rgba(255,248,236,.72); margin-bottom: 1rem; }
        .footer-col h3 {
          color: var(--gold-soft);
          font-size: 1rem;
          margin-bottom: 1rem;
          font-family: var(--font-display);
        }
        .footer-col ul { display: flex; flex-direction: column; gap: 0.6rem; }
        .footer-col a { font-size: 0.92rem; color: rgba(255,248,236,.78); }
        .footer-col a:hover { color: var(--maroon); }
        .contact-list li { display: flex; align-items: flex-start; gap: 0.4rem; font-size: 0.9rem; line-height: 1.5; color: var(--brown-soft); }
        .social-row { display: flex; gap: 0.55rem; margin-bottom: 1rem; }
        .social-row a {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          background: var(--cream-soft);
          color: var(--brown);
        }
        .social-row a:hover { background: var(--maroon); color: var(--white); }
        .quality-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          color: var(--maroon);
          font-size: 0.72rem;
          font-weight: 700;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 0.5rem 0.8rem;
          width: fit-content;
        }
        .footer-divider { height: 1px; background: var(--border); }
        .branch-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          padding: 2rem 1.5rem;
        }
        .branch-card h4 { color: var(--maroon); font-family: var(--font-display); font-size: 1rem; margin-bottom: 0.6rem; border-bottom: 2px solid var(--gold); display: inline-block; padding-bottom: 0.2rem; }
        .branch-card p { display: flex; align-items: flex-start; gap: 0.4rem; font-size: 0.85rem; color: var(--brown-soft); margin-bottom: 0.4rem; }
        .footer-bottom {
          background: var(--footer-bottom);
          padding: 1.1rem 1.5rem;
          font-size: 0.82rem;
          text-align: center;
          color: var(--brown);
        }

        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .branch-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  );
}
