import React, { useEffect, useRef, useState } from "react";
import { useScrollLock } from "../hooks/useScrollLock";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft, ChevronDown, FileText, Trophy, X, ShieldAlert, Volume2, VolumeX } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { InterviewReportChart } from "./InterviewReportChart";
import { JiyuPanel, preheatJiyu } from "./JiyuPanel";
import imgLin from "../../imports/255e3201021893d45473e734dffd6296.png";
import imgGui from "../../imports/b9e12d1e735ad5df9661ec895c84c088.jpg";
import avatarGui from "../../imports/c9798d1fbc83b61645654e2f76bea038-1.jpg";
import avatarLin from "../../imports/fa0706fed8fcda03e647959e2506d84b.jpg";
import aestheticBackground from "../../imports/_____20260626111646_3499_383_compressed.png";
import { audioAssets } from "../../audio";
import cover1 from "../data/showcase-covers/cover1.txt?raw";
import cover2 from "../data/showcase-covers/cover2.txt?raw";
import cover3 from "../data/showcase-covers/cover3.txt?raw";
import cover4 from "../data/showcase-covers/cover4.txt?raw";
import cover5 from "../data/showcase-covers/cover5.txt?raw";
import aiShortDramaReviewsHtml from "../../imports/pasted_text/ai-short-drama-reviews.html?raw";
import gif1 from "../../imports/五个gif/斩仙台下_edited.gif";
import gif2 from "../../imports/五个gif/有山灵_edited.gif";
import gif3 from "../../imports/五个gif/太阳坠落之时_edited.gif";
import gif4 from "../../imports/五个gif/新世界加载中_edited.gif";
import gif5 from "../../imports/五个gif/风水天师_edited.gif";

const showcaseData = [
  { title: '斩仙台下，我震惊了诸神', subtitle: '漫谈动漫', stats: '播放量超10亿，抖音投流日耗破2000万', desc: 'AI仿真人画风重制漫剧爆款，动态镜头与粒子特效媲美真人剧。现代人穿越神话，因果编辑器颠覆封神叙事。', image: cover1, gif: gif1, tags: ['玄幻仙侠'], bg: '#75656E', descColor: '#FDF6E3' },
  { title: '有山灵', subtitle: '与光同尘', stats: '播放量超千万，斩获尼泊尔国际电影节最佳AI影片奖', desc: '以《山海经》为蓝本，讲述小妖心性修炼，0手绘0三维0渲染，全AIGC国风制作，画面极具东方美学。', image: cover2, gif: gif2, tags: ['志怪奇幻'], bg: '#5D4D56', descColor: '#F3E9C4' },
  { title: '太阳坠落之时', subtitle: '悟空AI', stats: '全网播放量突破2000万', desc: '全流程AIGC制作，3个月完成30集，改编自星云奖科幻IP，涵盖50+角色、200余处场景，使用空间站化为轨道武器的宏大灾难设定。', image: cover3, gif: gif3, tags: ['硬核科幻'], bg: '#4C3C49', descColor: '#E9DCA5' },
  { title: '新世界加载中', subtitle: '异类工作室', stats: '全网曝光超13.7亿', desc: '7部单元剧横跨科幻/奇幻/荒诞喜剧/历史，画风从东方美学到赛博朋克自由切换。全球首部AI单元故事集，总长180分钟。', image: cover4, gif: gif4, tags: ['多元幻想'], bg: '#3B2B38', descColor: '#DDD0A0' },
  { title: '风水天师', subtitle: '时刻互动', stats: '第一季12小时破亿、累计近6亿', desc: '微表情细腻、斗法特效对标院线仙侠电影。唐季礼任总监制，第二季融入东北五仙传说，家国情怀升级。', image: cover5, gif: gif5, tags: ['玄幻民国'], bg: '#2A1A27', descColor: '#D1C495' },
];

function AiDramaShowcase({ onClose }: { onClose: () => void }) {
  const [gifModal, setGifModal] = useState<{ src: string; name: string; role: string } | null>(null);
  const [gifLoaded, setGifLoaded] = useState(false);
  const [preloadedGifs] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    showcaseData.forEach((item) => {
      const img = new Image();
      img.onload = () => preloadedGifs.add(item.gif);
      img.src = item.gif;
    });
  }, [preloadedGifs]);

  const openGif = (item: typeof showcaseData[0]) => {
    setGifLoaded(preloadedGifs.has(item.gif));
    setGifModal({ src: item.gif, name: item.title, role: item.subtitle });
  };

  return (
    <div className="absolute inset-0 z-[545] overflow-hidden" style={{ background: '#0d0d14', fontFamily: "'Noto Sans SC', sans-serif", color: '#F5BD20' }}>
      <style>{`@keyframes ai-drama-spin { to { transform: rotate(360deg); } }`}</style>

      <div className="mx-auto flex h-full w-full max-w-[1400px] flex-col px-6 py-4">
        <div className="relative shrink-0 text-center" style={{ marginBottom: 12 }}>
          <div className="mb-2 flex items-center justify-center gap-3">
            <div style={{ height: 1, width: 80, background: 'linear-gradient(to right, transparent, rgba(245,189,32,0.5))' }} />
            <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'rgba(245,189,32,0.7)' }} />
            <div style={{ height: 1, width: 80, background: 'linear-gradient(to left, transparent, rgba(245,189,32,0.5))' }} />
          </div>
          <h1 className="font-serif" style={{ fontSize: 24, fontWeight: 900, letterSpacing: '0.32em', marginBottom: 4, color: '#F5BD20', textShadow: '0 0 24px rgba(245,189,32,0.35)' }}>
            AI 短剧 · 精品案例
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span style={{ display: 'inline-block', width: 3, height: 3, borderRadius: '50%', background: 'rgba(245,189,32,0.6)' }} />
            <p className="font-serif" style={{ fontSize: 10, color: 'rgba(245,189,32,0.7)', letterSpacing: '0.28em' }}>点击卡片，查看剧集动态预览</p>
            <span style={{ display: 'inline-block', width: 3, height: 3, borderRadius: '50%', background: 'rgba(245,189,32,0.6)' }} />
          </div>
        </div>

        <div className="grid min-h-0 flex-1 gap-3" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
          {showcaseData.map((item) => (
            <div
              key={item.title}
              onClick={() => openGif(item)}
              className="group flex min-h-0 cursor-pointer flex-col overflow-hidden"
              style={{ borderRadius: 10, border: '1px solid rgba(245,189,32,0.12)', background: item.bg }}
            >
              <div className="relative min-h-0 flex-1 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F5BD20', color: '#0d0d14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, boxShadow: '0 4px 20px rgba(245,189,32,0.4)' }}>▶</div>
                </div>
              </div>
              <div className="shrink-0" style={{ padding: '6px 9px 3px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#F5BD20', marginBottom: 2, letterSpacing: 0.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                <div style={{ fontSize: 9, color: 'rgba(245,189,32,0.55)', marginBottom: 3 }}>制作方：{item.subtitle}</div>
                <div style={{ fontSize: 9, fontWeight: 600, color: '#F5BD20', background: 'rgba(245,189,32,0.1)', borderLeft: '3px solid #F5BD20', padding: '3px 6px', marginBottom: 3, borderRadius: '0 4px 4px 0', lineHeight: 1.3 }}>📊 {item.stats}</div>
                <div style={{ fontSize: 9, lineHeight: 1.35, color: item.descColor, opacity: 0.9, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.desc}</div>
              </div>
              <div className="shrink-0" style={{ display: 'flex', flexWrap: 'wrap', gap: 3, padding: '2px 9px 6px' }}>
                {item.tags.map(t => (
                  <span key={t} style={{ fontSize: 8, padding: '2px 6px', borderRadius: 20, background: 'rgba(245,189,32,0.12)', color: '#F5BD20', border: '1px solid rgba(245,189,32,0.25)' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {gifModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }} onClick={() => setGifModal(null)}>
          <div className="relative flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button onClick={() => setGifModal(null)} className="absolute -top-10 right-0" style={{ color: 'rgba(245,189,32,0.7)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 28 }}>✕</button>
            {!gifLoaded && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 40, height: 40, border: '3px solid rgba(245,189,32,0.2)', borderTopColor: '#F5BD20', borderRadius: '50%', animation: 'ai-drama-spin 0.8s linear infinite' }} />}
            <img
              src={gifModal.src}
              alt={gifModal.name}
              onLoad={() => setGifLoaded(true)}
              onError={() => setGifLoaded(true)}
              style={{ maxWidth: '90vw', maxHeight: '78vh', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.8)', opacity: gifLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
            />
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <span style={{ color: '#F5BD20', fontSize: 20, fontWeight: 700, display: 'block', marginBottom: 4 }}>{gifModal.name}</span>
              <span style={{ color: 'rgba(245,189,32,0.7)', fontSize: 13 }}>{gifModal.role}</span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onClose}
        className="fixed right-5 top-5 z-[610] flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[rgba(245,189,32,0.2)]"
        style={{ border: '1px solid rgba(245,189,32,0.4)', background: 'rgba(13,13,20,0.85)', color: '#F5BD20', backdropFilter: 'blur(4px)' }}
      >
        ✕
      </button>
    </div>
  );
}



function AiShortDramaReportOverlay({ onClose, isOpen = true }: { onClose: () => void; isOpen?: boolean }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "closeAiShortDramaReport") {
        onClose();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onClose]);

  const srcDoc = React.useMemo(() => {
    const closePatch = `document.getElementById('closeBtn').addEventListener('click', (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        window.parent.postMessage('closeAiShortDramaReport', '*');
      });`;

    return aiShortDramaReviewsHtml.replace(
      `document.getElementById('closeBtn').addEventListener('click', () => {
        if (window.opener) window.close();
        else window.location.href = 'about:blank';
      });`,
      closePatch
    ).replace(
      "</body>",
      `<script>
        (function(){
          function wireClose(){
            var btn = document.getElementById('closeBtn');
            if (!btn || btn.dataset.dialogueWired === '1') return;
            btn.dataset.dialogueWired = '1';
            btn.onclick = function(e){
              if (e) { e.preventDefault(); e.stopPropagation(); }
              window.parent.postMessage('closeAiShortDramaReport', '*');
              return false;
            };
            btn.addEventListener('click', function(e){
              e.preventDefault();
              e.stopImmediatePropagation();
              window.parent.postMessage('closeAiShortDramaReport', '*');
              return false;
            }, true);
          }
          wireClose();
          setTimeout(wireClose, 300);
          setTimeout(wireClose, 1000);
        })();
      <\/script></body>`
    );
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: isOpen ? 0.12 : 0 }}
      className={`absolute inset-0 z-[560] bg-black ${isOpen ? "pointer-events-auto cursor-default" : "pointer-events-none"}`}
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {isOpen && !isReady && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#1a0f28] text-[#c4a24a]">
          <div className="font-serif text-sm font-bold tracking-[0.35em]">加载 AI 短剧劝退密码解析</div>
        </div>
      )}

      <iframe
        title="AI短剧劝退密码解析"
        srcDoc={srcDoc}
        loading="eager"
        className="h-full w-full border-0 bg-black"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        onLoad={() => setIsReady(true)}
      />
    </motion.div>
  );
}

const audioUrls = audioAssets.extra2;

const script = [
  {
    name: '林野',
    avatar: avatarLin,
    text: '不过你看，群众的眼睛是雪亮的，我心里也一直过不去这道坎：AI技术越成熟，越方便各路人马去粗制滥造，这样下去恐怕只会不断拉低行业的下限啊。',
    color: '#D4A843'
  },
  {
    name: '贵哥',
    avatar: avatarGui,
    text: '您说的没错。AI确实方便了低质内容的批量生产，但它同时也提高了制作者审美的门槛。这是调研小组本季度的优秀案例，请您过目。',
    color: '#E67E22'
  },
  {
    name: '贵哥',
    avatar: avatarGui,
    text: '就像您说的，AI把硬件、成本和规模的门槛都打碎了。像咱们这样的中游公司，也能靠小团队、低成本做出像样的内容。但是从去年起，各个短剧平台就开始收紧内容审核，推行择优上线，观众的眼光也在变得狠辣，新剧目的爆款率每个月都在递减。',
    color: '#E67E22'
  },
  {
    name: '林野',
    avatar: avatarLin,
    text: '……这画面，这镜头调度，这些片子……真的是AI做的？',
    color: '#D4A843'
  },
  {
    name: '贵哥',
    avatar: avatarGui,
    text: '可不是，我看到的时候也觉得很惊讶。调研小组的结论是AI短剧中的精品会越来越接近传统短剧的品质，但效率更高、成本更可控，这对咱整个行业来说是好事：只追流量不抠内容的决策者很快就会失去竞争力。',
    color: '#E67E22'
  },
  {
    name: '贵哥',
    avatar: avatarGui,
    text: '来看看公司的调研小组得到的访谈结果吧',
    showInterviewReportAction: true,
    color: '#E67E22'
  },
  {
    name: '林野',
    avatar: avatarLin,
    text: `我明白了……`,
    color: '#D4A843'
  },
  {
    name: '林野',
    avatar: avatarLin,
    text: `创作者的观念与审美，才是决定一部剧好不好看的关键。
之前我对AI的那些意见……我真正反感的，大概是用着新技术生产烂片的家伙吧。`,
    color: '#D4A843',
    isPenultimate: true,
  },

  {
    name: '贵哥',
    avatar: avatarGui,
    text: '换言之，老板，梦该醒了。',
    color: '#E67E22',
  }
];


export function SceneStudioExtra2({ isActive }: { isActive?: boolean }) {
  const [step, setStep] = useState(0);
  const [showEpilogue, setShowEpilogue] = useState(false);
  const [showExcellentCases, setShowExcellentCases] = useState(false);
  const [showInterviewReport, setShowInterviewReport] = useState(false);
  const [showAiShortDramaReport, setShowAiShortDramaReport] = useState(false);
  const [showJiyu, setShowJiyu] = useState(false);

  const audioMapRef = useRef<Map<number, HTMLAudioElement>>(new Map());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMutedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);

  useEffect(() => {
    const map = new Map<number, HTMLAudioElement>();
    audioUrls.forEach((url, idx) => {
      if (!url) return;
      const a = new Audio(url);
      a.preload = "auto";
      a.addEventListener("error", () => setAudioFailed(true));
      map.set(idx, a);
    });
    audioMapRef.current = map;
    return () => { map.forEach(a => a.pause()); map.clear(); };
  }, []);

  useEffect(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (!isActive) return;
    const audio = audioMapRef.current.get(safeStep);
    if (!audio) {
      setAudioFailed(false);
      return;
    }
    setAudioFailed(false);
    audio.muted = isMutedRef.current;
    audio.currentTime = 0;
    audioRef.current = audio;
    audio.play().catch(() => setAudioFailed(true));
  }, [isActive, step]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isMutedRef.current;
    isMutedRef.current = next;
    setIsMuted(next);
    if (audioRef.current) audioRef.current.muted = next;
  };

  useEffect(() => {
    showcaseData.forEach((item) => {
      const img = new Image();
      img.src = item.gif;
    });
    preheatJiyu();
  }, []);

  useScrollLock(showEpilogue || showExcellentCases || showInterviewReport || showAiShortDramaReport || showJiyu);

  useEffect(() => {
    if (!isActive) return;
    setStep(0);
    setShowEpilogue(false);
    setShowExcellentCases(false);
    setShowInterviewReport(false);
    setShowAiShortDramaReport(false);
    setShowJiyu(false);
  }, [isActive]);

  const safeStep = Math.min(step, script.length - 1);
  const currentScript = script[safeStep];
  const isAiShortDramaReportStep = safeStep === 0 && currentScript.name === '林野';
  const shouldMountAiShortDramaReport = isAiShortDramaReportStep || showAiShortDramaReport;
  const isExcellentCasesStep = safeStep === 1 && currentScript.name === '贵哥';
  const isFinalJumpStep = safeStep === script.length - 1 && currentScript.name === '贵哥' && currentScript.text.startsWith('换言之');
  const isJiyuStep = safeStep === 7 && currentScript.name === '林野';

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (showExcellentCases || showInterviewReport || showAiShortDramaReport || showEpilogue || showJiyu) return;
    if (currentScript.isPenultimate && !showEpilogue) {
      setShowEpilogue(true);
      return;
    }
    if (safeStep === script.length - 1) {
      window.dispatchEvent(new CustomEvent("scrollToSection", { detail: { index: 9 } }));
      return;
    }
    setStep((prev) => Math.min(prev + 1, script.length - 1));
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (showExcellentCases || showInterviewReport || showAiShortDramaReport || showEpilogue || showJiyu) return;
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleJumpToNextPage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.dispatchEvent(new CustomEvent("scrollToSection", { detail: { index: 9 } }));
  };

  return (
    <motion.div className="relative h-full w-full overflow-hidden bg-transparent cursor-pointer" onClick={(e) => handleNext(e)}>
      <InterviewReportChart
        isOpen={showInterviewReport}
        onClose={() => setShowInterviewReport(false)}
      />

      {/* 寄语面板：进入场景起常驻挂载预热 */}
      <JiyuPanel isOpen={showJiyu} onClose={() => setShowJiyu(false)} />

      {shouldMountAiShortDramaReport && (
        <AiShortDramaReportOverlay
          isOpen={showAiShortDramaReport}
          onClose={() => setShowAiShortDramaReport(false)}
        />
      )}

      <AnimatePresence>
        {showExcellentCases && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[545]"
            onClick={(e) => e.stopPropagation()}
          >
            <AiDramaShowcase onClose={() => setShowExcellentCases(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-[5] pointer-events-none">
        <ImageWithFallback
          src={aestheticBackground}
          alt="审美的失乐园全屏背景"
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="absolute top-4 sm:top-10 left-4 sm:left-10 z-30">
        <h1 className="font-serif text-xl sm:text-3xl font-black text-[#F0E6D6]">审美的失乐园</h1>
      </div>

      <div className="absolute inset-0 z-0 opacity-40 grayscale pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A2A2D]/80 to-transparent" />
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center gap-8 sm:gap-32 md:gap-80 pointer-events-none px-2 sm:px-0">
        <motion.div animate={{ opacity: currentScript.name === '贵哥' ? 1 : 0.2, scale: currentScript.name === '贵哥' ? 1.05 : 0.95 }} className="relative h-[240px] w-36 sm:h-[450px] sm:w-72 rounded-t-full overflow-hidden border border-white/5">
          <ImageWithFallback src={imgGui} alt="贵哥" className="h-full w-full object-cover filter grayscale-[0.3]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </motion.div>
        <motion.div animate={{ opacity: currentScript.name === '林野' ? 1 : 0.2, scale: currentScript.name === '林野' ? 1.05 : 0.95 }} className="relative h-[240px] w-36 sm:h-[450px] sm:w-72 rounded-t-full overflow-hidden border border-white/5">
          <ImageWithFallback src={imgLin} alt="林野" className="h-full w-full object-cover filter grayscale-[0.3]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </motion.div>
      </div>

      <div className="absolute bottom-4 sm:bottom-24 left-1/2 -translate-x-1/2 w-full max-w-4xl px-2 sm:px-8 z-40 flex items-center justify-between gap-2 sm:gap-6">
        <AnimatePresence>
          {step > 0 && (
            <motion.button onClick={handlePrev} className="h-12 w-12 flex items-center justify-center rounded-full border border-primary/10 text-primary hover:border-primary/40"><ChevronLeft size={24} /></motion.button>
          )}
        </AnimatePresence>

        <div className="flex-1 relative">

          <AnimatePresence>
            {isAiShortDramaReportStep && !showAiShortDramaReport && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute left-1/2 -translate-x-1/2 -top-16 z-50"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); setShowAiShortDramaReport(true); }}
              >
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); setShowAiShortDramaReport(true); }}
                  className="bg-primary/20 border border-primary/40 rounded-full px-8 py-2 text-primary text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-primary/30 shadow-[0_0_18px_rgba(255,176,0,0.14)]"
                >
                  <ShieldAlert size={12} /> AI短剧劝退密码解析
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isExcellentCasesStep && !showExcellentCases && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute left-1/2 -translate-x-1/2 -top-16 z-50" onClick={(e) => { e.stopPropagation(); setShowExcellentCases(true); }}>
                <button className="bg-primary/20 border border-primary/40 rounded-full px-8 py-2 text-primary text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-primary/30"><Trophy size={12} /> 点击查看本季度优秀案例</button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isJiyuStep && !showJiyu && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-1/2 -translate-x-1/2 -top-32 z-50"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); setShowJiyu(true); }}
              >
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); setShowJiyu(true); }}
                  className="group flex items-center gap-3 rounded-full border border-[#F5C842]/45 bg-[#1A0F2E]/80 px-6 py-2.5 text-[10px] font-bold tracking-[0.32em] text-[#F5C842] shadow-[0_0_24px_rgba(245,200,66,0.16)] backdrop-blur-xl transition hover:bg-[#F5C842]/15 hover:shadow-[0_0_32px_rgba(245,200,66,0.28)]"
                >
                  <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#F5C842]/40 bg-[#F5C842]/10">
                    <FileText size={14} className="text-[#F5C842]" />
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#FFE066] shadow-[0_0_10px_rgba(255,224,102,0.8)]" />
                  </span>
                  点击查看寄语
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {currentScript.showInterviewReportAction && !showInterviewReport && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-1/2 -translate-x-1/2 -top-16 z-50"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); setShowInterviewReport(true); }}
              >
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); setShowInterviewReport(true); }}
                  className="bg-primary/20 border border-primary/40 rounded-full px-8 py-2 text-primary text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-primary/30"
                >
                  <FileText size={12} /> 点击查看访谈结果
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          
          <div className="bg-[#1A1225]/90 backdrop-blur-2xl border border-white/10 rounded-lg p-6 shadow-2xl text-left">
            <div className="flex gap-4">
              <div className={`h-10 w-10 shrink-0 rounded-full border-2 overflow-hidden bg-black/40 ${currentScript.name === '林野' ? 'border-primary/30' : 'border-[#E67E22]/40'}`}>
                 <ImageWithFallback src={currentScript.avatar} alt={currentScript.name} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-2 flex-1">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <h3 className={`font-serif text-sm sm:text-lg font-bold tracking-widest ${currentScript.name === '林野' ? 'text-primary' : 'text-[#E67E22]'}`}>{currentScript.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      {isActive && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={toggleMute}
                          title={isMuted ? "取消静音" : "静音"}
                          className="flex flex-col items-center gap-0.5 text-primary/60 hover:text-primary transition-colors"
                        >
                          {audioFailed ? <VolumeX size={14} className="text-red-400/70" /> : isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                          <span className={`text-[8px] tracking-widest uppercase ${audioFailed ? "text-red-400/60" : "text-primary/40"}`}>{audioFailed ? "失败" : "音频"}</span>
                        </motion.button>
                      )}
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="font-mono text-[9px] font-semibold tracking-[0.24em] text-white/35">
                          {String(safeStep + 1).padStart(2, "0")}/{String(script.length).padStart(2, "0")}
                        </span>
                        <div className="flex gap-0.5">
                          {script.map((_, i) => (
                            <div key={i} className="h-0.5 w-2.5 rounded-full" style={{ backgroundColor: i <= safeStep ? currentScript.color : 'rgba(255,255,255,0.05)' }} />
                          ))}
                        </div>
                      </div>
                    </div>
                 </div>
                 <motion.p key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-serif text-sm text-[#F0E6D6]/90 leading-relaxed min-h-[3em]">
                   {currentScript.text}
                 </motion.p>
              </div>
            </div>
            <AnimatePresence>
              {isFinalJumpStep && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="flex flex-col items-center mt-4"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={handleJumpToNextPage}
                >
                  <div className="relative flex flex-col items-center group" onPointerDown={(e) => e.stopPropagation()} onClick={handleJumpToNextPage}>
                    <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary animate-pulse tracking-widest">
                      点击
                    </span>
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={handleJumpToNextPage}
                      className="h-10 w-10 flex items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary transition-all hover:bg-primary/20 hover:scale-110 shadow-[0_0_15px_rgba(212,168,67,0.2)]"
                    >
                      <ChevronDown size={20} className="animate-bounce" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {step < script.length - 1 && (
          <motion.button onClick={handleNext} className="h-12 w-12 flex items-center justify-center rounded-full border border-primary/10 text-primary hover:border-primary/40"><ChevronRight size={24} /></motion.button>
        )}
      </div>

      <AnimatePresence>
        {showEpilogue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[500] flex flex-col items-center justify-center bg-black p-10 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-[800px] space-y-16"
            >
              <div className="relative space-y-10 text-left">
                <div className="space-y-8 font-serif text-[16px] leading-[2.4] tracking-wider text-[#F2EBD8]/70 md:text-[18px]">
                  
                  <p>
                    当AI不断逼近传统影视的制作水准，我们也看见越来越多优秀AI短剧开始出现。这意味着，技术正在快速抹平制作能力的差距；真正拉开作品差距的，已经不再是模型，而是创作者对于镜头、节奏、人物与价值表达的审美判断。AI能够完成工业化生产，却无法替代那些来源于人生经验与艺术训练的选择。
                  </p>
                </div>

                <div className="py-4">
                  <p className="font-serif text-[18px] italic leading-relaxed text-[#E8B839]/90 md:text-[20px]">
                    "技术负责提升作品的下限，人负责决定作品的上限。"
                  </p>
                </div>

                <div className="pt-6">
                  <p className="font-serif text-[26px] font-black leading-tight tracking-[0.12em] text-[#E8B839] md:text-[32px]">
                    当AI成为每个人都拥有的能力时，<br />
                    <span className="mt-4 block text-[#F2EBD8]">真正稀缺的，将是审美，而不是算力。</span>
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <button 
                  onClick={() => { setShowEpilogue(false); setStep(script.findIndex(s => s.isPenultimate)); }} 
                  className="px-6 py-2 border border-[#F2EBD8]/20 text-[9px] font-bold tracking-[0.3em] text-[#F2EBD8]/50 uppercase transition-colors hover:border-[#E8B839]/40 hover:text-[#E8B839]"
                >
                  回看对话
                </button>
                <button 
                  onClick={() => { setShowEpilogue(false); setStep(script.length - 1); }} 
                  className="px-6 py-2 bg-[#E8B839] text-[9px] font-black tracking-[0.3em] text-black uppercase transition-transform hover:scale-105"
                >
                  继续前进
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
