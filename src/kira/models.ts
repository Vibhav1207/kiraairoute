export interface ModelDefinition {
  id: string;
  name: string;
  provider: string;
  free: boolean;
  balance_required: boolean;
  daily_limit: string;
  context_window: number;
}

export const KIRA_MODELS: readonly ModelDefinition[] = [
  {
    id: "kira-mini-1.0",
    name: "Kira Mini 1.0",
    provider: "Kira",
    free: true,
    balance_required: false,
    daily_limit: "150M tokens/day",
    context_window: 1_000_000
  },
  {
    id: "kira-2.0",
    name: "Kira Mini 2.0",
    provider: "Kira",
    free: true,
    balance_required: false,
    daily_limit: "150M tokens/day",
    context_window: 1_000_000
  },
  {
    id: "mimo-v2.5",
    name: "Mimo V2.5",
    provider: "Xiaomi",
    free: true,
    balance_required: false,
    daily_limit: "150M tokens/day",
    context_window: 128_000
  },
  {
    id: "hy3",
    name: "Tencent Hy3 Free",
    provider: "Tencent",
    free: true,
    balance_required: false,
    daily_limit: "150M tokens/day",
    context_window: 128_000
  },
  {
    id: "deepseek-v4-flash-free",
    name: "DeepSeek V4 Flash",
    provider: "DeepSeek",
    free: true,
    balance_required: true,
    daily_limit: "250M tokens/day",
    context_window: 1_000_000
  },
  {
    id: "deepseek-v4-flash-vision-exp",
    name: "DeepSeek V4 Flash Vision Exp",
    provider: "DeepSeek",
    free: true,
    balance_required: true,
    daily_limit: "250M tokens/day",
    context_window: 128_000
  },
  {
    id: "qwen3.8-flash",
    name: "Qwen3.8 Flash",
    provider: "Qwen",
    free: true,
    balance_required: true,
    daily_limit: "250M tokens/day",
    context_window: 128_000
  },
  {
    id: "glm-5.3-flash",
    name: "GLM 5.3 Flash",
    provider: "GLM",
    free: true,
    balance_required: true,
    daily_limit: "250M tokens/day",
    context_window: 128_000
  },
  {
    id: "glm-5.3",
    name: "GLM 5.3",
    provider: "GLM",
    free: true,
    balance_required: true,
    daily_limit: "250M tokens/day",
    context_window: 1_000_000
  }
] as const;

export function getModels(): readonly ModelDefinition[] {
  return KIRA_MODELS;
}

export function getModel(modelId: string): ModelDefinition | undefined {
  return KIRA_MODELS.find((model) => model.id === modelId);
}
