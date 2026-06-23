// Quantumult X - 节点延迟粗测
// 通过多站点 GET 请求粗略估算当前策略/节点访问耗时，不等同于真实 ICMP ping。

function notify(title, subtitle, message) {
  $notify(title, subtitle || "", message || "");
}

const targets = [
  { name: "Google 204", url: "https://www.google.com/generate_204" },
  { name: "Cloudflare", url: "https://cloudflare.com/cdn-cgi/trace" },
  { name: "Apple", url: "https://www.apple.com/library/test/success.html" },
  { name: "GitHub", url: "https://github.com/" }
];

function check(target) {
  const started = Date.now();
  return $task.fetch({ url: target.url, method: "GET", timeout: 15000 }).then(resp => ({
    name: target.name,
    ok: true,
    code: resp.statusCode || 200,
    cost: Date.now() - started
  })).catch(err => ({
    name: target.name,
    ok: false,
    error: String(err),
    cost: Date.now() - started
  }));
}

Promise.all(targets.map(check)).then(results => {
  const ok = results.filter(r => r.ok);
  const avg = ok.length ? Math.round(ok.reduce((s, r) => s + r.cost, 0) / ok.length) : 0;
  const lines = results.map(r => `${r.ok ? "✅" : "❌"} ${r.name}: ${r.ok ? r.cost + " ms" : "失败"}`);
  notify("⚡ 节点延迟粗测", ok.length ? `平均 ${avg} ms` : "全部失败", lines.join("\n"));
  $done({});
});
