import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
const loopImages = [
  "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEWbHxqRMH0x1j3s49lpX118pysNSsMdwAC6iwAAgNwKVamRMZPje_BeTwE.png",
  "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEWbJJqRMKYvPnPpJLMOZg-hL70aBD3agACAS0AAgNwKVZczI9xIVbLBzwE.png",
];

export function SceneTimelineExtra2({ isActive }: { isActive?: boolean }) {
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
        window.setTimeout(() => {
          window.dispatchEvent(new CustomEvent("scrollToSection", { detail: { index: 10 } }));
        }, 1000 + 1500),
      ];
      return () => timers.forEach((t) => window.clearTimeout(t));
    }
  }, [isActive]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-transparent">
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#2A2A2D]/40 via-transparent to-transparent opacity-50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <div className="relative flex h-[min(65vh,75vw)] w-[min(65vh,75vw)] max-h-[550px] max-w-[550px] items-center justify-center">
          <div className="absolute inset-0 border-[0.5px] border-primary/10 rounded-full scale-110 pointer-events-none" />
          <div className="absolute inset-0 border-[0.5px] border-primary/20 rounded-lg pointer-events-none" />
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/60 shadow-[0_0_50px_rgba(0,0,0,1)]">
            {loopImages.map((src, index) => (
              <img
                key={src}
                src={src}
                alt={`递归意识 ${index + 1}`}
                className={`absolute inset-0 h-full w-full object-cover filter brightness-[0.9] sepia-[0.2] transition-opacity duration-300 ease-in-out ${currentSlide === index ? "opacity-100" : "opacity-0"}`}
                loading="eager"
                decoding="async"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
