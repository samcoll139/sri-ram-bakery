import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero hero-modern">
      <div className="hero-modern-inner container">
        <div className="hero-logo-wrap">
          <img src="/images/sriram-logo.png" alt="Sriram Bakery" className="hero-logo" />
        </div>
        <div className="hero-modern-copy">
          <span className="hero-eyebrow">Welcome to</span>
          <h1>SRIRAM <span>BAKERY</span></h1>
          <div className="hero-divider"><i></i><span>Freshly Baked, Always...</span><i></i></div>
          <p>Fresh cakes, traditional sweets and crispy savouries made with care for every celebration.</p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary">Explore Products</Link>
            <Link to="/custom-cake" className="btn btn-gold">Order a Custom Cake</Link>
          </div>
        </div>
      </div>
      <div className="hero-ribbon container">
        <span>CAKES</span><span>SWEETS</span><span>SAVOURIES</span><span>NUTS</span><span>BAKERY</span>
      </div>
      <style>{`
        .hero-modern { background: linear-gradient(180deg,#fbf1df 0%,#fffaf1 100%); padding: 0 0 1.6rem; border-bottom: 1px solid var(--gold-soft); }
        .hero-modern-inner { min-height: 400px; display:grid; grid-template-columns: 330px minmax(0, 1fr); align-items:center; gap:3.5rem; }
        .hero-logo-wrap { display:flex; justify-content:center; }
        .hero-logo { width:min(300px,78vw); height:auto; filter: drop-shadow(0 15px 22px rgba(61,35,23,.18)); }
        .hero-modern-copy { text-align:center; max-width:760px; margin:0 auto; width:100%; }
        .hero-modern-copy .hero-eyebrow { color:var(--gold); font-family:var(--font-display); font-style:italic; font-size:1.05rem; }
        .hero-modern-copy h1 { font-size:clamp(2.4rem,5.1vw,4.6rem); color:var(--brown); letter-spacing:.025em; margin:.15rem 0 .7rem; white-space:nowrap; }
        .hero-modern-copy h1 span { color:var(--maroon-dark); }
        .hero-divider { display:flex; align-items:center; justify-content:center; gap:1rem; color:var(--brown); font-family:var(--font-display); font-style:italic; font-size:clamp(1.05rem,2.4vw,1.55rem); margin-bottom:1rem; }
        .hero-divider i { width:90px; height:2px; background:var(--gold); display:block; }
        .hero-modern-copy p { margin:0 auto 1.5rem; color:var(--brown-soft); max-width:58ch; font-size:1.05rem; }
        .hero-modern-copy .hero-actions { justify-content:center; }
        .hero-ribbon { display:flex; justify-content:center; flex-wrap:wrap; gap:0; background:var(--brown); color:var(--white); border-radius:999px; overflow:hidden; box-shadow:var(--shadow); }
        .hero-ribbon span { padding:.65rem 1.35rem; font-size:.76rem; letter-spacing:.12em; font-weight:800; }
        .hero-ribbon span + span { border-left:1px solid rgba(255,255,255,.18); }
        @media(max-width:900px){ .hero-modern-inner{grid-template-columns:1fr; min-height:auto; gap:1.25rem; padding-top:2rem;} .hero-logo{width:230px;} .hero-modern-copy h1{font-size:clamp(2.4rem,8vw,3.6rem); white-space:normal;} .hero-divider i{width:45px;} .hero-ribbon{border-radius:16px;} .hero-ribbon span{flex:1 1 30%; text-align:center;} }
      `}</style>
    </section>
  );
}
