import { Link, Navigate } from 'react-router-dom';
import { PackageSearch, MapPin, LogOut, User, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useOrders } from '../context/OrderContext.jsx';

export default function Account() {
  const { user, logout } = useAuth();
  const { getOrders, getAddresses } = useOrders();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const orderCount = getOrders().length;
  const addressCount = getAddresses().length;

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="kicker">Welcome back</span>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>

        <div className="grid grid-3">
          <Link to="/account/orders" className="account-tile card">
            <PackageSearch size={24} />
            <h3>Order History</h3>
            <p>{orderCount} order{orderCount !== 1 ? 's' : ''} placed</p>
          </Link>

          <Link to="/account/purchases" className="account-tile card">
            <TrendingUp size={24} />
            <h3>My Purchases</h3>
            <p>Spending &amp; purchase history</p>
          </Link>

          <Link to="/account/addresses" className="account-tile card">
            <MapPin size={24} />
            <h3>Saved Addresses</h3>
            <p>{addressCount} address{addressCount !== 1 ? 'es' : ''} saved</p>
          </Link>

          <button className="account-tile card logout-tile" onClick={logout}>
            <LogOut size={24} />
            <h3>Logout</h3>
            <p>Sign out of your account</p>
          </button>
        </div>
      </div>

      <style>{`
        .account-tile {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.4rem;
          color: var(--maroon);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          text-align: left;
          background: var(--card-bg);
          border: 1px solid var(--border);
          width: 100%;
        }
        .account-tile:hover { transform: translateY(-3px); box-shadow: var(--shadow-lift); }
        .account-tile h3 { margin: 0.5rem 0 0.1rem; color: var(--brown); }
        .account-tile p { color: var(--brown-soft); font-size: 0.88rem; margin: 0; }
        .logout-tile { color: var(--danger); cursor: pointer; }
      `}</style>
    </section>
  );
}
