export default function AnalyticsCard({ icon: Icon, label, value, sublabel }) {
  return (
    <div className="analytics-card card">
      {Icon && <div className="analytics-icon"><Icon size={18} /></div>}
      <div className="analytics-copy">
        <strong className="analytics-value">{value}</strong>
        <span className="analytics-label">{label}</span>
        {sublabel && <span className="analytics-sub">{sublabel}</span>}
      </div>
      <style>{`
        .analytics-card { min-height:138px; padding:18px 20px; display:flex; flex-direction:column; justify-content:space-between; border-radius:15px!important; }
        .analytics-icon { width:39px;height:39px;border-radius:11px;background:rgba(61,92,202,.14);color:#7091e8;display:grid;place-items:center; }
        .analytics-card:nth-child(2) .analytics-icon{background:rgba(26,180,120,.12);color:#47d39c}.analytics-card:nth-child(3) .analytics-icon{background:rgba(213,179,45,.13);color:#e0c24a}.analytics-card:nth-child(4) .analytics-icon{background:rgba(41,174,105,.12);color:#58d694}
        .analytics-copy{margin-top:auto}.analytics-value{display:block;font-family:var(--font-display);font-size:22px;color:#f5f1e8!important;line-height:1.05}.analytics-label{display:block!important;font-size:12px!important;color:#a7a7a7!important;margin-top:3px}.analytics-sub{font-size:11px!important;color:#777!important}
      `}</style>
    </div>
  );
}
