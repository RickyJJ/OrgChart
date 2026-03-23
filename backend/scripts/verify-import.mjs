
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Client } = pg;

async function main() {
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
        
        const res = await client.query('SELECT COUNT(*) FROM org_nodes WHERE dynasty_id = $1', ['tang']);
        console.log('Tang nodes count:', res.rows[0].count);

        const lcount = await client.query('SELECT COUNT(*) FROM lores l JOIN org_nodes n ON l.org_node_id = n.id WHERE n.dynasty_id = $1', ['tang']);
        console.log('Tang lores count:', lcount.rows[0].count);

        await client.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

main();
