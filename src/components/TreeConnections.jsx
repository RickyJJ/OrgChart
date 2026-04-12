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

function generatePathSegments(px, py, children, midY) {
    const sorted = [...children].sort((a, b) => a.x - b.x);
    if (sorted.length === 1) {
        const c = sorted[0];
        const dx = c.x - px;
        if (Math.abs(dx) < 1) {
            return `M ${px},${py} L ${c.x},${c.y}`;
        }
        const dir = dx > 0 ? 1 : -1;
        const r = clampR(R, Math.abs(dx) / 2, (c.y - midY) / 2);
        return [
            `M ${px},${py}`, `L ${px},${midY - r}`,
            `Q ${px},${midY} ${px + dir * r},${midY}`,
            `L ${c.x - dir * r},${midY}`,
            `Q ${c.x},${midY} ${c.x},${midY + r}`,
            `L ${c.x},${c.y}`,
        ].join(' ');
    }

    const segments = [];
    segments.push(`M ${px},${py} L ${px},${midY}`);
    const first = sorted[0];
    const armL = Math.abs(first.x - px);
    const dropL = first.y - midY;
    if (armL < 1) {
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
    for (let i = 1; i < sorted.length - 1; i++) {
        const c = sorted[i];
        segments.push(`M ${c.x},${midY} L ${c.x},${c.y}`);
    }
    return segments.join(' ');
}

function TreeConnections({ containerRef }) {
    const [groups, setGroups] = useState([]);
    const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });
    const rafId = useRef(null);
    const svgRef = useRef(null);
    const lastRenderedGroupsRef = useRef([]);

    const recalculate = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const scale = container.offsetWidth > 0 ? containerRect.width / container.offsetWidth : 1;

        const newGroups = [];
        const allNodes = container.querySelectorAll('li[data-node-id]');

        allNodes.forEach((parentLi) => {
            const parentCard = parentLi.querySelector(':scope > div > div[data-card]');
            if (!parentCard) return;

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

            const ulRect = childUl.getBoundingClientRect();
            const ulLeftLocal = (ulRect.left - containerRect.left) / scale;
            const ulRightLocal = (ulRect.right - containerRect.left) / scale;
            const ulBottomLocal = (ulRect.bottom - containerRect.top) / scale;

            const children = [];
            childLis.forEach((childLi) => {
                const childCard = childLi.querySelector(':scope > div > div[data-card]');
                if (!childCard) return;
                const childAnchor = childCard.querySelector(':scope > [data-anchor="top"]');
                if (!childAnchor) return;

                const anchorRect = childAnchor.getBoundingClientRect();
                
                let cxLocal = (anchorRect.left + anchorRect.width / 2 - containerRect.left) / scale;
                let cyLocal = (anchorRect.top - containerRect.top) / scale;

                // Sync the SVG path end-coordinates with the physical `ul` overflow mask so lines don't draw outside visually transitioning elements.
                cxLocal = Math.max(ulLeftLocal, Math.min(ulRightLocal, cxLocal));
                cyLocal = Math.min(ulBottomLocal, cyLocal);
                // Prevent lines from drawing upwards (violating topological drop) while cards are staggering their translateY entry
                cyLocal = Math.max(cyLocal, py + 12);

                children.push({
                    x: cxLocal,
                    y: cyLocal,
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

        // Fast path: direct DOM mutation to prevent React 1-frame async latency during layout animation.
        // This eliminates the visual "rubber-banding" (overshooting/shortening) mismatch.
        let structureChanged = newGroups.length !== lastRenderedGroupsRef.current.length;
        if (!structureChanged) {
            for (let i = 0; i < newGroups.length; i++) {
                const n = newGroups[i], o = lastRenderedGroupsRef.current[i];
                if (n.parentId !== o.parentId || n.children.length !== o.children.length || n.isVisible !== o.isVisible) {
                    structureChanged = true;
                    break;
                }
            }
        }

        if (svgRef.current && !structureChanged) {
            newGroups.forEach(g => {
                const groupEl = svgRef.current.querySelector(`g[data-group-id="${g.parentId}"]`);
                if (!groupEl) { structureChanged = true; return; }

                const pathEl = groupEl.querySelector('path');
                if (pathEl) {
                    pathEl.setAttribute('d', generatePathSegments(g.px, g.py, g.children, g.py + 12));
                }

                const pDot = groupEl.querySelector('.p-dot');
                if (pDot) {
                    pDot.setAttribute('cx', g.px);
                    pDot.setAttribute('cy', g.py);
                }

                g.children.forEach(c => {
                    const cDot = groupEl.querySelector(`.c-dot[data-id="${c.id}"]`);
                    if (cDot) {
                        cDot.setAttribute('cx', c.x);
                        cDot.setAttribute('cy', c.y);
                    }
                });
            });
            // Update container width if it overflowed due to tree widening
            setSvgSize({ w: container.scrollWidth, h: container.scrollHeight });
            lastRenderedGroupsRef.current = newGroups;
            return;
        }

        lastRenderedGroupsRef.current = newGroups;
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
                recalculate();
                const startTime = performance.now();
                const animate = (time) => {
                    recalculate();
                    if (time - startTime < 1100) {
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
            ref={svgRef}
            className="tree-connections"
            width={svgSize.w || '100%'}
            height={svgSize.h || '100%'}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 1, overflow: 'visible' }}
        >
            {groups.map(({ px, py, children, parentId, isParentSlip, isVisible }) => {
                const midY = py + 12;
                const d = generatePathSegments(px, py, children, midY);

                const groupStyle = {
                    transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: isVisible ? 1 : 0,
                    pointerEvents: 'none'
                };

                return (
                    <g key={parentId} data-group-id={parentId} style={groupStyle}>
                        <path d={d} fill="none" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle className="p-dot" cx={px} cy={py} r="1.8" fill={DOT} opacity={isParentSlip ? 0 : 1} />
                        {children.map((c) => (
                            <circle className="c-dot" key={c.id} data-id={c.id} cx={c.x} cy={c.y} r="1.8" fill={DOT} opacity={c.isSlip ? 0 : 1} />
                        ))}
                    </g>
                );
            })}
        </svg>
    );
}

export default TreeConnections;
