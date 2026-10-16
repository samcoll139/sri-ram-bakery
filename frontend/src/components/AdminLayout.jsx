import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, ClipboardList, MessageSquareText, BarChart3, LogOut, Cake, Home, Sun, Bell, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/reviews', label: 'Reviews', icon: MessageSquareText },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminLayout({ title, subtitle, children }) {
  const { admin, adminLogout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    adminLogout();
    navigate('/admin/login');
  }

  const displayName = admin?.name || admin?.email?.split('@')[0] || 'Admin';

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark"><Cake size={21} /></div>
          <div><strong>Sriram Cakes</strong><span>Admin Management</span></div>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar"><UserRound size={18} /></div>
          <div><strong>{displayName}</strong><span><i /> Administrator</span></div>
        </div>

        <nav className="admin-nav">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>
              <link.icon size={17} />
              <span>{link.label}</span>
              {link.end && <b className="nav-dot" />}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <button className="admin-back" onClick={() => navigate('/')}><Home size={16} /> Back to Website</button>
          <button className="admin-logout" onClick={handleLogout}><LogOut size={16} /> Sign Out</button>
          <small>Sriram Cakes CMS v2.0</small>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-welcome">
            <span>Welcome back, <strong>{displayName.toUpperCase()}!</strong></span>
            {subtitle && <small>{subtitle}</small>}
          </div>
          <div className="admin-top-actions">
            <button aria-label="Home" onClick={() => navigate('/admin')}><Home size={17} /></button>
            <button aria-label="Theme"><Sun size={17} /></button>
            <button aria-label="Notifications"><Bell size={17} /></button>
            <button className="top-signout" onClick={handleLogout}>Sign Out</button>
          </div>
        </header>

        <section className="admin-content">
          <div className="admin-page-heading">
            <div><span className="admin-kicker">Sriram Cakes</span><h1>{title}</h1></div>
          </div>
          {children}
        </section>
      </main>

      <style>{`
        .admin-shell {
          --admin-bg: #171717;
          --admin-panel: #1d1d1d;
          --admin-panel-2: #202020;
          --admin-sidebar: #292929;
          --admin-border: rgba(255,255,255,.075);
          --admin-text: #f4f1eb;
          --admin-muted: #9b9b9b;
          --admin-gold: #d5b32d;
          --admin-gold-soft: #e1c85c;
          --admin-brown: #9c795a;
          display: grid;
          grid-template-columns: 200px minmax(0, 1fr);
          min-height: 100vh;
          background:
            radial-gradient(circle at 82% 0%, rgba(245, 158, 11, .16), transparent 24%),
            radial-gradient(circle at 18% 100%, rgba(255, 140, 40, .10), transparent 26%),
            linear-gradient(135deg, #080706 0%, #17100b 48%, #090b12 100%);
          color: var(--admin-text);
          position: relative;
          isolation: isolate;
          overflow: hidden;
          font-family: var(--font-body);
        }
        .admin-shell::before { content:''; position:fixed; inset:0; z-index:-2; pointer-events:none; background:radial-gradient(circle at 15% 75%, rgba(245,158,11,.10), transparent 20%), radial-gradient(circle at 90% 25%, rgba(147,51,234,.08), transparent 22%); }
        .admin-shell::after { content:''; position:fixed; inset:0; z-index:-1; pointer-events:none; opacity:.18; background-image:radial-gradient(rgba(255,255,255,.22) 0.7px, transparent 0.7px); background-size:5px 5px; mask-image:linear-gradient(to bottom, black, transparent 85%); }
        .admin-sidebar {
          background:linear-gradient(180deg,rgba(18,13,10,.96) 0%,rgba(24,18,14,.94) 55%,rgba(9,12,18,.97) 100%);
          border-right: 1px solid var(--admin-border);
          color: var(--admin-text);
          padding: 0;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 10;
        }
        .admin-brand { min-height: 58px; padding: 7px 9px; display:flex; align-items:center; gap:9px; border-bottom:1px solid var(--admin-border); }
        .admin-brand-mark { width:35px;height:35px;border-radius:10px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;display:grid;place-items:center;box-shadow:0 5px 14px rgba(213,179,45,.15); }
        .admin-brand strong { display:block;font-size:13px;line-height:1.15; }
        .admin-brand span { display:block;color:var(--admin-gold-soft);font-size:11px;line-height:1.25; }
        .admin-profile { display:flex;align-items:center;gap:10px;padding:13px 10px;border-bottom:1px solid var(--admin-border); }
        .admin-avatar { width:34px;height:34px;border-radius:50%;background:var(--admin-gold);color:#fff;display:grid;place-items:center;flex:none; }
        .admin-profile strong { display:block;font-size:12px; }
        .admin-profile span { display:flex;align-items:center;gap:5px;color:#c6c6c6;font-size:10px;margin-top:2px; }
        .admin-profile i { width:6px;height:6px;border-radius:50%;background:#46d36d;display:inline-block; }
        .admin-nav { display:flex;flex-direction:column;gap:3px;padding:10px 7px;flex:1; }
        .admin-nav-link { min-height:39px;display:flex;align-items:center;gap:11px;padding:0 10px;border-radius:8px;color:#bdbdbd;font-size:12px;font-weight:600;transition:.18s; }
        .admin-nav-link:hover { background:rgba(255,255,255,.045);color:#eee; }
        .admin-nav-link.active { background:linear-gradient(90deg,rgba(213,179,45,.2),rgba(213,179,45,.07));color:var(--admin-gold-soft);box-shadow:inset 2px 0 0 var(--admin-gold); }
        .admin-nav-link .nav-dot { width:5px;height:5px;background:var(--admin-gold);border-radius:50%;margin-left:auto; }
        .admin-sidebar-bottom { padding:9px 9px 7px;border-top:1px solid var(--admin-border); }
        .admin-back,.admin-logout { width:100%;display:flex;align-items:center;gap:9px;background:none;border:0;color:#a9a9a9;padding:8px 7px;font-size:11px;text-align:left; }
        .admin-back:hover,.admin-logout:hover { color:#eee; }
        .admin-sidebar-bottom small { display:block;color:#8b8b8b;font-size:9px;padding:8px 14px 0; }
        .admin-main { min-width:0; background:radial-gradient(circle at 75% 0%,rgba(245,158,11,.08),transparent 30%),linear-gradient(180deg,rgba(12,10,9,.88),rgba(10,12,18,.96)); overflow:hidden; position:relative; }
        .admin-main::before { content:''; position:absolute; top:0; right:0; width:48%; height:240px; background:radial-gradient(circle at 60% 35%,rgba(245,158,11,.13),transparent 58%); pointer-events:none; }
        .admin-topbar { backdrop-filter:blur(16px); background:rgba(12,10,9,.72)!important; }
        .admin-topbar { height:42px;background:#1a1a1a;border-bottom:1px solid var(--admin-border);display:flex;align-items:center;justify-content:space-between;padding:0 22px;position:sticky;top:0;z-index:8; }
        .admin-welcome span { color:#999;font-size:13px; }.admin-welcome strong{color:var(--admin-gold);font-weight:800}.admin-welcome small{display:none}
        .admin-top-actions { display:flex;align-items:center;gap:8px; }.admin-top-actions button { width:30px;height:30px;border:0;background:transparent;color:#969696;display:grid;place-items:center;border-radius:7px; }.admin-top-actions button:hover{background:#242424;color:#eee}.admin-top-actions .top-signout{width:auto;padding:0 6px;font-size:12px;display:block;}
        .admin-content { padding: 6px 22px 30px; }
        .admin-page-heading { min-height:1px; margin-bottom:6px; display:flex;align-items:center;justify-content:space-between; }.admin-kicker{display:none}.admin-page-heading h1{display:none}
        .admin-shell .card { background:linear-gradient(145deg,rgba(31,24,20,.94),rgba(19,21,28,.94));color:var(--admin-text);border:1px solid var(--admin-border);box-shadow:0 14px 34px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.035); }
        .admin-shell h1,.admin-shell h2,.admin-shell h3,.admin-shell h4{color:#f2eee7}.admin-shell p,.admin-shell label,.admin-shell th,.admin-shell td,.admin-shell .analytics-label,.admin-shell .analytics-sub{color:#9c9c9c}.admin-shell th{border-bottom-color:var(--admin-border)}.admin-shell td{border-bottom-color:var(--admin-border)}
        .admin-shell input,.admin-shell select,.admin-shell textarea{background:#181818!important;color:#eee!important;border-color:var(--admin-border)!important}.admin-shell input::placeholder{color:#6e6e6e}
        @media (max-width: 900px) { .admin-shell{grid-template-columns:1fr}.admin-sidebar{position:relative;height:auto}.admin-nav{flex-direction:row;overflow:auto}.admin-sidebar-bottom{display:none}.admin-content{padding:10px 14px 24px}.admin-topbar{padding:0 14px}.admin-nav-link{white-space:nowrap}.admin-nav-link .nav-dot{display:none} }
        @media (max-width: 620px) { .admin-top-actions button:nth-child(2),.admin-top-actions button:nth-child(3){display:none}.admin-topbar{height:48px}.admin-sidebar{border-right:0}.admin-brand{min-height:52px}.admin-profile{display:none} }
      `}</style>
    </div>
  );
}
