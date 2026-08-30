const KIRA_BASE_URL = "https://kiraai.vn/api/v1";

let currentApiKey = process.env.KIRA_API_KEY || "";
let currentModel = "kira-mini-1.0";

export function getKiraApiKey(): string {
  if (!currentApiKey) {
    throw new Error("KIRA_API_KEY is not set.");
  }

  return currentApiKey;
}

export function setKiraApiKey(apiKey: string): void {
  currentApiKey = apiKey.trim();
}

export function hasKiraApiKey(): boolean {
  return Boolean(currentApiKey);
}

export function getKiraModel(): string {
  return currentModel;
}

export function setKiraModel(model: string): void {
  currentModel = model;
}

export async function kiraChat(body: unknown) {
  const apiKey = getKiraApiKey();

  const response = await fetch(
    `${KIRA_BASE_URL}/chat/completions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );

  const text = await response.text();

  let data: unknown;

  try {
    data = JSON.parse(text);
  } catch {
    data = {
      error: {
        message: text
      }
    };
  }

  return {
    status: response.status,
    data
  };
}

export async function kiraStream(body: unknown) {
  const apiKey = getKiraApiKey();

  return fetch(
    `${KIRA_BASE_URL}/chat/completions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream"
      },
      body: JSON.stringify(body)
    }
  );
}

export async function testKiraConnection() {
  return kiraChat({
    model: currentModel,
    messages: [
      {
        role: "user",
        content: "Say hello in one short sentence."
      }
    ],
    max_tokens: 32
  });
}