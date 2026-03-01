import React from 'react';
import { Network, BookOpen, PenTool, User, Search } from 'lucide-react';

function Sidebar({ activeTab, onNavigate, isSearchOpen, onToggleSearch }) {
  return (
    <aside
      className="bg-ink-dark h-screen fixed left-0 top-0 text-sidebar-text flex flex-col shadow-lg"
      style={{ width: 'var(--sidebar-width)', zIndex: 'var(--z-sidebar)' }}
    >
      <div className="py-10 text-center border-b border-white/10">
        <img src="/assets/ui/scroll_icon.png" className="w-[60px] h-[60px] object-contain mb-3 inline-block" alt="Scroll Logo" />
        <h1 className="font-serif text-[2rem] font-bold tracking-[4px] m-0 text-white">青云策</h1>
        <p className="font-sans text-[0.7rem] tracking-[2px] text-gray-300 mt-1">THE PATH TO COURT</p>
      </div>

      <nav className="py-5 flex-1 space-y-2">
        <button
          onClick={() => onNavigate('hierarchy')}
          className={`w-full text-left flex items-center px-6 py-4 transition-all duration-300 relative group cursor-pointer ${activeTab === 'hierarchy' ? 'bg-white/10 text-white border-l-4 border-vermilion' : 'text-gray-300 hover:bg-white/10 hover:text-white border-l-4 border-transparent'}`}
        >
          <div className="mr-4 flex-shrink-0"><Network size={20} /></div>
          <div className="flex flex-col">
            <span className="font-serif text-[1.1rem] tracking-[1px]">官阶巡礼</span>
            <span className="font-sans text-[0.75rem] opacity-60 mt-0.5">Hierarchy Tree</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('simulation')}
          className={`w-full text-left flex items-center px-6 py-4 transition-all duration-300 relative group cursor-pointer ${activeTab === 'simulation' ? 'bg-white/10 text-white border-l-4 border-vermilion' : 'text-gray-300 hover:bg-white/10 hover:text-white border-l-4 border-transparent'}`}
        >
          <div className="mr-4 flex-shrink-0"><PenTool size={20} /></div>
          <div className="flex flex-col">
            <span className="font-serif text-[1.1rem] tracking-[1px]">入仕模拟</span>
            <span className="font-sans text-[0.75rem] opacity-60 mt-0.5">Simulation</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('status')}
          className={`w-full text-left flex items-center px-6 py-4 transition-all duration-300 relative group cursor-pointer ${activeTab === 'status' ? 'bg-white/10 text-white border-l-4 border-vermilion' : 'text-gray-300 hover:bg-white/10 hover:text-white border-l-4 border-transparent'}`}
        >
          <div className="mr-4 flex-shrink-0"><User size={20} /></div>
          <div className="flex flex-col">
            <span className="font-serif text-[1.1rem] tracking-[1px]">我的官职</span>
            <span className="font-sans text-[0.75rem] opacity-60 mt-0.5">My Status</span>
          </div>
        </button>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          type="button"
          data-search-toggle="true"
          onClick={onToggleSearch}
          className={`w-full text-left flex items-center px-4 py-3 rounded-md transition-all duration-300 cursor-pointer ${isSearchOpen ? 'bg-white/15 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
          title="打开全局检索"
        >
          <div className="mr-3 flex-shrink-0"><Search size={18} /></div>
          <div className="flex flex-col">
            <span className="font-serif text-[1rem] tracking-[1px]">搜索</span>
            <span className="font-sans text-[0.72rem] opacity-60 mt-0.5">Global Search</span>
          </div>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
