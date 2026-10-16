export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="feature-card card">
      <div className="feature-icon"><Icon size={26} /></div>
      <h3>{title}</h3>
      <p>{description}</p>

      <style>{`
        .feature-card {
          padding: 1.75rem;
          text-align: left;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lift);
        }
        .feature-icon {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: var(--cream-soft);
          color: var(--maroon);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1rem;
        }
        .feature-card h3 { margin-bottom: 0.4rem; }
        .feature-card p { font-size: 0.92rem; color: var(--brown-soft); margin-bottom: 0; }
      `}</style>
    </div>
  );
}
