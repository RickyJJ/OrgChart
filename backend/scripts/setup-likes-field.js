/**
 * setup-likes-field.js
 * Auth as admin and configure `likes_count` field + public permissions.
 */
const API_URL = 'http://127.0.0.1:8055';
const ADMIN_EMAIL = 'admin@qingyunzhi.com';
const ADMIN_PASSWORD = 'admin';

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
        console.log('Creating likes_count field...');
        const createFieldRes = await fetch(`${API_URL}/fields/products`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                field: 'likes_count',
                type: 'integer',
                meta: {
                    interface: 'input',
                    display: 'raw'
                },
                schema: {
                    default_value: 0,
                    is_nullable: false
                }
            })
        });

        if (createFieldRes.status === 409) {
            console.log('likes_count field already exists.');
        } else if (!createFieldRes.ok) {
            console.error('Failed to create field:', await createFieldRes.text());
        } else {
            console.log('likes_count field created successfully.');
        }

        // 2. Setup Permissions
        console.log('Configuring public update permissions...');

        // Find existing update permission for public (role: null) on products
        const permRes = await fetch(`${API_URL}/permissions?filter[role][_null]=true&filter[collection][_eq]=products&filter[action][_eq]=update`, { headers });
        const permBody = await permRes.json();
        if (!permRes.ok) throw new Error('Failed to get update perms: ' + JSON.stringify(permBody));
        const permsData = permBody.data;

        if (permsData.length > 0) {
            const p = permsData[0];
            let fields = Array.isArray(p.fields) ? p.fields : [];
            if (!fields.includes('likes_count')) {
                fields.push('likes_count');
                const patchRes = await fetch(`${API_URL}/permissions/${p.id}`, {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify({ fields })
                });
                if (patchRes.ok) {
                    console.log('Updated existing permission.');
                } else {
                    console.error('Failed to update permission:', await patchRes.text());
                }
            } else {
                console.log('Permission already includes likes_count.');
            }
        } else {
            // Create new permission
            const postRes = await fetch(`${API_URL}/permissions`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    role: null, // Public
                    collection: 'products',
                    action: 'update',
                    permissions: {},
                    validation: {},
                    presets: {},
                    fields: ['likes_count']
                })
            });
            if (postRes.ok) {
                console.log('Created new public update permission.');
            } else {
                console.error('Failed to create permission:', await postRes.text());
            }
        }

        // Also check/add "read" permission to ensure likes_count is visible
        const readPermRes = await fetch(`${API_URL}/permissions?filter[role][_null]=true&filter[collection][_eq]=products&filter[action][_eq]=read`, { headers });
        const readPermBody = await readPermRes.json();
        if (!readPermRes.ok) throw new Error('Failed to get read perms: ' + JSON.stringify(readPermBody));
        const readPermsData = readPermBody.data;
        if (readPermsData && readPermsData.length > 0) {
            const p = readPermsData[0];
            let fields = p.fields; // Could be null, array, or '*'

            if (fields === null || fields === '*') {
                console.log('Read permission already allows all fields (*).');
            } else if (Array.isArray(fields)) {
                if (!fields.includes('*') && !fields.includes('likes_count')) {
                    fields.push('likes_count');
                    const patchRes = await fetch(`${API_URL}/permissions/${p.id}`, {
                        method: 'PATCH',
                        headers,
                        body: JSON.stringify({ fields })
                    });
                    if (patchRes.ok) {
                        console.log('Added likes_count to read permission.');
                    } else {
                        console.error('Failed to update read permission:', await patchRes.text());
                    }
                } else {
                    console.log('Read permission already includes likes_count.');
                }
            }
        }

        console.log('Directus Setup Complete.');
    } catch (e) {
        console.error(e);
    }
}

setup();
