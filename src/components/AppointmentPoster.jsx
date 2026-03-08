import React, { useState, useEffect, forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { getUUID } from '../utils/tracker';

/**
 * 委任状海报组件 (Appointment Poster)
 * 
 * 生成一张带有新中式底纹、竖向排版、朱砂盖印动效和
 * 专属裂变追踪二维码的高保真可分享海报。
 * 
 * Props:
 *   - title: 古代官职名称
 *   - rank: 品阶
 *   - desc: 职责描述
 *   - modernJob: 用户输入的现代职业
 *   - visible: 是否显示（触发入场动画）
 */
const AppointmentPoster = forwardRef(function AppointmentPoster(
    { title, rank, desc, modernJob, visible },
    ref
) {
    const [showStamp, setShowStamp] = useState(false);

    // 海报可见时，延迟 500ms 播放"盖印"动效
    useEffect(() => {
        if (visible) {
            setShowStamp(false);
            const timer = setTimeout(() => setShowStamp(true), 500);
            return () => clearTimeout(timer);
        }
    }, [visible, title]);

    // 组装裂变追踪 URL
    const uid = getUUID() || 'anonymous';
    const shareUrl = `https://qingyunzhi.com/simulator?ref=poster_share&utm_source=wechat_moments&uid=${uid}`;

    if (!visible) return null;

    return (
        <div
            ref={ref}
            className="relative overflow-hidden flex-shrink-0"
            style={{
                width: '540px',
                height: '800px',
                backgroundColor: '#f5f0e3',
                backgroundImage: `url('/assets/ui/main-bg.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                fontFamily: "'Noto Serif SC', 'STZhongsong', 'SimSun', serif",
            }}
        >
            {/* ───── 装饰边框 ───── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    border: '20px solid transparent',
                    borderImage: "url('/assets/ui/bg-border.png') 60 repeat",
                }}
            />

            {/* ───── 内边框线 ───── */}
            <div
                className="absolute pointer-events-none"
                style={{
                    top: '28px', left: '28px', right: '28px', bottom: '28px',
                    border: '1px solid rgba(139, 115, 85, 0.3)',
                }}
            />

            {/* ───── 顶部标题区 ───── */}
            <div className="relative z-10 flex flex-col items-center pt-14 pb-6">
                {/* 竖繁体标题 */}
                <div
                    className="text-[#8b7355] text-xs tracking-[8px] mb-2"
                    style={{ letterSpacing: '8px' }}
                >
                    大 唐 吏 部
                </div>
                <h2
                    className="text-[#2a1f14] text-3xl font-bold tracking-[6px] m-0"
                    style={{ letterSpacing: '6px' }}
                >
                    委 任 状
                </h2>
                <div
                    className="mt-2 w-32 h-[1px]"
                    style={{
                        background: 'linear-gradient(90deg, transparent, #8b7355, transparent)',
                    }}
                />
            </div>

            {/* ───── 主体内容区 ───── */}
            <div className="relative z-10 px-16 flex flex-col items-center">
                {/* 职业映射说明 */}
                <div className="text-center mb-6" style={{ color: '#6b5d4f' }}>
                    <span className="text-sm">今有</span>
                    <span
                        className="text-lg font-bold mx-2 px-3 py-1 rounded"
                        style={{
                            color: '#af292e',
                            borderBottom: '2px solid #af292e',
                        }}
                    >
                        {modernJob || '才俊'}
                    </span>
                    <span className="text-sm">一职</span>
                </div>

                <div className="text-sm text-center mb-8" style={{ color: '#8b7355' }}>
                    经吏部核验，特授古之相应官职
                </div>

                {/* ── 官职名称·核心展示 ── */}
                <div
                    className="flex flex-col items-center mb-6 py-8 px-10 rounded-md relative"
                    style={{
                        background: 'linear-gradient(135deg, rgba(245,240,227,0.6), rgba(255,255,255,0.3))',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(139, 115, 85, 0.15)',
                    }}
                >
                    <div
                        className="text-5xl font-bold tracking-widest mb-3"
                        style={{
                            color: '#2a1f14',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.08)',
                            writingMode: 'horizontal-tb',
                        }}
                    >
                        {title}
                    </div>
                    <div
                        className="text-xl tracking-[4px]"
                        style={{ color: '#af292e', letterSpacing: '4px' }}
                    >
                        {rank}
                    </div>
                </div>

                {/* ── 职责描述 ── */}
                <div
                    className="text-center px-6 leading-relaxed text-base mb-8"
                    style={{
                        color: '#4a3f35',
                        maxWidth: '380px',
                    }}
                >
                    <span className="text-[#8b7355] text-sm mr-1">「</span>
                    {desc}
                    <span className="text-[#8b7355] text-sm ml-1">」</span>
                </div>

                {/* ── 分隔线 ── */}
                <div
                    className="w-48 h-[1px] mb-8"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(139,115,85,0.4), transparent)',
                    }}
                />

                {/* ── 签署落款 ── */}
                <div className="flex items-end justify-between w-full px-8 mb-4">
                    {/* 左侧二维码 */}
                    <div className="flex flex-col items-center gap-2">
                        <div
                            className="p-2 rounded"
                            style={{
                                backgroundColor: 'rgba(245, 240, 227, 0.8)',
                                border: '1px solid rgba(139, 115, 85, 0.2)',
                            }}
                        >
                            <QRCodeSVG
                                value={shareUrl}
                                size={80}
                                fgColor="#1a1a1a"
                                bgColor="transparent"
                                level="M"
                            />
                        </div>
                        <div
                            className="text-[10px] text-center leading-tight"
                            style={{
                                color: '#8b7355',
                                maxWidth: '90px',
                                writingMode: 'horizontal-tb',
                            }}
                        >
                            扫码测算你的大唐官职
                        </div>
                    </div>

                    {/* 右侧印章 */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <div
                            className={`
                w-20 h-20 rounded-md border-[3px] border-[#af292e]
                flex items-center justify-center
                transition-all duration-500
                ${showStamp
                                    ? 'opacity-100 scale-100 rotate-[-8deg]'
                                    : 'opacity-0 scale-150 rotate-[15deg]'
                                }
              `}
                            style={{
                                backgroundColor: 'rgba(175, 41, 46, 0.08)',
                                boxShadow: showStamp
                                    ? '0 2px 12px rgba(175, 41, 46, 0.25)'
                                    : 'none',
                            }}
                        >
                            <span
                                className="text-[#af292e] font-bold text-lg tracking-widest"
                                style={{
                                    writingMode: 'vertical-rl',
                                    textOrientation: 'upright',
                                    letterSpacing: '4px',
                                }}
                            >
                                吏部之印
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ───── 底部落款 ───── */}
            <div
                className="absolute bottom-6 left-0 right-0 text-center text-xs"
                style={{ color: '#a89b8c' }}
            >
                青云志 · The Path to Court
            </div>
        </div>
    );
});

export default AppointmentPoster;
