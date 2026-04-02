import React, { useEffect, useMemo, useRef, useState } from 'react';

function GlobalSearch({ dynasties, onSelectResult, isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const normalizeForSearch = (value) => (value || '').toLowerCase().replace(/\s+/g, '');

  const flattenedNodes = useMemo(() => {
    const rows = [];

    const walk = (node, dynasty) => {
      if (!node) return;
      rows.push({
        dynastyId: dynasty.id,
        dynastyName: dynasty.name,
        node
      });

      if (Array.isArray(node.children)) {
        node.children.forEach(child => walk(child, dynasty));
      }
    };

    dynasties.forEach(dynasty => walk(dynasty.structure, dynasty));
    return rows;
  }, [dynasties]);

  const normalized = normalizeForSearch(query);

  const results = useMemo(() => {
    if (!normalized) return [];

    return flattenedNodes
      .filter(({ node }) => {
        const title = node.title || '';
        const figures = Array.isArray(node.figures) ? node.figures.join(' ') : '';
        const allusions = Array.isArray(node.allusions)
          ? node.allusions.map(item => item?.title || '').join(' ')
          : '';
        const haystack = normalizeForSearch(`${title} ${figures} ${allusions}`);
        return haystack.includes(normalized);
      })
      .slice(0, 25);
  }, [flattenedNodes, normalized]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 120);

    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <>
      <div
        className={`global-search-scrim ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside
        data-search-drawer="true"
        className={`global-search-panel p-4 ${isOpen ? 'is-active' : ''}`}
        aria-hidden={!isOpen}
      >
        <div className="mb-3">
          <div className="text-xs tracking-widest text-[#6c6357]">全局检索</div>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索官职 / 人物 / 典故"
          className="w-full rounded-md border border-[#c8bca8] bg-[#fffaf1] px-3 py-2 text-sm text-[#2a2624] outline-none transition focus:border-[#8a2d2f]"
        />

        <div className="mt-3 max-h-[calc(100dvh-110px)] overflow-y-auto pr-1">
          {!normalized && (
            <div className="px-1 py-2 text-xs text-[#8f8577]">输入关键词后显示结果</div>
          )}

          {normalized && results.length === 0 && (
            <div className="px-1 py-2 text-xs text-[#8f8577]">未找到匹配项</div>
          )}

          {results.map(({ dynastyId, dynastyName, node }) => (
            <button
              key={`${dynastyId}-${node.id}`}
              type="button"
              onClick={() => onSelectResult({ dynastyId, node })}
              className="mb-1 w-full rounded-md border border-transparent px-3 py-2 text-left transition hover:border-[#d9cdb7] hover:bg-[#fffaf1]"
            >
              <div className="text-sm text-[#2a2624]">{node.title}</div>
              <div className="mt-1 text-xs text-[#7f7568]">{dynastyName}</div>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}

export default GlobalSearch;
