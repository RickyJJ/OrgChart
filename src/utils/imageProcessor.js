/**
 * 图像处理工具集 (Image Processing Utilities)
 */

/**
 * 前端无感像素抠图：动态剔除印章/图像的亮色背景 (解决 html2canvas 忽略 blend-mode 的问题)
 * 基于通道阈值算法，动态从绿色通道生成真正的透明通道 (Alpha)，平滑抹除图像毛边。
 * 
 * @param {string} src - 图像的路径或 URL
 * @param {Object} options - 抠图算法参数
 * @param {number} options.greenThreshold - 绿通道检测阈值 (默认 70，高于此值开始渐变透明)
 * @param {number} options.falloff - 边缘羽化过渡范围 (默认 130)
 * @returns {Promise<string>} - 返回包含透明背景的 base64 图像数据 (Data URL)
 */
export const processAlphaMask = (src, options = {}) => {
    const { greenThreshold = 70, falloff = 130 } = options;

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = src;
        
        img.onload = () => {
            try {
                // 创建不可见的离屏 Canvas 容器
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(img, 0, 0);
                
                // 提取物理像素矩阵
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                
                // 遍历像素进行抠图处理 (针对红色系印泥优化)
                // 原理：因为朱红印泥几乎没有绿色通道，而原本图片渲染的白色背景/噪点包含极高强度的绿色。
                for (let i = 0; i < data.length; i += 4) {
                    const g = data[i + 1]; // 绿通道值
                    
                    if (g > greenThreshold) {
                        const alphaFactor = Math.max(0, 1.0 - (g - greenThreshold) / falloff);
                        data[i + 3] = data[i + 3] * alphaFactor;
                    }
                }
                
                // 回填像素并输出真正的背景透明 base64 PNG
                ctx.putImageData(imgData, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            } catch (e) {
                console.warn("[Image Processor] Cross-origin block or render fail, fallback to original image.", e);
                resolve(src); // 发生跨域污染或绘制异常时，降级原样返回
            }
        };
        
        img.onerror = (e) => reject(new Error('Failed to load image for processing: ' + src));
    });
};
