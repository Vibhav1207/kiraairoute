import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { autoConfigureAll } from "../cli/codex.js";
import { getKiraApiKey, getKiraModel, hasKiraApiKey, setKiraApiKey, setKiraModel } from "../cli/config.js";
import { DEFAULT_PORT } from "../config/constants.js";
import { kiraChat, kiraStream, testKiraConnection, translateErrorMessage } from "../kira/client.js";
import { getModel, getModels } from "../kira/models.js";
import { cleanModelText, extractToolCallFromText, makeResponsesObject, ResponsesRequest, responsesToChat } from "../protocols/responses.js";
import { anthropicToChat, makeAnthropicMessagesResponse, AnthropicMessagesRequest } from "../protocols/anthropic.js";
import { getMetrics, recordRequest } from "./metrics.js";
import { getWebPageHtml } from "./ui.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function locateSkillFile(): Promise<string | null> {
  const possiblePaths = [
    path.join(process.cwd(), "SKILL.md"),
    path.join(__dirname, "..", "..", "SKILL.md"),
    path.join(__dirname, "..", "SKILL.md")
  ];
  for (const p of possiblePaths) {
    try {
      const stat = await fs.stat(p);
      if (stat.isFile()) return p;
    } catch {}
  }
  return null;
}

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  // Web UI and status endpoints
  app.get("/", async (_request, reply) => {
    return reply
      .header("Cache-Control", "no-cache, no-store, must-revalidate")
      .header("Pragma", "no-cache")
      .header("Expires", "0")
      .type("text/html")
      .send(getWebPageHtml());
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

  app.get("/api/skill", async (_request, reply) => {
    const skillPath = await locateSkillFile();
    if (!skillPath) {
      return reply.code(404).send({ error: { message: "SKILL.md file not found." } });
    }
    try {
      const content = await fs.readFile(skillPath, "utf-8");
      return { success: true, content };
    } catch {
      return reply.code(500).send({ error: { message: "Failed to read SKILL.md file." } });
    }
  });

  app.get("/api/skill/download", async (_request, reply) => {
    const skillPath = await locateSkillFile();
    if (!skillPath) {
      return reply.code(404).send({ error: "SKILL.md file not found." });
    }
    try {
      const buffer = await fs.readFile(skillPath);
      return reply
        .header("Content-Disposition", 'attachment; filename="SKILL.md"')
        .type("text/markdown")
        .send(buffer);
    } catch {
      return reply.code(500).send({ error: "Failed to download SKILL.md file." });
    }
  });

  app.get("/SKILL.md", async (_request, reply) => {
    const skillPath = await locateSkillFile();
    if (!skillPath) {
      return reply.code(404).send({ error: "SKILL.md file not found." });
    }
    try {
      const content = await fs.readFile(skillPath, "utf-8");
      return reply.type("text/markdown").send(content);
    } catch {
      return reply.code(500).send({ error: "Failed to read SKILL.md file." });
    }
  });

  app.get("/api/models", async () => {
    return { object: "list", data: getModels() };
  });

  app.get("/api/status", async () => {
    return {
      configured: hasKiraApiKey(),
      apiKey: hasKiraApiKey() ? getKiraApiKey() : "",
      model: getKiraModel(),
      running: true
    };
  });

  app.get("/playground", async (_request, reply) => {
    return reply
      .header("Cache-Control", "no-cache, no-store, must-revalidate")
      .header("Pragma", "no-cache")
      .header("Expires", "0")
      .type("text/html")
      .send(getWebPageHtml());
  });

  app.get("/api/metrics", async () => {
    return getMetrics();
  });

  app.post("/api/playground", async (request, reply) => {
    try {
      const body = (request.body || {}) as { prompt?: string; apiKey?: string; model?: string };
      const prompt = body.prompt?.trim();
      if (!prompt) {
        return reply.code(400).send({ error: { message: "Prompt text is required." } });
      }

      let apiKey = body.apiKey?.trim();
      if (apiKey) {
        setKiraApiKey(apiKey);
      } else if (hasKiraApiKey()) {
        apiKey = getKiraApiKey();
      }

      if (!apiKey) {
        return reply.code(400).send({
          error: { message: "No Kira API key found. Paste your key from kiraai.vn/developer in the API key input to test live queries." }
        });
      }

      const model = body.model || getKiraModel() || "kira-mini-1.0";
      const result = await kiraChat({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000
      });

      if (result.status >= 400) {
        const errObj = result.data as any;
        const msg = errObj?.error?.message || `Upstream status ${result.status}`;
        return reply.code(result.status).send({ error: { message: translateErrorMessage(msg) } });
      }

      const choices = (result.data as any)?.choices;
      const responseText = choices?.[0]?.message?.content || "No response text generated.";

      return {
        success: true,
        model,
        text: responseText
      };
    } catch (error) {
      return reply.code(500).send({
        error: { message: error instanceof Error ? error.message : "Playground query failed." }
      });
    }
  });

  app.post("/api/setup", async (request, reply) => {
    try {
      const body = (request.body || {}) as { apiKey?: string; model?: string; skipTest?: boolean };
      let apiKey = body?.apiKey?.trim();

      if (apiKey) {
        setKiraApiKey(apiKey);
      } else if (hasKiraApiKey()) {
        apiKey = getKiraApiKey();
      } else {
        apiKey = "";
      }

      const modelId = body?.model || getKiraModel() || "kira-mini-1.0";
      const selectedModel = getModel(modelId);
      if (selectedModel) {
        setKiraModel(selectedModel.id);
      }

      const host = request.headers.host || `127.0.0.1:${DEFAULT_PORT}`;
      const protocol = (request.headers["x-forwarded-proto"] as string) || "http";
      const baseUrl = `${protocol}://${host}/v1`;

      // 1. ALWAYS write & auto-configure Codex config.toml and environment variables
      const configResult = autoConfigureAll({
        model: selectedModel?.id || modelId,
        baseUrl,
        apiKey: apiKey || undefined
      });

      // 2. Perform connection probe if requested and API key is present
      let connectionWarning: string | null = null;
      let connected = false;
      if (!body.skipTest) {
        if (apiKey) {
          try {
            const testResult = await testKiraConnection(selectedModel?.id || modelId);
            if (testResult.status >= 400) {
              const errData = testResult.data as any;
              connectionWarning = errData?.error?.message || `Upstream status ${testResult.status}`;
            } else {
              connected = true;
            }
          } catch (err) {
            connectionWarning = err instanceof Error ? err.message : "Connection test timed out.";
          }
        } else {
          connectionWarning = "No Kira API key provided yet. Paste your key from kiraai.vn/developer to enable live model queries.";
        }
      }

      const maskedKey = apiKey ? `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}` : "";

      return {
        success: true,
        connected,
        model: selectedModel?.id || modelId,
        modelDetails: selectedModel,
        hasApiKey: Boolean(apiKey),
        apiKeyMasked: maskedKey,
        codexConfigured: configResult.success,
        codexPath: configResult.codexPath,
        connectionWarning
      };
    } catch (error) {
      return reply.code(500).send({
        error: { message: error instanceof Error ? error.message : "Setup failed." }
      });
    }
  });

  app.post("/api/test", async (request, reply) => {
    try {
      const body = (request.body || {}) as { apiKey?: string; model?: string };
      const model = body.model || getKiraModel();
      let apiKey = body.apiKey?.trim();
      if (apiKey) {
        setKiraApiKey(apiKey);
      }
      if (!hasKiraApiKey()) {
        return reply.code(400).send({
          success: false,
          connected: false,
          error: { message: "Kira API key is not configured. Paste your key from kiraai.vn/developer to enable live testing." }
        });
      }
      const result = await testKiraConnection(model);
      const modelInfo = getModel(model);
      if (result.status >= 400) {
        const errData = result.data as any;
        const msg = errData?.error?.message || `Upstream error status ${result.status}`;
        return reply.code(result.status).send({
          success: false,
          connected: false,
          model,
          modelDetails: modelInfo,
          error: { message: msg }
        });
      }
      return {
        success: true,
        connected: true,
        model,
        modelDetails: modelInfo
      };
    } catch (error) {
      return reply.code(500).send({
        success: false,
        connected: false,
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
    const modelsList = getModels();
    return {
      object: "list",
      data: modelsList.map((model) => ({
        id: model.id,
        object: "model",
        created: 1700000000,
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

      // If Codex requested streaming
      if (body?.stream === true) {
        const candidateModels = [
          model,
          ...(model !== "mimo-v2.5" ? ["mimo-v2.5"] : []),
          ...(model !== "hy3" ? ["hy3"] : []),
          ...(model !== "kira-2.0" ? ["kira-2.0"] : [])
        ];

        let upstream: Response | null = null;
        let lastErrorText = "";
        let successfulModel = model;

        for (const candidate of candidateModels) {
          try {
            const payload = { ...chatPayload, model: candidate, stream: true };
            upstream = await kiraStream(payload, 120000);
            if (upstream.ok && upstream.body) {
              successfulModel = candidate;
              break;
            }
            lastErrorText = await upstream.text();
          } catch (e) {
            lastErrorText = e instanceof Error ? e.message : "Connection failed";
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
        reply.raw.statusCode = 200;
        reply.raw.setHeader("Content-Type", "text/event-stream");
        reply.raw.setHeader("Cache-Control", "no-cache");
        reply.raw.setHeader("Connection", "keep-alive");
        reply.raw.setHeader("X-Accel-Buffering", "no");

        const rid = `resp_${crypto.randomUUID().replace(/-/g, "")}`;
        const mid = `msg_${crypto.randomUUID().replace(/-/g, "")}`;
        const now = Math.floor(Date.now() / 1000);

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
            model: successfulModel,
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

        const reader = upstream.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullText = "";
        let fullReasoning = "";

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

              const delta = parsed?.choices?.[0]?.delta;
              const contentChunk = delta?.content;
              const reasoningChunk = delta?.reasoning_content;

              if (typeof contentChunk === "string" && contentChunk.length > 0) {
                fullText += contentChunk;
                sse("response.output_text.delta", {
                  type: "response.output_text.delta",
                  response_id: rid,
                  item_id: mid,
                  output_index: 0,
                  content_index: 0,
                  delta: contentChunk
                });
              } else if (typeof reasoningChunk === "string" && reasoningChunk.length > 0) {
                fullReasoning += reasoningChunk;
              }
            }
          }
        } finally {
          reader.releaseLock();
        }

        const finalText = cleanModelText(fullText || fullReasoning || "Done.");
        const extractedTool = extractToolCallFromText(finalText);
        const messageText = extractedTool ? (extractedTool.cleanedText || "Creating files...") : finalText;

        // If content was only in reasoning_content, stream it out now
        if (!fullText && messageText) {
          const chunks = messageText.match(/\S+\s*/g) || [messageText];
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
          text: messageText
        });

        sse("response.content_part.done", {
          type: "response.content_part.done",
          response_id: rid,
          item_id: mid,
          output_index: 0,
          content_index: 0,
          part: {
            type: "output_text",
            text: messageText,
            annotations: []
          }
        });

        const completedItem = {
          type: "message",
          id: mid,
          status: "completed",
          role: "assistant",
          content: [
            {
              type: "output_text",
              text: messageText,
              annotations: []
            }
          ]
        };

        sse("response.output_item.done", {
          type: "response.output_item.done",
          response_id: rid,
          output_index: 0,
          item: completedItem
        });

        const outputList: any[] = [completedItem];

        if (extractedTool) {
          const callId = `call_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
          const jsonArgs = JSON.stringify(extractedTool.arguments);

          const toolItem = {
            type: "function_call",
            id: callId,
            call_id: callId,
            name: extractedTool.name,
            arguments: jsonArgs
          };

          sse("response.output_item.added", {
            type: "response.output_item.added",
            response_id: rid,
            output_index: 1,
            item: {
              type: "function_call",
              id: callId,
              call_id: callId,
              name: extractedTool.name,
              arguments: ""
            }
          });

          sse("response.function_call_arguments.delta", {
            type: "response.function_call_arguments.delta",
            response_id: rid,
            item_id: callId,
            output_index: 1,
            call_id: callId,
            delta: jsonArgs
          });

          sse("response.function_call_arguments.done", {
            type: "response.function_call_arguments.done",
            response_id: rid,
            item_id: callId,
            output_index: 1,
            call_id: callId,
            arguments: jsonArgs
          });

          sse("response.output_item.done", {
            type: "response.output_item.done",
            response_id: rid,
            output_index: 1,
            item: toolItem
          });

          outputList.push(toolItem);
        }

        const finalResponseObj = {
          id: rid,
          object: "response",
          created_at: now,
          status: "completed",
          model: successfulModel,
          output: outputList,
          usage: {
            input_tokens: 100,
            input_tokens_details: { cached_tokens: 0 },
            output_tokens: Math.max(1, Math.floor(finalText.length / 4)),
            output_tokens_details: { reasoning_tokens: Math.floor(fullReasoning.length / 4) },
            total_tokens: 100 + Math.max(1, Math.floor(finalText.length / 4))
          }
        };

        sse("response.completed", {
          type: "response.completed",
          response: finalResponseObj
        });

        reply.raw.end();
        recordRequest(successfulModel, finalResponseObj.usage.total_tokens, Date.now() - startTime, 200);
        return;
      }

      // Non-streaming fallback
      const candidateModels = [
        model,
        ...(model !== "mimo-v2.5" ? ["mimo-v2.5"] : []),
        ...(model !== "hy3" ? ["hy3"] : [])
      ];

      let upstreamResult: { status: number; data: unknown } | null = null;
      let successfulModel = model;

      for (const candidate of candidateModels) {
        upstreamResult = await kiraChat({ ...chatPayload, model: candidate }, 1, 10000);
        if (upstreamResult.status < 400) {
          successfulModel = candidate;
          break;
        }
      }

      if (!upstreamResult || upstreamResult.status >= 400) {
        const code = upstreamResult?.status || 502;
        recordRequest(model, 0, Date.now() - startTime, code);
        return reply.code(code).send(upstreamResult?.data);
      }

      const rawData = upstreamResult.data as any;
      const choices = rawData?.choices || [];
      const choice = choices[0] || {};
      const message = choice?.message || {};
      const text = (typeof message?.content === "string" && message.content) || message?.reasoning_content || "";
      const usage = rawData?.usage;
      const responseObj = makeResponsesObject(text, usage, successfulModel);
      const tokens = responseObj.usage.total_tokens;

      recordRequest(successfulModel, tokens, Date.now() - startTime, 200);
      return reply.send(responseObj);
    } catch (error) {
      recordRequest(model, 0, Date.now() - startTime, 500);
      return reply.code(500).send({
        error: { message: error instanceof Error ? error.message : "Bridge error" }
      });
    }
  });

  // Anthropic Messages API Compatible Endpoints (/v1/messages and /messages)
  const handleAnthropicMessages = async (request: FastifyRequest, reply: FastifyReply) => {
    const startTime = Date.now();
    const body = (request.body || {}) as AnthropicMessagesRequest;
    const model = body?.model && !body.model.startsWith("claude") ? body.model : getKiraModel();

    try {
      const chatPayload = anthropicToChat(body);

      if (body?.stream === true) {
        const candidateModels = [
          model,
          ...(model !== "mimo-v2.5" ? ["mimo-v2.5"] : []),
          ...(model !== "hy3" ? ["hy3"] : []),
          ...(model !== "kira-2.0" ? ["kira-2.0"] : [])
        ];

        let upstream: Response | null = null;
        let lastErrorText = "";
        let successfulModel = model;

        for (const candidate of candidateModels) {
          try {
            const payload = { ...chatPayload, model: candidate, stream: true };
            upstream = await kiraStream(payload, 120000);
            if (upstream.ok && upstream.body) {
              successfulModel = candidate;
              break;
            }
            lastErrorText = await upstream.text();
          } catch (e) {
            lastErrorText = e instanceof Error ? e.message : "Connection failed";
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
            errorObj = { type: "error", error: { type: "api_error", message: translateErrorMessage(lastErrorText) } };
          }
          return reply.code(upstream?.status || 502).send(errorObj);
        }

        reply.hijack();
        reply.raw.statusCode = 200;
        reply.raw.setHeader("Content-Type", "text/event-stream");
        reply.raw.setHeader("Cache-Control", "no-cache");
        reply.raw.setHeader("Connection", "keep-alive");
        reply.raw.setHeader("X-Accel-Buffering", "no");

        const msgId = `msg_${crypto.randomUUID().replace(/-/g, "")}`;

        const sse = (event: string, data: unknown) => {
          reply.raw.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        };

        sse("message_start", {
          type: "message_start",
          message: {
            id: msgId,
            type: "message",
            role: "assistant",
            model: successfulModel,
            content: [],
            stop_reason: null,
            stop_sequence: null,
            usage: { input_tokens: 15, output_tokens: 1 }
          }
        });

        sse("content_block_start", {
          type: "content_block_start",
          index: 0,
          content_block: { type: "text", text: "" }
        });

        const reader = upstream.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullText = "";
        let fullReasoning = "";

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

              const delta = parsed?.choices?.[0]?.delta;
              const contentChunk = delta?.content;
              const reasoningChunk = delta?.reasoning_content;

              if (typeof contentChunk === "string" && contentChunk.length > 0) {
                fullText += contentChunk;
                sse("content_block_delta", {
                  type: "content_block_delta",
                  index: 0,
                  delta: { type: "text_delta", text: contentChunk }
                });
              } else if (typeof reasoningChunk === "string" && reasoningChunk.length > 0) {
                fullReasoning += reasoningChunk;
              }
            }
          }
        } finally {
          reader.releaseLock();
        }

        const finalText = fullText || fullReasoning || "Done.";

        if (!fullText && finalText) {
          const chunks = finalText.match(/\S+\s*/g) || [finalText];
          for (const chunk of chunks) {
            sse("content_block_delta", {
              type: "content_block_delta",
              index: 0,
              delta: { type: "text_delta", text: chunk }
            });
          }
        }

        sse("content_block_stop", {
          type: "content_block_stop",
          index: 0
        });

        const outTokens = Math.max(1, Math.floor(finalText.length / 4));

        sse("message_delta", {
          type: "message_delta",
          delta: { stop_reason: "end_turn", stop_sequence: null },
          usage: { output_tokens: outTokens }
        });

        sse("message_stop", {
          type: "message_stop"
        });

        reply.raw.end();
        recordRequest(successfulModel, 15 + outTokens, Date.now() - startTime, 200);
        return;
      }

      // Non-streaming fallback
      const candidateModels = [
        model,
        ...(model !== "mimo-v2.5" ? ["mimo-v2.5"] : []),
        ...(model !== "hy3" ? ["hy3"] : [])
      ];

      let upstreamResult: { status: number; data: unknown } | null = null;
      let successfulModel = model;

      for (const candidate of candidateModels) {
        upstreamResult = await kiraChat({ ...chatPayload, model: candidate }, 1, 10000);
        if (upstreamResult.status < 400) {
          successfulModel = candidate;
          break;
        }
      }

      if (!upstreamResult || upstreamResult.status >= 400) {
        const code = upstreamResult?.status || 502;
        recordRequest(model, 0, Date.now() - startTime, code);
        return reply.code(code).send(upstreamResult?.data);
      }

      const rawData = upstreamResult.data as any;
      const choices = rawData?.choices || [];
      const choice = choices[0] || {};
      const message = choice?.message || {};
      const text = (typeof message?.content === "string" && message.content) || message?.reasoning_content || "";
      const usage = rawData?.usage;
      const responseObj = makeAnthropicMessagesResponse(text, usage, successfulModel);

      recordRequest(successfulModel, responseObj.usage.input_tokens + responseObj.usage.output_tokens, Date.now() - startTime, 200);
      return reply.send(responseObj);
    } catch (error) {
      recordRequest(model, 0, Date.now() - startTime, 500);
      return reply.code(500).send({
        type: "error",
        error: { type: "api_error", message: error instanceof Error ? error.message : "Bridge error" }
      });
    }
  };

  app.post("/v1/messages", handleAnthropicMessages);
  app.post("/messages", handleAnthropicMessages);
}

