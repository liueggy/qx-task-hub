// Quantumult X - 常用站点状态检测
// 批量检测常见站点连通性和返回状态码

function finish(title, subtitle, message) {
  $notify(title, subtitle || "", message || "");
  $done({ title, message: [subtitle, message].filter(Boolean).join("\n\n") });
}

const targets = [
  { name: "Apple", url: "https://www.apple.com/library/test/success.html" },
  { name: "iCloud", url: "https://www.icloud.com/" },
  { name: "YouTube", url: "https://www.youtube.com/" },
  { name: "Google", url: "https://www.google.com/" },
  { name: "GitHub", url: "https://github.com/" },
  { name: "OpenAI", url: "https://chat.openai.com/" }
];

function probe(target) {
  const started = Date.now();
  return $task.fetch({ url: target.url, method: "GET", timeout: 12000 }).then(resp => ({
    name: target.name,
    ok: (resp.statusCode || 0) >= 200 && (resp.statusCode || 0) < 500,
    code: resp.statusCode || 0,
    cost: Date.now() - started
  })).catch(err => ({
    name: target.name,
    ok: false,
    code: 0,
    error: String(err),
    cost: Date.now() - started
  }));
}

Promise.all(targets.map(probe)).then(results => {
  const ok = results.filter(r => r.ok).length;
  const message = results.map(r => `${r.ok ? "✅" : "❌"} ${r.name} | ${r.code || "失败"} | ${r.cost} ms`).join("\n");
  finish("🌐 常用站点状态检测", `${ok}/${results.length} 可访问`, message);
});
