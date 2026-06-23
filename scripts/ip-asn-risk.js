// Quantumult X - 高级出口 IP 风险检测
// 结合 IP / ASN / 地区 / 反向DNS 风险提示

const ipProviders = [
  {
    name: "ipinfo.io",
    url: "https://ipinfo.io/json",
    parse: body => {
      const d = JSON.parse(body);
      return {
        ip: d.ip,
        asn: d.org || d.asn || "未知",
        city: d.city,
        region: d.region,
        country: d.country,
        timezone: d.timezone,
        privacyRisk: /vpn|hosting|cloud|proxy/i.test(String(d.org || ""))
      };
    }
  },
  {
    name: "ipapi.co",
    url: "https://ipapi.co/json/",
    parse: body => {
      const d = JSON.parse(body);
      return {
        ip: d.ip,
        asn: d.org || d.asn || "未知",
        city: d.city,
        region: d.region,
        country: d.country_name,
        timezone: d.timezone,
        privacyRisk: /amazon|google|microsoft|cloudflare|akamai|digitalocean|ovh|hetzner|linode|vultr|alibaba/i.test(String(d.org || d.asn || ""))
      };
    }
  }
];

function finish(title, subtitle, message) {
  $notify(title, subtitle || "", message || "");
  $done({ title, message: [subtitle, message].filter(Boolean).join("\n\n") });
}

function tryFetch(index) {
  if (index >= ipProviders.length) return finish("❌ 出口风险检测失败", "IP API 全部不可用", "请检查网络或代理策略");
  const provider = ipProviders[index];
  $task.fetch({ url: provider.url, method: "GET", timeout: 10000 }).then(resp => {
    const info = provider.parse(resp.body || "{}");
    const risk = info.privacyRisk ? "⚠️ 可能为 VPN / Hosting / 云出口" : "✅ 未检测到明显机房特征";
    const message = [
      `IP: ${info.ip || "未知"}`,
      `ASN: ${info.asn || "未知"}`,
      `位置: ${[info.city, info.region, info.country].filter(Boolean).join(" / ") || "未知"}`,
      `时区: ${info.timezone || "未知"}`,
      `来源: ${provider.name}`,
      `风险提示: ${risk}`,
      "",
      "说明：该检测基于 ASN / Org 文本规则，仅供参考，不代表绝对准确。"
    ].join("\n");
    finish("🛡️ 出口 IP 风险检测", info.ip || provider.name, message);
  }).catch(() => tryFetch(index + 1));
}

tryFetch(0);
