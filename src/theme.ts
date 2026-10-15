import { loadFont } from "@remotion/google-fonts/Jua";

// Rounded, friendly Korean display font. To try another one, swap this import
// (e.g. BlackHanSans, DoHyeon, Gaegu, GamjaFlower, SingleDay, HiMelody, Gugi).
export const { fontFamily } = loadFont();

export const INK = "#1b1b1f";
export const BLUE = "#2f6bff";
export const ORANGE = "#ff8a3d";
export const YELLOW = "#ffd84d";
export const SUB_BG = "#2b2d33"; // dark gray subtitle box
export const MUTED = "#8a90a0";

// stage background per illustration
export const ART_BG: Record<string, string> = {
  shop: "#fff1c9",
  company: "#d8e8ff",
  basket: "#ffe3d1",
  checkout: "#ddf5e3",
  shelf: "#eadcff",
  bag: "#ffe8ee",
  pizza: "#fff1c9",
  dividend: "#d8e8ff",
  buyback: "#ffe3d1",
  bigger: "#ddf5e3",
  return: "#eadcff",
  piggy: "#ffe8ee",
  choice: "#fff1c9",
  noodle: "#ffe3d1",
  phone: "#d8e8ff",
  scale: "#eadcff",
  megaphone: "#d8e8ff",
  cbank: "#fff1c9",
  fed: "#d8e8ff",
  globe: "#ddf5e3",
  news: "#ffe8ee",
  ipo: "#eadcff",
  launch: "#ddf5e3",
  market: "#fff1c9",
  lever: "#ddf5e3",
  double: "#d8e8ff",
  risk: "#ffe8ee",
  gift: "#ffe8ee",
  contract: "#d8e8ff",
  oil: "#fff1c9",
  winlose: "#ddf5e3",
  kvs: "#d8e8ff",
  kospi: "#d8e8ff",
  kosdaq: "#ddf5e3",
  index: "#fff1c9",
  discount: "#d8e8ff",
  ratesup: "#ffe8ee",
  growth: "#ddf5e3",
  prices: "#fff1c9",
  debt: "#eadcff",
  aiinvest: "#d8e8ff",
  productivity: "#ddf5e3",
};
