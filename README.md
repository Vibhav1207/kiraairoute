<div align="center">

# 🚀 KiraAI Route

**High-performance, zero-latency OpenAI-compatible local AI gateway and LLM proxy for Kira AI.**

*Route Kira AI models to OpenAI-compatible coding tools like Codex, Claude Code, Cursor, and custom developer scripts.*

[![npm version](https://img.shields.io/npm/v/@vibhav1207/kiraairoute.svg?style=for-the-badge&color=6366f1)](https://www.npmjs.com/package/@vibhav1207/kiraairoute)
[![License](https://img.shields.io/badge/license-MIT-6366f1.svg?style=for-the-badge)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Build Status](https://img.shields.io/badge/build-passing-10b981.svg?style=for-the-badge)](https://github.com/Vibhav1207/kiraairoute)

[Overview](#-overview) • [Quick Start](#-quick-start) • [Installation](#-installation-options) • [Key Features](#-key-features) • [Supported Models](#-supported-models) • [API Reference](#-api-reference) • [Client Configuration](#-connecting-codex-cursor--ai-tools)

</div>

---

## 📌 Overview

**KiraAI Route** is a lightweight local AI gateway and API proxy that translates standard OpenAI API requests into native calls for the **Kira AI** platform (`https://kiraai.vn`).

By running a local server on `http://127.0.0.1:4010/v1`, KiraAI Route allows any OpenAI-compatible tool—including **Codex**, **Claude Code**, **Cursor**, **Continue**, and the official **OpenAI SDK**—to seamless use free daily token allowances for models like `kira-mini-1.0`, `mimo-v2.5`, `deepseek-v4-flash-free`, `qwen3.8-flash`, and `glm-5.3`.

---

## ⚡ Quick Start

Run instantly without installation:

```bash
npx @vibhav1207/kiraairoute
```

On first run, KiraAI Route automatically launches a local developer web dashboard at **`http://127.0.0.1:4010`**:

1. Enter your **Kira API Key** (obtainable from [kiraai.vn/developer](https://kiraai.vn/developer/)).
2. Select your target AI model (e.g. `Kira Mini 1.0` or `DeepSeek V4 Flash`).
3. Click **Test & Start**.

Your local OpenAI-compatible endpoint will be ready at:

```text
http://127.0.0.1:4010/v1
```

---

## ✨ Key Features

- ⚙️ **Automatic Zero-Config Setup**: Automatically synchronizes `~/.codex/config.toml` and system environment variables (`OPENAI_BASE_URL`, `ANTHROPIC_BASE_URL`, `KIRA_API_KEY`) so Codex and Claude Code work instantly without manual file edits.
- 🔌 **Dual Protocol Support**: Native OpenAI `/v1/chat/completions` and `/v1/responses` endpoints with automatic format conversion.
- ⚡ **Real-Time Streaming**: High-speed Server-Sent Events (SSE) streaming for real-time response rendering in coding assistants.
- 🔒 **Secure Local Key Storage**: API keys are saved locally in `~/.kiraairoute/config.json`. Keys are never transmitted anywhere except directly to official Kira AI endpoints (`https://kiraai.vn/api/v1`).
- 🔄 **Automatic Port Fallback**: If port `4010` is occupied, the gateway automatically finds and binds to the next available port (`4011`, `4012`, etc.) and routes the web dashboard & Codex config.
- 📊 **Developer Web Dashboard & Metrics**: Built-in visual dashboard featuring one-click Codex/Claude launchers, password visibility toggle, model inspector, and real-time request metrics.
- 🌐 **Environment Variable Overrides**: Support for `KIRA_API_KEY`, `KIRA_MODEL`, and `KIRAAIROUTE_PORT` for headless CI/CD and container workflows.

---

## 📦 Installation Options

### Option 1: Instant Launch (Zero Installation)

```bash
npx @vibhav1207/kiraairoute
```

### Option 2: Global CLI Installation

```bash
npm install -g @vibhav1207/kiraairoute

# Launch gateway anytime
kiraairoute
```

### Option 3: Clone & Run from Source

```bash
# 1. Clone repository
git clone https://github.com/Vibhav1207/kiraairoute.git
cd kiraairoute

# 2. Install dependencies
npm install

# 3. Build TypeScript to dist/
npm run build

# 4. Start local gateway server
npm start
```

---

## 🤖 Supported Models

Kira AI provides generous daily token allowances for the following supported models:

| Model Name | Model ID | Provider | Balance Required | Daily Token Allowance | Context Window |
|---|---|---|---|---|---|
| **Kira Mini 1.0** | `kira-mini-1.0` | Kira | ❌ None | 150M tokens/day | 1,000,000 |
| **Kira Mini 2.0** | `kira-2.0` | Kira | ❌ None | 150M tokens/day | 1,000,000 |
| **Mimo V2.5** | `mimo-v2.5` | Xiaomi | ❌ None | 150M tokens/day | 128,000 |
| **Tencent Hy3 Free** | `hy3` | Tencent | ❌ None | 150M tokens/day | 128,000 |
| **DeepSeek V4 Flash** | `deepseek-v4-flash-free` | DeepSeek | ⚠️ > 0 VND | 250M tokens/day | 1,000,000 |
| **DeepSeek V4 Vision** | `deepseek-v4-flash-vision-exp` | DeepSeek | ⚠️ > 0 VND | 250M tokens/day | 128,000 |
| **Qwen 3.8 Flash** | `qwen3.8-flash` | Qwen | ⚠️ > 0 VND | 250M tokens/day | 128,000 |
| **GLM 5.3 Flash** | `glm-5.3-flash` | GLM | ⚠️ > 0 VND | 250M tokens/day | 128,000 |
| **GLM 5.3** | `glm-5.3` | GLM | ⚠️ > 0 VND | 250M tokens/day | 1,000,000 |

---

## 💻 Connecting Codex, Claude Code, Cursor & AI Tools

KiraAI Route **automatically configures Codex and Claude Code** upon startup and model selection. You can also connect any custom OpenAI or Anthropic tool manually:

- **Base URL**: `http://127.0.0.1:4010/v1`
- **API Key**: Your Kira API Key (or any placeholder string if configured in Web UI)
- **Model**: Any model ID listed above (e.g. `kira-mini-1.0`)

### 1. Codex (Automatic)

When you click **Test & Start Gateway** in the dashboard, your `~/.codex/config.toml` is automatically configured:

```toml
model = "kira-mini-1.0"
model_provider = "kira"

[model_providers.kira]
name = "Kira AI"
base_url = "http://127.0.0.1:4010/v1"
env_key = "KIRA_API_KEY"
wire_api = "responses"
```

You can click **Launch Codex** in the dashboard or run `codex` directly from your terminal.

### 2. Claude Code (Automatic)

When you click **Test & Start Gateway**, system environment variables `ANTHROPIC_BASE_URL` and `ANTHROPIC_API_KEY` are automatically registered:

```bash
# Launch Claude Code directly
claude
```

Or click **⚡ Launch Claude Code** directly from the web dashboard.

### 3. OpenAI Node.js SDK Example

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://127.0.0.1:4010/v1",
  apiKey: "KIRA_API_KEY"
});

const completion = await client.chat.completions.create({
  model: "kira-mini-1.0",
  messages: [{ role: "user", content: "Write a high-performance HTTP server in Node.js TypeScript." }]
});

console.log(completion.choices[0].message.content);
```

### 4. OpenAI Python SDK Example

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:4010/v1",
    api_key="KIRA_API_KEY"
)

response = client.chat.completions.create(
    model="kira-mini-1.0",
    messages=[{"role": "user", "content": "Explain async/await in Python."}]
)

print(response.choices[0].message.content)
```

---

## 📡 API Reference

### 1. List Models (`GET /v1/models`)

```bash
curl http://127.0.0.1:4010/v1/models
```

### 2. Chat Completions (`POST /v1/chat/completions`)

```bash
curl http://127.0.0.1:4010/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kira-mini-1.0",
    "messages": [
      { "role": "user", "content": "Write a clean TypeScript utility function." }
    ]
  }'
```

### 3. Responses API (`POST /v1/responses`)

```bash
curl http://127.0.0.1:4010/v1/responses \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kira-mini-1.0",
    "input": "Summarize microservices communication patterns."
  }'
```

---

## 🛠️ Local Development & Architecture

```bash
# Clone repository
git clone https://github.com/Vibhav1207/kiraairoute.git
cd kiraairoute

# Install dependencies
npm install

# Build TypeScript to dist/
npm run build

# Start gateway server
npm start
```

### Modular Directory Layout

```text
kiraairoute/
├── docs/
│   └── images/           # Visual documentation screenshots
├── src/
│   ├── cli/
│   │   ├── cli.ts        # Main CLI executable script
│   │   ├── codex.ts      # Zero-config setup for Codex config.toml & env vars
│   │   ├── config.ts     # Configuration loading & file persistence
│   │   └── ui.ts         # Terminal banner & browser launcher
│   ├── server/
│   │   ├── server.ts     # Fastify application factory & port binding
│   │   ├── routes.ts     # API & Web setup route definitions
│   │   ├── ui.ts         # Web dashboard HTML/CSS/JS template
│   │   ├── metrics.ts    # Real-time request metrics tracking
│   │   └── middleware.ts # Fastify CORS middleware registration
│   ├── kira/
│   │   ├── client.ts     # Kira API HTTP client (chat, stream, test)
│   │   └── models.ts     # Model definitions registry & lookup functions
│   ├── protocols/
│   │   ├── responses.ts  # Responses API format converter & SSE generator
│   │   └── chat.ts       # Chat Completions protocol interfaces
│   ├── config/
│   │   └── constants.ts  # Shared application default constants
│   └── index.ts          # Main package export entry point
├── dist/                 # Compiled ES module JavaScript output
├── README.md
├── package.json
├── tsconfig.json
└── LICENSE               # MIT License
```

---

## 🔒 Security

- Never commit your Kira API key to public repositories.
- KiraAI Route saves your API key locally in `~/.kiraairoute/config.json`.
- Keys are never transmitted anywhere except directly to official Kira AI endpoints (`https://kiraai.vn/api/v1`).

---

## 📄 License

Distributed under the open-source **[MIT License](LICENSE)**.