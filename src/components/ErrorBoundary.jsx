import React from 'react';

export const MaintenanceUI = ({ onReload, isFullScreen = false }) => (
  <div className={
    isFullScreen
      ? "flex flex-col items-center justify-center relative overflow-hidden bg-[#f5f5dc] selection:bg-[#af292e]/20 min-h-[100dvh] w-full z-50"
      : "flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-[#f5f5dc] selection:bg-[#af292e]/20 rounded-xl h-full w-full shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
  }>
    {/* Paper Texture Overlay */}
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"

      style={{
        backgroundImage: 'url(/assets/ui/paper-texture.png)',
        backgroundRepeat: 'repeat'
      }}
    />

    {/* Ink Wash Subtle Background Decorations */}
    <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] opacity-10 rotate-12 pointer-events-none">
      <div className="w-full h-full bg-gradient-radial from-slate-900/50 to-transparent blur-3xl rounded-full" />
    </div>

    <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
      {/* Visual Icon - Aesthetic Ink Circle */}
      <div className="w-32 h-32 mb-12 relative flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-dashed border-[#1a1a1a]/20 rounded-full animate-spin-slow" />
        <div className="w-20 h-20 bg-[#af292e]/10 rounded-full flex items-center justify-center">
          <span className="text-[#af292e] text-4xl transform -rotate-12">砚</span>
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] mb-6 tracking-widest leading-tight">
        系统小憩，研磨待发
      </h1>

      <p className="text-lg md:text-xl text-slate-600 font-sans mb-12 leading-relaxed tracking-wide">
        这一笔没落稳，让我们的老夫子快马加鞭修复中。<br />
        请尝试刷新页面，或稍后再试。
      </p>

      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <button
          onClick={onReload || (() => window.location.reload())}
          className="px-8 py-3 bg-[#af292e] text-white font-serif tracking-[0.2em] shadow-lg shadow-[#af292e]/20 hover:bg-[#912226] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          重整旗鼓 (Reload)
        </button>

        <a
          href="mailto:qyz@sianstudio.cn"
          className="px-8 py-3 border border-[#1a1a1a]/20 text-[#1a1a1a]/60 font-serif tracking-[0.1em] hover:border-[#af292e]/40 hover:text-[#af292e] transition-all"
        >
          官邮求助 (Email)
        </a>
      </div>

      {/* Developer Contact Social Links */}
      <div className="mt-20 flex flex-col items-center gap-4 text-sm text-slate-400 font-sans">
        <div className="w-12 h-px bg-slate-400/20 mb-2" />
        <p>如有紧急事宜，请联系开发官邸：</p>
        <div className="flex gap-4">
          <a href="https://twitter.com/RickyJJ" target="_blank" rel="noopener noreferrer" className="hover:text-[#af292e] transition-colors">
            Twitter: @RickyJJ
          </a>
        </div>
      </div>
    </div>

    {/* Subtle Corner Decoration */}
    <div className="absolute bottom-10 left-10 opacity-20 pointer-events-none">
      <div className="text-xs font-serif text-[#1a1a1a]/40 tracking-[0.5em] writing-vertical">
        青云志开源实验室
      </div>
    </div>
  </div>
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <MaintenanceUI isFullScreen={false} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
