import { useEffect } from "react";

/**
 * 弹窗打开时锁住 snap 容器，防止移动端滑动误翻页。
 * locked 为 true 时禁止滚动，false 时恢复。
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    const container = document.querySelector(".snap-container") as HTMLElement | null;
    if (!container) return;
    if (locked) {
      container.style.overflow = "hidden";
    } else {
      container.style.overflow = "";
    }
    return () => {
      container.style.overflow = "";
    };
  }, [locked]);
}
