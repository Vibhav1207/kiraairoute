export interface ResponsesRequest {
  model: string;
  input: unknown;
  instructions?: string;
  temperature?: number;
  max_output_tokens?: number;
  stream?: boolean;
}

export function responsesToChat(request: ResponsesRequest) {
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [];

  if (request.instructions) {
    messages.push({ role: "system", content: request.instructions });
  }

  if (typeof request.input === "string") {
    messages.push({ role: "user", content: request.input });
  } else if (Array.isArray(request.input)) {
    for (const item of request.input) {
      if (typeof item !== "object" || item === null) continue;

      const value = item as { role?: unknown; content?: unknown };
      let role: "system" | "user" | "assistant";

      if (value.role === "developer") role = "system";
      else if (value.role === "system" || value.role === "user" || value.role === "assistant") role = value.role;
      else continue;

      let content = "";
      if (typeof value.content === "string") {
        content = value.content;
      } else if (Array.isArray(value.content)) {
        const parts: string[] = [];
        for (const part of value.content) {
          if (typeof part !== "object" || part === null) continue;
          const contentPart = part as { text?: unknown };
          if (typeof contentPart.text === "string") parts.push(contentPart.text);
        }
        content = parts.join("");
      }

      if (content) {
        messages.push({ role, content });
      }
    }
  }

  return {
    model: request.model,
    messages,
    ...(request.temperature !== undefined ? { temperature: request.temperature } : {}),
    ...(request.max_output_tokens !== undefined ? { max_tokens: request.max_output_tokens } : {}),
    ...(request.stream !== undefined ? { stream: request.stream } : {})
  };
}

export function chatToResponses(chatResponse: any) {
  const responseId = chatResponse?.id ?? crypto.randomUUID();
  const message = chatResponse?.choices?.[0]?.message;
  const text = typeof message?.content === "string" ? message.content : "";

  return {
    id: `resp_${responseId}`,
    object: "response",
    created_at: chatResponse?.created ?? Math.floor(Date.now() / 1000),
    model: chatResponse?.model ?? "kira-mini-1.0",
    output: [
      {
        type: "message",
        id: `msg_${responseId}`,
        role: "assistant",
        content: [{ type: "output_text", text }]
      }
    ],
    usage: chatResponse?.usage
      ? {
          input_tokens: chatResponse.usage.prompt_tokens ?? 0,
          output_tokens: chatResponse.usage.completion_tokens ?? 0,
          total_tokens: chatResponse.usage.total_tokens ?? 0
        }
      : null
  };
}

export function createSseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}