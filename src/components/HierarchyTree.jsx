import React, { useRef, useEffect, useState, useCallback } from 'react';
import NodeCard from './NodeCard';
import TreeConnections from './TreeConnections';

function HierarchyTree({ activeDynasty, onReadMore, selectedNodeId, searchTargetTrigger }) {
    const viewportRef = useRef(null);
    const canvasRef = useRef(null);
    const transformRef = useRef({ x: 0, y: 0, scale: 1 });

    const [expandedIds, setExpandedIds] = useState(new Set());
    const [currentPath, setCurrentPath] = useState([]);

    const getPath = useCallback((rootNode, targetId) => {
        if (!rootNode) return null;
        if (rootNode.id === targetId) return [rootNode];
        if (rootNode.children) {
            for (const child of rootNode.children) {
                const p = getPath(child, targetId);
                if (p) return [rootNode, ...p];
            }
        }
        return null;
    }, []);

    const applyTransform = useCallback((animate = false, callback = null) => {
        if (canvasRef.current) {
            const { x, y, scale } = transformRef.current;
            if (animate) {
                canvasRef.current.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            }
            canvasRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
            
            if (animate) {
                setTimeout(() => {
                    if (canvasRef.current) canvasRef.current.style.transition = 'none';
                    if (callback) callback();
                }, 550);
            } else {
                if (callback) callback();
            }
        }
    }, []);

    const panToCenterNode = useCallback((nodeId, animate = true) => {
        // requestAnimationFrame yields UI rendering
        requestAnimationFrame(() => {
            setTimeout(() => {
                const viewport = viewportRef.current;
                const canvas = canvasRef.current;
                if (!viewport || !canvas) return;

                const nodeEl = canvas.querySelector(`[data-node-id="${nodeId}"] > div > div[data-card="true"]`);
                if (!nodeEl) return;

                const cRect = canvas.getBoundingClientRect();
                const nRect = nodeEl.getBoundingClientRect();
                const vRect = viewport.getBoundingClientRect();
                const currentScale = transformRef.current.scale;

                const localX = (nRect.left - cRect.left) / currentScale + (nRect.width / currentScale) / 2;
                const localY = (nRect.top - cRect.top) / currentScale + (nRect.height / currentScale) / 2;

                // SPEC: Lock scale roughly to 1.0 (anti-shrink for Noto Serif readability)
                let targetScale = currentScale;
                if (targetScale < 1.0) targetScale = 1.0;
                if (targetScale > 2.0) targetScale = 2.0;

                const targetX = vRect.width / 2 - localX * targetScale;
                const targetY = vRect.height / 2 - localY * targetScale;

                transformRef.current = { x: targetX, y: targetY, scale: targetScale };
                applyTransform(animate);
            }, 60); // give time for transition unhide
        });
    }, [applyTransform]);

    // Track active Dynasty switch or default map init
    useEffect(() => {
        if (activeDynasty) {
            const root = activeDynasty.structure;
            
            // On dynasty switch and if no selected node, default to root only
            if (!selectedNodeId) {
                setExpandedIds(new Set([root.id]));
                setCurrentPath([root]);
                
                setTimeout(() => {
                    const viewport = viewportRef.current;
                    const canvas = canvasRef.current;
                    if (!viewport || !canvas) return;

                    const vWidth = viewport.clientWidth;
                    const cWidth = canvas.scrollWidth;

                    let scale = 1;
                    if (cWidth > vWidth * 0.9 && cWidth > 0) {
                        scale = Math.max((vWidth * 0.9) / cWidth, 0.8);
                    }
                    const scaledWidth = cWidth * scale;
                    transformRef.current = {
                        x: (vWidth - scaledWidth) / 2,
                        y: 180,
                        scale: scale
                    };
                    applyTransform();
                }, 50);
            }
        }
    }, [activeDynasty, applyTransform]);

    // Active Card Selection (Clicking card directly) -> Update Breadcrumbs ONLY
    useEffect(() => {
        if (activeDynasty && selectedNodeId) {
            const path = getPath(activeDynasty.structure, selectedNodeId);
            if (path) {
                setCurrentPath(path);
            }
        }
    }, [activeDynasty, selectedNodeId, getPath]);

    // Global Search Penetration (Auto-expansion & Pan)
    useEffect(() => {
        if (activeDynasty && searchTargetTrigger) {
            const nodeId = searchTargetTrigger.nodeId;
            const path = getPath(activeDynasty.structure, nodeId);
            if (path) {
                setCurrentPath(path);
                setExpandedIds(new Set(path.map(n => n.id)));
                panToCenterNode(nodeId, true);
            }
        }
    }, [activeDynasty, searchTargetTrigger, getPath, panToCenterNode]);

    // Event listeners
    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        let isDragging = false;
        let dragStart = { x: 0, y: 0 };

        const onWheel = (e) => {
            e.preventDefault();
            const { x, y, scale } = transformRef.current;
            const zoomSensitivity = 0.0015;
            const delta = -e.deltaY * zoomSensitivity;
            const newScale = Math.min(Math.max(scale * (1 + delta), 0.15), 3);
            if (newScale === scale) return;

            const rect = viewport.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const mouseLocalX = (mouseX - x) / scale;
            const mouseLocalY = (mouseY - y) / scale;

            transformRef.current = {
                x: mouseX - mouseLocalX * newScale,
                y: mouseY - mouseLocalY * newScale,
                scale: newScale
            };
            applyTransform();
        };

        const onMouseDown = (e) => {
            // events on cards shouldn't prevent panning unless it's text selection maybe, but simple block on card
            if (e.target.closest('[data-card="true"]')) return;
            isDragging = true;
            viewport.style.cursor = 'grabbing';
            const { x, y } = transformRef.current;
            dragStart = { x: e.clientX - x, y: e.clientY - y };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            const { scale } = transformRef.current;
            transformRef.current = {
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
                scale: scale
            };
            applyTransform();
        };

        const onMouseUp = () => {
            isDragging = false;
            if (viewportRef.current) viewportRef.current.style.cursor = 'grab';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        viewport.addEventListener('wheel', onWheel, { passive: false });
        viewport.addEventListener('mousedown', onMouseDown);

        return () => {
            viewport.removeEventListener('wheel', onWheel);
            viewport.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [applyTransform]);

    if (!activeDynasty) return null;

    const dynastyPrefix = activeDynasty.name.replace('朝', '');

    const handleNodeToggle = (nodeId) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(nodeId)) {
                next.delete(nodeId);
            } else {
                next.add(nodeId);
            }
            return next;
        });
        
        // Spec: clicks expand parent also pan to center it
        panToCenterNode(nodeId, true);
    };

    return (
        <div
            className="w-full flex-1 overflow-hidden cursor-grab viewport relative z-[5] scroll-unroll-anim"
            ref={viewportRef}
        >
            {/* Breadcrumb Navigation - 云迹 */}
            <div className="absolute bottom-8 left-12 z-20 pointer-events-none p-2 flex flex-col items-start gap-1">
                <div className="bg-[#f5f5dc]/70 backdrop-blur-md border border-[#c4a984]/50 rounded-lg p-2 px-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex flex-wrap gap-2 pointer-events-auto items-center">
                    <span className="font-serif text-[#af292e] font-bold text-sm select-none">
                        {dynastyPrefix}
                    </span>
                    {currentPath.length > 0 && <span className="text-[#8b6b4e] select-none">·</span>}
                    {currentPath.map((n, i) => {
                        const isLast = i === currentPath.length - 1;
                        return (
                            <React.Fragment key={n.id}>
                                <span 
                                    className={`font-serif text-sm cursor-pointer transition-colors ${isLast ? 'text-[#1a1a1a] font-bold' : 'text-[#5c4b3c] hover:text-[#af292e]'}`}
                                    onClick={() => {
                                        const newPath = currentPath.slice(0, i + 1);
                                        setCurrentPath(newPath);
                                        setExpandedIds(new Set(newPath.map(x => x.id)));
                                        panToCenterNode(n.id, true);
                                    }}
                                >
                                    {n.title}
                                </span>
                                {!isLast && <span className="text-[#8b6b4e] select-none">·</span>}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            <div
                className="canvas absolute top-0 left-0 min-w-max"
                ref={canvasRef}
                style={{ transformOrigin: '0 0', willChange: 'transform', backfaceVisibility: 'hidden' }}
            >
                <TreeConnections containerRef={canvasRef} />
                <ul className="org-tree tree inline-block min-w-full align-top transition-transform">
                    <NodeCard
                        node={activeDynasty.structure}
                        onReadMore={onReadMore}
                        selectedNodeId={selectedNodeId}
                        isRoot={true}
                        expandedIds={expandedIds}
                        onToggleNode={handleNodeToggle}
                    />
                </ul>
            </div>
        </div>
    );
}

export default HierarchyTree;
