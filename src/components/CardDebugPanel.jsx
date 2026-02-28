import React, { useState } from 'react';

const DEFAULT = {
    cardWidth: 60,
    cardHeight: 210,
    fontSize: 2.5,    // rem
    fontWeight: 900,   // font-black = 900
    fanAngle: 3,      // deg
};

function CardDebugPanel({ onChange }) {
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState({ ...DEFAULT });

    const update = (key, raw) => {
        const v = parseFloat(raw);
        if (isNaN(v)) return;
        const next = { ...values, [key]: v };
        setValues(next);
        onChange(next);
    };

    const reset = () => {
        setValues({ ...DEFAULT });
        onChange(null); // null = use defaults
    };

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-4 right-4 z-[9999] bg-black/70 text-white text-xs px-3 py-1.5 rounded-full shadow-lg hover:bg-black/90 transition-colors cursor-pointer"
                style={{ writingMode: 'horizontal-tb' }}
            >
                🛠 Card Debug
            </button>
        );
    }

    const sliderRow = (label, key, min, max, step, unit) => (
        <div className="flex items-center gap-2 text-xs" key={key}>
            <span className="w-16 text-right shrink-0 text-gray-300">{label}</span>
            <input
                type="range"
                min={min} max={max} step={step}
                value={values[key]}
                onChange={e => update(key, e.target.value)}
                className="flex-1 accent-amber-400 h-1 cursor-pointer"
            />
            <span className="w-16 text-amber-300 font-mono tabular-nums">
                {values[key]}{unit}
            </span>
        </div>
    );

    return (
        <div
            className="fixed bottom-4 right-4 z-[9999] bg-gray-900/95 backdrop-blur-sm text-white rounded-xl shadow-2xl border border-white/10"
            style={{ writingMode: 'horizontal-tb', width: 320 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
                <span className="text-sm font-semibold tracking-wide">🛠 官职卡片调试</span>
                <button
                    onClick={() => setOpen(false)}
                    className="text-gray-400 hover:text-white text-lg leading-none cursor-pointer"
                >×</button>
            </div>

            {/* Controls */}
            <div className="px-4 py-3 flex flex-col gap-3">
                {sliderRow('宽度', 'cardWidth', 30, 120, 1, 'px')}
                {sliderRow('高度', 'cardHeight', 100, 400, 1, 'px')}
                {sliderRow('字号', 'fontSize', 1, 5, 0.1, 'rem')}
                {sliderRow('字重', 'fontWeight', 100, 900, 100, '')}
                {sliderRow('扇角', 'fanAngle', 0, 30, 1, '°')}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-white/10 flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-mono">
                    {values.cardWidth}×{values.cardHeight} / {values.fontSize}rem / w{values.fontWeight}
                </span>
                <button
                    onClick={reset}
                    className="text-xs text-amber-400 hover:text-amber-300 cursor-pointer"
                >
                    重置默认
                </button>
            </div>
        </div>
    );
}

export default CardDebugPanel;
