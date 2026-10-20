import { useEffect, useRef, useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import AIChatMessage from './AIChatMessage.jsx';
import { interpretMessage, createInitialContext } from '../services/recommendationEngine.js';
import { chatWithAI } from '../services/api.js';
import { useProducts } from '../context/ProductsContext.jsx';

// These use "show me" style phrasing on purpose — quick buttons are a
// browse action, so Sriram AI should answer them directly with results
// rather than pausing to ask a clarifying question first.
const QUICK_BUTTONS = [
  { label: '🎂 Birthday Cake', query: 'Show me birthday cake options' },
  { label: '🍬 Best Sweets', query: 'Show me the best traditional sweets' },
  { label: '💰 Under ₹500', query: 'Show products under ₹500' },
  { label: '⭐ Best Rated', query: 'Which products are best rated?' },
  { label: '🎁 Gift Ideas', query: 'Suggest sweets for a gift' },
];

const WELCOME = {
  role: 'assistant',
  text:
    "Hi! I'm Sriram AI, your sweet shopping companion 🎂🍬. Ask me in English, Tamil (தமிழ்) or Tanglish — try \"birthday cake venum\" or \"show cakes under ₹500\".",
  products: [],
};

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const contextRef = useRef(createInitialContext());
  const scrollRef = useRef(null);
  const { products, categories } = useProducts();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, isTyping]);

  function runLocalEngine(query) {
    const { reply, products: recommended, context: nextContext } = interpretMessage({
      text: query,
      context: contextRef.current,
      products,
      categories,
    });
    contextRef.current = nextContext;
    return { reply, products: recommended };
  }

  async function sendQuery(query) {
    if (!query.trim()) return;
    const userMsg = { role: 'user', text: query, products: [] };
    const history = messages.map((m) => ({ role: m.role, text: m.text }));
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    let assistantMsg;
    try {
      // Prefer the real Gemini-powered assistant when the backend has it
      // configured — it understands far more phrasing than the local
      // rule-based engine. If it's not configured, or the call fails for
      // any reason (offline, quota, etc.), silently fall back to the
      // local engine so the chatbot never breaks.
      const data = await chatWithAI(query, history);
      if (data.source === 'fallback') throw new Error('Gemini unavailable');
      assistantMsg = { role: 'assistant', text: data.reply, products: data.products || [] };
    } catch {
      const local = runLocalEngine(query);
      assistantMsg = { role: 'assistant', text: local.reply, products: local.products };
    }

    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendQuery(input);
  }

  return (
    <>
      <button className="ai-fab" onClick={() => setOpen((v) => !v)} aria-label="Ask Sriram AI">
        <Bot size={22} />
        <span>Ask Sriram AI</span>
      </button>

      {open && (
        <div className="ai-window" role="dialog" aria-label="Sriram AI shopping assistant">
          <div className="ai-header">
            <div className="ai-brand">
              <div className="ai-brand-icon"><Bot size={22} /></div>
              <div>
                <strong>Sriram AI Assistant</strong>
                <small><span className="ai-status-dot"></span> Online · Your sweet shopping companion</small>
              </div>
            </div>
            <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close assistant">
              <X size={20} />
            </button>
          </div>

          <div className="ai-body" ref={scrollRef}>
            <div className="ai-welcome-card">
              <div className="ai-welcome-icon"><Sparkles size={18} /></div>
              <div>
                <strong>What can I help you find?</strong>
                <p>Ask about cakes, sweets, prices, best sellers or gift ideas.</p>
              </div>
            </div>
            {messages.map((m, i) => (
              <AIChatMessage key={i} message={m} />
            ))}
            {isTyping && (
              <div className="ai-typing" aria-live="polite">
                <span></span><span></span><span></span>
              </div>
            )}
          </div>

          <div className="ai-quick-buttons">
            {QUICK_BUTTONS.map((qb) => (
              <button key={qb.label} disabled={isTyping} onClick={() => sendQuery(qb.query)}>{qb.label}</button>
            ))}
          </div>

          <form className="ai-input-row" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about cakes, sweets, prices... (English/தமிழ்/Tanglish)"
              aria-label="Message Sriram AI"
              disabled={isTyping}
            />
            <button type="submit" aria-label="Send message" disabled={isTyping}><Send size={17} /></button>
          </form>
        </div>
      )}

      <style>{`
        .ai-fab {
          position: fixed; bottom: 22px; right: 22px; z-index: 300;
          display: flex; align-items: center; gap: .55rem;
          background: linear-gradient(135deg, #6d4aff, #a855f7); color: #fff;
          border: 1px solid rgba(196,181,253,.45); border-radius: 999px;
          padding: .82rem 1.25rem; font-weight: 800;
          box-shadow: 0 10px 35px rgba(109,74,255,.38), 0 0 20px rgba(168,85,247,.18);
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .ai-fab:hover { transform: translateY(-3px); box-shadow: 0 14px 42px rgba(109,74,255,.5), 0 0 26px rgba(168,85,247,.28); }

        .ai-window {
          position: fixed; bottom: 90px; right: 22px;
          width: min(440px, calc(100vw - 28px));
          height: min(650px, calc(100vh - 120px));
          background: #070b1c;
          background-image: radial-gradient(circle at 90% 5%, rgba(124,58,237,.18), transparent 28%), radial-gradient(circle at 5% 95%, rgba(59,130,246,.12), transparent 30%);
          color: #eef2ff; border: 1px solid rgba(129,140,248,.28);
          border-radius: 24px; box-shadow: 0 24px 70px rgba(0,0,0,.55), 0 0 45px rgba(99,102,241,.12);
          z-index: 300; display: flex; flex-direction: column; overflow: hidden;
          animation: ai-open .22s ease; backdrop-filter: blur(18px);
        }
        @keyframes ai-open { from { opacity: 0; transform: translateY(14px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

        .ai-header {
          background: linear-gradient(135deg, rgba(30,41,88,.92), rgba(76,29,149,.72));
          padding: 1rem 1.05rem; display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid rgba(167,139,250,.25);
        }
        .ai-brand { display: flex; align-items: center; gap: .7rem; }
        .ai-brand-icon { width: 40px; height: 40px; border-radius: 13px; display:flex; align-items:center; justify-content:center; background: linear-gradient(135deg,#2563eb,#8b5cf6); box-shadow: 0 0 20px rgba(139,92,246,.4); }
        .ai-header strong { display:block; color:#fff; font-size:1rem; letter-spacing:.01em; }
        .ai-header small { display:block; color:#c7d2fe; font-size:.72rem; margin-top:.12rem; }
        .ai-status-dot { display:inline-block; width:7px; height:7px; border-radius:50%; background:#34d399; box-shadow:0 0 8px #34d399; margin-right:4px; }
        .ai-header .icon-btn { color:#e0e7ff; background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12); border-radius:10px; padding:.35rem; }

        .ai-body { flex:1; overflow-y:auto; padding:1rem 1rem .8rem; scrollbar-width:thin; scrollbar-color:#4f46e5 transparent; }
        .ai-body::-webkit-scrollbar { width:6px; } .ai-body::-webkit-scrollbar-thumb { background:#4338ca; border-radius:99px; }
        .ai-welcome-card { display:flex; gap:.65rem; align-items:flex-start; padding:.8rem; margin-bottom:1rem; border-radius:16px; background:linear-gradient(135deg,rgba(30,41,88,.75),rgba(49,46,129,.38)); border:1px solid rgba(129,140,248,.2); }
        .ai-welcome-icon { flex:0 0 auto; width:34px; height:34px; border-radius:11px; display:flex; align-items:center; justify-content:center; background:rgba(139,92,246,.2); color:#c4b5fd; }
        .ai-welcome-card strong { color:#f5f3ff; font-size:.86rem; }
        .ai-welcome-card p { color:#a5b4fc; font-size:.74rem; margin:.2rem 0 0; line-height:1.4; }

        .ai-typing { display:inline-flex; gap:4px; background:rgba(30,41,88,.85); border:1px solid rgba(129,140,248,.2); padding:.6rem .9rem; border-radius:14px; width:fit-content; }
        .ai-typing span { width:6px; height:6px; border-radius:50%; background:#a78bfa; opacity:.5; animation:ai-typing-bounce 1.1s infinite ease-in-out; }
        .ai-typing span:nth-child(2){animation-delay:.15s}.ai-typing span:nth-child(3){animation-delay:.3s}
        @keyframes ai-typing-bounce { 0%,60%,100%{transform:translateY(0);opacity:.5} 30%{transform:translateY(-4px);opacity:1} }

        .ai-quick-buttons { display:flex; flex-wrap:wrap; gap:.42rem; padding:0 .95rem .7rem; background:#080c1d; }
        .ai-quick-buttons button { font-size:.72rem; color:#dbeafe; background:rgba(30,41,88,.75); border:1px solid rgba(129,140,248,.3); border-radius:999px; padding:.4rem .68rem; font-weight:700; transition:.18s ease; }
        .ai-quick-buttons button:hover:not(:disabled) { color:#fff; border-color:#8b5cf6; background:rgba(109,40,217,.35); box-shadow:0 0 14px rgba(139,92,246,.2); transform:translateY(-1px); }
        .ai-quick-buttons button:disabled { opacity:.45; }

        .ai-input-row { display:flex; gap:.55rem; padding:.8rem; background:rgba(5,8,22,.96); border-top:1px solid rgba(129,140,248,.18); }
        .ai-input-row input { flex:1; min-width:0; border:1px solid rgba(129,140,248,.32); border-radius:14px; padding:.72rem .9rem; font-family:inherit; font-size:.82rem; background:#0d1330; color:#f8fafc; outline:none; }
        .ai-input-row input::placeholder { color:#64748b; }
        .ai-input-row input:focus { border-color:#8b5cf6; box-shadow:0 0 0 3px rgba(139,92,246,.12); }
        .ai-input-row button { background:linear-gradient(135deg,#4f46e5,#9333ea); color:#fff; border:1px solid rgba(196,181,253,.35); border-radius:14px; width:44px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 18px rgba(99,102,241,.28); }
        .ai-input-row button:hover:not(:disabled) { transform:translateY(-1px); }
        .ai-input-row button:disabled { opacity:.45; }

        @media (max-width:480px) { .ai-fab span{display:none}.ai-fab{padding:.85rem}.ai-window{right:10px;bottom:76px;width:calc(100vw - 20px);height:calc(100vh - 96px);border-radius:20px;} }
      `}</style>
    </>
  );
}
