# QX Task Hub

Quantumult X 任务仓库，提供可在「请求列表 / 任务仓库」中导入的 `event-interaction` 工具脚本。

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

| 名称 | 作用 |
| --- | --- |
| 当前出口 IP 查询 | 查询当前代理出口 IP、地区、ISP |
| DNS 泄漏检测 | 查询当前 DNS 出口信息 |
| HTTPBin 请求检测 | 检测请求头、出口 IP、连通性 |
| GitHub Raw 连通性 | 检测 GitHub Raw 是否可访问 |
| 节点延迟粗测 | 对常用测试地址做简易请求耗时统计 |

## 说明

- 所有脚本均为 QX `event-interaction` 手动触发任务。
- 脚本不会收集 Cookie、Token、订阅地址或账号密码。
- 输出通过 QX 通知展示。

## 目录

```text
tasks.conf              # QX 任务仓库入口
scripts/                # JS 脚本
icons/                  # 图标，可后续添加
```
