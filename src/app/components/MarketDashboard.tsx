import React, { useMemo, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import realAiDramaDashboardHtml from "../../imports/pasted_text/real-ai-drama-dashboard.html?raw";

// 预热：进入序幕场景时提前把 echarts CDN 抓进浏览器缓存，
// 避免首次点击"查看行业数据看板"时 iframe 因脚本未到而空白
const DASHBOARD_CDN = [
  "https://registry.npmmirror.com/echarts/5.5.0/files/dist/echarts.min.js",
];
let dashboardPreheated = false;
export function preheatMarketDashboard() {
  if (dashboardPreheated || typeof document === "undefined") return;
  dashboardPreheated = true;
  DASHBOARD_CDN.forEach((href) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "script";
    link.href = href;
    document.head.appendChild(link);
  });
}

const iframeFitStyle = `
<style>
  html, body { overflow: hidden !important; }
  body::-webkit-scrollbar, .main-stage::-webkit-scrollbar, .slide::-webkit-scrollbar { display: none !important; }
  .click-hint { display: none !important; }
  .main-stage {
    padding: 24px 50px 26px !important;
    overflow: hidden !important;
  }
  .slides-wrapper { justify-content: center !important; }
  .slide {
    overflow: hidden !important;
    padding-top: 6px !important;
    padding-bottom: 6px !important;
  }
  #slide-compare { justify-content: center !important; }
  .compare-layout {
    width: 100% !important;
    max-width: 850px !important;
    height: calc(100vh - 96px) !important; min-height: 0 !important; max-height: calc(100vh - 44px) !important;
    gap: 14px !important;
    align-items: stretch !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
  }
  .compare-panel {
    min-width: 0 !important;
    width: 50% !important;
    flex: 1 1 0 !important;
    padding: 9px 10px 10px !important;
    justify-content: flex-start !important;
    height: 100% !important;
    max-height: none !important;
  }
  .compare-panel .panel-title {
    font-size: 15px !important;
    line-height: 1.28 !important;
    letter-spacing: 1px !important;
    margin-bottom: 2px !important;
  }
  .compare-panel .panel-sub {
    font-size: 7px !important;
    letter-spacing: 1px !important;
    margin-bottom: 10px !important;
  }
  .kpi-grid-2x2 {
    gap: 5px !important;
  }
  .kpi-grid-2x2 .kpi-card {
    padding: 7px 9px !important;
  }
  .kpi-grid-2x2 .kpi-value {
    font-size: 22px !important;
    line-height: 1.05 !important;
  }
  .kpi-grid-2x2 .kpi-label {
    font-size: 8px !important;
    line-height: 1.35 !important;
    margin-bottom: 2px !important;
  }
  .kpi-grid-2x2 .kpi-sub {
    font-size: 8px !important;
    line-height: 1.35 !important;
  }
  .kpi-grid-2x2 .kpi-tag {
    font-size: 8px !important;
    margin-top: 4px !important;
    padding: 1px 3px !important;
  }
  .nav-arrow { width: 30px !important; height: 30px !important; }
  .nav-arrow-left { left: 14px !important; }
  .nav-arrow-right { right: 14px !important; }
  
  .board-frame {
    position: fixed !important;
    top: 10px !important; left: 10px !important;
    right: 10px !important; bottom: 10px !important;
    z-index: 100 !important;
    pointer-events: none !important;
    border-radius: 24px !important;
    border: 2.5px solid rgba(245, 200, 66, 0.75) !important;
    box-shadow: inset 0 0 60px rgba(245, 200, 66, 0.04), 0 0 30px rgba(245, 200, 66, 0.06), 0 0 2px rgba(245, 200, 66, 0.2) !important;
  }
  .board-clip {
    display: block !important;
    position: fixed !important;
    left: 50% !important;
    top: 8px !important;
    transform: translateX(-50%) !important;
    z-index: 101 !important;
    pointer-events: none !important;
    width: 200px !important;
    height: 20px !important;
    background: linear-gradient(180deg, rgba(245, 200, 66, 0.55) 0%, rgba(200, 160, 50, 0.40) 100%) !important;
    border: 1px solid rgba(245, 200, 66, 0.35) !important;
    border-radius: 6px 6px 3px 3px !important;
    box-shadow: 0 2px 12px rgba(245, 200, 66, 0.15) !important;
    backdrop-filter: blur(6px) !important;
  }
  .chart-wrapper { max-width: 740px !important; }
  .chart-card { padding: 14px 16px 12px !important; }
  .chart-container { height: 300px !important; }
  .chart-card h3 { font-size: 12px !important; margin-bottom: 6px !important; }
  .section-header { margin-bottom: 6px !important; }
  .section-header h2 { font-size: 22px !important; margin-bottom: 2px !important; }
  .section-header p { font-size: 8px !important; }
  #slide-compare .compare-panel { border-radius: 10px !important; }
  #slide-compare .compare-panel.real { border-top-width: 4px !important; }
  #slide-compare .compare-panel.ai { border-top-width: 4px !important; }
  #slide-compare .kpi-card { border-radius: 6px !important; box-shadow: 0 0 12px rgba(0,0,0,0.32) !important; }
  #slide-compare .kpi-grid-2x2 { grid-template-rows: repeat(2, minmax(0, 1fr)) !important; flex: 1 1 auto !important; }
  #slide-compare .kpi-card .kpi-value { margin: 2px 0 1px !important; letter-spacing: -0.5px !important; }
  #slide-compare .kpi-card { min-height: 0 !important; height: 100% !important; justify-content: center !important; }
  #slide-compare .kpi-card .kpi-label, #slide-compare .kpi-card .kpi-sub { max-width: 100% !important; }
  #slide-chart .section-header { margin-bottom: 4px !important; }
  #slide-chart .chart-wrapper { padding-top: 58px !important; }
  #slide-chart .chart-card { transform: translateY(-28px); }
  @media (min-width: 900px) {
    #slide-compare .compare-layout { transform: scale(0.74); transform-origin: center center; }
    #slide-chart .chart-wrapper { transform: scale(0.88); transform-origin: center top; }
  }
</style>
<script>
document.addEventListener('DOMContentLoaded', function() {
  var check = setInterval(function() {
    var nextBtn = document.getElementById('nextBtn');
    var prevBtn = document.getElementById('prevBtn');
    if (!nextBtn || !prevBtn) return;
    clearInterval(check);
    var slides = document.querySelectorAll('.slide');
    var total = slides.length;
    function syncArrows() {
      var current = 0;
      slides.forEach(function(s, i) { if (s.classList.contains('active')) current = i; });
      prevBtn.style.opacity = current === 0 ? '0' : '1';
      prevBtn.style.pointerEvents = current === 0 ? 'none' : 'auto';
      nextBtn.style.opacity = current === total - 1 ? '0' : '1';
      nextBtn.style.pointerEvents = current === total - 1 ? 'none' : 'auto';
    }
    var observer = new MutationObserver(syncArrows);
    slides.forEach(function(s) { observer.observe(s, { attributes: true, attributeFilter: ['class'] }); });
    syncArrows();
  }, 50);
});
</script>
`;

export function MarketDashboard({ onBack }: { onBack?: () => void }) {
  useEffect(() => { preheatMarketDashboard(); }, []);

  const srcDoc = useMemo(
    () => realAiDramaDashboardHtml
      .replace("真人短剧行业运营难度持续加大", "真人短剧危机")
      .replace("AI短剧市场持续拓展", "AI短剧爆发")
      .replace("</head>", `${iframeFitStyle}</head>`),
    []
  );

  return (
    <div
      className="relative h-[min(72vh,580px)] w-full max-w-[1020px] overflow-hidden bg-[#0a0612] text-[#E9DCA5] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
      onClick={(e) => e.stopPropagation()}
    >
      {onBack && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onBack();
          }}
          className="absolute bottom-3 left-3 z-[90] flex items-center gap-2 rounded-full border border-[#F5BD20]/35 bg-[#271F1E]/85 px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#F5BD20] shadow-lg backdrop-blur-md transition hover:bg-[#F5BD20]/15"
        >
          <ChevronLeft size={12} /> 返回
        </button>
      )}

      <iframe
        title="真人与AI短剧数据看板"
        srcDoc={srcDoc}
        className="h-full w-full border-0 bg-[#0a0612]"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        loading="eager"
      />
    </div>
  );
}
