<div align="center">

# 🚀 KiraAI Route

**High-performance, zero-latency OpenAI-compatible local AI gateway routing Kira AI models for Codex, Claude Code, and developer tools.**

[![npm version](https://img.shields.io/npm/v/kiraairoute.svg?style=for-the-badge&color=6366f1)](https://www.npmjs.com/package/kiraairoute)
[![License](https://img.shields.io/badge/license-MIT-6366f1.svg?style=for-the-badge)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Build Status](https://img.shields.io/badge/build-passing-10b981.svg?style=for-the-badge)](https://github.com/Vibhav1207/kiraairoute)

[Quick Start](#-quick-start) • [Installation](#-installation-options) • [Supported Models](#-supported-models) • [API Guide](#-api-endpoints) • [Local Development](#-local-development)

</div>

---

## ⚡ Quick Start

Run instantly without installing:

```bash
npx kiraairoute
```

On first launch, **KiraAI Route** opens a sleek local setup dashboard at **`http://127.0.0.1:4010`**, prompts for your Kira API key, and persists it locally.

Your OpenAI-compatible endpoint will be available at:

```text
http://127.0.0.1:4010/v1
```

---

## ✨ Features

- ⚡ **OpenAI Compatible**: Native drop-in support for `/v1/chat/completions` and `/v1/responses`.
- 🔒 **Local & Secure Key Storage**: API keys are saved safely at `~/.kiraairoute/config.json`. Never sent anywhere except official Kira API endpoints.
- 🌐 **Interactive Setup Dashboard**: Sleek web interface for configuration, model switching, and connection diagnostics.
- 🌊 **Real-Time Streaming**: High-speed Server-Sent Events (SSE) streaming for real-time response token rendering.
- 🤖 **Designed for Codex & AI CLI Tools**: Works seamlessly with Codex, Claude Code, Cursor, and custom LLM workflows.
- 📦 **Flexible Deployment**: Works as an `npx` one-liner, a global CLI binary, or a TypeScript/Node.js library module.

---

## 📦 Installation Options

### Option 1: Global CLI Installation

Install globally to run `kiraairoute` from anywhere:

```bash
npm install -g kiraairoute
kiraairoute
```

### Option 2: NPM Package / TypeScript Module

Install as a dependency in your Node.js or TypeScript project:

```bash
npm install kiraairoute
```

#### Programmatic Usage in Code:

```typescript
import { startServer, getModels, kiraChat } from "kiraairoute";

// Programmatically launch local proxy server
const app = await startServer(4010);

// List available Kira models
const models = getModels();
console.log("Available models:", models);

// Direct API execution
const result = await kiraChat({
  model: "kira-mini-1.0",
  messages: [{ role: "user", content: "Hello from KiraAI Route SDK!" }]
});

console.log(result.data);
```

---

## 🤖 Supported Models

Kira provides generous daily token allowances for selected free and balance models:

| Model Name | Model ID | Provider | Balance Req. | Daily Allowance | Context Window |
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

## 📡 API Endpoints

### 1. List Models

```bash
curl http://127.0.0.1:4010/v1/models
```

### 2. Chat Completions (`/v1/chat/completions`)

```bash
curl http://127.0.0.1:4010/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KIRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kira-mini-1.0",
    "messages": [
      { "role": "user", "content": "Write a fast Fibonacci function in TypeScript." }
    ]
  }'
```

### 3. Responses API (`/v1/responses`)

```bash
curl http://127.0.0.1:4010/v1/responses \
  -H "Authorization: Bearer YOUR_KIRA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kira-mini-1.0",
    "input": "Explain quantum computing in simple terms."
  }'
```

---

## 💻 Codex & Client Integration

Configure your OpenAI-compatible developer tools to connect via KiraAI Route:

- **API Base URL**: `http://127.0.0.1:4010/v1`
- **API Key**: `YOUR_KIRA_API_KEY` (or any string if already configured in Web setup)
- **Model**: `kira-mini-1.0` (or any supported model ID)

Example with official OpenAI Node.js SDK:

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "http://127.0.0.1:4010/v1",
  apiKey: "KIRA_API_KEY"
});

const completion = await openai.chat.completions.create({
  model: "kira-mini-1.0",
  messages: [{ role: "user", content: "Hello!" }]
});

console.log(completion.choices[0].message.content);
```

---

## 🛠️ Local Development

Clone the repository and set up your local development environment:

```bash
# Clone repository
git clone https://github.com/Vibhav1207/kiraairoute.git
cd kiraairoute

# Install dependencies
npm install

# Build TypeScript to dist/
npm run build

# Start production build
npm start

# Run live development mode with tsx
npm run dev
```

---

## 📂 Project Architecture

```text
kiraairoute/
├── src/
│   ├── cli/
│   │   ├── cli.ts        # CLI entry point script
│   │   ├── config.ts     # Config persistence & environment loading
│   │   └── ui.ts         # Terminal banner & browser launch helper
│   ├── server/
│   │   ├── server.ts     # Fastify app factory & lifecycle manager
│   │   ├── routes.ts     # Fastify API & Web setup route definitions
│   │   └── middleware.ts # Fastify CORS middleware registration
│   ├── kira/
│   │   ├── client.ts     # Kira API HTTP client (chat, stream, test)
│   │   └── models.ts     # Model definitions registry & lookup functions
│   ├── protocols/
│   │   ├── responses.ts  # Responses API conversion & SSE event formatter
│   │   └── chat.ts       # Chat Completions protocol interfaces
│   ├── config/
│   │   └── constants.ts  # Shared application default constants
│   └── index.ts          # Main package export module
├── dist/                 # Compiled JavaScript output
├── README.md
├── package.json
├── tsconfig.json
└── LICENSE               # MIT License
```

---

## 🔒 Security

- Never commit your Kira API key to public repositories.
- Keep your API key in environment variables (`KIRA_API_KEY`) or in the local config file `~/.kiraairoute/config.json`.

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).