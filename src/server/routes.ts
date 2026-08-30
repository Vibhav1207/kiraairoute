import type { FastifyInstance } from "fastify";
import { getKiraApiKey, getKiraModel, hasKiraApiKey, setKiraApiKey, setKiraModel } from "../cli/config.js";
import { kiraChat, kiraStream, testKiraConnection } from "../kira/client.js";
import { getModel, getModels } from "../kira/models.js";
import { chatToResponses, ResponsesRequest, responsesToChat } from "../protocols/responses.js";

const WEB_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KiraAI Route</title>
<style>
* { box-sizing: border-box; }
body {
  margin: 0; min-height: 100vh; background: #0b0b0f; color: #f5f5f5;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  display: flex; justify-content: center; align-items: center; padding: 24px;
}
.container { width: 100%; max-width: 620px; }
.header { text-align: center; margin-bottom: 28px; }
.logo {
  width: 48px; height: 48px; margin: 0 auto 14px; border-radius: 14px;
  background: #ffffff; color: #111; display: flex; align-items: center;
  justify-content: center; font-weight: 800; font-size: 20px;
}
h1 { margin: 0; font-size: 30px; letter-spacing: -0.8px; }
.subtitle { margin-top: 8px; color: #8f8f98; font-size: 14px; }
.card { background: #15151b; border: 1px solid #292932; border-radius: 18px; padding: 26px; }
.field { margin-bottom: 22px; }
label { display: block; margin-bottom: 9px; font-size: 14px; font-weight: 650; }
input, select {
  width: 100%; height: 46px; border: 1px solid #35353f; border-radius: 9px;
  background: #0f0f14; color: #fff; padding: 0 13px; font-size: 14px; outline: none;
}
input:focus, select:focus { border-color: #777783; }
.model-info {
  margin-top: 10px; padding: 13px; border-radius: 9px; background: #101016;
  border: 1px solid #292932; color: #9999a3; font-size: 13px; line-height: 1.6;
}
.model-name { color: #fff; font-weight: 650; }
.balance { color: #f0b84b; }
.no-balance { color: #72e6a4; }
button {
  width: 100%; height: 46px; border: 0; border-radius: 9px; background: #fff;
  color: #111; font-size: 14px; font-weight: 700; cursor: pointer;
}
button:hover { opacity: 0.9; }
button:disabled { opacity: 0.5; cursor: wait; }
.status {
  display: none; margin-top: 16px; padding: 13px; border-radius: 9px;
  background: #101016; border: 1px solid #292932; font-size: 13px;
}
.status.show { display: block; }
.success { color: #72e6a4; }
.error { color: #ff7777; }
.ready {
  display: none; margin-top: 16px; padding: 16px; border-radius: 10px;
  background: #101016; border: 1px solid #292932;
}
.ready.show { display: block; }
.command { margin-top: 10px; padding: 11px; border-radius: 8px; background: #09090d; font-family: Consolas, monospace; font-size: 13px; }
.hint { margin-top: 8px; color: #707078; font-size: 12px; }
.input-group { position: relative; display: flex; align-items: center; }
.input-group input { padding-right: 44px; }
.eye-btn {
  position: absolute; right: 10px; background: none; border: none;
  color: #8f8f98; cursor: pointer; padding: 4px; display: flex;
  align-items: center; justify-content: center; width: auto; height: auto;
}
.eye-btn:hover { color: #fff; opacity: 1; }
</style>
</head>
<body>
<div class="container">
<div class="header">
<div class="logo">K</div>
<h1>KiraAI Route</h1>
<div class="subtitle">Connect Kira AI to OpenAI-compatible coding tools</div>
</div>
<div class="card">
<div class="field">
<label for="apiKey">Kira API Key</label>
<div class="input-group">
<input id="apiKey" type="password" placeholder="Paste your Kira API key" autocomplete="off">
<button id="toggleApiKey" type="button" class="eye-btn" title="Toggle visibility" aria-label="Toggle API Key visibility">
<svg id="eyeIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
</button>
</div>
<div class="hint">Your API key is kept in the local KiraAI Route process.</div>
</div>
<div class="field">
<label for="model">Model</label>
<select id="model"></select>
<div id="modelInfo" class="model-info">Select a model.</div>
</div>
<button id="start">Test & Start</button>
<div id="status" class="status"></div>
<div id="ready" class="ready">
<div class="success">✓ KiraAI Route is ready</div>
<div style="margin-top:8px">Open another terminal and run:</div>
<div class="command">codex</div>
<div class="hint">Codex will connect through your local KiraAI Route gateway.</div>
</div>
</div>
</div>
<script>
const modelSelect = document.getElementById("model");
const modelInfo = document.getElementById("modelInfo");
const apiKeyInput = document.getElementById("apiKey");
const startButton = document.getElementById("start");
const statusBox = document.getElementById("status");
const readyBox = document.getElementById("ready");
const toggleApiKeyBtn = document.getElementById("toggleApiKey");
const eyeIcon = document.getElementById("eyeIcon");
let models = [];

toggleApiKeyBtn.addEventListener("click", () => {
  const isPassword = apiKeyInput.type === "password";
  apiKeyInput.type = isPassword ? "text" : "password";
  eyeIcon.innerHTML = isPassword
    ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>'
    : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
});

function status(message, type) {
  statusBox.className = "status show " + type;
  statusBox.textContent = message;
}

function updateModelInfo() {
  const model = models.find(item => item.id === modelSelect.value);
  if (!model) { modelInfo.textContent = "Select a model."; return; }
  const requirement = model.balance_required
    ? '<span class="balance">Balance > 0 VND required</span>'
    : '<span class="no-balance">No balance required</span>';
  modelInfo.innerHTML = '<div class="model-name">' + model.name + '</div>' + requirement + '<br>' + model.daily_limit + ' · ' + model.context_window.toLocaleString() + ' context';
}

async function loadModels() {
  const response = await fetch("/api/models");
  const data = await response.json();
  models = data.data || [];
  modelSelect.innerHTML = "";
  const freeModels = models.filter(model => !model.balance_required);
  const balanceModels = models.filter(model => model.balance_required);

  const freeGroup = document.createElement("optgroup");
  freeGroup.label = "FREE — No balance required";
  for (const model of freeModels) {
    const option = document.createElement("option");
    option.value = model.id; option.textContent = model.name; freeGroup.appendChild(option);
  }
  modelSelect.appendChild(freeGroup);

  const balanceGroup = document.createElement("optgroup");
  balanceGroup.label = "FREE — Balance > 0 VND required";
  for (const model of balanceModels) {
    const option = document.createElement("option");
    option.value = model.id; option.textContent = model.name; balanceGroup.appendChild(option);
  }
  modelSelect.appendChild(balanceGroup);
  updateModelInfo();
}

modelSelect.addEventListener("change", updateModelInfo);

startButton.addEventListener("click", async () => {
  const apiKey = apiKeyInput.value.trim();
  const model = modelSelect.value;
  if (!apiKey) { status("Please enter your Kira API key.", "error"); return; }

  startButton.disabled = true;
  readyBox.className = "ready";
  status("Saving configuration...", "");

  try {
    const setupResponse = await fetch("/api/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey, model })
    });
    const setupData = await setupResponse.json();
    if (!setupResponse.ok) throw new Error(setupData?.error?.message || "Setup failed.");

    status("Testing Kira API connection...", "");
    const testResponse = await fetch("/api/test", { method: "POST" });
    const testData = await testResponse.json();
    if (!testResponse.ok) throw new Error(testData?.error?.message || "Connection test failed.");

    status("✓ Kira API connected successfully.", "success");
    readyBox.className = "ready show";
  } catch (error) {
    status(error instanceof Error ? error.message : "Something went wrong.", "error");
  } finally {
    startButton.disabled = false;
  }
});

loadModels().catch(() => { status("Could not load available models.", "error"); });
</script>
</body>
</html>`;

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  // Web UI and status endpoints
  app.get("/", async (_request, reply) => {
    return reply.type("text/html").send(WEB_PAGE);
  });

  app.get("/api/models", async () => {
    return { object: "list", data: getModels() };
  });

  app.get("/api/status", async () => {
    return { configured: hasKiraApiKey(), model: getKiraModel(), running: true };
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
    try {
      const body = request.body as any;
      if (body?.stream === true) {
        const upstream = await kiraStream(body);
        if (!upstream.ok || !upstream.body) {
          const text = await upstream.text();
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
        }
        return;
      }

      const result = await kiraChat(body);
      return reply.code(result.status).send(result.data);
    } catch (error) {
      if (!reply.sent) {
        return reply.code(500).send({
          error: { message: error instanceof Error ? error.message : "Unknown error" }
        });
      }
    }
  });

  app.post("/v1/responses", async (request, reply) => {
    try {
      const responseRequest = request.body as ResponsesRequest;
      const chatRequest = responsesToChat(responseRequest);

      if (responseRequest.stream === true) {
        const upstream = await kiraStream({ ...chatRequest, stream: true });
        if (!upstream.ok || !upstream.body) {
          const text = await upstream.text();
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
        return;
      }

      const result = await kiraChat(chatRequest);
      if (result.status >= 400) {
        return reply.code(result.status).send(result.data);
      }

      const responsesResult = chatToResponses(result.data);
      return reply.send(responsesResult);
    } catch (error) {
      if (!reply.sent) {
        return reply.code(500).send({
          error: { message: error instanceof Error ? error.message : "Unknown error" }
        });
      }
    }
  });
}
