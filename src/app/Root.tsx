import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "motion/react";
import { Home, User, Film, Clock, Info, BookOpen, FileText } from "lucide-react";

// Components
import { SceneHome } from "./components/SceneHome";
import { SceneCharacters } from "./components/SceneCharacters";
import { ScenePrologue } from "./components/ScenePrologue";
import { SceneActOne } from "./components/SceneActOne";
import { SceneStudio } from "./components/SceneStudio";
import { SceneStudioExtra } from "./components/SceneStudioExtra";
import { SceneStudioExtra2 } from "./components/SceneStudioExtra2";
import { SceneTimeline } from "./components/SceneTimeline";
import { SceneTimelineExtra } from "./components/SceneTimelineExtra";
import { SceneTimelineExtra2 } from "./components/SceneTimelineExtra2";
import { SceneCredits } from "./components/SceneCredits";
import { SceneDreamReveal } from "./components/SceneDreamReveal";
import { SceneFinalReflection } from "./components/SceneFinalReflection";

import { assets } from "./assets-ext";

// Dummy assets
const characterImg = assets.mysteryCharacter;
const prologueImg = assets.vintagePaper;
const actOneImg = assets.factoryInterior;
const studioImg = assets.archiveRoom;
const scene4Img = assets.cpuGlow;
const scene5Img = assets.archiveRoom;

export function Root() {
  const [activeSection, setActiveSection] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom event listener for external scroll requests
  useEffect(() => {
    const handleScrollTo = (e: any) => {
      if (e.detail && typeof e.detail.index === 'number') {
        scrollToSection(e.detail.index);
      }
    };
    window.addEventListener("scrollToSection", handleScrollTo);
    return () => window.removeEventListener("scrollToSection", handleScrollTo);
  }, [activeSection]);

  const sections = [
    { id: "home", label: "开机", icon: <Home size={14} /> },
    { id: "characters", label: "人物", icon: <User size={14} /> },
    { id: "prologue", label: "序幕", icon: <BookOpen size={14} /> },
    { id: "actone", label: "入梦", icon: <Film size={14} /> },
    { id: "studio", label: "情绪的垃圾场", icon: <Film size={14} /> },
    { id: "timeline", label: "脱罪1", icon: <Clock size={14} /> },
    { id: "studio-extra", label: "兴趣的流水线", icon: <Film size={14} /> },
    { id: "timeline-extra", label: "脱罪2", icon: <Clock size={14} /> },
    { id: "studio-extra2", label: "审美的失乐园", icon: <Film size={14} /> },
    { id: "timeline-extra2", label: "脱罪3", icon: <Clock size={14} /> },
    { id: "dream-reveal", label: "梦醒", icon: <Film size={14} /> },
    { id: "final-reflection", label: "结语", icon: <FileText size={14} /> },
    { id: "credits", label: "谢幕", icon: <Info size={14} /> },
  ];

  // Add FileText to imports if not already there

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  // Global background color interpolation
  // 0-5: Original (Purple), 6-7: Mirror (Amber), 8-10: Symbiotic (Grey)
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.45, 0.55, 0.65, 0.75, 1],
    [
      "#1E112F", // Home to Studio (Purple)
      "#1E112F", // Timeline (Purple)
      "#3D2616", // Mirror Start (Amber)
      "#3D2616", // Mirror End (Amber)
      "#1A1A1A", // Symbiotic Start (Grey)
      "#1A1A1A", // Credits (Grey)
    ]
  );

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        scrollToSection(Math.min(activeSection + 1, sections.length - 1));
      } else if (e.key === "ArrowUp") {
        scrollToSection(Math.max(activeSection - 1, 0));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSection, sections.length]);

  const scrollToSection = (index: number) => {
    if (containerRef.current) {
      const sectionHeight = containerRef.current.clientHeight;
      containerRef.current.scrollTo({
        top: index * sectionHeight,
        behavior: "smooth"
      });
      setActiveSection(index);
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const index = Math.round(containerRef.current.scrollTop / containerRef.current.clientHeight);
      if (index !== activeSection) {
        setActiveSection(index);
        // Trigger hard cut flash for late game sections (9, 10)
        if (index >= 9) {
          triggerHardCut();
        }
      }
    }
  };

  const [isHardCut, setIsHardCut] = useState(false);
  const triggerHardCut = () => {
    setIsHardCut(true);
    setTimeout(() => setIsHardCut(false), 300);
  };

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden font-sans text-foreground">
      {/* Dynamic Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ backgroundColor: bgColor }}
      />
      
      {/* Hard Cut Effect (思维剥离) */}
      <AnimatePresence>
        {isHardCut && (
          <motion.div
            key="hard-cut-flash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black mix-blend-difference pointer-events-none"
          >
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Global Cinematic Effects */}
      <div className="grain" />
      <div className="dust" />
      <div className="letterbox opacity-30" />

      {/* Camera Viewfinder Details */}
      <div className="pointer-events-none fixed inset-10 z-[70] opacity-40 hidden sm:block">
        <div className="absolute top-0 left-0 flex flex-col gap-1">
          <div className="h-[1px] w-6 bg-primary" />
          <div className="h-6 w-[1px] bg-primary" />
        </div>
        <div className="absolute top-0 right-0 flex flex-col items-end gap-1">
          <div className="h-[1px] w-6 bg-primary" />
          <div className="h-6 w-[1px] bg-primary" />
        </div>
        <div className="absolute bottom-0 left-0 flex flex-col justify-end gap-1">
          <div className="h-6 w-[1px] bg-primary" />
          <div className="h-[1px] w-6 bg-primary" />
        </div>
        <div className="absolute bottom-0 right-0 flex flex-col items-end justify-end gap-1">
          <div className="h-6 w-[1px] bg-primary" />
          <div className="h-[1px] w-6 bg-primary" />
        </div>
        

      </div>

      {/* Global Spotlight Effect - Enhanced */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-50 hidden md:block"
        animate={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 168, 67, 0.08), transparent 80%),
                       radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 168, 67, 0.12), transparent 100%)`
        }}
      />
      <motion.div
        className="pointer-events-none fixed inset-0 z-50 mix-blend-soft-light hidden md:block"
        animate={{
          background: `radial-gradient(120px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 248, 231, 0.15), transparent 100%)`
        }}
      />

      {/* Navigation Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-primary to-accent"
        style={{ scaleX }}
      />

      {/* Side Dot Navigation */}
      <nav className="fixed right-2 sm:right-6 top-1/2 z-[60] flex -translate-y-1/2 flex-col gap-3 sm:gap-5">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(index)}
            className="group relative flex items-center justify-end outline-none"
          >
            <span className={`mr-2 sm:mr-4 scale-0 font-serif text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-primary transition-all duration-300 group-hover:scale-100 ${activeSection === index ? 'scale-100' : 'hidden sm:block sm:scale-0 sm:group-hover:scale-100'}`}>
              {section.label}
            </span>
            <div
              className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full border border-primary/40 transition-all duration-500 ${
                activeSection === index ? "bg-primary scale-125 shadow-[0_0_12px_rgba(212,168,67,0.8)] border-primary" : "bg-transparent opacity-40 hover:opacity-100"
              }`}
            />
          </button>
        ))}
      </nav>

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="snap-container h-full w-full"
      >
        <section className="snap-section relative overflow-hidden">
          <SceneHome isActive={activeSection === 0} />
        </section>
        <section className="snap-section relative overflow-hidden">
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/40" />
          <SceneCharacters image={characterImg} isActive={activeSection === 1} />
        </section>
        <section className="snap-section relative overflow-hidden">
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/40" />
          <ScenePrologue isActive={activeSection === 2} />
        </section>
        <section className="snap-section relative overflow-hidden">
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/40" />
          <SceneActOne isActive={activeSection === 3} />
        </section>
        <section className="snap-section relative overflow-hidden">
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/40" />
          <SceneStudio isActive={activeSection === 4} />
        </section>
        <section className="snap-section relative overflow-hidden">
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/40" />
          <SceneTimeline image={scene4Img} isActive={activeSection === 5} />
        </section>
        <section className="snap-section relative overflow-hidden">
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/40" />
          <SceneStudioExtra isActive={activeSection === 6} />
        </section>
        <section className="snap-section relative overflow-hidden">
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/40" />
          <SceneTimelineExtra isActive={activeSection === 7} />
        </section>
        <section className="snap-section relative overflow-hidden">
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/40" />
          <SceneStudioExtra2 isActive={activeSection === 8} />
        </section>
        <section className="snap-section relative overflow-hidden">
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/40" />
          <SceneTimelineExtra2 isActive={activeSection === 9} />
        </section>
        <section className="snap-section relative overflow-hidden">
          <SceneDreamReveal isActive={activeSection === 10} />
        </section>
        <section className="snap-section relative overflow-hidden">
          <SceneFinalReflection isActive={activeSection === 11} />
        </section>
        <section className="snap-section relative overflow-hidden">
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/40" />
          <SceneCredits />
        </section>
      </div>

      {/* Corner Brackets Decorations */}
      <div className="pointer-events-none fixed inset-2 sm:inset-6 z-[55] opacity-20">
         <div className="absolute top-0 left-0 h-3 w-3 sm:h-4 sm:w-4 border-t border-l border-primary" />
         <div className="absolute top-0 right-0 h-3 w-3 sm:h-4 sm:w-4 border-t border-r border-primary" />
         <div className="absolute bottom-0 left-0 h-3 w-3 sm:h-4 sm:w-4 border-b border-l border-primary" />
         <div className="absolute bottom-0 right-0 h-3 w-3 sm:h-4 sm:w-4 border-b border-r border-primary" />
      </div>

      {/* Side Film Perforations */}
      <div className="fixed left-0 top-0 z-[55] hidden h-full w-4 flex-col justify-around py-4 opacity-10 lg:flex">
        {[...Array(20)].map((_, i) => (
          <div key={`film-perf-l-${i}`} className="h-6 w-full rounded-sm border border-primary/40 bg-primary/10" />
        ))}
      </div>
      <div className="fixed right-0 top-0 z-[55] hidden h-full w-4 flex-col justify-around py-4 opacity-10 lg:flex">
        {[...Array(20)].map((_, i) => (
          <div key={`film-perf-r-${i}`} className="h-6 w-full rounded-sm border border-primary/40 bg-primary/10" />
        ))}
      </div>
    </div>
  );
}
