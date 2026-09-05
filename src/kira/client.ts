import { KIRA_BASE_URL } from "../config/constants.js";
import { getKiraApiKey, getKiraModel } from "../cli/config.js";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function translateErrorMessage(message: string): string {
  if (!message || typeof message !== "string") return "An unexpected error occurred.";

  // Detect HTML responses (like 502/503/504 Bad Gateway from Nginx/Cloudflare)
  if (message.includes("<html") || message.includes("502 Bad Gateway") || message.includes("<title>502")) {
    return "Kira AI cloud servers (kiraai.vn) are temporarily overloaded or undergoing maintenance (502 Bad Gateway). Please retry in a few seconds or switch to another model.";
  }
  if (message.includes("504 Gateway") || message.includes("Gateway Time-out")) {
    return "Kira AI cloud servers timed out (504 Gateway Timeout). Please retry in a few seconds.";
  }
  if (message.includes("503 Service") || message.includes("Service Unavailable")) {
    return "Kira AI cloud service is temporarily unavailable (503). Please retry in a moment.";
  }

  const lower = message.toLowerCase();
  if (lower.includes("bảo trì") || lower.includes("maintenance")) {
    return "The model service is temporarily under maintenance on Kira AI upstream. Please select another model in the KiraAI Route dashboard.";
  }
  if (lower.includes("nhiều yêu cầu") || lower.includes("thử lại sau") || lower.includes("quá nhiều") || lower.includes("traffic")) {
    return "The model is currently receiving high traffic. Please try again in a few seconds or switch to Mimo V2.5.";
  }
  if (lower.includes("số dư") || lower.includes("không đủ") || lower.includes("balance")) {
    return "Insufficient account balance reported by kiraai.vn for this API key. If you recently topped up at kiraai.vn/developer, please verify that your API key matches the top-up account or wait a moment for upstream balance sync.";
  }
  if (lower.includes("không thể truy cập") || lower.includes("unreachable")) {
    return "The selected model is currently unreachable. Please select another model like Mimo V2.5.";
  }
  if (lower.includes("không hợp lệ") || lower.includes("invalid key") || lower.includes("api key")) {
    return "Invalid Kira API key. Please check your API key at kiraai.vn/developer.";
  }

  return message;
}

export async function kiraChat(body: unknown, retries = 2, timeoutMs = 60000): Promise<{ status: number; data: unknown }> {
  try {
    const apiKey = getKiraApiKey();
    const response = await fetch(`${KIRA_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs)
    });

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: { message: translateErrorMessage(text) } };
    }

    // Translate any raw non-English/Vietnamese upstream error message to clear English
    if (data?.error?.message && typeof data.error.message === "string") {
      data.error.message = translateErrorMessage(data.error.message);
    }

    // Auto-retry on transient errors (429 rate-limit, 502/503/504, or high traffic concurrency responses)
    const isTransient =
      response.status === 429 ||
      response.status === 502 ||
      response.status === 503 ||
      response.status === 504 ||
      (typeof text === "string" && (text.includes("nhiều yêu cầu") || text.includes("thử lại") || text.includes("502 Bad Gateway") || text.includes("bảo trì")));

    if (isTransient && retries > 0) {
      await delay(1000 * (3 - retries));
      return kiraChat(body, retries - 1, timeoutMs);
    }

    return { status: response.status, data };
  } catch (err) {
    if (retries > 0) {
      await delay(1000 * (3 - retries));
      return kiraChat(body, retries - 1, timeoutMs);
    }
    return {
      status: 502,
      data: {
        error: {
          message: err instanceof Error ? translateErrorMessage(err.message) : "Unable to reach Kira AI upstream servers."
        }
      }
    };
  }
}

export async function kiraStream(body: unknown, timeoutMs = 120000): Promise<Response> {
  const apiKey = getKiraApiKey();
  return fetch(`${KIRA_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "text/event-stream"
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs)
  });
}

export async function testKiraConnection(modelOverride?: string): Promise<{ status: number; data: unknown }> {
  try {
    const model = modelOverride || getKiraModel();
    
    // First attempt: Fast streaming probe
    const res = await kiraStream({
      model,
      messages: [{ role: "user", content: "hi" }],
      max_tokens: 1,
      stream: true
    }, 10000);

    if (res.ok && res.status < 400) {
      if (res.body) {
        const reader = res.body.getReader();
        reader.cancel().catch(() => {});
      }
      return { status: 200, data: { success: true } };
    }

    // Second attempt: Fallback non-streaming probe if streaming test returned error/non-200
    const chatRes = await kiraChat({
      model,
      messages: [{ role: "user", content: "hi" }],
      max_tokens: 1,
      stream: false
    }, 1, 10000);

    if (chatRes.status < 400) {
      return { status: 200, data: { success: true } };
    }

    return chatRes;
  } catch (err) {
    return {
      status: 502,
      data: {
        error: {
          message: err instanceof Error ? translateErrorMessage(err.message) : "Unable to reach Kira AI."
        }
      }
    };
  }
}
