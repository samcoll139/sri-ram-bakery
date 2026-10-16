import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cake, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); setError(''); setSubmitting(true);
    try { const result = await adminLogin(form); if (!result.success) { setError(result.message); return; } navigate('/admin'); }
    finally { setSubmitting(false); }
  }

  return (
    <section className="admin-login-section">
      <div className="admin-login-glow" />
      <form className="admin-login-card" onSubmit={handleSubmit} noValidate>
        <div className="login-logo"><Cake size={25} /></div>
        <span className="login-kicker">SRIRAM CAKES</span>
        <h1>Admin Management</h1>
        <p className="admin-login-sub">Sign in to manage your bakery, orders and analytics.</p>
        <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@sriramcakes.in" /></div>
        <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter password" /></div>
        {error && <p className="field-error">{error}</p>}
        <button type="submit" className="admin-login-btn" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign In'}</button>
        <div className="admin-security"><ShieldCheck size={14}/> Secure administrator access</div>
        <p className="admin-hint">Demo: admin@sriramcakes.in / admin123</p>
      </form>
      <style>{`
        .admin-login-section{min-height:100vh;display:grid;place-items:center;position:relative;overflow:hidden;background:#171717;padding:24px;color:#fff}.admin-login-glow{position:absolute;width:520px;height:520px;border-radius:50%;background:rgba(213,179,45,.08);filter:blur(90px);top:-180px;right:-140px}.admin-login-card{position:relative;width:min(410px,100%);padding:36px;border:1px solid rgba(255,255,255,.08);border-radius:20px;background:#202020;box-shadow:0 30px 80px rgba(0,0,0,.4)}.login-logo{width:52px;height:52px;border-radius:14px;background:#d5b32d;color:#fff;display:grid;place-items:center;margin-bottom:18px}.login-kicker{font-size:11px;letter-spacing:.18em;color:#d5b32d;font-weight:800}.admin-login-card h1{font-family:var(--font-display);font-size:30px;color:#f6f0e5;margin:6px 0 8px}.admin-login-sub{color:#999;font-size:13px;margin-bottom:24px}.admin-login-card .field{margin-bottom:14px}.admin-login-card .field label{color:#c6c6c6}.admin-login-card .field input{background:#181818!important;color:#eee!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:10px!important;padding:12px}.admin-login-btn{width:100%;border:0;border-radius:10px;background:#d5b32d;color:#171717;font-weight:800;padding:13px;margin-top:4px}.admin-login-btn:hover{background:#e1c85c}.admin-security{display:flex;justify-content:center;align-items:center;gap:6px;color:#777;font-size:11px;margin-top:17px}.admin-hint{font-size:10px;color:#666;text-align:center;margin:9px 0 0}.admin-login-card .field-error{font-size:12px}
      `}</style>
    </section>
  );
}
