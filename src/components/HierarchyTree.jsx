import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import NodeCard from './NodeCard';
import TreeConnections from './TreeConnections';

const HierarchyTree = forwardRef(({ 
    activeDynasty, 
    onReadMore, 
    onFocusNode, 
    selectedNodeId, 
    searchTargetTrigger
}, ref) => {
    const viewportRef = useRef(null);
    const canvasRef = useRef(null);
    const transformRef = useRef({ x: 0, y: 0, scale: 1 });
    const isTrackingRef = useRef(false);

    const cancelTracking = useCallback(() => {
        isTrackingRef.current = false;
    }, []);

    const [expandedIds, setExpandedIds] = useState(new Set());

    const touchStateRef = useRef({
        lastDistance: 0,
        lastCenter: { x: 0, y: 0 },
        dragStart: { x: 0, y: 0 },
        isPinching: false
    });

    const prevDynastyIdRef = useRef(null);

    const applyTransform = useCallback((animate = false, callback = null) => {
        if (canvasRef.current) {
            const { x, y, scale } = transformRef.current;
            
            // Set transition explicitly before applying transform
            canvasRef.current.style.transition = animate 
                ? 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' 
                : 'none';

            canvasRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
            
            if (animate) {
                setTimeout(() => {
                    if (canvasRef.current) canvasRef.current.style.transition = 'none';
                    if (callback) callback();
                }, 850);
            } else {
                if (callback) callback();
            }
        }
    }, []);

    const panToCenterNode = useCallback((nodeId, animate = true) => {
        // Immediate calculation for better focus response
        const viewport = viewportRef.current;
        const canvas = canvasRef.current;
        if (!viewport || !canvas) return;

        const nodeEl = canvas.querySelector(`[data-node-id="${nodeId}"] div[data-card="true"]`);
        if (!nodeEl) {
            console.warn(`[HierarchyTree] Node not found for centering: ${nodeId}`);
            return;
        }

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
    }, [applyTransform]);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
        panToNode: (nodeId, animate = true) => {
            panToCenterNode(nodeId, animate);
            if (onFocusNode) onFocusNode(nodeId);
        },
        setExpandedPath: (pathIds) => {
            setExpandedIds(prev => {
                const next = new Set(prev);
                pathIds.forEach(id => next.add(id));
                return next;
            });
        }
    }));

    // Track active Dynasty switch or default map init
    useEffect(() => {
        if (!activeDynasty) return;

        // On every dynasty ID change, we always reset expandedIds to root only
        // EXCEPT if we are currently searching, in which case App.jsx will handle
        // call setExpandedPath shortly, but we MUST reset to root first to be safe.
        if (activeDynasty.id !== prevDynastyIdRef.current) {
            setExpandedIds(new Set([activeDynasty.structure.id]));
        }

        // We only perform the "Center to Root" pan if we are NOT in a search process
        // AND this is the first time we are loading this dynasty ID.
        if (activeDynasty.id !== prevDynastyIdRef.current && !searchTargetTrigger) {
            prevDynastyIdRef.current = activeDynasty.id;
            
            setTimeout(() => {
                const viewport = viewportRef.current;
                const canvas = canvasRef.current;
                if (!viewport || !canvas) return;

                const rect = viewport.getBoundingClientRect();
                const vWidth = rect.width;
                const vHeight = rect.height;
                const cWidth = canvas.scrollWidth;

                let scale = 1;
                if (cWidth > vWidth * 0.9 && cWidth > 0) {
                    scale = Math.max((vWidth * 0.9) / cWidth, 0.8);
                }
                const scaledWidth = cWidth * scale;
                transformRef.current = {
                    x: (vWidth - scaledWidth) / 2,
                    y: vHeight > 500 ? 180 : 100, // Adjust Y start for mobile
                    scale: scale
                };
                applyTransform();
            }, 50);
        } else if (activeDynasty.id !== prevDynastyIdRef.current) {
            // Even if we are searching, we must mark that this dynasty has been "seen"
            // so we don't trigger the "Center to Root" fallback when searchTargetTrigger is cleared.
            prevDynastyIdRef.current = activeDynasty.id;
        }
    }, [activeDynasty?.id, searchTargetTrigger, applyTransform]);

    // Event listeners
    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        let isDragging = false;
        let dragStart = { x: 0, y: 0 };

        const onWheel = (e) => {
            cancelTracking();
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
            if (e.target.closest('[data-card="true"]')) return;
            cancelTracking();
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

        const onTouchStart = (e) => {
            // ONLY stop if we are on a button (like the read more button)
            // dragging starting on a card should still drag the canvas
            if (e.target.closest('button')) return;
            cancelTracking();
            
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                const { x, y } = transformRef.current;
                touchStateRef.current.dragStart = { x: touch.clientX - x, y: touch.clientY - y };
                touchStateRef.current.isPinching = false;
            } else if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                touchStateRef.current.lastDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
                touchStateRef.current.lastCenter = {
                    x: (touch1.clientX + touch2.clientX) / 2,
                    y: (touch1.clientY + touch2.clientY) / 2
                };
                touchStateRef.current.isPinching = true;
            }
        };

        const onTouchMove = (e) => {
            // Only block if we're hitting UI elements that need their own gestures
            // (Breadcrumbs are now in App.jsx, but we keep this for safety)
            if (e.target.closest('[data-drawer="true"]') || e.target.closest('.breadcrumb-item')) {
                 return; 
            }
            
            if (e.touches.length === 1 && !touchStateRef.current.isPinching) {
                const touch = e.touches[0];
                const { scale } = transformRef.current;
                transformRef.current = {
                    x: touch.clientX - touchStateRef.current.dragStart.x,
                    y: touch.clientY - touchStateRef.current.dragStart.y,
                    scale: scale
                };
                applyTransform();
            } else if (e.touches.length === 2) {
                e.preventDefault(); // Lock scroll
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
                const center = {
                    x: (touch1.clientX + touch2.clientX) / 2,
                    y: (touch1.clientY + touch2.clientY) / 2
                };

                // Defend against division by zero
                if (touchStateRef.current.lastDistance === 0) {
                    touchStateRef.current.lastDistance = distance;
                    touchStateRef.current.lastCenter = center;
                    return;
                }

                const { x, y, scale } = transformRef.current;
                const rect = viewport.getBoundingClientRect();
                
                // Scale factor
                const factor = distance / touchStateRef.current.lastDistance;
                const newScale = Math.min(Math.max(scale * factor, 0.15), 3);
                
                if (newScale !== scale) {
                    const centerX = center.x - rect.left;
                    const centerY = center.y - rect.top;
                    
                    const localX = (centerX - x) / scale;
                    const localY = (centerY - y) / scale;
                    
                    // Pan with center shift
                    const dx = center.x - touchStateRef.current.lastCenter.x;
                    const dy = center.y - touchStateRef.current.lastCenter.y;

                    transformRef.current = {
                        x: centerX - localX * newScale + dx,
                        y: centerY - localY * newScale + dy,
                        scale: newScale
                    };
                    applyTransform();
                }

                touchStateRef.current.lastDistance = distance;
                touchStateRef.current.lastCenter = center;
            }
        };

        const onTouchEnd = () => {
            touchStateRef.current.lastDistance = 0;
            // If still one finger down, reset dragStart for panning
            touchStateRef.current.isPinching = false;
        };

        viewport.addEventListener('wheel', onWheel, { passive: false });
        viewport.addEventListener('mousedown', onMouseDown);
        viewport.addEventListener('touchstart', onTouchStart, { passive: true });
        viewport.addEventListener('touchmove', onTouchMove, { passive: false });
        viewport.addEventListener('touchend', onTouchEnd);

        return () => {
            viewport.removeEventListener('wheel', onWheel);
            viewport.removeEventListener('mousedown', onMouseDown);
            viewport.removeEventListener('touchstart', onTouchStart);
            viewport.removeEventListener('touchmove', onTouchMove);
            viewport.removeEventListener('touchend', onTouchEnd);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [applyTransform]);

    if (!activeDynasty) return null;

    const handleNodeToggle = (nodeId) => {
        // 1. Immediate Pan lead-in (Focus first)
        panToCenterNode(nodeId, true);
        if (onFocusNode) onFocusNode(nodeId);
        
        // 2. Sequential structural Change after a short lead-time (150ms)
        setTimeout(() => {
            cancelTracking(); // Cancel any existing track before starting a new one
            
            setExpandedIds(prev => {
                const next = new Set(prev);
                if (next.has(nodeId)) {
                    next.delete(nodeId);
                } else {
                    next.add(nodeId);
                }
                return next;
            });

            // 3. Continuous Camera Tracking during layout transition
            // Effectively cancels out the node's layout shift by moving the canvas inversely
            isTrackingRef.current = true;
            const startStr = performance.now();
            
            const track = (time) => {
                if (!isTrackingRef.current) return; // Terminate if user touched/interrupted
                
                if (time - startStr < 850) {
                    // Update with ZERO delay (transition: none) matching exact layout coord
                    panToCenterNode(nodeId, false); 
                    requestAnimationFrame(track);
                } else {
                    isTrackingRef.current = false;
                    panToCenterNode(nodeId, true); // Final stabilization
                }
            };
            requestAnimationFrame(track);
            
        }, 150);
    };

    return (
        <div
            className="w-full flex-1 overflow-hidden cursor-grab viewport relative z-[5] scroll-unroll-anim touch-none"
            ref={viewportRef}
        >
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
});

HierarchyTree.displayName = 'HierarchyTree';

export default HierarchyTree;
