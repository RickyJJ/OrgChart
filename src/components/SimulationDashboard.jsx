import React, { useState, useRef, useCallback, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Scroll, Sparkles, Download, RotateCcw, ChevronRight, BookOpen } from 'lucide-react';
import { matchJob, jobDictionary, fallbackJob } from '../data/jobMapping';
import { trackEvent, searchNodes } from '../api/localData';
import { getOrCreateUUID } from '../utils/tracker';
import AppointmentPoster from './AppointmentPoster';

/**
 * SimulationDashboard - 命运卷轴 (Destiny Scroll)
 *
 * 核心交互流程：
 *   1. 极简入场态：仅输入框与朱红CTA
 *   2. 匹配仪式感：800ms 卜算延迟
 *   3. 结果展示：委任状海报 + 朱红印章动画
 *   4. 文创分流：海报稳定后 800ms 淡入推荐
 */

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

    // 初始化/获取 UUID
    useEffect(() => {
        getOrCreateUUID();
    }, []);

    useEffect(() => {
        return () => {
            if (merchTimerRef.current) clearTimeout(merchTimerRef.current);
        };
    }, []);

    /**
     * 接旨赴任短路逻辑
     */
    useEffect(() => {
        if (initialParams?.node) {
            const { node } = initialParams;
            setMatchResult({
                title: node.title,
                rank: node.level,
                desc: node.description,
                salary: node.salary
            });
            setModernJob("钦定入仕");
            setIsMatching(false);
            
            const posterTimer = setTimeout(() => {
                setShowPoster(true);
                if (merchTimerRef.current) clearTimeout(merchTimerRef.current);
                merchTimerRef.current = setTimeout(() => {
                    setShowMerchCTA(true);
                }, 1800);
            }, 300);

            trackEvent('direct_take_office', {
                ancientTitle: node.title,
                rank: node.level
            });

            return () => clearTimeout(posterTimer);
        }
    }, [initialParams]);

    // ─── 核心匹配引擎 (Task 122) ──────────────────────────────
    const handleMatch = useCallback(async (jobInput) => {
        const value = jobInput || inputValue;
        if (!value.trim()) return;

        setIsMatching(true);
        setShowPoster(false);
        setShowMerchCTA(false);
        setModernJob(value.trim());

        // 1. 静态词典精确/模糊匹配
        let result = matchJob(value);

        // 2. 检索引擎兜底策略 (Fallback)
        if (!result) {
            const searchResults = await searchNodes(value);
            if (searchResults && searchResults.length > 0) {
                // 选取高分度数据第一条
                const bestMatch = searchResults[0];
                result = {
                    title: bestMatch.title,
                    rank: bestMatch.level,
                    desc: bestMatch.description,
                    salary: bestMatch.salary
                };
            } else {
                result = fallbackJob;
            }
        }

        // 卜算仪式延迟 (Task 122)
        setTimeout(() => {
            setMatchResult(result);
            setIsMatching(false);

            setTimeout(() => {
                setShowPoster(true);
                trackEvent('generate_poster', {
                    modernJob: value.trim(),
                    ancientTitle: result?.title,
                });

                // 800ms + 900ms(仪式) 引流延迟 (Task 121)
                if (merchTimerRef.current) clearTimeout(merchTimerRef.current);
                merchTimerRef.current = setTimeout(() => {
                    setShowMerchCTA(true);
                }, 1800);
            }, 300);
        }, 800);
    }, [inputValue]);

    const handleSavePoster = useCallback(async () => {
        if (!posterRef.current || isSaving) return;
        setIsSaving(true);
        try {
            const canvas = await html2canvas(posterRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#f5f0e3',
            });
            const link = document.createElement('a');
            link.download = `青云志_委任状_${matchResult?.title}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            trackEvent('save_poster', { ancientTitle: matchResult?.title });
        } catch (err) {
            console.error('[海报生成失败]', err);
        } finally {
            setIsSaving(false);
        }
    }, [matchResult, isSaving]);

    const handleReset = () => {
        setInputValue('');
        setMatchResult(null);
        setModernJob('');
        setShowPoster(false);
        setShowMerchCTA(false);
        if (onClearParams) onClearParams();
    };

    return (
        <div className="w-full h-full overflow-y-auto relative bg-rushi-bg bg-cover bg-center bg-no-repeat bg-fixed">
            <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col min-h-full">
                
                {/* 1 & 2. 极简入场态：无界悬浮 (Task 120) */}
                {!matchResult && (
                    <div className={`w-full max-w-lg mx-auto pt-14 relative transition-all duration-700 mt-16 ${isMatching ? 'opacity-40 scale-95 pointer-events-none' : 'opacity-100 animate-in fade-in slide-in-from-bottom-4 duration-1000'}`}>
                        {/* 移除了生硬包裹的卡片，完全融入宣纸画布 */}
                        
                        <div className="text-center mb-12 relative z-10">
                            <h2 className="text-[#2a1f14] text-4xl font-bold tracking-[4px] mb-3" style={{ fontFamily: "'Noto Serif SC', 'STZhongsong', serif" }}>
                                命 运 卷 轴
                            </h2>
                            <p className="text-[#8b7355] text-sm tracking-widest">
                                “ 你的好友已入局大内，你呢？ ”
                            </p>
                            <div className="mt-6 w-12 h-[2px] mx-auto bg-[#8b7355]/30" />
                        </div>

                        <div className="relative z-10 group">
                            <input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleMatch()}
                                placeholder="输入现代职业，探寻前世宿命"
                                maxLength={8}
                                className="w-full py-4 px-2 bg-transparent border-b-2 border-[#8b7355]/30 text-[#2a1f14] text-xl text-center focus:outline-none focus:border-[#af292e]/80 transition-all placeholder-[#8b7355]/60"
                                style={{ fontFamily: "'Noto Serif SC', serif" }}
                            />
                        </div>

                        {/* 朱红核心按钮 */}
                        <button
                            onClick={() => handleMatch()}
                            disabled={!inputValue.trim()}
                            className="w-full mt-10 py-3.5 relative z-10 text-white text-lg font-bold tracking-[4px] bg-[#af292e] hover:bg-[#8c2225] active:scale-[0.98] disabled:opacity-30 transition-all border border-[#8c2225]/50"
                            style={{ fontFamily: "'Noto Serif SC', serif" }}
                        >
                            启封命运卷轴
                        </button>

                        <div className="flex flex-wrap justify-center gap-3 mt-10 relative z-10 opacity-90">
                            {POPULAR_JOBS.map(job => (
                                <span key={job} onClick={() => { setInputValue(job); handleMatch(job); }} className="cursor-pointer text-xs text-[#8b7355]/80 px-4 py-2 hover:text-[#af292e] transition-colors bg-[#8b7355]/5 rounded-md hover:bg-[#8b7355]/10">
                                    {job}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. 结果与海报区域 (Task 121) */}
                {matchResult && (
                    <div className="animate-in fade-in zoom-in-95 duration-1000">
                        <div className="flex justify-center mb-10">
                            <AppointmentPoster
                                ref={posterRef}
                                title={matchResult.title}
                                rank={matchResult.rank}
                                desc={matchResult.desc}
                                modernJob={modernJob}
                                visible={showPoster}
                                salary={matchResult.salary}
                                grace={matchResult.grace}
                            />
                        </div>

                        <div className={`flex flex-col items-center gap-6 transition-all duration-1000 delay-500 ${showPoster ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="flex gap-4">
                                <button onClick={handleReset} className="flex items-center gap-2 px-6 py-3 bg-[#fdfaf2] border border-[#8b7355]/30 text-[#4a3f35] rounded-xl hover:bg-[#8b7355]/5 transition-all">
                                    <RotateCcw size={16} /> 重新卜算
                                </button>
                                <button onClick={handleSavePoster} disabled={isSaving} className="flex items-center gap-2 px-8 py-3 bg-[#af292e] text-white rounded-xl hover:bg-[#8c2225] transition-all shadow-lg shadow-[#af292e]/10">
                                    <Download size={16} /> {isSaving ? '正在录入...' : '落笔成旨'}
                                </button>
                            </div>

                            {/* 造办处引导 (Task 121: 800ms 延迟) */}
                            {showMerchCTA && (
                                <div className="w-full max-w-sm p-5 rounded-2xl bg-[#fdfaf2] border border-[#c19b6c]/30 flex items-center justify-between cursor-pointer group hover:border-[#c19b6c]/70 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-2 duration-700" onClick={onNavigateToWorkshop}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#c19b6c]/10 flex items-center justify-center">
                                            <BookOpen size={24} className="text-[#c19b6c]" />
                                        </div>
                                        <div>
                                            <p className="text-[#2a1f14] text-sm font-medium">履新此职，配得起这一把好扇</p>
                                            <p className="text-[#8b7355] text-xs mt-1">前往造办处赏玩同款水墨折扇 →</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-[#c19b6c] group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 正在匹配状态 (Ritual) */}
                {isMatching && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f5f5dc]/70 backdrop-blur-sm z-50">
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 border-4 border-[#af292e]/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-[#af292e] rounded-full animate-spin"></div>
                            <Sparkles className="absolute inset-0 m-auto text-[#af292e]/60 animate-pulse" size={32} />
                        </div>
                        <p className="text-[#2a1f14] text-xl tracking-[6px] font-bold" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                            正在启封命运卷轴...
                        </p>
                        <p className="text-[#8b7355] text-xs mt-3 tracking-[2px] opacity-80">吏部正在翻阅典籍，请稍候</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SimulationDashboard;
