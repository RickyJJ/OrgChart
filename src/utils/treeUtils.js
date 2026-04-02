/**
 * Utility functions for tree manipulation
 */

/**
 * find path from root to target node
 * @param {Object} rootNode 
 * @param {string} targetId 
 * @returns {Array|null} array of nodes or null
 */
export const getPath = (rootNode, targetId) => {
    if (!rootNode) return null;
    if (rootNode.id === targetId) return [rootNode];
    if (rootNode.children) {
        for (const child of rootNode.children) {
            const p = getPath(child, targetId);
            if (p) return [rootNode, ...p];
        }
    }
    return null;
};

/**
 * Filter breadcrumb path to remove noise/redundant nodes
 * @param {Array} path 
 * @returns {Array} filtered path
 */
export const filterBreadcrumbPath = (path) => {
    if (!path) return [];
    // Only filter the root if there are other items in the path
    // If root is the only node, show it so the breadcrumb isn't empty.
    if (path.length <= 1) return path;

    return path.filter(node => 
        node.title && node.title !== ''
    );
};
