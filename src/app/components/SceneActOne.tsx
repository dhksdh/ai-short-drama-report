import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "../hooks/useScrollLock";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FlourishEmbed } from "./FlourishEmbed";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Mail,
  X,
  AlertTriangle,
  FileText,
  Volume2,
  VolumeX,
  TrendingDown,
} from "lucide-react";

import img1 from "@/imports/fbc8cbce19ed07b7a1b3223fb53c746e-1.png";
import { audioAssets } from "@/audio";
import img2 from "@/imports/____8.jpg";
import img3 from "@/imports/____1.png";
import avatarGui from "@/imports/c9798d1fbc83b61645654e2f76bea038-1.jpg";
import avatarLin from "@/imports/fa0706fed8fcda03e647959e2506d84b.jpg";




const pages = [
  {
    image: img1,
    label: "第一幕 ",
    character: {
      name: "贵哥",
      avatar: avatarGui,
      color: "#E67E22",
    },
    text: "老板，您醒了？\n您刚刚突然晕过去了，没事吧？",
    audio: null,
  },
  {
    image: img2,
    label: "第一幕 ",
    title: "",
    dialogues: [
      {
        character: {
          name: "林野",
          avatar: avatarLin,
          color: "#D4A843",
        },
        text: "我没事，我没事......我这是在哪？你是谁？",
        
        audio: audioAssets.actoneDialogues[0],
      },
      {
        character: {
          name: "贵哥",
          avatar: avatarGui,
          color: "#E67E22",
        },
        text: "您真会开玩笑。这里是好莱屋AI短剧科技有限公司，您是公司的老板啊，我是您的助理，刚刚在给您汇报上周我们新剧的表现呢。",
        
        audio: audioAssets.actoneDialogues[1],
      },
      {
        character: {
          name: "林野",
          avatar: avatarLin,
          color: "#D4A843",
        },
        text: "老板？我？这家伙说啥呢......算了，先听他讲讲吧。",
        audio: audioAssets.actoneDialogues[2],
      },
      {
        character: {
          name: "贵哥",
          avatar: avatarGui,
          color: "#E67E22",
        },
        text: `上周我们拍的《穿越古代：女皇跪着喊我爹》非常成功，设置的30个爽点有效勾住了用户，尤其在剧情“一代女皇跪地求饶”处点赞激增——`,
        highlight: '爽点',
        audio: audioAssets.actoneDialogues[3],
      },
    ],
  },
  {
    image: img3,
    label: "第一幕 ",
    text: "贵哥话音未落，林野的手机上忽然弹出一条消息。打开一看，是公司的数据监测团队发来的观众投诉信。",
    color: "#6366f1",
  },
];

const actOneImageSources = Array.from(
  new Set([
    ...pages.map((page) => page.image),
    ...pages.flatMap((page) => {
      const sources: string[] = [];
      if (page.character?.avatar)
        sources.push(page.character.avatar);
      if (page.dialogues) {
        page.dialogues.forEach((dialogue) =>
          sources.push(dialogue.character.avatar),
        );
      }
      return sources;
    }),
  ]),
);

function warmActOneImages() {
  actOneImageSources.forEach((src) => {
    const linkId = `preload-${src.split("/").pop()}`;
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

export function SceneActOne({ isActive }: { isActive?: boolean }) {
  const [current, setCurrent] = useState(0);
  const [currentDialogue, setCurrentDialogue] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showEntryEffect, setShowEntryEffect] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const audioGuiRef = useRef<HTMLAudioElement | null>(null);
  const audioLinRef = useRef<HTMLAudioElement | null>(null);
  const audioGui2Ref = useRef<HTMLAudioElement | null>(null);
  const audioLin2Ref = useRef<HTMLAudioElement | null>(null);
  const audioGui3Ref = useRef<HTMLAudioElement | null>(null);
  const audioBgRef = useRef<HTMLAudioElement | null>(null);
  const audioBg2Ref = useRef<HTMLAudioElement | null>(null);
  const [bgAudioMuted, setBgAudioMuted] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);

  useScrollLock(isMailOpen);

  useEffect(() => {
    warmActOneImages();

    // Initialize audios
    audioGuiRef.current = null;
    audioLinRef.current = new Audio(audioAssets.actoneDialogues[0]);
    audioGui2Ref.current = null;
    audioLin2Ref.current = null;
    audioGui3Ref.current = null;
    const bg1 = new Audio(audioAssets.actoneBg[0]);
    const bg2 = new Audio(audioAssets.actoneBg[1]);
    // chain: when bg1 ends, play bg2 immediately
    bg1.addEventListener("ended", () => {
      bg2.currentTime = 0;
      bg2.play().catch(() => {});
    });
    bg1.addEventListener("error", () => setAudioFailed(true));
    bg2.addEventListener("error", () => setAudioFailed(true));
    audioBgRef.current = bg1;
    audioBg2Ref.current = bg2;

    return () => {
      audioGuiRef.current?.pause();
      audioLinRef.current?.pause();
      audioGui2Ref.current?.pause();
      audioLin2Ref.current?.pause();
      audioGui3Ref.current?.pause();
      audioBgRef.current?.pause();
      audioBg2Ref.current?.pause();
      audioGuiRef.current = null;
      audioLinRef.current = null;
      audioGui2Ref.current = null;
      audioLin2Ref.current = null;
      audioGui3Ref.current = null;
      audioBgRef.current = null;
      audioBg2Ref.current = null;
    };
  }, []);

  const playCurrentAudio = (
    pageIdx: number,
    dialogueIdx: number,
  ) => {
    if (audioLinRef.current) {
      audioLinRef.current.pause();
      audioLinRef.current.currentTime = 0;
    }

    if (pageIdx !== 1) return;

    const dialogue = pages[1].dialogues?.[dialogueIdx];
    const url = dialogue?.audio;
    if (!url) return;

    const audio = new Audio(url);
    audio.muted = bgAudioMuted;
    audioLinRef.current = audio;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    const bg1 = audioBgRef.current;
    const bg2 = audioBg2Ref.current;
    if (!bg1 || !bg2) return;
    if (isActive && current === 0) {
      bg2.pause();
      bg2.currentTime = 0;
      bg1.muted = bgAudioMuted;
      bg1.currentTime = 0;
      bg1.play().catch(() => {});
    } else {
      bg1.pause();
      bg2.pause();
    }
  }, [isActive, current, bgAudioMuted]);

  const toggleBgMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const bg1 = audioBgRef.current;
    const bg2 = audioBg2Ref.current;
    const dialogueAudio = audioLinRef.current;
    if (!bg1 || !bg2) return;

    const nextMuted = !bgAudioMuted;
    bg1.muted = nextMuted;
    bg2.muted = nextMuted;
    if (dialogueAudio) dialogueAudio.muted = nextMuted;
    setBgAudioMuted(nextMuted);
  };

  // 每次翻到入梦界面，交互和音频从头开始
  useEffect(() => {
    if (!isActive) {
      // 离开第一幕时停止所有音频
      audioLinRef.current?.pause();
      audioLinRef.current = null;
      return;
    }
    setCurrent(0);
    setCurrentDialogue(0);
    // 仅当从序幕跳转（triggerTransition）时播放眨眼入场动画
    // 普通滚动进入不重复播放眨眼效果
  }, [isActive]);

  useEffect(() => {
    const handleScrollEvent = (e: any) => {
      if (e.detail?.section === "act-one") {
        setCurrent(0);
        setCurrentDialogue(0);
        if (e.detail?.triggerTransition) {
          setShowEntryEffect(true);
          setTimeout(() => setShowEntryEffect(false), 2000);
        }
      }
    };
    window.addEventListener(
      "scrollToSection",
      handleScrollEvent,
    );
    return () =>
      window.removeEventListener(
        "scrollToSection",
        handleScrollEvent,
      );
  }, []);

  const paginate = (newDirection: number) => {
    const currentPage = pages[current];

    if (
      newDirection > 0 &&
      currentPage.dialogues &&
      currentDialogue < currentPage.dialogues.length - 1
    ) {
      const nextDialogue = currentDialogue + 1;
      setCurrentDialogue(nextDialogue);
      playCurrentAudio(current, nextDialogue);
      return;
    }
    if (
      newDirection < 0 &&
      currentPage.dialogues &&
      currentDialogue > 0
    ) {
      const prevDialogue = currentDialogue - 1;
      setCurrentDialogue(prevDialogue);
      playCurrentAudio(current, prevDialogue);
      return;
    }

    const nextIdx =
      (current + newDirection + pages.length) % pages.length;

    setDirection(newDirection);
    setCurrent(nextIdx);
    setCurrentDialogue(0);
    playCurrentAudio(nextIdx, 0);
  };

  const closeMailAndProceed = () => {
    setIsMailOpen(false);
    window.dispatchEvent(
      new CustomEvent("scrollToSection", { detail: { index: 4 } }),
    );
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.1,
      zIndex: 2,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-transparent px-6 lg:px-20 py-12">
      <div
        className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      >
        {actOneImageSources.map((src) => (
          <img
            key={src}
            src={src}
            alt=""
            loading="eager"
            decoding="async"
          />
        ))}
      </div>
      {/* Eye Blink / Entry Transition Overlay */}
      <AnimatePresence>
        {showEntryEffect && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 z-[100] pointer-events-none flex flex-col"
          >
            {/* Upper Eyelid */}
            <motion.div
              initial={{ height: "50%" }}
              animate={{ height: ["50%", "0%", "50%", "0%"] }}
              transition={{
                duration: 1.8,
                times: [0, 0.4, 0.7, 1],
                ease: "easeInOut",
              }}
              className="w-full bg-black"
            />
            {/* Lower Eyelid */}
            <motion.div
              initial={{ height: "50%" }}
              animate={{ height: ["50%", "0%", "50%", "0%"] }}
              transition={{
                duration: 1.8,
                times: [0, 0.4, 0.7, 1],
                ease: "easeInOut",
              }}
              className="w-full bg-black mt-auto"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] h-[80%] w-[60%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] h-[80%] w-[60%] rounded-full bg-secondary/10 blur-[120px]" />

        <div className="absolute bottom-[10%] left-0 flex w-full items-end justify-center gap-1 opacity-5">
          {[40, 60, 90, 120, 80, 50, 70, 100, 60, 40].map(
            (h, i) => (
              <div
                key={i}
                style={{ height: `${h}px` }}
                className="w-10 bg-[#0D0A12]"
              />
            ),
          )}
        </div>

        <div className="absolute inset-10 border border-primary/5" />
      </div>

      <div className="container relative z-10 flex h-full w-full max-w-7xl flex-col overflow-hidden border border-primary/15 bg-[#1A1225]/40 shadow-2xl backdrop-blur-3xl rounded-3xl md:flex-row">
        {/* Left: Image Section (75%) */}
        <div
          className="relative flex-1 cursor-pointer overflow-hidden group md:w-3/4"
          onClick={() => paginate(1)}
        >
          <AnimatePresence
            initial={false}
            custom={direction}
            mode="popLayout"
          >
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: {
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                },
                opacity: { duration: 0.5 },
                scale: { duration: 0.8 },
              }}
              className="absolute inset-0 h-full w-full"
            >
              <motion.div
                animate={
                  showEntryEffect
                    ? {
                        filter: [
                          "brightness(0) contrast(1.2) blur(10px)",
                          "brightness(1) contrast(1) blur(0px)",
                          "brightness(0) contrast(1.2) blur(5px)",
                          "brightness(1) contrast(1) blur(0px)",
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 1.8,
                  times: [0, 0.4, 0.7, 1],
                  ease: "easeInOut",
                }}
                className="h-full w-full"
              >
                <ImageWithFallback
                  src={pages[current].image}
                  alt={pages[current].title}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-contain transition-transform duration-[3s]"
                />
              </motion.div>

              {/* Dynamic Vignette during transition */}
              <motion.div
                animate={
                  showEntryEffect
                    ? {
                        background: [
                          "radial-gradient(circle, transparent 0%, black 60%)",
                          "radial-gradient(circle, transparent 100%, black 100%)",
                          "radial-gradient(circle, transparent 0%, black 60%)",
                          "radial-gradient(circle, transparent 100%, black 100%)",
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 1.8,
                  times: [0, 0.4, 0.7, 1],
                  ease: "easeInOut",
                }}
                className="absolute inset-0 pointer-events-none"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-[#1A1225]/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1225]/50 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Click Hint Overlay */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
            <span className="text-[12px] tracking-[0.4em] text-white/60 uppercase">
              点击推进第一幕
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ChevronRight
                className="text-primary"
                size={24}
              />
            </motion.div>
          </div>

          {/* Page Label (Top Left) */}
          <div className="absolute top-8 left-8 overflow-hidden z-20">
            <motion.div
              key={current}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="h-0.5 w-8 bg-primary/60" />
              <span className="font-serif text-xs tracking-[0.3em] text-[#FFF8E7] uppercase">
                {pages[current].label}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Right: Narration Section (25%) */}
        <div className="flex w-full flex-col bg-gradient-to-b from-[#1A0A2E]/80 to-[#241245]/90 backdrop-blur-md md:w-[28%] border-l border-primary/5">
          {/* Header */}
          <div className="p-8 pb-4 border-b border-primary/10 flex items-start justify-between">
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-wider text-primary">
              第一幕
            </h2>
            {isActive && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                onClick={toggleBgMute}
                title={audioFailed ? "音频加载失败" : bgAudioMuted ? "取消静音" : "静音"}
                className="mt-1 flex flex-col items-center gap-1 text-primary/60 hover:text-primary transition-colors"
              >
                {audioFailed ? <VolumeX size={18} className="text-red-400/70" /> : bgAudioMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                <span className={`text-[9px] tracking-widest uppercase ${audioFailed ? "text-red-400/60" : "text-primary/40"}`}>{audioFailed ? "失败" : "音频"}</span>
              </motion.button>
            )}
          </div>

          {/* Content */}
          <div className="relative flex flex-1 flex-col justify-center p-10 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${current}-${currentDialogue}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={14}
                    className="text-primary/40"
                  />
                  <h3 className="font-serif text-xl text-[#FFF8E7]/90 tracking-wide">
                    {pages[current].title}
                  </h3>
                </div>

                {/* Dialogue or Single Character */}
                {(pages[current].dialogues
                  ? pages[current].dialogues[currentDialogue]
                      .character
                  : pages[current].character) && (
                  <div className="flex items-center gap-4 mb-2">
                    <div
                      className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 bg-black/40 shadow-[0_0_20px_rgba(255,184,0,0.15)] transition-colors duration-500"
                      style={{
                        borderColor:
                          (pages[current].dialogues
                            ? pages[current].dialogues[
                                currentDialogue
                              ].character.color
                            : pages[current].character.color) +
                          "66",
                      }}
                    >
                      <ImageWithFallback
                        src={
                          pages[current].dialogues
                            ? pages[current].dialogues[
                                currentDialogue
                              ].character.avatar
                            : pages[current].character.avatar
                        }
                        alt={
                          pages[current].dialogues
                            ? pages[current].dialogues[
                                currentDialogue
                              ].character.name
                            : pages[current].character.name
                        }
                        loading="eager"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span
                        className="font-serif text-sm font-bold tracking-[0.3em] uppercase transition-colors duration-500"
                        style={{
                          color: pages[current].dialogues
                            ? pages[current].dialogues[
                                currentDialogue
                              ].character.color
                            : pages[current].character.color,
                        }}
                      >
                        {pages[current].dialogues
                          ? pages[current].dialogues[
                              currentDialogue
                            ].character.name
                          : pages[current].character.name}
                      </span>
                      <div
                        className="h-[1px] w-8 mt-1 transition-all duration-500"
                        style={{
                          background: `linear-gradient(to right, ${pages[current].dialogues ? pages[current].dialogues[currentDialogue].character.color : pages[current].character.color}99, transparent)`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <p className="font-serif text-[15px] leading-[2.2] text-white/75 text-justify whitespace-pre-line">
                  {(() => {
                    const rawText = pages[current].dialogues
                      ? pages[current].dialogues[currentDialogue].text
                      : pages[current].text;
                    const highlight = pages[current].dialogues
                      ? pages[current].dialogues[currentDialogue].highlight
                      : pages[current].highlight;
                    if (!highlight) return rawText;
                    return rawText.split(highlight).map((part, i, arr) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < arr.length - 1 && (
                          <span className="text-primary font-bold decoration-primary/30 decoration-1 underline-offset-4">{highlight}</span>
                        )}
                      </React.Fragment>
                    ));
                  })()}
                </p>

                {current === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="pt-4"
                  >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMailOpen(true);
                        }}
                        className="group relative flex w-full flex-col items-center justify-center border border-primary/20 bg-primary/5 px-4 py-5 transition-all hover:border-primary/50 hover:bg-primary/10"
                      >
                      {/* 居中"点击"提示 */}
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                        }}
                        className="mb-2 text-[9px] text-primary bg-primary/20 px-2 py-0.5 rounded font-bold tracking-widest"
                      >
                        点击
                      </motion.span>

                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary relative">
                          <Mail size={18} />
                          <motion.div
                            animate={{
                              scale: [1, 1.4, 1],
                              opacity: [0.5, 0, 0.5],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 2,
                            }}
                            className="absolute inset-0 rounded-full border border-primary/50"
                          />
                        </div>
                        <p className="font-serif text-sm font-bold tracking-widest text-primary uppercase">
                          查看投诉信
                        </p>
                      </div>
                    </button>
                    {/* 添加调试日志，确认点击区域是否被触发 */}
                    <div className="hidden" aria-hidden="true" onClick={() => console.log('Mail button clicked')}></div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer / Indicator */}
          <div className="p-8 pt-4 flex items-center justify-between border-t border-primary/10">
            <div className="flex gap-1.5">
              {pages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDirection(idx > current ? 1 : -1);
                    setCurrent(idx);
                    setCurrentDialogue(0);
                  }}
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: idx === current ? "32px" : "8px",
                    backgroundColor:
                      idx <= current
                        ? "#D4A843"
                        : "rgba(255,255,255,0.05)",
                  }}
                />
              ))}
            </div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-white/30">
              <span className="text-primary font-bold">
                {String(current + 1).padStart(2, "0")}
              </span>{" "}
              / {String(pages.length).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Floating Navigation Arrows */}
        <div className="absolute left-8 bottom-8 flex gap-4 md:hidden z-30">
          <button
            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
            className="p-3 rounded-full bg-black/60 text-primary border border-primary/20 backdrop-blur-md"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); paginate(1); }}
            className="p-3 rounded-full bg-black/60 text-primary border border-primary/20 backdrop-blur-md"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Complaint Letter Modal — rendered via portal to escape snap-section overflow:hidden */}
      {createPortal(
        <AnimatePresence>
          {isMailOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9000] flex flex-col bg-[#0D0A12]/95 backdrop-blur-xl"
            >
              <motion.div
                initial={{ y: 40, scale: 0.97, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: 40, scale: 0.97, opacity: 0 }}
                className="relative flex flex-col w-full h-full border border-red-900/30 bg-[#1A1225] shadow-2xl"
              >
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />

                <button
                  onClick={closeMailAndProceed}
                  className="absolute top-3 right-3 text-primary/40 transition-colors hover:text-primary z-10"
                >
                  <X size={28} strokeWidth={3} />
                </button>

                {/* 顶部标题栏 */}
                <div className="flex shrink-0 items-center gap-4 border-b border-primary/10 px-5 py-2.5 pr-10">
                  <AlertTriangle size={12} className="text-red-500 shrink-0" />
                  <h4 className="font-serif text-base text-primary tracking-widest">
                    观众投诉信
                  </h4>
                  <div className="ml-auto flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-primary/50">
                      <TrendingDown size={12} />
                      <span className="text-[10px] font-bold tracking-[0.2em]">
                        观众情绪分布
                      </span>
                    </div>
                    <div className="px-2 py-0.5 bg-red-950/40 border border-red-900/50 rounded text-[9px] text-red-500 font-bold tracking-widest animate-pulse">
                      紧急
                    </div>
                  </div>
                </div>

                {/* 图表区域 — 占据剩余全部高度，允许纵向滚动以保证最小渲染尺寸 */}
                <div className="flex-1 min-h-0 overflow-y-auto p-2">
                  <FlourishEmbed
                    src="visualisation/29522043"
                    className="w-full rounded-md border border-white/5 bg-white/[0.02]"
                    style={{ height: "max(calc(100vh - 90px), 620px)" }}
                    ariaLabel="观众情绪气泡图"
                  />
                </div>

                {/* 数据来源 */}
                <p className="shrink-0 px-5 pb-2 text-[9px] leading-relaxed tracking-wide text-[#F5E6C8]/50">
                  数据来源：问卷调查1000份，有效回收648份。反感原因归为"审美低下""内容同质""情绪空洞"三类，气泡大小表示被提及人次。
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}