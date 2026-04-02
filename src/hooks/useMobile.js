import { useState, useEffect } from 'react';

/**
 * useMobile - 移动端检测钩子
 * 基准设定为 768px (同 Tailwind md: 断点)
 */
export function useMobile() {
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
