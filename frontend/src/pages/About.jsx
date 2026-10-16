import { Link } from 'react-router-dom';
import { ShieldCheck, Leaf, Clock, Heart } from 'lucide-react';

const PILLARS = [
  { icon: Leaf, title: 'Freshness', text: 'Every cake, sweet and savoury is prepared in small batches, the same day it reaches your table.' },
  { icon: ShieldCheck, title: 'Quality', text: 'We source ghee, khoya, nuts and flour from trusted suppliers and never compromise on ingredients.' },
  { icon: Clock, title: 'Hygiene', text: 'Our kitchen follows strict hygiene protocols, from prep to packaging to delivery.' },
  { icon: Heart, title: 'Taste', text: 'Traditional recipes passed down through generations, balanced with modern presentation.' },
];

export default function About() {
  return (
    <>
      <section className="about-hero">
        <div className="paisley-overlay" aria-hidden="true" />
        <div className="container about-hero-inner">
          <img src="/images/about-bakery-kitchen.jpg" alt="Sriram Cakes & Sweets kitchen preparing fresh sweets" className="about-hero-image" />
          <div className="about-hero-text">
            <h1>Crafting Sweet <span className="accent">Memories</span> Since 1998</h1>
            <p>One sweet treat at a time, bringing tradition into every celebration.</p>
            <Link to="/products" className="btn btn-primary">Order Now</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <div>
            <span className="kicker">Our story</span>
            <h2>A family kitchen, grown into a beloved sweet shop</h2>
            <p>
              Sriram Cakes &amp; Sweets Shop began as a small family kitchen serving festival sweets to
              neighbours in Chennai. Today, we bring that same care to fresh cakes, traditional Indian
              sweets, savouries, nuts, cookies and bakery products — made daily and delivered with love.
            </p>
            <p>
              We believe celebrations deserve food that tastes like it was made at home: rich ghee sweets,
              perfectly baked cakes, and snacks that disappear before they've cooled.
            </p>
          </div>
          <img src="/images/hero-bakery-spread.jpg" alt="" className="about-image" />
        </div>
      </section>

      <section className="section" style={{ background: 'var(--cream-soft)' }}>
        <div className="container">
          <div className="section-head text-center" style={{ margin: '0 auto 2.5rem' }}>
            <span className="kicker">What guides us</span>
            <h2>Freshness, quality, hygiene, taste</h2>
          </div>
          <div className="grid grid-4">
            {PILLARS.map((p) => (
              <div className="pillar card" key={p.title}>
                <p.icon size={26} color="var(--maroon)" />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .about-hero {
          position: relative;
          background: var(--pastel-pink);
          padding: clamp(3rem, 6vw, 5rem) 0;
          overflow: hidden;
        }
        .paisley-overlay {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 20% 20%, rgba(200,17,47,0.08) 0, transparent 45%),
                             radial-gradient(circle at 80% 30%, rgba(200,17,47,0.06) 0, transparent 40%),
                             radial-gradient(circle at 60% 80%, rgba(200,17,47,0.07) 0, transparent 45%);
          pointer-events: none;
        }
        .about-hero-inner {
          position: relative;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 3rem;
          align-items: center;
        }
        .about-hero-image {
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: cover;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lift);
        }
        .about-hero-text h1 { margin-bottom: 0.6rem; }
        .about-hero-text h1 .accent { color: var(--maroon); }
        .about-hero-text p { font-size: 1.1rem; color: var(--brown-soft); margin-bottom: 1.5rem; }

        .about-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 3rem;
          align-items: center;
        }
        .about-image { border-radius: var(--radius-lg); box-shadow: var(--shadow-lift); aspect-ratio: 4/3; object-fit: cover; }
        .pillar { padding: 1.75rem; }
        .pillar h3 { margin: 0.75rem 0 0.4rem; }
        .pillar p { font-size: 0.9rem; color: var(--brown-soft); margin-bottom: 0; }
        @media (max-width: 900px) {
          .about-hero-inner { grid-template-columns: 1fr; }
          .about-grid { grid-template-columns: 1fr; }
          .about-image { order: -1; }
        }
      `}</style>
    </>
  );
}
