/**
 * setup-salary-field.js
 * Auth as admin and configure `salary` field for `org_nodes` collection + public permissions.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_URL = 'http://127.0.0.1:8055';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@qingyunzhi.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

async function setup() {
    try {
        console.log('Authenticating...');
        const authRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });
        if (!authRes.ok) throw new Error('Login failed: ' + (await authRes.text()));
        const authData = await authRes.json();
        const token = authData.data.access_token;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // 1. Create Field
        console.log('Creating salary field for org_nodes...');
        const createFieldRes = await fetch(`${API_URL}/fields/org_nodes`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                field: 'salary',
                type: 'json',
                meta: {
                    interface: 'input-code',
                    options: {
                        language: 'json'
                    },
                    display: 'raw'
                },
                schema: {
                    default_value: null,
                    is_nullable: true
                }
            })
        });

        if (createFieldRes.status === 409) {
            console.log('salary field already exists.');
        } else if (!createFieldRes.ok) {
            console.error('Failed to create field:', await createFieldRes.text());
        } else {
            console.log('salary field created successfully.');
        }

        // 2. Setup Permissions
        console.log('Configuring public read permissions for salary...');

        // Find existing read permission for public (role: null) on org_nodes
        const readPermRes = await fetch(`${API_URL}/permissions?filter[role][_null]=true&filter[collection][_eq]=org_nodes&filter[action][_eq]=read`, { headers });
        const readPermBody = await readPermRes.json();
        if (!readPermRes.ok) throw new Error('Failed to get read perms: ' + JSON.stringify(readPermBody));
        const readPermsData = readPermBody.data;

        if (readPermsData && readPermsData.length > 0) {
            const p = readPermsData[0];
            let fields = p.fields; // Could be null, array, or '*'

            if (fields === null || fields === '*') {
                console.log('Read permission already allows all fields (*).');
            } else if (Array.isArray(fields)) {
                if (!fields.includes('salary')) {
                    fields.push('salary');
                    const patchRes = await fetch(`${API_URL}/permissions/${p.id}`, {
                        method: 'PATCH',
                        headers,
                        body: JSON.stringify({ fields })
                    });
                    if (patchRes.ok) {
                        console.log('Added salary to read permission.');
                    } else {
                        console.error('Failed to update read permission:', await patchRes.text());
                    }
                } else {
                    console.log('Read permission already includes salary.');
                }
            }
        } else {
            // Create new permission if it didn't exist for some reason
            const postRes = await fetch(`${API_URL}/permissions`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    role: null, // Public
                    collection: 'org_nodes',
                    action: 'read',
                    permissions: {},
                    validation: {},
                    presets: {},
                    fields: ['*']
                })
            });
            if (postRes.ok) {
                console.log('Created new public read permission.');
            } else {
                console.error('Failed to create permission:', await postRes.text());
            }
        }

        console.log('Directus Salary Field Setup Complete.');
    } catch (e) {
        console.error(e);
    }
}

setup();
