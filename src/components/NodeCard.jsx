import React from 'react';

function NodeCard({ node, onReadMore, selectedNodeId, isRoot, index = 0, expandedIds, onToggleNode }) {
    const isSelected = selectedNodeId === node.id;
    const hasLore = (node.allusions && node.allusions.length > 0) || (node.poetry && node.poetry.length > 0);

    const childrenVisible = expandedIds ? expandedIds.has(node.id) : true;

    const handleCardClick = (e) => {
        e.stopPropagation();
        onReadMore(node);
    };

    const toggleChildren = (e) => {
        e.stopPropagation();
        if (onToggleNode) onToggleNode(node.id);
    };

    const isLongTitle = !isRoot && !node.bgImage && node.title.length > 4;

    let cardClass = ``;
    const hasChildren = node.children && node.children.length > 0;
    const showFan = hasChildren && !childrenVisible;

    if (isRoot) {
        cardClass = `w-32 h-32 ${node.hideBorder ? '' : 'border-4 border-vermilion rounded-lg'} bg-contain bg-center bg-no-repeat text-vermilion bg-transparent flex items-center justify-center z-[1] select-none flex-col cursor-pointer transition-all duration-300`;
    } else if (node.bgImage) {
        cardClass = `w-24 h-32 bg-contain bg-center bg-no-repeat inline-flex flex-col items-center justify-center cursor-pointer relative z-[2] select-none transition-all duration-300 ${isSelected ? 'scale-[1.02] drop-shadow-[0_0_10px_rgba(120,113,108,0.5)]' : 'hover:scale-[1.02] hover:drop-shadow-[0_0_8px_rgba(120,113,108,0.3)]'}`;
    } else {
        cardClass = `slip-card-bg slip-card px-1 py-4 cursor-pointer relative z-[2] select-none transition-transform duration-300 node-card-ink will-change-transform antialiased hover:-translate-y-1 ${isSelected ? 'active' : ''}`;
    }

    const isSlipCard = !isRoot && !node.bgImage;

    const containerStyle = isRoot
        ? { width: '128px', height: '128px' } // w-32 h-32
        : node.bgImage
            ? { width: '96px', height: '128px' } // w-24 h-32
            : { width: '60px', height: '167px' }; // slip card

    const fanAngle = 3;
    const activeFanAngle = showFan ? fanAngle : 0;
    const marqueeDuration = isLongTitle ? `${(node.title.length - 3) * 0.5}s` : '0s';

    return (
        <li
            className="relative"
            data-node-id={node.id}
            data-children-visible={childrenVisible}
            style={{
                '--fan-angle': `${activeFanAngle}deg`,
                '--marquee-duration': marqueeDuration,
                transitionDelay: childrenVisible ? `${index * 40}ms` : '0ms'
            }}
        >
            <div className="flex justify-center items-start w-full relative z-10 mix-blend-multiply" style={{ height: '220px' }}>
                <div
                    className="relative"
                    data-card="true"
                    data-node-type={isRoot ? 'root' : (node.bgImage ? 'image' : 'slip')}
                    data-is-slip={isSlipCard}
                    style={{
                        ...containerStyle,
                        marginTop: '18px'
                    }}
                >
                    {!isRoot && <div data-anchor="top" className="absolute top-[-18px] left-1/2 -translate-x-1/2 w-0 h-0" />}
                    <div data-anchor="bottom" className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-0 h-0" />

                    <div
                        className={cardClass}
                        onClick={handleCardClick}
                        style={{
                            ...(node.bgImage ? { backgroundImage: `url('${node.bgImage}')` } : {}),
                            position: 'absolute',
                            inset: 0
                        }}
                    >
                        {isSlipCard && <div className="card-insight-layer" />}
                        {isSlipCard && <div className="card-border-overlay" />}
                        {isSlipCard && hasLore && <div className="lore-breathing-mark" title="此处有典故" />}
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
                        {showFan && !isRoot && (
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

                {/* Breadcrumb explicit Fold hint */}
                {showFan && (
                    <div className="absolute top-[195px] left-1/2 -translate-x-1/2 text-[0.75rem] text-stone-500 font-sans tracking-wide pointer-events-none whitespace-nowrap drop-shadow-sm font-semibold opacity-80">
                        [辖 {node.children.length} {node.title.endsWith('省') ? '部' : '司'}]
                    </div>
                )}
            </div>

            {
                hasChildren && (
                    <ul
                        className={`transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${childrenVisible ? 'opacity-100' : 'opacity-0 invisible pointer-events-none'}`}
                        style={!childrenVisible
                            ? { maxHeight: 0, paddingTop: 0, margin: 0, display: 'none' } // DOM removal per SPEC
                            : { maxHeight: '2000px' }
                        }
                    >
                        {node.children.map((child, idx) => (
                            <NodeCard
                                key={child.id}
                                node={child}
                                onReadMore={onReadMore}
                                selectedNodeId={selectedNodeId}
                                isRoot={false}
                                index={idx}
                                expandedIds={expandedIds}
                                onToggleNode={onToggleNode}
                            />
                        ))}
                    </ul>
                )
            }
        </li >
    );
}

export default NodeCard;
