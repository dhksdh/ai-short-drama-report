import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Moon, Sun, Ghost } from "lucide-react";
const loopImages = [
  "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEWOVVqQJLctFe3G7uf_TQND7itoipsowACJSgAAq3jAAFWpGwe7BssEyM8BA.png",
  "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEWOW5qQJQBeMdH6qh92ZQm8LGTJzCRrQACRygAAq3jAAFWmda5ZajxbPs8BA.png",
  "https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEWOXNqQJRBcZUsPCEooWSQ9IlGGG3R2QACTCgAAq3jAAFWCIqKlP6_-HM8BA.png",
];

export function SceneTimeline({ image, isActive }: { image: string; isActive?: boolean }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    loopImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.decode?.().catch(() => undefined);
    });
  }, []);

  // Reset on every entry, then switch images in the same position with a longer hold time.
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
      window.dispatchEvent(new CustomEvent("scrollToSection", { detail: { index: 6 } }));
    }
  };

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-transparent ${currentSlide === loopImages.length - 1 ? "cursor-pointer" : ""}`}
      onClick={handleNextSection}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 h-[2px] w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        
        {/* Geometric Framework - Subtle Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[20%] left-0 right-0 h-[1px] bg-primary/20" />
          <div className="absolute top-[40%] left-0 right-0 h-[1px] bg-primary/20" />
          <div className="absolute top-[60%] left-0 right-0 h-[1px] bg-primary/20" />
          <div className="absolute top-[80%] left-0 right-0 h-[1px] bg-primary/20" />
          <div className="absolute left-[20%] top-0 bottom-0 w-[1px] bg-primary/20" />
          <div className="absolute left-[40%] top-0 bottom-0 w-[1px] bg-primary/20" />
          <div className="absolute left-[60%] top-0 bottom-0 w-[1px] bg-primary/20" />
          <div className="absolute left-[80%] top-0 bottom-0 w-[1px] bg-primary/20" />
        </div>
        
        {/* Twinkling Stars Background */}
        {[...Array(60)].map((_, i) => {
          const size = Math.random() * 2 + 1;
          const duration = 2 + Math.random() * 4;
          const opacity = 0.3 + Math.random() * 0.7;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#F5E6C8]"
              style={{
                width: size,
                height: size,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, opacity, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative flex h-full w-full max-w-4xl flex-col items-center justify-center"
        >
          {/* Main Thinking Stripping (思维剥离) Visualizer */}
          <div className="relative flex h-[min(70vh,80vw)] w-[min(70vh,80vw)] max-h-[600px] max-w-[600px] items-center justify-center">
            {/* Border Accents */}
            <div className="absolute -inset-4 border border-primary/20 rounded-sm pointer-events-none" />
            <div className="absolute -inset-2 border border-primary/10 rounded-sm pointer-events-none" />
            
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/40 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              {loopImages.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`思维剥离定格画面 ${index + 1}`}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-in-out ${currentSlide === index ? "opacity-100" : "opacity-0"}`}
                  loading="eager"
                  decoding="async"
                />
              ))}

                {/* Film Texture Overlay for the Thinking Stripping Effect */}
                <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
                </div>

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
        </motion.div>
      </div>
    </div>
  );
}
