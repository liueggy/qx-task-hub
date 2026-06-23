// Quantumult X - 当前出口 IP 查询
// Author: LiuEggy / Alice

const API_LIST = [
  {
    name: "ipapi.co",
    url: "https://ipapi.co/json/",
    parse: body => {
      const d = JSON.parse(body);
      return {
        ip: d.ip,
        country: d.country_name,
        region: d.region,
        city: d.city,
        isp: d.org || d.asn,
        timezone: d.timezone
      };
    }
  },
  {
    name: "ip-api.com",
    url: "http://ip-api.com/json/?lang=zh-CN",
    parse: body => {
      const d = JSON.parse(body);
      return {
        ip: d.query,
        country: d.country,
        region: d.regionName,
        city: d.city,
        isp: d.isp || d.org,
        timezone: d.timezone
      };
    }
  }
];

function notify(title, subtitle, message) {
  $notify(title, subtitle || "", message || "");
}

function fetchWithApi(index) {
  if (index >= API_LIST.length) {
    notify("❌ 当前出口 IP 查询失败", "所有接口均不可用", "请检查网络或代理策略");
    $done({});
    return;
  }

  const api = API_LIST[index];
  const started = Date.now();
  $task.fetch({ url: api.url, method: "GET", timeout: 10000 }).then(resp => {
    const info = api.parse(resp.body || "{}");
    const cost = Date.now() - started;
    const lines = [
      `IP: ${info.ip || "未知"}`,
      `位置: ${[info.country, info.region, info.city].filter(Boolean).join(" / ") || "未知"}`,
      `ISP: ${info.isp || "未知"}`,
      `时区: ${info.timezone || "未知"}`,
      `接口: ${api.name}`,
      `耗时: ${cost} ms`
    ];
    notify("🌐 当前出口 IP", info.ip || api.name, lines.join("\n"));
    $done({});
  }).catch(() => fetchWithApi(index + 1));
}

fetchWithApi(0);
