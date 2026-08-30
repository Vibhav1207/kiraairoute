export const KIRA_MODELS = [
  {
    id: "kira-mini-1.0",
    object: "model",
    owned_by: "kira",
    free: true,
    balance_required: false,
    daily_limit: "150M tokens",
    context_window: 1_000_000
  },
  {
    id: "hy3",
    object: "model",
    owned_by: "kira",
    free: true,
    balance_required: false,
    daily_limit: "150M tokens",
    context_window: 128_000
  },
  {
    id: "mimo-v2.5",
    object: "model",
    owned_by: "kira",
    free: true,
    balance_required: false,
    daily_limit: "150M tokens",
    context_window: 128_000
  },
  {
    id: "kira-2.0",
    object: "model",
    owned_by: "kira",
    free: true,
    balance_required: false,
    daily_limit: "150M tokens",
    context_window: 1_000_000
  }
] as const;

export function getModels() {
  return KIRA_MODELS;
}

export function isSupportedModel(model: string): boolean {
  return KIRA_MODELS.some((item) => item.id === model);
}