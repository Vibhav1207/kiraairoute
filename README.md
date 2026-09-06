<div align="center">

# 🚀 KiraAI Route

**High-performance, zero-latency OpenAI-compatible local AI gateway and LLM proxy for Kira AI.**

*Route Kira AI models to OpenAI-compatible coding tools like Codex, Cursor, Continue, and custom developer scripts.*

[![npm version](https://img.shields.io/badge/npm-v0.5.1-6366f1.svg?style=for-the-badge&logo=npm&logoColor=white)](https://github.com/Vibhav1207/kiraairoute/packages)
[![License](https://img.shields.io/badge/license-MIT-6366f1.svg?style=for-the-badge)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Build Status](https://img.shields.io/badge/build-passing-10b981.svg?style=for-the-badge)](https://github.com/Vibhav1207/kiraairoute)

[Overview](#-overview) • [Quick Start](#-quick-start) • [Installation](#-installation-options) • [Key Features](#-key-features) • [Supported Models](#-supported-models) • [API Reference](#-api-reference) • [Client Configuration](#-connecting-codex-cursor--ai-tools)

</div>

---

## 📌 Overview

**KiraAI Route** is a lightweight local AI gateway and API proxy that translates standard OpenAI API requests into native calls for the **Kira AI** platform (`https://kiraai.vn`).

By running a local proxy server on `http://127.0.0.1:4010/v1`, KiraAI Route enables any OpenAI-compatible tool—including **Codex**, **Cursor**, **Continue**, and the official **OpenAI SDK**—to seamlessly tap into generous daily free token allowances for top models like `kira-mini-1.0`, `mimo-v2.5`, `deepseek-v4-flash-free`, `deepseek-v4-flash-vision-exp`, `qwen3.8-flash`, `glm-5.3-flash`, and `gpt-5.6-luna-free`.

---

## ⚡ Quick Start

Run instantly without global installation:

```bash
npx @vibhav1207/kiraairoute
```

On launch, KiraAI Route opens the **shadcn-inspired developer dashboard** at **`http://127.0.0.1:4010`**:

1. Enter your **Kira API Key** (obtainable from [kiraai.vn/developer](https://kiraai.vn/developer/)).
2. Select your target model (e.g. `Kira Mini 1.0`, `DeepSeek V4 Flash`, or `Qwen 3.8 Flash`).
3. Click **Configure Gateway & AI Models**.

Your local OpenAI-compatible endpoint is instantly active at:

```text
http://127.0.0.1:4010/v1
```

---

## ✨ Key Features

- 🔑 **Persistent API Key & Auto-Start**: Saved API keys are stored securely in browser `localStorage` after validation. Next time you launch, the gateway automatically loads your key, initializes your selected model, and starts without requiring re-entry.
- ⚙️ **Automatic Zero-Config Setup**: Automatically syncs `~/.codex/config.toml` and local environment variables (`OPENAI_BASE_URL`, `OPENAI_API_KEY`) for zero-friction integration with Codex CLI and apps.
- 📡 **Real-Time Dynamic Health & Ping Monitor**: Features a live latency ping meter (measuring browser-to-gateway roundtrip in real time every 3.5s) with live equalizer animations and route health signals (**Optimal**, **Degraded**, **Offline**).
- 🔌 **Dual Protocol Support**: Native support for OpenAI `/v1/chat/completions` and `/v1/responses` endpoints with SSE (Server-Sent Events) streaming.
- 🎨 **shadcn Dark Zinc UI Aesthetic**: Clean, modern dark mode interface (`#09090b` / `#18181b` / `#27272a`) built with clean typography, crisp borders, ambient background glow, SVG icons, and zero emojis.
- 🔒 **Privacy & Local Security**: API keys are saved locally. Keys are only transmitted directly to official Kira AI upstream servers (`https://kiraai.vn/api/v1`).
- 🔄 **Automatic Port Fallback**: Auto-binds to the next available port (`4010`, `4011`, `4012`, etc.) if port 4010 is occupied.

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

### 🆓 Free Models

| Model Name | Model ID | Provider | Balance Requirement | Daily Allowance | Context Window | Best Used For |
|---|---|---|---|---|---|---|
| **Kira Auto** | `kira-auto` | Kira AI | Free (0 Deposit) | 150M tokens/day | 1,000,000 | Smart Auto Routing / Speed |
| **Kira Mini 2.0** | `kira-2.0` | Kira AI | Free (0 Deposit) | 150M tokens/day | 1,000,000 | Fast Text & High-Speed Coding |
| **Kira Mini 1.0** | `kira-mini-1.0` | Kira AI | Free (0 Deposit) | 150M tokens/day | 1,000,000 | General Text & Daily Coding |
| **Mimo V2.5** | `mimo-v2.5` | Xiaomi | Free (0 Deposit) | 150M tokens/day | 128,000 | Logic, Math & Reasoning |
| **Tencent Hy3 Free** | `hy3` | Tencent | Free (0 Deposit) | 150M tokens/day | 128,000 | Autonomous AI Agents & Code |
| **DeepSeek V4 Flash Free** | `deepseek-v4-flash-free` | DeepSeek | Free (Balance > 0 VND) | 250M tokens/day | 1,000,000 | High-Speed Code & Large Context |
| **Qwen 3.8 Flash** | `qwen3.8-flash` | Qwen | Free (Balance > 0 VND) | 250M tokens/day | 128,000 | Software Engineering |
| **Qwen 3.8 27B Free** | `qwen3.8-27b-free` | Qwen | Free (Balance > 0 VND) | 250M tokens/day | 128,000 | General Text & Coding |
| **GLM 5.3 Flash** | `glm-5.3-flash` | GLM / Z.AI | Free (Balance > 0 VND) | 250M tokens/day | 128,000 | High-Performance Multimodal |
| **Ling 3.0 Flash Sante** | `ling-3.0-flash-sante-free` | InclusionAI | Free (Balance > 0 VND) | 250M tokens/day | 128,000 | Medical & Bio-Health AI |
| **MiniMax M3 Free** | `minimax-m3-free` | MiniMax | Free (Balance > 0 VND) | 250M tokens/day | 128,000 | Multi-Agent & Audio Synthesis |
| **GPT 5.6 Luna Free** | `gpt-5.6-luna-free` | OpenAI Compatible | Free (Balance > 0 VND) | 250M tokens/day | 1,000,000 | Creative Writing & Structural Analysis |
| **Claude Fable 5.1 Free** | `claude-fable-5.1-free` | Anthropic | Free (Balance > 0 VND) | 250M tokens/day | 128,000 | General Reasoning & Logic |
| **GPT-6 Astra Free** | `gpt-6-astra-free` | OpenAI | Free (Balance > 0 VND) | 250M tokens/day | 1,000,000 | Next-Gen Reasoning & Code |

### 💳 Paid Models (Consumes Balance / Pay-Per-Token)

| Model Name | Model ID | Provider | Input Price / 1M | Output Price / 1M | Context Window | Description |
|---|---|---|---|---|---|---|
| **GLM 5.3** | `glm-5.3` | GLM / Z.AI | $0.37 | $1.33 | 128,000 | Advanced bilingual LLM from Z.AI |
| **Ox Alpha (GLM-5.3-Flash)** | `ox-alpha` | GLM / Z.AI | $0.09 | $0.30 | 128,000 | Multimodal high-performance flash model |
| **DeepSeek V4 Flash** | `deepseek-v4-flash` | DeepSeek | $0.02 | $0.06 | 1,000,000 | Ultra-fast 284B parameter coding model |
| **DeepSeek V4 Flash 0731** | `deepseek-v4-flash-0731` | DeepSeek | $0.02 | $0.06 | 1,000,000 | High throughput 284B parameter build |
| **DeepSeek V4 Pro** | `deepseek-v4-pro` | DeepSeek | $0.45 | $1.36 | 1,000,000 | Flagship 284B reasoning & engineering |
| **DeepSeek V4 Vision Exp** | `deepseek-v4-flash-vision-exp` | DeepSeek | $0.18 | $0.52 | 128,000 | Experimental multimodal vision model |
| **GPT OSS 120B** | `gpt-oss-120b` | OpenAI | $0.19 | $0.38 | 128,000 | 120B parameter open-source model |
| **GLM 5.2** | `glm-5.2` | GLM / Z.AI | $0.98 | $3.60 | 128,000 | Advanced bilingual language model |
| **MiniMax M3** | `minimax-m3` | MiniMax | $0.28 | $1.08 | 128,000 | Multi-agent model with voice synthesis |
| **Grok 4.6** | `grok-4.6` | xAI | $1.54 | $4.62 | 128,000 | Top-tier multimodal model for STEM & code |
| **Grok 4.5** | `grok-4.5` | xAI | $1.54 | $4.62 | 128,000 | Multimodal model optimized for fast execution |
| **Dots 3 Note Preview** | `dots-3-note-preview` | Dots AI | $0.31 | $1.20 | 128,000 | Open-source large language model |
| **Qwen 3.6 Flash** | `qwen3.6-flash` | Qwen / Alibaba | $0.22 | $0.85 | 128,000 | Open-source flagship coding model |
| **Qwen 3.5 Omni Plus** | `qwen3.5-omni-plus` | Qwen / Alibaba | $0.85 | $5.38 | 128,000 | Multimodal omni vision & text processing |
| **Qwen 3.7 Plus** | `qwen3.7-plus` | Qwen / Alibaba | $0.35 | $1.54 | 128,000 | Balanced reasoning & logical comprehension |
| **Qwen 3.7 Max** | `qwen3.7-max` | Qwen / Alibaba | $1.19 | $3.46 | 128,000 | Deep reasoning & software architecture |
| **Mimo V2.5 Pro** | `mimo-v2.5-pro` | Xiaomi | $0.85 | $2.65 | 128,000 | Xiaomi flagship reasoning & logic |
| **Gemini 3.8 Flash** | `gemini-3.8-flash` | Gemini / Google | $0.66 | $3.39 | 1,000,000 | Next-gen flash model for coding workflows |
| **Gemini 3.7 Flash** | `gemini-3.7-flash` | Gemini / Google | $0.66 | $3.39 | 1,000,000 | Next-gen flash model for coding & reasoning |
| **Gemini 3.6 Flash** | `gemini-3.6-flash` | Gemini / Google | $1.21 | $6.92 | 1,000,000 | High-speed flash coding model |
| **Gemini 3.5 Flash** | `gemini-3.5-flash` | Gemini / Google | $1.21 | $6.92 | 1,000,000 | Flash architecture for rapid completions |
| **Gemini 3.5 Flash Lite** | `gemini-3.5-flash-lite` | Gemini / Google | $0.28 | $1.73 | 128,000 | Ultra-light compact fast model |
| **Nano Banana Pro** | `gemini-3-pro-image-preview` | Gemini / Google | $0.76/img | Image | 128,000 | High-fidelity AI image generation |
| **Nano Banana 2** | `gemini-3.1-flash-image-preview` | Gemini / Google | $0.42/img | Image | 128,000 | Fast AI image generation |
| **Nano Banana** | `gemini-2.5-flash-image` | Gemini / Google | $2.42/img | Image | 128,000 | Google AI image generation model |
| **Gemini 3.1 Flash TTS** | `gemini-3.1-flash-tts-preview` | Gemini / Google | $0.87 | $18.17 | 128,000 | High-fidelity Text-to-Speech voice synthesis |
| **Gemini 2.5 Flash TTS** | `gemini-2.5-flash-tts` | Gemini / Google | $0.26 | $2.18 | 128,000 | Voice audio text-to-speech engine |
| **Gemini 2.5 Flash Lite** | `gemini-2.5-flash-lite` | Gemini / Google | $0.07 | $0.37 | 128,000 | Ultra-fast lightweight model |
| **Kimi K3** | `kimi-k3` | Moonshot AI | $2.60 | $10.38 | 128,000 | 2.8 Trillion parameter MoE open-source model |
| **GPT 5.6 Luna** | `gpt-5.6-luna` | OpenAI | $0.17 | $0.34 | 1,000,000 | High-speed general text model |
| **GPT 5.6 Terra** | `gpt-5.6-terra` | OpenAI | $1.94 | $11.69 | 1,000,000 | Balanced performance in GPT-5.6 family |
| **GPT 5.6 Sol** | `gpt-5.6-sol` | OpenAI | $2.91 | $17.45 | 1,000,000 | Top flagship model in GPT-5.6 family |
| **GPT 5.4** | `gpt-5.4` | OpenAI | $1.50 | $9.00 | 1,000,000 | Breakthrough multimodal logic & reasoning |
| **GPT 5.4 mini** | `gpt-5.4-mini` | OpenAI | $0.37 | $2.25 | 1,000,000 | Compact high-speed logic model |
| **GPT 4o Mini** | `gpt-4o-mini` | OpenAI / Kira | $0.14 | $0.87 | 128,000 | Fast OpenAI model for daily software tasks |
| **Tencent Hy4 Preview** | `hy4` | Tencent | $0.85 | $2.54 | 128,000 | 770B MoE architecture model |
| **Qwen 3.5 Flash** | `qwen3.5-flash` | Qwen / Alibaba | $0.22 | $0.38 | 128,000 | High-speed multimodal coding model |
| **Claude Sonnet 5** | `claude-sonnet-5` | Anthropic | $1.73 | $9.00 | 200,000 | Flagship reasoning & code synthesis |
| **Qwen 3.8 Max** | `qwen3.8-max` | Qwen / Alibaba | $1.92 | $5.77 | 128,000 | High-capacity deep reasoning model |

---

## 💻 Connecting Codex, Cursor, Continue & AI Tools

Configure any OpenAI client to point to your local gateway endpoint:

- **Base URL**: `http://127.0.0.1:4010/v1`
- **API Key**: Your Kira API Key
- **Model**: Any supported model ID (e.g. `kira-mini-1.0` or `deepseek-v4-flash-free`)

### 1. Codex CLI Integration

When you click **Configure Gateway & AI Models**, your `~/.codex/config.toml` is automatically configured:

```toml
model = "kira-mini-1.0"
model_provider = "kira"

[model_providers.kira]
name = "Kira AI"
base_url = "http://127.0.0.1:4010/v1"
env_key = "KIRA_API_KEY"
wire_api = "responses"
```

### 2. OpenAI Node.js SDK Example

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://127.0.0.1:4010/v1",
  apiKey: "YOUR_KIRA_API_KEY"
});

const completion = await client.chat.completions.create({
  model: "kira-mini-1.0",
  messages: [{ role: "user", content: "Write a Fastify REST API endpoint in TypeScript." }]
});

console.log(completion.choices[0].message.content);
```

### 3. OpenAI Python SDK Example

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:4010/v1",
    api_key="YOUR_KIRA_API_KEY"
)

response = client.chat.completions.create(
    model="deepseek-v4-flash-free",
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

# Start local gateway server
npm start
```

### Directory Structure

```text
kiraairoute/
├── docs/
│   └── images/           # Documentation images and screenshots
├── src/
│   ├── cli/
│   │   ├── cli.ts        # Main CLI executable script
│   │   ├── codex.ts      # Zero-config setup for Codex config.toml & env vars
│   │   ├── config.ts     # Configuration loading & file persistence
│   │   └── ui.ts         # Terminal banner & browser launcher
│   ├── server/
│   │   ├── server.ts     # Fastify application factory & port binding
│   │   ├── routes.ts     # API & Web setup route definitions
│   │   ├── ui.ts         # Web dashboard HTML/CSS/JS template (shadcn dark UI)
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
├── dist/                 # Compiled JavaScript output
├── README.md
├── package.json
├── tsconfig.json
└── LICENSE               # MIT License
```

---

## 🔒 Security

- Never commit your Kira API key to public repositories.
- KiraAI Route saves your API key locally in browser `localStorage` and `~/.kiraairoute/config.json`.
- Keys are never transmitted anywhere except directly to official Kira AI endpoints (`https://kiraai.vn/api/v1`).

---

## 📄 License

Distributed under the open-source **[MIT License](LICENSE)**.