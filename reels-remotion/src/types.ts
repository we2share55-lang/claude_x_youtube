export type Word = { readonly t: string; readonly a: number; readonly b: number };

export type Sentence = {
  readonly text: string;
  readonly a: number;
  readonly b: number;
  readonly words: readonly Word[];
};

export type SceneData = {
  readonly kind: "hook" | "point" | "outro";
  readonly heading: string;
  readonly bullets: readonly string[];
  readonly art: string;
  readonly start: number;
  readonly end: number;
  readonly sents: readonly Sentence[];
};

export type Timeline = {
  readonly fps: number;
  readonly total: number;
  readonly frames: number;
  readonly title: string;
  readonly epIdx: number;
  readonly epTotal: number;
  readonly audio: string;
  readonly amp: readonly number[];
  readonly scenes: readonly SceneData[];
};
