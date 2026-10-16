import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Instagram, Facebook, MessageCircle, MapPin, User, PackageSearch, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';

const BASE_MENU_TOP = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'All Products' },
];

const BASE_MENU_BOTTOM = [
  { to: '/offers', label: 'Offers' },
  { to: '/custom-cake', label: 'Custom Cake Order' },
  { to: '/cart', label: 'Cart' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
];

const DEFAULT_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=142+Gandhi+Bazaar+Main+Road+Chennai+Tamil+Nadu+600004';

const SOCIALS = [
  { icon: Instagram, label: 'Instagram', href: import.meta.env.VITE_INSTAGRAM_URL || '#' },
  { icon: Facebook, label: 'Facebook', href: import.meta.env.VITE_FACEBOOK_URL || '#' },
  { icon: MessageCircle, label: 'WhatsApp', href: import.meta.env.VITE_WHATSAPP_URL || '#' },
  { icon: MapPin, label: 'Google Maps', href: import.meta.env.VITE_GOOGLE_MAPS_URL || DEFAULT_MAPS_URL },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { categories } = useProducts();
  const navigate = useNavigate();

  const MENU = [
    ...BASE_MENU_TOP,
    ...categories.map((c) => ({ to: `/products?category=${c.id}`, label: c.name })),
    ...BASE_MENU_BOTTOM,
  ];

  function handleLogout() {
    logout();
    onClose();
    navigate('/');
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    if (open) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <>
      <div className={'sidebar-overlay' + (open ? ' open' : '')} onClick={onClose} aria-hidden={!open} />
      <aside className={'sidebar' + (open ? ' open' : '')} aria-hidden={!open}>
        <div className="sidebar-head">
          <span className="sidebar-title">Menu</span>
          <button className="icon-btn" aria-label="Close menu" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <ul className="sidebar-links">
          {MENU.map((item) => (
            <li key={item.to + item.label}>
              <Link to={item.to} onClick={onClose}>{item.label}</Link>
            </li>
          ))}
          {user ? (
            <>
              <li><Link to="/account" onClick={onClose}><User size={15} style={{ marginRight: 8 }} />My Account</Link></li>
              <li><Link to="/account/orders" onClick={onClose}><PackageSearch size={15} style={{ marginRight: 8 }} />Order History</Link></li>
              <li><button className="sidebar-logout" onClick={handleLogout}><LogOut size={15} style={{ marginRight: 8 }} />Logout</button></li>
            </>
          ) : (
            <li><Link to="/login" onClick={onClose}>Login / Register</Link></li>
          )}
        </ul>

        <div className="sidebar-socials">
          <span className="sidebar-title">Follow Us</span>
          <div className="social-row">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </aside>

      <style>{`
        .sidebar-overlay {
          position: fixed; inset: 0;
          background: rgba(61, 35, 23, 0.45);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
          z-index: 200;
        }
        .sidebar-overlay.open { opacity: 1; pointer-events: auto; }

        .sidebar {
          position: fixed;
          top: 0; bottom: 0; left: 0;
          width: min(320px, 85vw);
          background: var(--card-bg);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          z-index: 201;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          box-shadow: var(--shadow-lift);
        }
        .sidebar.open { transform: translateX(0); }

        .sidebar-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .sidebar-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          color: var(--maroon-dark);
        }
        .sidebar-links {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          overflow-y: auto;
          flex: 1;
        }
        .sidebar-links a {
          display: block;
          padding: 0.65rem 0.4rem;
          font-weight: 600;
          border-bottom: 1px solid var(--border);
          color: var(--brown);
        }
        .sidebar-links a:hover { color: var(--maroon); }
        .sidebar-logout {
          display: flex; align-items: center;
          width: 100%;
          padding: 0.65rem 0.4rem;
          font-weight: 600;
          font-size: 1rem;
          border-bottom: 1px solid var(--border);
          color: var(--danger);
          background: none;
          border-left: none; border-right: none; border-top: none;
          text-align: left;
          font-family: inherit;
        }
        .sidebar-socials { margin-top: 1.25rem; }
        .social-row { display: flex; gap: 0.6rem; margin-top: 0.6rem; }
        .social-row a {
          width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          background: var(--maroon);
          color: var(--white);
        }
        .social-row a:hover { background: var(--gold); color: var(--brown); }
      `}</style>
    </>
  );
}
