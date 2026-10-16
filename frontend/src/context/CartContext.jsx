import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'sriram_cart_v1';
const DELIVERY_FEE = 40;
const FREE_DELIVERY_THRESHOLD = 999;

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable (private browsing etc.) - fail silently
    }
  }, [items]);

  function addToCart(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          finalPrice: product.finalPrice,
          originalPrice: product.originalPrice,
          weight: product.weight,
          quantity,
        },
      ];
    });
  }

  function removeFromCart(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function increaseQuantity(id) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)));
  }

  function decreaseQuantity(id) {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.finalPrice * i.quantity, 0),
    [items]
  );

  const originalSubtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.originalPrice * i.quantity, 0),
    [items]
  );

  const discountTotal = Math.max(originalSubtotal - subtotal, 0);
  const deliveryFee = items.length === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const grandTotal = subtotal + deliveryFee;

  function getCartTotal() {
    return grandTotal;
  }

  function getCartCount() {
    return items.reduce((count, i) => count + i.quantity, 0);
  }

  const value = {
    items,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    subtotal,
    discountTotal,
    deliveryFee,
    grandTotal,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
