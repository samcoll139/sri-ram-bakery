import { Link } from 'react-router-dom';

export default function CategoryCard({ category, count }) {
  return (
    <Link to={`/products?category=${category.id}`} className="category-card card">
      <div className="category-image" style={{ backgroundImage: `url(${category.image})` }}>
        
      </div>
      <div className="category-body">
        <h3>{category.name}</h3>
        <span className="category-count">{count} products</span>
        <span className="category-link">View Products</span>
      </div>

      <style>{`
        .category-card {
          overflow: hidden;
          display: block;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lift);
        }
        .category-image {
          height: 155px;
          background-size: cover;
          background-position: center;
          background-color: var(--cream-soft);
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          padding: 0.6rem;
        }
        .category-emoji {
          font-size: 1.6rem;
          background: var(--white);
          border-radius: 50%;
          width: 42px; height: 42px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: var(--shadow);
        }
        .category-body { padding: 1.1rem 1.2rem 1.35rem; }
        .category-body h3 { margin-bottom: 0.2rem; font-size: 1.15rem; }
        .category-count {
          display: block;
          font-size: 0.82rem;
          color: var(--brown-soft);
          margin-bottom: 0.75rem;
        }
        .category-link {
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--maroon);
        }
      `}</style>
    </Link>
  );
}
