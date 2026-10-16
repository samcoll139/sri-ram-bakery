import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TopProductsChart({ data }) {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 24, left: 10, bottom: 0 }}>
          <CartesianGrid stroke="rgba(61,35,23,0.08)" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 12, fill: '#6b5544' }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="product" width={140} tick={{ fontSize: 12, fill: '#3d2317' }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value, name) => [name === 'revenue' ? `₹${value}` : value, name === 'revenue' ? 'Revenue' : 'Units Sold']}
            contentStyle={{ borderRadius: 8, fontSize: 13 }}
          />
          <Bar dataKey="unitsSold" fill="#c89b3c" radius={[0, 6, 6, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
