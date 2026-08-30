#!/usr/bin/env node

import { password, confirm } from "@inquirer/prompts";
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const PACKAGE_ROOT = dirname(
  dirname(fileURLToPath(import.meta.url))
);

const SERVER_PATH = join(
  PACKAGE_ROOT,
  "dist",
  "server.js"
);

const CONFIG_DIR = join(
  homedir(),
  ".kiraairoute"
);

const CONFIG_FILE = join(
  CONFIG_DIR,
  "config.json"
);

const PORT = Number(
  process.env.KIRAAIROUTE_PORT || 4010
);

interface Config {
  apiKey?: string;
}

function loadConfig(): Config {
  if (!existsSync(CONFIG_FILE)) {
    return {};
  }

  try {
    return JSON.parse(
      readFileSync(CONFIG_FILE, "utf8")
    ) as Config;
  } catch {
    return {};
  }
}

function saveConfig(apiKey: string): void {
  mkdirSync(CONFIG_DIR, {
    recursive: true
  });

  writeFileSync(
    CONFIG_FILE,
    JSON.stringify(
      {
        apiKey
      },
      null,
      2
    ),
    {
      encoding: "utf8",
      mode: 0o600
    }
  );
}

async function getApiKey(): Promise<string> {
  // Environment variable takes priority.
  if (process.env.KIRA_API_KEY) {
    return process.env.KIRA_API_KEY;
  }

  const config = loadConfig();

  if (config.apiKey) {
    console.log("✓ Kira API key loaded.");
    return config.apiKey;
  }

  console.log("");
  console.log("First-time KiraAI Route setup");
  console.log("");

  const apiKey = await password({
    message: "Enter your Kira API key:",
    mask: "*",
    validate(value) {
      const trimmed = value.trim();

      if (!trimmed) {
        return "API key cannot be empty.";
      }

      if (!trimmed.startsWith("kira_")) {
        return "Kira API keys should start with kira_.";
      }

      return true;
    }
  });

  saveConfig(apiKey.trim());

  console.log("");
  console.log("✓ API key saved.");
  console.log(`✓ Config: ${CONFIG_FILE}`);

  return apiKey.trim();
}

async function startServer(
  apiKey: string
): Promise<void> {
  if (!existsSync(SERVER_PATH)) {
    console.error("");
    console.error(
      "KiraAI Route installation appears incomplete."
    );
    console.error(
      `Server not found: ${SERVER_PATH}`
    );
    process.exit(1);
  }

  console.log("");
  console.log(
    `Starting KiraAI Route on port ${PORT}...`
  );
  console.log("");

  const child = spawn(
    process.execPath,
    [SERVER_PATH],
    {
      env: {
        ...process.env,
        KIRA_API_KEY: apiKey,
        KIRAAIROUTE_PORT: String(PORT)
      },
      stdio: "inherit"
    }
  );

  child.on("error", (error) => {
    console.error(
      "Failed to start KiraAI Route:",
      error.message
    );

    process.exit(1);
  });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });

  process.on("SIGINT", () => {
    child.kill("SIGINT");
  });

  process.on("SIGTERM", () => {
    child.kill("SIGTERM");
  });
}

async function main(): Promise<void> {
  console.log("");
  console.log("╭──────────────────────────────────────╮");
  console.log("│            KiraAI Route              │");
  console.log("│      Open-source Kira gateway        │");
  console.log("╰──────────────────────────────────────╯");

  const apiKey = await getApiKey();

  console.log("");
  console.log("✓ Kira API key configured");
  console.log(`✓ API endpoint: http://127.0.0.1:${PORT}/v1`);

  const shouldStart = await confirm({
    message: `Start KiraAI Route on port ${PORT}?`,
    default: true
  });

  if (!shouldStart) {
    console.log("");
    console.log("Setup complete.");
    console.log("Run `npx kiraairoute` whenever you want to start it.");
    return;
  }

  await startServer(apiKey);
}

main().catch((error) => {
  console.error("");
  console.error(
    "KiraAI Route failed:",
    error instanceof Error
      ? error.message
      : String(error)
  );

  process.exit(1);
});