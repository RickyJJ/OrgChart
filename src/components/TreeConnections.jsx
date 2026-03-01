import React, { useEffect, useState, useCallback, useRef } from 'react';

/**
 * TreeConnections — SVG overlay drawing clean orthogonal T-connector
 * lines with rounded corners at bar endpoints.
 *
 * Structure per parent:
 *   1. Vertical trunk from parent bottom to midY
 *   2. Left arm: horizontal bar from trunk to leftmost child, with rounded
 *      L-corner curving into the drop
 *   3. Right arm: same toward rightmost child
 *   4. Inner children: straight vertical drops (clean T-junctions)
 *
 * No overlapping segments → uniform color.
 */

const R = 8; // Corner radius

function clampR(r, halfArm, halfDrop) {
    return Math.min(r, halfArm, halfDrop);
}

function TreeConnections({ containerRef }) {
    const [groups, setGroups] = useState([]);
    const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });
    const rafId = useRef(null);

    const recalculate = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        // Calculate scale: bounding width (transformed visual pixels) / offsetWidth (intrinsic logical pixels)
        const scale = container.offsetWidth > 0 ? containerRect.width / container.offsetWidth : 1;

        const newGroups = [];
        const allNodes = container.querySelectorAll('li[data-node-id]');

        allNodes.forEach((parentLi) => {
            const parentCard = parentLi.querySelector(':scope > div > div[data-card]');
            if (!parentCard) return;

            // Fixed visibility: recursively check if any ancestor is collapsed
            const isSelfVisible = parentLi.getAttribute('data-children-visible') !== 'false';
            if (!isSelfVisible) return;

            let isAncestorCollapsed = false;
            let currentParent = parentLi.parentElement;
            while (currentParent && currentParent !== container) {
                if (currentParent.tagName === 'LI' && currentParent.getAttribute('data-children-visible') === 'false') {
                    isAncestorCollapsed = true;
                    break;
                }
                currentParent = currentParent.parentElement;
            }
            if (isAncestorCollapsed) return;

            const childUl = parentLi.querySelector(':scope > ul');
            if (!childUl) return;

            const childLis = childUl.querySelectorAll(':scope > li[data-node-id]');
            if (childLis.length === 0) return;

            const parentAnchor = parentCard.querySelector(':scope > [data-anchor="bottom"]');
            if (!parentAnchor) return;

            const pAnchorRect = parentAnchor.getBoundingClientRect();
            const px = (pAnchorRect.left + pAnchorRect.width / 2 - containerRect.left) / scale;
            const py = (pAnchorRect.top - containerRect.top) / scale;

            const children = [];
            childLis.forEach((childLi) => {
                const childCard = childLi.querySelector(':scope > div > div[data-card]');
                if (!childCard) return;
                const childAnchor = childCard.querySelector(':scope > [data-anchor="top"]');
                if (!childAnchor) return;

                const anchorRect = childAnchor.getBoundingClientRect();
                children.push({
                    x: (anchorRect.left + anchorRect.width / 2 - containerRect.left) / scale,
                    y: (anchorRect.top - containerRect.top) / scale,
                    id: childLi.dataset.nodeId,
                    isSlip: childCard.getAttribute('data-is-slip') === 'true',
                });
            });

            if (children.length > 0) {
                const isVisible = parentLi.getAttribute('data-children-visible') !== 'false';

                newGroups.push({
                    parentId: parentLi.dataset.nodeId,
                    px, py, children,
                    isParentSlip: parentCard.getAttribute('data-is-slip') === 'true',
                    isVisible
                });
            }
        });

        setSvgSize({ w: container.scrollWidth, h: container.scrollHeight });
        setGroups(newGroups);
    }, [containerRef]);

    const scheduleRecalculate = useCallback(() => {
        if (rafId.current) cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(recalculate);
    }, [recalculate]);

    useEffect(() => {
        const timer = setTimeout(recalculate, 50);
        const container = containerRef.current;
        if (!container) return () => clearTimeout(timer);

        const resizeObserver = new ResizeObserver(scheduleRecalculate);
        resizeObserver.observe(container);

        const mutationObserver = new MutationObserver((mutations) => {
            const hasSignificantChange = mutations.some(m =>
                (m.type === 'attributes' && (m.attributeName === 'data-children-visible' || m.attributeName === 'class')) ||
                m.type === 'childList'
            );

            if (hasSignificantChange) {
                // Ensure high-frequency recalculation during typical CSS transition (500ms)
                recalculate();
                const startTime = performance.now();
                const animate = (time) => {
                    recalculate();
                    if (time - startTime < 600) {
                        rafId.current = requestAnimationFrame(animate);
                    }
                };
                if (rafId.current) cancelAnimationFrame(rafId.current);
                rafId.current = requestAnimationFrame(animate);
            }
        });

        mutationObserver.observe(container, {
            childList: true, subtree: true, attributes: true, attributeFilter: ['data-children-visible', 'class'],
        });

        window.addEventListener('resize', scheduleRecalculate);
        return () => {
            clearTimeout(timer);
            if (rafId.current) cancelAnimationFrame(rafId.current);
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener('resize', scheduleRecalculate);
        };
    }, [recalculate, scheduleRecalculate, containerRef]);

    const STROKE = 'rgba(26, 45, 66, 0.3)';
    const DOT = 'rgba(26, 45, 66, 0.35)';

    return (
        <svg
            className="tree-connections"
            width={svgSize.w || '100%'}
            height={svgSize.h || '100%'}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 1, overflow: 'visible' }}
        >
            {groups.map(({ px, py, children, parentId, isParentSlip, isVisible }) => {
                const sorted = [...children].sort((a, b) => a.x - b.x);
                // Fix midY to a relative offset instead of average of children to prevent row-jump on hover
                const midY = py + 12;

                const groupStyle = {
                    transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: isVisible ? 1 : 0,
                    pointerEvents: 'none'
                };

                // ── Single child: L-path with rounded corners ──
                if (sorted.length === 1) {
                    const c = sorted[0];
                    const dx = c.x - px;
                    if (Math.abs(dx) < 1) {
                        return (
                            <g key={parentId} style={groupStyle}>
                                <path d={`M ${px},${py} L ${c.x},${c.y}`} fill="none" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
                                <circle cx={px} cy={py} r="1.8" fill={DOT} opacity={isParentSlip ? 0 : 1} />
                                <circle cx={c.x} cy={c.y} r="1.8" fill={DOT} opacity={c.isSlip ? 0 : 1} />
                            </g>
                        );
                    }
                    const dir = dx > 0 ? 1 : -1;
                    const r = clampR(R, Math.abs(dx) / 2, (c.y - midY) / 2);
                    const d = [
                        `M ${px},${py}`, `L ${px},${midY - r}`,
                        `Q ${px},${midY} ${px + dir * r},${midY}`,
                        `L ${c.x - dir * r},${midY}`,
                        `Q ${c.x},${midY} ${c.x},${midY + r}`,
                        `L ${c.x},${c.y}`,
                    ].join(' ');
                    return (
                        <g key={parentId} style={groupStyle}>
                            <path d={d} fill="none" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx={px} cy={py} r="1.8" fill={DOT} opacity={isParentSlip ? 0 : 1} />
                            <circle cx={c.x} cy={c.y} r="1.8" fill={DOT} opacity={c.isSlip ? 0 : 1} />
                        </g>
                    );
                }

                // ── Multiple children: T-connector with rounded end corners ──
                const segments = [];

                // 1. Trunk: parent → midY
                segments.push(`M ${px},${py} L ${px},${midY}`);

                // 2. Left arm (leftmost child) — L-corner with radius
                const first = sorted[0];
                const armL = Math.abs(first.x - px);
                const dropL = first.y - midY;
                if (armL < 1) {
                    // Directly below trunk — straight drop
                    segments.push(`M ${first.x},${midY} L ${first.x},${first.y}`);
                } else {
                    const rL = clampR(R, armL / 2, dropL / 2);
                    const dirL = first.x < px ? -1 : 1;
                    segments.push(
                        `M ${px},${midY} L ${first.x + (-dirL) * rL},${midY}` +
                        ` Q ${first.x},${midY} ${first.x},${midY + rL}` +
                        ` L ${first.x},${first.y}`
                    );
                }

                // 3. Right arm (rightmost child) — L-corner with radius
                const last = sorted[sorted.length - 1];
                const armR = Math.abs(last.x - px);
                const dropR = last.y - midY;
                if (armR < 1) {
                    segments.push(`M ${last.x},${midY} L ${last.x},${last.y}`);
                } else {
                    const rR = clampR(R, armR / 2, dropR / 2);
                    const dirR = last.x > px ? 1 : -1;
                    segments.push(
                        `M ${px},${midY} L ${last.x + (-dirR) * rR},${midY}` +
                        ` Q ${last.x},${midY} ${last.x},${midY + rR}` +
                        ` L ${last.x},${last.y}`
                    );
                }

                // 4. Inner children — straight drops (T-junctions, clean)
                for (let i = 1; i < sorted.length - 1; i++) {
                    const c = sorted[i];
                    segments.push(`M ${c.x},${midY} L ${c.x},${c.y}`);
                }

                return (
                    <g key={parentId} style={groupStyle}>
                        <path d={segments.join(' ')} fill="none" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx={px} cy={py} r="1.8" fill={DOT} opacity={isParentSlip ? 0 : 1} />
                        {children.map((c) => (
                            <circle key={c.id} cx={c.x} cy={c.y} r="1.8" fill={DOT} opacity={c.isSlip ? 0 : 1} />
                        ))}
                    </g>
                );
            })}
        </svg>
    );
}

export default TreeConnections;
