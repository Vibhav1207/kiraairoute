const KIRA_BASE_URL = "https://kiraai.vn/api/v1";

const KIRA_TIMEOUT_MS = Number(
  process.env.KIRAAIROUTE_TIMEOUT_MS || 120_000
);

export function getKiraApiKey(): string {
  const key = process.env.KIRA_API_KEY;

  if (!key) {
    throw new Error(
      "KIRA_API_KEY is not set. Set it before starting KiraAI Route."
    );
  }

  return key;
}

export async function kiraChat(body: unknown) {
  const apiKey = getKiraApiKey();

  const url = `${KIRA_BASE_URL}/chat/completions`;

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, KIRA_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    const text = await response.text();

    let data: unknown;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {
        error: {
          message:
            text || "Kira AI returned an invalid response.",
          type: "upstream_error"
        }
      };
    }

    return {
      status: response.status,
      data
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      return {
        status: 504,
        data: {
          error: {
            message: `Kira AI request timed out after ${
              KIRA_TIMEOUT_MS / 1000
            } seconds.`,
            type: "timeout_error"
          }
        }
      };
    }

    return {
      status: 502,
      data: {
        error: {
          message:
            error instanceof Error
              ? `Unable to reach Kira AI: ${error.message}`
              : "Unable to reach Kira AI.",
          type: "upstream_error"
        }
      }
    };
  } finally {
    clearTimeout(timeout);
  }
}