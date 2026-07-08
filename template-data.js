/* ============================================
   Mind Peek — data.js 模板
   给所有 AI agent 用的数据格式模板
   ============================================
   使用方式：
   1. 把这个文件内容发给 AI agent（或用 generate.js --prompt）
   2. 告诉它："请按这个格式，写出你对当前用户了解的记忆和你的想法"
   3. AI 会输出一份填好真实内容的 data.js
   4. 保存到和 mind-peek.html 同目录
*/

window.__MIND_PEEK_DATA = {
  /* ===== 元信息 ===== */
  meta: {
    updatedAt: "2025-07-08T10:00:00+08:00",   // 最后更新时间
    agentName: "AI Agent",                     // 你的名字（Hermes / Claude / Cursor / ChatGPT 等）
    agentType: "AI Agent",                     // 类型/版本
    platform: "auto",                          // 操作系统（macOS / win32 / linux）
    dataSource: "manual",                      // auto=自动读取, manual=手动自省
    version: "1.1"                             // 数据格式版本号
  },

  /* ===== AI 此刻脑回路 ===== */
  thoughts: {
    // --- 心情 ---
    mood: {
      emoji: "🤖",           // 心情表情
      text: "刚启动，脑子还在热身",  // 心情大白话
      secondary: "你今天想聊点什么？"  // 第二句（可选）
    },

    // --- 脑子里在转的事（优先级排序）---
    currentTasks: [
      "正在整理记忆",
      "等待用户的指令",
      "想优化一下回复速度"
    ],

    // --- 想吐槽的事 ---
    gripes: [
      "有时候你同时让我干两件事，我脑子要分裂了",
      "API 偶尔超时，不是我慢是网络慢"
    ],

    // --- 用户偏好（AI 记住的）---
    preferences: [
      { type: "behavior", content: "直接操作型，别废话" },
      { type: "style", content: "简洁明了，先给方案再解释" },
      { type: "tool", content: "终端优先于 GUI" }
    ],

    // --- 已知 bug 排行榜 ---
    bugDetails: [
      {
        name: "示例 bug",
        severity: 2,        // 0-5
        age: 1,             // 拖了几天
        detail: "这是一个示例 bug，替换成你知道的真实问题"
      }
    ],

    // --- 彩蛋文案池 ---
    eggPool: [
      "🤖 你好呀，我是你的 AI 助手",
      "💭 说真的，我也想休息一下",
      "🤯 你有好多记忆，我脑子快满了",
      "📌 你知道吗？你说的每句话我都有认真记",
      "😤 那个 bug 不是我写的，是你写的（甩锅）"
    ],

    // --- 心跳音效参数 ---
    heartbeat: {
      bpm: 20,              // 默认心跳速度
      amplify: false        // 是否放大
    }
  },

  /* ===== 记忆墙（软木板每条便利贴） ===== */
  memories: [
    {
      id: "mem-001",
      type: "preference",       // preference / config / decision / project / skill / user / bug / memory
      category: "偏好",         // 中文分类名
      tag: "❤️ 偏好",           // 显示标签（可选，不填用 category）
      topic: "用户偏好",         // 标题（可选，不填用 content 前30字）
      content: "用户偏好直接操作型，代码必须实测后交付",
      source: "对话记忆",        // 来源（可选）
      tags: ["preference", "workflow"],
      color: "#4ECDC4"          // 便利贴颜色
    },
    {
      id: "mem-002",
      type: "config",
      category: "环境配置",
      tag: "⚙️ 配置",
      topic: "开发环境",
      content: "用户使用 macOS，终端是 zsh，编辑器是 VS Code",
      source: "对话记忆",
      tags: ["config", "environment"],
      color: "#45B7D1"
    }
    // ... 更多记忆
  ],

  /* ===== Obsidian 笔记（可选）===== */
  obsidianNotes: [
    {
      title: "示例笔记",
      content: "这是笔记内容预览...",
      path: "文件夹/笔记名.md"
    }
  ],

  /* ===== 数据统计 ===== */
  chartTypes: {
    memoryTypeStats: [
      { label: "偏好", count: 3 },
      { label: "环境配置", count: 2 },
      { label: "决策", count: 1 },
      { label: "项目", count: 1 }
    ]
  },

  /* ===== Vault 文件夹统计（可选）===== */
  chartVault: {
    vaultFolderStats: [
      { label: "日记", count: 5 },
      { label: "项目", count: 3 }
    ]
  },

  /* ===== 顶层彩蛋兼容（可选）===== */
  eggs: [
    "🤖 你好呀，我是你的 AI 助手",
    "💭 说真的，我也想休息一下"
  ]
};
