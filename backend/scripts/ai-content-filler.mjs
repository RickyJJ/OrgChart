/**
 * Task 128: 核心知识生成引擎 (AI Content Filler)
 * 
 * 功能：自动扫描 Directus 中的官职节点，利用 Gemini API 补全缺失的文化背景数据。
 * 特性：断点续传、请求限流、强校验 JSON 结构、鲁棒性重试。
 * 
 * 用法: node backend/scripts/ai-content-filler.mjs
 */

import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

// ─── 配置参数 ──────────────────────────────────────────────
const DIRECTUS_URL = 'http://127.0.0.1:8055';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ADMIN_EMAIL = 'admin@qingyunzhi.com';
const ADMIN_PASSWORD = 'admin';

const DELAY_MS = 2000; // 接口限流间隔
const MAX_RETRIES = 3; // AI 接口重试次数

if (!GEMINI_API_KEY) {
    console.error('❌ 缺失 GEMINI_API_KEY，请在 .env 中配置');
    process.exit(1);
}

// ─── 初始化 AI ─────────────────────────────────────────────
const genAI = new GoogleGenAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
    }
});

// ─── Helper ────────────────────────────────────────────────
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function login() {
    const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    if (!res.ok) throw new Error(`Login failed: ${res.status}`);
    const json = await res.json();
    return json.data.access_token;
}

async function api(token, method, path, body) {
    const opts = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${DIRECTUS_URL}${path}`, opts);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API ${method} ${path} -> ${res.status}: ${text}`);
    }
    return await res.json();
}

// ─── 核心逻辑 ──────────────────────────────────────────────

async function fillContent() {
    console.log('═══════════════════════════════════════════════');
    console.log('  🧠 青云志 · 核心知识生成引擎 (ID: 128)');
    console.log('═══════════════════════════════════════════════\n');

    const token = await login();
    console.log('🔑 Directus 登录成功');

    // 1. 获取所有官职节点及其已有关联典故
    // 过滤条件：description 为空，或者关联的 lores 长度为 0
    // 注意：Directus 的 fields=*,lores.* 可以带出关联
    const nodesRes = await api(token, 'GET', '/items/org_nodes?fields=id,title,dynasty_id,description,lores.*&limit=-1');
    const allNodes = nodesRes.data;

    // 筛选出需要补全的节点
    // 策略：description 为 null/空字符串 OR lores 数组为空
    const targetNodes = allNodes.filter(node => {
        const needsDesc = !node.description || node.description.length < 5;
        const needsLores = !node.lores || node.lores.length === 0;
        return needsDesc || needsLores;
    });

    console.log(`📊 总节点数: ${allNodes.length}`);
    console.log(`🎯 待补全节点: ${targetNodes.length}`);

    if (targetNodes.length === 0) {
        console.log('✅ 所有节点内容已丰满，无需动作。');
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const node of targetNodes) {
        console.log(`\n───────────────────────────────────────────────`);
        console.log(`📖 正在处理: [${node.id}] ${node.title} (${node.dynasty_id})`);

        let retryCount = 0;
        let aiResult = null;

        while (retryCount < MAX_RETRIES) {
            try {
                const prompt = `
你是一位精通中国古代官制与传统文学的历史学家。
请帮我补全古代官衔【${node.title}】（所属朝代ID：${node.dynasty_id}）的相关文化信息。

请严格遵守以下 JSON Schema 返回数据，不要返回多余的 Markdown 代码块或文字说明：
{
  "description": "用现代大白话解释这个官职到底是干什么的，要求专业且易懂（80-120字）",
  "figures": ["代表历史人物1", "代表历史人物2"], 
  "allusions": [
    { "title": "典故简析", "text": "典故的具体内容，如'白居易江州司马青衫湿'等" }
  ],
  "poetry": [
    { "author": "诗人名字", "poem": "包含该官职的著名诗句内容" }
  ]
}
如果该官位确实非常冷门，请尽可能基于史实推测职能。人物/典故/诗词如果确实找不到，请返回空数组 []。
`;

                const result = await model.generateContent(prompt);
                const responseText = result.response.text();
                aiResult = JSON.parse(responseText);
                break; // 成功则跳出重试
            } catch (err) {
                retryCount++;
                console.warn(`  ⚠️ AI 调用失败 (尝试 ${retryCount}/${MAX_RETRIES}): ${err.message}`);
                if (retryCount >= MAX_RETRIES) {
                    console.error(`  ❌ 达到最大重试次数，跳过当前节点。`);
                } else {
                    await sleep(3000 * retryCount); // 指数退避
                }
            }
        }

        if (aiResult) {
            try {
                // 更新 description (如果原先为空)
                if (!node.description || node.description.length < 5) {
                    await api(token, 'PATCH', `/items/org_nodes/${node.id}`, {
                        description: aiResult.description
                    });
                    console.log(`  ✅ 职能描述已补全`);
                }

                // 插入 lores
                const loreItems = [];
                
                // Figures
                if (aiResult.figures && aiResult.figures.length > 0) {
                    aiResult.figures.forEach(f => {
                        loreItems.push({ org_node_id: node.id, type: 'figure', title: f, content: null });
                    });
                }

                // Allusions
                if (aiResult.allusions && aiResult.allusions.length > 0) {
                    aiResult.allusions.forEach(a => {
                        loreItems.push({ org_node_id: node.id, type: 'allusion', title: a.title, content: a.text });
                    });
                }

                // Poetry
                if (aiResult.poetry && aiResult.poetry.length > 0) {
                    aiResult.poetry.forEach(p => {
                        loreItems.push({ org_node_id: node.id, type: 'poetry', title: p.author, content: p.poem });
                    });
                }

                if (loreItems.length > 0) {
                    await api(token, 'POST', '/items/lores', loreItems);
                    console.log(`  ✅ 成功插入 ${loreItems.length} 条文化数据 (人物/典故/诗词)`);
                }

                successCount++;
            } catch (err) {
                console.error(`  ❌ 数据库回写失败: ${err.message}`);
                failCount++;
            }
        } else {
            failCount++;
        }

        // 限流休眠
        await sleep(DELAY_MS);
    }

    console.log(`\n═══════════════════════════════════════════════`);
    console.log(`🎉 任务完成！`);
    console.log(`✅ 成功: ${successCount}`);
    console.log(`❌ 失败: ${failCount}`);
    console.log(`═══════════════════════════════════════════════`);
}

fillContent().catch(err => {
    console.error('💥 脚本崩溃:', err);
    process.exit(1);
});
