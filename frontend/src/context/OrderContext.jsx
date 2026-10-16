import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as api from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

export const ORDER_STAGES = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered'];

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [allOrders, setAllOrders] = useState([]); // admin view
  const [loading, setLoading] = useState(false);

  const refreshOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshAddresses = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      return;
    }
    try {
      const data = await api.getAddresses();
      setAddresses(data);
    } catch {
      setAddresses([]);
    }
  }, [user]);

  useEffect(() => {
    refreshOrders();
    refreshAddresses();
  }, [refreshOrders, refreshAddresses]);

  // ---- Orders (customer) ----
  async function createOrder({ items, address, paymentMethod, amount }) {
    const order = await api.createOrder({ items, address, paymentMethod, amount });
    await refreshOrders();
    return order;
  }

  async function confirmOrder(orderId) {
    const order = await api.confirmOrder(orderId);
    await refreshOrders();
    return order;
  }

  async function cancelOrder(orderId) {
    const order = await api.cancelOrder(orderId);
    await refreshOrders();
    return order;
  }

  async function fetchOrderById(orderId) {
    return api.getOrderById(orderId);
  }

  function getOrders() {
    return orders;
  }

  // ---- Orders (admin) ----
  async function refreshAllOrders() {
    const data = await api.adminGetAllOrders();
    setAllOrders(data);
    return data;
  }

  async function advanceOrderStatus(orderId, status) {
    const order = await api.adminUpdateOrderStatus(orderId, status);
    setAllOrders((prev) => prev.map((o) => (o.id === orderId ? order : o)));
    return order;
  }

  function getAllOrders() {
    return allOrders;
  }

  // ---- Addresses ----
  function getAddresses() {
    return addresses;
  }

  async function addAddress(address) {
    const newAddress = await api.addAddress(address);
    await refreshAddresses();
    return newAddress;
  }

  async function updateAddress(id, updates) {
    const updated = await api.updateAddress(id, updates);
    await refreshAddresses();
    return updated;
  }

  async function deleteAddress(id) {
    await api.deleteAddress(id);
    await refreshAddresses();
  }

  async function setDefaultAddress(id) {
    await api.setDefaultAddress(id);
    await refreshAddresses();
  }

  const value = {
    loading,
    createOrder,
    confirmOrder,
    cancelOrder,
    fetchOrderById,
    getOrders,
    refreshOrders,
    getAllOrders,
    refreshAllOrders,
    advanceOrderStatus,
    getAddresses,
    refreshAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within an OrderProvider');
  return ctx;
}
