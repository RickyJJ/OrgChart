import React, { useState, useEffect, forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { getUUID } from '../utils/tracker';
import { processAlphaMask } from '../utils/imageProcessor';

// 神级音效发生器：纯前端模拟重击与回声（砰——咚）
const playStampSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        // 1. 沉重的 "砰" (Low frequency thud impact)
        const punchOsc = ctx.createOscillator();
        const punchGain = ctx.createGain();
        punchOsc.type = 'sine';
        punchOsc.frequency.setValueAtTime(150, ctx.currentTime);
        punchOsc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        punchGain.gain.setValueAtTime(1, ctx.currentTime);
        punchGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        
        punchOsc.connect(punchGain);
        punchGain.connect(ctx.destination);
        punchOsc.start();
        punchOsc.stop(ctx.currentTime + 0.2);

        // 2. 深沉的余波回声 "咚" (Deep resonant boom/echo)
        const boomOsc = ctx.createOscillator();
        const boomGain = ctx.createGain();
        boomOsc.type = 'triangle'; 
        boomOsc.frequency.setValueAtTime(60, ctx.currentTime);
        boomOsc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.8);
        boomGain.gain.setValueAtTime(0, ctx.currentTime);
        boomGain.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 0.05); /* 瞬间拉升然后长尾衰减 */
        boomGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
        
        boomOsc.connect(boomGain);
        boomGain.connect(ctx.destination);
        boomOsc.start();
        boomOsc.stop(ctx.currentTime + 1.2);
        
        // 3. 纸张被挤压和木头撞击的纹理噪点 (Wood/Paper texture noise)
        const bufferSize = ctx.sampleRate * 0.1;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) { output[i] = Math.random() * 2 - 1; }
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 800;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.6, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseSource.start();
    } catch (e) {
        console.warn("Audio playback ignored (user interaction may be needed)", e);
    }
};

const SALARY_CONFIG_MAP = {
    lu_mi: '岁禄', sui_lu: '岁禄', yue_feng: '月俸', shi_liao: '食料',
    za_yong: '杂用', zhi_tian: '职田', ben_lu: '本禄', zhe_feng: '折俸',
    gong_xie: '公廨', fang_ge: '防阁', ling_juan: '绫绢'
};

/**
 * 委任状海报组件 (Appointment Poster) - 命运卷轴专用版
 * 
 * 核心升级：
 *   1. 朱红印章物理盖印动效 (Damped Physics)
 *   2. 海报卡片受力反馈 (Vibration)
 *   3. 专属水墨风二维码 (UTM Tracking)
 */
const AppointmentPoster = forwardRef(function AppointmentPoster(
    { title, rank, desc, modernJob, visible, salary, grace },
    ref
) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [sealBg, setSealBg] = useState("url('/assets/ui/yinzhang.png')");

    // 利用公共工具对印章背景进行无感像素扣除，完美输出物理透明层，避免 html2canvas 忽略 blend-mode
    useEffect(() => {
        processAlphaMask('/assets/ui/yinzhang.png')
            .then(base64Data => setSealBg(`url('${base64Data}')`))
            .catch(e => console.error("Failed to mask seal:", e));
    }, []);

    useEffect(() => {
        let soundTimer;
        let animTimer;
        if (visible) {
            setIsAnimating(false);
            // 简单延迟以重启 CSS 动画
            animTimer = setTimeout(() => {
                setIsAnimating(true);
                
                // 动画总时长 0.35s, 设定的砸击点在 58%~60%
                // 延迟： CSS animation-delay: 200ms + (350ms * 58%) ≈ 403ms 
                soundTimer = setTimeout(() => {
                    playStampSound();
                }, 403);
            }, 50);
        } else {
            setIsAnimating(false);
        }
        return () => {
            clearTimeout(animTimer);
            clearTimeout(soundTimer);
        };
    }, [visible, title]);

    // 组装裂变追踪 URL (Task 123)
    const uid = getUUID() || 'anonymous';
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/?ref=destiny_scroll&utm_source=poster_share&utm_medium=viral&uid=${uid}&node=${encodeURIComponent(title)}`;

    const renderSalaryColumns = () => {
        const defaultEls = (
            <>
                <div className="text-[#8a5a5a] text-[11px] font-light leading-loose tracking-[4px] opacity-90 mx-auto whitespace-nowrap">
                    恩典：赐紫金鱼袋 见官大一级
                </div>
                <div className="w-[1px] h-[75%] bg-black/10 mx-auto"></div>
                <div className="text-[#4a4a4a] text-[11px] font-light leading-loose tracking-[4px] opacity-90 mx-auto whitespace-nowrap">
                    岁赐：食禄五百石 通判州事
                </div>
            </>
        );

        if (!salary) return defaultEls;

        if (typeof salary === 'string') {
            return (
                <>
                    <div className="text-[#8a5a5a] text-[11px] font-light leading-loose tracking-[4px] opacity-90 mx-auto whitespace-nowrap">
                        恩典：{grace || "赐紫服金鱼袋"}
                    </div>
                    <div className="w-[1px] h-[75%] bg-black/10 mx-auto"></div>
                    <div className="text-[#4a4a4a] text-[11px] font-light leading-loose tracking-[4px] opacity-90 mx-auto whitespace-nowrap">
                        岁赐：{salary}
                    </div>
                </>
            );
        }

        const nodes = [];
        const entries = Object.entries(salary).filter(([k, v]) => k !== 'remark' && v && v !== '0');
        const displayEntries = entries.slice(0, 4);

        displayEntries.forEach(([key, val], idx) => {
            const label = SALARY_CONFIG_MAP[key] || '俸禄';
            if (idx > 0) {
                nodes.push(
                    <div key={`line-${idx}`} className="w-[1px] h-[75%] bg-black/10 mx-auto my-auto"></div>
                );
            }
            nodes.push(
                <div key={`col-${idx}`} className="text-[#4a4a4a] text-[11px] font-light leading-loose tracking-[4px] opacity-90 mx-auto whitespace-nowrap">
                    {label}：{val}
                </div>
            );
        });

        if (displayEntries.length === 0) return defaultEls;
        return nodes;
    };

    if (!visible) return null;

    return (
        <div
            ref={ref}
            className={`relative overflow-hidden flex-shrink-0 ${isAnimating ? 'poster-vibration-active' : ''}`}
            style={{
                width: '540px',
                height: '800px',
                background: 'rgba(250, 245, 235, 0.85)',
                boxShadow: '0 16px 32px rgba(45, 35, 25, 0.08), 0 2px 6px rgba(45, 35, 25, 0.04)',
                border: '1px solid rgba(60, 45, 35, 0.3)',
                outline: '1px solid rgba(60, 45, 35, 0.2)',
                outlineOffset: '-8px',
                fontFamily: "'Noto Serif SC', 'STZhongsong', 'SimSun', serif",
            }}
        >
            {/* ───── 水墨背景叠加 ───── */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/handmade-paper.png')" }}></div>

            {/* ───── 顶部标题 ───── */}
            <div className="relative z-10 flex flex-col items-center pt-20">
                <div className="text-[#8b7355] text-sm tracking-[12px] mb-4 opacity-70">
                    大 唐 吏 部
                </div>
                <h2 className="text-[#2a1f14] text-5xl font-bold tracking-[10px] m-0" style={{ letterSpacing: '10px' }}>
                    委 任 状
                </h2>
                <div className="mt-6 w-40 h-[2px] bg-gradient-to-r from-transparent via-[#8b7355]/40 to-transparent" />
            </div>

            {/* ───── 顶部信息区 ───── */}
            <div className="relative z-10 px-10 flex flex-col items-center mt-6">
                <div className="text-center mb-4 text-lg font-medium max-w-[420px]" style={{ color: '#4a3f35', lineHeight: '2' }}>
                    门下：天道流转，百业皆有定数。察后世修
                    <span className="inline text-2xl font-bold text-[#af292e] px-2 border-b-2 border-[#af292e] pb-[2px] mx-1">
                        {modernJob || '游学者'}
                    </span>
                    之业者，经吏部堪合，理当位列大唐朝班。特授：
                </div>
            </div>

            {/* ───── 核心排版区 (竖排右起) ───── */}
            <div 
                className="relative w-full px-8 -mt-6 z-10 overflow-hidden"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start', /* 顶部基准线严格平齐 */
                    justifyContent: 'center', /* 水平居中 */
                    writingMode: 'vertical-rl',
                    height: '460px', /* 强制硬边界 */
                    gap: '60px', 
                    paddingTop: '40px'
                }}
            >
                {/* 第一组（绝对重心）：主干列阵（由右至左：官名、品阶。移除了红点，由 32px 间距隔离） */}
                <div className="relative flex h-full" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '32px' }}>
                    
                    {/* 最右侧：主官名大字（带相对定位以承载落款印章） */}
                    <div className="relative flex-shrink-0 flex items-center">
                        <div className="text-[52px] font-bold text-[#2a1f14] tracking-[14px] whitespace-nowrap">
                            {title}
                        </div>

                        {/* 印章：绝对定位在该官名容器的右下方，确保产生物理层叠感 */}
                        {isAnimating && (
                            <div
                                key={`${title}-${isAnimating}`}
                                className="seal-container absolute -bottom-6 -right-6 flex-shrink-0 z-20"
                                style={{
                                    width: '90px',
                                    height: '90px',
                                    backgroundImage: sealBg,
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    backgroundColor: 'transparent',
                                    mixBlendMode: 'multiply',
                                    writingMode: 'horizontal-tb' /* 强制回归水平坐标系 */
                                }}
                            >
                                {/* 绝对定位容器阵列：彻底解耦，独立控制四大金刚的坐标 */}
                                <div 
                                    className="relative w-full h-full text-[#af292e] select-none" 
                                    style={{ 
                                        fontFamily: '"LiSu", "Kaiti SC", "STKaiti", "STZhongsong", serif',
                                        fontWeight: 900,
                                        fontSize: '32px',
                                        lineHeight: 1
                                    }}
                                >
                                    {/* 绝对定位拆解：控制左上、右上、左下、右下的像素级坐标 */}
                                    <div className="absolute flex items-center justify-center" style={{ top: '5px', left: '12px', fontSize: '38px', fontWeight: 900 }}>堪</div>
                                    <div className="absolute flex items-center justify-center" style={{ top: '5px', right: '12px', fontSize: '38px', fontWeight: 900 }}>命</div>
                                    <div className="absolute flex items-center justify-center" style={{ bottom: '17px', left: '12px', fontSize: '38px', fontWeight: 900 }}>合</div>
                                    <div className="absolute flex items-center justify-center" style={{ bottom: '17px', right: '12px', fontSize: '38px', fontWeight: 900 }}>数</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 最左侧：官品容器 (降格排版，下沉以产生错落感) */}
                    <div 
                        className="text-[#af292e] text-lg font-bold tracking-[6px] whitespace-nowrap mt-[60px]"
                        style={{
                            border: '2px solid #af292e',
                            outline: '1px solid #af292e',
                            outlineOffset: '-5px',
                            background: 'transparent',
                            padding: '14px 8px'
                        }}
                    >
                        {rank}
                    </div>

                </div>

                {/* 第二列（中间）：单行竖排职责描述，已拆除品阶 */}
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '30px' }}>
                    <div className="text-base leading-[2.2] text-[#4a3f35] font-light whitespace-nowrap" style={{ letterSpacing: '4px' }}>
                        「 {desc} 」
                    </div>
                </div>

                {/* 第三列（偏左）：大唐薪酬包，多列动态解析与细线分隔（最高限高保护） */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', maxHeight: '310px', marginTop: '40px', justifyContent: 'flex-start' }}>
                    {renderSalaryColumns()}
                </div>
            </div>

            {/* ───── 二维码安全区 (绝对左下角) ───── */}
            <div className="absolute bottom-6 left-8 z-20 pointer-events-none">
                <div className="flex flex-col items-center gap-2 pointer-events-auto">
                    <div className="p-1" style={{ mixBlendMode: 'multiply' }}>
                        <QRCodeSVG
                            value={shareUrl}
                            size={72}
                            fgColor="#2a1f14"
                            bgColor="transparent"
                            level="H"
                            style={{ mixBlendMode: 'multiply' }}
                        />
                    </div>
                    <p className="text-[10px] text-[#8a5a5a] tracking-widest opacity-80 mb-3" style={{ fontFamily: "'STSong', 'SimSun', serif" }}>
                        扫码入仕大唐
                    </p>
                </div>
            </div>

            {/* ───── 底部落款 ───── */}
            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
                <p className="text-[10px] text-[#8b7355]/40 tracking-[4px] uppercase font-light">
                    Establishment of the Great Tang Administration
                </p>
            </div>

        </div>
    );
});

export default AppointmentPoster;
