export interface ChatMessage {
  role: "system" | "user" | "assistant" | "developer";
  content: string | Array<{ type?: string; text?: string }>;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}
