#!/usr/bin/env node

import { DEFAULT_PORT } from "../config/constants.js";
import { startServer } from "../server/server.js";
import { openBrowser, printBanner } from "./ui.js";

async function main(): Promise<void> {
  printBanner();
  const targetPort = Number(process.env.KIRAAIROUTE_PORT || DEFAULT_PORT);
  console.log(`\nStarting KiraAI Route on port ${targetPort}...\n`);

  const { port } = await startServer(targetPort);

  let openedBrowser = false;
  if (!openedBrowser) {
    openedBrowser = true;
    setTimeout(() => {
      openBrowser(`http://127.0.0.1:${port}`);
    }, 500);
  }
}

main().catch((error) => {
  console.error("\nFailed to start KiraAI Route:", error);
  process.exit(1);
});

