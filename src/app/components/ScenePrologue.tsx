import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ChevronRight, ChevronLeft, Sparkles, MousePointer2, X, Zap, Volume2, VolumeX } from "lucide-react";

import img1 from "@/imports/1c92407f63f7eaf29e0cd8a8c1bdf60a.jpg";
import img2 from "@/imports/____2.png";
import img3 from "@/imports/____7.png";
import img4New from "@/imports/____9.png";
import avatarLin from "@/imports/fa0706fed8fcda03e647959e2506d84b-1.jpg";

import { MarketDashboard, preheatMarketDashboard } from "./MarketDashboard";
import { audioAssets } from "../../audio";

const pages = [
  {
    image: img1,
    label: "序幕 ",
    character: { name: "林野", avatar: avatarLin },
    narrative: "晚上十点，你还在摄制基地给演员讲剧本。",
    text: "(又拍到半夜了......周末前还必须做出成片来，等会回公司改改明天的剧本吧。）",
    highlight: "成片"
  },
  {
    image: img2,
    label: "序幕",
    character: { name: "林野", avatar: avatarLin },
    narrative: "2026年一季度，真人短剧受AI短剧冲击已陷入生存困境：全国真人短剧开机量同比骤降75%。2026年一季度AI短剧占全国微短剧总产量的比例已超95%，平均制作成本仅为真人短剧的十分之一。\nAI产能虽高，但受众认可度差距显著......\n",
    text: "（我还是先看看上周的数据吧————怎么毫无起色啊？唉，AI剧那么赚钱，怪不得大伙要走。但是去做粗制滥造的AI片，不是糟践这些年积累的本事吗？）",
    
  },
  {
    image: img3,
    label: "序幕",
    text: "林野正要开始编辑剧本，已经跳槽到AI公司的工友阿钱突然发来一条消息。",
    highlight: "消息",
    isLarge: true
  },
  {
    image: img4New,
    label: "序幕",
    character: { name: "林野", avatar: avatarLin },
    text: `（真有这么好？我倒要看看用AI做的片子能有什么了不起。）`,
    highlight: "重生"
  }
];

const prologueImageSources = Array.from(new Set([
  ...pages.map((page) => page.image),
  ...pages.flatMap((page) => page.character?.avatar ? [page.character.avatar] : []),
]));

function warmPrologueImages() {
  prologueImageSources.forEach((src) => {
    const linkId = `preload-${src.split('/').pop()}`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    }

    const img = new Image();
    img.src = src;
    img.decoding = "async";
    img.decode?.().catch(() => undefined);
  });
}

export function ScenePrologue({ isActive }: { isActive?: boolean }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showChart, setShowChart] = useState(false);
  const [dashboardDismissed, setDashboardDismissed] = useState(false);
  const [isHallucinating, setIsHallucinating] = useState(false);
  const [isBlackout, setIsBlackout] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audio2Ref = useRef<HTMLAudioElement>(null);
  const audio3Ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    warmPrologueImages();
    preheatMarketDashboard();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isActive && current === 0) {
      audio.muted = isMuted;
      if (audio.paused) audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isActive, current, isMuted]);

  useEffect(() => {
    const audio2 = audio2Ref.current;
    if (!audio2) return;
    if (isActive && current === 1) {
      audio2.muted = isMuted;
      if (audio2.paused) audio2.play().catch(() => {});
    } else {
      audio2.pause();
    }
  }, [isActive, current, isMuted]);

  useEffect(() => {
    const audio3 = audio3Ref.current;
    if (!audio3) return;
    if (isActive && current === 3) {
      audio3.muted = isMuted;
      if (audio3.paused) audio3.play().catch(() => {});
    } else {
      audio3.pause();
    }
  }, [isActive, current, isMuted]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) audioRef.current.muted = nextMuted;
    if (audio2Ref.current) audio2Ref.current.muted = nextMuted;
    if (audio3Ref.current) audio3Ref.current.muted = nextMuted;
  };

  useEffect(() => {
    if (!isActive) return;
    setCurrent(0);
    setDirection(0);
    setShowChart(false);
    setDashboardDismissed(false);
    setIsHallucinating(false);
    setIsBlackout(false);
  }, [isActive]);

  useEffect(() => {
    if (current !== 1) {
      setDashboardDismissed(false);
    }
    setIsHallucinating(false);
    setIsBlackout(false);
  }, [current]);

  const paginate = (newDirection: number) => {
    if (showChart || isHallucinating || isBlackout) return;
    setDirection(newDirection);
    const next = (current + newDirection + pages.length) % pages.length;
    setCurrent(next);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.5, // Increased scale for enter
      zIndex: 2,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1.1, // Slight zoom-in while active for filmic feel
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.8,
    }),
  };

  const jumpToActOne = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isHallucinating || isBlackout) return;

    setIsHallucinating(true);

    window.setTimeout(() => {
      setIsBlackout(true);
    }, 1000);

    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("scrollToSection", {
        detail: { index: 3, section: "act-one", triggerTransition: true }
      }));
    }, 2320);
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-transparent px-6 lg:px-20 py-12">
      <audio ref={audioRef} src={audioAssets.prologue[0]!} preload="auto" onError={() => setAudioFailed(true)} />
      <audio ref={audio2Ref} src={audioAssets.prologue[1]!} preload="auto" onError={() => setAudioFailed(true)} />
      <audio ref={audio3Ref} src={audioAssets.prologue[3]!} preload="auto" onError={() => setAudioFailed(true)} />
      <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
        {prologueImageSources.map((src) => (
          <img key={src} src={src} alt="" loading="eager" decoding="async" />
        ))}
      </div>
      {/* Background Decor Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2D1F3E]/40 via-[#3D2F4E]/20 to-transparent pointer-events-none" />
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] h-[80%] w-[60%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] h-[80%] w-[60%] rounded-full bg-secondary/10 blur-[120px]" />
        
        {/* City Silhouettes in the distance (Reference from SceneStudio) */}
        <div className="absolute bottom-[10%] left-0 flex w-full items-end justify-center gap-1 opacity-5">
          {[40, 60, 90, 120, 80, 50, 70, 100, 60, 40].map((h, i) => (
            <div key={i} style={{ height: `${h}px` }} className="w-10 bg-[#0D0A12]" />
          ))}
        </div>

        {/* Film frame lines */}
        <div className="absolute inset-10 border border-primary/5" />
      </div>

      <div className="container relative z-10 flex h-full w-full max-w-7xl flex-col overflow-hidden border border-primary/15 bg-[#1A1225]/40 shadow-2xl backdrop-blur-3xl rounded-3xl md:flex-row">
        
        {/* Left: Image Section (75%) */}
        <div 
          className={`relative flex-1 overflow-hidden group md:w-3/4 ${isHallucinating || isBlackout ? "cursor-default" : "cursor-pointer"}`}
          onClick={() => paginate(1)}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 200, damping: 25 },
                opacity: { duration: 0.5 },
                scale: { duration: 1.2, ease: "easeOut" }
              }}
              className="absolute inset-0 h-full w-full scene-prologue-motion-container"
            >
              <motion.div
                className="h-full w-full"
                animate={isHallucinating && current === 3 ? {
                  filter: "blur(10px) brightness(1.25) contrast(1.08) saturate(0.55)",
                  opacity: 0.8,
                } : {
                  filter: "blur(0px) brightness(1) contrast(1) saturate(1)",
                  opacity: 1,
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <ImageWithFallback
                  src={pages[current].image}
                  alt={pages[current].title}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-[#1A1225]/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1225]/50 to-transparent" />

              {/* Data Dashboard Overlay for Page 2 */}
              {current === 1 && (
                <div 
                  className="absolute inset-0 z-20 flex items-center justify-center p-8 bg-black/40 backdrop-blur-[2px]"
                  onClick={(e) => {
                    // Prevent pagination when clicking the overlay area if chart is shown
                    if (showChart) e.stopPropagation();
                  }}
                >
                   <AnimatePresence>
                    {!showChart ? (
                      !dashboardDismissed ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.1 }}
                          className="relative group/chart-trigger"
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowChart(true); }}
                            className="flex flex-col items-center gap-4 bg-primary/20 hover:bg-primary/40 p-8 rounded-2xl border border-primary/30 backdrop-blur-xl transition-all shadow-[0_0_50px_rgba(201,164,87,0.2)]"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                            >
                              <Zap size={48} className="text-primary fill-primary/20" />
                            </motion.div>
                            <div className="text-center space-y-1">
                              <span className="block font-serif text-lg font-bold text-white tracking-widest uppercase italic">查看行业数据看板</span>
                              <span className="block text-[10px] text-primary/60 tracking-[0.3em] uppercase"></span>
                            </div>
                          </button>
                        </motion.div>
                      ) : null
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.96 }}
                        className="relative z-50 flex w-full max-w-[min(1180px,94vw)] flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Close Button X */}
                        <div className="absolute top-0 right-0 md:-top-2 md:-right-2 z-[60]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowChart(false);
                              setDashboardDismissed(true);
                            }}
                            className="group/close flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1225] border-2 border-primary/40 text-primary transition-all hover:bg-primary hover:text-[#1A1225] hover:scale-110 shadow-[0_0_20px_rgba(201,164,87,0.3)]"
                          >
                            <X size={24} strokeWidth={3} />
                          </button>
                        </div>

                        <MarketDashboard onBack={() => { setShowChart(false); setDashboardDismissed(true); }} />

                      </motion.div>
                    )}
                   </AnimatePresence>

                   {/* 隐藏预热实例：showChart 前始终挂载、不可见，让 iframe 提前完成脚本加载 */}
                   {!showChart && (
                     <div className="pointer-events-none absolute -z-10 opacity-0" style={{ width: 1, height: 1, overflow: "hidden" }}>
                       <MarketDashboard />
                     </div>
                   )}
                </div>
              )}

              {/* Action Button on Page 4 */}
              {current === 3 && !isHallucinating && !isBlackout && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
                    className="absolute left-[35%] top-[45%] z-30"
                  >
                  <button
                    onClick={jumpToActOne}
                    className="group/btn relative flex items-center justify-center"
                  >
                    {/* Pulsing rings */}
                    <motion.div 
                      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute h-20 w-20 rounded-full border border-primary/50"
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="absolute h-20 w-20 rounded-full border border-primary/30"
                    />
                    
                    {/* Main Button */}
                    <div className="relative flex flex-col items-center gap-2 rounded-full bg-primary/20 p-6 backdrop-blur-md border border-primary/40 transition-all duration-300 group-hover/btn:bg-primary/40 group-hover/btn:border-primary group-hover/btn:scale-110">
                      <MousePointer2 className="text-primary" size={24} />
                      <span className="font-serif text-sm tracking-[0.2em] text-white font-bold">点击</span>
                    </div>
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>


          {/* Click Hint Overlay */}
          {(current !== 1 || dashboardDismissed) && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
              <span className="text-[12px] tracking-[0.4em] text-white/60 uppercase">点击继续剧情</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <ChevronRight className="text-primary" size={24} />
              </motion.div>
            </div>
          )}

          {/* Page Label (Top Left) */}
          <div className="absolute top-8 left-8 overflow-hidden z-20">
             <motion.div
               key={current}
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="flex items-center gap-3"
             >
                <div className="h-0.5 w-8 bg-primary/60" />
                <span className="font-serif text-xs tracking-[0.3em] text-[#FFF8E7] uppercase">{pages[current].label}</span>
             </motion.div>
          </div>
        </div>

        {/* Right: Narration Section (25%) */}
        <div className="flex w-full flex-col bg-gradient-to-b from-[#1A0A2E]/80 to-[#241245]/90 backdrop-blur-md md:w-[28%] border-l border-primary/5">
           {/* Header */}
           <div className={`${current === 1 ? "p-6 pb-3" : "p-8 pb-4"} border-b border-primary/10 flex items-start justify-between`}>
              <h2 className={`${current === 1 ? "mt-1 text-2xl" : "mt-2 text-3xl"} font-serif font-bold tracking-wider text-primary`}>序幕</h2>
              {isActive && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={toggleMute}
                  title={audioFailed ? "音频加载失败" : isMuted ? "取消静音" : "静音"}
                  className="mt-1 flex flex-col items-center gap-1 text-primary/60 hover:text-primary transition-colors"
                >
                  {audioFailed ? <VolumeX size={18} className="text-red-400/70" /> : isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  <span className={`text-[9px] tracking-widest uppercase ${audioFailed ? "text-red-400/60" : "text-primary/40"}`}>{audioFailed ? "失败" : "音频"}</span>
                </motion.button>
              )}
           </div>

           {/* Content */}
           <div className={`relative flex flex-1 flex-col ${current === 1 ? "justify-start overflow-y-auto p-6" : "justify-center overflow-hidden p-10"}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className={current === 1 ? "space-y-3" : "space-y-4"}
                >
                   {pages[current].narrative && (
                     <p className={`${current === 1 ? "mb-4 text-[12px] leading-[1.65]" : "mb-6 text-[14px] leading-relaxed"} font-serif text-white/50 italic border-l-2 border-primary/20 pl-4`}>
                       {pages[current].narrative}
                     </p>
                   )}

                   {pages[current].character && (
                     <div className={`${current === 1 ? "mb-1 gap-3" : "mb-2 gap-4"} flex items-center`}>
                       <div className={`${current === 1 ? "h-11 w-11" : "h-14 w-14"} shrink-0 overflow-hidden rounded-full border-2 border-primary/30 bg-black/40 shadow-[0_0_20px_rgba(255,184,0,0.15)]`}>
                         <ImageWithFallback
                           src={pages[current].character.avatar}
                           alt={pages[current].character.name}
                           loading="eager"
                           decoding="async"
                           className="h-full w-full object-cover"
                         />
                       </div>
                       <div className="flex flex-col">
                         <span className="font-serif text-sm font-bold tracking-[0.3em] text-primary uppercase">{pages[current].character.name}</span>
                         <div className="h-[1px] w-8 bg-gradient-to-r from-primary/60 to-transparent mt-1" />
                       </div>
                     </div>
                   )}
                   
                   <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-primary/40" />
                      <h3 className="font-serif text-xl text-[#FFF8E7]/90 tracking-wide">{pages[current].title || ""}</h3>
                   </div>
                   
                   <p className={`font-serif text-white/75 text-justify whitespace-pre-line ${current === 1 ? "text-[12.5px] leading-[1.85]" : pages[current].isLarge ? "text-[22px] leading-[2.2]" : "text-[15px] leading-[2.2]"}`}>
                     {pages[current].text.split(pages[current].highlight).map((part, i, arr) => (
                       <React.Fragment key={i}>
                         {part}
                         {i < arr.length - 1 && (
                           <span className="text-primary font-bold decoration-primary/30 decoration-1 underline-offset-4">{pages[current].highlight}</span>
                         )}
                       </React.Fragment>
                     ))}
                   </p>
                </motion.div>
              </AnimatePresence>
           </div>

           {/* Footer / Indicator */}
           <div className="p-8 pt-4 flex items-center justify-between border-t border-primary/10">
              <div className="flex gap-1.5">
                {pages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > current ? 1 : -1);
                      setCurrent(idx);
                    }}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{ 
                      width: idx === current ? '32px' : '8px',
                      backgroundColor: idx <= current ? '#D4A843' : 'rgba(255,255,255,0.05)'
                    }}
                  />
                ))}
              </div>
              <div className="font-mono text-[10px] tracking-[0.2em] text-white/30">
                <span className="text-primary font-bold">{String(current + 1).padStart(2, '0')}</span> / {String(pages.length).padStart(2, '0')}
              </div>
           </div>
        </div>

        {/* Floating Navigation Arrows */}
        <div className="absolute left-8 bottom-8 flex gap-4 md:hidden z-30">
           <button onClick={() => paginate(-1)} className="p-3 rounded-full bg-black/60 text-primary border border-primary/20 backdrop-blur-md">
              <ChevronLeft size={20} />
           </button>
           <button onClick={() => paginate(1)} className="p-3 rounded-full bg-black/60 text-primary border border-primary/20 backdrop-blur-md">
              <ChevronRight size={20} />
           </button>
        </div>
      </div>

      <AnimatePresence>
        {isBlackout && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] overflow-hidden bg-transparent"
          >
            <motion.div
              initial={{ height: "0%", borderBottomLeftRadius: "50% 24%", borderBottomRightRadius: "50% 24%" }}
              animate={{
                height: ["0%", "46%", "50%", "0%", "46%", "50%"],
                borderBottomLeftRadius: ["50% 24%", "50% 18%", "0% 0%", "50% 24%", "50% 18%", "0% 0%"],
                borderBottomRightRadius: ["50% 24%", "50% 18%", "0% 0%", "50% 24%", "50% 18%", "0% 0%"],
              }}
              transition={{ duration: 1.28, times: [0, 0.28, 0.36, 0.58, 0.88, 1], ease: [0.65, 0, 0.35, 1] }}
              className="absolute left-[-8%] top-0 w-[116%] bg-black shadow-[0_18px_40px_rgba(0,0,0,0.9)]"
            />
            <motion.div
              initial={{ height: "0%", borderTopLeftRadius: "50% 24%", borderTopRightRadius: "50% 24%" }}
              animate={{
                height: ["0%", "46%", "50%", "0%", "46%", "50%"],
                borderTopLeftRadius: ["50% 24%", "50% 18%", "0% 0%", "50% 24%", "50% 18%", "0% 0%"],
                borderTopRightRadius: ["50% 24%", "50% 18%", "0% 0%", "50% 24%", "50% 18%", "0% 0%"],
              }}
              transition={{ duration: 1.28, times: [0, 0.28, 0.36, 0.58, 0.88, 1], ease: [0.65, 0, 0.35, 1] }}
              className="absolute bottom-0 left-[-8%] w-[116%] bg-black shadow-[0_-18px_40px_rgba(0,0,0,0.9)]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0, 0, 0, 1] }}
              transition={{ duration: 1.28, times: [0, 0.28, 0.36, 0.58, 0.9, 1], ease: "linear" }}
              className="absolute inset-0 bg-black"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
