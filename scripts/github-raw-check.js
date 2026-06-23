// Quantumult X - GitHub Raw 连通性检测

function notify(title, subtitle, message) {
  $notify(title, subtitle || "", message || "");
}

function finish(title, subtitle, message) {
  notify(title, subtitle, message);
  $done({
    title: title,
    message: [subtitle, message].filter(Boolean).join("\n\n")
  });
}

const targets = [
  "https://raw.githubusercontent.com/crossutility/Quantumult-X/master/sample.conf",
  "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/README.md",
  "https://github.com/"
];

function checkOne(url) {
  const started = Date.now();
  return $task.fetch({ url, method: "GET", timeout: 15000 }).then(resp => {
    return {
      url,
      ok: true,
      status: resp.statusCode || 200,
      cost: Date.now() - started
    };
  }).catch(err => ({ url, ok: false, error: String(err), cost: Date.now() - started }));
}

Promise.all(targets.map(checkOne)).then(results => {
  const lines = results.map(r => {
    const name = r.url.includes("raw.githubusercontent") ? "GitHub Raw" : "GitHub Web";
    return `${r.ok ? "✅" : "❌"} ${name}: ${r.ok ? r.status : "失败"} / ${r.cost} ms`;
  });
  const okCount = results.filter(r => r.ok).length;
  finish("🐙 GitHub 连通性", `${okCount}/${results.length} 可访问`, lines.join("\n"));
});
