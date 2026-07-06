import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import imgLeft from "@/imports/81d70a7863f18c4ae8ac2052238c02ae.jpg";

type CardData = {
  id: number;
  src: string;
  alt: string;
  name: string;
  role: string;
  desc: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
  lineColor: string;
  iconColor: string;
};

const cards: CardData[] = [
  {
    id: 1,
    src: imgLeft,
    alt: "林野",
    name: "林野",
    role: "短剧编剧",
    desc: "广播电视编导专业出身，毕业后一直在传统影视行业工作，最近正为共事的伙伴们跳槽到AI短剧公司而苦恼。",
    bgColor: "from-[#2D1F3E] via-[#1A1225] to-[#0D0A12]",
    borderColor: "border-[#D4A843]/60",
    textColor: "text-[#FFF8E7]",
    accentColor: "bg-[#D4A843]",
    lineColor: "bg-[#D4A843]/30",
    iconColor: "#D4A843",
  },
];

// stage 0 = dark + "你将扮演："  |  stage 1 = lit + "点击翻转"  |  stage 2 = flipped
function FlipCard({ card, isActive }: { card: CardData; isActive: boolean }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (isActive) setStage(0);
  }, [isActive]);

  function handleClick() {
    setStage((s) => (s === 2 ? 1 : s + 1));
  }

  const labelText = stage === 0 ? "你将体验：" : "点击翻转";

  return (
    <div className="flex flex-col items-center gap-3">
      {/* label — always visible in stage 0 and 1 */}
      <motion.p
        key={labelText}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: stage < 2 ? 1 : 0, y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-[13px] font-bold tracking-[0.4em] text-[#D4A843] pointer-events-none"
      >
        {labelText}
      </motion.p>

      <div
        className="relative h-[520px] w-[300px] cursor-pointer [perspective:1000px] md:h-[620px] md:w-[380px]"
        onClick={handleClick}
      >
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          animate={{ rotateY: stage === 2 ? 180 : 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Front */}
          <div className={`absolute inset-0 overflow-hidden border ${card.borderColor} shadow-[0_0_60px_rgba(0,0,0,0.8)] [backface-visibility:hidden]`}>
            <ImageWithFallback
              src={card.src}
              alt={card.alt}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover object-center"
            />

            {/* Dark vignette always present */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

            {/* Darkness overlay — lifts on stage 1+ */}
            <motion.div
              className="absolute inset-0 bg-black"
              animate={{ opacity: stage === 0 ? 0.72 : 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />

            {/* 点击 centered overlay — stage 0 only */}
            <motion.div
              className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
              animate={{ opacity: stage === 0 ? 1 : 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* ripple ring */}
              <motion.div
                className="absolute h-20 w-20 rounded-full border border-[#D4A843]/40"
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.div
                className="absolute h-20 w-20 rounded-full border border-[#D4A843]/25"
                animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
              />

              {/* finger icon */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11V6a2 2 0 0 1 4 0v3" />
                <path d="M13 9a2 2 0 0 1 4 0v2" />
                <path d="M17 11a2 2 0 0 1 4 0v3a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-1a2 2 0 0 1 2-2h.5" />
              </svg>

              <motion.span
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="mt-3 text-[13px] tracking-[0.6em] text-[#D4A843] uppercase"
              >
                点击
              </motion.span>
            </motion.div>

            {/* Name / role — fade in when lit */}
            <motion.div
              className="absolute bottom-8 left-0 right-0 text-center"
              animate={{ opacity: stage >= 1 ? 1 : 0, y: stage >= 1 ? 0 : 10 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-serif text-2xl font-bold tracking-widest text-[#FFF8E7]">{card.name}</h3>
              <p className="mt-1 text-[10px] tracking-[0.3em] text-[#D4A843] uppercase">{card.role}</p>
            </motion.div>
          </div>

          {/* Back */}
          <div className={`absolute inset-0 flex flex-col overflow-hidden border ${card.borderColor} bg-[#0D0A12] [backface-visibility:hidden] [transform:rotateY(180deg)]`}>
            {/* Corner brackets */}
            <div className="absolute top-5 left-5 h-8 w-8 border-l border-t border-[#D4A843]/40" />
            <div className="absolute top-5 right-5 h-8 w-8 border-r border-t border-[#D4A843]/40" />
            <div className="absolute bottom-5 left-5 h-8 w-8 border-l border-b border-[#D4A843]/40" />
            <div className="absolute bottom-5 right-5 h-8 w-8 border-r border-b border-[#D4A843]/40" />

            {/* Grain texture overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "150px" }}
            />

            <div className="relative z-10 flex h-full flex-col px-10 py-12">
              {/* Header tag */}
              <p className="mb-6 text-[9px] tracking-[0.6em] text-[#D4A843]/40 uppercase">Character</p>

              {/* Name block */}
              <div className="mb-1">
                <h3 className="font-serif text-5xl font-bold leading-none tracking-tight text-[#FFF8E7]">
                  {card.name}
                </h3>
              </div>

              {/* Role pill */}
              <div className="mt-3 inline-flex w-fit items-center gap-2">
                <div className="h-[1px] w-4 bg-[#D4A843]" />
                <span className="text-[11px] tracking-[0.25em] text-[#D4A843] uppercase">{card.role}</span>
              </div>

              {/* Divider */}
              <div className="my-8 flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-[#D4A843]/20" />
                <div className="h-1 w-1 rounded-full bg-[#D4A843]/60" />
                <div className="h-[1px] flex-1 bg-[#D4A843]/20" />
              </div>

              {/* Description — styled as a dossier note */}
              <div className="flex-1 space-y-4">
                <p className="text-[13px] leading-[2] tracking-wide text-[#F5E6C8]/80">
                  影视科班出身，毕业后一直在传统影视行业摸爬滚打。
                </p>
                <p className="text-[13px] leading-[2] tracking-wide text-[#F5E6C8]/70">
                  最近正为共事的伙伴们跳槽到 AI 短剧公司而苦恼，不知如何是好。
                </p>
                <p className="border-l border-[#D4A843]/30 pl-3 text-[11px] leading-[1.9] tracking-wide text-[#D4A843]/65">
                  注：主角剧情基于受访者小林的真实经历呈现
                </p>
              </div>

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="text-[9px] tracking-[0.4em] text-[#D4A843]/30 uppercase">The Silent Shadow</span>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-1 w-1 rounded-full bg-[#D4A843]/30" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function SceneCharacters({ image, isActive }: { image: string; isActive?: boolean }) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-transparent">
      {/* Background Decors - Peripheral to ensure visual space for characters */}
      <div className="absolute top-[2%] left-[2%] h-[300px] w-[300px] border-l border-t border-[#D4A843]/10" />
      <div className="absolute bottom-[2%] right-[2%] h-[300px] w-[300px] border-r border-b border-[#D4A843]/10" />
      
      {/* Cinematic Film Frame */}
      <div className="absolute inset-[4%] border border-[#D4A843]/5" />

      {/* Subtle Side Glows */}
      <div className="absolute top-1/2 -left-32 h-[500px] w-64 -translate-y-1/2 rounded-full bg-[#D4A843]/5 blur-[120px]" />
      <div className="absolute top-1/2 -right-32 h-[500px] w-64 -translate-y-1/2 rounded-full bg-[#2D1F3E]/40 blur-[120px]" />

      <div className="relative z-10 pt-20 pb-8 text-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mt-4 font-serif text-3xl font-bold tracking-tighter text-[#FFF8E7] md:text-4xl"
        >
          剧中人
        </motion.h2>
      </div>

      {/* Single card centered */}
      <div className="relative z-10 flex flex-1 items-center justify-center pb-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <FlipCard card={cards[0]} isActive={isActive ?? false} />
        </motion.div>
      </div>
    </div>
  );
}
