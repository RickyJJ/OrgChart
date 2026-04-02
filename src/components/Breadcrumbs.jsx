import React, { useState, useRef, useEffect } from 'react';
import { filterBreadcrumbPath } from '../utils/treeUtils';
import { useMobile } from '../hooks/useMobile';

/**
 * Breadcrumbs (云迹) Component
 * Shows the path from the root node to the currently focused/selected node.
 */
function Breadcrumbs({ path, onNavigate }) {
    const isMobile = useMobile();
    const displayPath = filterBreadcrumbPath(path);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!path || path.length === 0) return null;

    // Check if we need to collapse based on text length AND mobile
    const totalChars = displayPath.reduce((acc, n) => acc + (n.title?.length || 0), 0);
    const shouldCollapse = isMobile && displayPath.length > 2 && totalChars > 12;

    const renderNode = (n, i, isLast) => (
        <React.Fragment key={`node-${n.id}`}>
            {i !== 0 && <span className="text-[#8b6b4e]/30 select-none text-xs font-serif px-1.5 shrink-0">/</span>}
            <span
                className={`
                    font-serif text-[13px] md:text-sm cursor-pointer transition-all px-1.5 py-1 rounded
                    leading-relaxed whitespace-nowrap breadcrumb-item
                    ${isLast 
                        ? 'text-[#1a1a1a] font-bold bg-[#af292e]/5 border-b-2 border-[#af292e]/40' 
                        : 'text-[#5c4b3c] font-medium hover:text-[#af292e] hover:bg-[#af292e]/5'}
                `}
                onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(n, i);
                    setShowDropdown(false); // close dropdown if it was used
                }}
            >
                {n.title || n.name || '未知节点'}
            </span>
        </React.Fragment>
    );

    return (
        <div className="flex flex-col items-start gap-1 pointer-events-none p-0 relative z-50">
            <div 
                className={`
                    bg-[#f5f5dc]/70 backdrop-blur-md border border-[#c4a984]/50 rounded-2xl shadow-sm
                    flex flex-wrap items-center transition-all duration-300 pointer-events-auto
                    p-2 px-4 max-w-[calc(100vw-3rem)] md:max-w-4xl
                    ${!showDropdown ? 'overflow-hidden' : ''}
                `}
            >
                {/* Breadcrumb Items - Always visible */}
                <div className="flex flex-wrap items-center animate-fade-in-right">
                    {shouldCollapse ? (
                        <>
                            <div className="relative flex items-center" ref={dropdownRef}>
                                <span 
                                    className={`
                                        font-serif text-[13px] hover:bg-[#af292e]/5 hover:text-[#af292e] cursor-pointer px-1.5 py-1 rounded transition-colors breadcrumb-item
                                        ${showDropdown ? 'text-[#af292e] bg-[#af292e]/5' : 'text-[#5c4b3c]'}
                                    `}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDropdown(!showDropdown);
                                    }}
                                >
                                    ...
                                </span>
                                
                                {showDropdown && (
                                    <div className="absolute bottom-full left-0 mb-2 min-w-[220px] bg-[#f5f5dc]/98 backdrop-blur-xl border border-[#c4a984]/50 rounded-xl shadow-2xl py-3 flex flex-col pointer-events-auto z-[100] animate-slide-up" data-drawer="true">
                                        {/* Dropdown Items */}
                                        {displayPath.map((dn, di) => (
                                            <div 
                                                key={`dropdown-${dn.id}`}
                                                className={`
                                                    px-4 py-2.5 hover:bg-[#af292e]/10 font-serif text-[13px] cursor-pointer whitespace-nowrap transition-all flex items-center justify-between gap-4 breadcrumb-item
                                                    ${di === displayPath.length - 1 ? 'text-[#af292e] font-bold bg-[#af292e]/5' : 'text-[#5c4b3c]'}
                                                `}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onNavigate(dn, di);
                                                    setShowDropdown(false);
                                                }}
                                            >
                                                <span>{dn.title}</span>
                                                {di === displayPath.length - 1 && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#af292e] shadow-sm"></span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {renderNode(displayPath[displayPath.length - 1], displayPath.length - 1, true)}
                        </>
                    ) : (
                        displayPath.map((n, i) => {
                            const isLast = i === displayPath.length - 1;
                            return renderNode(n, i, isLast);
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default Breadcrumbs;
