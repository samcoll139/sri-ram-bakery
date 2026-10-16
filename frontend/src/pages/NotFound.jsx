import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="section not-found">
      <div className="container text-center">
        <Cookie size={48} color="var(--gold)" />
        <h1>404 — Page Not Found</h1>
        <p>The page you're looking for has been eaten. Let's get you back to something sweet.</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>

      <style>{`
        .not-found { padding: 6rem 0; }
        .not-found .container { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
      `}</style>
    </section>
  );
}
