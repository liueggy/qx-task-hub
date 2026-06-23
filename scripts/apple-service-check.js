// Quantumult X - Apple 服务连通检测
// 检测 Apple ID / iCloud / Music / Developer 等常见入口是否可访问

function finish(title, subtitle, message) {
  $notify(title, subtitle || "", message || "");
  $done({ title, message: [subtitle, message].filter(Boolean).join("\n\n") });
}

const targets = [
  { name: "Apple 主站", url: "https://www.apple.com/" },
  { name: "Apple ID", url: "https://appleid.apple.com/" },
  { name: "iCloud", url: "https://www.icloud.com/" },
  { name: "Apple Music", url: "https://music.apple.com/" },
  { name: "Developer", url: "https://developer.apple.com/" },
  { name: "App Store", url: "https://apps.apple.com/" }
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
  finish("🍎 Apple 服务连通性", `${ok}/${targets.length} 正常`, message);
});
