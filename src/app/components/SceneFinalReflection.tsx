import React from "react";
import { motion } from "motion/react";
import reflectionLocal from "../../imports/reflection.jpg";

const reflectionImage = reflectionLocal;

export function SceneFinalReflection({ isActive }: { isActive?: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0D0A12]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_45%,rgba(212,168,67,0.10),transparent_30%),radial-gradient(circle_at_78%_35%,rgba(110,78,146,0.18),transparent_32%),linear-gradient(135deg,#100817_0%,#1E112F_48%,#08060D_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:repeating-linear-gradient(90deg,#F5E6C8,#F5E6C8_1px,transparent_1px,transparent_4px)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_24%,rgba(0,0,0,0.38)_62%,rgba(0,0,0,0.88)_100%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        animate={isActive ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(8px)" }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="absolute inset-y-0 left-1/2 z-30 flex w-[66.666vw] -translate-x-1/2 items-center justify-center"
      >
        <div className="grid w-full grid-cols-[minmax(220px,0.72fr)_minmax(320px,1fr)] items-center gap-[6vw]">
          <div className="relative mx-auto aspect-[9/16] h-[min(80vh,48vw)] max-h-[760px] overflow-hidden rounded-[30px]">
            <img
              src={reflectionImage}
              alt="余音人物图像"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover opacity-88 saturate-[0.86] contrast-[1.02]"
            />
            <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_center,transparent_34%,rgba(13,10,18,0.52)_70%,rgba(13,10,18,0.98)_100%)]" />
            <div className="pointer-events-none absolute inset-0 rounded-[30px] border border-[#D4A843]/10 shadow-[inset_0_0_85px_rgba(13,10,18,0.95),0_0_95px_rgba(0,0,0,0.58)]" />
            <div className="pointer-events-none absolute -inset-12 bg-[#D4A843]/12 blur-[54px] mix-blend-soft-light" />
          </div>

          <div className="relative text-left">
            <div className="mb-8 h-px w-32 bg-gradient-to-r from-[#D4A843]/70 to-transparent" />
            <div className="space-y-4 overflow-y-auto pr-1 font-serif text-[13px] leading-[2] tracking-[0.06em] text-[#F0E6D6]/84 md:text-[13.5px]" style={{ maxHeight: "72vh" }}>
              <p>小林不是个例。他和他的团队，只是这场AI浪潮中无数内容创作者的缩影。</p>
              <p>一路采访下来，我们听见了太多关于AI的质疑，也看见了太多被归咎于AI的问题。直到最后，小林却对我们说：</p>
              <p className="border-l-2 border-[#D4A843]/50 pl-4 text-[#F5E6C8]/90 italic">"以前觉得AI是来抢饭碗的，现在反倒觉得，它把真正的问题露出来了。工具越来越厉害以后，大家比的不是谁会不会用AI，而是谁还有故事可讲。谁还能把故事讲好。"</p>
              <p>回望这一路调查，我们发现，那些曾被归咎于AI的情绪泛滥、题材趋同、审美粗糙，都不是技术的必然结果，而是市场逻辑、行业生态与内容生产共同作用下的现实映照。</p>
              <p>AI短剧或许有"莫须有之罪"，真正需要被审视的，从来不是AI，而是内容生产本身。</p>
              <p>每一次媒介革命都会催生新的内容形态。从胶片到数字摄影，从互联网视频到生成式AI，技术不断改变创作方式，却从未替代真正的创作者。技术的奇观终将褪去，而决定作品生命力的，始终是真实的人性、独立的审美和持续的创造力。</p>
              <p>当人工智能成为发展新质生产力的重要引擎，当"人工智能+持续赋能文化产业"，高质量发展的关键，不是让AI代替人，而是让懂技术的人更懂创作，让会创作的人更善用技术。</p>
              <p>临别时，小林笑着说：<span className="text-[#D4A843]/95">"AI以后谁都会用，但会讲故事的人，永远不会太多。"</span></p>
              <p>这句话没有什么豪言壮语，却让我们想起一路采访中见到的每一位创作者。</p>
              <p className="pt-1 text-[14px] leading-[2] text-[#D4A843]/95 md:text-[15px]">技术决定创作的效率，人决定内容的高度。AI短剧的未来，不在算法里，而在人心里。</p>
            </div>
            <div className="mt-8 h-px w-40 bg-gradient-to-r from-transparent via-[#D4A843]/45 to-transparent" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
