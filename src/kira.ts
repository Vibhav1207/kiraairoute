const KIRA_BASE_URL = "https://kiraai.vn/api/v1";

export function getKiraApiKey(): string {
  const key = process.env.KIRA_API_KEY;

  if (!key) {
    throw new Error("KIRA_API_KEY is not set.");
  }

  return key;
}

export async function kiraChat(body: unknown) {
  const apiKey = getKiraApiKey();

  const url = `${KIRA_BASE_URL}/chat/completions`;

  console.log(`Forwarding request to ${url}`);

  const response = await fetch(url, {
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