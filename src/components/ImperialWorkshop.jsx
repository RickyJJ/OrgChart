import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, ExternalLink, Eye, Loader2, Heart } from 'lucide-react';
import { fetchProducts, trackEvent, toggleProductLike } from '../api/directus';

/**
 * ImperialWorkshop (造办处) — 新中式无头电商画廊
 *
 * 核心设计原则：
 *   - 延续项目整体 Neo-Chinese Minimalist 风格
 *   - 无购物车概念，CTA 采用古风文案（"赏鉴"、"请回案头"）
 *   - 商品图片 hover 时带水墨晕染阴影放大
 *   - 点击 CTA 先埋点再重定向至外部电商
 */

// ─── 占位产品图（当 Directus 尚未配置真实图片时使用本地图） ───
const FALLBACK_IMAGES = {
    1: '/assets/content/products/fan.png',
    2: '/assets/content/products/notebook.png',
    3: '/assets/content/products/seal.png',
    4: '/assets/content/products/coaster.png',
    5: '/assets/content/products/candle.png',
    6: '/assets/content/products/bookmark.png',
};

function ImperialWorkshop() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);
    const [likedIds, setLikedIds] = useState(() => {
        try {
            const saved = localStorage.getItem('qyz_liked_products');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // ─── 加载商品数据 ────────────────────────────────────────
    useEffect(() => {
        setIsLoading(true);
        fetchProducts()
            .then((data) => {
                setProducts(data);
                // 进入造办处时上报埋点
                trackEvent('enter_workshop', { source: 'sidebar' });
            })
            .catch((err) => {
                console.error('[造办处] 商品加载失败:', err.message);
                setError('暂时无法加载商品，请稍后再试');
            })
            .finally(() => setIsLoading(false));
    }, []);

    // ─── 点赞功能 ───
    const handleLikeClick = useCallback(async (product, e) => {
        e.stopPropagation();

        const isLiked = likedIds.includes(product.id);
        const newLikeStatus = !isLiked;

        // 乐观更新 UI (Optimistic UI Update)
        const currentLikes = typeof product.likes_count === 'number' ? product.likes_count : 0;
        const newLikesCount = currentLikes + (newLikeStatus ? 1 : -1);

        setProducts(prev => prev.map(p =>
            p.id === product.id ? { ...p, likes_count: newLikesCount } : p
        ));

        setLikedIds(prev => {
            const updated = newLikeStatus
                ? [...prev, product.id]
                : prev.filter(id => id !== product.id);
            localStorage.setItem('qyz_liked_products', JSON.stringify(updated));
            return updated;
        });

        // 异步更新后端
        const success = await toggleProductLike(product.id, newLikesCount);

        if (!success) {
            // 后端更新失败，回滚本地状态
            setProducts(prev => prev.map(p =>
                p.id === product.id ? { ...p, likes_count: currentLikes } : p
            ));

            setLikedIds(prev => {
                const updated = isLiked
                    ? [...prev, product.id]
                    : prev.filter(id => id !== product.id);
                localStorage.setItem('qyz_liked_products', JSON.stringify(updated));
                return updated;
            });
            console.warn('[点赞] 接口调用失败，已回滚前端状态。');

            // 弹出提示
            setToastMessage('系统繁忙，未能留存您的心意，请稍后再试');
            setTimeout(() => setToastMessage(null), 3000);
            return;
        }

        // 埋点上报 (仅当实际成功时)
        trackEvent(newLikeStatus ? 'like_product' : 'unlike_product', {
            productId: product.id,
            productName: product.name,
        });
    }, [likedIds]);

    // ─── CTA 点击处理：先埋点，再重定向 ──────────────────────
    const handleBuyClick = useCallback(async (product, e) => {
        e.stopPropagation();

        if (!product.external_url) {
            console.warn('[造办处] 该商品未配置外部链接');
            return;
        }

        // 先埋点
        await trackEvent('click_buy', {
            productId: product.id,
            productName: product.name,
        });

        // 再重定向
        window.location.href = product.external_url;
    }, []);

    // ─── 商品卡悬浮时上报浏览埋点 ──────────────────────────
    const handleProductHover = useCallback((product) => {
        setHoveredId(product.id);
        trackEvent('view_product', {
            productId: product.id,
            productName: product.name,
        });
    }, []);

    // ─── 获取商品图片 URL ───────────────────────────────────
    const getProductImage = (product) => {
        if (product.imageUrl) return product.imageUrl;
        return FALLBACK_IMAGES[product.id] || '/assets/content/products/fan.png';
    };

    return (
        <div
            className="w-full h-full rounded-xl overflow-y-auto relative"
            style={{
                backgroundColor: '#0B111A',
                backgroundImage: `
                    radial-gradient(ellipse at 10% 30%, rgba(176, 141, 87, 0.06) 0%, transparent 60%),
                    radial-gradient(ellipse at 90% 70%, rgba(175, 41, 46, 0.04) 0%, transparent 50%)
                `,
            }}
        >
            {/* ═══ 顶层提示 (Toast) ═══ */}
            <div
                className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-none ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
            >
                {toastMessage && (
                    <div className="bg-[#1a0f14] border border-[#af292e]/30 shadow-[0_4px_24px_rgba(175,41,46,0.15)] rounded-full px-6 py-2.5 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#af292e] animate-pulse" />
                        <span className="text-[#E5E0D8] text-sm tracking-wider" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                            {toastMessage}
                        </span>
                    </div>
                )}
            </div>

            <div className="max-w-6xl mx-auto px-8 py-12">

                {/* ═══ 画廊标题区 ═══ */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div
                            className="w-[1px] h-8"
                            style={{ background: 'linear-gradient(to bottom, transparent, #B08D57, transparent)' }}
                        />
                        <h2
                            className="text-[#E5E0D8] tracking-[8px] text-4xl font-bold m-0"
                            style={{ fontFamily: "'Noto Serif SC', serif" }}
                        >
                            造 办 处
                        </h2>
                        <div
                            className="w-[1px] h-8"
                            style={{ background: 'linear-gradient(to bottom, transparent, #B08D57, transparent)' }}
                        />
                    </div>
                    <p className="text-[#8B9BB4] text-sm tracking-[4px] m-0 mt-3">
                        THE IMPERIAL WORKSHOP
                    </p>
                    <p className="text-[#5A6A7F] text-xs tracking-wider mt-4 max-w-md mx-auto leading-relaxed">
                        甄选古韵文创雅器，将盛世风华请回案头
                    </p>

                    {/* 装饰分隔线 */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <div className="w-16 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #2A3441)' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B08D57]/40" />
                        <div className="w-16 h-[1px]" style={{ background: 'linear-gradient(90deg, #2A3441, transparent)' }} />
                    </div>
                </div>

                {/* ═══ 加载状态 ═══ */}
                {isLoading && (
                    <div className="flex flex-col items-center gap-4 py-20">
                        <Loader2 size={32} className="text-[#B08D57] animate-spin" />
                        <div className="text-[#8B9BB4] text-sm tracking-[3px]"
                            style={{ fontFamily: "'Noto Serif SC', serif" }}
                        >
                            正在陈列珍品…
                        </div>
                    </div>
                )}

                {/* ═══ 错误状态 ═══ */}
                {error && !isLoading && (
                    <div className="text-center py-20">
                        <div className="text-[#5A6A7F] text-sm">{error}</div>
                    </div>
                )}

                {/* ═══ 商品画廊网格 ═══ */}
                {!isLoading && !error && products.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product, index) => (
                            <div
                                key={product.id}
                                className="group relative"
                                style={{
                                    animation: `workshopCardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both`,
                                }}
                                onMouseEnter={() => handleProductHover(product)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <div
                                    className="rounded-xl overflow-hidden transition-all duration-500"
                                    style={{
                                        background: 'linear-gradient(145deg, #151E2B, #111923)',
                                        border: '1px solid #2A3441',
                                        boxShadow: hoveredId === product.id
                                            ? '0 16px 48px rgba(0,0,0,0.4), 0 0 24px rgba(176,141,87,0.06)'
                                            : '0 4px 16px rgba(0,0,0,0.2)',
                                        transform: hoveredId === product.id ? 'translateY(-4px)' : 'translateY(0)',
                                    }}
                                >
                                    {/* 商品图片 */}
                                    <div className="relative overflow-hidden aspect-[4/3]">
                                        <img
                                            src={getProductImage(product)}
                                            alt={product.name}
                                            className="w-full h-full transition-transform duration-700 ease-out"
                                            style={{
                                                objectFit: 'cover',
                                                transform: hoveredId === product.id ? 'scale(1.05)' : 'scale(1)',
                                                filter: 'grayscale(0.15) contrast(1.05)',
                                            }}
                                        />
                                        {/* 底部渐变遮罩 */}
                                        <div
                                            className="absolute inset-0 pointer-events-none"
                                            style={{
                                                background: 'linear-gradient(to top, #111923 0%, transparent 40%)',
                                            }}
                                        />
                                    </div>



                                    {/* 商品信息 */}
                                    <div className="p-5 pt-2">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3
                                                className="text-[#E5E0D8] text-lg font-semibold tracking-wider"
                                                style={{ fontFamily: "'Noto Serif SC', serif" }}
                                            >
                                                {product.name}
                                            </h3>

                                            <button
                                                onClick={(e) => handleLikeClick(product, e)}
                                                className="flex items-center gap-1.5 transition-all duration-300 group/like mt-1 cursor-pointer disabled:opacity-50"
                                                title={likedIds.includes(product.id) ? "取消喜欢" : "标记为喜欢"}
                                                disabled={toastMessage !== null}
                                            >
                                                <Heart
                                                    size={16}
                                                    className={`transition-all duration-500 ${likedIds.includes(product.id) ? 'fill-[#af292e] text-[#af292e] scale-110 drop-shadow-[0_0_8px_rgba(175,41,46,0.4)]' : 'text-[#4A5A6F] group-hover/like:text-[#af292e]'}`}
                                                />
                                                <span className={`text-xs font-medium tracking-widest transition-colors duration-300 ${likedIds.includes(product.id) ? 'text-[#af292e]' : 'text-[#4A5A6F] group-hover/like:text-[#af292e]'}`}>
                                                    {typeof product.likes_count === 'number' ? product.likes_count : 0}
                                                </span>
                                            </button>
                                        </div>

                                        <p className="text-[#6B7B8F] text-xs leading-relaxed mb-5 line-clamp-2">
                                            {product.description}
                                        </p>

                                        {/* CTA 按钮 */}
                                        <button
                                            onClick={(e) => handleBuyClick(product, e)}
                                            className="w-full py-3 rounded-lg text-sm tracking-[3px] font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group/btn"
                                            style={{
                                                background: hoveredId === product.id
                                                    ? 'linear-gradient(135deg, #af292e, #C93A3E)'
                                                    : 'linear-gradient(135deg, rgba(175,41,46,0.15), rgba(175,41,46,0.08))',
                                                color: hoveredId === product.id ? '#fff' : '#af292e',
                                                border: hoveredId === product.id
                                                    ? '1px solid #af292e'
                                                    : '1px solid rgba(175,41,46,0.2)',
                                                boxShadow: hoveredId === product.id
                                                    ? '0 4px 16px rgba(175,41,46,0.25)'
                                                    : 'none',
                                            }}
                                        >
                                            <Eye size={14} className="opacity-70" />
                                            赏 鉴
                                            <ExternalLink
                                                size={12}
                                                className="opacity-0 group-hover/btn:opacity-60 transition-opacity duration-200 -ml-1"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ═══ 空状态 ═══ */}
                {!isLoading && !error && products.length === 0 && (
                    <div className="text-center py-20">
                        <ShoppingBag size={40} className="text-[#2A3441] mx-auto mb-4" />
                        <div className="text-[#5A6A7F] text-sm tracking-wider">
                            造办处正在筹备中，敬请期待
                        </div>
                    </div>
                )}

                {/* ═══ 底部装饰 ═══ */}
                <div className="text-center mt-16 mb-8">
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-20 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #2A3441)' }} />
                        <div className="text-[#2A3441] text-xs tracking-[4px]">
                            ─── 器以载道 ───
                        </div>
                        <div className="w-20 h-[1px]" style={{ background: 'linear-gradient(90deg, #2A3441, transparent)' }} />
                    </div>
                    <div className="text-[#1E2A38] text-xs mt-3 opacity-40 tracking-wider">
                        点击"赏鉴"即跳转至合作电商平台 · 本站不参与任何交易环节
                    </div>
                </div>
            </div>

            {/* ═══ 内联动画 ═══ */}
            <style>{`
                @keyframes workshopCardIn {
                    from {
                        opacity: 0;
                        transform: translateY(24px) scale(0.96);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    );
}

export default ImperialWorkshop;
