import React, { useState, useRef, useCallback, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Scroll, Sparkles, Download, RotateCcw, ChevronRight, BookOpen } from 'lucide-react';
import { matchJob, jobDictionary } from '../data/jobMapping';
import { trackEvent } from '../api/directus';
import AppointmentPoster from './AppointmentPoster';

/**
 * SimulationDashboard - 入仕模拟器
 *
 * 核心交互流程：
 *   1. 用户在极简输入框中键入现代职业
 *   2. 点击"测算仕途"发起匹配
 *   3. 展示匹配结果卡片 + 渲染委任状海报（含盖印动效与二维码）
 *   4. 用户可"保存海报"下载为 PNG
 *   5. 海报生成后 800ms 淡入"造办处"文创推荐入口
 */

// ─── 推荐职业列表（热门标签快捷入口）──────────────────────────
const POPULAR_JOBS = [
    '程序员', '产品经理', '设计师', '老师', '律师', '医生',
    '会计', 'CEO', '记者', '学生', '军人', '公务员',
];

function SimulationDashboard({ onNavigateToWorkshop, initialParams, onClearParams }) {
    const [inputValue, setInputValue] = useState('');
    const [matchResult, setMatchResult] = useState(null);
    const [modernJob, setModernJob] = useState('');
    const [showPoster, setShowPoster] = useState(false);
    const [isMatching, setIsMatching] = useState(false);
    const [showMerchCTA, setShowMerchCTA] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const posterRef = useRef(null);
    const merchTimerRef = useRef(null);

    // 清理定时器
    useEffect(() => {
        return () => {
            if (merchTimerRef.current) clearTimeout(merchTimerRef.current);
        };
    }, []);

    /**
     * SPEC 2.7逻辑：受命直下逻辑 (Bypass Matching)
     * 当从详情面板点击"接旨赴任"跳转过来时，直接生成海报
     */
    useEffect(() => {
        if (initialParams?.node) {
            const { node } = initialParams;
            
            // 直接设置结果，跳过 matchJob
            setMatchResult({
                title: node.title,
                rank: node.level,
                desc: node.description
            });
            setModernJob("钦定入仕");
            setIsMatching(false);
            
            // 立即/微显延迟展现海报
            const posterTimer = setTimeout(() => {
                setShowPoster(true);
                
                // 触发文创导流 (同原有逻辑)
                if (merchTimerRef.current) clearTimeout(merchTimerRef.current);
                merchTimerRef.current = setTimeout(() => {
                    setShowMerchCTA(true);
                }, 800);
            }, 300);

            // 上报埋点
            trackEvent('direct_take_office', {
                ancientTitle: node.title,
                rank: node.level
            });

            return () => clearTimeout(posterTimer);
        }
    }, [initialParams, onClearParams]);

    // ─── 匹配逻辑 ────────────────────────────────────────────────
    const handleMatch = useCallback((jobInput) => {
        const value = jobInput || inputValue;
        if (!value.trim()) return;

        setIsMatching(true);
        setShowPoster(false);
        setShowMerchCTA(false);
        setModernJob(value.trim());

        // 模拟短暂"卜算"延迟，增强仪式感
        setTimeout(() => {
            const result = matchJob(value);
            setMatchResult(result);
            setIsMatching(false);

            // 延迟展开海报
            setTimeout(() => {
                setShowPoster(true);

                // 上报海报生成埋点
                trackEvent('generate_poster', {
                    modernJob: value.trim(),
                    ancientTitle: result?.title,
                });

                // SPEC 2.6：海报展示后 800ms 淡入造办处推荐
                if (merchTimerRef.current) clearTimeout(merchTimerRef.current);
                merchTimerRef.current = setTimeout(() => {
                    setShowMerchCTA(true);
                }, 800);
            }, 300);
        }, 800);
    }, [inputValue]);

    // ─── 保存海报 ────────────────────────────────────────────────
    const handleSavePoster = useCallback(async () => {
        if (!posterRef.current || isSaving) return;

        setIsSaving(true);
        try {
            const canvas = await html2canvas(posterRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                backgroundColor: '#f5f0e3',
            });

            const link = document.createElement('a');
            link.download = `青云志_委任状_${matchResult?.title || '授官'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('[海报生成失败]', err);
            alert('海报生成失败，请稍后重试');
        } finally {
            setIsSaving(false);
        }
    }, [matchResult, isSaving]);

    // ─── 重置 ─────────────────────────────────────────────────────
    const handleReset = useCallback(() => {
        setInputValue('');
        setMatchResult(null);
        setModernJob('');
        setShowPoster(false);
        setShowMerchCTA(false);
        if (onClearParams) onClearParams();
        if (merchTimerRef.current) clearTimeout(merchTimerRef.current);
    }, [onClearParams]);

    // ─── 快捷标签点击 ─────────────────────────────────────────────
    const handleQuickSelect = useCallback((job) => {
        setInputValue(job);
        handleMatch(job);
    }, [handleMatch]);

    // ─── 键盘事件 ─────────────────────────────────────────────────
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            handleMatch();
        }
    }, [handleMatch]);

    return (
        <div
            className="w-full h-full rounded-xl overflow-y-auto relative"
            style={{
                backgroundColor: '#0B111A',
                backgroundImage: `
          radial-gradient(ellipse at 20% 50%, rgba(175, 41, 46, 0.06) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(176, 141, 87, 0.05) 0%, transparent 50%)
        `,
                fontFamily: "'Inter', system-ui, sans-serif",
            }}
        >
            <div className="max-w-5xl mx-auto px-8 py-12">

                {/* ════════════════════════════════════════════════════════
            标题区域
            ════════════════════════════════════════════════════════ */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Scroll size={28} className="text-[#B08D57]" />
                        <h2
                            className="text-[#E5E0D8] tracking-[6px] text-4xl font-bold m-0"
                            style={{ fontFamily: "'Noto Serif SC', serif" }}
                        >
                            入仕模拟
                        </h2>
                        <Scroll size={28} className="text-[#B08D57] scale-x-[-1]" />
                    </div>
                    <p className="text-[#8B9BB4] text-sm tracking-wide m-0 mt-2">
                        穿越古今，测算你在大唐朝堂的官阶与职能
                    </p>
                </div>

                {/* ════════════════════════════════════════════════════════
            输入区域：极简新中式输入框
            ════════════════════════════════════════════════════════ */}
                <div className="flex flex-col items-center mb-10">
                    <div
                        className="relative w-full max-w-lg group"
                    >
                        <input
                            id="job-input"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="请输入您的现代职业，如：程序员"
                            disabled={isMatching}
                            className="
                w-full py-4 px-6 pr-36
                bg-[#151E2B]/80 backdrop-blur-md
                border border-[#2A3441]
                rounded-xl
                text-[#E5E0D8] text-lg
                placeholder-[#5A6A7F]
                focus:outline-none focus:border-[#af292e]/60 focus:shadow-[0_0_20px_rgba(175,41,46,0.15)]
                transition-all duration-300
                disabled:opacity-50
              "
                            style={{ fontFamily: "'Noto Serif SC', serif" }}
                        />
                        <button
                            id="match-btn"
                            onClick={() => handleMatch()}
                            disabled={isMatching || !inputValue.trim()}
                            className="
                absolute right-2 top-1/2 -translate-y-1/2
                px-6 py-2.5 rounded-lg
                text-white text-sm font-medium tracking-[2px]
                transition-all duration-300
                cursor-pointer
                disabled:opacity-40 disabled:cursor-not-allowed
              "
                            style={{
                                background: isMatching
                                    ? 'linear-gradient(135deg, #8B6914, #6b5d4f)'
                                    : 'linear-gradient(135deg, #af292e, #C93A3E)',
                                boxShadow: isMatching
                                    ? 'none'
                                    : '0 2px 12px rgba(175, 41, 46, 0.3)',
                            }}
                        >
                            {isMatching ? (
                                <span className="flex items-center gap-2">
                                    <Sparkles size={14} className="animate-spin" />
                                    卜算中…
                                </span>
                            ) : (
                                '测算仕途'
                            )}
                        </button>
                    </div>

                    {/* ── 热门职业快捷标签 ── */}
                    {!matchResult && (
                        <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-lg">
                            {POPULAR_JOBS.map((job) => (
                                <button
                                    key={job}
                                    onClick={() => handleQuickSelect(job)}
                                    className="
                    px-3 py-1.5 rounded-full text-xs
                    bg-[#1A2530]/80 border border-[#2A3441]/60
                    text-[#8B9BB4] hover:text-[#E5E0D8] hover:border-[#af292e]/40
                    transition-all duration-200 cursor-pointer
                  "
                                >
                                    {job}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ════════════════════════════════════════════════════════
            匹配结果区域
            ════════════════════════════════════════════════════════ */}
                {matchResult && (
                    <div
                        className="mb-12"
                        style={{
                            animation: 'resultFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                        }}
                    >
                        {/* 结果摘要卡片 */}
                        <div
                            className="
                max-w-lg mx-auto p-8 rounded-xl
                bg-[#151E2B]/80 backdrop-blur-md
                border border-[#2A3441]
                shadow-xl
              "
                        >
                            <div className="text-center">
                                <div className="text-[#8B9BB4] text-sm mb-2 tracking-wider">您的现代职业</div>
                                <div className="text-[#B08D57] text-lg mb-4 font-medium">{modernJob}</div>

                                <div
                                    className="w-12 h-[1px] mx-auto mb-4"
                                    style={{ background: 'linear-gradient(90deg, transparent, #2A3441, transparent)' }}
                                />

                                <div className="text-[#8B9BB4] text-xs mb-1 tracking-widest">对应大唐官职</div>
                                <div
                                    className="text-[#E5E0D8] text-3xl font-bold tracking-[4px] mb-2"
                                    style={{ fontFamily: "'Noto Serif SC', serif" }}
                                >
                                    {matchResult.title}
                                </div>
                                <div
                                    className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-4"
                                    style={{
                                        color: '#af292e',
                                        backgroundColor: 'rgba(175, 41, 46, 0.1)',
                                        border: '1px solid rgba(175, 41, 46, 0.2)',
                                    }}
                                >
                                    {matchResult.rank}
                                </div>

                                <p
                                    className="text-[#8B9BB4] text-sm leading-relaxed mt-4 max-w-sm mx-auto"
                                    style={{ fontFamily: "'Noto Serif SC', serif" }}
                                >
                                    「{matchResult.desc}」
                                </p>
                            </div>

                            {/* 操作按钮组 */}
                            <div className="flex items-center justify-center gap-3 mt-8">
                                <button
                                    onClick={handleReset}
                                    className="
                    flex items-center gap-2 px-5 py-2.5 rounded-lg
                    bg-[#1A2530] border border-[#2A3441]
                    text-[#8B9BB4] text-sm
                    hover:bg-[#2A3441] hover:text-[#E5E0D8]
                    transition-all duration-200 cursor-pointer
                  "
                                >
                                    <RotateCcw size={14} />
                                    重新测算
                                </button>
                                {showPoster && (
                                    <button
                                        id="save-poster-btn"
                                        onClick={handleSavePoster}
                                        disabled={isSaving}
                                        className="
                      flex items-center gap-2 px-5 py-2.5 rounded-lg
                      text-white text-sm font-medium tracking-wider
                      transition-all duration-200 cursor-pointer
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                                        style={{
                                            background: 'linear-gradient(135deg, #af292e, #C93A3E)',
                                            boxShadow: '0 2px 12px rgba(175, 41, 46, 0.3)',
                                        }}
                                    >
                                        <Download size={14} />
                                        {isSaving ? '生成中…' : '谨受命（保存海报）'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ════════════════════════════════════════════════════════
            委任状海报
            ════════════════════════════════════════════════════════ */}
                {matchResult && (
                    <div className="flex justify-center mb-10">
                        <div
                            className="rounded-2xl overflow-hidden shadow-2xl"
                            style={{
                                boxShadow: showPoster
                                    ? '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(175, 41, 46, 0.08)'
                                    : 'none',
                                transition: 'box-shadow 0.6s ease',
                            }}
                        >
                            <AppointmentPoster
                                ref={posterRef}
                                title={matchResult.title}
                                rank={matchResult.rank}
                                desc={matchResult.desc}
                                modernJob={modernJob}
                                visible={showPoster}
                            />
                        </div>
                    </div>
                )}

                {/* ════════════════════════════════════════════════════════
            造办处·文创推荐入口 (800ms 延迟淡入)
            SPEC 2.6: 情绪转化
            ════════════════════════════════════════════════════════ */}
                {showMerchCTA && (
                    <div
                        className="max-w-lg mx-auto mb-12"
                        style={{
                            animation: 'merchFadeIn 0.8s ease forwards',
                        }}
                    >
                        <div
                            className="
                p-6 rounded-xl
                bg-[#151E2B]/60 backdrop-blur-md
                border border-[#2A3441]/60
                flex items-center justify-between
                cursor-pointer group
                hover:bg-[#1A2530] hover:border-[#B08D57]/30
                transition-all duration-300
              "
                            onClick={async () => {
                                // 上报点击模拟器 Banner 埋点
                                await trackEvent('click_simulation_banner', {
                                    modernJob: modernJob,
                                    ancientTitle: matchResult?.title,
                                });
                                // 导航至造办处
                                if (onNavigateToWorkshop) {
                                    onNavigateToWorkshop();
                                }
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(176,141,87,0.2), rgba(176,141,87,0.05))',
                                        border: '1px solid rgba(176,141,87,0.2)',
                                    }}
                                >
                                    <BookOpen size={22} className="text-[#B08D57]" />
                                </div>
                                <div>
                                    <div className="text-[#E5E0D8] text-sm font-medium mb-0.5">
                                        履新此职，怎能少了一把好扇？
                                    </div>
                                    <div className="text-[#8B9BB4] text-xs">
                                        赴【造办处】赏玩同款水墨折扇 →
                                    </div>
                                </div>
                            </div>
                            <ChevronRight
                                size={20}
                                className="text-[#5A6A7F] group-hover:text-[#B08D57] transition-colors duration-200"
                            />
                        </div>
                    </div>
                )}

                {/* ════════════════════════════════════════════════════════
            底部：无匹配状态的装饰文案
            ════════════════════════════════════════════════════════ */}
                {!matchResult && !isMatching && (
                    <div className="text-center mt-8">
                        <div className="text-[#2A3441] text-sm tracking-wider">
                            ─── 纵横捭阖，青云直上 ───
                        </div>
                        <div className="text-[#1E2A38] text-xs mt-2 opacity-50 tracking-wide">
                            内置 {Object.keys(jobDictionary).length}+ 职业映射词条 · 模糊匹配 · 智能降级
                        </div>
                    </div>
                )}

                {/* ── 匹配中骨架屏 ── */}
                {isMatching && (
                    <div className="flex flex-col items-center gap-4 mt-8">
                        <div className="w-16 h-16 rounded-full border-2 border-[#af292e]/30 border-t-[#af292e] animate-spin" />
                        <div
                            className="text-[#8B9BB4] text-sm tracking-[4px]"
                            style={{ fontFamily: "'Noto Serif SC', serif" }}
                        >
                            正在翻阅吏部典籍…
                        </div>
                    </div>
                )}
            </div>

            {/* ════ 内联 Keyframes ════ */}
            <style>{`
        @keyframes resultFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes merchFadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}

export default SimulationDashboard;
