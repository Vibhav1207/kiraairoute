export function getWebPageHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KIRAAI ROUTE</title>
<style>
:root {
  --bg-black: #000000;
  --bg-card: #0a0a0a;
  --neon-green: #00ff66;
  --text-white: #ffffff;
  --text-grey: #888888;
  --text-dark: #000000;
  --border-white: #ffffff;
  --border-green: #00ff66;
  --font-mono: "JetBrains Mono", "Fira Code", Consolas, "Courier New", monospace;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg-black);
  color: var(--text-white);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.4;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  text-transform: uppercase;
}

/* App Header */
.app-header {
  border-bottom: 2px solid #222222;
  background: var(--bg-black);
  padding: 0 32px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-square {
  width: 32px;
  height: 32px;
  background: var(--text-white);
  color: var(--text-dark);
  font-weight: 900;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--text-white);
}

.brand-title {
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 0.5px;
}

.brand-tag {
  font-size: 10px;
  background: var(--text-white);
  color: var(--text-dark);
  padding: 2px 6px;
  font-weight: 800;
  margin-left: 8px;
}

.header-status {
  font-size: 11px;
  color: var(--neon-green);
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Main Container */
.main-container {
  max-width: 1080px;
  width: 100%;
  margin: 36px auto;
  padding: 0 24px;
  flex: 1;
}

.section-header {
  margin-bottom: 28px;
}

.section-title {
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 1px;
  color: var(--text-white);
  margin-bottom: 6px;
}

.section-desc {
  color: var(--text-grey);
  font-size: 12px;
  text-transform: none;
}

/* Configuration Grid Layout */
.config-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 28px;
  align-items: start;
}

@media (max-width: 960px) {
  .config-grid { grid-template-columns: 1fr; }
}

/* Left Form Box */
.box-form {
  background: var(--bg-card);
  border: 2px solid var(--border-white);
  box-shadow: 4px 4px 0px var(--text-white);
  padding: 28px;
}

.field {
  margin-bottom: 24px;
}

label {
  display: block;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  color: var(--text-white);
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
  height: 44px;
  background: var(--bg-black);
  border: 1px solid var(--border-white);
  color: var(--text-white);
  padding: 0 12px;
  font-family: var(--font-mono);
  font-size: 12px;
  outline: none;
  border-radius: 0;
  text-transform: uppercase;
}

input[type="text"]:focus,
input[type="password"]:focus,
select:focus {
  border-color: var(--neon-green);
  box-shadow: 0 0 0 1px var(--neon-green);
}

.eye-btn {
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  color: var(--text-grey);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-btn:hover { color: var(--text-white); }

.field-subtext {
  margin-top: 8px;
  font-size: 11px;
  color: var(--text-grey);
  text-transform: none;
}

.field-subtext a {
  color: var(--neon-green);
  text-decoration: underline;
  font-weight: 600;
}

/* Selected Model Detail Box */
.model-detail-box {
  margin-top: 12px;
  background: var(--bg-black);
  border: 2px solid var(--neon-green);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.model-info-left {
  display: flex;
  flex-direction: column;
}

.model-info-name {
  font-weight: 800;
  font-size: 14px;
  color: var(--text-white);
}

.model-info-provider {
  font-size: 10px;
  color: var(--text-grey);
  margin-top: 2px;
}

.model-info-right {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.badge-green {
  background: var(--neon-green);
  color: var(--text-dark);
  font-size: 10px;
  font-weight: 900;
  padding: 2px 8px;
}

.badge-yellow {
  background: #f59e0b;
  color: var(--text-dark);
  font-size: 10px;
  font-weight: 900;
  padding: 2px 8px;
}

.model-limits {
  font-size: 10px;
  color: var(--text-grey);
}

/* Action Button */
.btn-action {
  width: 100%;
  height: 48px;
  background: var(--text-white);
  color: var(--text-dark);
  border: 2px solid var(--neon-green);
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-transform: uppercase;
  margin-top: 28px;
  transition: all 0.15s ease;
}

.btn-action:hover {
  background: var(--neon-green);
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: wait;
}

/* Status Banner */
.status-banner {
  margin-top: 16px;
  padding: 12px 14px;
  border: 1px solid var(--border-white);
  background: var(--bg-black);
  font-size: 11px;
  display: none;
}

.status-banner.show { display: block; }
.status-banner.info { color: var(--text-white); }
.status-banner.success { color: var(--neon-green); border-color: var(--neon-green); }
.status-banner.error { color: #ff5555; border-color: #ff5555; }

/* Right Status Card */
.box-status {
  background: var(--bg-card);
  border: 2px solid var(--neon-green);
  box-shadow: 5px 5px 0px var(--neon-green);
  padding: 24px;
  display: none;
}

.box-status.show { display: block; }

.status-header-banner {
  background: var(--neon-green);
  color: var(--text-dark);
  font-weight: 900;
  font-size: 14px;
  padding: 10px 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.5px;
}

.status-item {
  border: 1px solid var(--border-white);
  background: var(--bg-black);
  padding: 12px 14px;
  margin-bottom: 14px;
}

.status-item:last-child { margin-bottom: 0; }

.status-label {
  font-size: 10px;
  color: var(--text-grey);
  margin-bottom: 4px;
}

.status-value-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 800;
  font-size: 13px;
  color: var(--neon-green);
}

.copy-btn {
  background: transparent;
  border: none;
  color: var(--text-white);
  cursor: pointer;
  font-size: 14px;
}

.copy-btn:hover { color: var(--neon-green); }

/* Launch Actions Group */
.launch-actions-group {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-launch {
  width: 100%;
  height: 44px;
  background: var(--neon-green);
  color: var(--text-dark);
  border: 2px solid var(--neon-green);
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-transform: uppercase;
}

.btn-launch:hover {
  background: var(--text-white);
  border-color: var(--text-white);
}

.btn-secondary-action {
  width: 100%;
  height: 38px;
  background: transparent;
  color: var(--text-white);
  border: 1px solid var(--border-white);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
}

.btn-secondary-action:hover {
  background: var(--text-white);
  color: var(--text-dark);
}
</style>
</head>
<body>

<!-- Header -->
<header class="app-header">
  <div class="brand-box">
    <div class="logo-square">K</div>
    <div class="brand-title">
      KIRAAI ROUTE <span class="brand-tag">V0.1.2 LOCAL GATEWAY</span>
    </div>
  </div>
  <div class="header-status">
    <span>● GATEWAY ENGINE ONLINE</span>
  </div>
</header>

<!-- Main Area -->
<main class="main-container">
  <div class="section-header">
    <h1 class="section-title">> GATEWAY CONFIGURATION_</h1>
    <p class="section-desc">Connect your Kira AI account and configure the default model for your local proxy server.</p>
  </div>

  <div class="config-grid">
    <!-- Left Config Form -->
    <div class="box-form">
      <div class="field">
        <label for="apiKey">KIRA API KEY</label>
        <div class="input-container">
          <input id="apiKey" type="password" placeholder="ENTER YOUR KIRA API KEY..." autocomplete="off">
          <button id="toggleApiKey" type="button" class="eye-btn" title="Toggle Visibility">
            <svg id="eyeIcon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
        </div>
        <div class="field-subtext">
          Don't have an API key? <a href="https://kiraai.vn/developer/" target="_blank" rel="noopener">Create one at kiraai.vn/developer</a>
        </div>
      </div>

      <div class="field">
        <label for="model">DEFAULT MODEL</label>
        <select id="model"></select>

        <div id="modelDetailBox" class="model-detail-box">
          <div class="model-info-left">
            <div id="mName" class="model-info-name">KIRA MINI 1.0</div>
            <div id="mProvider" class="model-info-provider">KIRA</div>
          </div>
          <div class="model-info-right">
            <div id="mBadge" class="badge-green">■ FREE (NO BALANCE)</div>
            <div id="mLimits" class="model-limits">150M TOKENS/DAY · 1,000K CONTEXT</div>
          </div>
        </div>
      </div>

      <button id="start" class="btn-action">
        <span>(▶) TEST & START ROUTE</span>
      </button>

      <div id="status" class="status-banner"></div>
    </div>

    <!-- Right Status Card -->
    <div id="boxStatus" class="box-status">
      <div class="status-header-banner">
        <span>■</span> KIRAAI ROUTE IS RUNNING
      </div>

      <div class="status-item">
        <div class="status-label">> ACTIVE MODEL</div>
        <div class="status-value-box">
          <span id="stModel">KIRA-MINI-1.0</span>
        </div>
      </div>

      <div class="status-item">
        <div class="status-label">> LOCAL API ENDPOINT</div>
        <div class="status-value-box">
          <span id="stEndpoint">HTTP://127.0.0.1:4010/V1</span>
          <button class="copy-btn" onclick="copyEndpoint()" title="Copy Endpoint">📋</button>
        </div>
      </div>

      <div class="status-item">
        <div class="status-label">> CODEX STATUS</div>
        <div class="status-value-box">
          <span>READY TO CONNECT</span>
          <span style="color: var(--neon-green)">■</span>
        </div>
      </div>

      <div class="launch-actions-group">
        <button id="btnLaunchCodex" class="btn-launch" onclick="launchCodex()">
          <span>🚀 LAUNCH CODEX</span>
        </button>
        <button class="btn-secondary-action" onclick="copyEndpoint()">
          <span>📋 COPY API ENDPOINT</span>
        </button>
        <button class="btn-secondary-action" onclick="resetConfig()">
          <span>🛑 RECONFIGURE</span>
        </button>
      </div>
    </div>
  </div>
</main>

<script>
const modelSelect = document.getElementById("model");
const apiKeyInput = document.getElementById("apiKey");
const startButton = document.getElementById("start");
const statusBanner = document.getElementById("status");
const boxStatus = document.getElementById("boxStatus");
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
  statusBanner.className = "status-banner show " + (type || "info");
  statusBanner.textContent = message;
}

function updateModelDetail() {
  const model = models.find(m => m.id === modelSelect.value);
  if (!model) return;

  document.getElementById("mName").textContent = model.name.toUpperCase();
  document.getElementById("mProvider").textContent = model.provider.toUpperCase();
  document.getElementById("mLimits").textContent = model.daily_limit.toUpperCase() + " · " + (model.context_window / 1000).toLocaleString() + "K CONTEXT";

  const badge = document.getElementById("mBadge");
  if (model.balance_required) {
    badge.className = "badge-yellow";
    badge.textContent = "■ FREE (BALANCE > 0 VND)";
  } else {
    badge.className = "badge-green";
    badge.textContent = "■ FREE (NO BALANCE)";
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
      const opt = document.createElement("option"); opt.value = m.id; opt.textContent = m.name.toUpperCase(); g1.appendChild(opt);
    }
    modelSelect.appendChild(g1);

    const g2 = document.createElement("optgroup"); g2.label = "FREE — BALANCE REQUIRED";
    for (const m of balanceModels) {
      const opt = document.createElement("option"); opt.value = m.id; opt.textContent = m.name.toUpperCase(); g2.appendChild(opt);
    }
    modelSelect.appendChild(g2);
    updateModelDetail();
  } catch {
    showStatus("COULD NOT LOAD AVAILABLE MODELS.", "error");
  }
}

modelSelect.addEventListener("change", updateModelDetail);

startButton.addEventListener("click", async () => {
  const apiKey = apiKeyInput.value.trim();
  const model = modelSelect.value;
  if (!apiKey) { showStatus("PLEASE ENTER YOUR KIRA API KEY.", "error"); return; }

  startButton.disabled = true;
  showStatus("TESTING KIRA API CONNECTION...", "info");

  try {
    const setupRes = await fetch("/api/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey, model })
    });
    const setupData = await setupRes.json();
    if (!setupRes.ok) throw new Error(setupData?.error?.message || "SETUP FAILED.");

    const testRes = await fetch("/api/test", { method: "POST" });
    const testData = await testRes.json();
    if (!testRes.ok) throw new Error(testData?.error?.message || "CONNECTION TEST FAILED.");

    showStatus("✓ KIRA API CONNECTED SUCCESSFULLY.", "success");
    showStatusBox(model);
  } catch (error) {
    showStatus(error instanceof Error ? error.message.toUpperCase() : "SOMETHING WENT WRONG.", "error");
  } finally {
    startButton.disabled = false;
  }
});

function showStatusBox(model) {
  document.getElementById("stModel").textContent = model.toUpperCase();
  document.getElementById("stEndpoint").textContent = (window.location.origin + "/V1").toUpperCase();
  boxStatus.className = "box-status show";
}

function resetConfig() {
  boxStatus.className = "box-status";
  statusBanner.className = "status-banner";
}

function copyEndpoint() {
  const endpoint = window.location.origin + "/v1";
  navigator.clipboard.writeText(endpoint);
  showStatus("API ENDPOINT COPIED TO CLIPBOARD.", "success");
}

async function launchCodex() {
  navigator.clipboard.writeText("codex");
  showStatus("COMMAND 'codex' COPIED TO CLIPBOARD & LAUNCH TRIGGERED.", "success");
  try {
    await fetch("/api/launch-codex", { method: "POST" });
  } catch {}
}

async function init() {
  try {
    const res = await fetch("/api/status");
    const data = await res.json();
    if (data.configured && data.model) {
      modelSelect.value = data.model;
      updateModelDetail();
      showStatusBox(data.model);
    }
  } catch {}
}

loadModels().then(init);
</script>
</body>
</html>`;
}
