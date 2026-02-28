// generate-images.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { dynastyData } from './src/data.js';

// Setup environment and paths
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_DIR = path.join(__dirname, 'public', 'assets', 'content');

// Verify API Key
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.error("❌ 错误：未在 .env 文件中发现 OPENAI_API_KEY 环境变量！");
    process.exit(1);
}

const openai = new OpenAI({ apiKey });

/**
 * Prompt Template for the "Path to Court" Neo-Chinese Minimalist style
 */
const getPrompt = (subjectText) => `
A minimalist Chinese ink-wash painting style illustration of: ${subjectText}. 
Style constraints: Neo-Chinese aesthetic, vast blank negative space (留白), soft monochromatic ink gradients with a single striking vermilion red (朱红) accent.
The composition should feel like an elegant, ancient East Asian scroll fragment. No text, no modern elements. Isolated on a warm paper textured off-white background.
`;

/**
 * Helper: Download base64 image and save to disk
 */
const saveBase64Image = (base64Data, filename) => {
    const filePath = path.join(CONTENT_DIR, filename);
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ 图片已保存: ${filePath}`);
    return `/assets/content/${filename}`;
};

/**
 * Traverse the data tree and identify missing images for "allusions"
 */
async function processNodes() {
    console.log("🔍 开始扫描缺少典故/人物配图的条目...");

    // Create content dir if not exists
    if (!fs.existsSync(CONTENT_DIR)) {
        fs.mkdirSync(CONTENT_DIR, { recursive: true });
    }

    // Traverse logic (Simplified array flattening for the tree)
    const nodesToProcess = [];

    const traverse = (node) => {
        // Find allusions without images
        if (node.allusions && node.allusions.length > 0) {
            node.allusions.forEach((allusion, index) => {
                if (!allusion.loreImage) {
                    nodesToProcess.push({
                        nodeTitle: node.title,
                        allusionTitle: allusion.title,
                        subjectText: `Ancient Chinese official '${node.title}' in the context of the historical allusion '${allusion.title}'.`,
                        filename: `${node.id}_allusion_${index}.png`
                    });
                }
            });
        }
        if (node.children) {
            node.children.forEach(traverse);
        }
    };

    dynastyData.forEach(dynasty => traverse(dynasty.structure));

    console.log(`📊 共发现 ${nodesToProcess.length} 个条目需要生成配图。`);

    if (nodesToProcess.length === 0) {
        console.log("✨ 扫描完成，无需生成新图片。");
        return;
    }

    // Process queue sequentially to respect rate limits
    for (const item of nodesToProcess) {
        console.log(`\n🎨 正在为 [${item.nodeTitle} - ${item.allusionTitle}] 生成图像...`);
        try {
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: getPrompt(item.subjectText),
                n: 1,
                size: "1024x1024",
                response_format: "b64_json"
            });

            const base64Image = response.data[0].b64_json;
            saveBase64Image(base64Image, item.filename);

            console.log(`⚠️ 请记得前往 src/data.js 为该典故手动补充字段: \nloreImage: "/assets/content/${item.filename}"`);

            // Wait 2 seconds to avoid aggressive rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`❌ 生成失败 [${item.allusionTitle}]:`, error.message);
        }
    }

    console.log("\n🎉 所有生成任务已结束！");
}

processNodes();
