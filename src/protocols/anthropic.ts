import { getKiraModel } from "../cli/config.js";

export interface AnthropicContentBlock {
  type: string;
  text?: string;
  [key: string]: unknown;
}

export interface AnthropicMessage {
  role: "user" | "assistant";
  content: string | AnthropicContentBlock[];
}

export interface AnthropicMessagesRequest {
  model?: string;
  messages: AnthropicMessage[];
  system?: string | AnthropicContentBlock[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
  [key: string]: unknown;
}

export function anthropicToChat(body: AnthropicMessagesRequest) {
  const messages: Array<{ role: string; content: string }> = [];

  // Handle system prompt
  if (body.system) {
    let systemText = "";
    if (typeof body.system === "string") {
      systemText = body.system;
    } else if (Array.isArray(body.system)) {
      systemText = body.system
        .map((b) => (typeof b === "string" ? b : b?.text || ""))
        .filter(Boolean)
        .join("\n");
    }
    if (systemText.trim()) {
      messages.push({ role: "system", content: systemText.trim() });
    }
  }

  // Handle message history
  if (Array.isArray(body.messages)) {
    for (const msg of body.messages) {
      if (!msg || typeof msg !== "object") continue;
      const role = msg.role === "assistant" ? "assistant" : "user";
      let text = "";

      if (typeof msg.content === "string") {
        text = msg.content;
      } else if (Array.isArray(msg.content)) {
        text = msg.content
          .map((b) => {
            if (typeof b === "string") return b;
            if (b && typeof b === "object") {
              return b.text || b.content || "";
            }
            return "";
          })
          .filter(Boolean)
          .join("\n");
      }

      if (text.trim()) {
        messages.push({ role, content: text.trim() });
      }
    }
  }

  if (messages.length === 0) {
    messages.push({ role: "user", content: "Hello" });
  }

  const modelId = body.model && !body.model.startsWith("claude") ? body.model : getKiraModel();

  return {
    model: modelId,
    messages,
    max_tokens: body.max_tokens || 4096,
    temperature: body.temperature ?? 0.7,
    stream: body.stream === true
  };
}

export function makeAnthropicMessagesResponse(text: string, usage: any, model: string) {
  const msgId = `msg_${crypto.randomUUID().replace(/-/g, "")}`;
  const inputTokens = Number(usage?.prompt_tokens || 10);
  const outputTokens = Number(usage?.completion_tokens || 20);

  return {
    id: msgId,
    type: "message",
    role: "assistant",
    model: model || getKiraModel(),
    content: [
      {
        type: "text",
        text: text || ""
      }
    ],
    stop_reason: "end_turn",
    stop_sequence: null,
    usage: {
      input_tokens: inputTokens,
      output_tokens: outputTokens
    }
  };
}
