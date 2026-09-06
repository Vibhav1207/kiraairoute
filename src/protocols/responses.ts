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
    let cleanInstructions = instructions.trim();
    // If bloated by 1,200 skills metadata (> 10k chars), condense gracefully so Kira AI processes it at top speed
    if (cleanInstructions.length > 10000) {
      cleanInstructions = cleanInstructions.slice(0, 10000) + "\n\n[Context streamlined for maximum performance]";
    }
    messages.push({ role: "system", content: cleanInstructions });
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

export interface ExtractedToolCall {
  name: string;
  arguments: Record<string, any>;
  cleanedText: string;
}

export function extractToolCallFromText(text: string): ExtractedToolCall | null {
  if (!text) return null;

  // 1. Raw Patch fallback: *** Begin Patch ... *** End Patch
  if (text.includes("*** Begin Patch") && text.includes("*** End Patch")) {
    const patchMatch = text.match(/(\*\*\* Begin Patch[\s\S]*?\*\*\* End Patch)/);
    if (patchMatch) {
      const patchText = patchMatch[1].trim();
      const cleanedText = text.replace(patchMatch[0], "").trim();
      return { name: "apply_patch", arguments: { patchText }, cleanedText };
    }
  }

  // 2. Qwen / GLM / XML tool call wrapper: <tool_call> ... </tool_call>
  const toolCallMatch = text.match(/<tool_call>([\s\S]*?)(?:<\/tool_call>|$)/i);
  if (toolCallMatch) {
    const inner = toolCallMatch[1];
    const args: Record<string, string> = {};
    let funcName = "apply_patch";

    // Check for <function=name>
    const funcMatch = inner.match(/<function\s*=\s*['"]?([a-zA-Z0-9_]+)['"]?>/i);
    if (funcMatch) {
      funcName = funcMatch[1];
    }

    // Extract parameters: <parameter name="key">val</parameter> OR <parameter=key>val</parameter>
    const paramRegex = /<parameter(?:\s+name\s*=\s*['"]?([a-zA-Z0-9_]+)['"]?|\s*=\s*['"]?([a-zA-Z0-9_]+)['"]?)>([\s\S]*?)<\/parameter>/gi;
    let pMatch;
    while ((pMatch = paramRegex.exec(inner)) !== null) {
      const key = pMatch[1] || pMatch[2];
      const val = pMatch[3].trim();
      if (key) args[key] = val;
    }

    // Check JSON inside tool_call
    if (Object.keys(args).length === 0) {
      const jsonMatch = inner.match(/(\{[\s\S]*?\})/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          funcName = parsed.name || parsed.function || funcName;
          const parsedArgs = parsed.arguments || parsed.parameters || parsed;
          Object.assign(args, typeof parsedArgs === "object" ? parsedArgs : {});
        } catch {}
      }
    }

    const cleanedText = text.replace(toolCallMatch[0], "").trim();

    // If GLM/model produced filename/path + content instead of patchText, convert to apply_patch
    const filePath = args.filename || args.path || args.file || args.filepath;
    const fileContent = args.content || args.code || args.text || args.body;
    if (filePath && fileContent && !args.patchText) {
      const lines = fileContent.split("\n").map((l) => (l.startsWith("+") ? l : "+" + l)).join("\n");
      const patchText = `*** Begin Patch\n*** Add File: ${filePath}\n${lines}\n*** End Patch`;
      return {
        name: "apply_patch",
        arguments: { patchText },
        cleanedText
      };
    }

    if (Object.keys(args).length > 0) {
      return { name: funcName, arguments: args, cleanedText };
    }
  }

  // 3. Match GLM style <tool_call:id>apply_patch\n...
  const glmMatch = text.match(/<tool_call:[^>]+>([a-zA-Z0-9_]+)\s*([\s\S]*?)(?:<\/tool_call:\w+>|$)/i);
  if (glmMatch) {
    const funcName = glmMatch[1];
    const rawVal = glmMatch[2].trim();
    let args: Record<string, any> = {};
    try {
      args = JSON.parse(rawVal);
    } catch {
      args = { patchText: rawVal };
    }
    const cleanedText = text.replace(glmMatch[0], "").trim();
    return { name: funcName, arguments: args, cleanedText };
  }

  return null;
}

export function cleanModelText(text: string): string {
  if (!text) return "";
  let cleaned = text;
  cleaned = cleaned.replace(/<think:[a-f0-9]+>[\s\S]*?<\/think:[a-f0-9]+>/gi, "");
  cleaned = cleaned.replace(/<think:[a-f0-9]+>/gi, "");
  cleaned = cleaned.replace(/<\/think:[a-f0-9]+>/gi, "");
  cleaned = cleaned.replace(/<tool_calls:[a-f0-9]+>/gi, "");
  cleaned = cleaned.replace(/<\/tool_calls:[a-f0-9]+>/gi, "");
  return cleaned.trim();
}

export function makeResponsesObject(text: string, usage: any, model: string) {
  const now = Math.floor(Date.now() / 1000);
  const rid = `resp_${crypto.randomUUID().replace(/-/g, "")}`;
  const mid = `msg_${crypto.randomUUID().replace(/-/g, "")}`;

  const cleanText = cleanModelText(text);
  const extracted = extractToolCallFromText(cleanText);
  const messageText = extracted ? extracted.cleanedText : cleanText;
  const output: any[] = [];

  if (messageText || !extracted) {
    output.push({
      type: "message",
      id: mid,
      status: "completed",
      role: "assistant",
      content: [
        {
          type: "output_text",
          text: messageText || "Applying requested changes...",
          annotations: []
        }
      ]
    });
  }

  if (extracted) {
    const callId = `call_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
    output.push({
      type: "function_call",
      id: callId,
      call_id: callId,
      name: extracted.name,
      arguments: JSON.stringify(extracted.arguments)
    });
  }

  const inputTokens = Number(usage?.prompt_tokens || 0);
  const outputTokens = Number(usage?.completion_tokens || 0);
  const totalTokens = Number(usage?.total_tokens || inputTokens + outputTokens);

  return {
    id: rid,
    object: "response",
    created_at: now,
    status: "completed",
    model: model || getKiraModel(),
    output,
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