import React, { useMemo, useState } from 'react';
import { PenTool, X, Coins, Users } from 'lucide-react';

import SalaryFlowBoard from './SalaryFlowBoard';
import { useMobile } from '../hooks/useMobile';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

function DetailPanel({ node, onClose, onTakeOffice }) {
  const [isLoreExpanded, setIsLoreExpanded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const hasPoetry = Array.isArray(node?.poetry) && node.poetry.length > 0;
  const hasAllusions = Array.isArray(node?.allusions) && node.allusions.length > 0;
  const hasLore = hasPoetry || hasAllusions;
  const hasFigures = Array.isArray(node?.figures) && node.figures.length > 0;
  const isMobile = useMobile();

  // 移动端锁屏
  useBodyScrollLock(!!node && isMobile);

  const loreText = useMemo(() => {
    if (hasPoetry) {
      return node.poetry.map(item => `${item.author}《${item.poem}》`).join('\n\n');
    }
    if (hasAllusions) {
      return node.allusions.map(item => `${item.title}：${item.text}`).join('\n\n');
    }
    return '';
  }, [hasPoetry, hasAllusions, node?.poetry, node?.allusions]);

  const shouldShowLoreExpand = useMemo(() => {
    if (!loreText) return false;
    const lines = loreText.split('\n').length;
    return loreText.length > 60 || lines > 3;
  }, [loreText]);

  const illustrationImage = useMemo(
    () => node?.panelImage || node?.allusions?.[0]?.loreImage || '/assets/content/horse_rider.png',
    [node]
  );

  if (!node) return null;

  const stopBubble = (event) => {
    event.stopPropagation();
  };

  return (
    <>
      {/* 移动端背景遮罩 (Scrim Backdrop) */}
      {isMobile && node && (
        <div
          className="fixed inset-0 bg-black/40 z-[45] backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
          onClick={onClose}
        />
      )}

      <aside
        className={`detail-panel-container detail-panel-paper overflow-hidden flex flex-col 
          ${isMobile
            ? 'fixed bottom-0 left-0 right-0 h-[85dvh] rounded-t-3xl detail-panel-slide-up'
            : 'fixed right-8 top-8 bottom-8 w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl border-2 border-white detail-panel-slide-in'
          }`}
        style={{ zIndex: 'var(--z-detail-card)' }}
        onMouseDown={stopBubble}
        onClick={stopBubble}
      >
        {/* 移动端拖拽把手 (Pull Handle) */}
        {isMobile && (
          <div
            className="flex justify-center pt-3 pb-1 cursor-pointer"
            onClick={onClose}
          >
            <div className="w-12 h-1.5 rounded-full bg-[#d3ccbf]/60" />
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar relative flex flex-col gap-6">
          {/* Close Button */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            className="absolute top-6 right-6 text-[#7a7467] hover:text-[#2a2624] transition-colors z-30"
            aria-label="close detail panel"
          >
            <X size={20} />
          </button>

          {/* Section 1: Header (No label) */}
          <section>
            <div className="flex items-baseline gap-4 mb-1">
              <h2 className="font-serif text-3xl text-[#1f1a17] font-bold tracking-wide">
                {node.title}
              </h2>
              <span className="font-serif text-xl text-[#4f473f]">
                {node.level}
              </span>
            </div>
            {node.englishTitle && (
              <p className="text-base italic text-[#766f62] font-serif leading-none">
                {node.englishTitle}
              </p>
            )}

            {/* Inline Salary Flow Board (New positioning) */}
            {node.salary && (Object.keys(node.salary).length > 0) && (
              <div className="mt-5 scale-95 origin-left">
                <SalaryFlowBoard salaries={node.salary} dynastyId={node.dynastyId} />
              </div>
            )}
          </section>

          {/* Section 2: Summary (No label) */}
          <section>
            <p className="font-sans text-[0.95rem] leading-7 text-[#3b3531]">
              {node.description}
            </p>
          </section>


          {/* Section 3: Illustration */}
          <section>
            <div className="ink-illustration-container w-full h-[220px] overflow-hidden flex items-center justify-center">
              {!imageFailed ? (
                <img
                  src={illustrationImage}
                  alt={node.title}
                  className="w-full h-full object-contain mix-blend-multiply"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div className="w-full h-full border border-dashed border-[#cabfae] bg-[#f7f2e8] flex flex-col items-center justify-center text-[#8a8376]">
                  <PenTool size={24} className="mb-2" />
                  <span className="text-[11px] tracking-wide italic">水墨插图载入中...</span>
                </div>
              )}
            </div>
          </section>

          {/* Section 4: Lore Pearls */}
          {hasLore && (
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#2a2624]">
                <PenTool size={18} className="text-[#5a5349]" />
                <span className="font-serif text-lg font-bold">典故连珠</span>
              </div>

              <div className="relative">
                <p
                  className={`font-serif text-[1.1rem] leading-8 text-[#2d2824] whitespace-pre-wrap ${isLoreExpanded ? '' : 'line-clamp-3'
                    }`}
                >
                  {loreText}
                  {/* Red Seal Placeholder */}
                  <span className="inline-block ml-2 w-4 h-4 rounded-sm bg-[#af292e] align-middle opacity-80" aria-hidden="true" title="历史印鉴"></span>
                </p>

                {!isLoreExpanded && shouldShowLoreExpand && (
                  <div className="lore-expand-mask absolute inset-x-0 bottom-0 h-12 pointer-events-none"></div>
                )}
              </div>

              {shouldShowLoreExpand && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsLoreExpanded(prev => !prev);
                  }}
                  className="group/more flex items-center justify-center gap-1.5 mt-1 py-1.5 w-full text-xs font-bold text-[#7e1f23] hover:text-[#af292e] bg-[#fdfaf3]/50 hover:bg-[#fdfaf3] border border-[#eee4d5]/60 hover:border-[#eee4d5] rounded-md transition-all duration-300"
                >
                  <span>{isLoreExpanded ? '收起' : '更多'}</span>
                  <div className={`w-1.5 h-1.5 rounded-full bg-[#af292e] transition-transform duration-500 ${isLoreExpanded ? 'rotate-180 scale-75' : 'animate-pulse'}`}></div>
                </button>
              )}
            </section>
          )}

          {/* Section 5: Figures */}
          {hasFigures && (
            <section className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#2a2624]">
                <Users size={16} className="text-[#5a5349]" />
                <span className="font-serif text-[1rem] font-bold">风流人物</span>
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-[0.85rem] text-[#5e574d]/80 font-sans tracking-wide">
                {node.figures.map((figure, index) => (
                  <span key={`${figure}-${index}`}>
                    {figure}
                    {index < node.figures.length - 1 ? '、' : ''}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Section 6: CTA Button (加高底部内边距以避开移动端底部导航栏遮挡) */}
        <div className={`px-8 pt-2 ${isMobile ? 'pb-[5rem]' : 'pb-8'}`}>
          <button
            type="button"
            onClick={(e) => {
              stopBubble(e);
              if (onTakeOffice) onTakeOffice(node);
            }}
            className="w-full h-12 rounded-lg bg-[#af292e] text-[#fff] font-bold tracking-[0.2em] transition-all hover:bg-[#8a2d2f] active:scale-95 shadow-md"
          >
            接旨赴任
          </button>
        </div>
      </aside>
    </>
  );
}

export default DetailPanel;
