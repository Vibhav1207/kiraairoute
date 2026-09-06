import { KIRA_BASE_URL } from "../config/constants.js";

export interface ModelDefinition {
  id: string;
  name: string;
  provider: string;
  category: "free_no_deposit" | "free_balance_required";
  categoryLabel: string;
  type: "auto" | "text" | "code" | "vision" | "medical" | "voice" | "reasoning";
  typeLabel: string;
  free: boolean;
  balance_required: boolean;
  daily_limit: string;
  context_window: number;
  description: string;
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
    description: "Automatically routes requests across top models (glm-5.3, qwen3.8, deepseek) for optimal speed and uptime."
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
    description: "Lightweight, high-speed 284B parameter model from DeepSeek V4 family specialized in programming and technical writing."
  },
  {
    id: "deepseek-v4-flash-vision-exp",
    name: "DeepSeek V4 Vision Exp",
    provider: "DeepSeek",
    category: "free_balance_required",
    categoryLabel: "Free (Requires Balance > 0 VND)",
    type: "vision",
    typeLabel: "Vision & Multimodal Image",
    free: true,
    balance_required: true,
    daily_limit: "250M tokens/day",
    context_window: 128_000,
    description: "Experimental multimodal vision model capable of parsing images, visual code screenshots, charts, and diagrams."
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
    description: "Ultra-fast multimodal model from Alibaba, tuned specifically for software engineering, refactoring, and natural language."
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
    description: "27B parameter model provided for testing, providing balanced performance across conversations and software tasks."
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
    description: "High-performance multimodal model from Z.AI supporting fast execution, code generation, and language processing."
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
    description: "InclusionAI specialized language model tailored for healthcare, medical domain analysis, and bio-health queries."
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
    description: "Breakthrough multi-agent AI model with real-time speech processing, hyper-realistic voice audio synthesis, and reasoning."
  },
  {
    id: "minimax-m2.7",
    name: "MiniMax M2.7",
    provider: "MiniMax",
    category: "free_balance_required",
    categoryLabel: "Free (Requires Balance > 0 VND)",
    type: "voice",
    typeLabel: "Multi-Agent & Audio/Voice",
    free: true,
    balance_required: true,
    daily_limit: "250M tokens/day",
    context_window: 128_000,
    description: "High-speed multi-agent conversational engine supporting voice synthesis and long-context processing."
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
    category: "free_balance_required",
    categoryLabel: "Free (Requires Balance > 0 VND)",
    type: "text",
    typeLabel: "General Text & Code",
    free: true,
    balance_required: true,
    daily_limit: "250M tokens/day",
    context_window: 128_000,
    description: "Kira AI compatible model endpoint."
  };
}

