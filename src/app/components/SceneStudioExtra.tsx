import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "../hooks/useScrollLock";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft, ChevronDown, Activity, Cpu, Brain, Zap, FileText, VenusAndMars, X, Volume2, VolumeX } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { SubjectReportChart, preheatSubjectReport } from "./SubjectReportChart";

// Relative imports for images
import imgLin from "../../imports/255e3201021893d45473e734dffd6296.png";
import imgGui from "../../imports/b9e12d1e735ad5df9661ec895c84c088.jpg";
import avatarGui from "../../imports/c9798d1fbc83b61645654e2f76bea038-1.jpg";
import avatarLin from "../../imports/fa0706fed8fcda03e647959e2506d84b.jpg";
import interestBackground from "../../imports/_____20260626110002_3487_383_compressed.jpg";
import genderImage01 from "../../imports/男.jpg";
import genderImage02 from "../../imports/女.png";
import { audioAssets } from "../../audio";

const audioUrls = audioAssets.extra;

const script = [
  {
    name: '林野',
    avatar: avatarLin,
    text: '那这封投诉信呢？观众反映咱们最近创作的三部作品完全是在抄袭热剧角色的建模、经典的台词、雷同的剧情，没有自己的方向。',
    color: '#D4A843'
  },
  {
    name: '林野',
    avatar: avatarLin,
    text: '为什么非得复制别人的元素？我们不能从头原创一部好剧吗？',
    color: '#D4A843'
  },
  {
    name: '贵哥',
    avatar: avatarGui,
    text: '可是老板，改编一部佳作固然好，但咱可争不过那些头部公司，每期只能打造一两部精品，所以想要生存，题材上只能不断追逐观众兴趣啊。',
    color: '#E67E22'
  },
  {
    name: '林野',
    avatar: avatarLin,
    text: '至少不能这么千篇一律啊！女主角怎么都在"被迫雌竞"？男主角都是清一色"隐形战神/屌丝逆袭"？创作不是复制粘贴，如果都生产一模一样的电子榨菜，不就成了劣币驱逐良币了吗？',
    color: '#D4A843'
  },
  {
    name: '贵哥',
    avatar: avatarGui,
    text: '老板，我们也不是完全没有创新啊，没有了重新编排和演绎，再好的故事也会被时间淹没。咱们上周的新剧成绩亮眼，很大程度上就是因为把都市精英的心理和武则天的夺权之路结合得好。做现成的内容，既是为了让公司经营得下去，也是为了接住观众的兴趣所在。',
    color: '#E67E22'
  },
  {
    name: '贵哥',
    avatar: avatarGui,
    text: '来看看公司的调研小组得到的访谈结果吧！',
    showReportAction: true,
    color: '#E67E22'
  },
  {
    name: '林野',
    avatar: avatarLin,
    text: '原来如此......真正"有罪"的是拿着好IP去做同质化、模版化内容的创作者。好的创作者能够驾驭AI，赋予旧故事以新生命，无数次地让人眼前一亮。',
    color: '#D4A843'
  },
  {
    name: '林野',
    avatar: avatarLin,
    text: '打开第三封投诉信',
    color: '#D4A843'
  }
];

const genderPreferenceImages = [
  genderImage01,
  genderImage02,
];

// 头像：丁宽 — 戴耳麦的导演造型
const AvatarDing = () => (
  <svg viewBox="0 0 64 64" className="h-full w-full">
    <defs>
      <linearGradient id="avDing" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#E67E22" stopOpacity="0.9" />
        <stop offset="1" stopColor="#8A4A10" stopOpacity="0.7" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="24" r="11" fill="url(#avDing)" />
    <path d="M32 36c-11 0-19 7-19 17v3h38v-3c0-10-8-17-19-17z" fill="url(#avDing)" />
    {/* 耳麦 */}
    <path d="M21 21 Q21 11 32 11 Q43 11 43 21" stroke="#1A0F2E" strokeWidth="2.2" fill="none" />
    <rect x="18" y="20" width="5" height="8" rx="2.5" fill="#F5C842" />
    <rect x="41" y="20" width="5" height="8" rx="2.5" fill="#F5C842" />
    {/* 麦克风 */}
    <path d="M20 27 Q18 32 22 33" stroke="#F5C842" strokeWidth="1.4" fill="none" />
  </svg>
);

// 头像：缪轶 — 马尾辫创作者造型
const AvatarMiao = () => (
  <svg viewBox="0 0 64 64" className="h-full w-full">
    <defs>
      <linearGradient id="avMiao" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#9B59B6" stopOpacity="0.9" />
        <stop offset="1" stopColor="#6C3483" stopOpacity="0.7" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="24" r="11" fill="url(#avMiao)" />
    <path d="M32 36c-11 0-19 7-19 17v3h38v-3c0-10-8-17-19-17z" fill="url(#avMiao)" />
    {/* 马尾辫 */}
    <path d="M32 13 Q38 9 40 5 Q42 9 36 14" fill="#6C3483" opacity="0.7" />
    <path d="M36 14 Q42 16 44 22" stroke="#6C3483" strokeWidth="2.5" fill="none" />
    {/* 刘海 */}
    <path d="M22 20 Q24 16 32 15 Q40 16 42 20" fill="#1A0F2E" opacity="0.45" />
  </svg>
);

// 头像：赵晖 — 教授造型（与情绪的垃圾场同款）
const AvatarZhaoExtra = () => (
  <svg viewBox="0 0 64 64" className="h-full w-full">
    <defs>
      <linearGradient id="avZhaoEx" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFE066" stopOpacity="0.85" />
        <stop offset="1" stopColor="#B98F2E" stopOpacity="0.65" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="24" r="11" fill="url(#avZhaoEx)" />
    <path d="M32 36c-11 0-19 7-19 17v3h38v-3c0-10-8-17-19-17z" fill="url(#avZhaoEx)" />
    {/* 胡子 + 眉毛 — 教授 */}
    <path d="M23 27c2 6 5 9 9 9s7-3 9-9c-3 2-15 2-18 0z" fill="#1A0F2E" opacity="0.4" />
    <path d="M25 19c2-2 12-2 14 0" stroke="#1A0F2E" strokeWidth="1.4" fill="none" />
  </svg>
);

const reports = [
  {
    author: "丁宽",
    role: "AI 导演",
    text: `未来的竞争，不是单个作品之间的竞争，而是 IP 宇宙之间的竞争。我们要做的，是用世界通用的类型片语言，来讲好中国故事。`,
    shape: "rounded-[4px_28px_4px_28px]",
    Avatar: AvatarDing,
  },
  {
    author: "缪轶",
    role: "内容创作者",
    text: `未来行业的核心竞争力：第一是工业化的制作管线，第二是稳定、专业的编剧团队，第三是完整的版权合规体系。`,
    shape: "rounded-[28px_4px_28px_4px]",
    Avatar: AvatarMiao,
  },
  {
    author: "赵晖",
    role: "中国传媒大学戏剧影视学院教授",
    text: `我们所反对的，是工业化的“无脑克隆”。真正的创新是在同质化框架内注入创意，而非完全脱离市场逻辑。`,
    shape: "rounded-[4px_28px_28px_28px]",
    Avatar: AvatarZhaoExtra,
  }
];

export function SceneStudioExtra({ isActive }: { isActive?: boolean }) {
  const [step, setStep] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [reportUnlocked, setReportUnlocked] = useState(false);
  const [showEpilogue, setShowEpilogue] = useState(false);
  const [showSubjectReport, setShowSubjectReport] = useState(false);
  const [showGenderPreferenceReport, setShowGenderPreferenceReport] = useState(false);

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
    preheatSubjectReport();
  }, []);

  useEffect(() => {
    if (!isActive) return;
    setStep(0);
    setShowReport(false);
    setReportUnlocked(false);
    setShowEpilogue(false);
    setShowSubjectReport(false);
    setShowGenderPreferenceReport(false);
  }, [isActive]);

  useScrollLock(showReport || showSubjectReport || showGenderPreferenceReport || showEpilogue);

  const safeStep = Math.min(step, script.length - 1);
  const currentScript = script[safeStep];
  const isSubjectReportStep = safeStep === 2 && currentScript.text.startsWith('可是老板，改编一部佳作固然好');
  const isGenderPreferenceStep = safeStep === 3 && currentScript.name === '林野' && currentScript.text.startsWith('至少不能这么千篇一律');
  const isComplaintJumpStep = safeStep === script.length - 1 && currentScript.text === '打开第三封投诉信';

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (showReport || showEpilogue || showSubjectReport || showGenderPreferenceReport) return;
    if (step === script.length - 1) {
      window.dispatchEvent(new CustomEvent("scrollToSection", { detail: { index: 7 } }));
      return;
    }
    if (step === script.length - 2 && !showEpilogue) {
      setShowEpilogue(true);
      return;
    }
    setStep(step + 1);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (showReport || showEpilogue || showSubjectReport || showGenderPreferenceReport) return;
    if (step > 0) setStep(step - 1);
  };

  const handleCloseReport = () => {
    setShowReport(false);
    setReportUnlocked(true);
  };

  const handleJumpToNextComplaint = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.dispatchEvent(new CustomEvent("scrollToSection", { detail: { index: 7 } }));
  };

  return (
    <motion.div className="relative h-full w-full overflow-hidden bg-transparent cursor-pointer" onClick={() => handleNext()}>
      {/* 访谈弹窗 — portal 挂到 body，避免 snap 容器滚动穿透 */}
      {createPortal(
        <AnimatePresence>
          {showReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9000] flex items-center justify-center bg-[#0F0D0A]/95 backdrop-blur-md p-10 cursor-default"
              onClick={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0D0612]/95 border border-white/5 p-10 shadow-2xl rounded-2xl overflow-y-auto text-left"
                style={{ overscrollBehavior: "contain" }}
              >
                <button
                  onClick={handleCloseReport}
                  className="absolute top-6 right-6 h-10 w-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="mb-8 border-b border-white/5 pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-bold tracking-[0.5em] text-primary">行业访谈</span>
                  </div>
                  <h2 className="font-serif text-3xl font-black text-[#F0E6D6]">访谈结果</h2>
                </div>
                <div className="space-y-8">
                  {reports.map((item, index) => (
                    <div key={index} className="group relative bg-white/[0.03] border border-white/10 p-6 rounded-xl flex flex-col md:flex-row gap-6 hover:border-primary/30 transition-colors">
                      <span className="absolute right-5 top-4 font-serif text-2xl font-black text-primary/15 select-none">0{index + 1}</span>
                      <div className="shrink-0">
                        <div className={`relative h-16 w-16 overflow-hidden bg-gradient-to-b from-[#2A1840] to-[#0D0A12] p-[1.5px] shadow-[0_8px_24px_rgba(0,0,0,0.5)] ${item.shape}`}>
                          <div className={`h-full w-full overflow-hidden bg-[#0D0A12] ${item.shape}`}>
                            <item.Avatar />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2.5">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="font-serif text-xl font-bold text-primary tracking-wide">{item.author}</span>
                          <span className="text-[11px] text-white/55 tracking-[0.05em]">{item.role}</span>
                        </div>
                        <div className="h-[1px] w-10 bg-primary/30" />
                        <p className="font-serif text-sm text-[#F0E6D6]/85 leading-loose text-justify">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}


      {/* 常驻挂载预热，isOpen 控制显隐 */}
      <SubjectReportChart isOpen={showSubjectReport} onClose={() => setShowSubjectReport(false)} />

      <AnimatePresence>
        {showGenderPreferenceReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[545] flex items-center justify-center bg-[#0D0612]/94 p-8 backdrop-blur-xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 展板外框 */}
            <div style={{ position: "fixed", top: 10, left: 10, right: 10, bottom: 10, zIndex: 100, pointerEvents: "none", borderRadius: 24, border: "2.5px solid rgba(245,200,66,0.75)", boxShadow: "inset 0 0 60px rgba(245,200,66,0.04), 0 0 30px rgba(245,200,66,0.06), 0 0 2px rgba(245,200,66,0.2)" }} />
            {/* 展板夹子 */}
            <div style={{ position: "fixed", left: "50%", top: 8, transform: "translateX(-50%)", zIndex: 101, pointerEvents: "none", width: 200, height: 20, background: "linear-gradient(180deg, rgba(245,200,66,0.55) 0%, rgba(200,160,50,0.40) 100%)", border: "1px solid rgba(245,200,66,0.35)", borderRadius: "6px 6px 3px 3px", boxShadow: "0 2px 12px rgba(245,200,66,0.15)", backdropFilter: "blur(6px)" }} />
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="relative flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-primary/25 bg-[#1A1225]/85 shadow-[0_0_70px_rgba(0,0,0,0.75)]"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-7 py-4">
                <div>
                  <div className="mb-1 flex items-center gap-2 text-primary">
                    <VenusAndMars size={16} />
                  </div>
                  <h2 className="font-serif text-2xl font-black text-[#F0E6D6]">男女频题材取向</h2>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowGenderPreferenceReport(false); }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition hover:bg-primary/20"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto p-5 md:grid-cols-2">
                {genderPreferenceImages.map((src, index) => (
                  <div key={src} className="relative min-h-[360px] overflow-hidden rounded-xl border border-white/10 bg-black/35 shadow-2xl">
                    <div className="absolute left-4 top-4 z-10 rounded-full border border-primary/30 bg-[#1A1225]/75 px-3 py-1 text-[10px] font-bold tracking-[0.25em] text-primary backdrop-blur-md">
                      0{index + 1}
                    </div>
                    <img
                      src={src}
                      alt={`男女频题材取向图 ${index + 1}`}
                      className="h-full w-full object-contain"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-center border-t border-white/10 px-6 py-4">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowGenderPreferenceReport(false); }}
                  className="rounded-full border border-primary/35 bg-primary/10 px-8 py-2 text-[10px] font-bold uppercase tracking-[0.4em] text-primary transition hover:bg-primary/20"
                >
                  跳转到对话
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-[5] pointer-events-none">
        <ImageWithFallback
          src={interestBackground}
          alt="兴趣的流水线全屏背景"
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="absolute top-10 left-10 z-30">
        <h1 className="font-serif text-3xl font-black text-[#F0E6D6]">兴趣的流水线</h1>
      </div>

      <div className="absolute inset-0 z-0 opacity-40 grayscale pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1840]/80 to-transparent" />
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center gap-32 md:gap-80 pointer-events-none px-6">
        <motion.div animate={{ opacity: currentScript.name === '贵哥' ? 1 : 0.25, scale: currentScript.name === '贵哥' ? 1.05 : 0.95 }} className="relative h-[450px] w-72 rounded-t-[160px] border-x border-t border-white/5 overflow-hidden">
          <ImageWithFallback src={imgGui} alt="贵哥" className="h-full w-full object-cover filter brightness-[0.8]" />
        </motion.div>
        <motion.div animate={{ opacity: currentScript.name === '林野' ? 1 : 0.25, scale: currentScript.name === '林野' ? 1.05 : 0.95 }} className="relative h-[450px] w-72 rounded-t-[160px] border-x border-t border-white/5 overflow-hidden">
          <ImageWithFallback src={imgLin} alt="林野" className="h-full w-full object-cover filter brightness-[0.8]" />
        </motion.div>
      </div>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-40 flex items-end justify-between gap-6">
        <AnimatePresence>
          {step > 0 && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={handlePrev}
              className="h-12 w-12 shrink-0 flex items-center justify-center rounded-full border border-primary/10 text-primary hover:border-primary/40 hover:bg-primary/10 transition"
            >
              <ChevronLeft size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="flex-1 bg-[#1A1225]/85 backdrop-blur-3xl border border-white/10 rounded-lg p-6 shadow-2xl text-left relative overflow-visible">
          {isSubjectReportStep && !showSubjectReport && (
            <div className="absolute left-1/2 -translate-x-1/2 -top-12 z-50">
               <button onClick={(e) => { e.stopPropagation(); setShowSubjectReport(true); }} className="bg-primary/20 border border-primary/40 rounded-full px-6 py-1.5 text-primary text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-primary/30"><FileText size={12} /> 点击查看行业题材报告</button>
            </div>
          )}
          {isGenderPreferenceStep && !showGenderPreferenceReport && (
            <div className="absolute left-1/2 -translate-x-1/2 -top-12 z-50">
               <button onClick={(e) => { e.stopPropagation(); setShowGenderPreferenceReport(true); }} className="bg-primary/20 border border-primary/40 rounded-full px-6 py-1.5 text-primary text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-primary/30"><VenusAndMars size={12} /> 点击查看男女频题材取向</button>
            </div>
          )}
          {currentScript.showReportAction && !reportUnlocked && !showReport && (
            <div className="absolute left-1/2 -translate-x-1/2 -top-12 z-50">
               <button onClick={(e) => { e.stopPropagation(); setShowReport(true); }} className="bg-primary/20 border border-primary/40 rounded-full px-6 py-1.5 text-primary text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-primary/30"><Zap size={12} /> 查看访谈结果</button>
            </div>
          )}
          <div className="flex gap-4 items-start">
            <div className={`h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 ${currentScript.name === '林野' ? 'border-primary/30' : 'border-[#E67E22]/40'}`}>
               <ImageWithFallback src={currentScript.avatar} alt={currentScript.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 space-y-2">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <h3 className={`font-serif text-lg font-bold tracking-widest ${currentScript.name === '林野' ? 'text-primary' : 'text-[#E67E22]'}`}>{currentScript.name}</h3>
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
               <motion.p key={safeStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-serif text-sm leading-relaxed text-[#F0E6D6]/85">
                 {currentScript.text}
               </motion.p>
            </div>
          </div>
            <AnimatePresence>
              {isComplaintJumpStep && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="flex flex-col items-center mt-4"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={handleJumpToNextComplaint}
                >
                  <div className="relative flex flex-col items-center group" onPointerDown={(e) => e.stopPropagation()} onClick={handleJumpToNextComplaint}>
                    <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary animate-pulse tracking-widest">
                      点击
                    </span>
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={handleJumpToNextComplaint}
                      className="h-10 w-10 flex items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary transition-all hover:bg-primary/20 hover:scale-110 shadow-[0_0_15px_rgba(212,168,67,0.2)]"
                    >
                      <ChevronDown size={20} className="animate-bounce" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

        </div>

        <motion.button
          onClick={handleNext}
          className="h-12 w-12 shrink-0 flex items-center justify-center rounded-full border border-primary/10 text-primary hover:border-primary/40 hover:bg-primary/10 transition"
        >
          <ChevronRight size={24} />
        </motion.button>
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
                    AI让剧本、分镜、画面生成变得前所未有地高效，也让更多创作者拥有了进入影视行业的机会。
                    但调查发现，真正让作品走向同质化的，并不是AI，而是创作者在市场压力下越来越趋于安全的选择。工具能够复制已经成功的故事，却无法主动创造一个从未出现过的故事。
                  </p>
                </div>

                <div className="py-4">
                  <p className="font-serif text-[18px] italic leading-relaxed text-[#E8B839]/90 md:text-[20px]">
                    "技术负责降低创作门槛，人负责突破创作边界。"
                  </p>
                </div>

                <div className="pt-6">
                  <p className="font-serif text-[26px] font-black leading-tight tracking-[0.12em] text-[#E8B839] md:text-[32px]">
                    越是人人都能使用AI的时代，<br />
                    <span className="mt-4 block text-[#F2EBD8]">原创能力反而越成为创作者最难被替代的价值。</span>
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <button 
                  onClick={() => { setShowEpilogue(false); setStep(script.length - 2); }} 
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
