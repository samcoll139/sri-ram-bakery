import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch, placeholder = 'Search for cakes, sweets, cookies...', autoFocus = false, initialValue = '' }) {
  const [value, setValue] = useState(initialValue);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch?.(value.trim());
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <Search size={18} />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
      />
      <button type="submit" className="btn btn-primary">Search</button>

      <style>{`
        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: var(--white);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 0.5rem 0.75rem;
          color: var(--brown-soft);
        }
        .search-bar input {
          flex: 1;
          border: none;
          outline: none;
          font-family: inherit;
          font-size: 0.95rem;
          background: transparent;
          color: var(--brown);
        }
        .search-bar .btn { padding: 0.55rem 1.1rem; font-size: 0.85rem; }
      `}</style>
    </form>
  );
}
