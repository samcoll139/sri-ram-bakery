import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as api from '../services/api.js';
import { PRODUCTS as LOCAL_PRODUCTS, CATEGORIES as LOCAL_CATEGORIES } from '../data/products.js';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  // Render instantly from the bundled catalogue, then swap in live data
  // from the backend as soon as it responds. If the backend is down,
  // the site keeps working off the local snapshot instead of breaking.
  const [products, setProducts] = useState(LOCAL_PRODUCTS);
  const [categories, setCategories] = useState(LOCAL_CATEGORIES);
  const [source, setSource] = useState('local'); // 'local' | 'api'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [apiProducts, apiCategories] = await Promise.all([api.getProducts(), api.getCategories()]);
      const apiIds = new Set(apiProducts.map((p) => String(p.id)));
      const localExtras = LOCAL_PRODUCTS.filter((p) => !apiIds.has(String(p.id)));
      setProducts([...apiProducts, ...localExtras]);
      setCategories(apiCategories.length ? apiCategories : LOCAL_CATEGORIES);
      setSource('api');
      setError(null);
    } catch (err) {
      // Backend unreachable — keep whatever we already have (local or last-known-good).
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function getProductById(id) {
    return products.find((p) => String(p.id) === String(id));
  }

  function getProductsByCategory(categoryId) {
    if (!categoryId || categoryId === 'all') return products;
    return products.filter((p) => p.category === categoryId);
  }

  function getRelatedProducts(product, count = 4) {
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, count);
  }

  function getCategoryProductCount(categoryId) {
    const cat = categories.find((c) => c.id === categoryId);
    if (cat && typeof cat.productCount === 'number') return cat.productCount;
    return products.filter((p) => p.category === categoryId).length;
  }

  function getBestRated(count = 6) {
    return [...products].sort((a, b) => b.rating - a.rating).slice(0, count);
  }

  function getBiggestDiscounts(count = 6) {
    return [...products].sort((a, b) => b.discount - a.discount).slice(0, count);
  }

  const value = {
    products,
    categories,
    loading,
    error,
    source,
    refresh,
    getProductById,
    getProductsByCategory,
    getRelatedProducts,
    getCategoryProductCount,
    getBestRated,
    getBiggestDiscounts,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductsProvider');
  return ctx;
}
