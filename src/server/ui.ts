import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getPackageVersion(): string {
  try {
    const pkgPath = join(__dirname, "..", "..", "package.json");
    if (existsSync(pkgPath)) {
      const data = JSON.parse(readFileSync(pkgPath, "utf-8"));
      if (data?.version) return data.version;
    }
  } catch { }
  return "0.4.1";
}

const currentVersion = getPackageVersion();

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
  color-scheme: dark;
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
input[type="password"] {
  width: 100%;
  height: 46px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-input);
  color: var(--text-primary);
  padding: 0 42px 0 14px;
  font-family: var(--font-sans);
  font-size: 13px;
  outline: none;
  transition: all 0.15s ease;
}

select.model-select {
  color-scheme: dark;
  width: 100%;
  height: 48px;
  background-color: #1a1410;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23c88d51' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-input);
  color: #f5eedc;
  padding: 0 40px 0 14px;
  font-family: var(--font-sans);
  font-size: 13.5px;
  font-weight: 600;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  transition: border-color 0.15s ease;
}

select.model-select:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

select.model-select option {
  background-color: #191410;
  color: #f5eedc;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 500;
}

select.model-select optgroup {
  background-color: #120e0b;
  color: #c88d51;
  font-weight: 700;
  font-size: 12px;
}

.eye-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: color 0.15s ease;
  z-index: 2;
}

.eye-btn svg {
  pointer-events: none;
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

/* Modal Overlay & Dialog */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(10, 8, 6, 0.82);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, visibility 0.25s ease;
  padding: 20px;
}
.modal-overlay.active {
  opacity: 1;
  visibility: visible;
}
.modal-card {
  background: var(--bg-card);
  border: 1px solid var(--border-hover);
  border-radius: 20px;
  width: 100%;
  max-width: 580px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(200, 141, 81, 0.15);
  transform: translateY(20px) scale(0.96);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.modal-overlay.active .modal-card {
  transform: translateY(0) scale(1);
}
.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.02);
}
.modal-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}
.status-indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--status-green);
  box-shadow: 0 0 10px var(--status-green);
}
.status-indicator-dot.warning {
  background: var(--status-amber);
  box-shadow: 0 0 10px var(--status-amber);
}
.status-indicator-dot.error {
  background: var(--status-red);
  box-shadow: 0 0 10px var(--status-red);
}
.modal-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--text-primary);
}
.modal-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
}
.modal-close-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
  padding: 4px 8px;
  border-radius: 6px;
  transition: color 0.15s ease;
}
.modal-close-btn:hover { color: var(--text-primary); }

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-height: 75vh;
  overflow-y: auto;
}
.modal-status-banner {
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  line-height: 1.45;
  transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  transform: scale(1);
}
.modal-status-banner:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
}
.modal-status-banner.success {
  background: rgba(20, 83, 45, 0.45);
  border-left: 4px solid #22c55e;
  color: #f0fdf4;
}
.modal-status-banner.success:hover {
  background: rgba(20, 83, 45, 0.65);
}
.modal-status-banner.info {
  background: rgba(30, 58, 138, 0.45);
  border-left: 4px solid #3b82f6;
  color: #eff6ff;
}
.modal-status-banner.info:hover {
  background: rgba(30, 58, 138, 0.65);
}
.modal-status-banner.warning {
  background: rgba(113, 63, 18, 0.45);
  border-left: 4px solid #eab308;
  color: #fefce8;
}
.modal-status-banner.warning:hover {
  background: rgba(113, 63, 18, 0.65);
}
.modal-status-banner.error {
  background: rgba(127, 29, 29, 0.45);
  border-left: 4px solid #ef4444;
  color: #fef2f2;
}
.modal-status-banner.error:hover {
  background: rgba(127, 29, 29, 0.65);
}
.modal-banner-icon { font-size: 18px; line-height: 1; flex-shrink: 0; }
.modal-banner-text strong { display: block; margin-bottom: 2px; }

.modal-info-box {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 16px;
}
.modal-box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.modal-box-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: var(--text-muted);
}
.modal-model-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}
.modal-model-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-primary);
}
.modal-model-code {
  font-family: var(--font-mono);
  font-size: 12px;
  background: rgba(200, 141, 81, 0.15);
  color: var(--accent-primary);
  padding: 2px 8px;
  border-radius: 6px;
}
.modal-model-desc {
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.45;
  margin-bottom: 12px;
}
.modal-model-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 10px;
}
.meta-item { display: flex; flex-direction: column; gap: 2px; }
.meta-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; }
.meta-value { font-size: 12px; font-weight: 700; color: var(--text-primary); }

.modal-section-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: var(--text-muted);
}
.modal-check-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.check-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px 14px;
}
.check-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}
.check-icon.success { background: rgba(16, 185, 129, 0.2); color: #34d399; }
.check-title { font-size: 13px; font-weight: 700; color: var(--text-primary); }
.check-detail { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

.modal-footer {
  padding: 18px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.02);
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  vertical-align: middle;
}
@keyframes spin {
  to { transform: rotate(360deg); }
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

/* Status Toast - Uiverse.io Alert Card Design */
.status-toast {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 13px;
  display: none;
  align-items: center;
  gap: 10px;
  line-height: 1.45;
  transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  transform: scale(1);
}

.status-toast:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
}

.status-toast.show { display: flex; }
.status-toast.info {
  background: rgba(30, 58, 138, 0.45);
  border-left: 4px solid #3b82f6;
  color: #eff6ff;
}
.status-toast.info:hover { background: rgba(30, 58, 138, 0.65); }

.status-toast.success {
  background: rgba(20, 83, 45, 0.45);
  border-left: 4px solid #22c55e;
  color: #f0fdf4;
}
.status-toast.success:hover { background: rgba(20, 83, 45, 0.65); }

.status-toast.warning {
  background: rgba(113, 63, 18, 0.45);
  border-left: 4px solid #eab308;
  color: #fefce8;
}
.status-toast.warning:hover { background: rgba(113, 63, 18, 0.65); }

.status-toast.error {
  background: rgba(127, 29, 29, 0.45);
  border-left: 4px solid #ef4444;
  color: #fef2f2;
}
.status-toast.error:hover { background: rgba(127, 29, 29, 0.65); }

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

.skill-card {
  margin-top: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  padding: 24px;
  box-shadow: var(--shadow-card);
}
.skill-header {
  margin-bottom: 12px;
}
.skill-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.skill-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-heading);
}
.skill-description {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}
.skill-actions-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}
.skill-preview-box {
  margin-top: 16px;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 8px;
  max-height: 420px;
  overflow-y: auto;
  padding: 20px;
  font-size: 13px;
  color: #c9d1d9;
  line-height: 1.6;
}

.rendered-markdown {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.rendered-markdown h1 {
  font-size: 18px;
  font-weight: 700;
  color: #f0f6fc;
  border-bottom: 1px solid #30363d;
  padding-bottom: 8px;
  margin-top: 16px;
  margin-bottom: 12px;
}
.rendered-markdown h2 {
  font-size: 15px;
  font-weight: 600;
  color: #f0f6fc;
  border-bottom: 1px solid rgba(48, 54, 61, 0.5);
  padding-bottom: 4px;
  margin-top: 18px;
  margin-bottom: 10px;
}
.rendered-markdown h3 {
  font-size: 13.5px;
  font-weight: 600;
  color: #58a6ff;
  margin-top: 14px;
  margin-bottom: 8px;
}
.rendered-markdown p {
  margin-bottom: 10px;
  color: #c9d1d9;
}
.rendered-markdown ul, .rendered-markdown ol {
  padding-left: 20px;
  margin-bottom: 12px;
}
.rendered-markdown li {
  margin-bottom: 4px;
}
.rendered-markdown hr {
  border: 0;
  border-top: 1px solid #30363d;
  margin: 16px 0;
}
.rendered-markdown table {
  width: 100%;
  border-collapse: collapse;
  margin: 14px 0;
  font-size: 12px;
}
.rendered-markdown th, .rendered-markdown td {
  border: 1px solid #30363d;
  padding: 8px 10px;
  text-align: left;
}
.rendered-markdown th {
  background: #161b22;
  color: #f0f6fc;
  font-weight: 600;
}
.rendered-markdown tr:nth-child(even) {
  background: rgba(255, 255, 255, 0.02);
}
.rendered-markdown code.inline-code {
  background: rgba(110, 118, 129, 0.2);
  color: #ff7b72;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 11.5px;
}
.rendered-markdown pre {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 12px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 11.5px;
  color: #e6edf3;
  margin: 12px 0;
  line-height: 1.5;
}
.rendered-markdown pre code {
  background: none;
  padding: 0;
  color: inherit;
}

/* Quick AI Chatbot Card - Uiverse.io by Cobp (Kira AI Palette) */
.quick-ai-card {
  margin-top: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  padding: 20px;
  box-shadow: var(--shadow-card);
}

.card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.card-section-title {
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: var(--text-muted);
}

.container_chat_bot {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.container_chat_bot .container-chat-options {
  position: relative;
  display: flex;
  background: linear-gradient(
    135deg,
    var(--accent-primary) 0%,
    var(--border-hover) 35%,
    var(--border-color) 70%,
    var(--bg-input) 100%
  );
  border-radius: 16px;
  padding: 1.5px;
  overflow: hidden;
}

.container_chat_bot .container-chat-options::after {
  position: absolute;
  content: "";
  top: -10px;
  left: -10px;
  background: radial-gradient(
    ellipse at center,
    rgba(200, 141, 81, 0.7),
    rgba(200, 141, 81, 0.25),
    rgba(200, 141, 81, 0.08),
    rgba(0, 0, 0, 0)
  );
  width: 35px;
  height: 35px;
  filter: blur(1px);
  pointer-events: none;
}

.container_chat_bot .container-chat-options .chat {
  display: flex;
  flex-direction: column;
  background-color: rgba(18, 14, 11, 0.95);
  border-radius: 15px;
  width: 100%;
  overflow: hidden;
}

.container_chat_bot .container-chat-options .chat .chat-bot {
  position: relative;
  display: flex;
}

.container_chat_bot .chat .chat-bot textarea {
  background-color: transparent;
  border-radius: 16px;
  border: none;
  width: 100%;
  height: 58px;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 400;
  padding: 12px 14px;
  resize: none;
  outline: none;
}

.container_chat_bot .chat .chat-bot textarea::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.container_chat_bot .chat .chat-bot textarea::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}
.container_chat_bot .chat .chat-bot textarea::-webkit-scrollbar-thumb:hover {
  background: var(--accent-primary);
}

.container_chat_bot .chat .chat-bot textarea::placeholder {
  color: var(--text-muted);
  transition: all 0.3s ease;
}

.container_chat_bot .chat .chat-bot textarea:focus::placeholder {
  color: transparent;
}

.container_chat_bot .chat .options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-top: 1px solid rgba(53, 41, 32, 0.5);
  background: rgba(18, 14, 11, 0.6);
}

.container_chat_bot .chat .options .btns-add {
  display: flex;
  gap: 8px;
}

.container_chat_bot .chat .options .btns-add button {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.container_chat_bot .chat .options .btns-add button:hover {
  transform: translateY(-3px);
  color: var(--accent-primary);
}

.container_chat_bot .chat .options .btn-submit {
  display: flex;
  padding: 2px;
  background-image: linear-gradient(to top, #352920, var(--accent-primary), #352920);
  border-radius: 10px;
  box-shadow: inset 0 6px 2px -4px rgba(255, 255, 255, 0.3);
  cursor: pointer;
  border: none;
  outline: none;
  transition: all 0.15s ease;
}

.container_chat_bot .chat .options .btn-submit i {
  width: 32px;
  height: 32px;
  padding: 6px;
  background: rgba(18, 14, 11, 0.85);
  border-radius: 9px;
  backdrop-filter: blur(3px);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.container_chat_bot .chat .options .btn-submit svg {
  width: 18px;
  height: 18px;
  transition: all 0.3s ease;
}

.container_chat_bot .chat .options .btn-submit:hover svg {
  color: var(--accent-primary);
  filter: drop-shadow(0 0 6px var(--accent-primary));
}

.container_chat_bot .chat .options .btn-submit:focus svg,
.container_chat_bot .chat .options .btn-submit.active svg {
  color: var(--accent-primary);
  filter: drop-shadow(0 0 8px var(--accent-primary));
  transform: scale(1.15) rotate(45deg) translateX(-1px) translateY(1px);
}

.container_chat_bot .chat .options .btn-submit:active {
  transform: scale(0.92);
}

.container_chat_bot .tags {
  padding: 12px 0 0 0;
  display: flex;
  color: var(--text-primary);
  font-size: 11.5px;
  gap: 6px;
  flex-wrap: wrap;
}

.container_chat_bot .tags span {
  padding: 4px 10px;
  background-color: var(--bg-input);
  border: 1.5px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.container_chat_bot .tags span:hover {
  border-color: var(--accent-primary);
  color: var(--text-primary);
  background: var(--bg-hover);
  transform: translateY(-1px);
}

.ai-chat-response {
  margin-top: 14px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 14px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-primary);
  overflow-x: auto;
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
      <span class="version-pill">v${currentVersion}</span>
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
        <select id="model" class="model-select">
          <optgroup label="FREE MODELS — NO DEPOSIT REQUIRED (0 VND)">
            <option value="kira-auto">Kira Auto — Auto Routing / Smart Text [kira-auto]</option>
            <option value="kira-2.0">Kira Mini 2.0 — Fast Text & Code [kira-2.0]</option>
            <option value="kira-mini-1.0" selected>Kira Mini 1.0 — General Text & Code [kira-mini-1.0]</option>
            <option value="mimo-v2.5">Mimo V2.5 — Reasoning & Logic [mimo-v2.5]</option>
            <option value="hy3">Tencent Hy3 Free — Agent & Coding [hy3]</option>
          </optgroup>
          <optgroup label="FREE MODELS — BALANCE > 0 VND REQUIRED (Not Deducted)">
            <option value="deepseek-v4-flash-free">DeepSeek V4 Flash Free — High-Speed Code & Text [deepseek-v4-flash-free]</option>
            <option value="deepseek-v4-flash-vision-exp">DeepSeek V4 Vision Exp — Vision & Multimodal Image [deepseek-v4-flash-vision-exp]</option>
            <option value="qwen3.8-flash">Qwen 3.8 Flash — Coding & Multimodal [qwen3.8-flash]</option>
            <option value="qwen3.8-27b-free">Qwen 3.8 27B Free — General Text & Code [qwen3.8-27b-free]</option>
            <option value="glm-5.3-flash">GLM 5.3 Flash — High-Perf Code & Multimodal [glm-5.3-flash]</option>
            <option value="ling-3.0-flash-sante-free">Ling 3.0 Flash Sante — Medical & Health AI [ling-3.0-flash-sante-free]</option>
            <option value="minimax-m3-free">MiniMax M3 Free — Multi-Agent & Audio/Voice [minimax-m3-free]</option>
            <option value="minimax-m2.7">MiniMax M2.7 — Multi-Agent & Audio/Voice [minimax-m2.7]</option>
            <option value="gpt-5.6-luna-free">GPT 5.6 Luna Free — General Text & Reasoning [gpt-5.6-luna-free]</option>
          </optgroup>
        </select>

        <div id="modelInspector" class="model-inspector">
          <div class="inspector-info" style="flex: 1; padding-right: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px;">
              <span id="mName" class="inspector-title">Kira Mini 1.0</span>
              <span id="mType" class="badge-tag" style="background: rgba(200, 141, 81, 0.15); color: var(--accent-primary); border: 1px solid rgba(200, 141, 81, 0.3);">Text & Code</span>
            </div>
            <span id="mProvider" class="inspector-provider">Kira AI</span>
            <div id="mDesc" style="font-size: 12px; color: var(--text-secondary); margin-top: 6px; line-height: 1.4;"></div>
          </div>
          <div class="inspector-badge-group">
            <span id="mBadge" class="badge-tag tag-free">Free Model</span>
            <span id="mLimits" class="inspector-limits">150M tokens/day · 1M context</span>
            <button type="button" id="btnTestModel" class="btn-secondary" style="width: auto; height: 28px; padding: 0 10px; font-size: 11.5px; margin-top: 6px;">🧪 Test Model</button>
          </div>
        </div>
      </div>

      <button id="start" type="button" class="btn-primary">
        <span>⚡ Test & Auto-Configure All AI Tools</span>
      </button>
      <div style="font-size: 11.5px; color: var(--text-muted); text-align: center; margin-top: 6px;">
        Automatically configures Codex, ChatGPT Desktop & Claude Code CLI.
      </div>

      <div id="status" class="status-toast"></div>
    </div>

    <!-- Right Status Panel -->
    <div id="statusPanel" class="status-panel">
      <div class="panel-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        KiraAI Route Gateway Active
      </div>

      <div id="setupSuccessBanner" role="alert" class="modal-status-banner success" style="margin-bottom: 16px;">
        <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" style="width:20px; height:20px; flex-shrink:0; margin-top:2px; color:#4ade80;" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
        </svg>
        <div>
          <strong style="display: block; font-size: 13.5px; margin-bottom: 2px;">Codex Configured Successfully!</strong>
          <span style="font-size: 12px; opacity: 0.9;">Your <code style="background: rgba(0,0,0,0.4); padding: 1px 5px; border-radius: 4px; color: #6ee7b7;">~/.codex/config.toml</code> and environment variables are active. You may now launch and test!</span>
        </div>
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
          <button id="btnCopyEndpoint" type="button" class="btn-icon" title="Copy Endpoint">
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
        <button id="btnLaunchCodex" type="button" class="btn-launch">
          <img src="/codex-logo.webp" class="btn-icon-img" alt="Codex Logo" onerror="this.style.display='none'">
          <span>Launch Codex</span>
        </button>
        <button id="btnLaunchClaude" type="button" class="btn-launch" style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%); box-shadow: 0 4px 14px rgba(217, 119, 6, 0.3);">
          <span>⚡ Launch Claude Code</span>
        </button>
        <button id="btnSyncTools" type="button" class="btn-secondary">
          <span>🔄 Auto-Sync Codex & Claude</span>
        </button>
        <button id="btnCopyEndpoint2" type="button" class="btn-secondary">
          <span>📋 Copy API Endpoint</span>
        </button>
        <button id="btnResetConfig" type="button" class="btn-secondary">
          <span>🔄 Reconfigure</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Standalone Quick AI Chatbot Playground (Uiverse.io Design) -->
  <div id="playgroundSection" class="quick-ai-card">
    <div class="card-title-row">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px;">🎮</span>
        <span class="card-section-title" style="font-size: 13px;">STANDALONE AI PLAYGROUND</span>
      </div>
      <span class="badge-tag tag-free">Live Model Query</span>
    </div>
    <div class="container_chat_bot">
      <div class="container-chat-options">
        <div class="chat">
          <div class="chat-bot">
            <textarea
              id="chat_bot_input"
              name="chat_bot"
              placeholder="Imagine Something...✦˚ (e.g. Write a python web scraper)"
            ></textarea>
          </div>
          <div class="options">
            <div class="btns-add">
              <button id="btnAttachPrompt" type="button" title="Attach Code Snippet">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8"></path>
                </svg>
              </button>
              <button id="btnSystemPrompt" type="button" title="Add System Rule">
                <svg viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm0 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm0-8h6m-3-3v6" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" fill="none"></path>
                </svg>
              </button>
              <button id="btnModelParams" type="button" title="Model Parameters">
                <svg viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-2.29-2.333A17.9 17.9 0 0 1 8.027 13H4.062a8.01 8.01 0 0 0 5.648 6.667M10.03 13c.151 2.439.848 4.73 1.97 6.752A15.9 15.9 0 0 0 13.97 13zm9.908 0h-3.965a17.9 17.9 0 0 1-1.683 6.667A8.01 8.01 0 0 0 19.938 13M4.062 11h3.965A17.9 17.9 0 0 1 9.71 4.333A8.01 8.01 0 0 0 4.062 11m5.969 0h3.938A15.9 15.9 0 0 0 12 4.248A15.9 15.9 0 0 0 10.03 11m4.259-6.667A17.9 17.9 0 0 1 15.973 11h3.965a8.01 8.01 0 0 0-5.648-6.667" fill="currentColor"></path>
                </svg>
              </button>
            </div>
            <button id="btnSubmitAiChat" class="btn-submit" type="button" title="Send Prompt to Kira AI">
              <i>
                <svg viewBox="0 0 512 512">
                  <path fill="currentColor" d="M473 39.05a24 24 0 0 0-25.5-5.46L47.47 185h-.08a24 24 0 0 0 1 45.16l.41.13l137.3 58.63a16 16 0 0 0 15.54-3.59L422 80a7.07 7.07 0 0 1 10 10L226.66 310.26a16 16 0 0 0-3.59 15.54l58.65 137.38c.06.2.12.38.19.57c3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0 0 23-15.46L478.39 64.62A24 24 0 0 0 473 39.05"></path>
                </svg>
              </i>
            </button>
          </div>
        </div>
      </div>
      <div class="tags">
        <span id="tagPython">🐍 Python Script</span>
        <span id="tagGateway">⚡ Gateway Route</span>
        <span id="tagTsApi">💻 TS API</span>
      </div>
    </div>
    <div id="aiChatResponse" class="ai-chat-response" style="display: none;"></div>
  </div>

  <!-- AI Assistant Integration Skill Section -->
  <div class="skill-card">
    <div class="skill-header">
      <div class="skill-title-group">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        <span class="skill-title">AI Assistant Integration Skill (SKILL.md)</span>
        <span class="badge-tag tag-free">Preconfigured Context</span>
      </div>
      <p class="skill-description">
        Provide preconfigured context for your AI coding assistants (<strong>Cursor, Codex, Cline, Roo Code, Claude Code, Antigravity</strong>) to accurately understand Kira AI API structures, supported models, and generate precise integration code for NodeJS, PHP, Python, and WordPress.
      </p>
    </div>

    <div class="skill-actions-row">
      <button id="btnCopySkill" type="button" class="btn-secondary" style="width: auto; padding: 0 16px;">
        <span>📋 Copy SKILL.md</span>
      </button>
      <a href="/api/skill/download" download="SKILL.md" class="btn-secondary" style="width: auto; padding: 0 16px; text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">
        <span>📥 Download SKILL.md</span>
      </a>
      <button id="btnToggleSkill" type="button" class="btn-secondary" style="width: auto; padding: 0 16px;">
        <span>👁️ <span id="skillPreviewToggleText">View Skill Context</span></span>
      </button>
    </div>

    <div id="skillPreviewContainer" class="skill-preview-box rendered-markdown" style="display: none;"></div>
  </div>
</main>

<!-- Interactive Configuration Popup Modal -->
<div id="configModalOverlay" class="modal-overlay">
  <div class="modal-card">
    <div class="modal-header">
      <div class="modal-title-group">
        <div id="modalStatusDot" class="status-indicator-dot"></div>
        <div>
          <h2 class="modal-title">Model Configuration & Status</h2>
          <p id="modalSubtitle" class="modal-subtitle">Auto-configured for Codex & Claude Code</p>
        </div>
      </div>
      <button id="btnCloseModal" type="button" class="modal-close-btn" aria-label="Close modal">&times;</button>
    </div>

    <div class="modal-body">
      <!-- Status Banner -->
      <div id="modalBanner" class="modal-status-banner success">
        <span id="modalBannerIcon" class="modal-banner-icon">✅</span>
        <div id="modalBannerText" class="modal-banner-text">Connected to Kira AI upstream servers!</div>
      </div>

      <!-- Active Model Information -->
      <div class="modal-info-box">
        <div class="modal-box-header">
          <span class="modal-box-label">SELECTED MODEL</span>
          <span id="modalModelBadge" class="badge-tag tag-free">Free Model</span>
        </div>
        <div class="modal-model-title-row">
          <span id="modalModelName" class="modal-model-name">Kira Mini 1.0</span>
          <code id="modalModelId" class="modal-model-code">kira-mini-1.0</code>
        </div>
        <div id="modalModelDesc" class="modal-model-desc">Powered by DeepSeek V4 Flash architecture...</div>
        <div class="modal-model-meta-grid">
          <div class="meta-item">
            <span class="meta-label">Provider</span>
            <span id="modalModelProvider" class="meta-value">Kira AI</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Context Window</span>
            <span id="modalModelContext" class="meta-value">1M tokens</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Daily Limit</span>
            <span id="modalModelLimit" class="meta-value">150M / day</span>
          </div>
        </div>
      </div>

      <!-- Auto-Configured Tools Checklist -->
      <div class="modal-section-title">AUTO-CONFIGURED TOOLS & PROXIES</div>
      <div class="modal-check-list">
        <div class="check-item">
          <div class="check-icon success">✓</div>
          <div class="check-content">
            <div class="check-title">Codex & ChatGPT Desktop</div>
            <div class="check-detail">Updated <code id="modalCodexPath">~/.codex/config.toml</code> (<span style="color:#c88d51">wire_api = "responses"</span>)</div>
          </div>
        </div>
        <div class="check-item">
          <div class="check-icon success">✓</div>
          <div class="check-content">
            <div class="check-title">Claude Code CLI</div>
            <div class="check-detail">Environment variables set: <code>ANTHROPIC_BASE_URL</code> & key</div>
          </div>
        </div>
        <div class="check-item">
          <div class="check-icon success">✓</div>
          <div class="check-content">
            <div class="check-title">Local Proxy Endpoint</div>
            <div class="check-detail"><code id="modalEndpointUrl">http://127.0.0.1:4010/v1</code></div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button id="modalBtnLaunchCodex" type="button" class="btn-launch" style="flex: 1;">
        <img src="/codex-logo.webp" class="btn-icon-img" alt="Codex Logo" onerror="this.style.display='none'">
        <span>Launch Codex</span>
      </button>
      <button id="modalBtnLaunchClaude" type="button" class="btn-launch" style="flex: 1; background: linear-gradient(135deg, #d97706 0%, #b45309 100%);">
        <span>⚡ Launch Claude</span>
      </button>
      <button id="modalBtnClose" type="button" class="btn-secondary" style="width: auto; padding: 0 18px;">
        <span>Close</span>
      </button>
    </div>
  </div>
</div>

<script>
(function() {
  const models = [
    { id: "kira-auto", name: "Kira Auto", provider: "Kira AI", free: true, balance_required: false, typeLabel: "Auto Routing / Smart Text", daily_limit: "150M tokens/day", context_window: 1000000, description: "Automatically routes requests across top models for optimal speed and uptime." },
    { id: "kira-2.0", name: "Kira Mini 2.0", provider: "Kira AI", free: true, balance_required: false, typeLabel: "Fast Text & Code", daily_limit: "150M tokens/day", context_window: 1000000, description: "120B parameter open-source model optimized for high-speed response, general text, and coding." },
    { id: "kira-mini-1.0", name: "Kira Mini 1.0", provider: "Kira AI", free: true, balance_required: false, typeLabel: "General Text & Code", daily_limit: "150M tokens/day", context_window: 1000000, description: "Powered by DeepSeek V4 Flash architecture, versatile model ideal for daily coding tasks." },
    { id: "mimo-v2.5", name: "Mimo V2.5", provider: "Xiaomi", free: true, balance_required: false, typeLabel: "Reasoning & Logic", daily_limit: "150M tokens/day", context_window: 128000, description: "Xiaomi near-flagship cost-optimized model focused on complex logical reasoning, math, and problem solving." },
    { id: "hy3", name: "Tencent Hy3 Free", provider: "Tencent", free: true, balance_required: false, typeLabel: "Agent & Coding", daily_limit: "150M tokens/day", context_window: 128000, description: "Tencent commercial-grade model engineered for autonomous AI agents and complex coding." },
    { id: "deepseek-v4-flash-free", name: "DeepSeek V4 Flash Free", provider: "DeepSeek", free: true, balance_required: true, typeLabel: "High-Speed Code & Text", daily_limit: "250M tokens/day", context_window: 1000000, description: "Lightweight, high-speed 284B parameter model from DeepSeek V4 family." },
    { id: "deepseek-v4-flash-vision-exp", name: "DeepSeek V4 Vision Exp", provider: "DeepSeek", free: true, balance_required: true, typeLabel: "Vision & Multimodal Image", daily_limit: "250M tokens/day", context_window: 128000, description: "Experimental multimodal vision model capable of parsing images, visual code screenshots, charts, and diagrams." },
    { id: "qwen3.8-flash", name: "Qwen 3.8 Flash", provider: "Qwen", free: true, balance_required: true, typeLabel: "Coding & Multimodal", daily_limit: "250M tokens/day", context_window: 128000, description: "Ultra-fast multimodal model from Alibaba, tuned specifically for software engineering." },
    { id: "qwen3.8-27b-free", name: "Qwen 3.8 27B Free", provider: "Qwen", free: true, balance_required: true, typeLabel: "General Text & Code", daily_limit: "250M tokens/day", context_window: 128000, description: "27B parameter model provided for testing, providing balanced performance." },
    { id: "glm-5.3-flash", name: "GLM 5.3 Flash", provider: "GLM / Z.AI", free: true, balance_required: true, typeLabel: "High-Perf Code & Multimodal", daily_limit: "250M tokens/day", context_window: 128000, description: "High-performance multimodal model from Z.AI supporting fast execution." },
    { id: "ling-3.0-flash-sante-free", name: "Ling 3.0 Flash Sante", provider: "InclusionAI", free: true, balance_required: true, typeLabel: "Medical & Health AI", daily_limit: "250M tokens/day", context_window: 128000, description: "InclusionAI specialized language model tailored for healthcare and bio-health queries." },
    { id: "minimax-m3-free", name: "MiniMax M3 Free", provider: "MiniMax", free: true, balance_required: true, typeLabel: "Multi-Agent & Audio/Voice", daily_limit: "250M tokens/day", context_window: 128000, description: "Breakthrough multi-agent AI model with real-time speech processing and voice audio synthesis." },
    { id: "minimax-m2.7", name: "MiniMax M2.7", provider: "MiniMax", free: true, balance_required: true, typeLabel: "Multi-Agent & Audio/Voice", daily_limit: "250M tokens/day", context_window: 128000, description: "High-speed multi-agent conversational engine supporting voice synthesis." },
    { id: "gpt-5.6-luna-free", name: "GPT 5.6 Luna Free", provider: "OpenAI Compatible", free: true, balance_required: true, typeLabel: "General Text & Reasoning", daily_limit: "250M tokens/day", context_window: 1000000, description: "High-capacity language model for creative writing and structural synthesis." }
  ];

  let modelSelect, apiKeyInput, startButton, btnTestModel, statusToast, statusPanel;
  let modalOverlay, modalStatusDot, modalBanner, modalBannerIcon, modalBannerText;

  function initElements() {
    modelSelect = document.getElementById("model");
    apiKeyInput = document.getElementById("apiKey");
    startButton = document.getElementById("start");
    btnTestModel = document.getElementById("btnTestModel");
    statusToast = document.getElementById("status");
    statusPanel = document.getElementById("statusPanel");

    modalOverlay = document.getElementById("configModalOverlay");
    modalStatusDot = document.getElementById("modalStatusDot");
    modalBanner = document.getElementById("modalBanner");
    modalBannerIcon = document.getElementById("modalBannerIcon");
    modalBannerText = document.getElementById("modalBannerText");
  }

  function showStatus(message, type) {
    if (!statusToast) return;
    const t = type || "info";
    let iconColor = "#60a5fa";
    if (t === "success") iconColor = "#4ade80";
    else if (t === "warning") iconColor = "#fde047";
    else if (t === "error") iconColor = "#f87171";

    statusToast.className = "status-toast show " + t;
    statusToast.setAttribute("role", "alert");
    statusToast.innerHTML = '<svg stroke="currentColor" viewBox="0 0 24 24" fill="none" style="width:20px; height:20px; flex-shrink:0; color:' + iconColor + ';" xmlns="http://www.w3.org/2000/svg"><path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path></svg><span style="font-size:12.5px; font-weight:600;">' + message + '</span>';
  }

  function updateModelInspector() {
    if (!modelSelect) return;
    const selectedVal = modelSelect.value;
    const model = models.find(m => m.id === selectedVal) || models[0];
    if (!model) return;

    const mName = document.getElementById("mName");
    if (mName) mName.textContent = model.name;

    const mProvider = document.getElementById("mProvider");
    if (mProvider) mProvider.textContent = "Provider: " + model.provider;

    const mLimits = document.getElementById("mLimits");
    if (mLimits) mLimits.textContent = (model.daily_limit || "") + " · " + (model.context_window ? (model.context_window / 1000).toLocaleString() + "k context" : "");

    const mDesc = document.getElementById("mDesc");
    if (mDesc) mDesc.textContent = model.description || "";

    const mType = document.getElementById("mType");
    if (mType) mType.textContent = model.typeLabel || "General AI";

    const badge = document.getElementById("mBadge");
    if (badge) {
      if (model.balance_required) {
        badge.className = "badge-tag tag-balance";
        badge.textContent = "Free (Requires Balance > 0 VND)";
      } else {
        badge.className = "badge-tag tag-free";
        badge.textContent = "Free (0 Deposit Required)";
      }
    }
  }

  function showStatusPanel(modelId, autoScroll) {
    const selectedId = modelId || (modelSelect ? modelSelect.value : "kira-mini-1.0");
    const stModel = document.getElementById("stModel");
    if (stModel) stModel.textContent = selectedId;

    const stEndpoint = document.getElementById("stEndpoint");
    if (stEndpoint) stEndpoint.textContent = window.location.origin + "/v1";

    const banner = document.getElementById("setupSuccessBanner");
    if (banner) banner.style.display = "flex";

    if (statusPanel) {
      statusPanel.className = "status-panel show";
      if (autoScroll === true) {
        statusPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }

  function showConfigModal(data) {
    if (!modalOverlay) return;
    const selectedId = data.model || (modelSelect ? modelSelect.value : "kira-mini-1.0");
    const modelInfo = data.modelDetails || models.find(m => m.id === selectedId) || models[0];

    const elName = document.getElementById("modalModelName");
    if (elName) elName.textContent = modelInfo.name || selectedId;

    const elId = document.getElementById("modalModelId");
    if (elId) elId.textContent = selectedId;

    const elDesc = document.getElementById("modalModelDesc");
    if (elDesc) elDesc.textContent = modelInfo.description || "";

    const elProv = document.getElementById("modalModelProvider");
    if (elProv) elProv.textContent = modelInfo.provider || "Kira AI";

    const elCtx = document.getElementById("modalModelContext");
    if (elCtx) elCtx.textContent = modelInfo.context_window ? (modelInfo.context_window / 1000).toLocaleString() + "k" : "1M";

    const elLim = document.getElementById("modalModelLimit");
    if (elLim) elLim.textContent = modelInfo.daily_limit || "150M/day";

    const badge = document.getElementById("modalModelBadge");
    if (badge) {
      if (modelInfo.balance_required) {
        badge.className = "badge-tag tag-balance";
        badge.textContent = "Free (Balance > 0 VND)";
      } else {
        badge.className = "badge-tag tag-free";
        badge.textContent = "Free (0 Deposit)";
      }
    }

    if (data.connected) {
      if (modalStatusDot) modalStatusDot.className = "status-indicator-dot";
      if (modalBanner) modalBanner.className = "modal-status-banner success";
      if (modalBannerIcon) modalBannerIcon.textContent = "✅";
      if (modalBannerText) modalBannerText.innerHTML = "<strong>Upstream Connection Verified Active!</strong> Model <code>" + selectedId + "</code> responds smoothly from kiraai.vn. All AI tools auto-configured and ready.";
    } else if (data.connectionWarning) {
      const isKeyEmpty = !data.hasApiKey && apiKeyInput && apiKeyInput.value.trim() === "";
      if (isKeyEmpty) {
        if (modalStatusDot) modalStatusDot.className = "status-indicator-dot warning";
        if (modalBanner) modalBanner.className = "modal-status-banner warning";
        if (modalBannerIcon) modalBannerIcon.textContent = "⚠️";
        if (modalBannerText) modalBannerText.innerHTML = "<strong>Codex Auto-Configured! API Key Needed for Live Queries</strong><br>Your <code>~/.codex/config.toml</code> has been auto-configured for <code>" + selectedId + "</code>. Paste your API key from <a href='https://kiraai.vn/developer' target='_blank' style='color:#fbbf24; font-weight:700;'>kiraai.vn/developer</a> into the key box to test live model queries.";
      } else {
        if (modalStatusDot) modalStatusDot.className = "status-indicator-dot error";
        if (modalBanner) modalBanner.className = "modal-status-banner error";
        if (modalBannerIcon) modalBannerIcon.textContent = "❌";
        if (modalBannerText) modalBannerText.innerHTML = "<strong>Codex Configured — Upstream Connection Warning</strong><br>" + data.connectionWarning;
      }
    } else {
      if (modalStatusDot) modalStatusDot.className = "status-indicator-dot warning";
      if (modalBanner) modalBanner.className = "modal-status-banner warning";
      if (modalBannerIcon) modalBannerIcon.textContent = "ℹ️";
      if (modalBannerText) modalBannerText.innerHTML = "<strong>Model Configured in ~/.codex/config.toml</strong>";
    }

    const codexPathEl = document.getElementById("modalCodexPath");
    if (codexPathEl && data.codexPath) codexPathEl.textContent = data.codexPath;

    const endpointEl = document.getElementById("modalEndpointUrl");
    if (endpointEl) endpointEl.textContent = window.location.origin + "/v1";

    modalOverlay.classList.add("active");
  }

  function hideConfigModal() {
    if (modalOverlay) modalOverlay.classList.remove("active");
  }

  async function syncModelSelection() {
    updateModelInspector();
    if (!modelSelect || !apiKeyInput) return;
    const apiKey = apiKeyInput.value.trim();
    const model = modelSelect.value;
    showStatus("Syncing model setting to Codex...", "info");
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, model, skipTest: true })
      });
      const data = await res.json();
      if (res.ok) {
        showStatus("✓ Model updated to " + model + ". Codex config.toml auto-configured.", "success");
        showStatusPanel(model, false);
      } else {
        showStatus(data?.error?.message || "Failed to update model.", "error");
      }
    } catch {
      showStatus("Could not reach local gateway server.", "error");
    }
  }

  async function testCurrentModel() {
    if (!modelSelect || !apiKeyInput) return;
    const apiKey = apiKeyInput.value.trim();
    const model = modelSelect.value;
    showStatus("Testing connection to Kira AI for " + model + "...", "info");
    try {
      const setupRes = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, model })
      });
      const setupData = await setupRes.json();
      showConfigModal(setupData);
    } catch {
      showStatus("Could not reach gateway server.", "error");
    }
  }

  async function startAll() {
    if (!startButton || !modelSelect || !apiKeyInput) return;
    const apiKey = apiKeyInput.value.trim();
    const model = modelSelect.value;

    startButton.disabled = true;
    startButton.innerHTML = '<span class="spinner"></span> <span>Testing & Auto-Configuring...</span>';
    showStatus("⚡ Auto-configuring Codex & testing Kira API connection...", "info");

    try {
      const setupRes = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, model })
      });
      const setupData = await setupRes.json();
      if (!setupRes.ok) throw new Error(setupData?.error?.message || "Setup failed.");

      updateModelInspector();
      showStatusPanel(model, true);
      showConfigModal(setupData);

      if (setupData.connected) {
        showStatus("✓ Connected to Kira AI! Codex (~/.codex/config.toml) & Claude Code CLI ready for " + model + ".", "success");
      } else if (setupData.connectionWarning) {
        showStatus("✓ Codex configured in ~/.codex/config.toml for " + model + ". (" + setupData.connectionWarning + ")", "info");
      } else {
        showStatus("✓ Codex & Claude Code auto-configured for " + model + ".", "success");
      }
    } catch (error) {
      let msg = error instanceof Error ? error.message : "Something went wrong.";
      if (msg === "Failed to fetch" || (error && error.name === "TypeError")) {
        msg = "Failed to connect to local gateway server. Please ensure the server terminal is still running.";
      }
      showStatus(msg, "error");
    } finally {
      startButton.disabled = false;
      startButton.innerHTML = '<span>⚡ Test & Auto-Configure All AI Tools</span>';
    }
  }

  async function launchCodex() {
    try { navigator.clipboard.writeText("codex"); } catch {}
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
    try { navigator.clipboard.writeText("claude"); } catch {}
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

  function copyEndpoint() {
    const endpoint = window.location.origin + "/v1";
    try { navigator.clipboard.writeText(endpoint); } catch {}
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

  function resetConfig() {
    if (statusPanel) statusPanel.className = "status-panel";
    if (statusToast) statusToast.className = "status-toast";
  }

  async function copySkillContent() {
    showStatus("Fetching SKILL.md...", "info");
    try {
      const res = await fetch("/api/skill");
      const data = await res.json();
      if (data.content) {
        try { await navigator.clipboard.writeText(data.content); } catch {}
        showStatus("✓ SKILL.md copied to clipboard! Paste into your project rules or AI context.", "success");
      } else {
        showStatus(data?.error?.message || "SKILL.md file not found.", "error");
      }
    } catch {
      showStatus("Could not fetch SKILL.md.", "error");
    }
  }

  let skillLoaded = false;
  async function toggleSkillPreview() {
    const container = document.getElementById("skillPreviewContainer");
    const btnText = document.getElementById("skillPreviewToggleText");
    if (!container || !btnText) return;

    if (container.style.display === "none" || !container.style.display) {
      container.style.display = "block";
      btnText.textContent = "Hide Skill Context";
      if (!skillLoaded) {
        container.innerHTML = "<p>Loading SKILL.md...</p>";
        try {
          const res = await fetch("/api/skill");
          const data = await res.json();
          if (data.content) {
            container.innerHTML = parseMarkdown(data.content);
            skillLoaded = true;
          } else {
            container.innerHTML = "<p>SKILL.md is empty.</p>";
          }
        } catch {
          container.innerHTML = "<p>Failed to load SKILL.md content.</p>";
        }
      }
    } else {
      container.style.display = "none";
      btnText.textContent = "View Skill Context";
    }
  }

  function parseMarkdown(md) {
    if (!md) return "";
    var html = md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    html = html.replace(new RegExp('\\x60\\x60\\x60([\\s\\S]*?)\\x60\\x60\\x60', 'g'), function(_, code) {
      return "<pre><code>" + code.trim() + "</code></pre>";
    });

    html = html.replace(new RegExp('\\x60([^\\x60]+)\\x60', 'g'), '<code class="inline-code">$1</code>');

    html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>");
    html = html.replace(/^---$/gm, "<hr>");

    if (html.indexOf("**") !== -1) {
      var boldParts = html.split("**");
      var boldHtml = "";
      for (var i = 0; i < boldParts.length; i++) {
        if (i % 2 === 1) {
          boldHtml += "<strong>" + boldParts[i] + "</strong>";
        } else {
          boldHtml += boldParts[i];
        }
      }
      html = boldHtml;
    }

    if (html.indexOf("*") !== -1 && html.indexOf("<strong>") === -1) {
      var italicParts = html.split("*");
      var italicHtml = "";
      for (var j = 0; j < italicParts.length; j++) {
        if (j % 2 === 1) {
          italicHtml += "<em>" + italicParts[j] + "</em>";
        } else {
          italicHtml += italicParts[j];
        }
      }
      html = italicHtml;
    }

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    html = html.replace(/^\s*[-*]\s+(.*$)/gm, "<li>$1</li>");
    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>");

    return html;
  }

  function bindEvents() {
    if (modelSelect) {
      modelSelect.addEventListener("input", updateModelInspector);
      modelSelect.addEventListener("change", syncModelSelection);
    }

    const toggleApiKeyBtn = document.getElementById("toggleApiKey");
    const eyeIcon = document.getElementById("eyeIcon");
    if (toggleApiKeyBtn && apiKeyInput && eyeIcon) {
      toggleApiKeyBtn.addEventListener("click", function(e) {
        e.preventDefault();
        const isPassword = apiKeyInput.type === "password";
        apiKeyInput.type = isPassword ? "text" : "password";
        eyeIcon.innerHTML = isPassword
          ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>'
          : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
      });
    }

    if (btnTestModel) btnTestModel.addEventListener("click", testCurrentModel);
    if (startButton) startButton.addEventListener("click", startAll);

    const btnCloseModal = document.getElementById("btnCloseModal");
    if (btnCloseModal) btnCloseModal.addEventListener("click", hideConfigModal);

    const modalBtnClose = document.getElementById("modalBtnClose");
    if (modalBtnClose) modalBtnClose.addEventListener("click", hideConfigModal);

    const modalBtnLaunchCodex = document.getElementById("modalBtnLaunchCodex");
    if (modalBtnLaunchCodex) modalBtnLaunchCodex.addEventListener("click", function() { launchCodex(); hideConfigModal(); });

    const modalBtnLaunchClaude = document.getElementById("modalBtnLaunchClaude");
    if (modalBtnLaunchClaude) modalBtnLaunchClaude.addEventListener("click", function() { launchClaude(); hideConfigModal(); });

    if (modalOverlay) {
      modalOverlay.addEventListener("click", function(e) {
        if (e.target === modalOverlay) hideConfigModal();
      });
    }

    const btnLaunchCodex = document.getElementById("btnLaunchCodex");
    if (btnLaunchCodex) btnLaunchCodex.addEventListener("click", launchCodex);

    const btnLaunchClaude = document.getElementById("btnLaunchClaude");
    if (btnLaunchClaude) btnLaunchClaude.addEventListener("click", launchClaude);

    const btnCopyEndpoint = document.getElementById("btnCopyEndpoint");
    if (btnCopyEndpoint) btnCopyEndpoint.addEventListener("click", copyEndpoint);

    const btnCopyEndpoint2 = document.getElementById("btnCopyEndpoint2");
    if (btnCopyEndpoint2) btnCopyEndpoint2.addEventListener("click", copyEndpoint);

    const btnSyncTools = document.getElementById("btnSyncTools");
    if (btnSyncTools) btnSyncTools.addEventListener("click", syncTools);

    const btnResetConfig = document.getElementById("btnResetConfig");
    if (btnResetConfig) btnResetConfig.addEventListener("click", resetConfig);

    const btnCopySkill = document.getElementById("btnCopySkill");
    if (btnCopySkill) btnCopySkill.addEventListener("click", copySkillContent);

    const btnToggleSkill = document.getElementById("btnToggleSkill");
    if (btnToggleSkill) btnToggleSkill.addEventListener("click", toggleSkillPreview);

    const btnSubmitAiChat = document.getElementById("btnSubmitAiChat");
    if (btnSubmitAiChat) btnSubmitAiChat.addEventListener("click", function() { sendAiPlaygroundPrompt(); });

    const tagPython = document.getElementById("tagPython");
    if (tagPython) tagPython.addEventListener("click", function() { sendAiPlaygroundPrompt("Write a fast Python script to calculate Fibonacci numbers."); });

    const tagGateway = document.getElementById("tagGateway");
    if (tagGateway) tagGateway.addEventListener("click", function() { sendAiPlaygroundPrompt("Explain how KiraAI Route proxy forwards requests to DeepSeek."); });

    const tagTsApi = document.getElementById("tagTsApi");
    if (tagTsApi) tagTsApi.addEventListener("click", function() { sendAiPlaygroundPrompt("Create a clean Fastify REST API endpoint in TypeScript."); });
  }

  async function sendAiPlaygroundPrompt(promptText) {
    const inputEl = document.getElementById("chat_bot_input");
    const responseEl = document.getElementById("aiChatResponse");
    const btnSubmit = document.getElementById("btnSubmitAiChat");
    const text = promptText || (inputEl ? inputEl.value.trim() : "");

    if (!text) {
      showStatus("Please enter a prompt in the AI Playground.", "warning");
      return;
    }

    if (inputEl) inputEl.value = text;
    if (btnSubmit) btnSubmit.classList.add("active");
    if (responseEl) {
      responseEl.style.display = "block";
      responseEl.innerHTML = '<span class="spinner" style="display:inline-block; margin-right:8px;"></span> <span>Sending query via local gateway proxy...</span>';
    }

    const selectedModel = modelSelect ? modelSelect.value : "kira-mini-1.0";
    const userApiKey = apiKeyInput ? apiKeyInput.value.trim() : "";

    try {
      const res = await fetch("/api/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          model: selectedModel,
          apiKey: userApiKey
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.text) {
        if (responseEl) responseEl.innerHTML = parseMarkdown(data.text);
        showStatus("✓ Received response from " + (data.model || selectedModel) + "!", "success");
      } else {
        const errMsg = data?.error?.message || "Model query failed. Ensure valid Kira API key.";
        if (responseEl) responseEl.innerHTML = '<span style="color:#f87171;">⚠️ ' + errMsg + '</span>';
        showStatus(errMsg, "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Connection failed.";
      if (responseEl) responseEl.innerHTML = '<span style="color:#f87171;">⚠️ ' + msg + '</span>';
      showStatus("Failed to send query to local proxy server.", "error");
    } finally {
      if (btnSubmit) setTimeout(function() { btnSubmit.classList.remove("active"); }, 400);
    }
  }

  async function loadInitialStatus() {
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      if (data.configured) {
        if (data.apiKey && apiKeyInput) apiKeyInput.value = data.apiKey;
        if (data.model && modelSelect) modelSelect.value = data.model;
        updateModelInspector();
        showStatusPanel(data.model || (modelSelect ? modelSelect.value : "kira-mini-1.0"), false);
      } else {
        updateModelInspector();
      }
    } catch {
      updateModelInspector();
    }
  }

  var initialized = false;
  function initApp() {
    if (initialized) return;
    initialized = true;
    initElements();
    bindEvents();
    loadInitialStatus();
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initApp, 10);
  } else {
    document.addEventListener("DOMContentLoaded", initApp);
  }
})();
</script>
</body>
</html>`;
}
