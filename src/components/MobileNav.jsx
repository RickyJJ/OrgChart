import React from 'react';
import { Network, PenTool, Palette, Search } from 'lucide-react';

function MobileNav({ activeTab, onNavigate, onToggleSearch }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-ink-dark text-sidebar-text flex justify-around items-center h-16 shadow-[0_-4px_20px_rgba(0,0,0,0.2)] z-[100]">
      <button
        onClick={() => onNavigate('hierarchy')}
        className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
          activeTab === 'hierarchy' ? 'text-white' : 'text-gray-400 hover:text-gray-300'
        }`}
      >
        <Network size={20} className={activeTab === 'hierarchy' ? 'text-vermilion' : ''} />
        <span className="text-[0.65rem] mt-1 font-serif tracking-widest">官阶</span>
      </button>

      <button
        onClick={() => onNavigate('simulation')}
        className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
          activeTab === 'simulation' ? 'text-white' : 'text-gray-400 hover:text-gray-300'
        }`}
      >
        <PenTool size={20} className={activeTab === 'simulation' ? 'text-vermilion' : ''} />
        <span className="text-[0.65rem] mt-1 font-serif tracking-widest">入仕</span>
      </button>

      <button
        onClick={() => onNavigate('workshop')}
        className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
          activeTab === 'workshop' ? 'text-white' : 'text-gray-400 hover:text-gray-300'
        }`}
      >
        <Palette size={20} className={activeTab === 'workshop' ? 'text-vermilion' : ''} />
        <span className="text-[0.65rem] mt-1 font-serif tracking-widest">造办处</span>
      </button>

      {/* Global Search Button */}
      <button
        onClick={onToggleSearch}
        className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-gray-300 transition-colors"
      >
        <Search size={20} />
        <span className="text-[0.65rem] mt-1 font-serif tracking-widest">检索</span>
      </button>
    </nav>
  );
}

export default MobileNav;
