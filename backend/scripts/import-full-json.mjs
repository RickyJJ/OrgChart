
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Client } = pg;

const FULL_DATA_PATH = path.join(__dirname, '../temp/full-data.json');
const DYNASTY_ID = 'tang';
const ROOT_NODE_ID = 'tang_emperor';

async function main() {
    const data = JSON.parse(readFileSync(FULL_DATA_PATH, 'utf-8'));

    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('✅ Connected to database');

        // 1. Cleanup existing tang nodes (except root)
        console.log('🧹 Cleaning up existing Tang nodes (except root)...');
        // Delete lores first to avoid FK issues if not cascade
        await client.query(`
            DELETE FROM lores 
            WHERE org_node_id IN (SELECT id FROM org_nodes WHERE dynasty_id = $1 AND id != $2)
        `, [DYNASTY_ID, ROOT_NODE_ID]);
        
        // Delete nodes (might need multiple passes if SET NULL is used instead of CASCADE)
        // Actually, deleting all at once works if they all match the criteria
        await client.query(`
            DELETE FROM org_nodes 
            WHERE dynasty_id = $1 AND id != $2
        `, [DYNASTY_ID, ROOT_NODE_ID]);

        console.log('✅ Cleanup complete');

        // 2. Flatten and Insert
        const orgNodes = [];
        const lores = [];

        function flatten(nodes, parentId, pathPrefix) {
            nodes.forEach((node, index) => {
                const currentPath = pathPrefix ? `${pathPrefix}.${node.id.replace(/-/g, '_')}` : node.id.replace(/-/g, '_');
                
                orgNodes.push({
                    id: node.id,
                    dynasty_id: DYNASTY_ID,
                    title: node.title,
                    english_title: node.english_title || null,
                    level: node.level || null,
                    description: node.description || null,
                    type: node.type || null,
                    path: currentPath,
                    parent_id: parentId,
                    bg_image: node.bg_image || null,
                    panel_image: node.panel_image || null,
                    hide_text: node.hide_text || false,
                    hide_border: node.hide_border || false,
                    sort_order: index,
                    salary: node.salary || null
                });

                if (node.figures) {
                    node.figures.forEach(f => lores.push({ org_node_id: node.id, type: 'figure', title: f, content: null }));
                }
                if (node.allusions) {
                    node.allusions.forEach(a => lores.push({ org_node_id: node.id, type: 'allusion', title: a.title, content: a.text }));
                }
                if (node.poetry) {
                    node.poetry.forEach(p => lores.push({ org_node_id: node.id, type: 'poetry', title: p.author, content: p.poem }));
                }

                if (node.children && node.children.length > 0) {
                    flatten(node.children, node.id, currentPath);
                }
            });
        }

        // Start flattening from the emperor
        // We assume tang_emperor already exists in DB with path 'tang_emperor'
        flatten(data, ROOT_NODE_ID, ROOT_NODE_ID);

        console.log(`📥 Inserting ${orgNodes.length} nodes...`);
        for (const node of orgNodes) {
            await client.query(`
                INSERT INTO org_nodes (id, dynasty_id, title, english_title, level, description, type, path, parent_id, bg_image, panel_image, hide_text, hide_border, sort_order, salary)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            `, [node.id, node.dynasty_id, node.title, node.english_title, node.level, node.description, node.type, node.path, node.parent_id, node.bg_image, node.panel_image, node.hide_text, node.hide_border, node.sort_order, node.salary]);
        }

        console.log(`📥 Inserting ${lores.length} lores...`);
        for (const lore of lores) {
            await client.query(`
                INSERT INTO lores (org_node_id, type, title, content)
                VALUES ($1, $2, $3, $4)
            `, [lore.org_node_id, lore.type, lore.title, lore.content]);
        }

        console.log('🎉 Import successful!');
        await client.end();
    } catch (err) {
        console.error('❌ Import failed:', err);
        process.exit(1);
    }
}

main();
