import React, { useState, useEffect } from 'react';
import './index.css';
import { dynastyData as localDynastyData } from './data';
import { fetchAllDynastiesData } from './api/directus';
import { getOrCreateUUID } from './utils/tracker';
import Sidebar from './components/Sidebar';
import HierarchyTree from './components/HierarchyTree';
import DetailPanel from './components/DetailPanel';
import SimulationDashboard from './components/SimulationDashboard';
import ImperialWorkshop from './components/ImperialWorkshop';
import GlobalSearch from './components/GlobalSearch';

function App() {
  // 阶段一：全局初始化匿名 UUID 追踪
  useEffect(() => {
    const uuid = getOrCreateUUID();
    console.log('[青云志] 匿名追踪 UUID:', uuid);
  }, []);
  const [activeTab, setActiveTab] = useState('hierarchy');
  const [dynastyData, setDynastyData] = useState(localDynastyData);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [activeDynastyId, setActiveDynastyId] = useState(localDynastyData[0].id);
  const [selectedNode, setSelectedNode] = useState(null);
  const [pendingSearchTarget, setPendingSearchTarget] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [simulationParams, setSimulationParams] = useState(null);
  const activeDynasty = dynastyData.find(d => d.id === activeDynastyId) || dynastyData[0];

  // 从 Directus API 拉取最新数据
  useEffect(() => {
    setIsDataLoading(true);
    fetchAllDynastiesData()
      .then((data) => {
        if (data && data.length > 0) {
          setDynastyData(data);
          // 如果当前选中朝代在新数据里存在，保持选中；否则切换到第一个
          if (!data.find(d => d.id === activeDynastyId)) {
            setActiveDynastyId(data[0].id);
          }
        }
      })
      .catch((err) => {
        console.warn('Directus API 不可用，降级使用本地 data.js:', err.message);
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

  return (
    <div className="flex min-h-screen w-full relative" style={{ zIndex: 'var(--z-base-canvas)' }}>
      <Sidebar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        isSearchOpen={isSearchOpen}
        onToggleSearch={() => setIsSearchOpen(prev => !prev)}
      />

      <main className="flex-1 p-10 flex flex-col relative bg-transparent shadow-inner border-l border-[#d3ccbf]" style={{ marginLeft: 'var(--sidebar-width)' }}>
        {activeTab === 'hierarchy' && (
          <div className="bg-board scroll-unroll-anim flex-1 relative shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden rounded-xl">
            {/* Inner decorative border overlay */}
            <div
              className="absolute inset-2 pointer-events-none z-20"
              style={{
                border: '28px solid transparent',
                borderImage: 'url(/assets/ui/bg-border.png) 90 repeat'
              }}
            ></div>

            <div className="absolute top-12 left-12 flex flex-col items-start gap-4 z-30 pointer-events-none">
              <div className="font-ancient font-bold text-[3rem] text-[#1A2530] tracking-widest drop-shadow-sm leading-[1.2] pointer-events-auto select-none">
                {activeDynasty.name}官制架构图
              </div>
              <div className="flex flex-col gap-3 ml-2 mt-2 pointer-events-auto">
                {dynastyData.map(d => (
                  <button
                    key={d.id}
                    className={`relative border-none font-xingkai text-[1.4rem] cursor-pointer w-14 h-14 flex items-center justify-center transition-colors duration-200 rounded-full ${activeDynastyId === d.id
                      ? 'text-[#2a1f14] drop-shadow-sm'
                      : 'text-[#2a1f14]/70 hover:text-[#2a1f14] bg-transparent'
                      }`}
                    onClick={() => setActiveDynastyId(d.id)}
                  >
                    <div
                      className={`absolute inset-0 bg-dynasty-bg bg-[length:100%] bg-center bg-no-repeat ${activeDynastyId === d.id ? 'ink-draw-anim' : 'ink-fade-out-anim'}`}
                    ></div>
                    <span className={`relative z-10 select-none transition-transform duration-200 ease-out ${activeDynastyId === d.id ? 'translate-y-[2px]' : ''}`}>
                      {d.name.replace('朝', '')}
                    </span>
                  </button>
                ))}
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
