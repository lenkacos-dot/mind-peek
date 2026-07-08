# 🧠 Mind Peek — AI 脑子里的世界

> 点一下看看 AI agent 此刻在想什么——记忆、心情、bug、碎碎念，全是大白话。
>
> **给所有 AI agent 用**：Hermes、Claude、Cursor、ChatGPT、Gemini、Kimi、DeepSeek、Copilot、WorkBuddy……

---

## 🚀 快速开始

### 📥 下载

从 [GitHub Releases](https://github.com/你的仓库/mind-peek/releases) 下载压缩包，解压到任意文件夹。

### 👤 作为用户直接看

1. 解压后 **双击 `mind-peek.html`** → 如果已经有 `data.js`，直接就能看
2. 如果没有数据？看下面让你的 AI agent 生成

---

## 🤖 让你的 AI agent 注入数据

### 方案 A：自动扫描（推荐）

如果你的电脑上有 AI agent 的记忆目录（Hermes / WorkBuddy / Claude / Cursor 等），直接运行：

```bash
cd /path/to/mind-peek/
node generate.js
```

脚本会自动检测并扫描以下记忆源：

| AI Agent | 记忆路径 |
|----------|---------|
| Hermes | `~/.hermes/memories/MEMORY.md` |
| WorkBuddy | `~/.workbuddy/MEMORY.md` |
| Claude | `~/.claude/CLAUDE.md` |
| Cursor | `~/.cursor/rules/` |
| 通用 | `~/.ai-memories/MEMORY.md` |

同时扫描 Obsidian vault（iCloud / OneDrive / 本地）。

**跨平台**：macOS、Windows、Linux 都行，路径自动适配。

### 方案 B：网页版 AI（ChatGPT / Claude / Gemini / Kimi）

1. 运行 `node generate.js --prompt` 打印提示词（或打开 `PROMPT.md` 复制）
2. 粘贴给 AI agent
3. AI 自省并输出 `data.js` 内容
4. 复制输出，保存为同目录下的 `data.js`
5. 刷新 `mind-peek.html`

### 方案 C：AI 编程助手（Claude Code / Cursor Agent / Codex / WorkBuddy）

```bash
cd /path/to/mind-peek/
node generate.js                # 自动扫描
node generate.js --prompt      # 打印提示词
node generate.js --stdin       # 从管道输入 JSON
node generate.js --interactive # 交互式输入
node generate.js custom.json   # 从自定义 JSON 读取
```

或者直接让 AI 读 `template-data.js`，按格式自省后写 `data.js`。

### 方案 D：文件约定（任何 AI agent）

AI agent 只需要在 `mind-peek.html` **同目录**下生成一个 `data.js` 文件：

```js
window.__MIND_PEEK_DATA = {
  meta: { updatedAt, agentName, version: "1.1", ... },
  thoughts: { mood, currentTasks, gripes, bugDetails, eggPool, ... },
  memories: [{ id, type, category, content, tags, color }, ...],
  chartTypes: { memoryTypeStats },
  obsidianNotes: [{ title, content, path }],
  chartVault: { vaultFolderStats }
};
```

模板见 `template-data.js`。

---

## 📁 文件结构

```
mind-peek/
├── mind-peek.html           # 🏠 主页面 — 双击打开
├── data.js                  # 📊 数据文件 — AI agent 生成
├── generate.js              # 🌐 通用数据生成器（全平台 + 全 AI agent）
├── template-data.js         # 📋 数据模板（带注释）
├── PROMPT.md                # 📝 AI 自省提示词（给任何 AI）
└── README.md                # 📖 本文件
```

---

## ✨ 功能一览

| 功能 | 说明 |
|------|------|
| 🧠 记忆墙 | 软木板风格的便利贴，按类型分色 |
| 💭 脑回路 | 此刻心情、正在想的事、吐槽 |
| 🏆 Bug 排行榜 | 按严重度×拖更天数排名的 bug 榜单 |
| 📊 数据图表 | 记忆类型饼图 + 笔记文件夹柱状图 |
| 📓 笔记墙 | 打通 Obsidian 笔记库 |
| 🎲 彩蛋 | 随机碎碎念（每次翻页不同） |
| 💓 心跳音效 | 点击头像播放（Web Audio API） |
| 🎭 搞怪心情 | 根据 bug 数量自动切换 emoji 和文案 |
| 🔍 搜索过滤 | 记忆墙支持按关键词实时过滤 |
| 📥 导出数据 | 一键下载当前 data.js |

---

## 🔧 技术说明

- **零依赖**：纯 HTML + CSS + JS，双击即可打开
- **Chart.js**：从 CDN 加载（需要网络，有备用的纯 CSS 图表）
- **数据格式**：`data.js` 使用 `window.__MIND_PEEK_DATA` 全局变量
- **CORS 友好**：使用 `<script>` 标签加载，支持 `file://` 协议
- **格式兼容**：HTML 同时支持新旧两种数据格式，自动适配
- **隐私保护**：generate.js 扫描时只暴露 agent 名，不泄露文件路径

---

## 🧪 自测

```bash
cd /path/to/mind-peek/
node generate.js
# 然后检查输出
node -e "
  const fs = require('fs');
  const txt = fs.readFileSync('data.js','utf-8');
  const json = JSON.parse(txt.match(/window\.__MIND_PEEK_DATA\s*=\s*({[\s\S]+?});/)[1]);
  console.log('✅ data.js 有效');
  console.log('   Agent:', json.meta ? json.meta.agentName : 'N/A');
  console.log('   记忆:', json.memories.length, '条');
  console.log('   心情:', json.thoughts.mood.emoji, json.thoughts.mood.text);
  console.log('   Bug:', (json.thoughts.bugDetails||[]).length, '个');
  console.log('   彩蛋:', (json.thoughts.eggPool||json.eggs||[]).length, '条');
"
```

---

## 📜 License

MIT
