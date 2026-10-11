import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ART, Backdrop, Defs } from "./Illustrations";
import { ART_BG, BLUE, fontFamily, INK, ORANGE, YELLOW } from "./theme";

type Props = {
  readonly kicker: string;
  readonly line1: string;
  readonly line2: string;
  readonly art: string;
  readonly tagline: string;
};

// Cover image (1080x1920). Everything important sits inside the centered 3:4 area
// (y 240-1680) so the Instagram profile grid crop does not cut it off.
// Render with: npx remotion still src/index.ts Thumb-<name> out.png --frame=110  (frame 110 = animations settled)
export const Thumbnail: React.FC<Props> = ({ kicker, line1, line2, art, tagline }) => {
  const Art = ART[art];
  const stroke = (c: string): React.CSSProperties => ({
    WebkitTextStroke: `14px ${c}`,
    paintOrder: "stroke fill",
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#eef4ff",
        backgroundImage: "radial-gradient(circle at 20px 20px, rgba(47,107,255,0.10) 4px, transparent 5px), linear-gradient(180deg, #e6f0ff 0%, #fff6e3 100%)",
        backgroundSize: "60px 60px, 100% 100%",
        fontFamily,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 270,
          left: 60,
          background: BLUE,
          color: "#fff",
          fontSize: 54,
          padding: "10px 46px 16px",
          borderRadius: 60,
          border: `7px solid ${INK}`,
          boxShadow: `0 8px 0 ${INK}`,
          lineHeight: 1.1,
        }}
      >
        {kicker}
      </div>

      <div style={{ position: "absolute", top: 400, left: 60, right: 60, lineHeight: 1.12, wordBreak: "keep-all" }}>
        <div style={{ fontSize: 168, color: INK, ...stroke("#ffffff") }}>{line1}</div>
        <div style={{ fontSize: 168, color: ORANGE, ...stroke("#ffffff") }}>{line2}</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 70,
          top: 820,
          width: 940,
          height: 600,
          borderRadius: 56,
          border: `9px solid ${INK}`,
          boxShadow: `0 14px 0 ${INK}`,
          background: ART_BG[art] ?? "#fff",
          overflow: "hidden",
        }}
      >
        <svg viewBox="0 0 1000 700" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <Defs />
          <Backdrop />
          {Art ? <Art /> : null}
        </svg>
      </div>

      <Img
        src={staticFile("character_coin.png")}
        style={{ position: "absolute", right: 30, bottom: 130, height: 520, zIndex: 3 }}
      />

      <div
        style={{
          position: "absolute",
          left: 70,
          top: 1500,
          background: YELLOW,
          color: INK,
          fontSize: 58,
          padding: "12px 40px 18px",
          borderRadius: 50,
          border: `7px solid ${INK}`,
          boxShadow: `0 8px 0 ${INK}`,
          lineHeight: 1.1,
        }}
      >
        {tagline}
      </div>
    </AbsoluteFill>
  );
};
