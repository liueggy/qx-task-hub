// Quantumult X - HTTPBin 请求检测
// 检查当前请求头、来源 IP 和基础 HTTPS 连通性

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

const started = Date.now();
$task.fetch({
  url: "https://httpbin.org/anything",
  method: "GET",
  headers: {
    "User-Agent": "QuantumultX-Task-Hub/1.0",
    "X-QX-Task": "httpbin-check"
  },
  timeout: 15000
}).then(resp => {
  const cost = Date.now() - started;
  const d = JSON.parse(resp.body || "{}");
  const headers = d.headers || {};
  const message = [
    `状态码: ${resp.statusCode || "未知"}`,
    `出口 IP: ${d.origin || "未知"}`,
    `方法: ${d.method || "GET"}`,
    `UA: ${headers["User-Agent"] || headers["user-agent"] || "未知"}`,
    `耗时: ${cost} ms`
  ].join("\n");
  finish("✅ HTTPBin 请求检测", d.origin || "连通正常", message);
}).catch(err => {
  finish("❌ HTTPBin 请求检测失败", "无法访问 httpbin.org", String(err));
});
