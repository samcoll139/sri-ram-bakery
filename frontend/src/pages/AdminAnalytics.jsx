import { useEffect, useState } from 'react';
import { IndianRupee, ShoppingBag, Users, Receipt, Package, Award, TrendingUp, TrendingDown, Wallet, XCircle } from 'lucide-react';
import AdminLayout from '../components/AdminLayout.jsx';
import AnalyticsCard from '../components/AnalyticsCard.jsx';
import SalesChart from '../components/SalesChart.jsx';
import CategoryChart from '../components/CategoryChart.jsx';
import TopProductsChart from '../components/TopProductsChart.jsx';
import OrderAnalytics from '../components/OrderAnalytics.jsx';
import FinancialsBarChart from '../components/FinancialsBarChart.jsx';
import Loading from '../components/Loading.jsx';
import { useToast } from '../context/ToastContext.jsx';
import * as api from '../services/api.js';

const PERIOD_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const RANGE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

const EMPTY_SUMMARY = {
  totalRevenue: 0, totalOrders: 0, totalCustomers: 0, averageOrderValue: 0, productsSold: 0, bestSellingProduct: null,
};
const EMPTY_CUSTOMERS = {
  newCustomers: 0, returningCustomers: 0, averageOrdersPerCustomer: 0, averageCustomerSpending: 0, mostActiveCustomers: [],
};

export default function AdminAnalytics() {
  const { showToast } = useToast();
  const [range, setRange] = useState('7d');
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [financialsLoading, setFinancialsLoading] = useState(true);
  const [financials, setFinancials] = useState(null);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [customers, setCustomers] = useState(EMPTY_CUSTOMERS);
  const [productPerformance, setProductPerformance] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setFinancialsLoading(true);
    setFinancials(null);
    api
      .getPeriodFinancials(period)
      .then((data) => {
        if (!cancelled) setFinancials(data);
      })
      .catch((err) => {
        if (!cancelled) showToast(err.message || 'Could not load financials.', 'error');
      })
      .finally(() => {
        if (!cancelled) setFinancialsLoading(false);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      api.getAnalyticsSummary(),
      api.getCategoryAnalytics(),
      api.getTopProducts(),
      api.getOrderAnalytics(),
      api.getCustomerAnalytics(),
      api.getProductPerformance(),
    ])
      .then(([s, cat, top, status, cust, perf]) => {
        if (cancelled) return;
        setSummary(s);
        setCategoryData(cat);
        setTopProducts(top);
        setOrderStatus(status);
        setCustomers(cust);
        setProductPerformance(perf);
      })
      .catch((err) => showToast(err.message || 'Could not load analytics.', 'error'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    api
      .getSalesAnalytics(range)
      .then(setSalesData)
      .catch((err) => showToast(err.message || 'Could not load sales data.', 'error'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  if (loading) {
    return (
      <AdminLayout title="Business Analytics" subtitle="Understand your sales, products and customer trends">
        <Loading label="Crunching the numbers..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Business Analytics" subtitle="Understand your sales, products and customer trends">
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <AnalyticsCard icon={IndianRupee} label="Total Revenue" value={`₹${summary.totalRevenue.toLocaleString('en-IN')}`} />
        <AnalyticsCard icon={ShoppingBag} label="Total Orders" value={summary.totalOrders} />
        <AnalyticsCard icon={Users} label="Total Customers" value={summary.totalCustomers} />
        <AnalyticsCard icon={Receipt} label="Average Order Value" value={`₹${summary.averageOrderValue}`} />
        <AnalyticsCard icon={Package} label="Products Sold" value={summary.productsSold} />
        <AnalyticsCard icon={Award} label="Best Selling Product" value={summary.bestSellingProduct || '—'} />
      </div>

      <div className="analytics-section card" style={{ marginBottom: '1.5rem' }}>
        <div className="flex-between">
          <h3>Profit &amp; Loss</h3>
          <div className="period-toggle">
            {PERIOD_OPTIONS.map((o) => (
              <button
                key={o.value}
                className={period === o.value ? 'active' : ''}
                onClick={() => setPeriod(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {financialsLoading || !financials ? (
          <Loading label="Loading financials..." />
        ) : (
          <>
            <div className="grid grid-4" style={{ margin: '1.25rem 0 1.5rem' }}>
              <AnalyticsCard icon={TrendingUp} label={`${PERIOD_OPTIONS.find((o) => o.value === period).label} Sales`} value={`₹${financials.summary.income.toLocaleString('en-IN')}`} />
              <AnalyticsCard icon={TrendingDown} label={`${PERIOD_OPTIONS.find((o) => o.value === period).label} Expense`} value={`₹${financials.summary.expense.toLocaleString('en-IN')}`} />
              <AnalyticsCard icon={Wallet} label={`${PERIOD_OPTIONS.find((o) => o.value === period).label} Profit`} value={`₹${financials.summary.profit.toLocaleString('en-IN')}`} />
              <AnalyticsCard icon={XCircle} label="Cancelled Orders" value={financials.summary.cancelledOrders} />
            </div>

            {financials.chartData.length === 0 || financials.chartData.every((d) => d.income === 0 && d.expense === 0) ? (
              <p className="muted">No orders recorded in this period yet.</p>
            ) : (
              <FinancialsBarChart data={financials.chartData} />
            )}
          </>
        )}
      </div>

      <div className="analytics-section card">
        <div className="flex-between">
          <h3>Sales Over Time</h3>
          <select value={range} onChange={(e) => setRange(e.target.value)}>
            {RANGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        {salesData.length === 0 ? (
          <p className="muted">No sales recorded in this period yet.</p>
        ) : (
          <SalesChart data={salesData} />
        )}
      </div>

      <div className="grid grid-2" style={{ marginTop: '1.5rem' }}>
        <div className="analytics-section card">
          <h3>Sales by Category</h3>
          {categoryData.length === 0 ? <p className="muted">No orders yet.</p> : <CategoryChart data={categoryData} />}
        </div>
        <div className="analytics-section card">
          <h3>Order Status</h3>
          <OrderAnalytics data={orderStatus} />
        </div>
      </div>

      <div className="analytics-section card" style={{ marginTop: '1.5rem' }}>
        <h3>Top Selling Products</h3>
        {topProducts.length === 0 ? <p className="muted">No sales recorded yet.</p> : <TopProductsChart data={topProducts} />}
      </div>

      <div className="analytics-section card" style={{ marginTop: '1.5rem' }}>
        <h3>Customer Insights</h3>
        <div className="grid grid-4 customer-kpis">
          <div><span className="kpi-label">New Customers</span><strong>{customers.newCustomers}</strong></div>
          <div><span className="kpi-label">Returning Customers</span><strong>{customers.returningCustomers}</strong></div>
          <div><span className="kpi-label">Avg. Orders / Customer</span><strong>{customers.averageOrdersPerCustomer}</strong></div>
          <div><span className="kpi-label">Avg. Customer Spend</span><strong>₹{customers.averageCustomerSpending}</strong></div>
        </div>
        {customers.mostActiveCustomers.length > 0 && (
          <>
            <h4 style={{ marginTop: '1.5rem' }}>Most Active Customers</h4>
            <ul className="active-customers">
              {customers.mostActiveCustomers.map((c) => (
                <li key={c.name}><span>{c.name}</span><span>{c.orders} orders</span></li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="analytics-section card" style={{ marginTop: '1.5rem' }}>
        <h3>Product Performance</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Product</th><th>Category</th><th>Units Sold</th><th>Revenue</th><th>Rating</th><th>Stock</th></tr>
            </thead>
            <tbody>
              {productPerformance.map((p) => (
                <tr key={p.product}>
                  <td className="product-perf-name">
                    {p.product}
                    {p.unitsSold >= 90 && <span className="badge badge-gold tiny">Best Seller</span>}
                    {p.stock <= 20 && <span className="badge tiny" style={{ background: 'var(--danger)' }}>Low Stock</span>}
                    {p.rating >= 4.8 && <span className="badge tiny" style={{ background: 'var(--success)' }}>High Rated</span>}
                  </td>
                  <td>{p.category}</td>
                  <td>{p.unitsSold}</td>
                  <td>₹{p.revenue.toLocaleString('en-IN')}</td>
                  <td>{p.rating.toFixed(1)}</td>
                  <td>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .analytics-section { padding: 1.5rem; }
        .analytics-section h3 { margin-bottom: 1.1rem; }
        .analytics-section select {
          padding: 0.5rem 0.8rem;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--border);
          font-family: inherit;
          font-size: 0.85rem;
        }
        .muted { color: var(--brown-soft); font-size: 0.9rem; }
        .period-toggle { display: flex; gap: 0.4rem; }
        .period-toggle button {
          padding: 0.4rem 0.9rem;
          border-radius: 999px;
          border: 1.5px solid var(--border);
          background: var(--white);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--brown-soft);
        }
        .period-toggle button.active { background: var(--maroon); border-color: var(--maroon); color: var(--white); }
        .customer-kpis div { display: flex; flex-direction: column; gap: 0.3rem; }
        .kpi-label { font-size: 0.78rem; color: var(--brown-soft); }
        .customer-kpis strong { font-family: var(--font-display); font-size: 1.4rem; color: var(--maroon-dark); }
        .active-customers { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.75rem; }
        .active-customers li { display: flex; justify-content: space-between; font-size: 0.9rem; padding: 0.5rem 0; border-bottom: 1px solid var(--border); }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
        th { text-align: left; padding: 0.7rem 0.9rem; color: var(--brown-soft); font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid var(--border); }
        td { padding: 0.7rem 0.9rem; border-bottom: 1px solid var(--border); }
        .product-perf-name { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; font-weight: 600; }
        .badge.tiny { font-size: 0.62rem; padding: 0.15rem 0.5rem; color: var(--white); }
      `}</style>
    </AdminLayout>
  );
}
