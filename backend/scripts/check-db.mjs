
import { readFileSync } from 'fs';

const DIRECTUS_URL = 'http://127.0.0.1:8055';
const ADMIN_EMAIL = 'admin@qingyunzhi.com';
const ADMIN_PASSWORD = 'admin';

async function api(path, method = 'GET', body = null, token = '') {
    const opts = {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${DIRECTUS_URL}${path}`, opts);
    if (!res.ok) {
        throw new Error(`API error: ${res.status} on ${method} ${path}`);
    }
    return res.json();
}

async function main() {
    try {
        const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
        });
        const loginData = await loginRes.json();
        const token = loginData.data.access_token;

        const dynasties = await api('/items/dynasties', 'GET', null, token);
        console.log('Dynasties:', JSON.stringify(dynasties.data, null, 2));

        const nodes = await api('/items/org_nodes?limit=5', 'GET', null, token);
        console.log('Org Nodes (first 5):', JSON.stringify(nodes.data, null, 2));
    } catch (err) {
        console.error('Error connecting to Directus:', err.message);
    }
}

main();
