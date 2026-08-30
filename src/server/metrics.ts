export interface RequestMetric {
  id: string;
  time: string;
  model: string;
  tokens: number;
  latencyMs: number;
  status: number;
}

let todayTokens = 0;
let todayRequests = 0;
const recentRequests: RequestMetric[] = [];
const MAX_RECENT_LOGS = 20;

export function recordRequest(model: string, tokens: number, latencyMs: number, status: number): void {
  todayRequests += 1;
  todayTokens += tokens;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

  recentRequests.unshift({
    id: `req_${Math.random().toString(36).substring(2, 9)}`,
    time: timeStr,
    model,
    tokens,
    latencyMs,
    status
  });

  if (recentRequests.length > MAX_RECENT_LOGS) {
    recentRequests.pop();
  }
}

export function getMetrics() {
  return {
    todayTokens,
    todayRequests,
    recentRequests
  };
}
