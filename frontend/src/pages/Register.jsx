import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, UserRound, LockKeyhole, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register, verifyLoginOtp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('details');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email address.';
    if (!/^\d{10}$/.test(form.phone.trim())) next.phone = 'Enter a valid 10-digit phone number.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});
    const result = await register(form);
    setSubmitting(false);
    if (!result.success) {
      setErrors({ email: result.message });
      return;
    }
    setStep('otp');
    setMessage('OTP sent to your email. Verify it to activate your account.');
    setDevOtp(result.devOtp || '');
  }

  async function handleVerify(e) {
    e.preventDefault();
    setErrors({});
    if (!/^\d{6}$/.test(otp)) {
      setErrors({ otp: 'Enter the 6-digit OTP.' });
      return;
    }
    setSubmitting(true);
    const result = await verifyLoginOtp(form.email.trim(), otp);
    setSubmitting(false);
    if (!result.success) {
      setErrors({ otp: result.message });
      return;
    }
    navigate('/', { replace: true });
  }

  return (
    <section className="signup-page">
      <div className="signup-panel">
        <Link to="/" className="signup-back"><ArrowLeft size={15} /> Back to Home</Link>
        <div className="signup-card">
          <h1>{step === 'details' ? 'Create Account' : 'Verify Your Email'}</h1>
          <p>{step === 'details' ? 'Create your Sriram Cakes account. You will verify your email with OTP.' : `Enter the OTP sent to ${form.email}.`}</p>
          {step === 'details' ? (
            <form onSubmit={handleRegister}>
              <div className="signup-field"><label>Name</label><div className="signup-input"><UserRound size={17}/><input name="name" value={form.name} onChange={(e) => setForm({...form, name:e.target.value})} placeholder="Your name" required /></div>{errors.name && <small>{errors.name}</small>}</div>
              <div className="signup-field"><label>Email Address</label><div className="signup-input"><Mail size={17}/><input name="email" type="email" value={form.email} onChange={(e) => setForm({...form, email:e.target.value})} placeholder="you@example.com" required /></div>{errors.email && <small>{errors.email}</small>}</div>
              <div className="signup-field"><label>Phone</label><div className="signup-input"><Phone size={17}/><input name="phone" inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => setForm({...form, phone:e.target.value.replace(/\D/g,'').slice(0,10)})} placeholder="10-digit mobile number" required /></div>{errors.phone && <small>{errors.phone}</small>}</div>
              <button className="signup-primary" disabled={submitting}>{submitting ? 'Creating...' : 'Create Account & Send OTP'}</button>
              <p className="signup-switch">Already have an account? <Link to="/login">Sign In</Link></p>
            </form>
          ) : (
            <form onSubmit={handleVerify}>
              <div className="signup-field"><label>One-Time Password</label><div className="signup-input"><LockKeyhole size={17}/><input type={showOtp ? 'text' : 'password'} inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="••••••" required /><button type="button" onClick={() => setShowOtp(v => !v)}>{showOtp ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div>{errors.otp && <small>{errors.otp}</small>}</div>
              <p className="signup-message">{message}</p>
              {devOtp && <p className="signup-dev">Development OTP: <strong>{devOtp}</strong></p>}
              <button className="signup-primary" disabled={submitting}>{submitting ? 'Verifying...' : 'Verify & Create Account'}</button>
              <button type="button" className="signup-secondary" onClick={() => { setStep('details'); setOtp(''); setErrors({}); }}>Change Details</button>
            </form>
          )}
        </div>
      </div>
      <style>{`
        .signup-page { min-height: calc(100vh - 82px); display:flex; justify-content:center; align-items:center; background: #17171a; padding: 3rem 1rem; }
        .signup-panel { width:min(100%, 540px); position:relative; }
        .signup-back { display:inline-flex; gap:.35rem; align-items:center; color:#ddd7ce; margin-bottom:1rem; font-size:.82rem; }
        .signup-card { background:#1d1d1f; border:1px solid #37373c; border-radius:17px; padding:2.3rem; color:#fff; box-shadow:0 20px 60px rgba(0,0,0,.28); }
        .signup-card h1 { font-family:var(--font-display); color:#fff; font-size:2.25rem; margin-bottom:.35rem; }
        .signup-card > p { color:#a7b7cf; margin-bottom:1.7rem; line-height:1.5; }
        .signup-field { margin-bottom:1rem; } .signup-field label { display:block; font-size:.86rem; font-weight:700; margin-bottom:.45rem; }
        .signup-input { height:46px; display:flex; align-items:center; gap:.65rem; padding:0 .8rem; border:1px solid #484850; border-radius:9px; background:#202023; color:#9098a7; }
        .signup-input:focus-within { border-color:#a9784b; } .signup-input input { flex:1; min-width:0; border:0; outline:0; background:transparent; color:#fff; }
        .signup-input button { border:0; background:transparent; color:#8f98a8; display:flex; } .signup-field small { color:#ff8d8d; display:block; margin-top:.35rem; font-size:.76rem; }
        .signup-primary { width:100%; border:0; border-radius:8px; background:#8e6845; color:#fff; padding:.85rem; font-weight:800; cursor:pointer; margin-top:.4rem; }
        .signup-primary:disabled { opacity:.65; } .signup-secondary { width:100%; margin-top:.65rem; border:1px solid #44444b; background:transparent; color:#ddd; border-radius:8px; padding:.72rem; cursor:pointer; }
        .signup-switch { text-align:center; font-size:.84rem; color:#aaa; margin-top:1.2rem; } .signup-switch a { color:#bd8144; font-weight:800; }
        .signup-message { color:#8ee0b0 !important; font-size:.82rem; } .signup-dev { color:#e7ae43; text-align:center; font-size:.8rem; }
      `}</style>
    </section>
  );
}
