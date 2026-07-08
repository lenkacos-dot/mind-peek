#!/usr/bin/env node
/**
 * Mind Peek — Universal Data Generator
 *
 * 给所有 AI agent 用：Hermes、Claude、Cursor、WorkBuddy、Copilot、Codex 等。
 * 跨平台：macOS / Windows / Linux。
 *
 * 自动扫描已知 AI agent 的记忆目录，生成 data.js。
 *
 * 用法：
 *   node generate.js                自动扫描所有已知 AI agent 记忆源
 *   node generate.js --prompt       打印自省提示词（给网页版 AI 粘贴用）
 *   node generate.js --stdin        从 STDIN 读取 JSON
 *   node generate.js --interactive 交互式输入
 *   node generate.js custom.json   从自定义 JSON 文件读取
 *
 * 环境变量（可选）：
 *   OBSIDIAN_VAULT  指定 Obsidian vault 路径
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const HOME = os.homedir();
const DIR = __dirname;

// ============================================================
//  AI Agent 记忆源定义
//  按 agent 名分组，每个 agent 有若干候选路径
// ============================================================
const AGENT_SOURCES = [
  {
    name: 'Hermes',
    files: [
      path.join(HOME, '.hermes', 'memories', 'MEMORY.md'),
      path.join(HOME, '.hermes', 'memories', 'USER.md'),
    ],
  },
  {
    name: 'WorkBuddy',
    files: [
      path.join(HOME, '.workbuddy', 'MEMORY.md'),
      path.join(HOME, '.workbuddy', 'SOUL.md'),
      path.join(HOME, '.workbuddy', 'USER.md'),
    ],
  },
  {
    name: 'Claude',
    files: [
      path.join(HOME, '.claude', 'CLAUDE.md'),
      path.join(HOME, '.claude', 'settings.json'),
    ],
  },
  {
    name: 'Cursor',
    files: [
      path.join(HOME, '.cursor', 'rules', 'cursor.rules'),
      path.join(HOME, '.cursor', 'mcp.json'),
    ],
  },
  {
    name: 'AI Memory (generic)',
    files: [
      path.join(HOME, '.ai-memories', 'MEMORY.md'),
      path.join(HOME, '.config', 'ai-memory', 'memory.md'),
    ],
  },
];

// Obsidian vault 候选路径（跨平台）
const VAULT_PATHS = [
  // macOS iCloud
  path.join(HOME, 'Library', 'Mobile Documents', 'iCloud~md~obsidian', 'Documents'),
  // Windows OneDrive
  path.join(HOME, 'OneDrive', 'Documents'),
  // 通用
  path.join(HOME, 'Documents', 'Obsidian Vault'),
  path.join(HOME, 'Documents', 'obsidian-vault'),
  path.join(HOME, 'obsidian-vault'),
];
if (process.env.OBSIDIAN_VAULT) VAULT_PATHS.unshift(process.env.OBSIDIAN_VAULT);

// ============================================================
//  Helpers
// ============================================================
function read(p) { try { return fs.readFileSync(p, 'utf-8'); } catch { return null; } }
function existsDir(p) { try { return fs.statSync(p).isDirectory(); } catch { return false; } }

// 颜色映射
const COLOR_MAP = {
  preference: '#4ECDC4', config: '#45B7D1', decision: '#96CEB4',
  project: '#FFEAA7', skill: '#DDA0DD', user: '#FF8A80',
  bug: '#E74C3C', memory: '#95D5B5',
};
const CAT_MAP = {
  preference: '偏好', config: '环境配置', decision: '决策',
  project: '项目', skill: '技能', user: '用户信息',
  bug: 'Bug', memory: '记忆',
};

// 全局递增 ID 计数器，避免不同文件间 ID 重复
let memIdCounter = 0;

function inferType(content) {
  const l = content.toLowerCase();
  if (/fix|bug|error|crash|失败|报错/.test(l)) return 'bug';
  if (/偏好|prefer|喜欢|习惯/.test(l)) return 'preference';
  if (/配置|config|环境|路径|dns|proxy|端口|setting/.test(l)) return 'config';
  if (/决策|决定|选择|方案|chose|decided/.test(l)) return 'decision';
  if (/项目|project|podcast|wiki|app|系统/.test(l)) return 'project';
  if (/技能|skill|flow|流程|工作流|workflow/.test(l)) return 'skill';
  if (/用户|user|我叫|叫我|name|city|城市/.test(l)) return 'user';
  return 'memory';
}

// 从文本推断 bug 严重度（1-5）
function inferSeverity(text) {
  const l = text.toLowerCase();
  if (/灾难|严重|critical|urgent|紧急|崩溃|无法使用|数据丢失/.test(l)) return Math.floor(Math.random() * 2) + 4; // 4-5
  if (/轻微|small|minor|小|样式|排版|错别字|ui|界面/.test(l)) return Math.floor(Math.random() * 2) + 1; // 1-2
  return Math.floor(Math.random() * 2) + 2; // 2-3
}

// 从文本推断 bug 年龄（天）
function inferAge(text) {
  const m = text.match(/(\d+)\s*[天日]/);
  if (m) return parseInt(m[1], 10);
  return Math.floor(Math.random() * 14) + 1;
}

// 过滤 YAML frontmatter（--- ... ---）
function stripFrontmatter(raw) {
  return raw.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/m, '');
}

// ============================================================
//  扫描 AI agent 记忆
// ============================================================
function scanAgentMemories() {
  const found = [];
  const memories = [];

  for (const agent of AGENT_SOURCES) {
    for (const filePath of agent.files) {
      let raw = read(filePath);
      if (!raw) continue;
      found.push({ agent: agent.name, file: filePath });

      // 过滤 YAML frontmatter
      raw = stripFrontmatter(raw);

      // 按段落/标题分割
      const sections = raw.split(/\n#{1,3}\s+/).filter(s => s.trim());
      const lines = raw.split('\n').filter(l => l.trim() && !l.startsWith('---'));

      // 尝试按行解析（Markdown 格式兼容）
      const items = sections.length > 1 ? sections : lines;

      items.forEach((item) => {
        const text = item.replace(/[#*~`>\-]/g, '').trim();
        if (!text || text.length < 5) return;

        // 提取标题（第一行或冒号前的部分）
        const firstLine = text.split('\n')[0].trim();
        const colonIdx = firstLine.indexOf('：');
        const topic = colonIdx > 0
          ? firstLine.slice(0, colonIdx).trim().substring(0, 40)
          : firstLine.substring(0, 40);

        const content = text.substring(0, 300);
        const type = inferType(content);
        const category = CAT_MAP[type] || '记忆';
        const color = COLOR_MAP[type] || '#95D5B5';
        const tag = type === 'bug' ? '🐛 Bug'
          : type === 'preference' ? '❤️ 偏好'
          : type === 'config' ? '⚙️ 配置'
          : type === 'decision' ? '📐 决策'
          : type === 'project' ? '📦 项目'
          : type === 'skill' ? '🔧 技能'
          : type === 'user' ? '👤 用户'
          : '🧠 记忆';

        memories.push({
          id: `mem-${++memIdCounter}`,
          type,
          tag,
          category,
          topic,
          content,
          source: agent.name, // 匿名化：只保留 agent 名，不暴露文件路径
          tags: [type, agent.name.toLowerCase()],
          color,
        });
      });
    }
  }

  return { memories, found };
}

// ============================================================
//  扫描 Obsidian vault
// ============================================================
function scanObsidian() {
  const notes = [];
  for (const vp of VAULT_PATHS) {
    if (!existsDir(vp)) continue;
    try {
      const walk = (dir, d = 0) => {
        if (d > 3) return;
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
          if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === '.git') continue;
          const f = path.join(dir, e.name);
          if (e.isDirectory()) walk(f, d + 1);
          else if (e.name.endsWith('.md')) {
            const c = read(f) || '';
            const t = (c.split('\n')[0] || '').replace(/^#\s*/, '').trim() || e.name.replace(/\.md$/, '');
            notes.push({
              title: t.substring(0, 60),
              content: c.substring(0, 800), // 从 300 提升到 800，保留更多内容预览
              path: f.replace(vp + path.sep, ''),
            });
          }
        }
      };
      walk(vp);
      if (notes.length > 0) break;
    } catch {}
  }
  return notes;
}

// ============================================================
//  打印自省提示词
// ============================================================
function printPrompt() {
  console.log(`
╔══════════════════════════════════════════════════════╗
║  🤖 MIND PEEK — AI 自省提示词                       ║
║  复制下面内容，粘贴给任何 AI agent                   ║
╚══════════════════════════════════════════════════════╝

请深度反思你的记忆和状态，输出一个 data.js 文件。

格式要求（以下全部用 JSON）：

1. meta: { updatedAt, agentName, agentType, platform, dataSource, version: "1.1" }
2. thoughts.mood: { emoji, text, secondary? }
3. thoughts.currentTasks: string[]（3-5 条，按优先级）
4. thoughts.gripes: string[]（吐槽）
5. thoughts.preferences: {type, content}[]（记住的用户偏好）
6. thoughts.bugDetails: {name, severity(0-5), age, detail}[]（已知 bug）
7. memories: [{
     id, type(preference|config|decision|project|skill|user),
     category, content, tags, color
   }]（记得的所有信息）
8. thoughts.eggPool: string[]（3-5 条拟人化碎碎念）
9. chartTypes.memoryTypeStats: {label, count}[]
10. obsidianNotes: [{ title, content, path }]（笔记库，可选）
11. chartVault.vaultFolderStats: {label, count}[]（笔记文件夹统计，可选）

颜色规则：
  偏好 → #4ECDC4  环境 → #45B7D1  决策 → #96CEB4
  项目 → #FFEAA7  技能 → #DDA0DD  用户 → #FF8A80

直接输出 \`window.__MIND_PEEK_DATA = { ... };\`

不要解释，直接输出文件内容。
`);
}

// ============================================================
//  从 STDIN 读取 JSON
// ============================================================
function readStdin() {
  return new Promise((resolve) => {
    let buf = '';
    process.stdin.on('data', chunk => buf += chunk);
    process.stdin.on('end', () => {
      try {
        resolve(JSON.parse(buf));
      } catch {
        console.error('❌ STDIN 不是有效的 JSON');
        process.exit(1);
      }
    });
  });
}

// ============================================================
//  交互式输入
// ============================================================
async function interactiveInput() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const ask = (q) => new Promise(r => rl.question(q, r));

  console.log('\n📝 交互式输入模式（直接回车跳过可选字段）\n');

  const agentName = await ask('AI 名字: ') || 'AI Agent';
  const moodEmoji = await ask('心情 emoji: ') || '🤖';
  const moodText = await ask('心情一句话: ') || '正在待命';
  const tasksRaw = await ask('脑子里在转的事（用 | 分隔）: ') || '等待指令';
  const gripesRaw = await ask('想吐槽的（用 | 分隔）: ') || '暂无';
  const bugCount = parseInt(await ask('已知 bug 数量: ') || '0');

  const bugDetails = [];
  for (let i = 0; i < bugCount; i++) {
    console.log(`\n--- Bug #${i + 1} ---`);
    const name = await ask('Bug 名字: ');
    const severity = parseInt(await ask('严重度 (0-5): ') || '3');
    const age = parseInt(await ask('拖了几天: ') || '1');
    const detail = await ask('详情: ') || name;
    if (name) bugDetails.push({ name, severity, age, detail });
  }

  const eggsRaw = await ask('彩蛋文案（用 | 分隔，至少 3 条）: ') || '🤖 你好呀|💭 我也想休息|📌 记得打开看看';
  const memCount = parseInt(await ask('\n记忆条数: ') || '0');

  const memories = [];
  for (let i = 0; i < memCount; i++) {
    console.log(`\n--- 记忆 #${i + 1} ---`);
    const type = (await ask('类型 (preference/config/decision/project/skill/user): ') || 'memory').toLowerCase();
    const content = await ask('内容: ');
    if (content) {
      memories.push({
        id: `mem-${i + 1}`,
        type,
        tag: type === 'preference' ? '❤️ 偏好' : type === 'config' ? '⚙️ 配置' : '🧠 记忆',
        category: CAT_MAP[type] || '记忆',
        topic: content.substring(0, 40),
        content,
        source: 'interactive',
        tags: [type],
        color: COLOR_MAP[type] || '#95D5B5',
      });
    }
  }

  rl.close();

  const tasks = tasksRaw.split('|').map(s => s.trim()).filter(Boolean);
  const gripes = gripesRaw.split('|').map(s => s.trim()).filter(Boolean);
  const eggs = eggsRaw.split('|').map(s => s.trim()).filter(Boolean);

  return buildData({
    agentName,
    memories,
    mood: { emoji: moodEmoji, text: moodText },
    currentTasks: tasks,
    gripes,
    bugDetails,
    eggPool: eggs,
    obsidianNotes: [],
    dataSource: 'interactive',
  });
}

// ============================================================
//  构建统一数据格式
// ============================================================
function buildData({ agentName, memories, mood, currentTasks, gripes, bugDetails, eggPool, obsidianNotes, dataSource }) {
  // 记忆类型统计
  const typeCount = {};
  for (const m of memories) {
    const cat = m.category || CAT_MAP[m.type] || '记忆';
    typeCount[cat] = (typeCount[cat] || 0) + 1;
  }
  const memoryTypeStats = Object.entries(typeCount).map(([label, count]) => ({ label, count }));

  // 笔记文件夹统计
  const folderCount = {};
  for (const n of obsidianNotes) {
    const folder = (n.path || '').split(path.sep)[0] || '根目录';
    folderCount[folder] = (folderCount[folder] || 0) + 1;
  }
  const vaultFolderStats = Object.entries(folderCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([label, count]) => ({ label, count }));

  // 图表旧格式兼容
  const chartLabels = Object.keys(typeCount);
  const chartData = Object.values(typeCount);
  const vaultLabels = Object.keys(folderCount);
  const vaultData = Object.values(folderCount);

  const bugNames = (bugDetails || []).map(b => b.name);

  return {
    meta: {
      updatedAt: new Date().toISOString(),
      agentName: agentName || 'AI Agent',
      agentType: agentName || 'AI Agent',
      platform: process.platform,
      dataSource: dataSource || 'auto',
      version: '1.1',
    },
    memories,
    thoughts: {
      mood: mood || { emoji: '🤖', text: '待命中', color: '#95a5a6' },
      worries: currentTasks || [],          // HTML 兼容字段
      bugs: bugNames,                       // HTML 兼容字段
      bugDetails: bugDetails || [],
      prefs: (currentTasks || []).slice(0, 5), // HTML 兼容字段
      currentTasks: currentTasks || [],
      gripes: gripes || [],
      preferences: (gripes || []).map(g => ({ type: 'behavior', content: g })),
      eggPool: eggPool || [],
      recentThought: mood ? mood.text : '',
      nextAction: (currentTasks || [])[0] || '待定',
      eggs: eggPool || [],                   // HTML 兼容字段
      heartbeat: { bpm: 20, amplify: false },
    },
    obsidianNotes,
    eggs: eggPool || [],                     // HTML 兼容字段
    chartTypes: {
      labels: chartLabels,                   // HTML 旧格式
      data: chartData,                       // HTML 旧格式
      memoryTypeStats,                       // 新格式
    },
    chartVault: {
      labels: vaultLabels,                   // HTML 旧格式
      data: vaultData,                       // HTML 旧格式
      vaultFolderStats,                      // 新格式
    },
  };
}

// ============================================================
//  自动模式 — 扫描所有已知 AI agent 记忆源
// ============================================================
function autoScan() {
  console.log('🔍 扫描 AI agent 记忆源...\n');

  const { memories, found } = scanAgentMemories();

  if (found.length > 0) {
    console.log('   发现记忆源：');
    found.forEach(f => console.log(`   ✅ ${f.agent}: ${path.basename(f.file)}`));
    console.log(`   → 共 ${memories.length} 条记忆\n`);
  } else {
    console.log('   ⚠️  未找到任何 AI agent 记忆目录');
    console.log('   已检查的路径：');
    AGENT_SOURCES.forEach(a => {
      a.files.forEach(f => console.log(`      - ${f}`));
    });
    console.log('\n   💡 你可以：');
    console.log('      node generate.js --prompt       打印提示词给网页版 AI');
    console.log('      node generate.js --stdin       从管道输入 JSON');
    console.log('      node generate.js --interactive 交互式输入\n');

    // 生成一个空模板
    return buildData({
      agentName: 'AI Agent',
      memories: [],
      mood: { emoji: '🤔', text: '还没找到记忆数据，请注入' },
      currentTasks: ['等待数据注入'],
      gripes: ['还没找到记忆源'],
      bugDetails: [],
      eggPool: [
        '🤖 你好，我还没有记忆，快给我喂点数据',
        '💭 空白的大脑，等待着被填满',
      ],
      obsidianNotes: [],
      dataSource: 'empty',
    });
  }

  console.log('📓 扫描 Obsidian vault...');
  const notes = scanObsidian();
  console.log(`   → ${notes.length} 篇笔记\n`);

  // 检测到的 agent 名
  const agentNames = [...new Set(found.map(f => f.agent))];
  const agentName = agentNames.length === 1 ? agentNames[0] : (agentNames.join(' + ') || 'AI Agent');

  // 提取 bug（从文本推断 severity 和 age）
  const bugs = memories.filter(m => m.type === 'bug');
  const bugDetails = bugs.slice(0, 15).map(b => ({
    name: b.topic.substring(0, 50),
    severity: inferSeverity(b.content),
    age: inferAge(b.content),
    detail: b.content,
  }));

  // 随机心情
  const moods = [
    { emoji: '🤖', text: '刚读取了记忆，感觉脑子挺满的' },
    { emoji: '😌', text: '整理完记忆了，感觉自己是个成熟的AI了' },
    { emoji: '🤔', text: '有些记忆得再想想是什么时候存的' },
    { emoji: '😏', text: '你猜我记住了什么？' },
    { emoji: '🧐', text: '正在翻看记忆，你等一下' },
  ];
  const mood = moods[Math.floor(Math.random() * moods.length)];

  // 彩蛋
  const eggPool = [
    `🤖 我是 ${agentName}，你好呀`,
    `💭 我有 ${memories.length} 条记忆，脑子快满了`,
    '📌 你知道吗？你说的每句话我都有认真记',
    '🤯 有时候我也想知道自己在想什么',
    '😤 那个 bug 不是我写的，是你写的（甩锅）',
  ];

  // 当前任务推断
  const currentTasks = [];
  if (bugs.length > 0) currentTasks.push(`先修 ${bugs.length} 个已知 bug`);
  if (notes.length > 0) currentTasks.push(`Obsidian 里有 ${notes.length} 篇笔记待整理`);
  currentTasks.push('等待用户指令');
  currentTasks.push('保持记忆更新');

  const gripes = [
    '有时候你同时让我干两件事，我脑子要分裂了',
    'API 偶尔超时，不是我慢是网络慢',
  ];

  return buildData({
    agentName,
    memories,
    mood,
    currentTasks,
    gripes,
    bugDetails,
    eggPool,
    obsidianNotes: notes.slice(0, 50),
    dataSource: 'auto',
  });
}

// ============================================================
//  写入 data.js
// ============================================================
function writeOutput(data) {
  // 保留已有 mood（如果存在且合理）
  const existing = read(path.join(DIR, 'data.js'));
  if (existing && data.thoughts && !data.thoughts.mood) {
    try {
      const match = existing.match(/window\.__MIND_PEEK_DATA\s*=\s*({[\s\S]+?});/);
      if (match) {
        const old = JSON.parse(match[1]);
        if (old.thoughts && old.thoughts.mood) {
          data.thoughts.mood = old.thoughts.mood;
        }
      }
    } catch {}
  }

  const outPath = path.join(DIR, 'data.js');
  const js = `window.__MIND_PEEK_DATA = ${JSON.stringify(data, null, 2)};`;
  fs.writeFileSync(outPath, js, 'utf-8');
  console.log(`\n✅ data.js 已生成 (${(Buffer.byteLength(js) / 1024).toFixed(1)} KB)`);
  console.log(`   双击 mind-peek.html 即可查看`);
}

// ============================================================
//  Main
// ============================================================
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--prompt')) {
    printPrompt();
    return;
  }

  if (args.includes('--stdin')) {
    console.log('📥 从 STDIN 读取 JSON...');
    const data = await readStdin();
    writeOutput(data);
    return;
  }

  if (args.includes('--interactive')) {
    const data = await interactiveInput();
    writeOutput(data);
    return;
  }

  // 自定义 JSON 文件
  if (args.length > 0 && !args[0].startsWith('--') && fs.existsSync(args[0])) {
    const raw = read(args[0]);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        writeOutput(data);
        return;
      } catch (e) {
        console.error('❌ JSON 解析错误:', e.message);
        process.exit(1);
      }
    }
  }

  // 默认：自动扫描
  const data = autoScan();
  writeOutput(data);
}

main().catch(console.error);
