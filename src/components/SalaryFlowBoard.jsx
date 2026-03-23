import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Coins, 
  Wallet, 
  Utensils, 
  Package, 
  Landmark, 
  Info,
  Banknote,
  Wheat,
  Shield,
  Gift
} from 'lucide-react';

/**
 * Tooltip 科普文案词典 — 与数据 key 一一对应
 */
const SALARY_DICT = {
  sui_lu: '岁禄：按年发放的粮食。 \n[💡 相当于现代的“基本年薪”。唐代1石约合今53公斤，发多少米代表你的底薪有多高。]',
  lu_mi: '岁禄：按年发放的粮食。 \n[💡 相当于现代的“基本年薪”。唐代1石约合今53公斤，发多少米代表你的底薪有多高。]',
  ben_lu: '本禄：明代官员的基本俸禄，通常发放本色大米。 \n[💡 大明版“基础底薪”。不过朱元璋给的底薪极低，官员常常得靠其他补贴才能养家。]',
  zhi_tian: '职田：国家按官职品级分配的田地，官员收取地租作为俸禄，离任需交回。 \n[💡 类似于现代大厂的“职务配车”或“高管公寓”，在职期间享受收益，离职了得原封不动退给HR。]',
  zhe_feng: '折俸：因国库粮食不足，将本禄折算成银两、宝钞或布匹发放。 \n[💡 相当于公司现金流吃紧，老板决定发“超市购物卡”、“公司滞销产品”或者“期权”来抵扣你的工资。]',
  gong_xie: '公廨本钱/公廨田：朝廷拨给官署的本钱或田地，生息/收租用于办公杂费及官员补贴。 \n[💡 妥妥的古代“部门团建费”和“科室小金库”，逢年过节发点福利全靠它了。]',
  yue_feng: '月俸：政府按月发放的钱币（通常为铜钱），是官员维持日常开销的核心现金收入。 \n[💡 相当于现代大厂的“月度打卡纯薪”。古代没有移动支付，这笔沉甸甸的铜钱，就是打工人日常下馆子、买买买和社交请客的现金储备。]',
  shi_liao: '食料：政府按月拨付的餐饮经费，历史记载中详细规定了肉、菜、葱、姜的份额。 \n[💡 妥妥的古代版“餐补”或“食堂饭卡”，品级越高，每天能吃到的肉就越多。]',
  za_yong: '杂用：用于官员日常办公的消耗品补贴，包括纸、笔、墨、冬季炭火等。 \n[💡 现代职场的“办公用品报销额度”加“高温/取暖补贴”。]',
  fang_ge: '防阁/庶仆：朝廷按品级分配给官员的警卫与杂役。后演变为由朝廷按人头折算成现金发放的“雇佣费”。 \n[💡 相当于现代大厂高管的“专属司机配额”或“安保/生活助理津贴”。]',
  ling_juan: '赐物/绫绢：唐代实行“钱帛兼行”，遇到重大节庆时发放的丝织品，在当时可直接作为硬通货流通。 \n[💡 相当于公司逢年过节发的“京东E卡”或“实物大礼包”，不仅能用还能当钱花。]',
};

/**
 * SALARY_CONFIG — 图标 / 印章映射
 */
const SALARY_CONFIG = {
  lu_mi:    { label: '岁禄', icon: Wheat,     seal: '米' },
  sui_lu:   { label: '岁禄', icon: Wheat,     seal: '米' },
  yue_feng: { label: '月俸', icon: Wallet,    seal: '俸' },
  shi_liao: { label: '食料', icon: Utensils,   seal: '食' },
  za_yong:  { label: '杂用', icon: Package,    seal: '杂' },
  zhi_tian: { label: '职田', icon: Landmark,   seal: '田' },
  ben_lu:   { label: '本禄', icon: Wheat,     seal: '本' },
  zhe_feng: { label: '折俸', icon: Banknote,   seal: '折' },
  gong_xie: { label: '公廨', icon: Landmark,   seal: '廨' },
  fang_ge:  { label: '防阁', icon: Shield,     seal: '防' },
  ling_juan: { label: '绫绢', icon: Gift,      seal: '绢' },
  default:  { label: '俸禄', icon: Coins,      seal: '禄' },
};

/** 根据 key 获取 tooltip 文案 */
function getSalaryDescription(key) {
  return SALARY_DICT[key] || '品秩俸禄：对应官职品级的基础待遇。';
}

/**
 * SalaryTooltip — V3 极简重构
 *
 * 核心思路：丢弃两阶段渲染，直接在 handleMouseEnter
 * 时把锚点数值（纯数字）存入 state。组件只做一件事：
 * 用 useLayoutEffect 同步测量自身高度并计算像素坐标。
 *
 * 箭头用 CSS border-trick 三角形，独立于 overflow 不会被裁切。
 */
const TOOLTIP_W = 280;
const EDGE_GAP = 10;
const ARROW_H = 7;

const SalaryTooltip = ({ text, anchor, visible }) => {
  const bodyRef = useRef(null);
  const [layout, setLayout] = useState(null);

  // 每次 anchor / text / visible 变化 → 重新定位
  React.useLayoutEffect(() => {
    if (!visible || !anchor || !bodyRef.current) {
      setLayout(null);
      return;
    }
    const el = bodyRef.current;
    const tipH = el.scrollHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // ── 垂直 ──
    let showBelow = false;
    let top;
    const spaceAbove = anchor.top;
    const spaceBelow = vh - anchor.bottom;

    if (spaceAbove >= tipH + ARROW_H + EDGE_GAP) {
      top = anchor.top - ARROW_H - tipH;
    } else if (spaceBelow >= tipH + ARROW_H + EDGE_GAP) {
      top = anchor.bottom + ARROW_H;
      showBelow = true;
    } else if (spaceAbove >= spaceBelow) {
      top = Math.max(EDGE_GAP, anchor.top - ARROW_H - tipH);
    } else {
      top = anchor.bottom + ARROW_H;
      showBelow = true;
      if (top + tipH > vh - EDGE_GAP) top = vh - EDGE_GAP - tipH;
    }

    // ── 水平 ──
    const cx = anchor.cx;
    let left = cx - TOOLTIP_W / 2;
    if (left < EDGE_GAP) left = EDGE_GAP;
    if (left + TOOLTIP_W > vw - EDGE_GAP) left = vw - EDGE_GAP - TOOLTIP_W;

    // 箭头
    let arrowX = cx - left;
    arrowX = Math.max(14, Math.min(TOOLTIP_W - 14, arrowX));

    setLayout({ top, left, arrowX, showBelow });
  }, [visible, anchor, text]);

  if (!visible || !text) return null;

  // ── 文本渲染 ──
  const lines = text.split('\n').filter(Boolean);
  const contentEls = lines.map((line, i) => {
    const t = line.trim();
    if (t.startsWith('[💡')) {
      return (
        <span key={i} className="block mt-1.5 text-[#a3a3a3] text-[11px] font-sans leading-normal italic border-t border-slate-700/50 pt-1.5">
          {t}
        </span>
      );
    }
    return <span key={i} className="block">{t}</span>;
  });

  const arrowBorder = '#334155';
  const arrowFill = '#1e293b';

  // 如果还没算好坐标，先渲染到屏幕外（用于测量 scrollHeight）
  const wrapStyle = layout
    ? { top: layout.top, left: layout.left, width: TOOLTIP_W }
    : { top: -9999, left: -9999, width: TOOLTIP_W, visibility: 'hidden' };

  return createPortal(
    <div className="fixed z-[9999] pointer-events-none" style={wrapStyle}>

      {/* ▲ 箭头 — tooltip 在目标下方时，箭头朝上 */}
      {layout && layout.showBelow && (
        <div style={{ position: 'absolute', top: -ARROW_H, left: layout.arrowX, transform: 'translateX(-50%)' }}>
          <div style={{ width: 0, height: 0, borderLeft: `${ARROW_H}px solid transparent`, borderRight: `${ARROW_H}px solid transparent`, borderBottom: `${ARROW_H}px solid ${arrowBorder}` }} />
          <div style={{ position: 'absolute', top: 1, left: 0, width: 0, height: 0, borderLeft: `${ARROW_H}px solid transparent`, borderRight: `${ARROW_H}px solid transparent`, borderBottom: `${ARROW_H}px solid ${arrowFill}` }} />
        </div>
      )}

      {/* 主体 */}
      <div
        ref={bodyRef}
        className="px-4 py-3 bg-[#1e293b] text-[#fcfaf2] text-xs rounded-lg shadow-2xl border border-slate-700 leading-relaxed"
        style={{ maxHeight: '45vh', overflowY: 'auto' }}
      >
        <div className="flex flex-col">{contentEls}</div>
      </div>

      {/* ▼ 箭头 — tooltip 在目标上方时，箭头朝下 */}
      {layout && !layout.showBelow && (
        <div style={{ position: 'absolute', bottom: -ARROW_H, left: layout.arrowX, transform: 'translateX(-50%)' }}>
          <div style={{ width: 0, height: 0, borderLeft: `${ARROW_H}px solid transparent`, borderRight: `${ARROW_H}px solid transparent`, borderTop: `${ARROW_H}px solid ${arrowBorder}` }} />
          <div style={{ position: 'absolute', top: -1, left: 0, width: 0, height: 0, borderLeft: `${ARROW_H}px solid transparent`, borderRight: `${ARROW_H}px solid transparent`, borderTop: `${ARROW_H}px solid ${arrowFill}` }} />
        </div>
      )}
    </div>,
    document.body
  );
};


/**
 * Seal Icon
 * CSS-drawn traditional square seal style.
 */
const SealIcon = ({ text }) => (
  <div className="w-5 h-5 border-2 border-[#af292e] flex items-center justify-center rounded-[2px] mr-1 shrink-0 mix-blend-multiply opacity-90">
    <span className="text-[10px] text-[#af292e] font-serif font-bold leading-none select-none pt-[1px]">
      {text}
    </span>
  </div>
);

/**
 * SalaryFlowBoard
 * A flow-based layout for salary attributes with custom tooltips.
 */
const SalaryFlowBoard = ({ salaries, dynastyId }) => {
  // anchor 存的是纯数字，不是 DOMRect 对象，避免引用相等性问题
  const [tooltip, setTooltip] = useState({ text: '', visible: false, anchor: null });
  const containerRef = useRef(null);

  if (!salaries || Object.keys(salaries).length === 0) return null;

  const handleMouseEnter = (e, desc) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTooltip({
      text: desc,
      visible: true,
      // 序列化为纯数字对象，确保 useLayoutEffect 的依赖比较可靠
      anchor: {
        top: r.top,
        bottom: r.bottom,
        left: r.left,
        right: r.right,
        cx: r.left + r.width / 2,
      },
    });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className="w-full" ref={containerRef}>
      <div className="flex flex-wrap gap-x-5 gap-y-3">
        {Object.entries(salaries).map(([key, value]) => {
          if (key === 'remark' || !value || value === '0') return null;
          
          const config = SALARY_CONFIG[key] || SALARY_CONFIG.default;
          const IconComponent = config.icon;
          const description = getSalaryDescription(key);

          return (
            <div 
              key={key}
              onMouseEnter={(e) => handleMouseEnter(e, description)}
              onMouseLeave={handleMouseLeave}
              className="group relative flex items-center transition-all duration-300 cursor-help hover:translate-y-[-1px]"
            >
              {config.seal ? (
                <SealIcon text={config.seal} />
              ) : (
                <div className="w-5 h-5 border-2 border-[#af292e] flex items-center justify-center rounded-[2px] mr-1 shrink-0 mix-blend-multiply opacity-90">
                  <IconComponent size={10} className="text-[#af292e] font-bold" />
                </div>
              )}
              
              <div className="flex items-center">
                <span className="text-[15px] text-[#1a1a1a] font-serif font-bold leading-none translate-y-[-1px]">
                  {value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {salaries.remark && (
        <div className="mt-3 px-1 text-[0.85rem] text-[#5c544d] leading-relaxed italic font-serif flex items-start gap-1.5">
          <Info size={14} className="mt-0.5 shrink-0 opacity-60" />
          <span>{salaries.remark}</span>
        </div>
      )}

      <SalaryTooltip
        text={tooltip.text}
        anchor={tooltip.anchor}
        visible={tooltip.visible}
      />
    </div>
  );
};

export default SalaryFlowBoard;
