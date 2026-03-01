import React, { useState } from 'react';

function DetailPanel({ node, onClose }) {
    const [isHoveringText, setIsHoveringText] = useState(false);

    if (!node) return null;

    // We can extract an image source from allusions or fallback to a default thematic image
    const illustrationImage = node.panelImage || (node.allusions && node.allusions.length > 0 && node.allusions[0].loreImage)
        ? (node.panelImage || node.allusions[0].loreImage)
        : '/assets/content/horse_rider.png';

    return (
        <div className={`detail-panel-container absolute right-[8%] top-16 w-[340px] bg-[#f5f3ee] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[100] transition-all duration-400 ease-out border-2 border-white overflow-hidden flex flex-col ${node ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-5 pointer-events-none'}`}>

            {/* Top Section: Title & Badge */}
            <div className="pt-6 pb-4 pr-10 pl-6 relative flex flex-col items-start bg-gradient-to-b from-[#f5f3ee] to-transparent">
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-ink transition-colors cursor-pointer bg-transparent border-none">
                    <i className="fas fa-times text-lg"></i>
                </button>

                <h2 className="font-serif text-[2.2rem] text-[#111] font-black tracking-widest mb-1.5">
                    {node.title}
                </h2>
                {node.englishTitle && (
                    <div className="font-sans text-[0.65rem] text-gray-400 font-bold uppercase tracking-[0.15em] mb-3 ml-1">
                        {node.englishTitle}
                    </div>
                )}

                {/* Traditional Plaque Badge */}
                <div
                    className="inline-flex items-center bg-gradient-to-r from-[#8b1c1c] text-white px-5 py-[0.25rem] relative"
                    style={{
                        backgroundColor: '#a62b2b',
                        clipPath: 'polygon(10% 0, 90% 0, 100% 25%, 100% 75%, 90% 100%, 10% 100%, 0 75%, 0 25%)',
                        boxShadow: 'inset 0 0 4px rgba(0,0,0,0.3)'
                    }}
                >
                    <span className="text-[0.4rem] mr-2 opacity-90 pt-[1px] font-bold">◆</span>
                    <span className="font-serif text-[0.85rem] tracking-[0.2em] font-bold z-10">{node.level || '未知'}</span>
                    <span className="text-[0.4rem] ml-1 opacity-90 pt-[1px] font-bold">◆</span>
                </div>
            </div>

            {/* Divider shadow: soft centered line, vertically shorter middle shadow */}
            <div className="w-full relative flex flex-col items-center mt-2">
                <div className="w-[90%] h-[1px] bg-[#f0eee6]"></div>
                <div className="w-[85%] h-2.5 bg-transparent" style={{ background: 'radial-gradient(75% 100% at 50% 0%, rgba(139, 115, 85, 0.1) 0%, rgba(139, 115, 85, 0) 100%)' }}></div>
            </div>

            {/* Middle Section: Text Content (Vertical Writing Layout) */}
            <div
                className="px-8 py-5 h-[270px] flex justify-end"
                onMouseEnter={() => setIsHoveringText(true)}
                onMouseLeave={() => setIsHoveringText(false)}
            >
                <div
                    className={`font-serif text-[1.05rem] text-[#444] leading-[1.8] tracking-normal overflow-x-auto overflow-y-hidden whitespace-pre-wrap custom-scrollbar pr-2 pb-2 ${isHoveringText ? 'show-scrollbar' : ''}`}
                    style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'upright',
                        maxHeight: '100%',
                    }}
                >
                    {node.description || '职能描述载入中...'}
                </div>
            </div>

            {/* Bottom Section: Illustration */}
            <div className="relative w-full h-[280px] bg-transparent flex items-end justify-center rounded-b-xl overflow-hidden mt-auto">

                <img
                    src={illustrationImage}
                    alt="历史人物图"
                    className="w-[90%] h-[92%] object-contain mix-blend-multiply opacity-95 object-bottom"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
                {/* Placeholder shown if image fails/missing */}
                <div className="hidden w-[80%] h-[80%] mb-4 border-2 border-dashed border-[#ddd8cd] rounded-lg items-center justify-center text-[#999] font-serif text-sm bg-[#f2edd8] shadow-inner font-medium tracking-widest">
                    <i className="fas fa-image mr-2 text-xl mb-2"></i><br />历史插图缺失
                </div>
            </div>

        </div>
    );
}

export default DetailPanel;
