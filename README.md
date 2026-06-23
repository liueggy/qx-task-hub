# QX Task Hub

Quantumult X 任务仓库，提供可在「请求列表 / 任务仓库」中导入的 `event-interaction` 工具脚本。

本仓库适配 Quantumult X 的 **Gallery JSON** 格式，可直接作为任务仓库导入。

## 导入方式

在 Quantumult X 中：

1. 进入 **请求列表**
2. 点击右上角 `+`
3. 选择 / 输入 **任务仓库** 链接
4. 粘贴本仓库 Raw 链接：

```text
https://raw.githubusercontent.com/liueggy/qx-task-hub/main/gallery.json
```

> 如果仓库名不同，把上面的 `liueggy/qx-task-hub` 换成你的实际 GitHub 仓库路径。

## 当前任务

### 基础检测
| 名称 | 脚本 | 作用 |
| --- | --- | --- |
| 当前出口 IP 查询 | [ip-info.js](scripts/ip-info.js) | 查询当前代理出口 IP、地区、ISP |
| 出口 IP 风险检测 | [ip-asn-risk.js](scripts/ip-asn-risk.js) | 检测是否可能为云机房 / VPN / Hosting 出口 |
| HTTPBin 请求检测 | [httpbin-check.js](scripts/httpbin-check.js) | 检测请求头、出口 IP、HTTPS 连通性 |
| Quantumult X 环境信息 | [qx-environment-info.js](scripts/qx-environment-info.js) | 查看 QX 运行环境、网络与脚本上下文 |

### DNS
| 名称 | 脚本 | 作用 |
| --- | --- | --- |
| DNS 泄漏检测 | [dns-leak.js](scripts/dns-leak.js) | 查询 Cloudflare Trace，判断出口与 DNS/机房信息 |
| DNS 解析器对比测速 | [dns-resolver-bench.js](scripts/dns-resolver-bench.js) | 对比 Cloudflare / Google DoH 解析可用性和耗时 |
| 域名 DNS 解析检测 | [dns-domain-check.js](scripts/dns-domain-check.js) | 用 Google DoH 检测常用域名是否能正常解析 |

### 站点与流媒体
| 名称 | 脚本 | 作用 |
| --- | --- | --- |
| 常用站点状态检测 | [site-status-check.js](scripts/site-status-check.js) | 检测 Apple / YouTube / GitHub / OpenAI 等站点可访问性 |
| 流媒体站点可访问性 | [media-unlock-check.js](scripts/media-unlock-check.js) | 检测 Netflix / Disney+ / YouTube / ChatGPT 是否可访问 |
| Apple 服务连通性 | [apple-service-check.js](scripts/apple-service-check.js) | 检测 Apple 主站 / Apple ID / iCloud / Music / Developer / App Store |
| GitHub Raw 连通性 | [github-raw-check.js](scripts/github-raw-check.js) | 检测 GitHub Web 和 Raw 资源是否可访问 |

### 网络与链路
| 名称 | 脚本 | 作用 |
| --- | --- | --- |
| 代理网关出口检测 | [proxy-gateway-check.js](scripts/proxy-gateway-check.js) | 多站点检测当前出口 IP 是否一致，判断链路和策略状态 |
| 节点延迟粗测 | [latency-check.js](scripts/latency-check.js) | 对 Google / Cloudflare / Apple / GitHub 做简易延迟统计 |

## 说明

- 所有脚本均为 QX `event-interaction` 手动触发任务。
- 脚本同时返回 **系统通知** 与 **任务弹窗结果**。
- QX `event-interaction` 弹窗结果使用 `$done({title, message})`，不是 `$done({})`。
- 图标使用开源 [Qure IconSet](https://github.com/Koolson/Qure)，并通过 jsDelivr CDN 加速。
- 脚本不会收集 Cookie、Token、订阅地址或账号密码。

## 目录

```text
gallery.json            # QX 任务仓库入口（Gallery JSON）
tasks.conf              # 兼容入口，内容与 gallery.json 一致
scripts/                # JS 脚本
icons/                  # 图标，可后续添加
```
