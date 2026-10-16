import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, PackageSearch, MapPin, LogOut, X, ChevronDown, TrendingUp, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import Sidebar from './Sidebar.jsx';
import SearchBar from './SearchBar.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [announcementOpen, setAnnouncementOpen] = useState(true);
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const { categories } = useProducts();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const cartCount = getCartCount();
  const accountRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleAccountClick() {
    if (user) {
      setAccountMenuOpen((v) => !v);
    } else {
      navigate('/login');
    }
  }

  function handleLogout() {
    logout();
    setAccountMenuOpen(false);
    navigate('/');
  }

  return (
    <>
      {announcementOpen && (
        <div className="announcement-bar">
          <span>Fresh cakes &amp; sweets, baked daily — same-day delivery across the city.</span>
          <button aria-label="Dismiss announcement" onClick={() => setAnnouncementOpen(false)}>
            <X size={15} />
          </button>
        </div>
      )}

      <header className="navbar">
        <div className="container navbar-inner">
          <button
            className="icon-btn hamburger"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="brand">
            <img src="/images/sriram-logo.png" alt="Sriram Bakery" className="navbar-logo" />
          </Link>

          <nav className="nav-links" aria-label="Primary">
            <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Home</NavLink>

            <div className="nav-dropdown-wrap">
              <NavLink to="/products" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                Products <ChevronDown size={14} />
              </NavLink>
              <div className="nav-dropdown">
                {categories.map((c) => (
                  <Link key={c.id} to={`/products?category=${c.id}`}>{c.emoji} {c.name}</Link>
                ))}
              </div>
            </div>

            <NavLink to="/offers" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Offers</NavLink>
            <NavLink to="/custom-cake" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Custom Cake</NavLink>
            <NavLink to="/about" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>About Us</NavLink>
            <NavLink to="/reviews" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Reviews</NavLink>
            <NavLink to="/contact" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Connect</NavLink>
          </nav>

          <div className="navbar-actions">
            <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen((v) => !v)}>
              <Search size={20} />
            </button>
            <button className="theme-toggle" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`} onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <Link to="/account" className="my-account-nav-btn" aria-label="My Account">
              <User size={18} />
              <span>My Account</span>
            </Link>
            <div className="account-menu-wrap" ref={accountRef}>
              <button className="login-nav-btn" aria-label={user ? 'Account menu' : 'Login'} onClick={handleAccountClick}>
                <span>{user ? 'Account' : 'Login'}</span>
              </button>
              {user && accountMenuOpen && (
                <div className="account-dropdown">
                  <div className="account-dropdown-head">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <Link to="/account" onClick={() => setAccountMenuOpen(false)}><User size={15} /> My Account</Link>
                  <Link to="/account/orders" onClick={() => setAccountMenuOpen(false)}><PackageSearch size={15} /> Order History</Link>
                  <Link to="/account/purchases" onClick={() => setAccountMenuOpen(false)}><TrendingUp size={15} /> My Purchases</Link>
                  <Link to="/account/addresses" onClick={() => setAccountMenuOpen(false)}><MapPin size={15} /> Saved Addresses</Link>
                  <button onClick={handleLogout}><LogOut size={15} /> Logout</button>
                </div>
              )}
            </div>
            <button className="icon-btn cart-btn" aria-label="Cart" onClick={() => navigate('/cart')}>
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="navbar-search container">
            <SearchBar
              autoFocus
              onSearch={(q) => {
                setSearchOpen(false);
                navigate(`/products?search=${encodeURIComponent(q)}`);
              }}
            />
          </div>
        )}
      </header>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <style>{`
        .announcement-bar {
          background: var(--brown);
          color: var(--white);
          font-size: 0.82rem;
          text-align: center;
          padding: 0.55rem 2.5rem;
          position: relative;
        }
        .announcement-bar button {
          position: absolute;
          right: 0.8rem; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          color: rgba(255,255,255,0.75);
        }
        .announcement-bar button:hover { color: var(--white); }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--brown);
          border-bottom: 2px solid var(--gold);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          height: 78px;
        }
        .hamburger { display: none; }
        .brand {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-right: auto;
        }
        .navbar-logo { width: 72px; height: 72px; object-fit: contain; filter: drop-shadow(0 5px 8px rgba(0,0,0,.18)); }
        .brand-badge {
          width: 46px; height: 46px;
          border-radius: 50%;
          background: var(--gold);
          color: var(--white);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          border: 2px solid var(--gold-soft);
          flex-shrink: 0;
        }
        .brand-badge-since { font-size: 0.42rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.85; }
        .brand-badge-year { font-size: 0.68rem; font-weight: 800; font-family: var(--font-display); }
        .brand-text { display: flex; flex-direction: column; line-height: 1.1; }
        .brand-text strong {
          font-family: var(--font-display);
          font-size: 1.35rem;
          color: var(--maroon);
          letter-spacing: 0.02em;
        }
        .brand-text small {
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          color: var(--brown-soft);
          text-transform: uppercase;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.6rem;
        }
        .nav-link {
          display: flex; align-items: center; gap: 0.25rem;
          font-weight: 600;
          font-size: 0.93rem;
          color: var(--cream);
          position: relative;
          padding: 0.35rem 0;
          white-space: nowrap;
        }
        .nav-link.active, .nav-link:hover { color: var(--gold-soft); }
        .nav-link.active::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -4px;
          height: 2px;
          background: var(--gold);
        }
        .nav-dropdown-wrap { position: relative; }
        .nav-dropdown {
          position: absolute;
          top: calc(100% + 14px); left: 50%;
          transform: translateX(-50%);
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lift);
          padding: 0.6rem;
          min-width: 210px;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          opacity: 0;
          pointer-events: none;
          transform: translateX(-50%) translateY(-6px);
          transition: opacity 0.16s ease, transform 0.16s ease;
          z-index: 150;
        }
        .nav-dropdown-wrap:hover .nav-dropdown {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }
        .nav-dropdown a {
          padding: 0.55rem 0.7rem;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--brown);
        }
        .nav-dropdown a:hover { background: var(--cream-soft); color: var(--maroon); }

        .navbar-actions { display: flex; align-items: center; gap: 0.4rem; }
        .theme-toggle, .login-nav-btn { border: 1px solid rgba(255,255,255,.28); background: rgba(255,255,255,.06); color: var(--white); min-height: 40px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; gap: .4rem; padding: 0 .75rem; font-weight: 700; font-size: .82rem; transition: background-color .15s ease, color .15s ease, border-color .15s ease; }
        .theme-toggle:hover, .login-nav-btn:hover { background: rgba(255,255,255,.15); color: var(--gold-soft); border-color: rgba(230,200,120,.6); }
        .my-account-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--white);
          text-decoration: none;
          font-weight: 700;
          font-size: 0.86rem;
          white-space: nowrap;
          padding: 0.55rem 0.7rem;
          border-radius: 8px;
        }
        .my-account-nav-btn:hover, .my-account-nav-btn.active {
          background: rgba(255,255,255,0.1);
          color: var(--gold);
        }

        .login-nav-btn { min-width: 78px; }
        .icon-btn {
          background: transparent;
          border: none;
          color: var(--white);
          width: 40px; height: 40px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: background-color 0.15s ease;
        }
        .icon-btn:hover { background: rgba(255,255,255,.12); color: var(--gold-soft); }
        .account-menu-wrap { position: relative; }
        .account-dropdown {
          position: absolute;
          top: 48px; right: 0;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lift);
          width: 230px;
          padding: 0.5rem;
          z-index: 150;
          animation: dropdown-in 0.18s ease;
        }
        @keyframes dropdown-in {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .account-dropdown-head {
          display: flex; flex-direction: column;
          padding: 0.6rem 0.7rem 0.8rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 0.4rem;
        }
        .account-dropdown-head strong { font-size: 0.92rem; color: var(--brown); }
        .account-dropdown-head span { font-size: 0.76rem; color: var(--brown-soft); }
        .account-dropdown a, .account-dropdown button {
          display: flex; align-items: center; gap: 0.6rem;
          width: 100%;
          padding: 0.6rem 0.7rem;
          border-radius: var(--radius-sm);
          font-size: 0.86rem;
          font-weight: 600;
          color: var(--brown);
          background: none;
          border: none;
          text-align: left;
        }
        .account-dropdown a:hover, .account-dropdown button:hover { background: var(--cream-soft); }
        .account-dropdown button { color: var(--danger); }
        .cart-btn { position: relative; }
        .cart-count {
          position: absolute;
          top: 2px; right: 2px;
          background: var(--gold);
          color: var(--brown);
          font-size: 0.65rem;
          font-weight: 800;
          min-width: 17px; height: 17px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          padding: 0 3px;
        }
        .navbar-search { padding: 0 1.5rem 1rem; }

        @media (max-width: 1080px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .theme-toggle span, .login-nav-btn span { display: none; }
          .theme-toggle, .login-nav-btn { width: 40px; min-width: 40px; padding: 0; }
        }
      `}</style>
    </>
  );
}
