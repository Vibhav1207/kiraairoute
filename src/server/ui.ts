export function getWebPageHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KiraAI Route Gateway</title>
<link rel="icon" type="image/png" href="/logo.png">
<style>
:root {
  --bg-app: #100d0a;
  --bg-card: #191410;
  --bg-input: #120e0b;
  --bg-hover: #261e18;
  --border-color: #352920;
  --border-hover: #544033;
  --text-primary: #f5eedc;
  --text-secondary: #c5b49f;
  --text-muted: #8a7765;
  --accent-primary: #c88d51;
  --accent-hover: #d99e62;
  --accent-glow: rgba(200, 141, 81, 0.25);
  --status-green: #10b981;
  --status-amber: #f59e0b;
  --status-red: #ef4444;
  --radius-card: 16px;
  --radius-input: 10px;
  --font-sans: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg-app);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  -webkit-font-smoothing: antialiased;
}

/* Header Navbar */
.navbar {
  height: 68px;
  border-bottom: 1px solid var(--border-color);
  background: rgba(25, 20, 16, 0.8);
  backdrop-filter: blur(12px);
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-logo-img {
  height: 38px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(200, 141, 81, 0.3));
}

.brand-text-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-title {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: var(--text-primary);
}

.version-pill {
  font-size: 11px;
  font-weight: 700;
  background: rgba(200, 141, 81, 0.15);
  color: var(--accent-primary);
  border: 1px solid rgba(200, 141, 81, 0.3);
  padding: 2px 8px;
  border-radius: 20px;
}

.nav-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--status-green);
  box-shadow: 0 0 10px var(--status-green);
}

/* Main Container */
.main-wrapper {
  max-width: 1040px;
  width: 100%;
  margin: 40px auto;
  padding: 0 24px;
  flex: 1;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}

/* Layout Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 28px;
  align-items: start;
}

@media (max-width: 920px) {
  .content-grid { grid-template-columns: 1fr; }
}

/* Form Card */
.form-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.form-group {
  margin-bottom: 24px;
}

.form-group:last-child { margin-bottom: 0; }

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

input[type="text"],
input[type="password"],
select {
  width: 100%;
  height: 46px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-input);
  color: var(--text-primary);
  padding: 0 14px;
  font-family: var(--font-sans);
  font-size: 13px;
  outline: none;
  transition: all 0.15s ease;
}

input[type="text"]:focus,
input[type="password"]:focus,
select:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.eye-btn {
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: color 0.15s ease;
}

.eye-btn:hover { color: var(--text-primary); }

.help-text {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.help-text a {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 600;
}

.help-text a:hover { text-decoration: underline; }

/* Model Detail Inspector Card */
.model-inspector {
  margin-top: 12px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-input);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.inspector-info {
  display: flex;
  flex-direction: column;
}

.inspector-title {
  font-weight: 700;
  font-size: 14px;
  color: var(--text-primary);
}

.inspector-provider {
  font-size: 12px;
  color: var(--text-muted);
}

.inspector-badge-group {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.badge-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}

.tag-free { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.25); }
.tag-balance { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.25); }

.inspector-limits {
  font-size: 11px;
  color: var(--text-muted);
}

/* Primary Action Button */
.btn-primary {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, var(--accent-primary) 0%, #a86c38 100%);
  color: #ffffff;
  border: none;
  border-radius: var(--radius-input);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 28px;
  transition: all 0.15s ease;
  box-shadow: 0 4px 16px var(--accent-glow);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--accent-hover) 0%, var(--accent-primary) 100%);
  box-shadow: 0 6px 20px rgba(200, 141, 81, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: wait;
  box-shadow: none;
}

/* Status Toast */
.status-toast {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: var(--radius-input);
  font-size: 13px;
  display: none;
  border: 1px solid transparent;
}

.status-toast.show { display: block; }
.status-toast.info { background: rgba(200, 141, 81, 0.12); color: var(--accent-primary); border-color: rgba(200, 141, 81, 0.3); }
.status-toast.success { background: rgba(16, 185, 129, 0.12); color: #34d399; border-color: rgba(16, 185, 129, 0.3); }
.status-toast.error { background: rgba(239, 68, 68, 0.12); color: #fca5a5; border-color: rgba(239, 68, 68, 0.3); }

/* Right Status Card */
.status-panel {
  background: var(--bg-card);
  border: 1px solid rgba(16, 185, 129, 0.35);
  border-radius: var(--radius-card);
  padding: 26px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  display: none;
}

.status-panel.show { display: block; }

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 15px;
  color: var(--status-green);
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-color);
}

.panel-item {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-input);
  padding: 12px 14px;
  margin-bottom: 14px;
}

.panel-item:last-child { margin-bottom: 0; }

.panel-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.panel-value-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  font-size: 13px;
  color: var(--text-primary);
  font-family: var(--font-mono);
}

.btn-icon {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.15s ease;
}

.btn-icon:hover { color: var(--accent-primary); }

/* Action Buttons Group */
.actions-group {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-launch {
  width: 100%;
  height: 44px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  border: none;
  border-radius: var(--radius-input);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
  transition: all 0.15s ease;
}

.btn-launch:hover {
  opacity: 0.95;
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.4);
}

.btn-secondary {
  width: 100%;
  height: 40px;
  background: var(--bg-hover);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-input);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-secondary:hover {
  background: var(--border-color);
  border-color: var(--border-hover);
}
.btn-icon-img {
  width: 22px;
  height: 22px;
  object-fit: contain;
  vertical-align: middle;
}
</style>
</head>
<body>

<!-- Header -->
<header class="navbar">
  <div class="nav-brand">
    <img src="/logo.png" alt="KiraAI Route Logo" class="brand-logo-img" onerror="this.style.display='none'">
    <div class="brand-text-group">
      <span class="brand-title">KiraAI Route</span>
      <span class="version-pill">v0.1.9</span>
    </div>
  </div>
  <div class="nav-status">
    <span class="status-dot"></span>
    <span>Gateway Active</span>
  </div>
</header>

<!-- Main Container -->
<main class="main-wrapper">
  <div class="page-header">
    <h1 class="page-title">Gateway Configuration</h1>
    <p class="page-subtitle">Connect your Kira AI account and configure the default model for your local proxy server.</p>
  </div>

  <div class="content-grid">
    <!-- Left Configuration Form -->
    <div class="form-card">
      <div class="form-group">
        <label for="apiKey" class="form-label">Kira API Key</label>
        <div class="input-container">
          <input id="apiKey" type="password" placeholder="Paste your Kira API key" autocomplete="off">
          <button id="toggleApiKey" type="button" class="eye-btn" title="Toggle Visibility" aria-label="Toggle API Key visibility">
            <svg id="eyeIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
        </div>
        <div class="help-text">
          Don't have an API key? <a href="https://kiraai.vn/developer/" target="_blank" rel="noopener">Create one at kiraai.vn/developer</a>
        </div>
      </div>

      <div class="form-group">
        <label for="model" class="form-label">Default Model</label>
        <select id="model"></select>

        <div id="modelInspector" class="model-inspector">
          <div class="inspector-info">
            <span id="mName" class="inspector-title">Kira Mini 1.0</span>
            <span id="mProvider" class="inspector-provider">Kira AI</span>
          </div>
          <div class="inspector-badge-group">
            <span id="mBadge" class="badge-tag tag-free">Free Model</span>
            <span id="mLimits" class="inspector-limits">150M tokens/day · 1M context</span>
          </div>
        </div>
      </div>

      <button id="start" class="btn-primary">
        <span>Test & Start Gateway</span>
      </button>

      <div id="status" class="status-toast"></div>
    </div>

    <!-- Right Status Panel -->
    <div id="statusPanel" class="status-panel">
      <div class="panel-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        KiraAI Route is Running
      </div>

      <div class="panel-item">
        <div class="panel-label">Active Model</div>
        <div class="panel-value-row">
          <span id="stModel">kira-mini-1.0</span>
        </div>
      </div>

      <div class="panel-item">
        <div class="panel-label">Local API Endpoint</div>
        <div class="panel-value-row">
          <span id="stEndpoint">http://127.0.0.1:4010/v1</span>
          <button class="btn-icon" onclick="copyEndpoint()" title="Copy Endpoint">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        </div>
      </div>

      <div class="panel-item">
        <div class="panel-label">Codex & ChatGPT Desktop</div>
        <div class="panel-value-row">
          <span>Auto-configured in ~/.codex</span>
          <span style="color: var(--status-green); font-size:18px;">●</span>
        </div>
      </div>

      <div class="panel-item">
        <div class="panel-label">Claude Code CLI</div>
        <div class="panel-value-row">
          <span>Auto-configured in Env</span>
          <span style="color: var(--status-green); font-size:18px;">●</span>
        </div>
      </div>

      <div class="actions-group">
        <button id="btnLaunchCodex" class="btn-launch" onclick="launchCodex()">
          <img src="/codex-logo.webp" class="btn-icon-img" alt="Codex Logo" onerror="this.style.display='none'">
          <span>Launch Codex</span>
        </button>
        <button id="btnLaunchClaude" class="btn-launch" style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%); box-shadow: 0 4px 14px rgba(217, 119, 6, 0.3);" onclick="launchClaude()">
          <span>⚡ Launch Claude Code</span>
        </button>
        <button class="btn-secondary" onclick="syncTools()">
          <span>🔄 Auto-Sync Codex & Claude</span>
        </button>
        <button class="btn-secondary" onclick="copyEndpoint()">
          <span>📋 Copy API Endpoint</span>
        </button>
        <button class="btn-secondary" onclick="resetConfig()">
          <span>🔄 Reconfigure</span>
        </button>
      </div>
    </div>
  </div>
</main>

<script>
const modelSelect = document.getElementById("model");
const apiKeyInput = document.getElementById("apiKey");
const startButton = document.getElementById("start");
const statusToast = document.getElementById("status");
const statusPanel = document.getElementById("statusPanel");
const toggleApiKeyBtn = document.getElementById("toggleApiKey");
const eyeIcon = document.getElementById("eyeIcon");

let models = [];

toggleApiKeyBtn.addEventListener("click", () => {
  const isPassword = apiKeyInput.type === "password";
  apiKeyInput.type = isPassword ? "text" : "password";
  eyeIcon.innerHTML = isPassword
    ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>'
    : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
});

function showStatus(message, type) {
  statusToast.className = "status-toast show " + (type || "info");
  statusToast.textContent = message;
}

function updateModelInspector() {
  const model = models.find(m => m.id === modelSelect.value);
  if (!model) return;

  document.getElementById("mName").textContent = model.name;
  document.getElementById("mProvider").textContent = model.provider;
  document.getElementById("mLimits").textContent = model.daily_limit + " · " + (model.context_window / 1000).toLocaleString() + "k context";

  const badge = document.getElementById("mBadge");
  if (model.balance_required) {
    badge.className = "badge-tag tag-balance";
    badge.textContent = "Balance > 0 VND Required";
  } else {
    badge.className = "badge-tag tag-free";
    badge.textContent = "Free Model";
  }
}

async function loadModels() {
  try {
    const res = await fetch("/api/models");
    const data = await res.json();
    models = data.data || [];
    modelSelect.innerHTML = "";

    const freeModels = models.filter(m => !m.balance_required);
    const balanceModels = models.filter(m => m.balance_required);

    const g1 = document.createElement("optgroup"); g1.label = "FREE — NO BALANCE REQUIRED";
    for (const m of freeModels) {
      const opt = document.createElement("option"); opt.value = m.id; opt.textContent = m.name; g1.appendChild(opt);
    }
    modelSelect.appendChild(g1);

    const g2 = document.createElement("optgroup"); g2.label = "FREE — BALANCE REQUIRED";
    for (const m of balanceModels) {
      const opt = document.createElement("option"); opt.value = m.id; opt.textContent = m.name; g2.appendChild(opt);
    }
    modelSelect.appendChild(g2);
    updateModelInspector();
  } catch {
    showStatus("Could not load available models list. Gateway server may be offline.", "error");
  }
}

modelSelect.addEventListener("change", updateModelInspector);

startButton.addEventListener("click", async () => {
  const apiKey = apiKeyInput.value.trim();
  const model = modelSelect.value;
  if (!apiKey) { showStatus("Please enter your Kira API key.", "error"); return; }

  startButton.disabled = true;
  showStatus("Testing Kira API connection...", "info");

  try {
    const setupRes = await fetch("/api/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey, model })
    });
    const setupData = await setupRes.json();
    if (!setupRes.ok) throw new Error(setupData?.error?.message || "Setup failed.");

    const testRes = await fetch("/api/test", { method: "POST" });
    const testData = await testRes.json();
    if (!testRes.ok) throw new Error(testData?.error?.message || "Connection test failed.");

    showStatus("✓ Kira AI connected! Codex, ChatGPT Desktop & Claude Code automatically configured.", "success");
    showStatusPanel(model);
  } catch (error) {
    let msg = error instanceof Error ? error.message : "Something went wrong.";
    if (msg === "Failed to fetch" || (error && error.name === "TypeError")) {
      msg = "Failed to connect to local gateway server. Please ensure the terminal running 'npm start' or 'npx @vibhav1207/kiraairoute' is still open and running.";
    }
    showStatus(msg, "error");
  } finally {
    startButton.disabled = false;
  }
});

function showStatusPanel(model) {
  document.getElementById("stModel").textContent = model;
  document.getElementById("stEndpoint").textContent = window.location.origin + "/v1";
  statusPanel.className = "status-panel show";
}

function resetConfig() {
  statusPanel.className = "status-panel";
  statusToast.className = "status-toast";
}

function copyEndpoint() {
  const endpoint = window.location.origin + "/v1";
  navigator.clipboard.writeText(endpoint);
  showStatus("API Endpoint copied to clipboard.", "success");
}

async function syncTools() {
  showStatus("Auto-syncing Codex, ChatGPT Desktop and Claude Code...", "info");
  try {
    const res = await fetch("/api/sync-tools", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      showStatus("✓ Codex config.toml & Claude environment synced successfully.", "success");
    } else {
      showStatus(data?.error?.message || "Sync failed.", "error");
    }
  } catch {
    showStatus("Sync failed. Local gateway may be unreachable.", "error");
  }
}

async function launchCodex() {
  navigator.clipboard.writeText("codex");
  showStatus("Launching Codex app or terminal...", "info");
  try {
    const res = await fetch("/api/launch-codex", { method: "POST" });
    if (res.ok) {
      showStatus("✓ Launching Codex.", "success");
    } else {
      showStatus("Copied 'codex' command to clipboard. Paste in terminal to run.", "info");
    }
  } catch {
    showStatus("Copied 'codex' command to clipboard. Paste in terminal to run.", "info");
  }
}

async function launchClaude() {
  navigator.clipboard.writeText("claude");
  showStatus("Launching Claude Code app or terminal...", "info");
  try {
    const res = await fetch("/api/launch-claude", { method: "POST" });
    if (res.ok) {
      showStatus("✓ Launching Claude Code.", "success");
    } else {
      showStatus("Copied 'claude' command to clipboard. Paste in terminal to run.", "info");
    }
  } catch {
    showStatus("Copied 'claude' command to clipboard. Paste in terminal to run.", "info");
  }
}

async function init() {
  try {
    const res = await fetch("/api/status");
    const data = await res.json();
    if (data.configured && data.model) {
      modelSelect.value = data.model;
      updateModelInspector();
      showStatusPanel(data.model);
    }
  } catch {}
}

loadModels().then(init);
</script>
</body>
</html>`;
}
