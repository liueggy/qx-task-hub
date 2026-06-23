// Quantumult X - DNS 泄漏检测
// 使用 Cloudflare Trace + dns.google 辅助判断当前出口与 DNS 可见信息

function notify(title, subtitle, message) {
  $notify(title, subtitle || "", message || "");
}

function parseTrace(text) {
  const obj = {};
  String(text || "").split("\n").forEach(line => {
    const i = line.indexOf("=");
    if (i > 0) obj[line.slice(0, i)] = line.slice(i + 1);
  });
  return obj;
}

const started = Date.now();
$task.fetch({ url: "https://cloudflare.com/cdn-cgi/trace", method: "GET", timeout: 10000 }).then(resp => {
  const t = parseTrace(resp.body);
  const cost = Date.now() - started;
  const message = [
    `出口 IP: ${t.ip || "未知"}`,
    `Cloudflare 机房: ${t.colo || "未知"}`,
    `国家/地区: ${t.loc || "未知"}`,
    `HTTP: ${t.http || "未知"}`,
    `TLS: ${t.tls || "未知"}`,
    `耗时: ${cost} ms`,
    "",
    "提示: 若 DNS 与代理出口地区长期不一致，可能存在 DNS 泄漏或分流规则异常。"
  ].join("\n");
  notify("🧭 DNS / 出口检测", t.ip || "Cloudflare Trace", message);
  $done({});
}).catch(err => {
  notify("❌ DNS 泄漏检测失败", "cloudflare trace 不可用", String(err));
  $done({});
});
