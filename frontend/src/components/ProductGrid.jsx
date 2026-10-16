import ProductCard from './ProductCard.jsx';
import EmptyState from './EmptyState.jsx';

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        message="Try a different search term or category filter."
      />
    );
  }

  return (
    <div className="grid grid-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
