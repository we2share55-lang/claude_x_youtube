import { CalculateMetadataFunction, Composition, staticFile } from "remotion";
import { Reel } from "./Reel";
import { Thumbnail } from "./Thumbnail";
import type { Timeline } from "./types";

type Props = {
  readonly file: string;
  readonly timeline: Timeline | null;
};

// Duration, fps and the timeline data come from public/<file> (written by export_remotion.py).
// One <Composition> per finished video; file names follow YYYY-MM-DD-NNN.
const calculateMetadata: CalculateMetadataFunction<Props> = async ({ props }) => {
  const res = await fetch(staticFile(props.file));
  const timeline = (await res.json()) as Timeline;
  return {
    durationInFrames: timeline.frames,
    fps: timeline.fps,
    props: { ...props, timeline },
  };
};

export const MyComposition = () => {
  return (
    <>
      <Composition
        id="Reel-2026-10-11-001"
        component={Reel}
        durationInFrames={1500}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={calculateMetadata}
        defaultProps={{ file: "2026-10-11-001.json", timeline: null }}
      />
      <Composition
        id="Reel-2026-10-11-002"
        component={Reel}
        durationInFrames={1500}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={calculateMetadata}
        defaultProps={{ file: "2026-10-11-002.json", timeline: null }}
      />
      <Composition
        id="Thumb-2026-10-11-001"
        component={Thumbnail}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ kicker: "쉬운 경제 60초", line1: "펀드 vs ETF", line2: "뭐가 달라?", art: "basket", tagline: "과일 바구니로 이해하기" }}
      />
      <Composition
        id="Thumb-2026-10-11-002"
        component={Thumbnail}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ kicker: "쉬운 경제 60초", line1: "배당 vs", line2: "자사주 소각", art: "bigger", tagline: "피자로 이해하기" }}
      />
      <Composition
        id="Reel-2026-10-13-001"
        component={Reel}
        durationInFrames={1500}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={calculateMetadata}
        defaultProps={{ file: "2026-10-13-001.json", timeline: null }}
      />
      <Composition
        id="Reel-2026-10-13-002"
        component={Reel}
        durationInFrames={1500}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={calculateMetadata}
        defaultProps={{ file: "2026-10-13-002.json", timeline: null }}
      />
      <Composition
        id="Reel-2026-10-13-003"
        component={Reel}
        durationInFrames={1500}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={calculateMetadata}
        defaultProps={{ file: "2026-10-13-003.json", timeline: null }}
      />
      <Composition
        id="Thumb-2026-10-13-001"
        component={Thumbnail}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ kicker: "쉬운 경제 60초", line1: "기회비용", line2: "그게 뭐야?", art: "choice", tagline: "짜장면 vs 짬뽕" }}
      />
      <Composition
        id="Thumb-2026-10-13-002"
        component={Thumbnail}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ kicker: "쉬운 경제 60초", line1: "연준 한마디에", line2: "증시가 출렁?", art: "fed", tagline: "중앙은행 쉽게 보기" }}
      />
      <Composition
        id="Thumb-2026-10-13-003"
        component={Thumbnail}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ kicker: "쉬운 경제 60초", line1: "IPO", line2: "기업공개란?", art: "ipo", tagline: "주식 첫 공개 이야기" }}
      />
    </>
  );
};
