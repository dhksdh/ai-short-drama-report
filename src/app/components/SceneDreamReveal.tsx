import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import dreamVideoFile from "../data/media/dream-reveal.mp4";
import { audioAssets } from "@/audio";

import dreamOutro1Local from "../../imports/dream-outro-1.jpg";
import dreamOutro2Local from "../../imports/dream-outro-2.jpg";
const dreamStillUrl = "https://link.jiyiho.cn/orfile/view.php/be41d640288f8c1fe263b02a693d9b49.jpg";
const dreamOutroFrame1 = dreamOutro1Local;
const dreamOutroFrame2 = dreamOutro2Local;

let dreamCameraAudioContext: AudioContext | null = null;
function getDreamCameraAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!dreamCameraAudioContext || dreamCameraAudioContext.state === "closed") {
    dreamCameraAudioContext = new AudioContextClass();
  }
  return dreamCameraAudioContext;
}
function playDreamCameraClick() {
  try {
    const ctx = getDreamCameraAudioContext();
    if (!ctx) return;
    ctx.resume?.();
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(2.4, now + 0.006);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    master.connect(ctx.destination);
    const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.07), ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.1);
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(1800, now);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(1.7, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    noise.connect(filter); filter.connect(gain); gain.connect(master);
    noise.start(now); noise.stop(now + 0.09);
    [1200, 2600, 620].forEach((frequency, index) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const start = now + index * 0.026;
      osc.type = index === 1 ? "square" : "triangle";
      osc.frequency.setValueAtTime(frequency, start);
      oscGain.gain.setValueAtTime(index === 0 ? 0.9 : 0.58, start);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.07);
      osc.connect(oscGain); oscGain.connect(master);
      osc.start(start); osc.stop(start + 0.085);
    });
  } catch {}
}

export function SceneDreamReveal({ isActive }: { isActive?: boolean }) {
  const [frame, setFrame] = useState<0 | 1>(0);
  const [outroStage, setOutroStage] = useState<0 | 1 | 2>(0);
  const [showText, setShowText] = useState(false);
  const [showBlink, setShowBlink] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blinkTimerRef = useRef<number | null>(null);
  const prewarmedRef = useRef(false);
  const frameReachedRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      setFrame(0);
      setOutroStage(0);
      setShowText(false);
      setShowBlink(false);
      setVideoVisible(false);
      prewarmedRef.current = false;
      frameReachedRef.current = false;
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (blinkTimerRef.current) {
        window.clearTimeout(blinkTimerRef.current);
        blinkTimerRef.current = null;
      }
      return;
    }

    setFrame(0);
    setOutroStage(0);
    setShowText(false);
    setVideoVisible(false);
    prewarmedRef.current = false;
    frameReachedRef.current = false;
    setShowBlink(true);

    // 立即启动视频后台播放（opacity:0），给解码器预热时间
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.currentTime = 0;
      video.play().catch(() => {});
      // 视频播完前如果还没揭晓，暂停并复位等待正式播放
      const onPrewarmEnded = () => {
        if (!frameReachedRef.current) {
          video.pause();
          video.currentTime = 0;
          prewarmedRef.current = true;
        }
      };
      video.addEventListener("ended", onPrewarmEnded, { once: true });
      // 清理函数中会移除监听
      const cleanupVideo = () => {
        video.removeEventListener("ended", onPrewarmEnded);
      };
      // 保存清理引用
      (video as any).__cleanupPrewarm = cleanupVideo;
    }

    // 预加载音频
    const audio = new Audio(audioAssets.dreamReveal);
    audio.preload = "auto";
    audioRef.current = audio;

    // 眨眼动画结束后：显示文字 + 播放音频
    const blinkDuration = 2200;
    blinkTimerRef.current = window.setTimeout(() => {
      setShowBlink(false);
      setShowText(true);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    }, blinkDuration);

    // 音频结束时：文字消失 → 进入 frame=1
    const onAudioEnded = () => {
      setShowText(false);
      window.setTimeout(() => {
        frameReachedRef.current = true;
        setFrame(1);
      }, 100);
    };
    audio.addEventListener("ended", onAudioEnded, { once: true });

    return () => {
      if (blinkTimerRef.current) window.clearTimeout(blinkTimerRef.current);
      audio.removeEventListener("ended", onAudioEnded);
      audio.pause();
      audioRef.current = null;
      if (video && (video as any).__cleanupPrewarm) {
        (video as any).__cleanupPrewarm();
        (video as any).__cleanupPrewarm = undefined;
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (frame === 1 && videoRef.current) {
      const video = videoRef.current;
      // 解码器已被预热的视频播放过，seek 到开头重新播放近乎瞬间
      video.currentTime = 0;
      video.play().catch(() => {});
      // 立即显示——解码器已预热，不需要等 playing 事件
      setVideoVisible(true);
    }
  }, [frame]);

  useEffect(() => {
    if (typeof Image !== "undefined") {
      [dreamStillUrl, dreamOutroFrame1, dreamOutroFrame2].forEach((src) => {
        const img = new Image();
        img.src = src;
        img.decoding = "async";
        img.decode?.().catch(() => undefined);
      });
    }

    // 预热视频：挂载即开始缓冲，等到 frame=1 时可立刻播放
    if (videoRef.current) {
      videoRef.current.preload = "auto";
      videoRef.current.load();
    }
  }, []);

  const handleVideoEnded = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    event.currentTarget.pause();
    window.setTimeout(() => {
      setOutroStage(1);
      window.setTimeout(() => {
        setOutroStage(2);
        playDreamCameraClick();
      }, 600);
    }, 1500);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0D0A12]">
      {/* Video — plays hidden during blink/prewarm, becomes visible when frame=1 */}
      <video
        ref={videoRef}
        src={dreamVideoFile}
        muted
        playsInline
        preload="auto"
        onEnded={(e) => {
          // 只有正式揭晓后的 ended 才触发 outro
          if (frameReachedRef.current) {
            handleVideoEnded(e);
          }
        }}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${videoVisible ? "opacity-100" : "opacity-0"}`}
      />

      {/* Image layered on top — fades out instantly when video becomes visible */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: videoVisible ? 0 : 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <img
          src={dreamStillUrl}
          alt="梦醒揭示定格"
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </motion.div>

      <AnimatePresence>
        {outroStage > 0 && (
          <motion.div
            key={outroStage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: outroStage === 2 ? 0.08 : 0.2, ease: "easeOut" }}
            className="absolute inset-0 z-[6] bg-transparent"
          >
            <img
              src={outroStage === 2 ? dreamOutroFrame2 : dreamOutroFrame1}
              alt={outroStage === 2 ? "梦醒定格第二帧" : "梦醒定格第一帧"}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover opacity-80 mix-blend-screen saturate-[0.85] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0A12]/30 via-[#1E112F]/5 to-[#0D0A12]/16 mix-blend-multiply" />
            <div className="absolute inset-0 bg-[#D4A843]/8 mix-blend-soft-light" />
            {outroStage === 2 && (
              <motion.div
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                className="absolute inset-0 bg-[#F5E6C8] mix-blend-screen"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dream vignette atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_34%,rgba(0,0,0,0.34)_68%,rgba(0,0,0,0.78)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:repeating-linear-gradient(90deg,#F5E6C8,#F5E6C8_1px,transparent_1px,transparent_4px)]" />

      <AnimatePresence>
        {showBlink && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, times: [0, 0.92, 1], ease: "easeInOut" }}
            className="pointer-events-none absolute inset-0 z-50 flex flex-col"
          >
            <motion.div
              initial={{ height: "0%", borderBottomLeftRadius: "50% 24%", borderBottomRightRadius: "50% 24%" }}
              animate={{
                height: ["0%", "46%", "50%", "0%", "46%", "50%", "0%"],
                borderBottomLeftRadius: ["50% 24%", "50% 18%", "0% 0%", "50% 24%", "50% 18%", "0% 0%", "50% 24%"],
                borderBottomRightRadius: ["50% 24%", "50% 18%", "0% 0%", "50% 24%", "50% 18%", "0% 0%", "50% 24%"],
              }}
              transition={{ duration: 2.05, times: [0, 0.18, 0.26, 0.48, 0.68, 0.78, 1], ease: "easeInOut" }}
              className="-ml-[8%] w-[116%] bg-black shadow-[0_18px_40px_rgba(0,0,0,0.9)]"
            />
            <motion.div
              initial={{ height: "0%", borderTopLeftRadius: "50% 24%", borderTopRightRadius: "50% 24%" }}
              animate={{
                height: ["0%", "46%", "50%", "0%", "46%", "50%", "0%"],
                borderTopLeftRadius: ["50% 24%", "50% 18%", "0% 0%", "50% 24%", "50% 18%", "0% 0%", "50% 24%"],
                borderTopRightRadius: ["50% 24%", "50% 18%", "0% 0%", "50% 24%", "50% 18%", "0% 0%", "50% 24%"],
              }}
              transition={{ duration: 2.05, times: [0, 0.18, 0.26, 0.48, 0.68, 0.78, 1], ease: "easeInOut" }}
              className="-ml-[8%] mt-auto w-[116%] bg-black shadow-[0_-18px_40px_rgba(0,0,0,0.9)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="pointer-events-none absolute inset-0 z-10"
        animate={showBlink ? {
          background: [
            "radial-gradient(circle, transparent 0%, black 62%)",
            "radial-gradient(circle, transparent 26%, black 70%)",
            "radial-gradient(circle, transparent 100%, black 100%)",
            "radial-gradient(circle, transparent 0%, black 62%)",
            "radial-gradient(circle, transparent 26%, black 70%)",
            "radial-gradient(circle, transparent 100%, black 100%)",
          ],
        } : { background: "radial-gradient(circle, transparent 44%, rgba(0,0,0,0.36) 72%, rgba(0,0,0,0.76) 100%)" }}
        transition={{ duration: 2.05, times: [0, 0.18, 0.48, 0.58, 0.78, 1], ease: "easeInOut" }}
      />

      <AnimatePresence>
        {outroStage === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
            className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-3"
            onClick={() => window.dispatchEvent(new CustomEvent("scrollToSection", { detail: { index: 11 } }))}
          >
            <motion.div
              animate={{ height: [0, 32, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-[1px] bg-gradient-to-b from-transparent via-primary to-primary/50 shadow-[0_0_12px_rgba(212,168,67,0.6)]"
            />
            <span className="cursor-pointer font-serif text-[14px] font-black uppercase tracking-[0.8em] text-primary drop-shadow-[0_0_24px_rgba(212,168,67,1)] pl-[0.8em]">
              点击
            </span>
            <motion.div
              animate={{ height: [0, 32, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.75 }}
              className="w-[1px] bg-gradient-to-b from-primary/50 via-primary to-transparent shadow-[0_0_12px_rgba(212,168,67,0.6)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showText && (
          <motion.div
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="absolute inset-0 z-20 flex items-center justify-center"
          >
            <div className="relative">
              <div className="absolute -left-16 top-1/2 h-px w-12 bg-gradient-to-l from-[#0B0610]/80 to-transparent" />
              <div className="absolute -right-16 top-1/2 h-px w-12 bg-gradient-to-r from-[#0B0610]/80 to-transparent" />
              <h2 className="font-serif text-4xl font-black tracking-[0.45em] text-[#0B0610] drop-shadow-[0_1px_10px_rgba(245,230,200,0.35)] md:text-6xl">
                原来是梦
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
