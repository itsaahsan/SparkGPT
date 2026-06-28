import ReactMarkdown from "react-markdown";
import type { Step } from "../api";

interface Props {
  steps: Step[];
  answer: string;
  loading: boolean;
  duration?: number;
  onCopy?: (text: string) => void;
}

export default function ReasoningTrace({ steps, answer, loading, duration, onCopy }: Props) {
  if (!loading && steps.length === 0 && !answer) return null;

  return (
    <div className="space-y-4">
      {/* Reasoning trace */}
      {steps.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: "#f7f7f8", border: "1px solid #e5e5e5" }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#6e6e80" }}>Reasoning trace</span>
          </div>
          <div className="space-y-1.5">
            {steps.map((step, i) => {
              if (step.type === "tool_use" && step.tool) {
                const input = step.input ? Object.values(step.input).join(" ") : "";
                const toolLabel = step.tool === "tavily_search" ? "web_search" : step.tool === "wikipedia" ? "wikipedia" : step.tool === "calculator" ? "calculator" : step.tool;
                return (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg"
                       style={{ background: "#ffffff" }}>
                    <span className="text-sm">🔍</span>
                    <span className="text-xs font-mono font-semibold" style={{ color: "#0d0d0d", minWidth: "90px" }}>{toolLabel}</span>
                    <span className="text-xs truncate" style={{ color: "#6e6e80" }}>{input}</span>
                  </div>
                );
              }
              if (step.type === "tool_result") {
                return null;
              }
              return null;
            })}
          </div>
        </div>
      )}

      {/* Answer */}
      {answer && (
        <div className="rounded-xl p-4" style={{ background: "#f0faf6", border: "1px solid #d1fae5" }}>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                 style={{ background: "#10a37f" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className="prose prose-sm max-w-none flex-1" style={{ color: "#0d0d0d" }}>
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0 text-sm leading-relaxed">{children}</p>,
                  strong: ({ children }) => <strong>{children}</strong>,
                  ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-0.5">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-0.5">{children}</ol>,
                  li: ({ children }) => <li className="text-sm">{children}</li>,
                  code: ({ children }) => (
                    <code className="px-1 py-0.5 rounded text-xs" style={{ background: "#e5e7eb" }}>{children}</code>
                  ),
                }}
              >
                {answer}
              </ReactMarkdown>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 pt-2" style={{ borderTop: "1px solid #d1fae5" }}>
            {duration !== undefined && duration > 0 && (
              <span className="text-xs" style={{ color: "#6e6e80" }}>{duration}s</span>
            )}
            {onCopy && (
              <button onClick={() => onCopy(answer)} className="text-xs font-medium"
                      style={{ color: "#10a37f", cursor: "pointer" }}>
                Copy
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
