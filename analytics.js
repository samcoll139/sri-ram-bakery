// Pure analytics helpers for the admin dashboard / analytics pages.
// They take plain arrays (orders, products, users, categories) and return
// exactly the shapes the React admin pages read, so they can be tested
// without a database.

// The shop doesn't record expenses, so "expense" on the Profit & Loss card is
// an estimate: a fixed share of sales. Set COST_RATIO in .env to change it.
const COST_RATIO = Number(process.env.COST_RATIO || 0.6);

const qty = (i) => Number(i.quantity || i.qty || 1);
const price = (i) => Number(i.finalPrice || i.price || i.product?.finalPrice || 0);
const itemKey = (i) => String(i.id ?? i.productId ?? i.product?.id ?? i.name);
const itemName = (i) => i.name || i.product?.name || String(itemKey(i));
const isCancelled = (o) => o.status === 'Cancelled';
const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };

function catName(categories, value) {
  const c = categories.find((x) => x.id === value || x.name === value);
  return c ? c.name : value || 'Other';
}

function tally(orders) {
  const live = orders.filter((o) => !isCancelled(o));
  const revenue = live.reduce((s, o) => s + Number(o.amount || 0), 0);
  const products = new Map();
  let units = 0;
  for (const o of live) {
    for (const i of o.items || []) {
      const k = itemKey(i);
      const row = products.get(k) || { key: k, name: itemName(i), category: i.category, unitsSold: 0, revenue: 0 };
      row.unitsSold += qty(i);
      row.revenue += price(i) * qty(i);
      products.set(k, row);
      units += qty(i);
    }
  }
  return { live, revenue, units, products };
}

export function buildSummary(orders) {
  const { live, revenue, units, products } = tally(orders);
  const best = [...products.values()].sort((a, b) => b.unitsSold - a.unitsSold)[0];
  const customers = new Set(orders.filter((o) => o.userId).map((o) => String(o.userId))).size;
  return {
    totalRevenue: revenue,
    totalSales: revenue, // older name, kept for compatibility
    revenue,
    totalOrders: orders.length,
    totalCustomers: customers,
    averageOrderValue: live.length ? Math.round(revenue / live.length) : 0,
    productsSold: units,
    bestSellingProduct: best ? best.name : null,
  };
}

function rangeStart(range, now) {
  const d = startOfDay(now);
  if (range === 'today') return d;
  if (range === '30d') { d.setDate(d.getDate() - 29); return d; }
  if (range === 'month') return new Date(now.getFullYear(), now.getMonth(), 1);
  if (range === 'year') return new Date(now.getFullYear(), 0, 1);
  d.setDate(d.getDate() - 6); // default: 7d
  return d;
}

export function buildSales(orders, range = '7d', now = new Date()) {
  const from = rangeStart(range, now);
  const buckets = new Map();
  for (const o of orders) {
    if (isCancelled(o)) continue;
    const t = new Date(o.createdAt);
    if (t < from) continue;
    let key; let label;
    if (range === 'today') { key = t.getHours(); label = t.toLocaleTimeString('en-IN', { hour: 'numeric', hour12: true }); }
    else if (range === 'year') { key = t.getMonth(); label = t.toLocaleDateString('en-IN', { month: 'short' }); }
    else { key = startOfDay(t).getTime(); label = t.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); }
    const b = buckets.get(key) || { key, label, sales: 0, orders: 0 };
    b.sales += Number(o.amount || 0);
    b.orders += 1;
    buckets.set(key, b);
  }
  return [...buckets.values()].sort((a, b) => a.key - b.key).map(({ label, sales, orders: n }) => ({ label, sales, orders: n }));
}

export function buildCategory(orders, categories) {
  const { products } = tally(orders);
  const byCat = new Map();
  for (const p of products.values()) {
    const name = catName(categories, p.category);
    byCat.set(name, (byCat.get(name) || 0) + p.revenue);
  }
  const total = [...byCat.values()].reduce((s, v) => s + v, 0);
  return [...byCat.entries()]
    .map(([category, revenue]) => ({ category, revenue, value: total ? Math.round((revenue / total) * 1000) / 10 : 0 }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function buildTopProducts(orders, limit = 8) {
  const { products } = tally(orders);
  return [...products.values()]
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, limit)
    .map((p) => ({ product: p.name, unitsSold: p.unitsSold, revenue: p.revenue }));
}

const STATUS_ORDER = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];
export function buildOrderStatus(orders) {
  const m = {};
  for (const o of orders) m[o.status || 'Pending'] = (m[o.status || 'Pending'] || 0) + 1;
  return Object.entries(m)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
}

export function buildCustomers(orders, users) {
  const live = orders.filter((o) => !isCancelled(o) && o.userId);
  const per = new Map();
  for (const o of live) {
    const k = String(o.userId);
    const r = per.get(k) || { orders: 0, spend: 0, name: o.address?.name };
    r.orders += 1;
    r.spend += Number(o.amount || 0);
    per.set(k, r);
  }
  const nameOf = (k, r) => users.find((u) => String(u._id) === k)?.name || r.name || 'Customer';
  const n = per.size;
  const spend = [...per.values()].reduce((s, r) => s + r.spend, 0);
  return {
    newCustomers: [...per.values()].filter((r) => r.orders === 1).length,
    returningCustomers: [...per.values()].filter((r) => r.orders > 1).length,
    averageOrdersPerCustomer: n ? Math.round((live.length / n) * 10) / 10 : 0,
    averageCustomerSpending: n ? Math.round(spend / n) : 0,
    mostActiveCustomers: [...per.entries()]
      .sort((a, b) => b[1].orders - a[1].orders)
      .slice(0, 5)
      .map(([k, r]) => ({ name: nameOf(k, r), orders: r.orders })),
  };
}

export function buildProductPerformance(orders, products, categories, limit = 25) {
  const { products: sold } = tally(orders);
  return products
    .map((p) => {
      const s = sold.get(String(p.id)) || [...sold.values()].find((x) => x.name === p.name);
      return {
        product: p.name,
        category: catName(categories, p.category),
        unitsSold: s ? s.unitsSold : 0,
        revenue: s ? s.revenue : 0,
        rating: Number(p.rating || 0),
        stock: Number(p.stock || 0),
      };
    })
    .sort((a, b) => b.unitsSold - a.unitsSold || b.rating - a.rating)
    .slice(0, limit);
}

export function buildPeriodFinancials(orders, period = 'daily', now = new Date()) {
  const today = startOfDay(now);
  const count = period === 'monthly' ? 6 : period === 'weekly' ? 8 : 7;
  const slots = [];
  for (let n = count - 1; n >= 0; n--) {
    let from; let to; let label;
    if (period === 'monthly') {
      from = new Date(now.getFullYear(), now.getMonth() - n, 1);
      to = new Date(now.getFullYear(), now.getMonth() - n + 1, 1);
      label = from.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    } else if (period === 'weekly') {
      from = new Date(today); from.setDate(from.getDate() - n * 7 - 6);
      to = new Date(today); to.setDate(to.getDate() - n * 7 + 1);
      label = from.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } else {
      from = new Date(today); from.setDate(from.getDate() - n);
      to = new Date(from); to.setDate(to.getDate() + 1);
      label = from.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
    slots.push({ from, to, label, income: 0 });
  }
  let cancelledOrders = 0;
  for (const o of orders) {
    const t = new Date(o.createdAt);
    const slot = slots.find((s) => t >= s.from && t < s.to);
    if (!slot) continue;
    if (isCancelled(o)) cancelledOrders += 1;
    else slot.income += Number(o.amount || 0);
  }
  const chartData = slots.map((s) => {
    const expense = Math.round(s.income * COST_RATIO);
    return { label: s.label, income: s.income, expense, profit: s.income - expense };
  });
  const sum = (k) => chartData.reduce((a, d) => a + d[k], 0);
  return { period, summary: { income: sum('income'), expense: sum('expense'), profit: sum('profit'), cancelledOrders }, chartData };
}
