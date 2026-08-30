import type { FastifyInstance } from "fastify";
import fs from "node:fs/promises";
import path from "node:path";
import { autoConfigureAll } from "../cli/codex.js";
import { getKiraApiKey, getKiraModel, hasKiraApiKey, setKiraApiKey, setKiraModel } from "../cli/config.js";
import { DEFAULT_PORT } from "../config/constants.js";
import { kiraChat, kiraStream, testKiraConnection, translateErrorMessage } from "../kira/client.js";
import { getModel, getModels } from "../kira/models.js";
import { chatToResponses, ResponsesRequest, responsesToChat } from "../protocols/responses.js";
import { getMetrics, recordRequest } from "./metrics.js";
import { getWebPageHtml } from "./ui.js";

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  // Web UI and status endpoints
  app.get("/", async (_request, reply) => {
    return reply.type("text/html").send(getWebPageHtml());
  });

  app.get("/logo.png", async (_request, reply) => {
    try {
      const logoPath = path.join(process.cwd(), "docs", "images", "logo.png");
      const buffer = await fs.readFile(logoPath);
      return reply.type("image/png").send(buffer);
    } catch {
      return reply.code(404).send({ error: "Logo file not found." });
    }
  });

  app.get("/favicon.ico", async (_request, reply) => {
    try {
      const logoPath = path.join(process.cwd(), "docs", "images", "logo.png");
      const buffer = await fs.readFile(logoPath);
      return reply.type("image/png").send(buffer);
    } catch {
      return reply.code(404).send({ error: "Favicon file not found." });
    }
  });

  app.get("/codex-logo.webp", async (_request, reply) => {
    try {
      const logoPath = path.join(process.cwd(), "docs", "images", "codex-logo.webp");
      const buffer = await fs.readFile(logoPath);
      return reply.type("image/webp").send(buffer);
    } catch {
      return reply.code(404).send({ error: "Codex logo file not found." });
    }
  });

  app.get("/api/models", async () => {
    return { object: "list", data: getModels() };
  });

  app.get("/api/status", async () => {
    return { configured: hasKiraApiKey(), model: getKiraModel(), running: true };
  });

  app.get("/api/metrics", async () => {
    return getMetrics();
  });

  app.post("/api/setup", async (request, reply) => {
    try {
      const body = request.body as { apiKey?: string; model?: string };
      if (!body?.apiKey?.trim()) {
        return reply.code(400).send({ error: { message: "Kira API key is required." } });
      }
      if (!body.model) {
        return reply.code(400).send({ error: { message: "Model is required." } });
      }

      const selectedModel = getModel(body.model);
      if (!selectedModel) {
        return reply.code(400).send({ error: { message: `Unsupported model: ${body.model}` } });
      }

      const apiKey = body.apiKey.trim();
      setKiraApiKey(apiKey);
      setKiraModel(selectedModel.id);

      const host = request.headers.host || `127.0.0.1:${DEFAULT_PORT}`;
      const protocol = (request.headers["x-forwarded-proto"] as string) || "http";
      const baseUrl = `${protocol}://${host}/v1`;

      const configResult = autoConfigureAll({ model: selectedModel.id, baseUrl, apiKey });

      return {
        success: true,
        model: selectedModel.id,
        codexConfigured: configResult.success,
        codexPath: configResult.codexPath
      };
    } catch (error) {
      return reply.code(500).send({
        error: { message: error instanceof Error ? error.message : "Setup failed." }
      });
    }
  });

  app.post("/api/test", async (_request, reply) => {
    try {
      if (!hasKiraApiKey()) {
        return reply.code(400).send({ error: { message: "Kira API key is not configured." } });
      }
      const result = await testKiraConnection();
      if (result.status >= 400) {
        return reply.code(result.status).send(result.data);
      }
      return { success: true, model: getKiraModel() };
    } catch (error) {
      return reply.code(500).send({
        error: { message: error instanceof Error ? error.message : "Connection test failed." }
      });
    }
  });

  app.post("/api/launch-codex", async (request, reply) => {
    const { exec } = await import("node:child_process");
    const platform = process.platform;
    const host = request.headers.host || `127.0.0.1:${DEFAULT_PORT}`;
    const protocol = (request.headers["x-forwarded-proto"] as string) || "http";
    const baseUrl = `${protocol}://${host}/v1`;
    const model = getKiraModel();
    const apiKey = hasKiraApiKey() ? getKiraApiKey() : "";

    autoConfigureAll({ model, baseUrl, apiKey });

    const env = {
      ...process.env,
      KIRA_API_KEY: apiKey,
      OPENAI_API_KEY: apiKey,
      OPENAI_BASE_URL: baseUrl
    };

    return new Promise((resolve) => {
      if (platform === "win32") {
        // First try launching Desktop App directly
        exec('start "" "codex"', { env }, (err) => {
          if (err) {
            // Fallback to interactive terminal CLI
            exec('start cmd /k "codex"', { env });
          }
          resolve(reply.send({ success: true, message: "Codex launch triggered." }));
        });
      } else if (platform === "darwin") {
        // First try launching macOS App Bundle
        exec('open -a "Codex"', { env }, (err) => {
          if (err) {
            // Fallback to macOS Terminal CLI
            exec(`osascript -e 'tell application "Terminal" to do script "codex"'`, { env });
          }
          resolve(reply.send({ success: true, message: "Codex launch triggered." }));
        });
      } else {
        exec('codex', { env }, (err) => {
          if (err) {
            exec('x-terminal-emulator -e "codex" || gnome-terminal -- codex', { env });
          }
          resolve(reply.send({ success: true, message: "Codex launch triggered." }));
        });
      }
    });
  });

  app.post("/api/launch-claude", async (request, reply) => {
    const { exec } = await import("node:child_process");
    const platform = process.platform;
    const host = request.headers.host || `127.0.0.1:${DEFAULT_PORT}`;
    const protocol = (request.headers["x-forwarded-proto"] as string) || "http";
    const baseUrl = `${protocol}://${host}/v1`;
    const apiKey = hasKiraApiKey() ? getKiraApiKey() : "";

    const env = {
      ...process.env,
      ANTHROPIC_BASE_URL: baseUrl,
      ANTHROPIC_API_KEY: apiKey
    };

    return new Promise((resolve) => {
      if (platform === "win32") {
        exec('start "" "claude"', { env }, (err) => {
          if (err) {
            exec('start cmd /k "claude || npx @anthropic-ai/claude-code"', { env });
          }
          resolve(reply.send({ success: true, message: "Claude launch triggered." }));
        });
      } else if (platform === "darwin") {
        exec('open -a "Claude Code" || open -a "Claude"', { env }, (err) => {
          if (err) {
            exec(`osascript -e 'tell application "Terminal" to do script "claude || npx @anthropic-ai/claude-code"'`, { env });
          }
          resolve(reply.send({ success: true, message: "Claude launch triggered." }));
        });
      } else {
        exec('claude', { env }, (err) => {
          if (err) {
            exec('x-terminal-emulator -e "claude || npx @anthropic-ai/claude-code"', { env });
          }
          resolve(reply.send({ success: true, message: "Claude launch triggered." }));
        });
      }
    });
  });

  app.post("/api/sync-tools", async (request, reply) => {
    try {
      const model = getKiraModel();
      const apiKey = hasKiraApiKey() ? getKiraApiKey() : "";
      const host = request.headers.host || `127.0.0.1:${DEFAULT_PORT}`;
      const protocol = (request.headers["x-forwarded-proto"] as string) || "http";
      const baseUrl = `${protocol}://${host}/v1`;

      const result = autoConfigureAll({ model, baseUrl, apiKey });
      return {
        success: result.success,
        model,
        baseUrl,
        codexPath: result.codexPath,
        message: "Codex, ChatGPT Desktop & Claude Code configuration synced successfully."
      };
    } catch (error) {
      return reply.code(500).send({
        error: { message: error instanceof Error ? error.message : "Sync failed." }
      });
    }
  });

  // OpenAI Compatible Endpoints
  app.get("/v1/models", async () => {
    return {
      object: "list",
      data: getModels().map(model => ({
        id: model.id,
        object: "model",
        owned_by: model.provider.toLowerCase()
      }))
    };
  });

  app.post("/v1/chat/completions", async (request, reply) => {
    const startTime = Date.now();
    const body = request.body as any;
    const model = body?.model || getKiraModel();

    try {
      if (body?.stream === true) {
        const upstream = await kiraStream(body);
        if (!upstream.ok || !upstream.body) {
          const text = await upstream.text();
          recordRequest(model, 0, Date.now() - startTime, upstream.status);
          let errorObj: any;
          try {
            errorObj = JSON.parse(text);
            if (errorObj?.error?.message && typeof errorObj.error.message === "string") {
              errorObj.error.message = translateErrorMessage(errorObj.error.message);
            }
          } catch {
            errorObj = { error: { message: translateErrorMessage(text) } };
          }
          return reply.code(upstream.status).send(errorObj);
        }

        reply.hijack();
        reply.raw.statusCode = upstream.status;
        reply.raw.setHeader("Content-Type", "text/event-stream");
        reply.raw.setHeader("Cache-Control", "no-cache");
        reply.raw.setHeader("Connection", "keep-alive");

        const reader = upstream.body.getReader();
        const encoder = new TextEncoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            reply.raw.write(encoder.encode(new TextDecoder().decode(value)));
          }
        } finally {
          reader.releaseLock();
          reply.raw.end();
          recordRequest(model, 0, Date.now() - startTime, upstream.status);
        }
        return;
      }

      const result = await kiraChat(body);
      const tokens = (result.data as any)?.usage?.total_tokens || 0;
      recordRequest(model, tokens, Date.now() - startTime, result.status);
      return reply.code(result.status).send(result.data);
    } catch (error) {
      recordRequest(model, 0, Date.now() - startTime, 500);
      if (!reply.sent) {
        return reply.code(500).send({
          error: { message: error instanceof Error ? error.message : "Unknown error" }
        });
      }
    }
  });

  app.post("/v1/responses", async (request, reply) => {
    const startTime = Date.now();
    try {
      const responseRequest = request.body as ResponsesRequest;
      const chatRequest = responsesToChat(responseRequest);
      const model = responseRequest.model || getKiraModel();

      if (responseRequest.stream === true) {
        const upstream = await kiraStream({ ...chatRequest, stream: true });
        if (!upstream.ok || !upstream.body) {
          const text = await upstream.text();
          recordRequest(model, 0, Date.now() - startTime, upstream.status);
          let errorObj: any;
          try {
            errorObj = JSON.parse(text);
            if (errorObj?.error?.message && typeof errorObj.error.message === "string") {
              errorObj.error.message = translateErrorMessage(errorObj.error.message);
            }
          } catch {
            errorObj = { error: { message: translateErrorMessage(text) } };
          }
          return reply.code(upstream.status).send(errorObj);
        }

        reply.hijack();
        reply.raw.statusCode = 200;
        reply.raw.setHeader("Content-Type", "text/event-stream");
        reply.raw.setHeader("Cache-Control", "no-cache");
        reply.raw.setHeader("Connection", "keep-alive");
        reply.raw.setHeader("X-Accel-Buffering", "no");

        const reader = upstream.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let responseId = `resp_${crypto.randomUUID()}`;
        let messageId = `msg_${crypto.randomUUID()}`;
        let outputText = "";

        const send = (event: string, data: unknown) => {
          reply.raw.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        };

        let currentCallId = "";
        let currentCallName = "";
        let currentCallArgs = "";
        let functionItemAdded = false;
        let messageItemAdded = false;

        send("response.created", {
          type: "response.created",
          response: { id: responseId, object: "response", model: responseRequest.model, output: [] }
        });

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split(/\r?\n\r?\n/);
            buffer = events.pop() || "";

            for (const event of events) {
              const lines = event.split(/\r?\n/);
              let dataText = "";
              for (const line of lines) {
                if (line.startsWith("data:")) {
                  dataText += line.slice(5).trim();
                }
              }
              if (!dataText || dataText === "[DONE]") continue;

              let parsed: any;
              try { parsed = JSON.parse(dataText); } catch { continue; }

              if (parsed?.id && typeof parsed.id === "string") {
                responseId = `resp_${parsed.id}`;
              }

              const choice = parsed?.choices?.[0];
              const delta = choice?.delta;

              // Text content delta
              const textDelta = delta?.content;
              if (typeof textDelta === "string" && textDelta.length > 0) {
                if (!messageItemAdded) {
                  messageItemAdded = true;
                  send("response.output_item.added", {
                    type: "response.output_item.added",
                    output_index: 0,
                    item: { id: messageId, type: "message", role: "assistant", content: [] }
                  });
                }
                outputText += textDelta;
                send("response.output_text.delta", {
                  type: "response.output_text.delta",
                  item_id: messageId,
                  output_index: 0,
                  content_index: 0,
                  delta: textDelta
                });
              }

              // Tool calls delta
              const toolCalls = delta?.tool_calls;
              if (Array.isArray(toolCalls)) {
                for (const tc of toolCalls) {
                  if (tc.id) {
                    currentCallId = tc.id;
                  }
                  if (tc.function?.name) {
                    currentCallName = tc.function.name;
                  }
                  if (!functionItemAdded && (currentCallId || currentCallName)) {
                    functionItemAdded = true;
                    if (!currentCallId) currentCallId = `call_${crypto.randomUUID()}`;
                    send("response.output_item.added", {
                      type: "response.output_item.added",
                      output_index: messageItemAdded ? 1 : 0,
                      item: { id: currentCallId, type: "function_call", name: currentCallName, arguments: "" }
                    });
                  }
                  const argsChunk = tc.function?.arguments;
                  if (typeof argsChunk === "string" && argsChunk.length > 0) {
                    currentCallArgs += argsChunk;
                    send("response.function_call_arguments.delta", {
                      type: "response.function_call_arguments.delta",
                      item_id: currentCallId,
                      output_index: messageItemAdded ? 1 : 0,
                      delta: argsChunk
                    });
                  }
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }

        const finalOutput: Array<any> = [];

        if (messageItemAdded && outputText) {
          send("response.output_text.done", {
            type: "response.output_text.done",
            item_id: messageId,
            output_index: 0,
            content_index: 0,
            text: outputText
          });

          send("response.output_item.done", {
            type: "response.output_item.done",
            output_index: 0,
            item: {
              id: messageId,
              type: "message",
              role: "assistant",
              content: [{ type: "output_text", text: outputText }]
            }
          });

          finalOutput.push({
            id: messageId,
            type: "message",
            role: "assistant",
            content: [{ type: "output_text", text: outputText }]
          });
        }

        if (functionItemAdded) {
          send("response.function_call_arguments.done", {
            type: "response.function_call_arguments.done",
            item_id: currentCallId,
            output_index: messageItemAdded ? 1 : 0,
            arguments: currentCallArgs
          });

          send("response.output_item.done", {
            type: "response.output_item.done",
            output_index: messageItemAdded ? 1 : 0,
            item: {
              id: currentCallId,
              type: "function_call",
              name: currentCallName,
              arguments: currentCallArgs
            }
          });

          finalOutput.push({
            id: currentCallId,
            type: "function_call",
            name: currentCallName,
            arguments: currentCallArgs
          });
        }

        send("response.completed", {
          type: "response.completed",
          response: {
            id: responseId,
            object: "response",
            model: responseRequest.model,
            output: finalOutput
          }
        });

        reply.raw.end();
        recordRequest(model, 0, Date.now() - startTime, 200);
        return;
      }

      const result = await kiraChat(chatRequest);
      if (result.status >= 400) {
        recordRequest(model, 0, Date.now() - startTime, result.status);
        return reply.code(result.status).send(result.data);
      }

      const responsesResult = chatToResponses(result.data);
      const tokens = responsesResult?.usage?.total_tokens || 0;
      recordRequest(model, tokens, Date.now() - startTime, 200);
      return reply.send(responsesResult);
    } catch (error) {
      recordRequest("unknown", 0, Date.now() - startTime, 500);
      if (!reply.sent) {
        return reply.code(500).send({
          error: { message: error instanceof Error ? error.message : "Unknown error" }
        });
      }
    }
  });
}
