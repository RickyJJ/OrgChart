import React, { useMemo, useState } from 'react';
import { Search, MapPin, BookOpen, User } from 'lucide-react';

function LoreCenter({ dynasties, onSelectResult }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Recursive function to extract all allusions and figures from the nested tree structure
    const allLore = useMemo(() => {
        const items = [];

        const extract = (node, dynasty) => {
            if (!node) return;

            // Extract Allusions
            if (Array.isArray(node.allusions)) {
                node.allusions.forEach(allusion => {
                    items.push({
                        type: 'allusion',
                        title: allusion.title,
                        text: allusion.text,
                        dynastyId: dynasty.id,
                        dynastyName: dynasty.name,
                        nodeId: node.id,
                        nodeTitle: node.title,
                        image: allusion.loreImage || node.panelImage || '/assets/content/horse_rider.png'
                    });
                });
            }

            // Extract Figures if no allusions but figures exist (optional, for variety)
            // Or just combine items. For now, let's focus on allusions as "Pearls"

            if (Array.isArray(node.children)) {
                node.children.forEach(child => extract(child, dynasty));
            }
        };

        dynasties.forEach(dynasty => extract(dynasty.structure, dynasty));
        return items;
    }, [dynasties]);

    const filteredLore = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return allLore;
        return allLore.filter(item =>
            item.title.toLowerCase().includes(term) ||
            item.text.toLowerCase().includes(term) ||
            item.nodeTitle.toLowerCase().includes(term) ||
            item.dynastyName.toLowerCase().includes(term)
        );
    }, [allLore, searchTerm]);

    return (
        <div className="flex-1 w-full h-full flex flex-col p-6 overflow-hidden">
            {/* Header with Search */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="font-serif text-3xl font-bold text-[#1a1a1a] tracking-widest flex items-center gap-3">
                        <BookOpen className="text-vermilion" size={28} />
                        典故连珠
                    </h2>
                    <p className="font-sans text-sm text-gray-500 mt-1 tracking-wider uppercase">LORE PEARLS & HISTORICAL ECHOES</p>
                </div>

                <div className="relative group w-full md:w-80">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-vermilion transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="搜索典故、官职或朝代..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-[#d3ccbf] rounded-full font-sans text-sm outline-none focus:border-vermilion focus:ring-1 focus:ring-vermilion/20 transition-all placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {filteredLore.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                        {filteredLore.map((item, index) => (
                            <div
                                key={`${item.nodeId}-${index}`}
                                className="group relative bg-[#fffcf5] border border-[#e8dfcf] rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1"
                            >
                                {/* Visual Header */}
                                <div className="h-32 relative overflow-hidden bg-[#f0ede4]">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 p-4"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#fffcf5] via-transparent to-transparent opacity-60"></div>
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <span className="px-2 py-0.5 bg-vermilion/10 text-vermilion text-[10px] font-bold rounded border border-vermilion/20 uppercase tracking-tighter">
                                            {item.dynastyName}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-serif text-xl font-bold text-[#2a2624] leading-tight">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <p className="font-sans text-sm text-[#5a544d] leading-relaxed line-clamp-4 flex-1">
                                        {item.text}
                                    </p>

                                    <div className="mt-5 pt-4 border-t border-[#f0ede4] flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-[#8a8276]">
                                            <MapPin size={12} />
                                            <span className="text-xs font-medium">{item.nodeTitle}</span>
                                        </div>

                                        <button
                                            onClick={() => onSelectResult({ dynastyId: item.dynastyId, node: { id: item.nodeId } })}
                                            className="flex items-center gap-1.5 text-xs font-bold text-vermilion hover:gap-2 transition-all group/btn"
                                        >
                                            点击穿透
                                            <div className="w-1.5 h-1.5 rounded-full bg-vermilion ink-pulse"></div>
                                        </button>
                                    </div>
                                </div>

                                {/* Decorative Seal Corner */}
                                <div className="absolute top-0 right-0 w-8 h-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-vermilion"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 mb-4 opacity-20">
                            <BookOpen size={64} />
                        </div>
                        <p className="font-serif italic">墨迹未及，寻而无方</p>
                        <p className="text-xs mt-2 font-sans opacity-60">尝试其他关键词</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoreCenter;
