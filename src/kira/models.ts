import { KIRA_BASE_URL } from "../config/constants.js";

export interface ModelDefinition {
  id: string;
  name: string;
  provider: string;
  category: "free_no_deposit" | "free_balance_required" | "paid";
  categoryLabel: string;
  type: "auto" | "text" | "code" | "vision" | "medical" | "voice" | "reasoning";
  typeLabel: string;
  free: boolean;
  balance_required: boolean;
  daily_limit: string;
  context_window: number;
  description: string;
  input_price?: string;
  output_price?: string;
}

export const KIRA_MODELS: readonly ModelDefinition[] = [
  // --- FREE MODELS (0 VND Deposit Required) ---
  {
    id: "kira-auto",
    name: "Kira Auto",
    provider: "Kira AI",
    category: "free_no_deposit",
    categoryLabel: "Free (0 Deposit Required)",
    type: "auto",
    typeLabel: "Auto Routing / Smart Text",
    free: true,
    balance_required: false,
    daily_limit: "150M tokens/day",
    context_window: 1_000_000,
    description: "Automatically routes requests across top models for optimal speed and uptime."
  },
  {
    id: "kira-2.0",
    name: "Kira Mini 2.0",
    provider: "Kira AI",
    category: "free_no_deposit",
    categoryLabel: "Free (0 Deposit Required)",
    type: "text",
    typeLabel: "Fast Text & Code",
    free: true,
    balance_required: false,
    daily_limit: "150M tokens/day",
    context_window: 1_000_000,
    description: "120B parameter open-source model optimized for high-speed response, general text, and software development."
  },
  {
    id: "kira-mini-1.0",
    name: "Kira Mini 1.0",
    provider: "Kira AI",
    category: "free_no_deposit",
    categoryLabel: "Free (0 Deposit Required)",
    type: "text",
    typeLabel: "General Text & Code",
    free: true,
    balance_required: false,
    daily_limit: "150M tokens/day",
    context_window: 1_000_000,
    description: "Powered by DeepSeek V4 Flash architecture, versatile model ideal for daily coding tasks and general prompts."
  },
  {
    id: "mimo-v2.5",
    name: "Mimo V2.5",
    provider: "Xiaomi",
    category: "free_no_deposit",
    categoryLabel: "Free (0 Deposit Required)",
    type: "reasoning",
    typeLabel: "Reasoning & Logic",
    free: true,
    balance_required: false,
    daily_limit: "150M tokens/day",
    context_window: 128_000,
    description: "Xiaomi near-flagship cost-optimized model focused on complex logical reasoning, math, and problem solving."
  },
  {
    id: "hy3",
    name: "Tencent Hy3 Free",
    provider: "Tencent",
    category: "free_no_deposit",
    categoryLabel: "Free (0 Deposit Required)",
    type: "code",
    typeLabel: "Agent & Coding",
    free: true,
    balance_required: false,
    daily_limit: "150M tokens/day",
    context_window: 128_000,
    description: "Tencent commercial-grade model engineered for autonomous AI agents, complex coding, and code generation."
  },

  // --- FREE MODELS (Requires Balance > 0 VND - Not Deducted) ---
  {
    id: "deepseek-v4-flash-free",
    name: "DeepSeek V4 Flash Free",
    provider: "DeepSeek",
    category: "free_balance_required",
    categoryLabel: "Free (Requires Balance > 0 VND)",
    type: "code",
    typeLabel: "High-Speed Code & Text",
    free: true,
    balance_required: true,
    daily_limit: "250M tokens/day",
    context_window: 1_000_000,
    description: "Lightweight, high-speed 284B parameter model from DeepSeek V4 family specialized in programming."
  },
  {
    id: "qwen3.8-flash",
    name: "Qwen 3.8 Flash",
    provider: "Qwen",
    category: "free_balance_required",
    categoryLabel: "Free (Requires Balance > 0 VND)",
    type: "code",
    typeLabel: "Coding & Multimodal",
    free: true,
    balance_required: true,
    daily_limit: "250M tokens/day",
    context_window: 128_000,
    description: "Ultra-fast multimodal model from Alibaba, tuned specifically for software engineering and refactoring."
  },
  {
    id: "qwen3.8-27b-free",
    name: "Qwen 3.8 27B Free",
    provider: "Qwen",
    category: "free_balance_required",
    categoryLabel: "Free (Requires Balance > 0 VND)",
    type: "text",
    typeLabel: "General Text & Code",
    free: true,
    balance_required: true,
    daily_limit: "250M tokens/day",
    context_window: 128_000,
    description: "27B parameter model providing balanced performance across conversations and software tasks."
  },
  {
    id: "glm-5.3-flash",
    name: "GLM 5.3 Flash",
    provider: "GLM / Z.AI",
    category: "free_balance_required",
    categoryLabel: "Free (Requires Balance > 0 VND)",
    type: "code",
    typeLabel: "High-Perf Code & Multimodal",
    free: true,
    balance_required: true,
    daily_limit: "250M tokens/day",
    context_window: 128_000,
    description: "High-performance multimodal model from Z.AI supporting fast execution and code generation."
  },
  {
    id: "ling-3.0-flash-sante-free",
    name: "Ling 3.0 Flash Sante",
    provider: "InclusionAI",
    category: "free_balance_required",
    categoryLabel: "Free (Requires Balance > 0 VND)",
    type: "medical",
    typeLabel: "Medical & Health AI",
    free: true,
    balance_required: true,
    daily_limit: "250M tokens/day",
    context_window: 128_000,
    description: "InclusionAI specialized language model tailored for healthcare and bio-health queries."
  },
  {
    id: "minimax-m3-free",
    name: "MiniMax M3 Free",
    provider: "MiniMax",
    category: "free_balance_required",
    categoryLabel: "Free (Requires Balance > 0 VND)",
    type: "voice",
    typeLabel: "Multi-Agent & Audio/Voice",
    free: true,
    balance_required: true,
    daily_limit: "250M tokens/day",
    context_window: 128_000,
    description: "Breakthrough multi-agent AI model with real-time speech processing and voice synthesis."
  },
  {
    id: "gpt-5.6-luna-free",
    name: "GPT 5.6 Luna Free",
    provider: "OpenAI Compatible",
    category: "free_balance_required",
    categoryLabel: "Free (Requires Balance > 0 VND)",
    type: "text",
    typeLabel: "General Text & Reasoning",
    free: true,
    balance_required: true,
    daily_limit: "250M tokens/day",
    context_window: 1_000_000,
    description: "High-capacity language model for creative writing, structural synthesis, and complex prompt instructions."
  },

  // --- PAID MODELS (Consumes Balance / Pay-Per-Token) ---
  {
    id: "glm-5.3",
    name: "GLM 5.3",
    provider: "GLM / Z.AI",
    category: "paid",
    categoryLabel: "Paid (Consumes Balance)",
    type: "text",
    typeLabel: "Bilingual LLM & Text",
    free: false,
    balance_required: true,
    daily_limit: "Pay-per-token",
    context_window: 128_000,
    description: "Advanced bilingual large language model from Z.AI with high-precision text understanding and generation.",
    input_price: "$0.37 / 1M tkn",
    output_price: "$1.33 / 1M tkn"
  },
  {
    id: "ox-alpha",
    name: "Ox Alpha (GLM-5.3-Flash)",
    provider: "GLM / Z.AI",
    category: "paid",
    categoryLabel: "Paid (Consumes Balance)",
    type: "code",
    typeLabel: "Multimodal & High-Perf Flash",
    free: false,
    balance_required: true,
    daily_limit: "Pay-per-token",
    context_window: 128_000,
    description: "GOx Alpha is GLM-5.3-Flash, a high-performance multimodal model from Z.AI for fast execution.",
    input_price: "$0.09 / 1M tkn",
    output_price: "$0.30 / 1M tkn"
  },
  {
    id: "deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    provider: "DeepSeek",
    category: "paid",
    categoryLabel: "Paid (Consumes Balance)",
    type: "code",
    typeLabel: "Ultra-Fast 284B Coding",
    free: false,
    balance_required: true,
    daily_limit: "Pay-per-token",
    context_window: 1_000_000,
    description: "Lightweight, ultra-fast 284B parameter model from DeepSeek V4 generation specialized in software engineering.",
    input_price: "$0.02 / 1M tkn",
    output_price: "$0.06 / 1M tkn"
  },
  {
    id: "deepseek-v4-flash-0731",
    name: "DeepSeek V4 Flash 0731",
    provider: "DeepSeek",
    category: "paid",
    categoryLabel: "Paid (Consumes Balance)",
    type: "code",
    typeLabel: "Ultra-Fast 284B Coding (0731)",
    free: false,
    balance_required: true,
    daily_limit: "Pay-per-token",
    context_window: 1_000_000,
    description: "DeepSeek V4 Flash 0731 build, ultra-fast 284B parameter model optimized for high throughput.",
    input_price: "$0.02 / 1M tkn",
    output_price: "$0.06 / 1M tkn"
  },
  {
    id: "deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    provider: "DeepSeek",
    category: "paid",
    categoryLabel: "Paid (Consumes Balance)",
    type: "code",
    typeLabel: "Flagship 284B Reasoning & Code",
    free: false,
    balance_required: true,
    daily_limit: "Pay-per-token",
    context_window: 1_000_000,
    description: "DeepSeek V4 Pro flagship 284B model for complex reasoning, architectural design, and deep coding.",
    input_price: "$0.45 / 1M tkn",
    output_price: "$1.36 / 1M tkn"
  },
  {
    id: "deepseek-v4-flash-vision-exp",
    name: "DeepSeek V4 Vision Exp",
    provider: "DeepSeek",
    category: "paid",
    categoryLabel: "Paid (Consumes Balance)",
    type: "vision",
    typeLabel: "Vision & Multimodal Image",
    free: false,
    balance_required: true,
    daily_limit: "Pay-per-token",
    context_window: 128_000,
    description: "Experimental multimodal vision model capable of parsing images, visual code screenshots, charts, and diagrams.",
    input_price: "$0.18 / 1M tkn",
    output_price: "$0.52 / 1M tkn"
  },
  {
    id: "gpt-oss-120b",
    name: "GPT OSS 120B",
    provider: "OpenAI",
    category: "paid",
    categoryLabel: "Paid (Consumes Balance)",
    type: "text",
    typeLabel: "120B Open Source Model",
    free: false,
    balance_required: true,
    daily_limit: "Pay-per-token",
    context_window: 128_000,
    description: "GPT-OSS-120B open-source 120B parameter model from OpenAI combining strong reasoning and structural coding.",
    input_price: "$0.19 / 1M tkn",
    output_price: "$0.38 / 1M tkn"
  },
  {
    id: "glm-5.2",
    name: "GLM 5.2",
    provider: "GLM / Z.AI",
    category: "paid",
    categoryLabel: "Paid (Consumes Balance)",
    type: "text",
    typeLabel: "Advanced Bilingual LLM",
    free: false,
    balance_required: true,
    daily_limit: "Pay-per-token",
    context_window: 128_000,
    description: "Advanced bilingual language model from GLM with strong comprehension and production capability.",
    input_price: "$0.98 / 1M tkn",
    output_price: "$3.60 / 1M tkn"
  },
  {
    id: "minimax-m3",
    name: "MiniMax M3",
    provider: "MiniMax",
    category: "paid",
    categoryLabel: "Paid (Consumes Balance)",
    type: "voice",
    typeLabel: "Multi-Agent & Audio/Voice",
    free: false,
    balance_required: true,
    daily_limit: "Pay-per-token",
    context_window: 128_000,
    description: "Breakthrough multi-agent AI model with real-time speech processing and voice audio synthesis.",
    input_price: "$0.28 / 1M tkn",
    output_price: "$1.08 / 1M tkn"
  },
  {
    id: "grok-4.6",
    name: "Grok 4.6",
    provider: "xAI",
    category: "paid",
    categoryLabel: "Paid (Consumes Balance)",
    type: "reasoning",
    typeLabel: "Multimodal Coding & STEM",
    free: false,
    balance_required: true,
    daily_limit: "Pay-per-token",
    context_window: 128_000,
    description: "Top-tier multimodal model from xAI leading in programming, STEM reasoning, and complex logic.",
    input_price: "$1.54 / 1M tkn",
    output_price: "$4.62 / 1M tkn"
  },
  {
    id: "grok-4.5",
    name: "Grok 4.5",
    provider: "xAI",
    category: "paid",
    categoryLabel: "Paid (Consumes Balance)",
    type: "reasoning",
    typeLabel: "Multimodal Coding & STEM",
    free: false,
    balance_required: true,
    daily_limit: "Pay-per-token",
    context_window: 128_000,
    description: "Flagship multimodal model from xAI optimized for coding, STEM, and fast execution.",
    input_price: "$1.54 / 1M tkn",
    output_price: "$4.62 / 1M tkn"
  },
  {
    id: "dots-3-note-preview",
    name: "Dots 3 Note Preview",
    provider: "Dots AI",
    category: "paid",
    categoryLabel: "Paid (Consumes Balance)",
    type: "text",
    typeLabel: "Open-Source LLM",
    free: false,
    balance_required: true,
    daily_limit: "Pay-per-token",
    context_window: 128_000,
    description: "First open-source large language model from Dots AI lab for general text and reasoning.",
    input_price: "$0.31 / 1M tkn",
    output_price: "$1.20 / 1M tkn"
  },
  {
    id: "qwen3.5-flash",
    name: "Qwen 3.5 Flash",
    provider: "Qwen / Alibaba",
    category: "paid",
    categoryLabel: "Paid (Consumes Balance)",
    type: "code",
    typeLabel: "High-Speed Multimodal Coding",
    free: false,
    balance_required: true,
    daily_limit: "Pay-per-token",
    context_window: 128_000,
    description: "Next-generation ultra-fast multimodal model from Alibaba optimized for high-speed response.",
    input_price: "$0.22 / 1M tkn",
    output_price: "$0.38 / 1M tkn"
  },
  {
    id: "claude-sonnet-5",
    name: "Claude Sonnet 5",
    provider: "Anthropic",
    category: "paid",
    categoryLabel: "Paid (Consumes Balance)",
    type: "code",
    typeLabel: "Flagship Reasoning & Coding",
    free: false,
    balance_required: true,
    daily_limit: "Pay-per-token",
    context_window: 200_000,
    description: "Next-generation top-tier AI model from Anthropic combining deep reasoning, synthesis, and coding.",
    input_price: "$1.73 / 1M tkn",
    output_price: "$9.00 / 1M tkn"
  },
  {
    id: "qwen3.8-max",
    name: "Qwen 3.8 Max",
    provider: "Qwen / Alibaba",
    category: "paid",
    categoryLabel: "Paid (Consumes Balance)",
    type: "reasoning",
    typeLabel: "High-Capacity Deep Reasoning",
    free: false,
    balance_required: true,
    daily_limit: "Pay-per-token",
    context_window: 128_000,
    description: "Premium large-scale model from Alibaba Qwen featuring deep reasoning and specialized software engineering.",
    input_price: "$1.92 / 1M tkn",
    output_price: "$5.77 / 1M tkn"
  }
] as const;

export function getModels(): readonly ModelDefinition[] {
  return KIRA_MODELS;
}

export function getModel(modelId: string): ModelDefinition | undefined {
  const models = getModels();
  return models.find((model) => model.id === modelId) || {
    id: modelId,
    name: modelId,
    provider: "Kira AI",
    category: "paid",
    categoryLabel: "Paid (Consumes Balance)",
    type: "text",
    typeLabel: "General Text & Code",
    free: false,
    balance_required: true,
    daily_limit: "Pay-per-token",
    context_window: 128_000,
    description: "Kira AI compatible model endpoint."
  };
}
