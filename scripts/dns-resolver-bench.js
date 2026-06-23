// Quantumult X - DNS 解析器对比测速
// 使用 DoH 对 Cloudflare / Google 解析多个域名，粗略比较可用性与时延

const domains = ["www.apple.com", "github.com", "cloudflare.com", "www.google.com"];

const resolvers = [
  { name: "Cloudflare 1.1.1.1", url: domain => `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A` },
  { name: "Google 8.8.8.8", url: domain => `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A` }
];

function finish(title, subtitle, message) {
  $notify(title, subtitle || "", message || "");
  $done({ title, message: [subtitle, message].filter(Boolean).join("\n\n") });
}

function fetchOne(resolver, domain) {
  const started = Date.now();
  return $task.fetch({
    url: resolver.url(domain),
    method: "GET",
    headers: { "Accept": "application/dns-json" },
    timeout: 12000
  }).then(resp => {
    const data = JSON.parse(resp.body || "{}");
    const answers = (data.Answer || data.answer || []).map(a => a.data).filter(Boolean);
    return {
      resolver: resolver.name,
      domain,
      ok: answers.length > 0,
      cost: Date.now() - started,
      records: answers.slice(0, 3)
    };
  }).catch(err => ({
    resolver: resolver.name,
    domain,
    ok: false,
    cost: Date.now() - started,
    error: String(err)
  }));
}

const jobs = [];
resolvers.forEach(r => domains.forEach(d => jobs.push(fetchOne(r, d))));

Promise.all(jobs).then(results => {
  const summary = resolvers.map(r => {
    const items = results.filter(x => x.resolver === r.name);
    const ok = items.filter(x => x.ok);
    const avg = ok.length ? Math.round(ok.reduce((s, x) => s + x.cost, 0) / ok.length) : 0;
    return `${ok.length}/${items.length} 成功，平均 ${avg} ms | ${r.name}`;
  });

  const details = results.map(r => {
    const left = `${r.ok ? "✅" : "❌"} ${r.resolver}`;
    const right = r.ok ? `${r.domain} => ${r.records.join(", ")} (${r.cost} ms)` : `${r.domain} 失败 (${r.cost} ms)`;
    return `${left} | ${right}`;
  });

  finish("🧬 DNS 解析器对比", summary.join("\n"), details.join("\n"));
});
