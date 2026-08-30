import type { FastifyInstance } from "fastify";
import fs from "node:fs/promises";
import path from "node:path";
import { autoConfigureAll } from "../cli/codex.js";
import { getKiraApiKey, getKiraModel, hasKiraApiKey, setKiraApiKey, setKiraModel } from "../cli/config.js";
import { DEFAULT_PORT } from "../config/constants.js";
import { kiraChat, kiraStream, testKiraConnection, translateErrorMessage } from "../kira/client.js";
import { getModel, getModels } from "../kira/models.js";
import { makeResponsesObject, ResponsesRequest, responsesToChat } from "../protocols/responses.js";
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

      // Fast probe connection test (completes in ~1s)
      const testResult = await testKiraConnection(selectedModel.id);
      if (testResult.status >= 400) {
        return reply.code(testResult.status).send(testResult.data);
      }

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
        let upstream: Response | null = null;
        let lastErrorText = "";

        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            upstream = await kiraStream(body);
            if (upstream.ok && upstream.body) break;
            lastErrorText = await upstream.text();
            if (attempt < 2) {
              await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
            }
          } catch (e) {
            lastErrorText = e instanceof Error ? e.message : "Connection failed";
            if (attempt < 2) {
              await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
            }
          }
        }

        if (!upstream || !upstream.ok || !upstream.body) {
          recordRequest(model, 0, Date.now() - startTime, upstream?.status || 502);
          let errorObj: any;
          try {
            errorObj = JSON.parse(lastErrorText);
            if (errorObj?.error?.message && typeof errorObj.error.message === "string") {
              errorObj.error.message = translateErrorMessage(errorObj.error.message);
            }
          } catch {
            errorObj = { error: { message: translateErrorMessage(lastErrorText) } };
          }
          return reply.code(upstream?.status || 502).send(errorObj);
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
    const body = request.body as ResponsesRequest;
    const model = body?.model || getKiraModel();

    try {
      const chatPayload = responsesToChat(body);

      // Fetch from upstream Kira AI with automatic retry
      const upstreamResult = await kiraChat(chatPayload, 2);
      if (upstreamResult.status >= 400) {
        recordRequest(model, 0, Date.now() - startTime, upstreamResult.status);
        return reply.code(upstreamResult.status).send(upstreamResult.data);
      }

      const rawData = upstreamResult.data as any;
      const choices = rawData?.choices || [];
      const choice = choices[0] || {};
      const message = choice?.message || {};
      const text = typeof message?.content === "string" ? message.content : "";
      const usage = rawData?.usage;
      const responseObj = makeResponsesObject(text, usage, model);
      const tokens = responseObj.usage.total_tokens;

      recordRequest(model, tokens, Date.now() - startTime, 200);

      // If Codex requested streaming
      if (body?.stream === true) {
        reply.hijack();
        reply.raw.statusCode = 200;
        reply.raw.setHeader("Content-Type", "text/event-stream");
        reply.raw.setHeader("Cache-Control", "no-cache");
        reply.raw.setHeader("Connection", "keep-alive");
        reply.raw.setHeader("X-Accel-Buffering", "no");

        const rid = responseObj.id;
        const mid = responseObj.output[0].id;
        const now = responseObj.created_at;

        const sse = (event: string, data: unknown) => {
          reply.raw.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        };

        sse("response.created", {
          type: "response.created",
          response: {
            id: rid,
            object: "response",
            created_at: now,
            status: "in_progress",
            model,
            output: [],
            usage: null
          }
        });

        sse("response.output_item.added", {
          type: "response.output_item.added",
          response_id: rid,
          output_index: 0,
          item: {
            type: "message",
            id: mid,
            status: "in_progress",
            role: "assistant",
            content: []
          }
        });

        sse("response.content_part.added", {
          type: "response.content_part.added",
          response_id: rid,
          item_id: mid,
          output_index: 0,
          content_index: 0,
          part: {
            type: "output_text",
            text: "",
            annotations: []
          }
        });

        if (text) {
          const chunks = text.match(/\S+\s*/g) || [text];
          for (const chunk of chunks) {
            sse("response.output_text.delta", {
              type: "response.output_text.delta",
              response_id: rid,
              item_id: mid,
              output_index: 0,
              content_index: 0,
              delta: chunk
            });
          }
        }

        sse("response.output_text.done", {
          type: "response.output_text.done",
          response_id: rid,
          item_id: mid,
          output_index: 0,
          content_index: 0,
          text
        });

        sse("response.content_part.done", {
          type: "response.content_part.done",
          response_id: rid,
          item_id: mid,
          output_index: 0,
          content_index: 0,
          part: {
            type: "output_text",
            text,
            annotations: []
          }
        });

        sse("response.output_item.done", {
          type: "response.output_item.done",
          response_id: rid,
          output_index: 0,
          item: responseObj.output[0]
        });

        sse("response.completed", {
          type: "response.completed",
          response: responseObj
        });

        reply.raw.end();
        return;
      }

      return reply.send(responseObj);
    } catch (error) {
      recordRequest(model, 0, Date.now() - startTime, 500);
      return reply.code(500).send({
        error: { message: error instanceof Error ? error.message : "Bridge error" }
      });
    }
  });
}
