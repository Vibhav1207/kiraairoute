import { exec } from "node:child_process";

export function openBrowser(url: string): void {
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

export function printBanner(): void {
  console.log("");
  console.log("╭──────────────────────────────────────╮");
  console.log("│            KiraAI Route              │");
  console.log("│      Open-source Kira gateway        │");
  console.log("╰──────────────────────────────────────╯");
}
