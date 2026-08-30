export function getWebPageHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KiraAI Route</title>
<style>
:root {
  --bg-primary: #0d0e12;
  --bg-surface: #14161f;
  --bg-input: #0a0b0e;
  --bg-hover: #1c1e2b;
  --border-color: #232636;
  --border-focus: #4f46e5;
  --text-primary: #f3f4f6;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --accent: #6366f1;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --radius: 8px;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* App Shell */
.app-header {
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-surface);
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 28px;
  height: 28px;
  background: #ffffff;
  color: #0d0e12;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 15px;
}

.brand-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  font-size: 11px;
  background: var(--border-color);
  color: var(--text-secondary);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.brand-tagline {
  color: var(--text-muted);
  font-size: 13px;
  display: none;
}

@media (min-width: 640px) {
  .brand-tagline { display: inline; }
}

.nav-tabs {
  display: flex;
  gap: 4px;
}

.nav-tab {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.15s ease;
}

.nav-tab:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.nav-tab.active {
  color: var(--text-primary);
  background: var(--border-color);
  font-weight: 600;
}

/* Main Container */
.app-container {
  max-width: 720px;
  width: 100%;
  margin: 32px auto;
  padding: 0 20px;
  flex: 1;
}

.page-section { display: none; }
.page-section.active { display: block; }

.section-header {
  margin-bottom: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
  margin-bottom: 4px;
}

.section-desc {
  color: var(--text-secondary);
  font-size: 13px;
}

/* Form Controls */
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: calc(var(--radius) + 2px);
  padding: 24px;
  margin-bottom: 20px;
}

.field {
  margin-bottom: 20px;
}

.field:last-child {
  margin-bottom: 0;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

input[type="text"],
input[type="password"],
select {
  width: 100%;
  height: 42px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  color: var(--text-primary);
  padding: 0 12px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s ease;
}

input[type="text"]:focus,
input[type="password"]:focus,
select:focus {
  border-color: var(--border-focus);
}

.eye-btn {
  position: absolute;
  right: 8px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.eye-btn:hover {
  color: var(--text-primary);
}

.field-link {
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-muted);
}

.field-link a {
  color: var(--accent);
  text-decoration: none;
}

.field-link a:hover {
  text-decoration: underline;
}

/* Model Preview Card */
.model-card {
  margin-top: 10px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 12px 14px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.model-title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.model-name {
  font-weight: 600;
  color: var(--text-primary);
}

.model-provider {
  color: var(--text-muted);
  font-size: 11px;
}

.model-meta-group {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.status-pill {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.pill-no-balance { background: rgba(16, 185, 129, 0.15); color: var(--success); }
.pill-balance { background: rgba(245, 158, 11, 0.15); color: var(--warning); }

/* Buttons */
.btn-primary {
  width: 100%;
  height: 42px;
  background: var(--text-primary);
  color: var(--bg-primary);
  border: none;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:hover { opacity: 0.9; }
.btn-primary:disabled { opacity: 0.5; cursor: wait; }

.btn-secondary {
  height: 34px;
  background: var(--bg-hover);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 0 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.btn-secondary:hover { background: var(--border-color); }

/* Status Area */
.status-box {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  font-size: 13px;
  display: none;
}

.status-box.show { display: block; }
.status-box.info { color: var(--text-secondary); border-color: var(--border-color); }
.status-box.success { color: var(--success); border-color: rgba(16, 185, 129, 0.3); }
.status-box.error { color: var(--error); border-color: rgba(239, 68, 68, 0.3); }

/* Success Panel */
.success-panel {
  display: none;
  background: var(--bg-surface);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: calc(var(--radius) + 2px);
  padding: 24px;
}

.success-panel.show { display: block; }

.success-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--success);
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 16px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.summary-item {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 12px;
}

.summary-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: var(--font-mono);
  word-break: break-all;
}

.action-row {
  display: flex;
  gap: 10px;
}

/* Usage Page Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 16px;
}

.metric-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.metric-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
}

.metric-sub {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}

/* Table */
.table-container {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  text-align: left;
}

th {
  background: var(--bg-input);
  color: var(--text-secondary);
  font-weight: 600;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
}

td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
}

tr:last-child td { border-bottom: none; }

.empty-state {
  padding: 32px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}

.status-tag {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-family: var(--font-mono);
  font-weight: 600;
}

.tag-200 { background: rgba(16, 185, 129, 0.15); color: var(--success); }
.tag-error { background: rgba(239, 68, 68, 0.15); color: var(--error); }
</style>
</head>
<body>

<!-- Header Shell -->
<header class="app-header">
  <div class="brand">
    <div class="brand-logo">K</div>
    <div class="brand-title">
      KiraAI Route <span class="badge">v0.1.2</span>
    </div>
    <span class="brand-tagline">· Local gateway for Kira AI</span>
  </div>

  <nav class="nav-tabs">
    <button id="tabSetup" class="nav-tab active" onclick="switchTab('setup')">Setup</button>
    <button id="tabUsage" class="nav-tab" onclick="switchTab('usage')">Usage</button>
  </nav>
</header>

<!-- Main Container -->
<main class="app-container">

  <!-- SETUP SECTION -->
  <section id="sectionSetup" class="page-section active">
    <div class="section-header">
      <h1 class="section-title">Gateway Configuration</h1>
      <p class="section-desc">Connect your Kira AI account and choose the default model for your local proxy server.</p>
    </div>

    <div class="card">
      <div class="field">
        <label for="apiKey">Kira API Key</label>
        <div class="input-wrapper">
          <input id="apiKey" type="password" placeholder="Paste your Kira API key" autocomplete="off">
          <button id="toggleApiKey" type="button" class="eye-btn" title="Toggle visibility" aria-label="Toggle API Key visibility">
            <svg id="eyeIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
        </div>
        <div class="field-link">
          Don't have an API key? <a href="https://kiraai.vn/developer/" target="_blank" rel="noopener">Create one at kiraai.vn/developer</a>
        </div>
      </div>

      <div class="field">
        <label for="model">Model</label>
        <select id="model"></select>
        
        <div id="modelCard" class="model-card">
          <div class="model-title-group">
            <span id="modelName" class="model-name">Select a model</span>
            <span id="modelProvider" class="model-provider">Kira AI</span>
          </div>
          <div class="model-meta-group">
            <span id="modelPill" class="status-pill pill-no-balance">Free</span>
            <span id="modelLimits" style="color: var(--text-muted); margin-top:2px;">150M tokens/day · 1M context</span>
          </div>
        </div>
      </div>

      <button id="start" class="btn-primary">Test & Start</button>

      <div id="status" class="status-box"></div>
    </div>

    <!-- SUCCESS PANEL -->
    <div id="successPanel" class="success-panel">
      <div class="success-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        KiraAI Route is running
      </div>

      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-label">Active Model</div>
          <div id="succModel" class="summary-value">kira-mini-1.0</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Local API Endpoint</div>
          <div id="succEndpoint" class="summary-value">http://127.0.0.1:4010/v1</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Codex Status</div>
          <div class="summary-value" style="color: var(--success)">Ready to connect</div>
        </div>
      </div>

      <div class="action-row">
        <button id="btnCopyEndpoint" class="btn-secondary" onclick="copyEndpoint()">Copy API Endpoint</button>
        <button id="btnReset" class="btn-secondary" onclick="resetConfig()">Stop / Reconfigure</button>
      </div>
    </div>
  </section>

  <!-- USAGE SECTION -->
  <section id="sectionUsage" class="page-section">
    <div class="section-header">
      <h1 class="section-title">Local Usage Dashboard</h1>
      <p class="section-desc">Track real-time token consumption and recent API request metrics.</p>
    </div>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Today's Tokens</div>
        <div id="metricTokens" class="metric-value">0</div>
        <div class="metric-sub">Total tokens processed</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Today's Requests</div>
        <div id="metricRequests" class="metric-value">0</div>
        <div class="metric-sub">API completion calls</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Daily Allowance</div>
        <div id="metricAllowance" class="metric-value">150M</div>
        <div class="metric-sub">Tokens per day</div>
      </div>
    </div>

    <div class="section-header" style="margin-top: 32px; margin-bottom: 16px;">
      <h2 style="font-size: 15px; font-weight: 600;">Recent Requests</h2>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Model</th>
            <th>Tokens</th>
            <th>Latency</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="logsTableBody">
          <tr>
            <td colspan="5">
              <div class="empty-state">No requests recorded yet today.</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

</main>

<script>
const modelSelect = document.getElementById("model");
const apiKeyInput = document.getElementById("apiKey");
const startButton = document.getElementById("start");
const statusBox = document.getElementById("status");
const successPanel = document.getElementById("successPanel");
const toggleApiKeyBtn = document.getElementById("toggleApiKey");
const eyeIcon = document.getElementById("eyeIcon");

let models = [];

// Tab Switcher
function switchTab(tab) {
  document.getElementById("tabSetup").className = "nav-tab " + (tab === 'setup' ? 'active' : '');
  document.getElementById("tabUsage").className = "nav-tab " + (tab === 'usage' ? 'active' : '');
  document.getElementById("sectionSetup").className = "page-section " + (tab === 'setup' ? 'active' : '');
  document.getElementById("sectionUsage").className = "page-section " + (tab === 'usage' ? 'active' : '');
  if (tab === 'usage') loadMetrics();
}

// Password Eye Toggle
toggleApiKeyBtn.addEventListener("click", () => {
  const isPassword = apiKeyInput.type === "password";
  apiKeyInput.type = isPassword ? "text" : "password";
  eyeIcon.innerHTML = isPassword
    ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>'
    : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
});

function status(message, type) {
  statusBox.className = "status-box show " + (type || "info");
  statusBox.textContent = message;
}

function updateModelCard() {
  const model = models.find(item => item.id === modelSelect.value);
  if (!model) return;

  document.getElementById("modelName").textContent = model.name;
  document.getElementById("modelProvider").textContent = model.provider;
  document.getElementById("modelLimits").textContent = model.daily_limit + " · " + (model.context_window / 1000).toLocaleString() + "k context";
  
  const pill = document.getElementById("modelPill");
  if (model.balance_required) {
    pill.className = "status-pill pill-balance";
    pill.textContent = "Balance > 0 VND";
  } else {
    pill.className = "status-pill pill-no-balance";
    pill.textContent = "Free (No balance)";
  }
}

async function loadModels() {
  try {
    const response = await fetch("/api/models");
    const data = await response.json();
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
    updateModelCard();
  } catch {
    status("Could not load models list.", "error");
  }
}

modelSelect.addEventListener("change", updateModelCard);

startButton.addEventListener("click", async () => {
  const apiKey = apiKeyInput.value.trim();
  const model = modelSelect.value;
  if (!apiKey) { status("Please enter your Kira API key.", "error"); return; }

  startButton.disabled = true;
  status("Testing Kira API connection...", "info");

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
    if (!testRes.ok) throw new Error(testData?.error?.message || "Could not connect to Kira AI. Check your API key and try again.");

    status("✓ Kira API connected successfully.", "success");
    showSuccessState(model);
  } catch (error) {
    status(error instanceof Error ? error.message : "Something went wrong.", "error");
  } finally {
    startButton.disabled = false;
  }
});

function showSuccessState(model) {
  document.getElementById("succModel").textContent = model;
  document.getElementById("succEndpoint").textContent = window.location.origin + "/v1";
  successPanel.className = "success-panel show";
}

function resetConfig() {
  successPanel.className = "success-panel";
  statusBox.className = "status-box";
}

function copyEndpoint() {
  const endpoint = window.location.origin + "/v1";
  navigator.clipboard.writeText(endpoint);
  const btn = document.getElementById("btnCopyEndpoint");
  btn.textContent = "Copied!";
  setTimeout(() => { btn.textContent = "Copy API Endpoint"; }, 2000);
}

async function loadMetrics() {
  try {
    const res = await fetch("/api/metrics");
    const data = await res.json();

    document.getElementById("metricTokens").textContent = data.todayTokens.toLocaleString();
    document.getElementById("metricRequests").textContent = data.todayRequests.toLocaleString();

    const tbody = document.getElementById("logsTableBody");
    if (!data.recentRequests || data.recentRequests.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state">No requests recorded yet today.</div></td></tr>';
      return;
    }

    tbody.innerHTML = data.recentRequests.map(r => \`
      <tr>
        <td style="font-family:var(--font-mono); font-size:12px; color:var(--text-secondary);">\${r.time}</td>
        <td style="font-weight:500;">\${r.model}</td>
        <td style="font-family:var(--font-mono);">\${r.tokens.toLocaleString()}</td>
        <td style="font-family:var(--font-mono); color:var(--text-secondary);">\${r.latencyMs} ms</td>
        <td><span class="status-tag \${r.status === 200 ? 'tag-200' : 'tag-error'}">\${r.status}</span></td>
      </tr>
    \`).join("");
  } catch {
    // Ignore metrics fetch error
  }
}

// Initial Load Check
async function checkStatus() {
  try {
    const res = await fetch("/api/status");
    const data = await res.json();
    if (data.configured && data.model) {
      modelSelect.value = data.model;
      updateModelCard();
      showSuccessState(data.model);
    }
  } catch {}
}

loadModels().then(checkStatus);
</script>
</body>
</html>`;
}
