import { useState, useEffect, useRef } from "react";
import { runAgent, getExamples } from "./api";
import type { Step } from "./api";
import ReasoningTrace from "./components/ReasoningTrace";
import ExampleQueries from "./components/ExampleQueries";

interface Conversation {
  query: string;
  steps: Step[];
  answer: string;
  duration: number;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [examples, setExamples] = useState<string[]>([]);
  const [history, setHistory] = useState<Conversation[]>([]);
  const [toast, setToast] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const startTime = useRef(0);

  useEffect(() => {
    getExamples().then(setExamples).catch(() => {});
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    const q = query;
    setQuery("");
    setLoading(true);
    startTime.current = Date.now();
    try {
      const result = await runAgent(q);
      const elapsed = ((Date.now() - startTime.current) / 1000).toFixed(1);
      setHistory((prev) => [...prev, { query: q, steps: result.steps, answer: result.answer, duration: Number(elapsed) }]);
    } catch (err) {
      setHistory((prev) => [...prev, { query: q, steps: [], answer: `Error: ${err instanceof Error ? err.message : "Unknown error"}`, duration: 0 }]);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleSelect = (ex: string) => {
    setQuery(ex);
    inputRef.current?.focus();
  };

  const copyAnswer = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#ffffff" }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-sm font-medium"
             style={{ background: "#10a37f", color: "#fff" }}>
          {toast}
        </div>
      )}

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #f0f0f0" }}>
          <h1 className="text-xl font-semibold" style={{ color: "#0d0d0d" }}>AgentKit</h1>
          <div className="flex items-center gap-3 text-xs" style={{ color: "#6e6e80" }}>
            <span>Qwen3-32B</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: "#10a37f" }} />
              Ready
            </span>
          </div>
        </header>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {history.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center pt-12 gap-6">
                <h2 className="text-2xl font-semibold" style={{ color: "#0d0d0d" }}>Examples</h2>
                <ExampleQueries examples={examples} onSelect={handleExampleSelect} />
              </div>
            )}

            {history.map((c, i) => (
              <div key={i} className="mb-8">
                {/* User message */}
                <div className="flex justify-end mb-4">
                  <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-sm text-sm"
                       style={{ background: "#f7f7f8", color: "#0d0d0d" }}>
                    {c.query}
                  </div>
                </div>
                {/* Agent response */}
                <div className="max-w-[90%]">
                  <ReasoningTrace steps={c.steps} answer={c.answer} loading={false} duration={c.duration} onCopy={copyAnswer} />
                </div>
              </div>
            ))}

            {loading && (
              <div className="mb-8">
                <div className="flex justify-end mb-4">
                  <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-sm text-sm"
                       style={{ background: "#f7f7f8", color: "#0d0d0d" }}>
                    {query || "..."}
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#10a37f", animationDelay: "0s" }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#10a37f", animationDelay: "0.15s" }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#10a37f", animationDelay: "0.3s" }} />
                  <span className="text-xs ml-1" style={{ color: "#6e6e80" }}>Thinking...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Tool badges */}
        <div className="flex justify-center gap-2 pb-3">
          {[
            { icon: "🔍", label: "Web search" },
            { icon: "📖", label: "Wikipedia" },
            { icon: "🧮", label: "Calculator" },
          ].map((t) => (
            <span key={t.label} className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: "#f7f7f8", color: "#6e6e80", border: "1px solid #e5e5e5" }}>
              {t.icon} {t.label}
            </span>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 pb-5">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex items-center rounded-xl px-4 py-3"
                 style={{ border: "1px solid #e5e5e5", background: "#ffffff" }}>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 outline-none text-sm bg-transparent"
                style={{ color: "#0d0d0d" }}
                disabled={loading}
              />
              <button type="submit" disabled={loading || !query.trim()}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30"
                style={{ background: query.trim() ? "#10a37f" : "#d1d5db" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
