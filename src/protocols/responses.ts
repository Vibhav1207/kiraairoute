export interface ResponsesRequest {
  model: string;
  input: unknown;
  instructions?: string;
  temperature?: number;
  max_output_tokens?: number;
  stream?: boolean;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function responsesToChat(
  request: ResponsesRequest
): {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
} {
  const messages: ChatMessage[] = [];


  if (request.instructions) {
    messages.push({
      role: "system",
      content: request.instructions
    });
  }

  if (typeof request.input === "string") {
    messages.push({
      role: "user",
      content: request.input
    });
  }


  else if (Array.isArray(request.input)) {
    for (const item of request.input) {
      if (typeof item === "string") {
        messages.push({
          role: "user",
          content: item
        });
        continue;
      }

      if (
        typeof item === "object" &&
        item !== null &&
        "role" in item &&
        "content" in item
      ) {
        const message = item as {
          role: string;
          content: unknown;
        };

        if (
          message.role === "system" ||
          message.role === "user" ||
          message.role === "assistant"
        ) {
          messages.push({
            role: message.role,
            content:
              typeof message.content === "string"
                ? message.content
                : JSON.stringify(message.content)
          });
        }
      }
    }
  }

  return {
    model: request.model,
    messages,
    ...(request.temperature !== undefined
      ? { temperature: request.temperature }
      : {}),
    ...(request.max_output_tokens !== undefined
      ? { max_tokens: request.max_output_tokens }
      : {}),
    ...(request.stream !== undefined
      ? { stream: request.stream }
      : {})
  };
}

export function chatToResponses(
  chatResponse: any
) {
  const message =
    chatResponse?.choices?.[0]?.message;

  const text =
    typeof message?.content === "string"
      ? message.content
      : "";

  const outputItem = {
    type: "message",
    id: `msg_${chatResponse?.id ?? crypto.randomUUID()}`,
    role: "assistant",
    content: [
      {
        type: "output_text",
        text
      }
    ]
  };

  return {
    id: `resp_${chatResponse?.id ?? crypto.randomUUID()}`,
    object: "response",
    created_at:
      chatResponse?.created ??
      Math.floor(Date.now() / 1000),
    model: chatResponse?.model,
    output: [outputItem],
    usage: chatResponse?.usage
      ? {
          input_tokens:
            chatResponse.usage.prompt_tokens ?? 0,
          output_tokens:
            chatResponse.usage.completion_tokens ?? 0,
          total_tokens:
            chatResponse.usage.total_tokens ?? 0
        }
      : null
  };
}