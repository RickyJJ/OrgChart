import React, { useState } from 'react';
import './index.css';
import { dynastyData } from './data';
import Sidebar from './components/Sidebar';
import HierarchyTree from './components/HierarchyTree';
import DetailPanel from './components/DetailPanel';
import SimulationDashboard from './components/SimulationDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('hierarchy');
  const [activeDynastyId, setActiveDynastyId] = useState(dynastyData[0].id);
  const [selectedNode, setSelectedNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});
  const activeDynasty = dynastyData.find(d => d.id === activeDynastyId);

  const handleNodeExpand = (nodeId) => {
    setExpandedNodes(prev => {
      if (prev[nodeId]) return {};
      return { [nodeId]: true };
    });
  };

  const handleReadMore = (node) => {
    setSelectedNode(node);
  };

  const closeDetail = () => {
    setSelectedNode(null);
  };

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar activeTab={activeTab} onNavigate={setActiveTab} />

      <main className="ml-64 flex-1 p-10 flex flex-col relative bg-paper shadow-inner border-l border-[#d3ccbf]">
        {activeTab === 'hierarchy' && (
          <div className="bg-board flex-1 relative shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden rounded-xl">
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
            <div className="absolute inset-[13px] overflow-hidden z-10 pointer-events-none sticky-container flex flex-col transition-all duration-300 mix-blend-multiply">
              <div className="w-full h-full pointer-events-auto flex flex-col">
                <HierarchyTree
                  activeDynasty={activeDynasty}
                  expandedNodes={expandedNodes}
                  onNodeExpand={handleNodeExpand}
                  onReadMore={handleReadMore}
                  selectedNodeId={selectedNode?.id}
                />
              </div>
            </div>

            <DetailPanel
              node={selectedNode}
              onClose={closeDetail}
            />
          </div>
        )}

        {activeTab === 'simulation' && (
          <div className="flex-1 w-full h-full">
            <SimulationDashboard />
          </div>
        )}

        <footer className="text-center text-xs text-text-muted mt-4 tracking-widest">
          青云志 | 弘扬中华古代文化 | Web PM 精心呈现
        </footer>
      </main>

      {/* Optional Overlay to dismiss detail panel when clicking outside */}
      {selectedNode && activeTab === 'hierarchy' && <div className="fixed inset-0 z-[99]" onClick={closeDetail}></div>}
    </div>
  );
}

export default App;
