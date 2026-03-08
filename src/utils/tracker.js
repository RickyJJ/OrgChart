/**
 * 匿名 UUID 追踪器 (Anonymous UUID Tracker)
 * 
 * 在不引入用户注册/登录体系的情况下，利用 localStorage
 * 为每台设备生成持久化的唯一标识，用于裂变漏斗埋点分析。
 */

const STORAGE_KEY = 'qyz_anon_id';

/**
 * 获取或生成匿名 UUID
 * @returns {string} 持久化的匿名 UUID
 */
export function getOrCreateUUID() {
    let uuid = null;
    try {
        uuid = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
        // localStorage 不可用时静默降级
        console.warn('[Tracker] localStorage 不可用，使用临时 UUID:', e.message);
    }

    if (!uuid) {
        // 优先使用 crypto.randomUUID()，回退到手动生成
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            uuid = crypto.randomUUID();
        } else {
            uuid = fallbackUUID();
        }

        try {
            localStorage.setItem(STORAGE_KEY, uuid);
        } catch (e) {
            // 静默失败
        }
    }

    return uuid;
}

/**
 * 获取当前已存在的 UUID（不创建新的）
 * @returns {string|null}
 */
export function getUUID() {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

/**
 * crypto.randomUUID 不可用时的回退方案
 * 生成一个 v4 格式的 UUID
 */
function fallbackUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export default { getOrCreateUUID, getUUID };
