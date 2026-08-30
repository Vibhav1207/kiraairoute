import { exec } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export const CODEX_CONFIG_DIR = join(homedir(), ".codex");
export const CODEX_CONFIG_FILE = join(CODEX_CONFIG_DIR, "config.toml");

export interface AutoConfigOptions {
  model: string;
  baseUrl: string;
  apiKey?: string;
}

export function updateCodexTomlContent(content: string, model: string, baseUrl: string): string {
  let updated = content;

  // 1. Update or insert top-level model = "..."
  if (/^model\s*=\s*.*$/m.test(updated)) {
    updated = updated.replace(/^model\s*=\s*.*$/m, `model = "${model}"`);
  } else {
    updated = `model = "${model}"\n` + updated;
  }

  // 2. Update or insert top-level model_provider = "kira"
  if (/^model_provider\s*=\s*.*$/m.test(updated)) {
    updated = updated.replace(/^model_provider\s*=\s*.*$/m, 'model_provider = "kira"');
  } else {
    updated = updated.replace(/^model\s*=\s*.*$/m, (m) => `${m}\nmodel_provider = "kira"`);
  }

  // 3. Update or insert [model_providers.kira] section using required wire_api = "responses"
  const kiraSection = `[model_providers.kira]\nname = "KiraAI Route"\nbase_url = "${baseUrl}"\nenv_key = "KIRA_API_KEY"\nwire_api = "responses"`;
  const kiraSectionRegex = /\[model_providers\.kira\][^\[]*/;

  if (kiraSectionRegex.test(updated)) {
    updated = updated.replace(kiraSectionRegex, kiraSection + "\n\n");
  } else {
    updated = updated.trim() + "\n\n" + kiraSection + "\n";
  }

  return updated.replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

export function setPersistentEnvVariable(key: string, value: string): void {
  if (!key || !value) return;

  // Set in current Node process
  process.env[key] = value;

  // Set in Windows user registry persistently so all future terminals have it
  if (process.platform === "win32") {
    try {
      exec(`setx ${key} "${value.replace(/"/g, '\\"')}"`, () => {});
    } catch {
      // Ignore background setx errors
    }
  }
}

export function autoConfigureAll(options: AutoConfigOptions): { success: boolean; codexPath: string; error?: string } {
  try {
    // 1. Sync Codex config.toml
    if (!existsSync(CODEX_CONFIG_DIR)) {
      mkdirSync(CODEX_CONFIG_DIR, { recursive: true });
    }

    let currentContent = "";
    if (existsSync(CODEX_CONFIG_FILE)) {
      currentContent = readFileSync(CODEX_CONFIG_FILE, "utf-8");
    }

    const updatedContent = updateCodexTomlContent(currentContent, options.model, options.baseUrl);
    writeFileSync(CODEX_CONFIG_FILE, updatedContent, "utf-8");

    // 2. Sync persistent environment variables for Codex, Claude, and OpenAI SDKs
    if (options.apiKey) {
      setPersistentEnvVariable("KIRA_API_KEY", options.apiKey);
      setPersistentEnvVariable("OPENAI_API_KEY", options.apiKey);
      setPersistentEnvVariable("ANTHROPIC_API_KEY", options.apiKey);
    }
    setPersistentEnvVariable("OPENAI_BASE_URL", options.baseUrl);
    setPersistentEnvVariable("ANTHROPIC_BASE_URL", options.baseUrl);
    setPersistentEnvVariable("KIRA_MODEL", options.model);

    return { success: true, codexPath: CODEX_CONFIG_FILE };
  } catch (error) {
    return {
      success: false,
      codexPath: CODEX_CONFIG_FILE,
      error: error instanceof Error ? error.message : "Failed to configure environment"
    };
  }
}

export const autoConfigureCodex = autoConfigureAll;
