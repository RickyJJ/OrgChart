import { useEffect } from 'react';

/**
 * useBodyScrollLock - 锁定 Body 滚动
 * 用于在 Bottom Sheet 打开时防止背景（画布）被滚动/拖动
 */
export function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (isLocked) {
      // 记录当前 overflow，以便回滚
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      // 添加一个特定类名，以便全局控制（如 HierarchyTree 如果用了 touch-action: none 以外的手段控制画布）
      document.documentElement.classList.add('body-scroll-locked');
      
      return () => {
        document.body.style.overflow = originalStyle;
        document.documentElement.classList.remove('body-scroll-locked');
      };
    }
  }, [isLocked]);
}
