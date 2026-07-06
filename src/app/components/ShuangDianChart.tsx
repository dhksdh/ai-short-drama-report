import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, X } from "lucide-react";
import sceneTemplateAnalysisHtml from "../../imports/pasted_text/scene-template-analysis.html?raw";

// 修正 chart02（蝴蝶图）纵轴：增大左右 grid 留白，缩小 axisLabel margin，
// 确保「反转/冲突/意外/登场」四条标签都能完整显示
const patchedHtml = sceneTemplateAnalysisHtml
  .replace(
    "grid: { left: '13%', right: '13%', top: 44, bottom: 46 },",
    "grid: { left: '18%', right: '18%', top: 44, bottom: 46 },"
  )
  .replace(
    "axisLabel: { color: '#F5C842', fontSize: 10, fontWeight: 'bold', margin: 20 },",
    "axisLabel: { color: '#F5C842', fontSize: 9, fontWeight: 'bold', margin: 8 },"
  );

// 爽点分析网页内部依赖的外部 CDN 脚本。首次打开常因这些脚本还在下载而空白，
// 需刷新整页才好——预热就是提前把它们抓进浏览器缓存，等 iframe 加载时直接命中缓存。
const SHUANGDIAN_CDN_SCRIPTS = [
  "https://cdn.tailwindcss.com",
  "https://registry.npmmirror.com/echarts/5.5.0/files/dist/echarts.min.js",
];
let shuangDianPreheated = false;
export function preheatShuangDian() {
  if (shuangDianPreheated || typeof document === "undefined") return;
  shuangDianPreheated = true;
  SHUANGDIAN_CDN_SCRIPTS.forEach((href) => {
    // rel=preload/as=script、不带 crossorigin，以匹配 iframe 内经典 <script src> 的 no-cors 请求，确保缓存复用
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "script";
    link.href = href;
    document.head.appendChild(link);
  });
}

export function ShuangDianChart({ onClose, isOpen = true }: { onClose: () => void; isOpen?: boolean }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showSlowHint, setShowSlowHint] = useState(false);

  useEffect(() => {
    preheatShuangDian();
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!isOpen) return;
      if (event.data === "backToDialogue" || event.data === "closeShuangDian") {
        onClose();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onClose, isOpen]);

  useEffect(() => {
    const slowTimer = window.setTimeout(() => setShowSlowHint(true), 2200);
    const safetyTimer = window.setTimeout(() => setIsLoading(false), 5200);
    return () => {
      window.clearTimeout(slowTimer);
      window.clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: isOpen ? 0.12 : 0 }}
      className={`absolute inset-0 z-[520] bg-black ${isOpen ? "pointer-events-auto cursor-default" : "pointer-events-none"}`}
      onClick={(e) => e.stopPropagation()}
    >
      {isOpen && isLoading && (
        <div className="pointer-events-none absolute inset-0 z-[530] flex flex-col items-center justify-center bg-[#0D0520] text-[#F5C842]">
          <Loader2 className="mb-4 animate-spin" size={28} />
          <div className="font-serif text-sm font-bold tracking-[0.35em]">加载爽点设置</div>
          {showSlowHint && (
            <div className="mt-3 max-w-md text-center text-xs leading-relaxed text-[#F5F0E8]/55">
              图表脚本正在通过预览代理加载，稍等即可显示原网页。
            </div>
          )}
        </div>
      )}

      {/* X 关闭按钮 — 覆盖在 iframe 右上角 */}
      {isOpen && (
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-[540] flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#F5C842]/85 bg-[#0D0520] text-[#F5C842] shadow-[0_0_0_2px_rgba(13,5,32,0.9),0_0_24px_rgba(245,200,66,0.42)] transition hover:scale-110 hover:bg-[#F5C842] hover:text-[#0D0520]"
          aria-label="关闭爽点设置"
        >
          <X size={24} strokeWidth={3} />
        </button>
      )}

      <iframe
        srcDoc={patchedHtml}
        title="片场模版 · 爽点分析"
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        onLoad={() => setIsLoading(false)}
      />
    </motion.div>
  );
}
