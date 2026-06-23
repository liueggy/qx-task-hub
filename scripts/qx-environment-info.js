// Quantumult X - 任务环境信息
// 显示 QX 运行环境、网络与常见脚本上下文信息

function finish(title, subtitle, message) {
  $notify(title, subtitle || "", message || "");
  $done({ title, message: [subtitle, message].filter(Boolean).join("\n\n") });
}

const env = $environment || {};
const params = typeof env.params === "object" ? env.params : {};
const message = [
  `app: ${env.app || "未知"}`,
  `appVersion: ${env.appVersion || "未知"}`,
  `system: ${env.system || "未知"}`,
  `systemVersion: ${env.systemVersion || "未知"}`,
  `language: ${env.language || "未知"}`,
  `sourcePath: ${env.sourcePath || "未知"}`,
  `ssid: ${env.ssid || "未知"}`,
  `bssid: ${env.bssid || "未知"}`,
  `networkAddress: ${env.networkAddress || "未知"}`,
  `params: ${JSON.stringify(params)}`
].join("\n");

finish("🧪 Quantumult X 环境信息", "脚本运行上下文", message);
