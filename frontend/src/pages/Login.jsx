import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, LockKeyhole, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { requestLoginOtp, verifyLoginOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  async function handleRequestOtp(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setDevOtp('');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    const result = await requestLoginOtp(email.trim());
    setSubmitting(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setStep('otp');
    setMessage('OTP sent to your email. It is valid for 10 minutes.');
    if (result.devOtp) setDevOtp(result.devOtp);
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit OTP.');
      return;
    }
    setSubmitting(true);
    const result = await verifyLoginOtp(email.trim(), otp);
    setSubmitting(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    const redirectTo = location.state?.from?.pathname || '/';
    navigate(redirectTo, { replace: true });
  }

  return (
    <section className="otp-login-page">
      <div className="otp-login-visual">
        <div className="otp-visual-overlay" />
        <div className="otp-visual-content">
          <div className="otp-brand-mark"><Sparkles size={18} /> <span>SRIRAM CAKES</span></div>
          <h1>Welcome Back!</h1>
          <p>Sign in to access your orders, favourites, offers and rewards.</p>
          <div className="otp-tagline">Sweetness in Every Celebration</div>
        </div>
      </div>

      <div className="otp-login-panel">
        <Link to="/" className="otp-home-link"><ArrowLeft size={15} /> Back to Home</Link>
        <div className="otp-card">
          <h2>{step === 'email' ? 'Sign In' : 'Verify OTP'}</h2>
          <p className="otp-sub">{step === 'email' ? 'Welcome back! Enter your email to continue.' : `Enter the 6-digit code sent to ${email}.`}</p>

          {step === 'email' ? (
            <form onSubmit={handleRequestOtp}>
              <label className="otp-field-label" htmlFor="login-email">Email Address</label>
              <div className="otp-input-wrap">
                <Mail size={17} />
                <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
              </div>

              {error && <p className="otp-error">{error}</p>}
              <button type="submit" className="otp-primary-btn" disabled={submitting}>
                {submitting ? 'Sending OTP...' : 'Send OTP to Email'}
              </button>
              <p className="otp-note"><LockKeyhole size={14} /> Your password is not required. We use a secure email OTP.</p>
              <p className="otp-switch">Don&apos;t have an account? <Link to="/register">Register Now</Link></p>
              <p className="otp-admin-link"><Link to="/admin/login">Admin Login</Link></p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <label className="otp-field-label" htmlFor="login-otp">One-Time Password</label>
              <div className="otp-input-wrap">
                <LockKeyhole size={17} />
                <input id="login-otp" type={showOtp ? 'text' : 'password'} inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="••••••" autoComplete="one-time-code" required />
                <button type="button" className="otp-eye" onClick={() => setShowOtp((v) => !v)} aria-label={showOtp ? 'Hide OTP' : 'Show OTP'}>{showOtp ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              </div>
              {message && <p className="otp-success">{message}</p>}
              {devOtp && <p className="otp-dev">Development OTP: <strong>{devOtp}</strong></p>}
              {error && <p className="otp-error">{error}</p>}
              <button type="submit" className="otp-primary-btn" disabled={submitting}>
                {submitting ? 'Verifying...' : 'Verify & Sign In'}
              </button>
              <button type="button" className="otp-back-btn" onClick={() => { setStep('email'); setOtp(''); setError(''); setMessage(''); setDevOtp(''); }}>Change Email</button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .otp-login-page { min-height: calc(100vh - 82px); display: grid; grid-template-columns: 1fr 1.08fr; background: #17171a; }
        .otp-login-visual { position: relative; min-height: 650px; overflow: hidden; background: radial-gradient(circle at 65% 35%, #8c5b35 0, #3c2920 25%, #1c1b1d 65%, #111113 100%); }
        .otp-login-visual::before { content: ''; position: absolute; inset: 0; background-image: url('/images/black-forest-cake.jpg'); background-size: cover; background-position: center; opacity: .38; }
        .otp-visual-overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(13,13,14,.35), rgba(13,13,14,.68)); }
        .otp-visual-content { position: absolute; left: clamp(2rem, 5vw, 4rem); bottom: 4.5rem; max-width: 520px; color: #fff; z-index: 1; }
        .otp-brand-mark { display: flex; align-items: center; gap: .55rem; color: #e7ae43; font-size: .82rem; font-weight: 800; letter-spacing: .14em; margin-bottom: 4rem; }
        .otp-visual-content h1 { color: #fff; font-family: var(--font-display); font-size: clamp(2.7rem, 5vw, 4.3rem); margin-bottom: .8rem; }
        .otp-visual-content p { color: rgba(255,255,255,.85); font-size: 1.1rem; line-height: 1.55; max-width: 460px; }
        .otp-tagline { margin-top: 1.1rem; color: #e7ae43; font-weight: 700; letter-spacing: .06em; }
        .otp-login-panel { position: relative; display: flex; align-items: center; justify-content: center; padding: 5rem 2rem 3rem; }
        .otp-home-link { position: absolute; top: 1.5rem; right: 2rem; color: #e9e4dc; border: 1px solid #3a3a40; border-radius: 13px; padding: .6rem .9rem; font-size: .82rem; display: flex; align-items: center; gap: .35rem; }
        .otp-home-link:hover { border-color: #9d7148; color: #fff; }
        .otp-card { width: min(100%, 470px); background: rgba(29,29,31,.95); border: 1px solid #35353a; border-radius: 17px; padding: 2.35rem 2rem 2rem; box-shadow: 0 20px 60px rgba(0,0,0,.3); color: #fff; }
        .otp-card h2 { font-family: var(--font-display); color: #fff; font-size: 2.2rem; margin-bottom: .35rem; }
        .otp-sub { color: #a7b7cf; margin-bottom: 1.8rem; line-height: 1.5; }
        .otp-field-label { display: block; color: #fff; font-size: .88rem; font-weight: 700; margin-bottom: .55rem; }
        .otp-input-wrap { display: flex; align-items: center; gap: .7rem; height: 47px; padding: 0 .85rem; border: 1px solid #4a4a51; border-radius: 9px; background: #1f1f21; color: #8d98aa; margin-bottom: 1.25rem; }
        .otp-input-wrap:focus-within { border-color: #a9784b; box-shadow: 0 0 0 3px rgba(169,120,75,.12); }
        .otp-input-wrap input { width: 100%; border: 0; outline: 0; background: transparent; color: #fff; font-size: .95rem; }
        .otp-input-wrap input::placeholder { color: #687083; }
        .otp-eye { background: transparent; border: 0; color: #8993a5; display: flex; cursor: pointer; }
        .otp-primary-btn { width: 100%; border: 0; border-radius: 8px; background: #8e6845; color: #fff; padding: .82rem 1rem; font-weight: 800; font-size: .95rem; cursor: pointer; transition: .18s ease; }
        .otp-primary-btn:hover:not(:disabled) { background: #a17850; transform: translateY(-1px); }
        .otp-primary-btn:disabled { opacity: .65; cursor: not-allowed; }
        .otp-note { display: flex; align-items: center; justify-content: center; gap: .35rem; color: #8993a5; font-size: .76rem; margin: 1rem 0; text-align: center; }
        .otp-switch, .otp-admin-link { text-align: center; color: #aab0ba; font-size: .84rem; margin-top: 1.15rem; }
        .otp-switch a, .otp-admin-link a { color: #bd8144; font-weight: 800; }
        .otp-admin-link { margin-top: .65rem; }
        .otp-error { color: #ff8d8d; background: rgba(180,40,40,.1); border: 1px solid rgba(255,100,100,.2); border-radius: 8px; padding: .65rem .75rem; font-size: .8rem; margin: 0 0 1rem; }
        .otp-success { color: #8ee0b0; font-size: .8rem; margin: .1rem 0 1rem; }
        .otp-dev { color: #e7ae43; background: rgba(231,174,67,.08); border: 1px dashed rgba(231,174,67,.3); padding: .65rem .75rem; border-radius: 8px; font-size: .8rem; margin: 0 0 1rem; text-align: center; }
        .otp-back-btn { width: 100%; margin-top: .7rem; border: 1px solid #414148; background: transparent; color: #c9c5bf; border-radius: 8px; padding: .72rem 1rem; cursor: pointer; }
        @media (max-width: 850px) { .otp-login-page { grid-template-columns: 1fr; } .otp-login-visual { min-height: 340px; } .otp-visual-content { bottom: 2rem; } .otp-brand-mark { margin-bottom: 1.5rem; } .otp-login-panel { min-height: 560px; } }
      `}</style>
    </section>
  );
}
