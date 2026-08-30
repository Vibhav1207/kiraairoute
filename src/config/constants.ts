import { homedir } from "node:os";
import { join } from "node:path";

export const DEFAULT_PORT = Number(process.env.KIRAAIROUTE_PORT || 4010);
export const KIRA_BASE_URL = "https://kiraai.vn/api/v1";
export const DEFAULT_MODEL = "kira-mini-1.0";

export const CONFIG_DIR = join(homedir(), ".kiraairoute");
export const CONFIG_FILE = join(CONFIG_DIR, "config.json");
