import { Audio } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ART, Backdrop, Defs } from "./Illustrations";
import { ART_BG, BLUE, fontFamily, INK, MUTED, ORANGE, SUB_BG, YELLOW } from "./theme";
import type { SceneData, Timeline, Word } from "./types";

/* ---------- top title ---------- */

const TitlePill: React.FC<{ title: string; epIdx: number; epTotal: number }> = ({ title, epIdx, epTotal }) => (
  <div style={{ position: "absolute", top: 110, left: 40, right: 40, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div
      style={{
        background: BLUE,
        color: "#fff",
        fontFamily,
        fontSize: 54,
        padding: "12px 44px 16px",
        borderRadius: 60,
        border: `7px solid ${INK}`,
        boxShadow: `0 8px 0 ${INK}`,
        lineHeight: 1.1,
      }}
    >
      {title}
    </div>
    {epTotal > 1 ? <div style={{ fontFamily, fontSize: 38, color: MUTED }}>PART {epIdx}/{epTotal}</div> : null}
  </div>
);

/* ---------- one scene: art stage + heading + keyword chips ---------- */

const SceneView: React.FC<{ scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = scene.end - scene.start;
  const stage = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const banner = spring({ frame: frame - 8, fps, config: { damping: 12 } });
  const Art = ART[scene.art];
  const accent = scene.kind === "point" ? BLUE : ORANGE;
  const big = scene.kind !== "point" || scene.bullets.length === 0;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 250,
          width: 1000,
          height: 690,
          borderRadius: 52,
          border: `8px solid ${INK}`,
          boxShadow: `0 12px 0 ${INK}`,
          background: ART_BG[scene.art] ?? "#fff",
          overflow: "hidden",
          transform: `translateY(${(1 - stage) * 60}px) scale(${0.94 + 0.06 * stage})`,
          opacity: Math.min(1, stage * 1.6),
        }}
      >
        <svg viewBox="0 0 1000 700" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <Defs />
          <Backdrop />
          {Art ? <Art /> : null}
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: big ? 40 : 70,
          width: big ? 1000 : 940,
          top: big ? 880 : 840,
          transform: `translateY(${(1 - banner) * 70}px) scale(${0.9 + 0.1 * banner})`,
          opacity: Math.min(1, banner * 1.6),
          background: big ? accent : "#fff",
          color: big ? "#fff" : INK,
          border: `8px solid ${INK}`,
          boxShadow: `0 10px 0 ${INK}`,
          borderRadius: 40,
          fontFamily,
          fontSize: big ? 76 : 68,
          lineHeight: 1.2,
          padding: "16px 40px 22px",
          textAlign: "center",
          wordBreak: "keep-all",
        }}
      >
        {scene.heading}
      </div>

      {!big ? (
        <div style={{ position: "absolute", left: 40, top: 1005, width: 1000, display: "flex", gap: 22 }}>
          {scene.bullets.map((b, i) => {
            const ta = 0.6 + (dur - 1.2) * (i / scene.bullets.length) * 0.85;
            const p = spring({ frame: frame - Math.round(ta * fps), fps, config: { damping: 12 } });
            return (
              <div
                key={b}
                style={{
                  flex: 1,
                  background: "#fff",
                  border: `6px solid ${INK}`,
                  boxShadow: `0 8px 0 ${INK}`,
                  borderRadius: 30,
                  fontFamily,
                  fontSize: 42,
                  lineHeight: 1.25,
                  padding: "16px 22px 20px 56px",
                  position: "relative",
                  color: INK,
                  wordBreak: "keep-all",
                  transform: `translateY(${(1 - p) * 40}px) scale(${0.85 + 0.15 * p})`,
                  opacity: Math.min(1, p * 1.5),
                }}
              >
                <span style={{ position: "absolute", left: 20, top: 26, width: 22, height: 22, borderRadius: 11, background: accent, border: `4px solid ${INK}` }} />
                {b}
              </div>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- subtitles: dark box, active word highlighted ---------- */

type Chunk = { a: number; b: number; lines: Word[][] };

const buildChunks = (scenes: readonly SceneData[], total: number): Chunk[] => {
  const chunks: Chunk[] = [];
  for (const sc of scenes) {
    for (const st of sc.sents) {
      const lines: Word[][] = [];
      let cur: Word[] = [];
      let n = 0;
      for (const w of st.words) {
        const add = w.t.length + (cur.length ? 1 : 0);
        if (cur.length && n + add > 13) {
          lines.push(cur);
          cur = [];
          n = 0;
        }
        cur.push(w);
        n += w.t.length + (cur.length > 1 ? 1 : 0);
      }
      if (cur.length) {
        lines.push(cur);
      }
      for (let k = 0; k < lines.length; k += 2) {
        const grp = lines.slice(k, k + 2);
        const flat = grp.flat();
        chunks.push({ a: flat[0].a, b: flat[flat.length - 1].b, lines: grp });
      }
    }
  }
  return chunks.map((c, i) => {
    const nxt = i + 1 < chunks.length ? chunks[i + 1].a : total;
    return { ...c, b: Math.max(c.b, Math.min(nxt, c.b + 0.5)) };
  });
};

const Subtitles: React.FC<{ chunks: Chunk[] }> = ({ chunks }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const c = chunks.find((x) => t >= x.a - 0.05 && t < x.b);
  if (!c) {
    return null;
  }
  const flat = c.lines.flat();
  const active = flat.find((w) => t >= w.a && t < w.b) ?? (t >= flat[flat.length - 1].b ? flat[flat.length - 1] : flat[0]);
  const enter = interpolate(t, [c.a - 0.05, c.a + 0.08], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          background: SUB_BG,
          border: `6px solid ${INK}`,
          borderRadius: 38,
          padding: "19px 44px 9px",
          fontFamily,
          fontSize: 68,
          lineHeight: 1.22,
          color: "#fff",
          textAlign: "center",
          transform: `scale(${0.94 + 0.06 * enter})`,
          opacity: enter,
        }}
      >
        {c.lines.map((ln, li) => (
          <div key={li} style={{ whiteSpace: "nowrap" }}>
            {ln.map((w, wi) => {
              const on = w === active;
              return (
                <span
                  key={wi}
                  style={{
                    display: "inline-block",
                    color: on ? YELLOW : "#fff",
                    transform: on ? "scale(1.08)" : "none",
                    marginRight: wi === ln.length - 1 ? 0 : 18,
                  }}
                >
                  {w.t}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- "today's points" checklist ---------- */

const Checklist: React.FC<{ scenes: readonly SceneData[]; current: number }> = ({ scenes, current }) => {
  const points = scenes.map((s, i) => ({ s, i })).filter((x) => x.s.kind === "point");
  if (!points.length) {
    return null;
  }
  return (
    <div style={{ position: "absolute", left: 590, top: 1430, fontFamily }}>
      <div style={{ fontSize: 38, color: MUTED, marginBottom: 8 }}>오늘의 핵심</div>
      {points.map(({ s, i }, k) => {
        const on = i === current;
        const done = i < current;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                background: on || done ? BLUE : "#d5dae6",
                border: `4px solid ${INK}`,
                color: "#fff",
                fontSize: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 2,
              }}
            >
              {k + 1}
            </div>
            <div style={{ fontSize: 40, color: on ? BLUE : done ? INK : MUTED, wordBreak: "keep-all" }}>{s.heading}</div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- coin character with amplitude-driven mouth ---------- */

const CHAR_H = 720;
const CHAR_W = (827 / 1169) * CHAR_H;

const Character: React.FC<{ amp: readonly number[] }> = ({ amp }) => {
  const frame = useCurrentFrame();
  const a = amp[Math.min(frame, amp.length - 1)] ?? 0;
  const bob = Math.sin(frame / 9) * 6;
  const rot = 1.6 * Math.sin(frame / 20) + 1.2 * a * Math.sin(frame / 3);
  const w = 84 + 60 * a;
  const h = 22 + 84 * a;
  return (
    <div
      style={{
        position: "absolute",
        left: 20,
        bottom: -50,
        width: CHAR_W,
        height: CHAR_H,
        transform: `translateY(${bob}px) rotate(${rot}deg) scale(${1 + 0.02 * a})`,
        transformOrigin: "50% 100%",
      }}
    >
      <Img src={staticFile("character_coin.png")} style={{ width: CHAR_W, height: CHAR_H, display: "block" }} />
      <svg viewBox="0 0 827 1169" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {a > 0.08 ? (
          <g>
            <ellipse cx="412" cy={642 + h / 2} rx={w / 2} ry={h / 2} fill="#341424" stroke="#1c1c22" strokeWidth="6" />
            <ellipse cx="412" cy={642 + h - 14} rx={w / 4} ry="11" fill="#d66e78" />
          </g>
        ) : (
          <path d="M 480.6 662.7 A 73 43 0 0 1 343.4 662.7" fill="none" stroke="#1c1c22" strokeWidth="10" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
};

/* ---------- the reel ---------- */

export const Reel: React.FC<{ readonly file: string; readonly timeline: Timeline | null }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!timeline) {
    return null;
  }
  const t = frame / fps;
  const sc = timeline.scenes;
  const starts = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * fps)));
  let current = 0;
  sc.forEach((s, i) => {
    if (s.start <= t) {
      current = i;
    }
  });
  const chunks = buildChunks(sc, timeline.total);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#eef4ff",
        backgroundImage: "radial-gradient(circle at 20px 20px, rgba(47,107,255,0.10) 4px, transparent 5px), linear-gradient(180deg, #e6f0ff 0%, #fff6e3 100%)",
        backgroundSize: "60px 60px, 100% 100%",
      }}
    >
      <Audio src={staticFile(timeline.audio)} />
      <TitlePill title={timeline.title} epIdx={timeline.epIdx} epTotal={timeline.epTotal} />
      {sc.map((s, i) => {
        const end = i + 1 < sc.length ? starts[i + 1] : timeline.frames;
        return (
          <Sequence key={i} name={`Scene ${i + 1}: ${s.heading}`} from={starts[i]} durationInFrames={end - starts[i]} premountFor={fps}>
            <SceneView scene={s} />
          </Sequence>
        );
      })}
      <Checklist scenes={sc} current={current} />
      <Character amp={timeline.amp} />
      <Subtitles chunks={chunks} />
    </AbsoluteFill>
  );
};
