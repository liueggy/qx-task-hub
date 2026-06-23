// Quantumult X - 域名 DNS 解析检测
// 检测若干常用域名能否解析，并展示解析结果

function finish(title, subtitle, message) {
  $notify(title, subtitle || "", message || "");
  $done({ title, message: [subtitle, message].filter(Boolean).join("\n\n") });
}

function dohQuery(domain) {
  return $task.fetch({
    url: `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`,
    method: "GET",
    headers: { "Accept": "application/dns-json" },
    timeout: 12000
  }).then(resp => {
    const data = JSON.parse(resp.body || "{}");
    return (data.Answer || data.answer || []).map(a => a.data).filter(Boolean);
  }).catch(() => []);
}

const domains = ["www.apple.com", "github.com", "www.google.com", "chat.openai.com"];
Promise.all(domains.map(d => dohQuery(d).then(records => ({ domain: d, records })))).then(results => {
  const message = results.map(r => {
    return r.records.length > 0
      ? `✅ ${r.domain} -> ${r.records.slice(0, 3).join(", ")}`
      : `❌ ${r.domain} -> 无 A 记录`;
  }).join("\n");
  finish("🧭 域名 DNS 解析检测", "Google DoH 查询", message);
});
