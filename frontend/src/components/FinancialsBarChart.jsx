import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FinancialsBarChart({ data }) {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(61,35,23,0.08)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6b5544' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#6b5544' }} axisLine={false} tickLine={false} width={54} />
          <Tooltip
            formatter={(value, name) => [`₹${value}`, name.charAt(0).toUpperCase() + name.slice(1)]}
            contentStyle={{ borderRadius: 8, border: '1px solid rgba(61,35,23,0.12)', fontSize: 13 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="income" name="Income" fill="#3f7d4f" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="Expense" fill="#b6402f" radius={[4, 4, 0, 0]} />
          <Bar dataKey="profit" name="Profit" fill="#c89b3c" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
