export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="loading-state">
      <span className="loading-spinner" aria-hidden="true" />
      <span>{label}</span>

      <style>{`
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
          padding: 3rem 1rem;
          color: var(--brown-soft);
          font-weight: 600;
        }
        .loading-spinner {
          width: 34px; height: 34px;
          border-radius: 50%;
          border: 3px solid var(--border);
          border-top-color: var(--maroon);
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
