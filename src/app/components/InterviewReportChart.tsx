import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Loader2 } from "lucide-react";
import interviewHtmlRaw from "../../imports/pasted_text/ai-short-drama-interview.html?raw";

const injectedStyle = `
<style>
  html, body { scrollbar-gutter: stable; }
  body {
    background:
      radial-gradient(circle at 8% 18%, rgba(245, 200, 66, 0.09), transparent 28%),
      radial-gradient(circle at 88% 12%, rgba(126, 90, 168, 0.13), transparent 32%),
      linear-gradient(155deg, #0b0712 0%, #191024 48%, #0b0910 100%) !important;
  }
  header { padding: 42px 20px 28px !important; border-bottom-color: rgba(245,200,66,.18) !important; }
  .subtitle { max-width: 760px !important; color: rgba(245,240,232,.66) !important; }
  .container { max-width: 1180px !important; padding: 28px 28px 54px !important; }
  .interview-card {
    margin-bottom: 24px !important;
    border: 1px solid rgba(245,200,66,.16);
    border-radius: 22px;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(26,18,37,.78), rgba(13,8,18,.92));
    box-shadow: 0 18px 60px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.04);
    animation-duration: .36s !important;
  }
  .interview-card:nth-child(even) { background: linear-gradient(225deg, rgba(30,25,32,.88), rgba(19,11,31,.88)); }
  .illustration { min-height: 300px !important; width: 270px !important; }
  .illustration-bg {
    width: 210px !important;
    height: 210px !important;
    filter: blur(.2px);
    background: radial-gradient(circle, rgba(245,200,66,.16), rgba(107,91,149,.08) 52%, transparent 72%) !important;
  }
  .illustration-ring { width: 190px !important; height: 190px !important; border-color: rgba(245,200,66,.24) !important; }
  .person-svg { width: 170px !important; height: 238px !important; filter: drop-shadow(0 0 18px rgba(245,200,66,.12)); }
  .interview-card:nth-child(1) .person-svg { filter: drop-shadow(0 0 20px rgba(245,200,66,.22)); }
  .interview-card:nth-child(2) .person-svg { filter: drop-shadow(0 0 20px rgba(212,165,165,.22)); transform: rotate(-1deg); }
  .interview-card:nth-child(3) .person-svg { filter: drop-shadow(0 0 20px rgba(120,170,255,.18)); transform: scale(.98); }
  .interview-card:nth-child(4) .person-svg { filter: drop-shadow(0 0 20px rgba(232,180,184,.24)); transform: rotate(1deg); }
  .interview-card:nth-child(5) .person-svg { filter: drop-shadow(0 0 20px rgba(245,200,66,.18)); transform: scale(1.03); }
  .interview-card:nth-child(6) .person-svg { filter: drop-shadow(0 0 20px rgba(170,140,255,.22)); }
  .content { padding: 30px 34px !important; }
  .name { color: #f2d57b !important; text-shadow: 0 0 22px rgba(245,200,66,.14); }
  .role-tag { border-color: rgba(245,200,66,.28) !important; background: rgba(245,200,66,.08) !important; }
  .quote { color: rgba(245,240,232,.86) !important; line-height: 1.95 !important; }
  .highlight, .highlight-gold { text-shadow: 0 0 18px rgba(245,200,66,.12); }
  footer { padding: 8px 20px 42px !important; }
  @media (max-width: 820px) {
    .interview-card, .interview-card:nth-child(even) { flex-direction: column !important; }
    .illustration { width: 100% !important; min-height: 220px !important; }
    .content { padding: 24px !important; }
  }
</style>
`;

// 精确匹配赵优秀和陈霖贤两张卡片（从注释到下一张卡片的开头）
const ZHAO_CARD = /\s*<!-- 赵优秀[\s\S]*?<!-- 陈霖贤[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const CHEN_CARD = /\s*<!-- 陈霖贤[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

// 增强人物图形：加大 SVG 本体、提亮描边、加发光效果，与主题金色搭配
const enhancedAvatarStyle = `
<style>
  .person-svg {
    width: 200px !important;
    height: 280px !important;
    filter: drop-shadow(0 0 28px rgba(245,200,66,.28)) !important;
  }
  .person-svg circle, .person-svg path, .person-svg line, .person-svg rect, .person-svg ellipse {
    stroke-opacity: 1 !important;
    opacity: 1 !important;
  }
  .person-svg [stroke="#c9a84c"] { stroke: #F5C842 !important; stroke-width: 2px !important; }
  .person-svg [stroke="#d4a5a5"] { stroke: #E8C9A0 !important; stroke-width: 1.6px !important; }
  .illustration { min-height: 330px !important; width: 290px !important; background: radial-gradient(circle at 50% 50%, rgba(245,200,66,.07), transparent 70%) !important; }
  .illustration-ring { border-color: rgba(245,200,66,.35) !important; width: 210px !important; height: 210px !important; }
  .illustration-bg { background: radial-gradient(circle, rgba(245,200,66,.18), rgba(107,91,149,.10) 52%, transparent 72%) !important; width: 230px !important; height: 230px !important; }
  .name { color: #F5C842 !important; font-size: 1.25rem !important; letter-spacing: .06em !important; text-shadow: 0 0 28px rgba(245,200,66,.35) !important; }
  .role-tag { border-color: rgba(245,200,66,.4) !important; background: rgba(245,200,66,.12) !important; color: #F5E6C8 !important; font-size: .72rem !important; padding: 3px 10px !important; border-radius: 999px !important; }
  .company { color: rgba(245,230,200,.55) !important; font-size: .8rem !important; letter-spacing: .04em !important; margin-bottom: 14px !important; }
  .quote { color: rgba(245,240,232,.9) !important; line-height: 2 !important; font-size: .95rem !important; }
  .highlight { color: #FFE066 !important; }
  .highlight-gold { color: #F5C842 !important; font-weight: 700 !important; }
</style>
`;

export function InterviewReportChart({ onClose, isOpen = true }: { onClose: () => void; isOpen?: boolean }) {
  const [isLoading, setIsLoading] = useState(true);
  const srcDoc = useMemo(() => {
    let html = interviewHtmlRaw;
    // 删除赵优秀卡片（包含注释和整个 div）
    html = html.replace(
      /[ \t]*<!-- 赵优秀[\s\S]*?(?=[ \t]*<!-- 陈霖贤)/,
      ""
    );
    // 删除陈霖贤卡片
    html = html.replace(
      /[ \t]*<!-- 陈霖贤 - 从业者[\s\S]*?(?=[ \t]*<!-- 吴海明)/,
      ""
    );
    // 注入样式
    html = html.replace("</head>", `${injectedStyle}${enhancedAvatarStyle}</head>`);
    return html;
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => setIsLoading(false), 1200);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: isOpen ? 0.16 : 0 }}
      className={`absolute inset-0 z-[550] cursor-default bg-[#08060D] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
      onClick={(e) => e.stopPropagation()}
    >
      {isOpen && isLoading && (
        <div className="pointer-events-none absolute inset-0 z-[555] flex flex-col items-center justify-center bg-[#08060D] text-[#D4A843]">
          <Loader2 className="mb-4 animate-spin" size={28} />
          <div className="font-serif text-sm font-bold tracking-[0.35em]">加载访谈报告</div>
        </div>
      )}
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          className="absolute left-6 top-6 z-[560] flex items-center gap-2 rounded-full border border-[#D4A843]/35 bg-[#111114]/85 px-4 py-2 text-xs font-bold tracking-widest text-[#D4A843] shadow-[0_0_24px_rgba(0,0,0,0.55)] backdrop-blur-md transition hover:bg-[#D4A843]/15"
        >
          <ChevronLeft size={14} /> 跳转到对话
        </button>
      )}
      <iframe
        srcDoc={srcDoc}
        title="AI短剧人物访谈报告"
        loading="eager"
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups"
        onLoad={() => setIsLoading(false)}
      />
    </motion.div>
  );
}
