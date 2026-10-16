const STATUS_COLORS = {
  Pending: '#c89b3c',
  Confirmed: '#6e8fc9',
  Preparing: '#a15b3f',
  Ready: '#8a4a3d',
  Delivered: '#3f7d4f',
  Cancelled: '#b6402f',
};

export default function OrderAnalytics({ data }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="order-analytics">
      {data.map((d) => (
        <div className="order-status-row" key={d.status}>
          <div className="order-status-label">
            <span className="dot" style={{ background: STATUS_COLORS[d.status] || '#999' }} />
            {d.status}
          </div>
          <div className="order-status-bar">
            <div
              className="order-status-fill"
              style={{ width: `${total > 0 ? (d.count / total) * 100 : 0}%`, background: STATUS_COLORS[d.status] || '#999' }}
            />
          </div>
          <span className="order-status-count">{d.count}</span>
        </div>
      ))}

      <style>{`
        .order-analytics { display: flex; flex-direction: column; gap: 0.9rem; }
        .order-status-row { display: grid; grid-template-columns: 110px 1fr 40px; align-items: center; gap: 0.75rem; }
        .order-status-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; color: var(--brown); }
        .dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
        .order-status-bar { height: 9px; background: var(--cream-soft); border-radius: 999px; overflow: hidden; }
        .order-status-fill { height: 100%; border-radius: 999px; }
        .order-status-count { font-size: 0.85rem; font-weight: 700; color: var(--maroon-dark); text-align: right; }
      `}</style>
    </div>
  );
}
