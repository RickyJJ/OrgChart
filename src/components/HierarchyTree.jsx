import React, { useRef, useEffect } from 'react';
import NodeCard from './NodeCard';
import TreeConnections from './TreeConnections';

function HierarchyTree({ activeDynasty, expandedNodes, onNodeExpand, onReadMore, selectedNodeId }) {
    const viewportRef = useRef(null);
    const canvasRef = useRef(null);

    // Pan & Zoom logic
    useEffect(() => {
        const viewport = viewportRef.current;
        const canvas = canvasRef.current;
        if (!viewport || !canvas) return;

        let scale = 1;
        let pos = { x: 0, y: 0 };
        let isDragging = false;
        let dragStart = { x: 0, y: 0 };

        const updateTransform = () => {
            // Apply scale and translation via CSS immediately
            canvas.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(${scale})`;
        };

        // Initialize layout: fit to screen if tree is wider than viewport
        const initLayout = () => {
            setTimeout(() => {
                if (!viewport || !canvas) return;
                const vWidth = viewport.clientWidth;
                const cWidth = canvas.scrollWidth;

                if (cWidth > vWidth * 0.9 && cWidth > 0) {
                    scale = Math.max((vWidth * 0.9) / cWidth, 0.2); // max zoom out 0.2x
                } else {
                    scale = 1;
                }

                const scaledWidth = cWidth * scale;
                pos.x = (vWidth - scaledWidth) / 2; // center horizontally
                pos.y = 180; // top padding to clear the absolute header

                updateTransform();
            }, 50); // wait for initial DOM layout to settle
        };

        initLayout();

        const onWheel = (e) => {
            e.preventDefault();

            const zoomSensitivity = 0.0015;
            const delta = -e.deltaY * zoomSensitivity;
            const newScale = Math.min(Math.max(scale * (1 + delta), 0.15), 3); // bounds 0.15 to 3

            if (newScale === scale) return;

            const rect = viewport.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Compute mouse position relative to unscaled canvas
            const mouseLocalX = (mouseX - pos.x) / scale;
            const mouseLocalY = (mouseY - pos.y) / scale;

            // Recalculate translation so mouse stays over same logical point
            pos.x = mouseX - mouseLocalX * newScale;
            pos.y = mouseY - mouseLocalY * newScale;
            scale = newScale;

            updateTransform();
        };

        const onMouseDown = (e) => {
            if (e.target.closest('.node-card')) return;
            isDragging = true;
            viewport.style.cursor = 'grabbing';
            dragStart = { x: e.clientX - pos.x, y: e.clientY - pos.y };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            pos.x = e.clientX - dragStart.x;
            pos.y = e.clientY - dragStart.y;
            updateTransform();
        };

        const onMouseUp = () => {
            isDragging = false;
            if (viewport) viewport.style.cursor = 'grab';
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
    }, [activeDynasty]);

    if (!activeDynasty) return null;

    return (
        <div
            className="w-full flex-1 overflow-hidden cursor-grab viewport relative z-[5]"
            ref={viewportRef}
        >
            <div
                className="canvas absolute top-0 left-0 min-w-max"
                ref={canvasRef}
                style={{ transformOrigin: '0 0', willChange: 'transform', backfaceVisibility: 'hidden' }}
            >
                <TreeConnections containerRef={canvasRef} />
                <ul className="org-tree tree inline-block min-w-full align-top">
                    <NodeCard
                        node={activeDynasty.structure}
                        expandedNodes={expandedNodes}
                        onExpand={onNodeExpand}
                        onReadMore={onReadMore}
                        selectedNodeId={selectedNodeId}
                        isRoot={true}
                    />
                </ul>
            </div>
        </div>
    );
}

export default HierarchyTree;
