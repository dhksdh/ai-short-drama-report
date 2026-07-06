import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { workflowHtml as rawHtml } from "../html-assets";

// 工作流程 iframe 内依赖的外部 CDN，预热避免首次打开空白
const WORKFLOW_CDN = [
  "https://cdn.tailwindcss.com",
  "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700;900&family=Inter:wght@300;400;600;800&display=swap",
];
let workflowPreheated = false;
export function preheatWorkflow() {
  if (workflowPreheated || typeof document === "undefined") return;
  workflowPreheated = true;
  WORKFLOW_CDN.forEach((href) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = href.includes("fonts.googleapis") ? "style" : "script";
    link.href = href;
    document.head.appendChild(link);
  });
}

const FLOW_SVG_HTML = "<svg viewBox=\"0 0 320 286\" xmlns=\"http://www.w3.org/2000/svg\" aria-label=\"AI 电脑图标\">\n  <defs>\n    <linearGradient id=\"pcScreen\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#2D1B4E\"/><stop offset=\"1\" stop-color=\"#0D0520\"/></linearGradient>\n    <linearGradient id=\"pcGold\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#FFE066\"/><stop offset=\"1\" stop-color=\"#F5BD20\"/></linearGradient>\n    <filter id=\"pcGlow\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"3\" result=\"blur\"/><feMerge><feMergeNode in=\"blur\"/><feMergeNode in=\"SourceGraphic\"/></feMerge></filter>\n  </defs>\n  <rect x=\"30\" y=\"40\" width=\"260\" height=\"170\" rx=\"12\" fill=\"#1A0F2E\" stroke=\"url(#pcGold)\" stroke-width=\"3\"/>\n  <rect x=\"44\" y=\"54\" width=\"232\" height=\"142\" rx=\"6\" fill=\"url(#pcScreen)\" stroke=\"#F5C842\" stroke-width=\"1.2\" opacity=\"0.9\"/>\n  <g filter=\"url(#pcGlow)\">\n    <text x=\"160\" y=\"148\" text-anchor=\"middle\" fill=\"#F5C842\" font-family=\"Inter,Noto Serif SC,serif\" font-size=\"78\" font-weight=\"900\" letter-spacing=\"4\">AI</text>\n  </g>\n  <rect x=\"140\" y=\"210\" width=\"40\" height=\"18\" fill=\"#1A0F2E\" stroke=\"url(#pcGold)\" stroke-width=\"2\"/>\n  <rect x=\"92\" y=\"228\" width=\"136\" height=\"14\" rx=\"4\" fill=\"#1A0F2E\" stroke=\"url(#pcGold)\" stroke-width=\"2\"/>\n</svg>";

const RETURN_SCRIPT = `
<script>
(function(){
  var FLOW_SVG_HTML = ${JSON.stringify(FLOW_SVG_HTML)};
  function notify(e){ if(e){e.preventDefault();e.stopPropagation();} try{ parent.postMessage({ type: 'close-workflow' },'*'); }catch(err){} }
  function replaceClapperWithFlow(){
    var wrap = document.getElementById('clapperWrap');
    if(!wrap || wrap.dataset.flowIcon === '1') return;
    wrap.dataset.flowIcon = '1';
    wrap.classList.remove('open');
    wrap.innerHTML = FLOW_SVG_HTML;
  }
  function bind(){
    replaceClapperWithFlow();
    setTimeout(replaceClapperWithFlow, 120);
    setTimeout(replaceClapperWithFlow, 600);
    var el = document.getElementById('clapToggle');
    if(el){ el.textContent='返回对话'; el.addEventListener('click', notify, true); }
    Array.prototype.forEach.call(document.querySelectorAll('[data-return]'), function(b){ b.addEventListener('click', notify, true); });
  }
  if(document.readyState!=='loading'){ bind(); } else { document.addEventListener('DOMContentLoaded', bind); }
})();
<\/script>
`;

const workflowHtml = rawHtml.includes("</body>")
  ? rawHtml.replace("点击返回片场", "返回对话").replace("</body>", RETURN_SCRIPT + "</body>")
  : rawHtml.replace("点击返回片场", "返回对话") + RETURN_SCRIPT;

export function WorkflowChart({ onClose, isOpen = true }: { onClose: () => void; isOpen?: boolean }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showSlowHint, setShowSlowHint] = useState(false);

  useEffect(() => {
    preheatWorkflow();
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!isOpen) return;
      const data = e.data as unknown;
      if (data === "close-workflow" || (typeof data === "object" && data !== null && (data as { type?: string }).type === "close-workflow")) {
        onClose();
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onClose, isOpen]);

  useEffect(() => {
    const slowTimer = window.setTimeout(() => setShowSlowHint(true), 1800);
    const safetyTimer = window.setTimeout(() => setIsLoading(false), 4200);
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
          <div className="font-serif text-sm font-bold tracking-[0.35em]">加载 AI 短剧工作流程</div>
          {showSlowHint && (
            <div className="mt-3 max-w-md text-center text-xs leading-relaxed text-[#F5F0E8]/55">
              正在预热页面资源，稍等即可显示原网页。
            </div>
          )}
        </div>
      )}

      <iframe
        srcDoc={workflowHtml}
        title="片场 · AI 漫剧生产线"
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        onLoad={() => setIsLoading(false)}
      />
    </motion.div>
  );
}
