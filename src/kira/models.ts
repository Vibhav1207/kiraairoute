import { KIRA_BASE_URL } from "../config/constants.js";

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
  },
  {
    id: "gpt-5.6-luna-free",
    name: "GPT 5.6 Luna Free",
    provider: "OpenAI",
    free: true,
    balance_required: true,
    daily_limit: "250M tokens/day",
    context_window: 1_000_000
  },
  {
    id: "qwen3.8-27b-free",
    name: "Qwen 3.8 27B Free",
    provider: "Qwen",
    free: true,
    balance_required: true,
    daily_limit: "250M tokens/day",
    context_window: 128_000
  }
] as const;

let dynamicModelsCache: ModelDefinition[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60000;

export async function fetchUpstreamModels(apiKey?: string): Promise<ModelDefinition[]> {
  const now = Date.now();
  if (dynamicModelsCache && (now - lastCacheTime < CACHE_TTL_MS)) {
    return dynamicModelsCache;
  }

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const res = await fetch(`${KIRA_BASE_URL}/models`, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(5000)
    });

    if (res.ok) {
      const data: any = await res.json();
      const rawList = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      
      if (rawList.length > 0) {
        const fetchedModels: ModelDefinition[] = rawList.map((m: any) => {
          const id = String(m.id || m.name || "");
          const name = String(m.name || m.id || "Kira Model");
          
          let provider = String(m.owned_by || m.provider || "");
          if (!provider) {
            const lowerId = id.toLowerCase();
            if (lowerId.includes("kira")) provider = "Kira";
            else if (lowerId.includes("mimo") || lowerId.includes("xiaomi")) provider = "Xiaomi";
            else if (lowerId.includes("deepseek")) provider = "DeepSeek";
            else if (lowerId.includes("qwen")) provider = "Qwen";
            else if (lowerId.includes("glm")) provider = "GLM";
            else if (lowerId.includes("gpt")) provider = "OpenAI";
            else if (lowerId.includes("hy3") || lowerId.includes("tencent")) provider = "Tencent";
            else provider = "Kira AI";
          }

          const isFree = m.is_free !== undefined ? Boolean(m.is_free) : !id.includes("balance");
          const balanceRequired = m.balance_required !== undefined
            ? Boolean(m.balance_required)
            : (m.price_input_vnd ? m.price_input_vnd > 0 : !isFree);

          return {
            id,
            name,
            provider,
            free: true,
            balance_required: balanceRequired,
            daily_limit: m.daily_limit || (balanceRequired ? "250M tokens/day" : "150M tokens/day"),
            context_window: m.context_window || 128_000
          };
        });

        // Merge static defaults if any missing
        const knownIds = new Set(fetchedModels.map(m => m.id));
        for (const staticModel of KIRA_MODELS) {
          if (!knownIds.has(staticModel.id)) {
            fetchedModels.push(staticModel);
          }
        }

        dynamicModelsCache = fetchedModels;
        lastCacheTime = now;
        return fetchedModels;
      }
    }
  } catch {
    // Ignore fetch error, use fallback
  }

  return [...KIRA_MODELS];
}

export function getModels(): readonly ModelDefinition[] {
  return dynamicModelsCache || KIRA_MODELS;
}

export function getModel(modelId: string): ModelDefinition | undefined {
  const models = getModels();
  return models.find((model) => model.id === modelId) || {
    id: modelId,
    name: modelId,
    provider: "Kira AI",
    free: true,
    balance_required: true,
    daily_limit: "250M tokens/day",
    context_window: 128_000
  };
}
