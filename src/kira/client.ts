import { KIRA_BASE_URL } from "../config/constants.js";
import { getKiraApiKey, getKiraModel } from "../cli/config.js";

export async function kiraChat(body: unknown): Promise<{ status: number; data: unknown }> {
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
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = { error: { message: text } };
  }

  return { status: response.status, data };
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
