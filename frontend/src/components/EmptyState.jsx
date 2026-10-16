import { PackageOpen } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', message = '', action = null }) {
  return (
    <div className="empty-state">
      <PackageOpen size={40} />
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}

      <style>{`
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.6rem;
          padding: 3.5rem 1.5rem;
          color: var(--brown-soft);
        }
        .empty-state h3 { margin-bottom: 0; color: var(--maroon-dark); }
        .empty-state p { margin-bottom: 0.5rem; }
      `}</style>
    </div>
  );
}
