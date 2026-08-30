import { KIRA_BASE_URL } from "../config/constants.js";
import { getKiraApiKey, getKiraModel } from "../cli/config.js";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function translateErrorMessage(message: string): string {
  if (!message || typeof message !== "string") return "An unexpected error occurred.";

  const lower = message.toLowerCase();
  if (lower.includes("bảo trì") || lower.includes("maintenance")) {
    return "The model service is temporarily under maintenance on Kira AI upstream. Please try again in a moment or select another model (e.g. Kira Mini 2.0 or DeepSeek V4 Flash) in the KiraAI Route dashboard.";
  }
  if (lower.includes("nhiều yêu cầu") || lower.includes("thử lại sau") || lower.includes("quá nhiều")) {
    return "The system is currently receiving high traffic. Please try again in a few seconds or select another model.";
  }
  if (lower.includes("số dư") || lower.includes("không đủ") || lower.includes("balance")) {
    return "Insufficient account balance. Please select a free model (e.g. Kira Mini 1.0) or check your account at kiraai.vn/developer.";
  }
  if (lower.includes("không thể truy cập") || lower.includes("unreachable")) {
    return "The selected model is currently unreachable. Please select another model like Kira Mini 1.0.";
  }
  if (lower.includes("không hợp lệ") || lower.includes("invalid key") || lower.includes("api key")) {
    return "Invalid Kira API key. Please check your API key at kiraai.vn/developer.";
  }

  return message;
}

export async function kiraChat(body: unknown, retries = 2): Promise<{ status: number; data: unknown }> {
  try {
    const apiKey = getKiraApiKey();
    const response = await fetch(`${KIRA_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: { message: text } };
    }

    // Translate any raw non-English/Vietnamese upstream error message to clear English
    if (data?.error?.message && typeof data.error.message === "string") {
      data.error.message = translateErrorMessage(data.error.message);
    }

    // Auto-retry on rate-limit or high traffic concurrency responses
    const isBusy = response.status === 429 || (typeof text === "string" && (text.includes("nhiều yêu cầu") || text.includes("thử lại")));
    if (isBusy && retries > 0) {
      await delay(1500);
      return kiraChat(body, retries - 1);
    }

    return { status: response.status, data };
  } catch (err) {
    if (retries > 0) {
      await delay(1500);
      return kiraChat(body, retries - 1);
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

export async function kiraStream(body: unknown): Promise<Response> {
  const apiKey = getKiraApiKey();
  return fetch(`${KIRA_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "text/event-stream"
    },
    body: JSON.stringify(body)
  });
}

export async function testKiraConnection(): Promise<{ status: number; data: unknown }> {
  return kiraChat({
    model: getKiraModel(),
    messages: [{ role: "user", content: "Say hello in one short sentence." }],
    max_tokens: 32
  });
}
