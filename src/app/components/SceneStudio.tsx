import React, { useState, useEffect, useRef } from "react";
import { useScrollLock } from "../hooks/useScrollLock";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft, Brain, Zap, TrendingUp, CheckCircle, BarChart3, FileText, Volume2, VolumeX, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { assets } from "../assets-ext";
import { ShuangDianChart, preheatShuangDian } from "./ShuangDianChart";
import { WorkflowChart, preheatWorkflow } from "./WorkflowChart";
import { ExonerationChart } from "./ExonerationChart";
import { ChevronDown } from "lucide-react";

// New high-quality character portraits
import imgLin from "@/imports/255e3201021893d45473e734dffd6296.png";
import { audioAssets } from "@/audio";
import imgGui from "@/imports/b9e12d1e735ad5df9661ec895c84c088.jpg";
import avatarGui from "@/imports/c9798d1fbc83b61645654e2f76bea038-1.jpg";
import avatarLin from "@/imports/fa0706fed8fcda03e647959e2506d84b.jpg";
import studioOverlayImage from "@/imports/_____20260625165741_2305_14_compressed.png";

const audioUrls = audioAssets.studio;

const script = [
  {
    name: '林野',
    avatar: avatarLin,
    text: '这些投诉...怎么搞的？我看了咱们的剧本，这里面设置的爽点是不是太多了？',
    color: '#D4A843'
  },
  {
    name: '林野',
    avatar: avatarLin,
    text: '我也明白需要调动情绪来留住观众，但是有些工业糖精也太毁三观了吧？肯定是AI生成的情节让观众误解了！',
    color: '#D4A843'
  },
  {
    name: '贵哥',
    avatar: avatarGui,
    text: '老板，您说的三观不正的爽点我们确实应该删去。但是在制作过程中，把控内容的人才是决定咱们作品感染力强弱的关键。AI不是情绪的垃圾场，而是......来看看公司的调研小组得到的访谈结果吧！',
    showWorkflowAction: true,
    showInterviewAction: true,
    analysis: [
      { label: '受众覆盖', value: '95' },
      { label: '情感共鸣', value: '88' },
      { label: '解压指数', value: '92' },
      { label: '传播力', value: '85' }
    ],
    color: '#E67E22'
  },
  {
    name: '林野',
    avatar: avatarLin,
    text: '所以，真正"有罪"的，是设计有毒的情节去操纵观众的人。设计者越有真情越有想法，技术越能放大感染力。',
    isPenultimate: true,
    color: '#D4A843'
  },
  {
    name: '林野',
    avatar: avatarLin,
    text: '打开第二份投诉信',
    color: '#D4A843'
  }
];

// Three distinct human-like portrait avatars, drawn as SVG silhouettes.
const AvatarChu = () => (
  <svg viewBox="0 0 64 64" className="h-full w-full">
    <defs><linearGradient id="avChu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F5C842" stopOpacity="0.9" /><stop offset="1" stopColor="#E67E22" stopOpacity="0.7" /></linearGradient></defs>
    <circle cx="32" cy="24" r="11" fill="url(#avChu)" />
    <path d="M32 36c-11 0-19 7-19 17v3h38v-3c0-10-8-17-19-17z" fill="url(#avChu)" />
    {/* glasses — scholar */}
    <g stroke="#1A0F2E" strokeWidth="1.4" fill="none"><circle cx="27" cy="23" r="4" /><circle cx="37" cy="23" r="4" /><path d="M31 23h2" /></g>
  </svg>
);
const AvatarWang = () => (
  <svg viewBox="0 0 64 64" className="h-full w-full">
    <defs><linearGradient id="avWang" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#D4A843" stopOpacity="0.9" /><stop offset="1" stopColor="#8A6A2A" stopOpacity="0.7" /></linearGradient></defs>
    <circle cx="32" cy="24" r="11" fill="url(#avWang)" />
    <path d="M32 36c-11 0-19 7-19 17v3h38v-3c0-10-8-17-19-17z" fill="url(#avWang)" />
    {/* short hair + collar — executive */}
    <path d="M22 20c1-7 18-7 20 0 0-3-3-9-10-9s-11 6-10 9z" fill="#1A0F2E" opacity="0.5" />
    <path d="M26 54l6-6 6 6" stroke="#1A0F2E" strokeWidth="1.4" fill="none" />
  </svg>
);
const AvatarZhao = () => (
  <svg viewBox="0 0 64 64" className="h-full w-full">
    <defs><linearGradient id="avZhao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE066" stopOpacity="0.85" /><stop offset="1" stopColor="#B98F2E" stopOpacity="0.65" /></linearGradient></defs>
    <circle cx="32" cy="24" r="11" fill="url(#avZhao)" />
    <path d="M32 36c-11 0-19 7-19 17v3h38v-3c0-10-8-17-19-17z" fill="url(#avZhao)" />
    {/* beard + brow — professor */}
    <path d="M23 27c2 6 5 9 9 9s7-3 9-9c-3 2-15 2-18 0z" fill="#1A0F2E" opacity="0.4" />
    <path d="M25 19c2-2 12-2 14 0" stroke="#1A0F2E" strokeWidth="1.4" fill="none" />
  </svg>
);

const reports = [
  {
    author: "陈楸帆",
    role: "科幻作家 · AI 短剧《神・笔》总编剧",
    text: `AI 现在能轻松产出合格的小说、剧本、画面，但所有作品都带有一种"平均主义的中庸感"，安全、工整、不出错，也不出彩。人类创作者的核心价值，在于个性、独特性、破格勇气，而不是只做到"合格"。我们在《神・笔》里其实也在反思：当想象力被 AI 变成流水线，我们得到的是自由，还是会成为工具的附庸？AI 可以完成 80% 的工业化工作，但最后的 20% 灵魂，必须由人来完成。`,
    shape: "rounded-full",
    Avatar: AvatarChu
  },
  {
    author: "汪家城",
    role: "九州文化编剧负责人 · 内容总监",
    text: "AI 是工具，不是创作者。我们花一个多亿买版权，用 AI 转成视频，但核心竞争力不是技术，是能找到有生活阅历、懂普通人情绪的创作者。同样一个 IP，不同人用 AI 做，效果天差地别。审美和判断，才是最值钱的资产。AI 替代不了人的情感体验、生活积累、价值判断。未来行业拼的不是谁的 AI 跑得快，而是谁的内容更能打动人。",
    shape: "rounded-[28px_28px_28px_4px]",
    Avatar: AvatarWang
  },
  {
    author: "赵晖",
    role: "中国传媒大学戏剧影视学院教授",
    text: "只要短剧来讲，你们不能反对爽感——短剧没有爽感的话就很难出圈，但是要反对过度的恶意爽感，比如说侮辱人的、让人下跪的，现在总局不也出来规定了吗？最终定调是技术无罪，主要是人的观念和内容得跟上。只要是使用技术的人，他的想法很重要。",
    shape: "rounded-[4px_28px_28px_28px]",
    Avatar: AvatarZhao
  }
];

export function SceneStudio({ image, isActive }: { image?: string; isActive?: boolean }) {
  const [step, setStep] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [reportUnlocked, setReportUnlocked] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showImpactRipple, setShowImpactRipple] = useState(false);
  const [showEpilogue, setShowEpilogue] = useState(false);
  const [hasReturned, setHasReturned] = useState(false);
  const [showShuangDianPanel, setShowShuangDianPanel] = useState(false);
  const [showWorkflowPanel, setShowWorkflowPanel] = useState(false);
  const [showExonerationPanel, setShowExonerationPanel] = useState(false);
  const bgImage = image || "";
  const safeStep = Math.min(step, script.length - 1);
  const currentScript = script[safeStep] || script[0];

  const audioMapRef = useRef<Map<number, HTMLAudioElement>>(new Map());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chainAudioRef = useRef<HTMLAudioElement | null>(null); // 链式播放的第二段音频
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
    // 清理上一个音频和链式音频
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (chainAudioRef.current) { chainAudioRef.current.pause(); chainAudioRef.current = null; }
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

    // 贵哥 03/05：第一个音频播完后自动接第二个
    if (safeStep === 2) {
      const chain = new Audio(audioAssets.studioChain);
      chain.muted = isMutedRef.current;
      chain.preload = "auto";
      chainAudioRef.current = chain;

      const onEnded = () => {
        audio.removeEventListener("ended", onEnded);
        chain.play().catch(() => setAudioFailed(true));
      };
      audio.addEventListener("ended", onEnded);
    }

    audio.play().catch(() => setAudioFailed(true));
  }, [isActive, step]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isMutedRef.current;
    isMutedRef.current = next;
    setIsMuted(next);
    if (audioRef.current) audioRef.current.muted = next;
    if (chainAudioRef.current) chainAudioRef.current.muted = next;
  };

  // 进入本场景即预热爽点分析网页所需的 CDN 脚本，避免首次打开空白需刷新
  useEffect(() => {
    preheatShuangDian();
    preheatWorkflow();
  }, []);

  useScrollLock(showShuangDianPanel || showWorkflowPanel || showExonerationPanel || showReport || showEpilogue);

  // 每次翻到"情绪的垃圾场"都从第一句和初始交互状态开始
  useEffect(() => {
    if (!isActive) return;
    setStep(0);
    setShowReport(false);
    setReportUnlocked(false);
    setIsArchiving(false);
    setIsShaking(false);
    setShowImpactRipple(false);
    setShowEpilogue(false);
    setHasReturned(false);
    setShowShuangDianPanel(false);
    setShowWorkflowPanel(false);
    setShowExonerationPanel(false);
  }, [isActive]);


  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (showReport || showEpilogue || showShuangDianPanel || showWorkflowPanel || showExonerationPanel) return;
    if (safeStep === script.length - 1) {
      window.dispatchEvent(new CustomEvent("scrollToSection", { detail: { index: 5 } }));
      return;
    }
    if (hasReturned) {
      window.dispatchEvent(new CustomEvent("scrollToSection", { detail: { index: 5 } }));
      return;
    }
    if (currentScript.isPenultimate) {
      setShowEpilogue(true);
      return;
    }
    if (step < script.length - 1) setStep(step + 1);
  };


  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showReport || showEpilogue || showShuangDianPanel || showWorkflowPanel || showExonerationPanel || hasReturned || step === 0) return;
    setStep(step - 1);
  };

  const handleReturnToConversation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEpilogue(false);
    const idx = script.findIndex(s => s.isPenultimate);
    setStep(idx >= 0 ? idx : script.length - 2);
  };

  const handleProceedToFinal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEpilogue(false);
    setHasReturned(true);
    setStep(script.length - 1);
  };

  const handleInteraction = (e: React.MouseEvent) => {
    if (showReport || showShuangDianPanel || showWorkflowPanel || showExonerationPanel) return;
    const target = e.target as HTMLElement;
    if (target.closest('.report-action-btn') || target.closest('.shuangdian-action-btn') || target.closest('.workflow-action-btn') || target.closest('.exoneration-action-btn')) return;
    handleNext();
  };

  const handleCloseReport = () => {
    setShowReport(false);
  };

  return (
    <motion.div 
      className="relative h-full w-full overflow-hidden bg-transparent cursor-pointer" 
      onClick={handleInteraction}
      animate={isShaking ? { x: [0, -6, 6, -6, 4, -4, 0], y: [0, 4, -4, 4, -2, 2, 0] } : {}}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      {/* Report Overlay */}
      <AnimatePresence>
        {showReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] flex items-center justify-center bg-[#0D0612]/95 backdrop-blur-md p-10 cursor-default" onClick={(e) => e.stopPropagation()}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#2A1840]/80 border border-white/5 p-10 shadow-2xl rounded-2xl overflow-y-auto">
              <button onClick={handleCloseReport} className="absolute top-6 right-6 h-10 w-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                <X size={22} strokeWidth={3} />
              </button>
              <div className="mb-8 border-b border-white/5 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold tracking-[0.5em] text-primary">行业访谈</span>
                </div>
                <h2 className="font-serif text-3xl font-black text-[#F0E6D6]">访谈结果</h2>
              </div>
              <div className="space-y-8">
                {reports.map((report, idx) => (
                  <div key={idx} className="group relative flex flex-col md:flex-row gap-6 rounded-2xl border border-white/5 bg-[#1A1225]/40 p-6 transition-colors hover:border-primary/30">
                    {/* index badge */}
                    <span className="absolute right-5 top-4 font-serif text-2xl font-black text-primary/15 select-none">0{idx + 1}</span>
                    {/* portrait avatar */}
                    <div className="shrink-0">
                      <div className={`relative h-16 w-16 overflow-hidden bg-gradient-to-b from-[#2A1840] to-[#0D0A12] p-[1.5px] shadow-[0_8px_24px_rgba(0,0,0,0.5)] ${report.shape}`}>
                        <div className={`h-full w-full overflow-hidden bg-[#0D0A12] ${report.shape}`}>
                          <report.Avatar />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2.5">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-serif text-xl font-bold text-primary tracking-wide">{report.author}</span>
                        <span className="text-[11px] text-white/55 tracking-[0.05em]">{report.role}</span>
                      </div>
                      <div className="h-[1px] w-10 bg-primary/30" />
                      <p className="font-serif text-sm text-[#F0E6D6]/85 leading-loose text-justify">{report.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 从进入场景起就挂载（隐藏预热），让 iframe 及其 CDN 脚本提前加载完毕，点击时即刻显示 */}
      <ShuangDianChart isOpen={showShuangDianPanel} onClose={() => setShowShuangDianPanel(false)} />

      {/* 提前挂载 iframe 预热：始终挂载，isOpen 控制显隐，点击时可即刻显示 */}
      <WorkflowChart isOpen={showWorkflowPanel} onClose={() => setShowWorkflowPanel(false)} />

      <AnimatePresence>
        {showExonerationPanel && (
          <ExonerationChart onClose={() => setShowExonerationPanel(false)} />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-0 opacity-40 grayscale pointer-events-none">
        {bgImage && <ImageWithFallback src={bgImage} className="h-full w-full object-cover mix-blend-overlay" />}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1840]/80 to-transparent" />
      </div>

      <div className="absolute inset-0 z-[5] pointer-events-none">
        <ImageWithFallback
          src={studioOverlayImage}
          alt="情绪的垃圾场全屏背景"
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover opacity-100"
        />
      </div>

      {/* Docked Sidebar */}
      <AnimatePresence>
        {false && reportUnlocked && !showReport && !isArchiving && (
          <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} className="fixed left-0 top-1/2 -translate-y-1/2 z-[150] group" onClick={(e) => { e.stopPropagation(); setShowReport(true); }}>
            <div className="relative h-32 w-20 bg-[#1A1225]/95 border-y border-r border-primary/30 rounded-r-2xl backdrop-blur-2xl flex flex-col items-end p-4 cursor-pointer">
              <FileText size={24} className="text-primary/30 mt-auto" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-4 sm:top-10 left-4 sm:left-10 z-30">
        <h1 className="font-serif text-xl sm:text-3xl font-black text-[#F0E6D6]">情绪的垃圾场</h1>
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center gap-8 sm:gap-32 md:gap-80 pointer-events-none px-2 sm:px-6">
        <motion.div animate={{ opacity: currentScript.name === '贵哥' ? 1 : 0.25, scale: currentScript.name === '贵哥' ? 1.05 : 0.95 }} className="relative h-[240px] w-36 sm:h-[450px] sm:w-72 rounded-t-[80px] sm:rounded-t-[160px] border-x border-t border-white/5 overflow-hidden">
          <ImageWithFallback src={imgGui} alt="贵哥" className="h-full w-full object-cover filter brightness-[0.8]" />
        </motion.div>
        <motion.div animate={{ opacity: currentScript.name === '林野' ? 1 : 0.25, scale: currentScript.name === '林野' ? 1.05 : 0.95 }} className="relative h-[240px] w-36 sm:h-[450px] sm:w-72 rounded-t-[80px] sm:rounded-t-[160px] border-x border-t border-white/5 overflow-hidden">
          <ImageWithFallback src={imgLin} alt="林野" className="h-full w-full object-cover filter brightness-[0.8]" />
        </motion.div>
      </div>

      <div className="absolute bottom-4 sm:bottom-24 left-1/2 -translate-x-1/2 w-full max-w-4xl px-2 sm:px-8 z-40 flex items-end justify-between gap-2 sm:gap-6">
        <AnimatePresence>
          {step > 0 && !hasReturned && (
            <motion.button onClick={handlePrev} className="h-12 w-12 flex items-center justify-center rounded-full border border-primary/10 text-primary hover:border-primary/40"><ChevronLeft size={24} /></motion.button>
          )}
        </AnimatePresence>

        <div className="flex-1 relative">
          <AnimatePresence>
            {step === 0 && !showReport && !showEpilogue && !showShuangDianPanel && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="shuangdian-action-btn absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-[calc(100%+0.75rem)]"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowShuangDianPanel(true);
                }}
              >
                <button className="group flex items-center gap-3 rounded-full border border-[#F5C842]/45 bg-[#1A0F2E]/80 px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.32em] text-[#F5C842] shadow-[0_0_24px_rgba(245,200,66,0.16)] backdrop-blur-xl transition hover:bg-[#F5C842]/15 hover:shadow-[0_0_32px_rgba(245,200,66,0.28)]">
                  <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#F5C842]/40 bg-[#F5C842]/10">
                    <BarChart3 size={14} className="text-[#F5C842]" />
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#FFE066] shadow-[0_0_10px_rgba(255,224,102,0.8)]" />
                  </span>
                  点击查看爽点设置
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {currentScript.showWorkflowAction && !showWorkflowPanel && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="workflow-action-btn absolute left-1/2 -translate-x-1/2 -top-16"
                onClick={(e) => { e.stopPropagation(); setShowWorkflowPanel(true); }}
              >
                <button className="group flex items-center gap-3 rounded-full border border-[#F5C842]/45 bg-[#1A0F2E]/80 px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.32em] text-[#F5C842] shadow-[0_0_24px_rgba(245,200,66,0.16)] backdrop-blur-xl transition hover:bg-[#F5C842]/15 hover:shadow-[0_0_32px_rgba(245,200,66,0.28)]">
                  <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#F5C842]/40 bg-[#F5C842]/10">
                    <BarChart3 size={14} className="text-[#F5C842]" />
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#FFE066] shadow-[0_0_10px_rgba(255,224,102,0.8)]" />
                  </span>
                  点击查看AI短剧制作流程
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {currentScript.showInterviewAction && !showReport && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="interview-action-btn absolute left-1/2 -translate-x-1/2 -top-32"
                onClick={(e) => { e.stopPropagation(); setShowReport(true); }}
              >
                <button className="group flex items-center gap-3 rounded-full border border-[#F5C842]/45 bg-[#1A0F2E]/80 px-6 py-2.5 text-[10px] font-bold tracking-[0.32em] text-[#F5C842] shadow-[0_0_24px_rgba(245,200,66,0.16)] backdrop-blur-xl transition hover:bg-[#F5C842]/15 hover:shadow-[0_0_32px_rgba(245,200,66,0.28)]">
                  <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#F5C842]/40 bg-[#F5C842]/10">
                    <FileText size={14} className="text-[#F5C842]" />
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#FFE066] shadow-[0_0_10px_rgba(255,224,102,0.8)]" />
                  </span>
                  点击查看访谈结果
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {currentScript.showReportAction && !showReport && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute left-1/2 -translate-x-1/2 -top-16 report-action-btn" onClick={(e) => { e.stopPropagation(); setShowReport(true); }}>
                <button className="bg-primary/20 border border-primary/40 rounded-full px-8 py-2 text-primary text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                  <Zap size={12} /> 查看调研报告
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-[#1A1225]/85 backdrop-blur-3xl border border-white/10 rounded-lg p-6 shadow-2xl relative">
            <div className="flex gap-4 items-start">
              <div className={`h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 ${currentScript.name === '林野' ? 'border-primary/30' : 'border-[#E67E22]/40'}`}>
                 <ImageWithFallback src={currentScript.avatar} alt={currentScript.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 space-y-2 text-left">
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
                 <motion.p key={safeStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-serif text-sm leading-relaxed text-[#F0E6D6]/85">
                   {currentScript.text}
                 </motion.p>
              </div>
            </div>

            {/* Exoneration Action Button - Below dialogue text */}
            <AnimatePresence>
              {safeStep === 4 && !showExonerationPanel && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="exoneration-action-btn flex flex-col items-center mt-4"
                  onClick={handleNext}
                >
                  <div className="relative flex flex-col items-center group">
                    <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary animate-pulse tracking-widest">
                      点击
                    </span>
                    <button
                      type="button"
                      onClick={handleNext}
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

        {!hasReturned && (
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
                   
                  </p>
                  <p>
                    AI已经能够快速理解短剧的节奏、爽点和情绪规律，甚至比人更擅长复现那些已经被市场验证过的表达方式。但是AI能够学习情绪，却无法真正经历生活。决定一段情绪是真诚还是廉价、一场眼泪是共鸣还是操控的，从来不是AI，而是站在它背后的创作者。
                  </p>
                </div>

                <div className="py-4">
                  <p className="font-serif text-[18px] italic leading-relaxed text-[#E8B839]/90 md:text-[20px]">
                    "技术负责放大情绪，人负责理解情绪。"
                  </p>
                </div>

                <div className="pt-6">
                  <p className="font-serif text-[26px] font-black leading-tight tracking-[0.12em] text-[#E8B839] md:text-[32px]">
                    真正决定作品感染力的，不是AI生成了什么，<br />
                    <span className="mt-4 block text-[#F2EBD8]">而是谁赋予了它表达人的能力。</span>
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <button 
                  onClick={handleReturnToConversation} 
                  className="px-6 py-2 border border-[#F2EBD8]/20 text-[9px] font-bold tracking-[0.3em] text-[#F2EBD8]/50 uppercase transition-colors hover:border-[#E8B839]/40 hover:text-[#E8B839]"
                >
                  回看对话
                </button>
                <button 
                  onClick={handleProceedToFinal} 
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
