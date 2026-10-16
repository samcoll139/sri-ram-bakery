import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, Grid3x3 } from 'lucide-react';
import SearchBar from '../components/SearchBar.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import { useProducts } from '../context/ProductsContext.jsx';

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'discount', label: 'Highest Discount' },
];

const TABS = [
  { value: 'all', label: 'All Products' },
  { value: 'bestsellers', label: 'Bestsellers' },
  { value: 'new', label: 'New' },
  { value: 'sale', label: 'On Sale' },
];

export default function Products() {
  const { products, categories } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'default';
  const tab = searchParams.get('tab') || 'all';
  const [gridDense, setGridDense] = useState(false);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === 'default') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  }

  const categoryLabel = categories.find((c) => c.id === category)?.name;

  const filtered = useMemo(() => {
    let result = products;

    if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    if (tab === 'bestsellers') result = result.filter((p) => p.tags.includes('bestseller'));
    if (tab === 'sale') result = result.filter((p) => p.discount > 0);
    if (tab === 'new') result = [...result].sort((a, b) => b.id - a.id).slice(0, 8);

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    const sorted = [...result];
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.finalPrice - b.finalPrice);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.finalPrice - a.finalPrice);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        sorted.sort((a, b) => b.discount - a.discount);
        break;
      default:
        break;
    }
    return sorted;
  }, [category, search, sort, tab, products]);

  return (
    <>
      <section className="shop-banner">
        <div className="container shop-banner-inner">
          <div className="shop-banner-copy">
            <span className="shop-kicker">SRIRAM BAKERY</span>
            <h1>Freshly Baked, <span className="accent">Always...</span></h1>
            <p>{categoryLabel ? `Browse our ${categoryLabel.toLowerCase()} collection` : 'Shop our complete selection of cakes, sweets, savouries and more.'}</p>
          </div>
          <img src="/images/sriram-logo.png" alt="Sriram Bakery" className="shop-banner-logo" />
        </div>
      </section>

      <section className="section" style={{ paddingTop: '1.5rem' }}>
        <div className="container">
          <div className="shop-tabs-row">
            <div className="shop-tabs">
              {TABS.map((t) => (
                <button
                  key={t.value}
                  className={'shop-tab' + (tab === t.value ? ' active' : '')}
                  onClick={() => updateParam('tab', t.value)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="shop-tabs-meta">
              <span>{filtered.length} products</span>
              <button className={!gridDense ? 'active' : ''} onClick={() => setGridDense(false)} aria-label="Comfortable grid"><LayoutGrid size={16} /></button>
              <button className={gridDense ? 'active' : ''} onClick={() => setGridDense(true)} aria-label="Dense grid"><Grid3x3 size={16} /></button>
            </div>
          </div>

          <div className="shop-toolbar">
            <SearchBar
              initialValue={search}
              onSearch={(q) => updateParam('search', q)}
            />

            <div className="toolbar-selects">
              <select value={category} onChange={(e) => updateParam('category', e.target.value)} aria-label="Filter by category">
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} aria-label="Sort products">
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={gridDense ? 'dense-grid' : ''}>
            <ProductGrid products={filtered} />
          </div>
        </div>
      </section>

      <style>{`
        .shop-banner {
          background: linear-gradient(135deg, #fff1d9, #fffaf1);
          padding: clamp(2rem, 4vw, 3.5rem) 0;
          border-bottom: 1px solid var(--gold-soft);
        }
        .shop-banner-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .shop-banner h1 { margin-bottom: 0.4rem; color: var(--brown); }
        .shop-kicker { color: var(--gold); font-weight: 800; letter-spacing: .16em; font-size: .75rem; }
        .shop-banner h1 .accent { color: var(--maroon); }
        .shop-banner p { color: var(--brown-soft); margin: 0; font-size: 1.05rem; }
        .shop-banner-logo { width: 170px; height: 170px; object-fit: contain; filter: drop-shadow(0 10px 18px rgba(60,30,10,.16)); }

        .shop-tabs-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 0.9rem;
          margin-bottom: 1.25rem;
        }
        .shop-tabs { display: flex; gap: 1.75rem; flex-wrap: wrap; }
        .shop-tab {
          background: none; border: none;
          font-weight: 700;
          font-size: 0.92rem;
          color: var(--brown-soft);
          padding-bottom: 0.5rem;
          position: relative;
        }
        .shop-tab.active { color: var(--maroon); }
        .shop-tab.active::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -11px;
          height: 2px;
          background: var(--maroon);
        }
        .shop-tabs-meta { display: flex; align-items: center; gap: 0.6rem; color: var(--brown-soft); font-size: 0.85rem; }
        .shop-tabs-meta button {
          background: var(--cream-soft); border: none; border-radius: 6px;
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          color: var(--brown-soft);
        }
        .shop-tabs-meta button.active { background: var(--maroon); color: var(--white); }

        .shop-toolbar {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .shop-toolbar .search-bar { flex: 1; min-width: 260px; }
        .toolbar-selects { display: flex; gap: 0.75rem; }
        .toolbar-selects select {
          padding: 0.7rem 0.9rem;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--border);
          background: var(--white);
          font-family: inherit;
          font-size: 0.9rem;
          color: var(--brown);
        }
        .dense-grid .grid-4 { grid-template-columns: repeat(5, 1fr); gap: 0.9rem; }
        @media (max-width: 1100px) {
          .dense-grid .grid-4 { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .toolbar-selects { width: 100%; }
          .toolbar-selects select { flex: 1; }
          .shop-banner-logo { width: 125px; height: 125px; }
        }
      `}</style>
    </>
  );
}
