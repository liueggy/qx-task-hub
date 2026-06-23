// Quantumult X - 流媒体解锁粗测（Netflix / Disney+ / YouTube Premium / GPT 站）
// 仅做表面连通与页面状态判断，不代表完整解锁体验。

function finish(title, subtitle, message) {
  $notify(title, subtitle || "", message || "");
  $done({ title, message: [subtitle, message].filter(Boolean).join("\n\n") });
}

function check(target) {
  const started = Date.now();
  return $task.fetch({ url: target.url, method: "GET", headers: target.headers || {}, timeout: 15000 }).then(resp => ({
    name: target.name,
    ok: true,
    code: resp.statusCode || 0,
    body: resp.body || "",
    cost: Date.now() - started
  })).catch(err => ({
    name: target.name,
    ok: false,
    code: 0,
    body: "",
    error: String(err),
    cost: Date.now() - started
  }));
}

function judge(target, r) {
  if (!r.ok) return "❌ 请求失败";
  if (r.code >= 500) return "⚠️ 站点返回错误";
  if (/not available|unavailable|blocked|not supported/i.test(r.body)) return "⚠️ 页面提示不可用";
  return "✅ 可访问";
}

const targets = [
  { name: "Netflix", url: "https://www.netflix.com/title/70143836" },
  { name: "Disney+", url: "https://www.disneyplus.com/" },
  { name: "YouTube", url: "https://www.youtube.com/premium" },
  { name: "ChatGPT", url: "https://chatgpt.com/" }
];

Promise.all(targets.map(check)).then(results => {
  const summary = results.map(r => `${judge(targets.find(t => t.name === r.name) || {}, r)} ${r.name} | ${r.ok ? r.code : "失败"} | ${r.cost} ms`);
  const okCount = summary.filter(x => x.startsWith("✅")).length;
  finish("📺 流媒体站点可访问性", `${okCount}/${targets.length} 可用`, summary.join("\n"));
});
