// Real API client for the Sriram Cakes & Sweets Shop backend
// (Express + SQLite — see /backend in the project root).
// Every function here makes an actual HTTP call; there is no mock data
// left in this file. If the backend is not running, calls will reject
// and the calling component should show an appropriate error/loading state.

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const TOKEN_KEY = 'sriram_token';
const ADMIN_TOKEN_KEY = 'sriram_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}
export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}
export function setAdminToken(token) {
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
  else localStorage.removeItem(ADMIN_TOKEN_KEY);
}

async function request(path, { method = 'GET', body, admin = false, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = admin ? getAdminToken() : auth ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    const err = new Error(
      `Could not reach the backend at ${API_BASE}. Is it running? (npm run dev inside /backend)`
    );
    err.cause = networkErr;
    throw err;
  }

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const err = new Error(data?.error || `Request failed with status ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ---- Catalogue ----
export function getProducts(params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''))
  ).toString();
  return request(`/products${query ? `?${query}` : ''}`, { auth: false });
}
export function getProductById(id) {
  return request(`/products/${id}`, { auth: false });
}
export function getRelatedProducts(id) {
  return request(`/products/${id}/related`, { auth: false });
}
export function getCategories() {
  return request('/categories', { auth: false });
}

// ---- Auth ----
export async function requestLoginOtp(email) {
  return request('/auth/request-otp', { method: 'POST', body: { email }, auth: false });
}
export async function verifyLoginOtp(email, otp) {
  const data = await request('/auth/verify-otp', { method: 'POST', body: { email, otp }, auth: false });
  setToken(data.token);
  return data;
}
export async function login(credentials) {
  return requestLoginOtp(credentials.email);
}
export async function register(payload) {
  return request('/auth/register', { method: 'POST', body: payload, auth: false });
}
export function getMe() {
  return request('/auth/me');
}
export function logout() {
  setToken(null);
}

// ---- Addresses ----
export function getAddresses() {
  return request('/addresses');
}
export function addAddress(payload) {
  return request('/addresses', { method: 'POST', body: payload });
}
export function updateAddress(id, payload) {
  return request(`/addresses/${id}`, { method: 'PUT', body: payload });
}
export function deleteAddress(id) {
  return request(`/addresses/${id}`, { method: 'DELETE' });
}
export function setDefaultAddress(id) {
  return request(`/addresses/${id}/default`, { method: 'POST' });
}

// ---- Orders ----
export function createOrder(payload) {
  // Works for both logged-in customers (token attached automatically if
  // present) and guests (no token — backend records it as a guest order).
  return request('/orders', { method: 'POST', body: payload });
}
export function getOrders() {
  return request('/orders');
}
export function getOrderById(id) {
  return request(`/orders/${id}`);
}
export function confirmOrder(id) {
  return request(`/orders/${id}/confirm`, { method: 'POST' });
}
export function cancelOrder(id) {
  return request(`/orders/${id}/cancel`, { method: 'POST' });
}

// ---- Reviews ----
export function getReviews() {
  return request('/reviews', { auth: false });
}
export function createReview(payload) {
  return request('/reviews', { method: 'POST', body: payload, auth: false });
}

// ---- Custom cake orders ----
export function createCustomCakeOrder(payload) {
  return request('/custom-cake-orders', { method: 'POST', body: payload, auth: false });
}

// ---- Admin auth ----
export async function adminLogin(credentials) {
  const data = await request('/admin/login', { method: 'POST', body: credentials, auth: false });
  setAdminToken(data.token);
  return data;
}
export function adminLogout() {
  setAdminToken(null);
}

// ---- Admin: products & categories ----
export function adminCreateProduct(payload) {
  return request('/admin/products', { method: 'POST', body: payload, admin: true });
}
export function adminUpdateProduct(id, payload) {
  return request(`/admin/products/${id}`, { method: 'PUT', body: payload, admin: true });
}
export function adminDeleteProduct(id) {
  return request(`/admin/products/${id}`, { method: 'DELETE', admin: true });
}
export function adminCreateCategory(payload) {
  return request('/admin/categories', { method: 'POST', body: payload, admin: true });
}
export function adminUpdateCategory(id, payload) {
  return request(`/admin/categories/${id}`, { method: 'PUT', body: payload, admin: true });
}
export function adminDeleteCategory(id) {
  return request(`/admin/categories/${id}`, { method: 'DELETE', admin: true });
}

// ---- Admin: orders ----
export function adminGetAllOrders() {
  return request('/orders/admin/all', { admin: true });
}
export function adminUpdateOrderStatus(id, status) {
  return request(`/orders/admin/${id}/status`, { method: 'PUT', body: { status }, admin: true });
}

// ---- Admin: reviews ----
export function adminDeleteReview(id) {
  return request(`/reviews/${id}`, { method: 'DELETE', admin: true });
}

// ---- Admin: custom cake orders ----
export function adminGetCustomCakeOrders() {
  return request('/custom-cake-orders', { admin: true });
}
export function adminUpdateCustomCakeStatus(id, status) {
  return request(`/custom-cake-orders/${id}/status`, { method: 'PUT', body: { status }, admin: true });
}

// ---- Admin: analytics ----
export function getAnalyticsSummary() {
  return request('/admin/analytics/summary', { admin: true });
}
export function getSalesAnalytics(range = '7d') {
  return request(`/admin/analytics/sales?range=${range}`, { admin: true });
}
export function getCategoryAnalytics() {
  return request('/admin/analytics/category', { admin: true });
}
export function getTopProducts() {
  return request('/admin/analytics/top-products', { admin: true });
}
export function getOrderAnalytics() {
  return request('/admin/analytics/order-status', { admin: true });
}
export function getCustomerAnalytics() {
  return request('/admin/analytics/customers', { admin: true });
}
export function getProductPerformance() {
  return request('/admin/analytics/product-performance', { admin: true });
}
export function getPeriodFinancials(period = 'daily') {
  return request(`/admin/analytics/period-financials?period=${period}`, { admin: true });
}

// ---- Customer: personal purchase analytics ----
export function getMyPurchases() {
  return request('/user/purchases');
}
export function getMySpending() {
  return request('/user/spending');
}

// ---- Sriram AI chatbot (Gemini-powered, with local fallback in the UI) ----
export function chatWithAI(message, history = []) {
  return request('/ai/chat', {
    method: 'POST',
    body: { message, history },
    auth: false,
  });
}

export { API_BASE };
