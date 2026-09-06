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
  return "0.5.0";
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
  --bg-app: #09090b;
  --bg-card: #18181b;
  --bg-input: #09090b;
  --bg-hover: #27272a;
  --border-color: #27272a;
  --border-hover: #3f3f46;
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --accent-primary: #d97706;
  --accent-hover: #f59e0b;
  --accent-glow: rgba(217, 119, 6, 0.15);
  --status-green: #10b981;
  --status-amber: #f59e0b;
  --status-red: #ef4444;
  --radius-card: 12px;
  --radius-input: 8px;
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
  position: relative;
  overflow-x: hidden;
}

body::before {
  content: "";
  position: fixed;
  top: -160px;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 400px;
  background: radial-gradient(circle, rgba(217, 119, 6, 0.09) 0%, rgba(16, 185, 129, 0.04) 45%, transparent 75%);
  filter: blur(90px);
  pointer-events: none;
  z-index: 0;
  animation: ambientFloat 14s ease-in-out infinite alternate;
}

@keyframes ambientFloat {
  0% { transform: translateX(-50%) translateY(0) scale(1); opacity: 0.7; }
  50% { transform: translateX(-47%) translateY(35px) scale(1.1); opacity: 0.95; }
  100% { transform: translateX(-53%) translateY(15px) scale(0.92); opacity: 0.75; }
}

/* Header Navbar */
.navbar {
  height: 64px;
  border-bottom: 1px solid var(--border-color);
  background: rgba(18, 18, 27, 0.85);
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
  gap: 12px;
}

.brand-logo-img {
  height: 32px;
  width: auto;
  object-fit: contain;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.brand-logo-img:hover {
  transform: scale(1.08) rotate(-3deg);
}

.brand-text-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: var(--text-primary);
}

.version-pill {
  font-size: 11px;
  font-weight: 600;
  background: rgba(39, 39, 42, 0.8);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  padding: 2px 8px;
  border-radius: 20px;
  transition: all 0.2s ease;
}

.version-pill:hover {
  border-color: var(--accent-primary);
  color: var(--text-primary);
}

.nav-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}

.status-dot {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--status-green);
  box-shadow: 0 0 8px var(--status-green);
}

.status-dot::after {
  content: "";
  position: absolute;
  top: -4px;
  left: -4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid var(--status-green);
  animation: radarPulse 2.2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  opacity: 0;
}

@keyframes radarPulse {
  0% { transform: scale(0.4); opacity: 0.9; }
  100% { transform: scale(1.9); opacity: 0; }
}

/* Main Container */
.main-wrapper {
  max-width: 1040px;
  width: 100%;
  margin: 36px auto;
  padding: 0 24px;
  flex: 1;
}

.page-header {
  margin-bottom: 28px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.4px;
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
  gap: 24px;
  align-items: start;
}

@media (max-width: 920px) {
  .content-grid { grid-template-columns: 1fr; }
}

/* Form Card (shadcn Card design) */
.form-card, .status-panel, .skill-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  animation: cardFadeUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease;
}

.form-card:hover, .status-panel:hover, .skill-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1);
}

@keyframes cardFadeUp {
  0% { opacity: 0; transform: translateY(16px); }
  100% { opacity: 1; transform: translateY(0); }
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child { margin-bottom: 0; }

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
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
  height: 40px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-input);
  color: var(--text-primary);
  padding: 0 40px 0 12px;
  font-family: var(--font-sans);
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
}

select.model-select {
  color-scheme: dark;
  width: 100%;
  height: 42px;
  background-color: var(--bg-input);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-input);
  color: var(--text-primary);
  padding: 0 38px 0 12px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

select.model-select:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
}

select.model-select option {
  background-color: var(--bg-card);
  color: var(--text-primary);
  padding: 8px 12px;
}

select.model-select optgroup {
  background-color: var(--bg-app);
  color: var(--accent-primary);
  font-weight: 600;
}

.eye-btn {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: color 0.15s ease, transform 0.15s ease;
  z-index: 2;
}

.eye-btn svg { pointer-events: none; }
.eye-btn:hover { color: var(--text-primary); transform: translateY(-50%) scale(1.1); }

.help-text {
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-muted);
}

.help-text a {
  color: var(--text-secondary);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.15s ease;
}

.help-text a:hover { color: var(--text-primary); }

/* Model Detail Inspector Card */
.model-inspector {
  margin-top: 12px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-input);
  padding: 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  transition: all 0.25s ease;
}

.model-inspector.updated {
  animation: inspectorPulse 0.35s ease-out;
}

@keyframes inspectorPulse {
  0% { transform: scale(0.98); border-color: var(--accent-primary); }
  50% { transform: scale(1.01); }
  100% { transform: scale(1); }
}

.inspector-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.inspector-provider {
  font-size: 12px;
  color: var(--text-muted);
}

.inspector-badge-group {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.badge-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  display: inline-block;
  transition: transform 0.2s ease;
}

.badge-tag:hover {
  transform: scale(1.04);
}

.tag-free {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.tag-balance {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.tag-paid {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.inspector-limits {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

/* Modal Overlay & Dialog */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
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
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  width: 100%;
  max-width: 540px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.7);
  transform: translateY(16px) scale(0.96);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.modal-overlay.active .modal-card {
  transform: translateY(0) scale(1);
}
.modal-header {
  padding: 18px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.status-indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--status-green);
  box-shadow: 0 0 10px var(--status-green);
}
.status-indicator-dot.warning { background: var(--status-amber); box-shadow: 0 0 10px var(--status-amber); }
.status-indicator-dot.error { background: var(--status-red); box-shadow: 0 0 10px var(--status-red); }

.modal-title {
  font-size: 16px;
  font-weight: 700;
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
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 0.15s ease, transform 0.15s ease;
}
.modal-close-btn:hover { color: var(--text-primary); transform: scale(1.15); }

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 70vh;
  overflow-y: auto;
}
.modal-status-banner {
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  line-height: 1.45;
  border: 1px solid transparent;
}
.modal-status-banner.success {
  background: rgba(20, 83, 45, 0.3);
  border-color: rgba(34, 197, 94, 0.3);
  color: #f0fdf4;
}
.modal-status-banner.info {
  background: rgba(30, 58, 138, 0.3);
  border-color: rgba(59, 130, 246, 0.3);
  color: #eff6ff;
}
.modal-status-banner.warning {
  background: rgba(113, 63, 18, 0.3);
  border-color: rgba(234, 179, 8, 0.3);
  color: #fefce8;
}
.modal-status-banner.error {
  background: rgba(127, 29, 29, 0.3);
  border-color: rgba(239, 68, 68, 0.3);
  color: #fef2f2;
}
.modal-banner-icon { font-size: 16px; line-height: 1; flex-shrink: 0; }
.modal-banner-text strong { display: block; margin-bottom: 2px; }

.modal-info-box {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 14px;
}
.modal-box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.modal-box-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: var(--text-muted);
}
.modal-model-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}
.modal-model-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}
.modal-model-code {
  font-family: var(--font-mono);
  font-size: 11.5px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
  padding: 2px 6px;
  border-radius: 4px;
}
.modal-model-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 10px;
}
.modal-model-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 8px 10px;
}
.meta-item { display: flex; flex-direction: column; gap: 2px; }
.meta-label { font-size: 9.5px; color: var(--text-muted); text-transform: uppercase; }
.meta-value { font-size: 11.5px; font-weight: 600; color: var(--text-primary); }

.modal-section-title {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: var(--text-muted);
}
.modal-check-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.check-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 10px 12px;
  transition: border-color 0.2s ease;
}
.check-item:hover {
  border-color: var(--border-hover);
}
.check-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}
.check-icon.success { background: rgba(16, 185, 129, 0.15); color: #34d399; }
.check-title { font-size: 12.5px; font-weight: 600; color: var(--text-primary); }
.check-detail { font-size: 11.5px; color: var(--text-secondary); margin-top: 2px; }

.modal-footer {
  padding: 14px 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  vertical-align: middle;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* shadcn Primary Action Button */
.btn-primary {
  width: 100%;
  height: 42px;
  background: #fafafa;
  color: #09090b;
  border: 1px solid #fafafa;
  border-radius: var(--radius-input);
  font-family: var(--font-sans);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.btn-primary:hover {
  background: #ffffff;
  border-color: #ffffff;
  color: #09090b;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(255, 255, 255, 0.16);
}

.btn-primary:hover .btn-svg-icon {
  transform: scale(1.12) rotate(4deg);
}

.btn-primary:active { transform: translateY(0) scale(0.98); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

/* Status Toast - shadcn toast design */
.status-toast {
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 12.5px;
  display: none;
  align-items: center;
  gap: 10px;
  line-height: 1.4;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes toastSlideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.status-toast.show { display: flex; }
.status-toast.info { border-color: rgba(59, 130, 246, 0.4); color: #eff6ff; background: rgba(30, 58, 138, 0.3); }
.status-toast.success { border-color: rgba(34, 197, 94, 0.4); color: #f0fdf4; background: rgba(20, 83, 45, 0.3); }
.status-toast.warning { border-color: rgba(234, 179, 8, 0.4); color: #fefce8; background: rgba(113, 63, 18, 0.3); }
.status-toast.error { border-color: rgba(239, 68, 68, 0.4); color: #fef2f2; background: rgba(127, 29, 29, 0.3); }

/* Right Status Card (shadcn design) */
.status-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  display: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.status-panel.show { display: block; }

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 14px;
  color: var(--status-green);
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.panel-item {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-input);
  padding: 12px 14px;
  margin-bottom: 12px;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.panel-item:hover {
  border-color: var(--border-hover);
  transform: translateX(2px);
}

.panel-item:last-child { margin-bottom: 0; }

.panel-label {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.6px;
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
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.15s ease, background-color 0.15s ease, transform 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover { color: var(--text-primary); background: var(--border-color); transform: scale(1.1); }

/* Live Health Ticker Widget */
.live-health-widget {
  background: linear-gradient(135deg, rgba(24, 24, 27, 0.9) 0%, rgba(39, 39, 42, 0.5) 100%);
  border: 1px solid rgba(16, 185, 129, 0.25);
  position: relative;
  overflow: hidden;
}

.live-health-widget::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.08), transparent);
  animation: shineScan 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes shineScan {
  0% { left: -100%; }
  45%, 100% { left: 200%; }
}

.live-tag {
  font-size: 10px;
  font-weight: 700;
  color: #34d399;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(16, 185, 129, 0.12);
  padding: 2px 6px;
  border-radius: 10px;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 6px #34d399;
  animation: pulseDot 1.4s ease-in-out infinite alternate;
}

@keyframes pulseDot {
  0% { opacity: 0.4; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1.25); }
}

.health-metrics-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
}

.health-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric-val {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
}

.metric-lbl {
  font-size: 9.5px;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-top: 1px;
}

.equalizer-bars {
  display: flex;
  align-items: flex-end;
  gap: 2.5px;
  height: 14px;
}

.eq-bar {
  width: 3px;
  background: #34d399;
  border-radius: 2px;
  animation: eqPulse 1.2s ease-in-out infinite alternate;
}

.eq-bar.bar-1 { height: 8px; animation-delay: 0.1s; }
.eq-bar.bar-2 { height: 14px; animation-delay: 0.3s; }
.eq-bar.bar-3 { height: 10px; animation-delay: 0.2s; }
.eq-bar.bar-4 { height: 12px; animation-delay: 0.4s; }

@keyframes eqPulse {
  0% { height: 4px; opacity: 0.5; }
  100% { height: 14px; opacity: 1; }
}

/* Action Buttons Group (shadcn buttons) */
.actions-group {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-secondary {
  width: 100%;
  height: 40px;
  background: #18181b;
  color: #fafafa;
  border: 1px solid #27272a;
  border-radius: var(--radius-input);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-secondary:hover {
  background: #27272a;
  border-color: #3f3f46;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-secondary:hover .btn-svg-icon {
  transform: scale(1.1);
}

.btn-secondary:active { transform: translateY(0) scale(0.98); }

.btn-svg-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.2s ease;
}

.skill-card {
  margin-top: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  padding: 24px;
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
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
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
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  max-height: 420px;
  overflow-y: auto;
  padding: 20px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
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
            <option value="qwen3.8-flash">Qwen 3.8 Flash — Coding & Multimodal [qwen3.8-flash]</option>
            <option value="qwen3.8-27b-free">Qwen 3.8 27B Free — General Text & Code [qwen3.8-27b-free]</option>
            <option value="glm-5.3-flash">GLM 5.3 Flash — High-Perf Code & Multimodal [glm-5.3-flash]</option>
            <option value="ling-3.0-flash-sante-free">Ling 3.0 Flash Sante — Medical & Health AI [ling-3.0-flash-sante-free]</option>
            <option value="minimax-m3-free">MiniMax M3 Free — Multi-Agent & Audio/Voice [minimax-m3-free]</option>
            <option value="minimax-m2.7">MiniMax M2.7 — Multi-Agent & Audio/Voice [minimax-m2.7]</option>
            <option value="gpt-5.6-luna-free">GPT 5.6 Luna Free — General Text & Reasoning [gpt-5.6-luna-free]</option>
            <option value="claude-fable-5.1-free">Claude Fable 5.1 Free — General Reasoning [claude-fable-5.1-free]</option>
            <option value="gpt-6-astra-free">GPT-6 Astra Free — Next-Gen Reasoning & Code [gpt-6-astra-free]</option>
          </optgroup>
          <optgroup label="PAID MODELS — CONSUMES BALANCE (Pay-Per-Token)">
            <option value="glm-5.3">GLM 5.3 — Bilingual LLM & Text [glm-5.3] ($0.37 / $1.33)</option>
            <option value="ox-alpha">Ox Alpha (GLM-5.3-Flash) — Multimodal Flash [ox-alpha] ($0.09 / $0.30)</option>
            <option value="deepseek-v4-flash">DeepSeek V4 Flash — Ultra-Fast 284B Coding [deepseek-v4-flash] ($0.02 / $0.06)</option>
            <option value="deepseek-v4-flash-0731">DeepSeek V4 Flash 0731 — 284B Coding [deepseek-v4-flash-0731] ($0.02 / $0.06)</option>
            <option value="deepseek-v4-pro">DeepSeek V4 Pro — Flagship 284B Reasoning [deepseek-v4-pro] ($0.45 / $1.36)</option>
            <option value="deepseek-v4-flash-vision-exp">DeepSeek V4 Vision Exp — Vision & Multimodal [deepseek-v4-flash-vision-exp] ($0.18 / $0.52)</option>
            <option value="gpt-oss-120b">GPT OSS 120B — 120B Open Source Model [gpt-oss-120b] ($0.19 / $0.38)</option>
            <option value="glm-5.2">GLM 5.2 — Advanced Bilingual LLM [glm-5.2] ($0.98 / $3.60)</option>
            <option value="minimax-m3">MiniMax M3 — Multi-Agent & Audio/Voice [minimax-m3] ($0.28 / $1.08)</option>
            <option value="grok-4.6">Grok 4.6 — Multimodal Coding & STEM [grok-4.6] ($1.54 / $4.62)</option>
            <option value="grok-4.5">Grok 4.5 — Multimodal Coding & STEM [grok-4.5] ($1.54 / $4.62)</option>
            <option value="dots-3-note-preview">Dots 3 Note Preview — Open-Source LLM [dots-3-note-preview] ($0.31 / $1.20)</option>
            <option value="qwen3.6-flash">Qwen 3.6 Flash — Open-Source Coding [qwen3.6-flash] ($0.22 / $0.85)</option>
            <option value="qwen3.5-omni-plus">Qwen 3.5 Omni Plus — Multimodal Omni Vision [qwen3.5-omni-plus] ($0.85 / $5.38)</option>
            <option value="qwen3.7-plus">Qwen 3.7 Plus — Balanced Reasoning & Logic [qwen3.7-plus] ($0.35 / $1.54)</option>
            <option value="qwen3.7-max">Qwen 3.7 Max — Deep Reasoning & Arch [qwen3.7-max] ($1.19 / $3.46)</option>
            <option value="mimo-v2.5-pro">Mimo V2.5 Pro — Flagship Logic & Reasoning [mimo-v2.5-pro] ($0.85 / $2.65)</option>
            <option value="gemini-3.8-flash">Gemini 3.8 Flash — Next-Gen Flash Coding [gemini-3.8-flash] ($0.66 / $3.39)</option>
            <option value="gemini-3.7-flash">Gemini 3.7 Flash — Next-Gen Flash Coding [gemini-3.7-flash] ($0.66 / $3.39)</option>
            <option value="gemini-3.6-flash">Gemini 3.6 Flash — High-Speed Flash Coding [gemini-3.6-flash] ($1.21 / $6.92)</option>
            <option value="gemini-3.5-flash">Gemini 3.5 Flash — High-Speed Flash Coding [gemini-3.5-flash] ($1.21 / $6.92)</option>
            <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash Lite — Ultra-Light Fast [gemini-3.5-flash-lite] ($0.28 / $1.73)</option>
            <option value="gemini-3-pro-image-preview">Nano Banana Pro — AI Image Generation [gemini-3-pro-image-preview] ($0.76 / img)</option>
            <option value="gemini-3.1-flash-image-preview">Nano Banana 2 — Fast AI Image Gen [gemini-3.1-flash-image-preview] ($0.42 / img)</option>
            <option value="gemini-2.5-flash-image">Nano Banana — AI Image Generation [gemini-2.5-flash-image] ($2.42 / img)</option>
            <option value="gemini-3.1-flash-tts-preview">Gemini 3.1 Flash TTS — Voice Synthesis [gemini-3.1-flash-tts-preview] ($0.87 / $18.17)</option>
            <option value="gemini-2.5-flash-tts">Gemini 2.5 Flash TTS — Voice Synthesis [gemini-2.5-flash-tts] ($0.26 / $2.18)</option>
            <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite — Ultra-Fast Light [gemini-2.5-flash-lite] ($0.07 / $0.37)</option>
            <option value="kimi-k3">Kimi K3 — 2.8T MoE Open-Source Reasoning [kimi-k3] ($2.60 / $10.38)</option>
            <option value="gpt-5.6-luna">GPT 5.6 Luna — High-Speed General Text [gpt-5.6-luna] ($0.17 / $0.34)</option>
            <option value="gpt-5.6-terra">GPT 5.6 Terra — Balanced Performance LLM [gpt-5.6-terra] ($1.94 / $11.69)</option>
            <option value="gpt-5.6-sol">GPT 5.6 Sol — Top Flagship LLM [gpt-5.6-sol] ($2.91 / $17.45)</option>
            <option value="gpt-5.4">GPT 5.4 — Breakthrough Multimodal Logic [gpt-5.4] ($1.50 / $9.00)</option>
            <option value="gpt-5.4-mini">GPT 5.4 mini — Compact High-Speed Logic [gpt-5.4-mini] ($0.37 / $2.25)</option>
            <option value="gpt-4o-mini">GPT 4o Mini — Fast OpenAI Model [gpt-4o-mini] ($0.14 / $0.87)</option>
            <option value="hy4">Tencent Hy4 Preview — 770B MoE Architecture [hy4] ($0.85 / $2.54)</option>
            <option value="qwen3.5-flash">Qwen 3.5 Flash — High-Speed Multimodal [qwen3.5-flash] ($0.22 / $0.38)</option>
            <option value="claude-sonnet-5">Claude Sonnet 5 — Flagship Reasoning & Coding [claude-sonnet-5] ($1.73 / $9.00)</option>
            <option value="qwen3.8-max">Qwen 3.8 Max — High-Capacity Reasoning [qwen3.8-max] ($1.92 / $5.77)</option>
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
            <button type="button" id="btnTestModel" class="btn-secondary" style="width: auto; height: 28px; padding: 0 10px; font-size: 11.5px; margin-top: 6px;"><svg class="btn-svg-icon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>Test Model</span></button>
          </div>
        </div>
      </div>

      <button id="start" type="button" class="btn-primary">
        <svg class="btn-svg-icon" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        <span>Configure Gateway & AI Models</span>
      </button>
      <div style="font-size: 11.5px; color: var(--text-muted); text-align: center; margin-top: 6px;">
        Automatically configures local OpenAI-compatible proxy endpoint.
      </div>

      <div id="status" class="status-toast"></div>
    </div>

    <!-- Right Status Panel (shadcn Card) -->
    <div id="statusPanel" class="status-panel">
      <div class="panel-header">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        KiraAI Route Gateway Active
      </div>

      <div id="setupSuccessBanner" role="alert" class="modal-status-banner success" style="margin-bottom: 16px;">
        <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" style="width:18px; height:18px; flex-shrink:0; margin-top:2px; color:#4ade80;" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
        </svg>
        <div>
          <strong style="display: block; font-size: 13px; margin-bottom: 2px;">Gateway Configured Successfully</strong>
          <span style="font-size: 12px; opacity: 0.9;">Your local OpenAI-compatible endpoint is active and ready to accept requests.</span>
        </div>
      </div>

      <!-- Live Health & Latency Bar (Real-Time Dynamic Ping Widget) -->
      <div class="panel-item live-health-widget">
        <div class="panel-label" style="display: flex; justify-content: space-between; align-items: center;">
          <span>Gateway Route Health</span>
          <span class="live-tag"><span class="live-dot"></span> LIVE <span id="liveLatencyVal">--ms</span></span>
        </div>
        <div class="health-metrics-row">
          <div class="health-metric">
            <span id="liveUptimeVal" class="metric-val">99.9%</span>
            <span class="metric-lbl">Uptime</span>
          </div>
          <div class="health-metric">
            <span class="metric-val">HTTP/2</span>
            <span class="metric-lbl">Protocol</span>
          </div>
          <div class="health-metric">
            <div class="equalizer-bars">
              <span class="eq-bar bar-1"></span>
              <span class="eq-bar bar-2"></span>
              <span class="eq-bar bar-3"></span>
              <span class="eq-bar bar-4"></span>
            </div>
            <span id="liveSignalText" class="metric-lbl" style="transition: color 0.3s ease;">Optimal</span>
          </div>
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
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        </div>
      </div>

      <div class="actions-group">
        <button id="btnCopyEndpoint2" type="button" class="btn-secondary">
          <svg class="btn-svg-icon" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <span>Copy API Endpoint</span>
        </button>
        <button id="btnResetConfig" type="button" class="btn-secondary">
          <svg class="btn-svg-icon" viewBox="0 0 24 24"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          <span>Reconfigure Gateway</span>
        </button>
      </div>
    </div>
  </div>



  <!-- AI Assistant Integration Skill Section -->
  <div class="skill-card">
    <div class="skill-header">
      <div class="skill-title-group">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        <span class="skill-title">AI Assistant Integration Skill (SKILL.md)</span>
        <span class="badge-tag tag-free">Preconfigured Context</span>
      </div>
      <p class="skill-description">
        Provide preconfigured context for your AI coding assistants to accurately understand Kira AI API structures, supported models, and generate precise integration code for NodeJS, PHP, Python, and WordPress.
      </p>
    </div>

    <div class="skill-actions-row">
      <button id="btnCopySkill" type="button" class="btn-secondary" style="width: auto; padding: 0 14px;">
        <svg class="btn-svg-icon" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        <span>Copy SKILL.md</span>
      </button>
      <a href="/api/skill/download" download="SKILL.md" class="btn-secondary" style="width: auto; padding: 0 14px; text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">
        <svg class="btn-svg-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        <span>Download SKILL.md</span>
      </a>
      <button id="btnToggleSkill" type="button" class="btn-secondary" style="width: auto; padding: 0 14px;">
        <svg class="btn-svg-icon" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        <span id="skillPreviewToggleText">View Skill Context</span>
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
          <p id="modalSubtitle" class="modal-subtitle">Auto-configured local gateway endpoint</p>
        </div>
      </div>
      <button id="btnCloseModal" type="button" class="modal-close-btn" aria-label="Close modal">&times;</button>
    </div>

    <div class="modal-body">
      <!-- Status Banner -->
      <div id="modalBanner" class="modal-status-banner success">
        <span id="modalBannerIcon" class="modal-banner-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </span>
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
      <div class="modal-section-title">LOCAL ENDPOINT STATUS</div>
      <div class="modal-check-list">
        <div class="check-item">
          <div class="check-icon success">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div class="check-content">
            <div class="check-title">Local OpenAI-Compatible Proxy</div>
            <div class="check-detail"><code id="modalEndpointUrl">http://127.0.0.1:4010/v1</code></div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button id="modalBtnCopy" type="button" class="btn-primary" style="flex: 1; margin-top: 0;">
        <svg class="btn-svg-icon" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        <span>Copy API Endpoint</span>
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
    // Free models (0 VND)
    { id: "kira-auto", name: "Kira Auto", provider: "Kira AI", free: true, category: "free_no_deposit", balance_required: false, typeLabel: "Auto Routing / Smart Text", daily_limit: "150M tokens/day", context_window: 1000000, description: "Automatically routes requests across top models for optimal speed and uptime." },
    { id: "kira-2.0", name: "Kira Mini 2.0", provider: "Kira AI", free: true, category: "free_no_deposit", balance_required: false, typeLabel: "Fast Text & Code", daily_limit: "150M tokens/day", context_window: 1000000, description: "120B parameter open-source model optimized for high-speed response, general text, and coding." },
    { id: "kira-mini-1.0", name: "Kira Mini 1.0", provider: "Kira AI", free: true, category: "free_no_deposit", balance_required: false, typeLabel: "General Text & Code", daily_limit: "150M tokens/day", context_window: 1000000, description: "Powered by DeepSeek V4 Flash architecture, versatile model ideal for daily coding tasks." },
    { id: "mimo-v2.5", name: "Mimo V2.5", provider: "Xiaomi", free: true, category: "free_no_deposit", balance_required: false, typeLabel: "Reasoning & Logic", daily_limit: "150M tokens/day", context_window: 128000, description: "Xiaomi near-flagship cost-optimized model focused on complex logical reasoning, math, and problem solving." },
    { id: "hy3", name: "Tencent Hy3 Free", provider: "Tencent", free: true, category: "free_no_deposit", balance_required: false, typeLabel: "Agent & Coding", daily_limit: "150M tokens/day", context_window: 128000, description: "Tencent commercial-grade model engineered for autonomous AI agents and complex coding." },

    // Free models (Balance > 0)
    { id: "deepseek-v4-flash-free", name: "DeepSeek V4 Flash Free", provider: "DeepSeek", free: true, category: "free_balance_required", balance_required: true, typeLabel: "High-Speed Code & Text", daily_limit: "250M tokens/day", context_window: 1000000, description: "Lightweight, high-speed 284B parameter model from DeepSeek V4 family." },
    { id: "qwen3.8-flash", name: "Qwen 3.8 Flash", provider: "Qwen", free: true, category: "free_balance_required", balance_required: true, typeLabel: "Coding & Multimodal", daily_limit: "250M tokens/day", context_window: 128000, description: "Ultra-fast multimodal model from Alibaba, tuned specifically for software engineering." },
    { id: "qwen3.8-27b-free", name: "Qwen 3.8 27B Free", provider: "Qwen", free: true, category: "free_balance_required", balance_required: true, typeLabel: "General Text & Code", daily_limit: "250M tokens/day", context_window: 128000, description: "27B parameter model provided for testing, providing balanced performance." },
    { id: "glm-5.3-flash", name: "GLM 5.3 Flash", provider: "GLM / Z.AI", free: true, category: "free_balance_required", balance_required: true, typeLabel: "High-Perf Code & Multimodal", daily_limit: "250M tokens/day", context_window: 128000, description: "High-performance multimodal model from Z.AI supporting fast execution." },
    { id: "ling-3.0-flash-sante-free", name: "Ling 3.0 Flash Sante", provider: "InclusionAI", free: true, category: "free_balance_required", balance_required: true, typeLabel: "Medical & Health AI", daily_limit: "250M tokens/day", context_window: 128000, description: "InclusionAI specialized language model tailored for healthcare and bio-health queries." },
    { id: "minimax-m3-free", name: "MiniMax M3 Free", provider: "MiniMax", free: true, category: "free_balance_required", balance_required: true, typeLabel: "Multi-Agent & Audio/Voice", daily_limit: "250M tokens/day", context_window: 128000, description: "Breakthrough multi-agent AI model with real-time speech processing and voice audio synthesis." },
    { id: "minimax-m2.7", name: "MiniMax M2.7", provider: "MiniMax", free: true, category: "free_balance_required", balance_required: true, typeLabel: "Multi-Agent & Audio/Voice", daily_limit: "250M tokens/day", context_window: 128000, description: "High-speed multi-agent conversational engine supporting voice synthesis." },
    { id: "gpt-5.6-luna-free", name: "GPT 5.6 Luna Free", provider: "OpenAI Compatible", free: true, category: "free_balance_required", balance_required: true, typeLabel: "General Text & Reasoning", daily_limit: "250M tokens/day", context_window: 1000000, description: "High-capacity language model for creative writing and structural synthesis." },
    { id: "claude-fable-5.1-free", name: "Claude Fable 5.1 Free", provider: "Anthropic", free: true, category: "free_balance_required", balance_required: true, typeLabel: "General Text & Reasoning", daily_limit: "250M tokens/day", context_window: 128000, description: "Free testing model provided by Anthropic partner." },
    { id: "gpt-6-astra-free", name: "GPT-6 Astra Free", provider: "OpenAI", free: true, category: "free_balance_required", balance_required: true, typeLabel: "Next-Gen Reasoning & Code", daily_limit: "250M tokens/day", context_window: 1000000, description: "Free next-generation experimental model provided for testing complex logic." },

    // Paid models (Consumes Balance)
    { id: "glm-5.3", name: "GLM 5.3", provider: "GLM / Z.AI", free: false, category: "paid", balance_required: true, typeLabel: "Bilingual LLM & Text", daily_limit: "Pay-per-token", context_window: 128000, description: "Advanced bilingual large language model from Z.AI with high-precision text understanding.", input_price: "$0.37/1M", output_price: "$1.33/1M" },
    { id: "ox-alpha", name: "Ox Alpha (GLM-5.3-Flash)", provider: "GLM / Z.AI", free: false, category: "paid", balance_required: true, typeLabel: "Multimodal Flash", daily_limit: "Pay-per-token", context_window: 128000, description: "GOx Alpha is GLM-5.3-Flash, high-performance multimodal model from Z.AI.", input_price: "$0.09/1M", output_price: "$0.30/1M" },
    { id: "deepseek-v4-flash", name: "DeepSeek V4 Flash", provider: "DeepSeek", free: false, category: "paid", balance_required: true, typeLabel: "Ultra-Fast 284B Coding", daily_limit: "Pay-per-token", context_window: 1000000, description: "Lightweight ultra-fast 284B model specialized in software development.", input_price: "$0.02/1M", output_price: "$0.06/1M" },
    { id: "deepseek-v4-flash-0731", name: "DeepSeek V4 Flash 0731", provider: "DeepSeek", free: false, category: "paid", balance_required: true, typeLabel: "284B Coding (0731)", daily_limit: "Pay-per-token", context_window: 1000000, description: "DeepSeek V4 Flash 0731 build, optimized for high throughput response.", input_price: "$0.02/1M", output_price: "$0.06/1M" },
    { id: "deepseek-v4-pro", name: "DeepSeek V4 Pro", provider: "DeepSeek", free: false, category: "paid", balance_required: true, typeLabel: "Flagship 284B Reasoning", daily_limit: "Pay-per-token", context_window: 1000000, description: "Flagship 284B model for complex reasoning and deep software engineering.", input_price: "$0.45/1M", output_price: "$1.36/1M" },
    { id: "deepseek-v4-flash-vision-exp", name: "DeepSeek V4 Vision Exp", provider: "DeepSeek", free: false, category: "paid", balance_required: true, typeLabel: "Vision & Multimodal Image", daily_limit: "Pay-per-token", context_window: 128000, description: "Experimental vision model parsing images, code screenshots, and charts.", input_price: "$0.18/1M", output_price: "$0.52/1M" },
    { id: "gpt-oss-120b", name: "GPT OSS 120B", provider: "OpenAI", free: false, category: "paid", balance_required: true, typeLabel: "120B Open Source Model", daily_limit: "Pay-per-token", context_window: 128000, description: "Open-source 120B model combining reasoning and structural code capability.", input_price: "$0.19/1M", output_price: "$0.38/1M" },
    { id: "glm-5.2", name: "GLM 5.2", provider: "GLM / Z.AI", free: false, category: "paid", balance_required: true, typeLabel: "Advanced Bilingual LLM", daily_limit: "Pay-per-token", context_window: 128000, description: "Advanced bilingual model with strong understanding and language generation.", input_price: "$0.98/1M", output_price: "$3.60/1M" },
    { id: "minimax-m3", name: "MiniMax M3", provider: "MiniMax", free: false, category: "paid", balance_required: true, typeLabel: "Multi-Agent & Audio/Voice", daily_limit: "Pay-per-token", context_window: 128000, description: "Breakthrough multi-agent model with real-time speech processing and voice audio.", input_price: "$0.28/1M", output_price: "$1.08/1M" },
    { id: "grok-4.6", name: "Grok 4.6", provider: "xAI", free: false, category: "paid", balance_required: true, typeLabel: "Multimodal Coding & STEM", daily_limit: "Pay-per-token", context_window: 128000, description: "Top-tier multimodal model from xAI leading in programming and STEM reasoning.", input_price: "$1.54/1M", output_price: "$4.62/1M" },
    { id: "grok-4.5", name: "Grok 4.5", provider: "xAI", free: false, category: "paid", balance_required: true, typeLabel: "Multimodal Coding & STEM", daily_limit: "Pay-per-token", context_window: 128000, description: "Flagship multimodal model from xAI for code, STEM, and fast execution.", input_price: "$1.54/1M", output_price: "$4.62/1M" },
    { id: "dots-3-note-preview", name: "Dots 3 Note Preview", provider: "Dots AI", free: false, category: "paid", balance_required: true, typeLabel: "Open-Source LLM", daily_limit: "Pay-per-token", context_window: 128000, description: "First open-source model from Dots AI lab for general text and reasoning.", input_price: "$0.31/1M", output_price: "$1.20/1M" },
    { id: "qwen3.6-flash", name: "Qwen 3.6 Flash", provider: "Qwen / Alibaba", free: false, category: "paid", balance_required: true, typeLabel: "Open-Source Coding", daily_limit: "Pay-per-token", context_window: 128000, description: "Open-source flagship model from Alibaba with ultra-fast response speed.", input_price: "$0.22/1M", output_price: "$0.85/1M" },
    { id: "qwen3.5-omni-plus", name: "Qwen 3.5 Omni Plus", provider: "Qwen / Alibaba", free: false, category: "paid", balance_required: true, typeLabel: "Multimodal Omni Vision", daily_limit: "Pay-per-token", context_window: 128000, description: "Next-gen omni multimodal AI model optimized for visual & text processing.", input_price: "$0.85/1M", output_price: "$5.38/1M" },
    { id: "qwen3.7-plus", name: "Qwen 3.7 Plus", provider: "Qwen / Alibaba", free: false, category: "paid", balance_required: true, typeLabel: "Balanced Reasoning & Logic", daily_limit: "Pay-per-token", context_window: 128000, description: "High-tier AI model balancing complex logical reasoning and technical knowledge.", input_price: "$0.35/1M", output_price: "$1.54/1M" },
    { id: "qwen3.7-max", name: "Qwen 3.7 Max", provider: "Qwen / Alibaba", free: false, category: "paid", balance_required: true, typeLabel: "Deep Reasoning & Arch", daily_limit: "Pay-per-token", context_window: 128000, description: "Premium large-scale model featuring deep reasoning and software engineering.", input_price: "$1.19/1M", output_price: "$3.46/1M" },
    { id: "mimo-v2.5-pro", name: "Mimo V2.5 Pro", provider: "Xiaomi", free: false, category: "paid", balance_required: true, typeLabel: "Flagship Logic & Reasoning", daily_limit: "Pay-per-token", context_window: 128000, description: "Xiaomi flagship cost-optimized model for high-end reasoning and problem solving.", input_price: "$0.85/1M", output_price: "$2.65/1M" },
    { id: "gemini-3.8-flash", name: "Gemini 3.8 Flash", provider: "Gemini / Google", free: false, category: "paid", balance_required: true, typeLabel: "Next-Gen Flash Coding", daily_limit: "Pay-per-token", context_window: 1000000, description: "Next-generation model specifically optimized for coding tasks and workflows.", input_price: "$0.66/1M", output_price: "$3.39/1M" },
    { id: "gemini-3.7-flash", name: "Gemini 3.7 Flash", provider: "Gemini / Google", free: false, category: "paid", balance_required: true, typeLabel: "Next-Gen Flash Coding", daily_limit: "Pay-per-token", context_window: 1000000, description: "Next-generation model optimized for coding tasks and software engineering.", input_price: "$0.66/1M", output_price: "$3.39/1M" },
    { id: "gemini-3.6-flash", name: "Gemini 3.6 Flash", provider: "Gemini / Google", free: false, category: "paid", balance_required: true, typeLabel: "High-Speed Flash Coding", daily_limit: "Pay-per-token", context_window: 1000000, description: "High-speed model specialized for coding workflows and fast development cycles.", input_price: "$1.21/1M", output_price: "$6.92/1M" },
    { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash", provider: "Gemini / Google", free: false, category: "paid", balance_required: true, typeLabel: "High-Speed Flash Coding", daily_limit: "Pay-per-token", context_window: 1000000, description: "Flash architecture optimized for rapid code generation and multi-step tasks.", input_price: "$1.21/1M", output_price: "$6.92/1M" },
    { id: "gemini-3.5-flash-lite", name: "Gemini 3.5 Flash Lite", provider: "Gemini / Google", free: false, category: "paid", balance_required: true, typeLabel: "Ultra-Light Fast Model", daily_limit: "Pay-per-token", context_window: 128000, description: "Compact lightweight version optimized for fast, simple completions.", input_price: "$0.28/1M", output_price: "$1.73/1M" },
    { id: "gemini-3-pro-image-preview", name: "Nano Banana Pro", provider: "Gemini / Google", free: false, category: "paid", balance_required: true, typeLabel: "AI Image Generation", daily_limit: "Pay-per-image", context_window: 128000, description: "High-fidelity AI image generation model from Google.", input_price: "$0.76/img", output_price: "Image" },
    { id: "gemini-3.1-flash-image-preview", name: "Nano Banana 2", provider: "Gemini / Google", free: false, category: "paid", balance_required: true, typeLabel: "Fast AI Image Gen", daily_limit: "Pay-per-image", context_window: 128000, description: "Fast, cost-effective image generation model from Google.", input_price: "$0.42/img", output_price: "Image" },
    { id: "gemini-2.5-flash-image", name: "Nano Banana", provider: "Gemini / Google", free: false, category: "paid", balance_required: true, typeLabel: "AI Image Generation", daily_limit: "Pay-per-image", context_window: 128000, description: "Fast image generation model integrated from Google AI.", input_price: "$2.42/img", output_price: "Image" },
    { id: "gemini-3.1-flash-tts-preview", name: "Gemini 3.1 Flash TTS", provider: "Gemini / Google", free: false, category: "paid", balance_required: true, typeLabel: "Voice Synthesis & Audio", daily_limit: "Pay-per-token", context_window: 128000, description: "High-fidelity Text-to-Speech voice synthesis engine from Google.", input_price: "$0.87/1M", output_price: "$18.17/1M" },
    { id: "gemini-2.5-flash-tts", name: "Gemini 2.5 Flash TTS", provider: "Gemini / Google", free: false, category: "paid", balance_required: true, typeLabel: "Voice Synthesis & Audio", daily_limit: "Pay-per-token", context_window: 128000, description: "Next-gen Text-to-Speech voice audio synthesis engine.", input_price: "$0.26/1M", output_price: "$2.18/1M" },
    { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", provider: "Gemini / Google", free: false, category: "paid", balance_required: true, typeLabel: "Ultra-Fast Light Model", daily_limit: "Pay-per-token", context_window: 128000, description: "Ultra-lightweight high-speed model for fast text processing.", input_price: "$0.07/1M", output_price: "$0.37/1M" },
    { id: "kimi-k3", name: "Kimi K3", provider: "Moonshot AI / Kimi", free: false, category: "paid", balance_required: true, typeLabel: "2.8T MoE Reasoning", daily_limit: "Pay-per-token", context_window: 128000, description: "Moonshot AI 2.8 Trillion parameter MoE open-source model with deep reasoning.", input_price: "$2.60/1M", output_price: "$10.38/1M" },
    { id: "gpt-5.6-luna", name: "GPT 5.6 Luna", provider: "OpenAI", free: false, category: "paid", balance_required: true, typeLabel: "High-Speed General Text", daily_limit: "Pay-per-token", context_window: 1000000, description: "GPT-5.6 generation model optimized for high-speed response and general text.", input_price: "$0.17/1M", output_price: "$0.34/1M" },
    { id: "gpt-5.6-terra", name: "GPT 5.6 Terra", provider: "OpenAI", free: false, category: "paid", balance_required: true, typeLabel: "Balanced Performance LLM", daily_limit: "Pay-per-token", context_window: 1000000, description: "Balanced model between high performance and cost efficiency in GPT-5.6 family.", input_price: "$1.94/1M", output_price: "$11.69/1M" },
    { id: "gpt-5.6-sol", name: "GPT 5.6 Sol", provider: "OpenAI", free: false, category: "paid", balance_required: true, typeLabel: "Top Flagship LLM", daily_limit: "Pay-per-token", context_window: 1000000, description: "Most powerful flagship model in GPT-5.6 series for complex reasoning.", input_price: "$2.91/1M", output_price: "$17.45/1M" },
    { id: "gpt-5.4", name: "GPT 5.4", provider: "OpenAI", free: false, category: "paid", balance_required: true, typeLabel: "Breakthrough Multimodal Logic", daily_limit: "Pay-per-token", context_window: 1000000, description: "Breakthrough next-generation AI model with advanced logic and multimodal reasoning.", input_price: "$1.50/1M", output_price: "$9.00/1M" },
    { id: "gpt-5.4-mini", name: "GPT 5.4 mini", provider: "OpenAI", free: false, category: "paid", balance_required: true, typeLabel: "Compact High-Speed Logic", daily_limit: "Pay-per-token", context_window: 1000000, description: "Smaller, faster version of GPT-5.4 optimized for high-speed coding and logic.", input_price: "$0.37/1M", output_price: "$2.25/1M" },
    { id: "gpt-4o-mini", name: "GPT 4o Mini", provider: "OpenAI / Kira", free: false, category: "paid", balance_required: true, typeLabel: "Fast OpenAI Model", daily_limit: "Pay-per-token", context_window: 128000, description: "OpenAI fast model combining deep reasoning and software engineering support.", input_price: "$0.14/1M", output_price: "$0.87/1M" },
    { id: "hy4", name: "Tencent Hy4 Preview", provider: "Tencent", free: false, category: "paid", balance_required: true, typeLabel: "770B MoE Architecture", daily_limit: "Pay-per-token", context_window: 128000, description: "Next-gen MoE architecture model from Tencent Hunyuan (770B parameters).", input_price: "$0.85/1M", output_price: "$2.54/1M" },
    { id: "qwen3.5-flash", name: "Qwen 3.5 Flash", provider: "Qwen / Alibaba", free: false, category: "paid", balance_required: true, typeLabel: "High-Speed Multimodal Coding", daily_limit: "Pay-per-token", context_window: 128000, description: "Next-gen ultra-fast multimodal model from Alibaba optimized for fast response.", input_price: "$0.22/1M", output_price: "$0.38/1M" },
    { id: "claude-sonnet-5", name: "Claude Sonnet 5", provider: "Anthropic", free: false, category: "paid", balance_required: true, typeLabel: "Flagship Reasoning & Coding", daily_limit: "Pay-per-token", context_window: 200000, description: "Top-tier model from Anthropic combining deep reasoning, synthesis, and coding.", input_price: "$1.73/1M", output_price: "$9.00/1M" },
    { id: "qwen3.8-max", name: "Qwen 3.8 Max", provider: "Qwen / Alibaba", free: false, category: "paid", balance_required: true, typeLabel: "High-Capacity Reasoning", daily_limit: "Pay-per-token", context_window: 128000, description: "Premium large-scale model from Alibaba Qwen with deep reasoning capability.", input_price: "$1.92/1M", output_price: "$5.77/1M" }
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
    statusToast.innerHTML = '<svg stroke="currentColor" viewBox="0 0 24 24" fill="none" style="width:16px; height:16px; flex-shrink:0; color:' + iconColor + ';" xmlns="http://www.w3.org/2000/svg"><path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path></svg><span style="font-size:12.5px; font-weight:500;">' + message + '</span>';
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
      if (model.category === "paid" || (!model.free && model.balance_required)) {
        badge.className = "badge-tag tag-paid";
        badge.textContent = "Paid (" + (model.input_price || "") + " in / " + (model.output_price || "") + " out)";
      } else if (model.balance_required) {
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
      if (modelInfo.category === "paid" || (!modelInfo.free && modelInfo.balance_required)) {
        badge.className = "badge-tag tag-paid";
        badge.textContent = "Paid (" + (modelInfo.input_price || "") + " in / " + (modelInfo.output_price || "") + " out)";
      } else if (modelInfo.balance_required) {
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
      if (modalBannerIcon) modalBannerIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
      if (modalBannerText) modalBannerText.innerHTML = "<strong>Upstream Connection Verified Active!</strong> Model <code>" + selectedId + "</code> responds smoothly from kiraai.vn. Local gateway proxy ready.";
    } else if (data.connectionWarning) {
      const isKeyEmpty = !data.hasApiKey && apiKeyInput && apiKeyInput.value.trim() === "";
      if (isKeyEmpty) {
        if (modalStatusDot) modalStatusDot.className = "status-indicator-dot warning";
        if (modalBanner) modalBanner.className = "modal-status-banner warning";
        if (modalBannerIcon) modalBannerIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
        if (modalBannerText) modalBannerText.innerHTML = "<strong>Gateway Configured! API Key Needed for Live Queries</strong><br>Paste your API key from <a href='https://kiraai.vn/developer' target='_blank' style='color:#fbbf24; font-weight:700;'>kiraai.vn/developer</a> into the key box to test live model queries.";
      } else {
        if (modalStatusDot) modalStatusDot.className = "status-indicator-dot error";
        if (modalBanner) modalBanner.className = "modal-status-banner error";
        if (modalBannerIcon) modalBannerIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
        if (modalBannerText) modalBannerText.innerHTML = "<strong>Gateway Configured — Upstream Connection Warning</strong><br>" + data.connectionWarning;
      }
    } else {
      if (modalStatusDot) modalStatusDot.className = "status-indicator-dot warning";
      if (modalBanner) modalBanner.className = "modal-status-banner warning";
      if (modalBannerIcon) modalBannerIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
      if (modalBannerText) modalBannerText.innerHTML = "<strong>Model Configured for Local Proxy Endpoint</strong>";
    }

    const endpointEl = document.getElementById("modalEndpointUrl");
    if (endpointEl) endpointEl.textContent = window.location.origin + "/v1";

    modalOverlay.classList.add("active");
  }

  function hideConfigModal() {
    if (modalOverlay) modalOverlay.classList.remove("active");
  }

  const STORAGE_KEY_API_KEY = "kira_route_saved_api_key";
  const STORAGE_KEY_MODEL = "kira_route_saved_model";

  function getSavedApiKey() {
    try { return localStorage.getItem(STORAGE_KEY_API_KEY) || ""; } catch { return ""; }
  }

  function getSavedModel() {
    try { return localStorage.getItem(STORAGE_KEY_MODEL) || ""; } catch { return ""; }
  }

  function saveApiKeyLocally(key, model) {
    try {
      if (key) localStorage.setItem(STORAGE_KEY_API_KEY, key);
      if (model) localStorage.setItem(STORAGE_KEY_MODEL, model);
    } catch {}
  }

  function clearSavedApiKeyLocally() {
    try {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
      localStorage.removeItem(STORAGE_KEY_MODEL);
    } catch {}
  }

  async function syncModelSelection() {
    updateModelInspector();
    if (!modelSelect || !apiKeyInput) return;
    const apiKey = apiKeyInput.value.trim();
    const model = modelSelect.value;

    if (apiKey) saveApiKeyLocally(apiKey, model);

    showStatus("Syncing model setting...", "info");
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, model, skipTest: true })
      });
      const data = await res.json();
      if (res.ok) {
        showStatus("Model updated to " + model + ". Local gateway ready.", "success");
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
      if (setupRes.ok && apiKey) {
        saveApiKeyLocally(apiKey, model);
      }
      showConfigModal(setupData);
    } catch {
      showStatus("Could not reach gateway server.", "error");
    }
  }

  async function startAll(isAutoStart) {
    if (!startButton || !modelSelect || !apiKeyInput) return;
    const apiKey = apiKeyInput.value.trim();
    const model = modelSelect.value;

    if (!apiKey) {
      showStatus("Please paste a valid Kira API key to configure gateway.", "warning");
      return;
    }

    startButton.disabled = true;
    startButton.innerHTML = '<span class="spinner"></span> <span>Testing & Auto-Configuring...</span>';
    if (!isAutoStart) {
      showStatus("Auto-configuring environment & testing Kira API connection...", "info");
    }

    try {
      const setupRes = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, model })
      });
      const setupData = await setupRes.json();
      if (!setupRes.ok) throw new Error(setupData?.error?.message || "Setup failed.");

      // Save key locally ONLY AFTER validation/success confirms key is usable
      saveApiKeyLocally(apiKey, model);

      updateModelInspector();
      showStatusPanel(model, !isAutoStart);

      // Show popup modal when explicitly triggered by user click, NOT during background auto-start
      if (!isAutoStart) {
        showConfigModal(setupData);
      }

      if (setupData.connected) {
        showStatus("Connected to Kira AI! Local gateway ready for " + model + ".", "success");
      } else if (setupData.connectionWarning) {
        showStatus("Gateway configured for " + model + ". (" + setupData.connectionWarning + ")", "info");
      } else {
        showStatus("Local gateway auto-configured for " + model + ".", "success");
      }
    } catch (error) {
      let msg = error instanceof Error ? error.message : "Something went wrong.";
      if (msg === "Failed to fetch" || (error && error.name === "TypeError")) {
        msg = "Failed to connect to local gateway server. Please ensure the server terminal is still running.";
      }
      showStatus(msg, "error");
    } finally {
      startButton.disabled = false;
      startButton.innerHTML = '<svg class="btn-svg-icon" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg><span>Configure Gateway & AI Models</span>';
    }
  }

  function copyEndpoint() {
    const endpoint = window.location.origin + "/v1";
    try { navigator.clipboard.writeText(endpoint); } catch {}
    showStatus("API Endpoint copied to clipboard.", "success");
  }

  function resetConfig() {
    clearSavedApiKeyLocally();
    if (apiKeyInput) apiKeyInput.value = "";
    if (statusPanel) statusPanel.className = "status-panel";
    if (statusToast) statusToast.className = "status-toast";
    showStatus("Saved API Key and configuration cleared from local storage.", "info");
  }

  async function copySkillContent() {
    showStatus("Fetching SKILL.md...", "info");
    try {
      const res = await fetch("/api/skill");
      const data = await res.json();
      if (data.content) {
        try { await navigator.clipboard.writeText(data.content); } catch {}
        showStatus("SKILL.md copied to clipboard! Paste into your project rules or AI context.", "success");
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

    html = html.replace(/\\\[([^\\\]]+)\\\]\\\(([^)]+)\\\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    html = html.replace(/^\\s*[-*]\\s+(.*$)/gm, "<li>$1</li>");
    html = html.replace(/(<li>[\\s\\S]*?<\\/li>)/g, "<ul>$1</ul>");

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
    if (startButton) startButton.addEventListener("click", function() { startAll(false); });

    const btnCloseModal = document.getElementById("btnCloseModal");
    if (btnCloseModal) btnCloseModal.addEventListener("click", hideConfigModal);

    const modalBtnClose = document.getElementById("modalBtnClose");
    if (modalBtnClose) modalBtnClose.addEventListener("click", hideConfigModal);

    const modalBtnCopy = document.getElementById("modalBtnCopy");
    if (modalBtnCopy) modalBtnCopy.addEventListener("click", function() { copyEndpoint(); hideConfigModal(); });

    if (modalOverlay) {
      modalOverlay.addEventListener("click", function(e) {
        if (e.target === modalOverlay) hideConfigModal();
      });
    }

    const btnCopyEndpoint = document.getElementById("btnCopyEndpoint");
    if (btnCopyEndpoint) btnCopyEndpoint.addEventListener("click", copyEndpoint);

    const btnCopyEndpoint2 = document.getElementById("btnCopyEndpoint2");
    if (btnCopyEndpoint2) btnCopyEndpoint2.addEventListener("click", copyEndpoint);

    const btnResetConfig = document.getElementById("btnResetConfig");
    if (btnResetConfig) btnResetConfig.addEventListener("click", resetConfig);

    const btnCopySkill = document.getElementById("btnCopySkill");
    if (btnCopySkill) btnCopySkill.addEventListener("click", copySkillContent);

    const btnToggleSkill = document.getElementById("btnToggleSkill");
    if (btnToggleSkill) btnToggleSkill.addEventListener("click", toggleSkillPreview);
  }

  var isAutoStarting = false;

  async function loadInitialStatus() {
    if (isAutoStarting) return;
    isAutoStarting = true;

    let savedKey = getSavedApiKey();
    let savedModel = getSavedModel();

    try {
      const res = await fetch("/api/status");
      const data = await res.json();

      if (!savedKey && data.configured && data.apiKey) {
        savedKey = data.apiKey;
      }
      if (!savedModel && data.model) {
        savedModel = data.model;
      }

      if (savedModel && modelSelect) {
        modelSelect.value = savedModel;
      } else if (data.model && modelSelect) {
        modelSelect.value = data.model;
      }

      if (savedKey && apiKeyInput) {
        apiKeyInput.value = savedKey;
        updateModelInspector();
        showStatus("Saved API key loaded. Auto-starting gateway...", "info");
        await startAll(true);
      } else {
        updateModelInspector();
      }
    } catch {
      if (savedKey && apiKeyInput) {
        apiKeyInput.value = savedKey;
        if (savedModel && modelSelect) modelSelect.value = savedModel;
        updateModelInspector();
        await startAll(true);
      } else {
        updateModelInspector();
      }
    } finally {
      isAutoStarting = false;
    }
  }

  function startLiveHealthMonitor() {
    async function measurePing() {
      const start = performance.now();
      try {
        const res = await fetch("/api/status", { cache: "no-store" });
        const duration = Math.round(performance.now() - start);
        const latEl = document.getElementById("liveLatencyVal");
        if (latEl) latEl.textContent = Math.max(duration, 2) + "ms";

        const sigEl = document.getElementById("liveSignalText");
        if (sigEl) {
          if (res.ok) {
            sigEl.textContent = "Optimal";
            sigEl.style.color = "#34d399";
          } else {
            sigEl.textContent = "Degraded";
            sigEl.style.color = "#fbbf24";
          }
        }
      } catch {
        const latEl = document.getElementById("liveLatencyVal");
        if (latEl) latEl.textContent = "Offline";
        const sigEl = document.getElementById("liveSignalText");
        if (sigEl) {
          sigEl.textContent = "Offline";
          sigEl.style.color = "#f87171";
        }
      }
    }

    measurePing();
    setInterval(measurePing, 3500);
  }

  var initialized = false;
  function initApp() {
    if (initialized) return;
    initialized = true;
    initElements();
    bindEvents();
    loadInitialStatus();
    startLiveHealthMonitor();
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
