
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
        
        const dRes = await client.query('SELECT * FROM dynasties');
        console.log('Dynasties:', dRes.rows);

        const nRes = await client.query('SELECT id, title, parent_id, dynasty_id FROM org_nodes LIMIT 10');
        console.log('Org Nodes:', nRes.rows);

        await client.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

main();
