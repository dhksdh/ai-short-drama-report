import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
const loopImages = [
  "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEWbGlqRMFt0jHgplzr0E2rc_LRmM_nEAAC1ywAAgNwKVYUyHMm2ryuyzwE.png",
  "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEWbHdqRMHDPSH9IV3mbsewSyQ8Jrrl2AAC5SwAAgNwKVZPxnuEMpILlDwE.png",
  "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEWbHxqRMH0x1j3s49lpX118pysNSsMdwAC6iwAAgNwKVamRMZPje_BeTwE.png",
];

export function SceneTimelineExtra({ isActive }: { isActive?: boolean }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    loopImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.decode?.().catch(() => undefined);
    });
  }, []);

  useEffect(() => {
    if (isActive) {
      setCurrentSlide(0);
      const timers = [
        window.setTimeout(() => setCurrentSlide(1), 1000),
        window.setTimeout(() => setCurrentSlide(2), 1600),
      ];
      return () => timers.forEach((timer) => window.clearTimeout(timer));
    }
  }, [isActive]);

  const handleNextSection = () => {
    if (currentSlide === loopImages.length - 1) {
      window.dispatchEvent(new CustomEvent("scrollToSection", { detail: { index: 8 } }));
    }
  };

  return (
    <div 
      className={`relative h-full w-full overflow-hidden bg-transparent ${currentSlide === loopImages.length - 1 ? 'cursor-pointer' : ''}`}
      onClick={handleNextSection}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#3A2A1A]/60 via-transparent to-transparent opacity-60" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <div className="relative flex h-[min(70vh,80vw)] w-[min(70vh,80vw)] max-h-[600px] max-w-[600px] items-center justify-center">
          <div className="absolute -inset-4 border border-primary/20 rounded-sm pointer-events-none" />
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/40 shadow-2xl">
            {loopImages.map((src, index) => (
              <img
                key={src}
                src={src}
                alt={`思维剥离 ${index + 1}`}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-in-out ${currentSlide === index ? "opacity-100" : "opacity-0"}`}
                loading="eager"
                decoding="async"
              />
            ))}
              {currentSlide === loopImages.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 z-20 pointer-events-none"
                >
                  <motion.div
                    animate={{ height: [0, 32, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-[1px] bg-gradient-to-b from-transparent via-primary to-primary/50 shadow-[0_0_12px_rgba(212,168,67,0.6)]"
                  />
                  <span className="font-serif text-[14px] font-black uppercase tracking-[0.8em] text-primary drop-shadow-[0_0_24px_rgba(212,168,67,1)] pl-[0.8em]">
                    点击
                  </span>
                  <motion.div
                    animate={{ height: [0, 32, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.75 }}
                    className="w-[1px] bg-gradient-to-b from-primary/50 via-primary to-transparent shadow-[0_0_12px_rgba(212,168,67,0.6)]"
                  />
                </motion.div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
