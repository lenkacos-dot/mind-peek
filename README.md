<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License">
  <img src="https://img.shields.io/badge/version-v1.2-green" alt="Version v1.2">
  <img src="https://img.shields.io/badge/dependencies-0-orange" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey" alt="Platform">
  <img src="https://img.shields.io/badge/Hermes-Compatible-red" alt="Hermes Compatible">
  <img src="https://img.shields.io/github/stars/lenkacos-dot/mind-peek?style=social" alt="GitHub Stars">
</p>

<br/>

<h1 align="center">🧠 Mind Peek — AI 脑子里的世界</h1>
<h3 align="center">Peek into your AI agent's mind</h3>
<h4 align="center">点一下看看 AI agent 此刻在想什么——记忆、心情、bug、碎碎念，全是大白话。</h4>

<br/>

---

> **给所有 AI agent 用**：Hermes、Claude、Cursor、ChatGPT、Gemini、Kimi、DeepSeek、Copilot、WorkBuddy……

---

## 🏗️ 架构 / Architecture

```
                    ┌─────────────────────────────────────┐
                    │        Mind Peek Pipeline            │
                    └─────────────────────────────────────┘

  Your AI Agent's Memories
       │
       ▼
  ┌───────────────────────────────────────────────┐
  │           generate.js 数据生成器               │
  │                                               │
  │  自动扫描: ~/.hermes/memories/                 │
  │            ~/.workbuddy/MEMORY.md             │
  │            ~/.claude/CLAUDE.md                │
  │            ~/.cursor/rules/                   │
  │            Obsidian vault                     │
  │                                               │
  │  输出: data.js (window.__MIND_PEEK_DATA)       │
  └───────────────────┬───────────────────────────┘
                      │
                      ▼
  ┌───────────────────────────────────────────────┐
  │           mind-peek.html 可视化引擎             │
  │                                               │
  │   🧠 记忆墙 · 💭 脑回路 · 🏆 Bug排行版         │
  │   📊 图表 · 📓 笔记墙 · 🎲 彩蛋 · 💓 心跳     │
  │                                               │
  │  纯 HTML + CSS + JS · 零依赖 · 双击即开        │
  └───────────────────────────────────────────────┘
                      │
                      ▼
  ┌───────────────────────────────────────────────┐
  │         你看到的：大白话的 AI 内心世界           │
  │         "我在想这个 bug 怎么修..."              │
  │         "今天已经写了 3000 行代码"             │
  └───────────────────────────────────────────────┘
```

---

## 🚀 快速开始 / Quick Start

### 📥 下载

从 [GitHub Releases](https://github.com/lenkacos-dot/mind-peek/releases) 下载压缩包，解压到任意文件夹。

### 👤 作为用户直接看

1. 解压后 **双击 `mind-peek.html`** → 如果已经有 `data.js`，直接就能看
2. 没有数据？看下面让你的 AI agent 生成

---

## ✨ 功能一览 / Features

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

## 📁 文件结构 / File Structure

```
mind-peek/
├── mind-peek.html           # 🏠 主页面 — 双击打开
├── data.js                  # 📊 数据文件 — AI agent 生成
├── generate.js              # 🌐 通用数据生成器（全平台 + 全 AI agent）
├── template-data.js         # 📋 数据模板（带注释）
├── PROMPT.md                # 📝 AI 自省提示词（给任何 AI）
└── README.md                # 📖 本文档
```

---

## 🤖 AI 对接方式 / AI Integration

### 方案 A：自动扫描（推荐）

如果你的电脑上有 AI agent 的记忆目录，直接运行：

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

**跨平台**：macOS、Windows、Linux 路径自动适配。

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

## 🔧 技术说明 / Tech Stack

| 技术 | 说明 |
|------|------|
| 纯 HTML + CSS + JS | 零依赖，双击即开 |
| Chart.js (CDN) | 数据图表，有 CSS fallback 兜底 |
| Web Audio API | 心跳音效，纯前端合成 |
| `window.__MIND_PEEK_DATA` | 数据接口，支持 `file://` 协议 |
| 格式兼容 | 同时支持 v1.0 / v1.1 / v1.2 数据格式 |

---

## 🧪 自测 / Self-Test

```bash
cd /path/to/mind-peek/
node generate.js
# 然后检查输出
node -e "
  const fs = require('fs');
  const txt = fs.readFileSync('data.js','utf-8');
  const json = JSON.parse(txt.match(/window\\.__MIND_PEEK_DATA\\s*=\\s*({[\\s\\S]+?});/)[1]);
  console.log('✅ data.js 有效');
  console.log('   Agent:', json.meta ? json.meta.agentName : 'N/A');
  console.log('   记忆:', json.memories.length, '条');
  console.log('   心情:', json.thoughts.mood.emoji, json.thoughts.mood.text);
  console.log('   Bug:', (json.thoughts.bugDetails||[]).length, '个');
  console.log('   彩蛋:', (json.thoughts.eggPool||json.eggs||[]).length, '条');
"
```

---

## 🔗 Related / 相关

| Resource | Link |
|----------|------|
| **GitHub Repo** | [https://github.com/lenkacos-dot/mind-peek](https://github.com/lenkacos-dot/mind-peek) |
| **分享版 (Share Edition)** | [https://github.com/lenkacos-dot/mind-peek-share](https://github.com/lenkacos-dot/mind-peek-share) |
| **自省提示词 PROMPT.md** | [./PROMPT.md](./PROMPT.md) |
| **Obsidian 作品库** | `~/Documents/自媒体工作台/03-作品库/Mind Peek.md` |

---

## 📄 License

```
MIT License

Copyright (c) 2025 lenkacos-dot

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

> **v1.2 个人版** | MIT — Do what you want. Credit if you find it useful.