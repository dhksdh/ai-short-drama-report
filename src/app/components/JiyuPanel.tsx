import React, { useEffect } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import zhaojieImg from "../../imports/zhaojie.png";
import zhaohuiImg from "../../imports/zhaohui.png";

const ZHAOJIE_IMG = zhaojieImg;
const ZHAOHUI_IMG = zhaohuiImg;

export function preheatJiyu() {
  if (typeof window === "undefined") return;
  [ZHAOJIE_IMG, ZHAOHUI_IMG].forEach((src) => {
    const img = new window.Image();
    img.src = src;
  });
}

function QuoteBlock({ name, role, quote }: { name: string; role: string; quote: string }) {
  return (
    <div className="flex h-full flex-col justify-center px-10 py-8">
      <div className="mb-5 border-b border-primary/20 pb-4">
        <div className="font-serif text-xl font-bold tracking-wide text-primary">{name}</div>
        <div className="mt-1 text-[11px] tracking-[0.06em] text-[#F5E6C8]/55">{role}</div>
      </div>
      <p className="font-serif text-[13px] leading-[2.1] text-[#F5E6C8]/85">{quote}</p>
    </div>
  );
}

function PhotoBlock({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full rounded-lg object-contain shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

export function JiyuPanel({ onClose, isOpen = true }: { onClose: () => void; isOpen?: boolean }) {
  useEffect(() => { preheatJiyu(); }, []);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: isOpen ? 0.2 : 0 }}
      className={`absolute inset-0 z-[560] flex items-center justify-center bg-[#0D0A12]/92 backdrop-blur-md ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div
        initial={{ scale: 0.96, y: 16 }}
        animate={{ scale: isOpen ? 1 : 0.96, y: isOpen ? 0 : 16 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative flex h-[86vh] w-[90vw] max-w-5xl overflow-hidden rounded-2xl border border-primary/20 bg-[#1A1020] shadow-[0_0_80px_rgba(0,0,0,0.7)]"
      >
        {/* 关闭按钮 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-[#0D0A12]/80 text-primary/50 backdrop-blur-sm transition hover:border-primary/70 hover:text-primary"
        >
          <X size={15} />
        </button>

        {/* 2×2 网格 */}
        <div className="grid h-full w-full grid-cols-2 grid-rows-2">

          {/* 左上：赵姐照片 */}
          <div className="overflow-hidden border-b border-r border-primary/10 bg-[#16101E]">
            <PhotoBlock src={ZHAOJIE_IMG} alt="赵姐" />
          </div>

          {/* 右上：赵姐语录 */}
          <div className="overflow-hidden border-b border-primary/10">
            <QuoteBlock
              name="赵姐"
              role="AI 漫剧团队提示词工程师"
              quote="我们这个角色还真不是练习使用 AI 就行，是靠短视频编导经验和镜头语言吃饭的。就是提示词这个事，它只是媒介，视听思维才是壁垒。比如说，我们实际工作的时候没有哪个模型能单枪匹马同时解决锁脸、动作、越轴这些问题，必须我们来当调度师，在不同工具间切换组合。模型越智能，越需要我们懂镜头和创作的人去把关。"
            />
          </div>

          {/* 左下：赵晖语录 */}
          <div className="overflow-hidden border-r border-primary/10">
            <QuoteBlock
              name="赵晖"
              role="中国传媒大学戏剧影视学院教授"
              quote="一个人机协作进行视听创作的时代到来了，而且这个时代是势不可挡的。艺术的本质是在表达人们的情感，情感很多元，用原有的拍摄方式是很难去表达尽的。今天 AI 出现了，其实跟用文字去抒情的道理是一样的，我们也可以学会充分地驾驭 AI 去表达情感。一旦意识到了这种协同关系，很多新的就业就都在路上了。"
            />
          </div>

          {/* 右下：赵晖照片 */}
          <div className="overflow-hidden bg-[#16101E]">
            <PhotoBlock src={ZHAOHUI_IMG} alt="赵晖" />
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
