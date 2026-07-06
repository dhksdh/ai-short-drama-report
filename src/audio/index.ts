import prologue1 from "./prologue_1.mp3";
import prologue2 from "./prologue_2.mp3";
import prologue3 from "./prologue_3.mp3";

import actoneD1 from "./actone_d1.mp3";
import actoneD2 from "./actone_d2.mp3";
import actoneD3 from "./actone_d3.mp3";
import actoneD4 from "./actone_d4.mp3";
import actoneBg1 from "./actone_bg1.mp3";
import actoneBg2 from "./actone_bg2.mp3";

import studio1 from "./studio_1.mp3";
import studio2 from "./studio_2.mp3";
import studio3 from "./studio_3.mp3";
import studio4 from "./studio_4.mp3";
import studio3b from "./studio_3b.m4a";

import extra1 from "./extra_1.mp3";
import extra2 from "./extra_2.mp3";
import extra3 from "./extra_3.mp3";
import extra4 from "./extra_4.mp3";
import extra7 from "./extra_7.mp3";
import extra8 from "./extra_8.mp3";
import extra5 from "./extra_5.m4a";

import extra2_1 from "./extra2_1.mp3";
import extra2_2 from "./extra2_2.mp3";
import extra2_3 from "./extra2_3.mp3";
import extra2_4 from "./extra2_4.mp3";
import extra2_5 from "./extra2_5.mp3";
import extra2_6 from "./extra2_6.m4a";
import extra2_7 from "./extra2_7.mp3";
import extra2_8 from "./extra2_8.mp3";
import extra2_9 from "./extra2_9.mp3";
import dreamReveal from "./dream_reveal.mp3";

export const audioAssets = {
  prologue: [prologue1, prologue2, null, prologue3] as (string | null)[],
  actoneDialogues: [actoneD1, actoneD2, actoneD3, actoneD4] as string[],
  actoneBg: [actoneBg1, actoneBg2] as string[],
  studio: [studio1, studio2, studio3, studio4, null] as (string | null)[],
  studioChain: studio3b, // 贵哥 03/05 播放 studio3 结束后自动衔接
  extra: [extra1, extra2, extra3, extra8, extra4, extra5, extra7, null] as (string | null)[],
  extra2: [extra2_1, extra2_2, extra2_3, extra2_4, extra2_5, extra2_6, extra2_7, extra2_8, extra2_9] as (string | null)[],
  dreamReveal,
};
