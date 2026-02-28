import React, { useState } from 'react';

function NodeCard({ node, expandedNodes, onExpand, onReadMore, selectedNodeId, isRoot }) {
    const isExpanded = expandedNodes[node.id];
    const isSelected = selectedNodeId === node.id;

    // Local state for expanding children tree
    const [childrenVisible, setChildrenVisible] = useState(true);

    const handleCardClick = (e) => {
        e.stopPropagation();
        onExpand(node.id);
        onReadMore(node);
    };

    const toggleChildren = (e) => {
        e.stopPropagation();
        setChildrenVisible(!childrenVisible);
    };

    const isLongTitle = !isRoot && !node.bgImage && node.title.length > 4;

    let cardClass = ``;
    const hasChildren = node.children && node.children.length > 0;
    const showFan = hasChildren && !childrenVisible;

    if (isRoot) {
        cardClass = `w-32 h-32 ${node.hideBorder ? '' : 'border-4 border-vermilion rounded-lg'} bg-contain bg-center bg-no-repeat text-vermilion bg-transparent flex items-center justify-center z-[1] select-none flex-col items-center cursor-pointer transition-all duration-300`;
    } else if (node.bgImage) {
        cardClass = `w-24 h-32 bg-contain bg-center bg-no-repeat inline-flex flex-col items-center justify-center cursor-pointer relative z-[2] select-none transition-all duration-300 ${isSelected ? 'scale-[1.02] drop-shadow-[0_0_10px_rgba(120,113,108,0.5)]' : 'hover:scale-[1.02] hover:drop-shadow-[0_0_8px_rgba(120,113,108,0.3)]'}`;
    } else {
        cardClass = `slip-card-bg slip-card px-1 py-4 cursor-pointer relative z-[2] select-none transition-transform duration-300 node-card-ink will-change-transform antialiased ${isSelected ? 'active -translate-y-1' : 'hover:-translate-y-1'}`;
    }

    const isSlipCard = !isRoot && !node.bgImage;
    const slipStyle = isSlipCard ? { width: '60px', height: '167px' } : {};

    // Fan angle default 3; set to 0 when expanded to animate close
    const fanAngle = 3;
    const activeFanAngle = showFan ? fanAngle : 0;

    // Calculate dynamic duration for marquee: Base 0.4s per character beyond 4 chars
    const marqueeDuration = isLongTitle ? `${(node.title.length - 3) * 0.5}s` : '0s';

    return (
        <li
            className="relative"
            data-node-id={node.id}
            data-children-visible={childrenVisible}
            style={{
                '--fan-angle': `${activeFanAngle}deg`,
                '--marquee-duration': marqueeDuration
            }}
        >
            {/* Stable anchor for SVG connections, unaffected by card hover/animations */}
            <div data-anchor="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0" />

            {/* Wrapper to isolate the vertical writing mode so its physical height dictates block size */}
            <div className="flex justify-center items-start w-full relative z-10 mix-blend-multiply" style={{ height: '220px' }}>
                <div
                    className={cardClass}
                    data-card="true"
                    onClick={handleCardClick}
                    style={{
                        ...(node.bgImage ? { backgroundImage: `url('${node.bgImage}')` } : {}),
                        ...slipStyle,
                        position: 'relative',
                        marginTop: '18px'
                    }}
                >
                    {/* Inner watercolor insight layer — alpha-masked to frame interior */}
                    {isSlipCard && <div className="card-insight-layer" />}
                    {/* Border line overlay — re-renders frame border on top of insight */}
                    {isSlipCard && <div className="card-border-overlay" />}
                    {isRoot ? (
                        !node.hideText && (
                            <div className="font-serif text-3xl font-bold tracking-widest text-center leading-none">
                                {node.title}
                            </div>
                        )
                    ) : (
                        <div className={`title-marquee-container ${isLongTitle ? 'has-overflow' : ''}`}>
                            <span
                                className={`font-serif font-semibold text-[1.6rem] tracking-[0.1em] ${isLongTitle ? 'marquee-text' : ''} ${node.bgImage ? 'text-transparent' : 'text-[#2a2624]'}`}
                            >
                                {node.title}
                            </span>
                        </div>
                    )}
                    {hasChildren && (
                        <div
                            onClick={toggleChildren}
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center text-gray-300/40 hover:text-stone-500/70 transition-colors duration-500 z-20 cursor-pointer"
                            style={{ writingMode: 'horizontal-tb' }}
                            title={childrenVisible ? "收起" : "展开"}
                        >
                            <svg
                                className={`w-5 h-5 transition-transform duration-500 ${childrenVisible ? 'rotate-180' : 'rotate-0'}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    )}
                    {/* Fan-out pseudo cards — always rendered for smooth transition, angle toggled via CSS var */}
                    {hasChildren && !isRoot && (
                        <>
                            <div className="fan-card fan-left">
                                <div className="card-insight-layer" />
                                <div className="card-border-overlay" />
                            </div>
                            <div className="fan-card fan-right">
                                <div className="card-insight-layer" />
                                <div className="card-border-overlay" />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {hasChildren && (
                <ul
                    className={`transition-all duration-500 overflow-hidden ${childrenVisible ? 'opacity-100' : 'opacity-0 invisible pointer-events-none'}`}
                    style={!childrenVisible ? { maxHeight: 0, paddingTop: 0, margin: 0 } : { maxHeight: '2000px' }}
                >
                    {node.children.map(child => (
                        <NodeCard
                            key={child.id}
                            node={child}
                            expandedNodes={expandedNodes}
                            onExpand={onExpand}
                            onReadMore={onReadMore}
                            selectedNodeId={selectedNodeId}
                            isRoot={false}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

export default NodeCard;
