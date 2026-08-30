import { getKiraModel } from "../cli/config.js";

export interface ResponsesRequest {
  model?: string;
  input?: unknown;
  instructions?: string;
  temperature?: number;
  max_output_tokens?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  [key: string]: unknown;
}

export function responsesToChat(body: ResponsesRequest) {
  const inputData = body.input;
  const instructions = body.instructions;
  const messages: Array<{ role: string; content: string }> = [];

  if (typeof instructions === "string" && instructions.trim()) {
    messages.push({ role: "system", content: instructions.trim() });
  }

  if (typeof inputData === "string" && inputData.trim()) {
    messages.push({ role: "user", content: inputData.trim() });
  } else if (Array.isArray(inputData)) {
    for (const item of inputData) {
      if (typeof item !== "object" || item === null) continue;
      const role = (item as any).role || "user";
      const content = (item as any).content;
      let text = "";

      if (typeof content === "string") {
        text = content;
      } else if (Array.isArray(content)) {
        const parts: string[] = [];
        for (const part of content) {
          if (typeof part === "object" && part !== null) {
            const pText = (part as any).text || (part as any).input_text || (part as any).output_text || "";
            if (pText) parts.push(pText);
          } else if (typeof part === "string") {
            parts.push(part);
          }
        }
        text = parts.join("\n");
      }

      if (text && text.trim()) {
        messages.push({ role, content: text.trim() });
      }
    }
  }

  if (messages.length === 0) {
    messages.push({ role: "user", content: "Hello" });
  }

  const payload: any = {
    model: body.model || getKiraModel(),
    messages,
    stream: false
  };

  if (body.temperature !== undefined) payload.temperature = body.temperature;
  if (body.top_p !== undefined) payload.top_p = body.top_p;
  if (body.max_output_tokens !== undefined) payload.max_tokens = body.max_output_tokens;
  else if (body.max_tokens !== undefined) payload.max_tokens = body.max_tokens;

  return payload;
}

export function makeResponsesObject(text: string, usage: any, model: string) {
  const now = Math.floor(Date.now() / 1000);
  const rid = `resp_${crypto.randomUUID().replace(/-/g, "")}`;
  const mid = `msg_${crypto.randomUUID().replace(/-/g, "")}`;

  const inputTokens = Number(usage?.prompt_tokens || 0);
  const outputTokens = Number(usage?.completion_tokens || 0);
  const totalTokens = Number(usage?.total_tokens || inputTokens + outputTokens);

  return {
    id: rid,
    object: "response",
    created_at: now,
    status: "completed",
    model: model || getKiraModel(),
    output: [
      {
        type: "message",
        id: mid,
        status: "completed",
        role: "assistant",
        content: [
          {
            type: "output_text",
            text: text,
            annotations: []
          }
        ]
      }
    ],
    usage: {
      input_tokens: inputTokens,
      input_tokens_details: { cached_tokens: 0 },
      output_tokens: outputTokens,
      output_tokens_details: { reasoning_tokens: 0 },
      total_tokens: totalTokens
    }
  };
}

export function createSseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}