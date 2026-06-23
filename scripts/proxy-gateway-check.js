// Quantumult X - 代理网关/出口链路检测
// 对同一出口 IP 检测多个站点，判断当前策略是否一致且可用

function finish(title, subtitle, message) {
  $notify(title, subtitle || "", message || "");
  $done({ title, message: [subtitle, message].filter(Boolean).join("\n\n") });
}

function tryFetch(url) {
  const started = Date.now();
  return $task.fetch({ url, method: "GET", timeout: 10000 })
    .then(resp => ({ url, ok: true, code: resp.statusCode || 200, body: resp.body || "", cost: Date.now() - started }))
    .catch(err => ({ url, ok: false, error: String(err), cost: Date.now() - started }));
}

function extractIP(body) {
  try {
    const d = JSON.parse(body);
    return d.ip || d.origin || d.query || "";
  } catch (e) {
    return "";
  }
}

const checks = [
  { name: "ipinfo", url: "https://ipinfo.io/json" },
  { name: "httpbin", url: "https://httpbin.org/anything" },
  { name: "cloudflare", url: "https://cloudflare.com/cdn-cgi/trace" }
];

Promise.all(checks.map(c => tryFetch(c.url))).then(results => {
  const rows = results.map((r, i) => {
    const ip = r.ok ? extractIP(r.body) : "";
    return { name: checks[i].name, ip, ...r };
  });

  const ips = [...new Set(rows.filter(r => r.ip).map(r => r.ip))];
  const okCount = rows.filter(r => r.ok).length;
  const same = ips.length <= 1 ? "一致" : "不一致，可能链路或 DNS 分流异常";
  const message = rows.map(r => {
    const left = r.ok ? "✅" : "❌";
    return `${left} ${r.name} | ${r.ip || "无IP"} | ${r.cost} ms`;
  }).join("\n");

  finish("🔗 代理网关/出口链路检测", `${okCount}/${rows.length} 正常，出口${same}`, `${message}\n\n出口 IP 集合: ${ips.join(", ") || "无"}`);
});
