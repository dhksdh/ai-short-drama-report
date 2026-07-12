import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
const homeCover = "https://www.image2url.com/r2/default/files/1782961960073-5220c4e6-846a-442a-aeea-1035ad8d9163.jpg";
const introFrame1 = "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEWVWhqQpawb8MRuk43DeVhbSBCLXVCNgACVykAAv6GGFYCHpw-vaTnmzwE.jpg";
const introFrame2 = "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEWVXRqQpgGEhAr99_E9mV51Y5EsveFSQACdCkAAv6GGFYm98i40YU8QjwE.jpg";

const homeImageSources = [homeCover, introFrame1, introFrame2];

function warmHomeImages() {
  if (typeof document === "undefined" || typeof Image === "undefined") return;

  homeImageSources.forEach((src) => {
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

let unlockedCameraAudioContext: AudioContext | null = null;

function getCameraAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!unlockedCameraAudioContext || unlockedCameraAudioContext.state === "closed") {
    unlockedCameraAudioContext = new AudioContextClass();
  }
  return unlockedCameraAudioContext;
}

function unlockCameraAudio() {
  try {
    getCameraAudioContext()?.resume?.();
  } catch {
    // Browser may still block audio until a direct user gesture.
  }
}

function playCameraClick() {
  try {
    const ctx = getCameraAudioContext();
    if (!ctx) return;
    ctx.resume?.();

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(2.6, now + 0.006);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    master.connect(ctx.destination);

    const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.08), ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.2);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.setValueAtTime(1800, now);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(1.8, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start(now);
    noise.stop(now + 0.1);

    [1200, 2600, 620].forEach((frequency, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + index * 0.028;
      osc.type = index === 1 ? "square" : "triangle";
      osc.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(index === 0 ? 0.95 : 0.62, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.075);
      osc.connect(gain);
      gain.connect(master);
      osc.start(start);
      osc.stop(start + 0.09);
    });
  } catch {
    // Ignore audio failures from browser autoplay policies.
  }
}

export function SceneHome({ isActive }: { isActive?: boolean }) {
  const [introStage, setIntroStage] = useState<0 | 1 | 2 | 3>(0);
  const fallbackUrl = "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?auto=format&fit=crop&q=80&w=1920";

  useEffect(() => {
    warmHomeImages();

    if (typeof window === "undefined") return;

    const unlock = () => unlockCameraAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      setIntroStage(0);
      return;
    }

    setIntroStage(1);
    const timers = [
      window.setTimeout(() => {
        setIntroStage(2);
        // 延迟等图片渲染后再播咔嚓声，确保声画同步
        window.setTimeout(() => playCameraClick(), 80);
      }, 1500),
      window.setTimeout(() => setIntroStage(3), 2500),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [isActive]);

  const showIntroFrame = introStage === 1 || introStage === 2;
  const introSrc = introStage === 2 ? introFrame2 : introFrame1;

  return (
    <div className="relative h-full w-full overflow-hidden bg-black z-10">
      <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
        {homeImageSources.map((src) => (
          <img key={src} src={src} alt="" loading="eager" decoding="async" />
        ))}
      </div>

      <img 
        src={homeCover} 
        alt="Shadows of Silence Home Cover" 
        loading="eager"
        decoding="async"
        className="h-full w-full object-cover object-center"
        onError={(e) => {
          console.warn("Home cover image failed to load, using fallback.");
          (e.target as HTMLImageElement).src = fallbackUrl;
        }}
      />

      <AnimatePresence>
        {showIntroFrame && (
          <motion.div
            key={introStage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: introStage === 2 ? 0.08 : 0.45, ease: "easeOut" }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-transparent"
          >
            <motion.div
              initial={{ scale: introStage === 2 ? 1.03 : 1 }}
              animate={{ scale: introStage === 1 ? 1.015 : 1 }}
              transition={{ duration: introStage === 1 ? 1.5 : 0.25, ease: "easeOut" }}
              className="relative h-full w-full"
            >
              <img
                src={introSrc}
                alt={introStage === 1 ? "首页进入过场第一帧" : "首页进入过场第二帧"}
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover opacity-85 mix-blend-screen saturate-[0.9] contrast-[1.08]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0A12]/35 via-[#1E112F]/10 to-[#0D0A12]/20 mix-blend-multiply" />
              <div className="absolute inset-0 bg-[#D4A843]/10 mix-blend-soft-light" />
              {introStage === 2 && (
                <motion.div
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                  className="absolute inset-0 bg-[#F5E6C8] mix-blend-screen"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle noir overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
}
