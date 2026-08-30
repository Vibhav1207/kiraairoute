import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { CONFIG_DIR, CONFIG_FILE, DEFAULT_MODEL } from "../config/constants.js";

export interface ConfigData {
  apiKey?: string;
  model?: string;
}

let loadedConfig: ConfigData = {};

function readConfigFile(): ConfigData {
  try {
    if (existsSync(CONFIG_FILE)) {
      const content = readFileSync(CONFIG_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch {
    // Ignore read or parse errors
  }
  return {};
}

function writeConfigFile(config: ConfigData): void {
  try {
    if (!existsSync(CONFIG_DIR)) {
      mkdirSync(CONFIG_DIR, { recursive: true });
    }
    writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
  } catch {
    // Ignore write errors
  }
}

// Initialize config on load
loadedConfig = readConfigFile();

let currentApiKey = process.env.KIRA_API_KEY || loadedConfig.apiKey || "";
let currentModel = process.env.KIRA_MODEL || loadedConfig.model || DEFAULT_MODEL;

export function getKiraApiKey(): string {
  const apiKey = process.env.KIRA_API_KEY || currentApiKey;
  if (!apiKey) {
    throw new Error("KIRA_API_KEY is not set.");
  }
  return apiKey;
}

export function setKiraApiKey(apiKey: string): void {
  currentApiKey = apiKey.trim();
  loadedConfig.apiKey = currentApiKey;
  writeConfigFile(loadedConfig);
}

export function hasKiraApiKey(): boolean {
  const apiKey = process.env.KIRA_API_KEY || currentApiKey;
  return Boolean(apiKey);
}

export function getKiraModel(): string {
  return process.env.KIRA_MODEL || currentModel;
}

export function setKiraModel(model: string): void {
  currentModel = model;
  loadedConfig.model = currentModel;
  writeConfigFile(loadedConfig);
}

export function loadConfig(): ConfigData {
  loadedConfig = readConfigFile();
  if (loadedConfig.apiKey && !currentApiKey) currentApiKey = loadedConfig.apiKey;
  if (loadedConfig.model && !currentModel) currentModel = loadedConfig.model;
  return loadedConfig;
}
