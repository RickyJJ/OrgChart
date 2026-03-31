import React, { useState, useEffect } from 'react';
import './index.css';
import { fetchAllDynastiesData } from './api/localData';
import { getOrCreateUUID } from './utils/tracker';
import Sidebar from './components/Sidebar';
import HierarchyTree from './components/HierarchyTree';
import DetailPanel from './components/DetailPanel';
import SimulationDashboard from './components/SimulationDashboard';
import ImperialWorkshop from './components/ImperialWorkshop';
import GlobalSearch from './components/GlobalSearch';
import ErrorBoundary, { MaintenanceUI } from './components/ErrorBoundary';
import { Loader2 } from 'lucide-react';

function App() {
  // 阶段一：全局初始化匿名 UUID 追踪
  useEffect(() => {
    const uuid = getOrCreateUUID();
    console.log('[青云志] 匿名追踪 UUID:', uuid);
  }, []);
  const [activeTab, setActiveTab] = useState('hierarchy');
  const [dynastyData, setDynastyData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [activeDynastyId, setActiveDynastyId] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [pendingSearchTarget, setPendingSearchTarget] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [simulationParams, setSimulationParams] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  
  const activeDynasty = dynastyData.length > 0 ? (dynastyData.find(d => d.id === activeDynastyId) || dynastyData[0]) : null;

  // 从 Directus API 拉取最新数据
  useEffect(() => {
    setIsDataLoading(true);
    setFetchError(null);
    fetchAllDynastiesData()
      .then((data) => {
        if (data && data.length > 0) {
          // 只保留唐代数据
          const tangData = data.filter(d => d.id === 'tang' || d.name.includes('唐'));
          if (tangData.length > 0) {
            setDynastyData(tangData);
            setActiveDynastyId(tangData[0].id);
          } else {
            // 如果没搜到特定的ID，尝试拿第一个(兜底)
            setDynastyData([data[0]]);
            setActiveDynastyId(data[0].id);
          }
        } else {
          throw new Error('史卷空空如也，未能窥探天机。');
        }
      })
      .catch((err) => {
        console.error('史经载入失败:', err.message);
        setFetchError(err);
      })
      .finally(() => setIsDataLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReadMore = (node) => {
    setSelectedNode(prev => (prev?.id === node.id ? null : node));
  };

  const closeDetail = () => {
    setSelectedNode(null);
  };

  const handleNavigate = (tab) => {
    setIsSearchOpen(false);
    setActiveTab(tab);
    if (tab !== 'simulation') {
      setSimulationParams(null);
    }
  };

  const handleTakeOffice = (node) => {
    setSimulationParams({ node });
    setActiveTab('simulation');
    setSelectedNode(null);
  };

  const handleSearchSelect = ({ dynastyId, node }) => {
    setActiveTab('hierarchy');

    // If we only have an ID (from LoreCenter), we need to find the full node reference
    let targetNode = node;
    if (!node.title) {
      const dynasty = dynastyData.find(d => d.id === dynastyId);
      const findNode = (n) => {
        if (n.id === node.id) return n;
        if (n.children) {
          for (const child of n.children) {
            const result = findNode(child);
            if (result) return result;
          }
        }
        return null;
      };
      targetNode = findNode(dynasty.structure);
    }

    if (dynastyId !== activeDynastyId) {
      setPendingSearchTarget({ dynastyId, node: targetNode });
      setActiveDynastyId(dynastyId);
      return;
    }

    setSelectedNode(targetNode);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      // If no node is selected, no need to check
      if (!selectedNode) return;

      // Check if click is on a card or the detail panel
      const isCardClick = event.target.closest('[data-card="true"]');
      const isPanelClick = event.target.closest('.detail-panel-container'); // Need to ensure DetailPanel has this class or similar

      if (!isCardClick && !isPanelClick) {
        closeDetail();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedNode]);

  React.useEffect(() => {
    setSelectedNode(null);
  }, [activeDynastyId]);

  React.useEffect(() => {
    if (!pendingSearchTarget) return;
    if (pendingSearchTarget.dynastyId !== activeDynastyId) return;

    setSelectedNode(pendingSearchTarget.node);
    setPendingSearchTarget(null);
  }, [activeDynastyId, pendingSearchTarget]);

  React.useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  React.useEffect(() => {
    if (!isSearchOpen) return;

    const handleSearchBlurClose = (event) => {
      const isDrawerClick = event.target.closest('[data-search-drawer="true"]');
      const isToggleClick = event.target.closest('[data-search-toggle="true"]');

      if (isDrawerClick || isToggleClick) return;
      setIsSearchOpen(false);
    };

    document.addEventListener('mousedown', handleSearchBlurClose);
    return () => document.removeEventListener('mousedown', handleSearchBlurClose);
  }, [isSearchOpen]);

  // Removed full-screen error interceptor to ensure Sidebar is always visible according to user feedback

  return (
    <div className="flex min-h-screen w-full relative" style={{ zIndex: 'var(--z-base-canvas)' }}>
      <Sidebar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        isSearchOpen={isSearchOpen}
        onToggleSearch={() => setIsSearchOpen(prev => !prev)}
      />

      <main
        className={`flex-1 flex flex-col relative bg-transparent shadow-inner border-l border-[#d3ccbf] ${activeTab === 'simulation' ? 'p-0 bg-[#f5f5dc]' : 'p-10'}`}
        style={{ 
          marginLeft: 'var(--sidebar-width)',
          ...(activeTab === 'simulation' ? {
            backgroundImage: "url('https://www.transparenttextures.com/patterns/handmade-paper.png')",
            backgroundBlendMode: 'multiply'
          } : {})
        }}
      >
        <ErrorBoundary>
          {/* 如果是点击进入某个 Tab 但数据载入失败，则只加载局部报错页面（侧边栏保留） */}
          {fetchError && dynastyData.length === 0 ? (
            <MaintenanceUI isFullScreen={false} />
          ) : (
            <>
              {activeTab === 'hierarchy' && (
                <div className="bg-board scroll-unroll-anim flex-1 relative shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden rounded-xl">
                  {isDataLoading && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-board/90 backdrop-blur-sm">
                      <Loader2 className="w-10 h-10 animate-spin text-[#8b6b4e] mb-4" />
                      <span className="font-xingkai text-2xl text-[#5c4b3c] tracking-widest">正在展开史卷...</span>
                    </div>
                  )}

                  {activeDynasty && (
                    <>
                      <div className="absolute top-12 left-12 flex flex-col items-start gap-4 z-30 pointer-events-none">
                        <div className="font-ancient font-bold text-[3rem] text-[#1A2530] tracking-widest drop-shadow-sm leading-[1.2] pointer-events-auto select-none">
                          {activeDynasty.name}官制架构图
                        </div>
                      </div>

                      {/* Clipping container for the tree */}
                      <div className="absolute inset-[13px] overflow-hidden pointer-events-none sticky-container flex flex-col transition-all duration-300 mix-blend-multiply" style={{ zIndex: 'var(--z-tree)' }}>
                        <div className="w-full h-full pointer-events-auto flex flex-col">
                          <HierarchyTree
                            activeDynasty={activeDynasty}
                            onReadMore={handleReadMore}
                            selectedNodeId={selectedNode?.id}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Partial Fetch Error inside Hierarchy area if some data exists but update failed */}
                  {!isDataLoading && fetchError && (
                    <div className="absolute inset-x-8 bottom-8 z-40">
                      <div className="bg-[#af292e]/10 border border-[#af292e]/20 p-4 rounded-lg flex items-center justify-between backdrop-blur-md">
                        <span className="text-[#af292e] font-serif">通讯有碍，史卷未能更新 (Network Error)</span>
                        <button 
                          onClick={() => window.location.reload()}
                          className="text-xs px-4 py-1.5 bg-[#af292e] text-white rounded-md hover:bg-[#912226] transition-colors"
                        >
                          重新同步
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'simulation' && (
                <div className="flex-1 w-full h-full">
                  <SimulationDashboard
                    onNavigateToWorkshop={() => handleNavigate('workshop')}
                    initialParams={simulationParams}
                    onClearParams={() => setSimulationParams(null)}
                  />
                </div>
              )}

              {activeTab === 'workshop' && (
                <div className="flex-1 w-full h-full">
                  <ImperialWorkshop />
                </div>
              )}

              {activeTab === 'status' && (
                <div className="flex-1 w-full rounded-xl border border-[#d3ccbf] bg-board p-8 flex items-center justify-center text-[#2a2624]">
                  我的官职模块开发中
                </div>
              )}
            </>
          )}
        </ErrorBoundary>

        <footer className="text-center text-xs text-text-muted mt-4 tracking-widest">
          青云志 | 弘扬中华古代文化 | Web PM 精心呈现
        </footer>
      </main>

      <DetailPanel
        key={selectedNode?.id || 'detail-panel-empty'}
        node={activeTab === 'hierarchy' ? selectedNode : null}
        onClose={closeDetail}
        onTakeOffice={handleTakeOffice}
      />

      <GlobalSearch
        dynasties={dynastyData}
        onSelectResult={handleSearchSelect}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}

export default App;
