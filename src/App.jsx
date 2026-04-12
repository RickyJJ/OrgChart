import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { fetchAllDynastiesData } from './api/localData';
import { getOrCreateUUID } from './utils/tracker';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import { useMobile } from './hooks/useMobile';
import { useBodyScrollLock } from './hooks/useBodyScrollLock';
import HierarchyTree from './components/HierarchyTree';
import DetailPanel from './components/DetailPanel';
import SimulationDashboard from './components/SimulationDashboard';
import ImperialWorkshop from './components/ImperialWorkshop';
import GlobalSearch from './components/GlobalSearch';
import ErrorBoundary, { MaintenanceUI } from './components/ErrorBoundary';
import { getPath } from './utils/treeUtils';
import Breadcrumbs from './components/Breadcrumbs';
import { processAlphaMask } from './utils/imageProcessor';
import { Loader2 } from 'lucide-react';

function App() {
  const treeRef = useRef(null);
  
  // 阶段一：全局初始化匿名 UUID 追踪
  useEffect(() => {
    const uuid = getOrCreateUUID();
    console.log('[青云志] 匿名追踪 UUID:', uuid);
  }, []);

  const [activeTab, setActiveTab] = useState('hierarchy');
  const [dynastyData, setDynastyData] = useState([]);
  const [breadcrumbPath, setBreadcrumbPath] = useState([]);
  const isMobile = useMobile();
  const [isBreadcrumbExpanded, setIsBreadcrumbExpanded] = useState(!isMobile);
  
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [activeDynastyId, setActiveDynastyId] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [pendingSearchTarget, setPendingSearchTarget] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [simulationParams, setSimulationParams] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // Sync breadcrumb state with mobile changes
  useEffect(() => {
    setIsBreadcrumbExpanded(!isMobile);
  }, [isMobile]);

  // 图像公关处理：程序化抠除移动端 Logo 的背景色，使其完美融合宣纸
  const [processedLogo, setProcessedLogo] = useState(null);
  useEffect(() => {
    processAlphaMask('/assets/ui/qyz_logo_mobile.png')
      .then(setProcessedLogo)
      .catch(() => setProcessedLogo('/assets/ui/qyz_logo_mobile.png'));
  }, []);

  // Removed overlay body scroll lock as simulation and workshop are now full page tabs.

  const activeDynasty = dynastyData.length > 0 ? (dynastyData.find(d => d.id === activeDynastyId) || dynastyData[0]) : null;

  // Track path updates when either selection or expansion focus changes
  useEffect(() => {
    if (activeDynasty && (selectedNode || focusedNodeId)) {
      const targetId = selectedNode?.id || focusedNodeId;
      const path = getPath(activeDynasty.structure, targetId);
      if (path) {
        setBreadcrumbPath(path);
        // Auto-expand breadcrumb when it changes to show context
        if (selectedNode) {
          setIsBreadcrumbExpanded(true);
        }
      }
    }
  }, [selectedNode, focusedNodeId, activeDynasty]);

  // Reset breadcrumb to root ONLY when dynasty changes
  useEffect(() => {
    if (activeDynasty) {
       setBreadcrumbPath([activeDynasty.structure]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDynastyId]);

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
    setFocusedNodeId(node.id);
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
    setFocusedNodeId(targetNode.id);
    
    // Ensure the tree expands to show this node
    if (treeRef.current && targetNode) {
      const path = getPath(activeDynasty.structure, targetNode.id);
      if (path) {
        treeRef.current.setExpandedPath(path.map(n => n.id));
      }
      treeRef.current.panToNode(targetNode.id, true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!selectedNode) return;
      const isCardClick = event.target.closest('[data-card="true"]');
      const isPanelClick = event.target.closest('.detail-panel-container');
      if (!isCardClick && !isPanelClick) {
        closeDetail();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedNode]);

  useEffect(() => {
    setSelectedNode(null);
    setFocusedNodeId(null);
  }, [activeDynastyId]);

  useEffect(() => {
    if (!pendingSearchTarget) return;
    if (pendingSearchTarget.dynastyId !== activeDynastyId) return;
    setSelectedNode(pendingSearchTarget.node);
    
    // Auto-expand path for search result
    if (treeRef.current && pendingSearchTarget.node) {
       const path = getPath(activeDynasty.structure, pendingSearchTarget.node.id);
       if (path) {
         treeRef.current.setExpandedPath(path.map(n => n.id));
       }
       treeRef.current.panToNode(pendingSearchTarget.node.id, true);
    }
    
    setPendingSearchTarget(null);
  }, [activeDynastyId, pendingSearchTarget, activeDynasty]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
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

  const handleBreadcrumbNavigate = (node) => {
    // Navigate via breadcrumb updates focus trail
    setFocusedNodeId(node.id);
    if (treeRef.current) {
        const path = getPath(activeDynasty.structure, node.id);
        if (path) {
            setBreadcrumbPath(path);
            treeRef.current.setExpandedPath(path.map(n => n.id));
        }
        treeRef.current.panToNode(node.id, true);
    }
  };

  const dynastyPrefix = activeDynasty?.name?.replace('朝', '') || '';

  return (
    <div className="flex bg-main-bg min-h-[100dvh] w-full relative pb-16 md:pb-0" style={{ zIndex: 'var(--z-base-canvas)' }}>
      <Sidebar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        isSearchOpen={isSearchOpen}
        onToggleSearch={() => setIsSearchOpen(prev => !prev)}
      />

      <MobileNav
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onToggleSearch={() => setIsSearchOpen(prev => !prev)}
      />

      <main
        className={`flex-1 flex flex-col relative bg-transparent md:border-l border-[#d3ccbf] ${activeTab === 'simulation' ? 'p-0 bg-rushi-bg bg-cover bg-center bg-no-repeat bg-fixed' : 'p-2 md:p-10 shadow-inner'}`}
        style={{
          marginLeft: 'var(--sidebar-width)',
          minHeight: '0', // Allow flex-1 to govern height correctly without forcing overflow behind nav bar
        }}
      >
        <ErrorBoundary>
          {fetchError && dynastyData.length === 0 ? (
            <MaintenanceUI isFullScreen={false} />
          ) : (
            <>
              {activeTab === 'hierarchy' && (
                <div
                  className={`bg-board-soft scroll-unroll-anim relative transition-all duration-500 overflow-visible flex-1 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col min-h-0 outline-none ring-0
                    ${isMobile && selectedNode ? 'blur-[2px] brightness-90 scale-[0.98] pointer-events-none' : ''}
                  `}
                >
                  {/* High-Fidelity Board Frame Overlay (Nine-Patch) */}
                  <div className="premium-board-frame" />

                  {isDataLoading && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-board-soft">
                      <Loader2 className="w-10 h-10 animate-spin text-[#8b6b4e] mb-4" />
                      <span className="font-xingkai text-2xl text-[#5c4b3c] tracking-widest">正在展开史卷...</span>
                    </div>
                  )}

                  {activeDynasty && (
                    <>
                      {/* Integrated Header: Title + Breadcrumbs */}
                      <div className="absolute top-4 left-4 md:top-12 md:left-12 flex flex-col items-start gap-1 z-30 pointer-events-none">
                        <div className="flex items-center gap-3">
                          <img 
                            src={processedLogo || '/assets/ui/qyz_logo_mobile.png'} 
                            className="w-[80px] h-auto object-contain md:hidden pointer-events-auto mix-blend-multiply opacity-90 contrast-[1.1]" 
                            alt="青云志" 
                          />
                          <div className="font-ancient font-bold text-2xl md:text-[3rem] text-[#1A2530] tracking-widest drop-shadow-sm md:leading-[1.2] pointer-events-auto select-none">
                            {activeDynasty.name}官制架构图
                          </div>
                        </div>
                        
                        {/* Restored Dynasty Switcher Buttons - Only Ink Ring Material */}
                        <div className="mt-2 flex gap-4 pointer-events-auto">
                          {dynastyData.map((dynasty) => {
                            const isSelected = activeDynastyId === dynasty.id;
                            return (
                              <button
                                key={dynasty.id}
                                onClick={() => setActiveDynastyId(dynasty.id)}
                                className={`relative group flex items-center justify-center w-[68px] h-[68px] transition-all duration-500
                                  ${isSelected ? 'scale-110' : 'hover:scale-105 opacity-60 hover:opacity-100'}
                                `}
                              >
                                {isSelected && (
                                  <img
                                    src="/assets/ui/switch-bg-1.png"
                                    className="absolute inset-0 w-full h-full object-contain ink-draw-anim pointer-events-none"
                                    alt="selected ring"
                                  />
                                )}
                                <span className={`font-ancient text-[24px] z-10 transition-colors duration-300 ${isSelected ? 'text-[#af292e] font-bold' : 'text-[#8b6b4e]'}`}>
                                  {dynasty.name.replace('朝', '')}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="absolute inset-[16px] md:inset-[32px] overflow-hidden pointer-events-none sticky-container flex flex-col transition-all duration-300 mix-blend-multiply" style={{ zIndex: 'var(--z-tree)' }}>
                        <div className="w-full h-full pointer-events-auto flex flex-col">
                          <HierarchyTree
                            ref={treeRef}
                            activeDynasty={activeDynasty}
                            onReadMore={handleReadMore}
                            onFocusNode={setFocusedNodeId}
                            selectedNodeId={selectedNode?.id}
                            searchTargetTrigger={pendingSearchTarget}
                          />
                        </div>
                      </div>

                      {/* Breadcrumb Navigation - Precisely offset for border clearance */}
                      <div className={`absolute bottom-[12px] left-[12px] md:bottom-[20px] md:left-[20px] z-[100] transition-all duration-500 ${isMobile && activeTab !== 'hierarchy' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <div className="pointer-events-auto">
                          <Breadcrumbs 
                            path={breadcrumbPath}
                            isExpanded={isBreadcrumbExpanded}
                            onToggle={() => setIsBreadcrumbExpanded(!isBreadcrumbExpanded)}
                            onNavigate={handleBreadcrumbNavigate}
                          />
                        </div>
                      </div>
                    </>
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
                <div className="flex-1 w-full h-full overflow-hidden rounded-lg bg-[#0B111A]">
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

        <footer className="w-full shrink-0 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 text-center text-[10px] md:text-sm text-text-muted mt-2 md:mt-4 tracking-widest pb-1 z-10 relative">
          <span>青云志 | 弘扬中华古代文化 | Web PM 精心呈现</span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-1 md:mt-0">
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-[#af292e] transition-colors">
              蜀ICP备2026015654号-1
            </a>
            <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51011502001131" target="_blank" rel="noopener noreferrer" className="hover:text-[#af292e] transition-colors">
              川公网安备51011502001131号
            </a>
          </div>
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
