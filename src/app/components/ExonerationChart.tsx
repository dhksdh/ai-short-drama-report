import React, { useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
// Import the crisis HTML as a raw string so it works regardless of how
// static files are served by the preview proxy. Rendered via iframe srcDoc.
import { shortDramaCrisisHtml as crisisHtml } from "../html-assets";

export function ExonerationChart({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Listen for the "close" message from the iframe
      if (event.data === "closeExoneration" || event.data === "backToStudio") {
        onClose();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[550] cursor-default bg-[#4C3C49]"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute left-6 top-6 z-[560] flex items-center gap-2 rounded-full border border-[#F5BD20]/35 bg-[#271F1E]/85 px-4 py-2 text-xs font-bold tracking-widest text-[#F5BD20] shadow-[0_0_20px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:bg-[#F5BD20]/15"
      >
        <ChevronLeft size={14} /> 返回对话
      </button>

      <iframe
        srcDoc={crisisHtml}
        title="真人短剧行业困境 — 四幕数据可视化"
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </motion.div>
  );
}
