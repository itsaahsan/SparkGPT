const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_BASE = BASE.endsWith("/api") ? BASE : `${BASE}/api`;

export interface Step {
  type: "tool_use" | "tool_result";
  tool?: string;
  input?: Record<string, string>;
  output?: string;
}

export interface AgentResponse {
  steps: Step[];
  answer: string;
}

export async function runAgent(query: string): Promise<AgentResponse> {
  const res = await fetch(`${API_BASE}/agent/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Agent request failed");
  }
  return res.json();
}

export async function getExamples(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/examples`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.examples || [];
}
