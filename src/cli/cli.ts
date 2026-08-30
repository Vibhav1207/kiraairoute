#!/usr/bin/env node

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { DEFAULT_PORT } from "../config/constants.js";
import { openBrowser, printBanner } from "./ui.js";

const CLI_DIR = dirname(fileURLToPath(import.meta.url));
const SERVER_PATH = join(CLI_DIR, "..", "server", "server.js");
const PORT = Number(process.env.KIRAAIROUTE_PORT || DEFAULT_PORT);

function startServerProcess(): void {
  if (!existsSync(SERVER_PATH)) {
    console.error("\nKiraAI Route installation appears incomplete.");
    console.error(`Server not found: ${SERVER_PATH}\n`);
    console.error("Run:\n  npm run build\n");
    process.exit(1);
  }

  console.log(`\nStarting KiraAI Route on port ${PORT}...\n`);

  const child = spawn(process.execPath, [SERVER_PATH], {
    env: { ...process.env, KIRAAIROUTE_PORT: String(PORT) },
    stdio: "inherit"
  });

  child.on("error", (error) => {
    console.error("\nFailed to start KiraAI Route:", error.message);
    process.exit(1);
  });

  child.on("spawn", () => {
    setTimeout(() => {
      openBrowser(`http://127.0.0.1:${PORT}`);
    }, 1000);
  });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });

  process.on("SIGINT", () => { child.kill("SIGINT"); });
  process.on("SIGTERM", () => { child.kill("SIGTERM"); });
}

function main(): void {
  printBanner();
  startServerProcess();
}

main();
