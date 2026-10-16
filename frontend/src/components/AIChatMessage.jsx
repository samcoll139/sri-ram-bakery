import AIProductRecommendation from './AIProductRecommendation.jsx';

export default function AIChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={'ai-message' + (isUser ? ' user' : '')}>
      <div className="ai-bubble">{message.text}</div>

      {message.products?.length > 0 && (
        <div className="ai-product-list">
          {message.products.map((p) => (
            <AIProductRecommendation key={p.id} product={p} />
          ))}
        </div>
      )}

      <style>{`
        .ai-message { display:flex; flex-direction:column; gap:.5rem; margin-bottom:1rem; align-items:flex-start; }
        .ai-message.user { align-items:flex-end; }
        .ai-bubble { max-width:85%; padding:.72rem .9rem; border-radius:16px; font-size:.84rem; line-height:1.48; background:linear-gradient(135deg,rgba(30,41,88,.9),rgba(30,27,75,.82)); color:#e0e7ff; border:1px solid rgba(129,140,248,.2); border-bottom-left-radius:5px; box-shadow:0 6px 18px rgba(0,0,0,.14); }
        .ai-message.user .ai-bubble { background:linear-gradient(135deg,#4f46e5,#7c3aed); color:#fff; border:1px solid rgba(196,181,253,.35); border-bottom-left-radius:16px; border-bottom-right-radius:5px; box-shadow:0 7px 20px rgba(79,70,229,.24); }
        .ai-product-list { display:flex; flex-direction:column; gap:.5rem; width:100%; max-width:88%; }
      `}</style>
    </div>
  );
}
