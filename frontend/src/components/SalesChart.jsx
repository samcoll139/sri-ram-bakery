import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalesChart({ data }) {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(61,35,23,0.08)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6b5544' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#6b5544' }} axisLine={false} tickLine={false} width={54} />
          <Tooltip
            formatter={(value) => [`₹${value}`, 'Sales']}
            contentStyle={{ borderRadius: 8, border: '1px solid rgba(61,35,23,0.12)', fontSize: 13 }}
          />
          <Line type="monotone" dataKey="sales" stroke="#6e1f2c" strokeWidth={2.5} dot={{ r: 3, fill: '#c89b3c' }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
