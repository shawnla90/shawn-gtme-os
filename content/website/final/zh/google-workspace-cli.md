---
title: "Google 刚发布了一个封装所有 Workspace API 的 CLI"
date: "2026-03-06"
excerpt: "gws 是一个新的 CLI，把每个 Google Workspace API 变成 shell 命令，还有89个 Claude Code 智能体技能。我安装了它，用真实 GTM 工作测试，挑出了值得有的27个技能，并了解了为什么不应该一次全部加载。"
---

## gws 到底是什么

Google 悄悄发布了一个叫 `gws` 的 CLI，封装了所有 Workspace API。Gmail、Drive、Calendar、Sheets、Docs、Tasks，全部包含。一个命令行工具搞定。

但真正的亮点是智能体技能。89个，专为 Claude Code 打造。用 `npx skills add` 安装，你的编程智能体就能读收件箱、查日历、往表格追加数据、创建任务。不用配 MCP 服务器，不用复制粘贴 API 密钥，不用写自定义中间件。

我花了好几个月拼接 Google API 访问。OAuth 流程、MCP 服务器、JSON 解析、权限范围管理。能用，但脆弱，维护起来烦人。`gws` 用一个原生支持 JSON 的已认证 CLI 替代了所有这些。

坑在这里：这不是 Google 官方支持的产品。README 里写得很清楚。但它能用，而且是基于 Google 官方 Discovery Service 构建的，所以 API 覆盖面是真实的。

## 安装配置（实际命令）

下面是我执行的完整步骤。不做概括，这些是真实命令。

**第一步：设置你的 GCP 项目**

```bash
gcloud config set project gen-lang-client-0948745603
```

用你已经启用了 API 的项目就行。我用的是 Gemini API 项目，因为它已经启用了 Gmail API。

**第二步：启用你需要的 API**

```bash
gcloud services enable \
  drive.googleapis.com \
  sheets.googleapis.com \
  calendar-json.googleapis.com \
  docs.googleapis.com \
  tasks.googleapis.com
```

Gmail API 已经启用了，其余的一条命令搞定。

**第三步：创建 OAuth 桌面客户端**

这是 `gws auth setup` 无法自动完成的唯一一步。你需要手动进 GCP 控制台：

1. 配置 OAuth 同意屏幕（External，填你的邮箱，一路保存）
2. 创建凭据，OAuth 客户端 ID，桌面应用类型
3. 下载 `client_secret_*.json` 文件
4. 放到 `~/.config/gws/client_secret.json`

`gws auth setup` 命令会尝试帮你做这些，但会遇到验证错误。你必须在控制台里手动操作。花了3分钟。

**第四步：使用限定范围的服务进行认证**

```bash
gws auth login -s drive,gmail,calendar,sheets,tasks,docs
```

这会打开浏览器，你登录后授权访问这6个服务。`-s` 标志很重要。Google 测试模式的应用有25个 scope 的上限。只限定你用的服务，就能安全地不超限。

**第五步：验证**

```bash
gws auth status
```

应该显示凭据存在，并列出已授权的服务。

## 该安装哪些技能（以及如何不搞崩你的上下文窗口）

`gws` 自带89个智能体技能。不要全部安装。甚至不要把27个都装到活跃技能目录。这个教训我是用血泪换来的。

`~/.claude/skills/` 里的每个技能在每次会话启动时都会加载到智能体的上下文窗口。27个技能大约是50KB的指令，Claude 还没等你开口就要先读完。如果你在编辑一个 React 组件或者调试部署问题，那些 Google Workspace 上下文完全不相关，只是在浪费 token。

**正确做法：只把一个技能放在活跃上下文里，其余的停靠在旁边。**

把 `gws-shared` 安装到活跃技能里。它是基础层，教 Claude 如何认证、使用全局标志和格式化输出。大约2KB。这是你默认需要加载的全部。

```bash
npx skills add googleworkspace/cli --skill gws-shared --agent claude-code -y -g
```

然后把其他需要的技能安装到停靠目录：

```bash
# 安装到全局技能仓库（不自动加载）
npx skills add googleworkspace/cli --skill gws-gmail gws-calendar gws-sheets gws-drive gws-tasks gws-docs --agent claude-code -y -g

# 移出自动加载目录
mkdir -p ~/.claude/skills-available
mv ~/.claude/skills/gws-gmail ~/.claude/skills-available/
mv ~/.claude/skills/gws-calendar ~/.claude/skills-available/
# ... 每个技能都这样操作
```

当你需要一个以 GWS 为主的会话（收件箱整理、日历检查、表格操作）时，把需要的技能软链接回来：

```bash
ln -s ~/.claude/skills-available/gws-gmail ~/.claude/skills/gws-gmail
ln -s ~/.claude/skills-available/gws-gmail-triage ~/.claude/skills/gws-gmail-triage
```

用完就删掉。你的上下文窗口是有限的。把它当内存管理，不是杂物抽屉。

## 值得安装的27个技能

以下是我安装并停靠的技能，按功能分组。

**基础层（始终加载）**

`gws-shared` - 认证、全局标志、输出格式化。唯一留在 `~/.claude/skills/` 里的。

**核心服务（6个技能）**

每个 Workspace API 一个技能：`gmail`、`calendar`、`sheets`、`drive`、`tasks`、`docs`。这些让 Claude Code 能调用每个服务的任何端点。通用但完整。

**辅助工具（9个技能）**

专用操作，省去构建原始 API 调用的麻烦：

- `gmail-send`、`gmail-triage`、`gmail-watch` - 发邮件、批量整理收件箱、监听新消息
- `calendar-agenda`、`calendar-insert` - 查看日程、创建事件
- `sheets-read`、`sheets-append` - 读取范围、追加行
- `drive-upload` - 上传文件
- `docs-write` - 创建和编辑文档

这些才是你真正会用到的。核心服务技能是辅助工具覆盖不到时的后备。

**工作流（5个技能）**

串联多个服务的复合操作：

- `workflow` - 通用多步编排
- `standup-report` - 从日历 + 任务 + Gmail 拉取晨间简报
- `meeting-prep` - 为即将到来的会议收集上下文
- `email-to-task` - 把邮件转成 Google Tasks
- `weekly-digest` - 汇总一周内所有服务的情况

**配方（6个技能）**

GTM 相关的具体自动化：

- `draft-email-from-doc` - 把 Google Doc 变成邮件草稿
- `email-drive-link` - 通过邮件分享 Drive 文件
- `find-free-time` - 查看日历空闲时间
- `create-task-list` - 创建新的任务列表
- `review-overdue-tasks` - 浮出已逾期的任务
- `log-deal-update` - 把交易备注追加到跟踪表

**我跳过的（62个技能）**

Chat、Classroom、Keep、Meet、Admin Reports、Model Armor、Slides、Forms、People、Events，以及它们所有的辅助工具/配方。

如果你是独立运营者或做 GTM 工作的小团队，你不需要教室管理或管理报告。安装与你实际工作流匹配的，以后随时可以加。

## 实际命令

实际使用起来是这样的。

**查看最新邮件：**

```bash
gws gmail users messages list --params '{"userId":"me","maxResults":1}'
```

**列出你的 Drive 文件：**

```bash
gws drive files list --params '{"pageSize":5}'
```

**查看今天的日历：**

```bash
gws calendar calendarList list
```

**列出你的任务列表：**

```bash
gws tasks tasklists list
```

每条命令返回干净的 JSON。这就是重点。Claude Code 能解析它、推理它、把它串联成多步工作流，不需要任何适配代码。

## 坑点

**OAuth scope 限制。** 测试模式的应用 scope 上限是25个。6个服务远低于上限，但如果你试图一次启用所有服务就会碰壁。

**shell 转义。** Sheets 范围用 `!`（比如 `Sheet1!A1:B10`）。在 bash 里，`!` 会触发历史展开。用单引号包裹你的参数。

**非官方支持。** 仓库 README 写得很清楚。这不是 Google 产品。这是基于 Google API 构建的工具。今天能用。6个月后能不能用取决于 Google 是否继续维护。

**不要把27个技能全加载到活跃上下文。** 我这么做了，然后立刻意识到问题。50KB 的 Workspace 指令在每次会话都加载，不管你需不需要。让 `gws-shared` 保持活跃，其余的放到 `skills-available` 目录，按需软链接。

**npx skills add 会克隆仓库。** 每次技能安装都会拉取完整仓库。第一次会很慢。接受它。

**到处都是 JSON 参数。** 每个 `--params` 标志都接受 JSON 字符串。习惯在 shell 里用单引号包裹 JSON，或者从文件管道输入。

## 诚实评价

`gws` 解决了一个真实问题。为智能体使用场景拼接 Google Workspace API 一直是构建 GTM 基础设施中最烦人的部分之一。OAuth 流程、MCP 服务器配置、权限范围管理、token 刷新，全是不产生价值的摩擦。

这个工具消除了大部分摩擦。一个 CLI，一次认证流程。JSON 进，JSON 出。89个技能直接接入 Claude Code。

技能质量参差不齐。核心服务封装很扎实。有些工作流技能还比较早期。但基础是对的，而且因为它基于 Google 官方 Discovery Service 构建，API 覆盖是完整的，不是手工拼凑的。

对于以 Claude Code 为主要智能体的独立 GTM 运营者来说，这是我找到的最干净的 Google Workspace 集成路径。安装与你工作匹配的技能，把它们停靠在活跃上下文之外，需要时再拉进来。你的上下文窗口是技术栈中最昂贵的资源。不要用当前会话用不到的服务指令去填满它。

这就是我做的。然后立刻撤销了把27个全部加载的操作。

shawn ⚡
