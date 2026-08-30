#!/usr/bin/env node

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { exec } from "node:child_process";

const PACKAGE_ROOT = dirname(
  dirname(fileURLToPath(import.meta.url))
);

const SERVER_PATH = join(
  PACKAGE_ROOT,
  "dist",
  "server.js"
);

const PORT = Number(
  process.env.KIRAAIROUTE_PORT || 4010
);

function openBrowser(url: string): void {
  if (process.platform === "win32") {
    exec(`start "" "${url}"`);
    return;
  }

  if (process.platform === "darwin") {
    exec(`open "${url}"`);
    return;
  }

  exec(`xdg-open "${url}"`);
}

function startServer(): void {
  if (!existsSync(SERVER_PATH)) {
    console.error("");
    console.error(
      "KiraAI Route installation appears incomplete."
    );
    console.error(
      `Server not found: ${SERVER_PATH}`
    );
    console.error("");
    console.error("Run:");
    console.error("  npm run build");
    console.error("");
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
        KIRAAIROUTE_PORT: String(PORT)
      },
      stdio: "inherit"
    }
  );

  child.on("error", (error) => {
    console.error("");
    console.error(
      "Failed to start KiraAI Route:",
      error.message
    );
    process.exit(1);
  });

  child.on("spawn", () => {
    setTimeout(() => {
      openBrowser(
        `http://127.0.0.1:${PORT}`
      );
    }, 1000);
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

function main(): void {
  console.log("");
  console.log("╭──────────────────────────────────────╮");
  console.log("│            KiraAI Route              │");
  console.log("│      Open-source Kira gateway        │");
  console.log("╰──────────────────────────────────────╯");

  startServer();
}

main();