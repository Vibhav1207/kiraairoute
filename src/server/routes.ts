import type { FastifyInstance } from "fastify";
import { getKiraApiKey, getKiraModel, hasKiraApiKey, setKiraApiKey, setKiraModel } from "../cli/config.js";
import { kiraChat, kiraStream, testKiraConnection } from "../kira/client.js";
import { getModel, getModels } from "../kira/models.js";
import { chatToResponses, ResponsesRequest, responsesToChat } from "../protocols/responses.js";
import { getMetrics, recordRequest } from "./metrics.js";
import { getWebPageHtml } from "./ui.js";

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  // Web UI and status endpoints
  app.get("/", async (_request, reply) => {
    return reply.type("text/html").send(getWebPageHtml());
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

      setKiraApiKey(body.apiKey.trim());
      setKiraModel(selectedModel.id);
      return { success: true, model: selectedModel.id };
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

  app.post("/api/launch-codex", async (_request, reply) => {
    try {
      const { exec } = await import("node:child_process");
      exec("codex");
      return { success: true, message: "Codex launch triggered." };
    } catch {
      return reply.code(500).send({ error: { message: "Could not launch Codex binary." } });
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
          return reply.code(upstream.status).send({ error: { message: text } });
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
          return reply.code(upstream.status).send({ error: { message: text } });
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

        send("response.created", {
          type: "response.created",
          response: { id: responseId, object: "response", model: responseRequest.model, output: [] }
        });

        send("response.output_item.added", {
          type: "response.output_item.added",
          output_index: 0,
          item: { id: messageId, type: "message", role: "assistant", content: [] }
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

              const delta = parsed?.choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta.length > 0) {
                outputText += delta;
                send("response.output_text.delta", {
                  type: "response.output_text.delta",
                  item_id: messageId,
                  output_index: 0,
                  content_index: 0,
                  delta
                });
              }

              if (parsed?.id && typeof parsed.id === "string") {
                responseId = `resp_${parsed.id}`;
              }
            }
          }
        } finally {
          reader.releaseLock();
        }

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

        send("response.completed", {
          type: "response.completed",
          response: {
            id: responseId,
            object: "response",
            model: responseRequest.model,
            output: [
              {
                id: messageId,
                type: "message",
                role: "assistant",
                content: [{ type: "output_text", text: outputText }]
              }
            ]
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
