# 🧠 Mind Peek — 让任何 AI agent 自省并生成 data.js

## 使用方法

把下面这段提示词复制粘贴给任何 AI agent（ChatGPT、Claude、Gemini、Kimi、DeepSeek 等），它就会反思自己的记忆和状态，输出一份 `data.js` 文件。

或者直接运行 `node generate.js --prompt` 打印这段提示词。

---

## 复制以下内容给 AI agent

```
请做一次深度自我反思，然后输出一个完整的 data.js 文件。

### 你需要做的事

回想你和我（用户）之间的所有对话，反思你的"记忆"和"当前状态"，
然后按下面要求生成 data.js 文件的内容。

### 具体包括

1. **元信息** — 你是谁（agentName），现在几点（updatedAt），什么平台。加 version: "1.1"
2. **此刻心情** — 用拟人化的 emoji + 大白话描述你现在什么感觉
3. **脑子在转的事** — 你现在想着要做什么？列 3-5 条，按优先级排序
4. **想吐槽的事** — 有什么让你不爽的？API 慢？用户总改需求？
5. **你记得的用户偏好** — 每条用 {type, content} 格式（type 为 behavior/tool/code/style）
6. **已知 bug 排行榜** — 你知道有哪些问题/bug 还没修？每条 {name, severity(0-5), age(拖了几天), detail}
7. **记忆墙** — 你记得关于这个用户的每一条重要信息，每条：
   - id: 唯一标识
   - type: preference / config / decision / project / skill / user / bug / memory 之一
   - category: 分类名
   - content: 内容
   - color: 十六进制颜色（按 type 选：偏好 #4ECDC4，环境 #45B7D1，决策 #96CEB4，项目 #FFEAA7，技能 #DDA0DD，用户 #FF8A80，Bug #E74C3C）
8. **彩蛋文案 5 条** — 拟人化的碎碎念，要求有 2 条是吐槽你自己的
9. **心情头像参数** — 选一个最能代表你此刻心情的大 emoji，以及配的文字
10. **记忆类型统计** — 统计上面记忆墙每种 type 的数量
11. **Obsidian 笔记**（可选）— 如果你有笔记数据，列出 [{ title, content, path }]
12. **笔记文件夹统计**（可选）— 按文件夹统计笔记数量 {label, count}[]

### 输出格式

输出一个纯文本块，以 `window.__MIND_PEEK_DATA = {` 开头，以 `};` 结尾。
不要解释，直接输出 data.js 文件内容。
我打开 mind-peek.html 就能看到我在你脑子里的样子。
```

---

## 如果你是 Claude Code / Cursor / Codex / WorkBuddy 等 AI 编程助手

你可以直接运行以下命令或直接写文件：

```bash
# 方式 1：自动扫描已有记忆
node generate.js

# 方式 2：从管道输入 JSON
echo '{"memories":[...],"thoughts":{...}}' | node generate.js --stdin

# 方式 3：交互式输入
node generate.js --interactive

# 方式 4：直接写 data.js（我已经知道格式了）
# 把 template-data.js 读给我看，说"按这个格式自省"
```

---

## 格式速查

| 字段 | 必填 | 说明 |
|------|------|------|
| `meta.updatedAt` | ✅ | ISO 时间 |
| `meta.agentName` | ✅ | 你的名字 |
| `meta.version` | ✅ | 数据格式版本，当前 "1.1" |
| `thoughts.mood` | ✅ | 心情 emoji + 大白话 |
| `thoughts.currentTasks` | ✅ | 3-5 条 |
| `thoughts.bugDetails` | ❌ | 没 bug 空数组 [] |
| `thoughts.eggPool` | ✅ | 至少 3 条 |
| `memories` | ✅ | 至少 5 条 |
| `chartTypes.memoryTypeStats` | ✅ | 按 type 统计 |
| `obsidianNotes` | ❌ | 笔记库，可选 |
| `chartVault.vaultFolderStats` | ❌ | 文件夹统计，可选 |

---

## 实战示例

ChatGPT / Claude / Gemini 输出大概长这样：

```
window.__MIND_PEEK_DATA = {
  meta: {
    updatedAt: "2025-07-08T...",
    agentName: "ChatGPT",
    version: "1.1",
    ...
  },
  thoughts: {
    mood: { emoji: "😅", text: "你上次问的那个问题我还没想好怎么回……" },
    ...
  },
  ...
};
```

你复制这段，保存为 `data.js`，和 `mind-peek.html` 放一起，双击打开就能看了！
