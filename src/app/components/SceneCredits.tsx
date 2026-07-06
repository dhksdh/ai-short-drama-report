import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import img1 from "../../imports/credit1.jpg";
import img2 from "../../imports/credit2.jpg";
import img3 from "../../imports/credit3.jpg";
import img4 from "../../imports/credit4.jpg";
import img5 from "../../imports/credit5.jpg";
import img6 from "../../imports/credit6.jpg";
import img7 from "../../imports/credit7.jpg";
import img8 from "../../imports/credit8.jpg";

const carouselImages = [img1, img2, img3, img4, img5, img6, img7, img8];

// 预热轮播图片，确保首次切换即显示
function warmCreditsImages() {
  carouselImages.forEach((src) => {
    const img = new Image();
    img.src = src;
    img.decode?.().catch(() => undefined);
  });
}

const credits = [
  { role: "数据收集与分析｜", name: "  虞景皓  邹翼之" },
  { role: "数据可视化｜", name: "  虞景皓" },
  { role: "采访、问卷调查｜", name: "  杨瑞轩  乔砚烜  蒋帆  邹翼之" },
  { role: "写作｜", name: "  乔砚烜  杨瑞轩" },
  { role: "制图｜", name: "  蒋帆  乔砚烜  杨瑞轩" },
  { role: "美工｜", name: "  蒋帆" },
  { role: "网页制作｜", name: "  蒋帆" },
  { role: "指导老师｜", name: "  戴玉   刘萍" },
  { role: "特别鸣谢｜", name: "  刘青 刘容孜 王长路 徐煜昂 杨一帆" },
];

const references = [
  "戴清, 曾睿淇. AI微短剧：技艺结合拓展创作新空间[J]. 电视研究, 2024(8): 36-39.",
  "石青川. AI短剧“淘金潮”[J]. 中国经济周刊, 2026(7): 72-74.",
  "张铮, 袁欣瑶. AIGC短剧模式的技术赋能与叙事创新[J]. 电视研究, 2025(12): 19-22.",
  "朱耘. 酱油文化：“AI漫剧工厂”的成本革命[J]. 商学院, 2025(12): 129-132.",
  "邹煜, 陈昱同. AI短视频社会接受度的影响因素研究——基于扎根理论的探索[J]. 中国新闻传播研究, 2025(3): 85-100.",
];

export function SceneCredits() {
  const [currentImage, setCurrentImage] = useState(6);

  useEffect(() => {
    warmCreditsImages();
    const timer = setInterval(() => {
      goImage(1);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const goImage = (direction: number) => {
    setCurrentImage((current) => (current + direction + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0D0A12] px-10 py-8 text-[#F5E6C8]">
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#111111] via-[#1E112F]/55 to-[#111111]/90 pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="h-full w-full bg-[radial-gradient(circle_at_62%_40%,rgba(212,168,67,0.16)_0%,transparent_44%)]" />
        <div className="absolute top-[8%] left-[5%] h-[44%] w-px bg-gradient-to-b from-primary/25 to-transparent" />
        <div className="absolute bottom-[14%] right-[5%] h-[34%] w-px bg-gradient-to-t from-primary/20 to-transparent" />
      </div>

      <div className="relative z-10 grid h-full grid-rows-[1fr_auto] gap-3">
        <div className="mx-auto grid min-h-0 w-[92vw] grid-cols-[36%_64%] gap-4">
          {/* Left credits column */}
          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex h-full translate-x-8 flex-col justify-between border-r border-primary/10 pl-24 pr-4"
          >
            <div>
              <div className="mb-7 flex items-start gap-4">
                <div className="flex h-12 w-20 shrink-0 items-center justify-center border border-primary/55 p-1.5 shadow-[0_0_18px_rgba(212,168,67,0.08)]">
                  <div className="flex h-full w-full items-center justify-center border border-primary/18 bg-primary/5">
                    <span className="font-serif text-[11px] font-bold tracking-[0.2em] text-primary">制作团队</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {credits.map((credit, index) => (
                  <motion.div
                    key={credit.role}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="grid grid-cols-[4rem_1fr] items-baseline gap-2 border-b border-primary/8 pb-2"
                  >
                    <div className="whitespace-nowrap font-serif text-[11px] font-bold tracking-[0.14em] text-primary">{credit.role}</div>
                    <div className="translate-x-8 whitespace-nowrap font-serif text-[12px] font-semibold leading-relaxed tracking-[0.03em] text-[#FFF8E7]">{credit.name}</div>
                  </motion.div>
                ))}
              </div>
            </div>

<div />
          </motion.aside>

          {/* Right image carousel */}
          <motion.section
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative flex min-h-0 flex-col items-center justify-start gap-3"
          >
            <div className="relative aspect-video w-[44vw] max-w-full overflow-hidden border border-primary/25 bg-black/35 shadow-[0_0_34px_rgba(212,168,67,0.16),inset_0_0_60px_rgba(0,0,0,0.7)]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={carouselImages[currentImage]}
                  alt={`终章图像 ${currentImage + 1}`}
                  initial={{ opacity: 0, scale: 1.015 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.42, ease: "easeOut" }}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/18" />
              <button
                type="button"
                onClick={() => goImage(-1)}
                className="absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={() => goImage(1)}
                className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentImage(index)}
                    className={`h-2 rounded-full bg-white transition-all ${index === currentImage ? "w-7 opacity-95" : "w-2 opacity-45"}`}
                    aria-label={`第 ${index + 1} 页`}
                  />
                ))}
                <span className="ml-3 font-mono text-[10px] tracking-[0.18em] text-white/75">
                  {currentImage + 1}/{carouselImages.length}
                </span>
              </div>
            </div>

            <div className="w-[40vw] max-w-full border-l border-primary/20 pl-5 text-left">
              <div className="mb-2 font-serif text-[9px] font-bold tracking-[0.32em] text-primary/48">联系方式</div>
              <div className="mb-2 font-mono text-[8px] font-bold tracking-[0.18em] text-[#F5E6C8]/42">
                <div>202301073041@cuc.edu.cn</div>
              </div>
              <img
                src="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEWbudqRNpcJ3UHspBhZkKtXcXzGEuiigACqC8AAgNwKVZj61c4x9CvejwE.png"
                alt="机构标识"
                className="w-[45%] object-contain"
              />
            </div>
          </motion.section>
        </div>

        {/* Bottom references + CTA */}
        <footer className="mb-1 border-t border-primary/12 pt-3">
          <div className="mx-auto max-w-4xl">
            <div className="mb-2 flex items-center gap-3">
              <div className="h-px w-12 bg-primary/30" />
              <div className="font-serif text-[10px] uppercase tracking-[0.36em] text-primary/55">参考文献</div>
            </div>
            <div className="space-y-1.5 text-left text-[9px] leading-relaxed text-[#F5E6C8]/46">
              {references.map((ref, index) => (
                <p key={index}>{index + 1}、{ref}</p>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
