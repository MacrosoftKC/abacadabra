import { INK, PAPER } from "../theme";

export type HexColor = `#${string}`;

type Rgb = [number, number, number];

/** Channels of a `#rgb`, `#rrggbb` or `rgb(a)()` color. */
function toRgb(color: string): Rgb {
  if (color.startsWith("#")) {
    const digits =
      color.length === 4 ? [...color.slice(1)].map((c) => c + c).join("") : color.slice(1, 7);
    const n = Number.parseInt(digits, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const [r = 0, g = 0, b = 0] = (color.match(/[\d.]+/g) ?? []).map(Number);
  return [r, g, b];
}

function toHex(rgb: Rgb): HexColor {
  return `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
}

export function mix(from: string, to: string, amount: number): HexColor {
  const a = toRgb(from);
  const b = toRgb(to);
  return toHex([0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * amount) as Rgb);
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
export function luminance(color: string): number {
  const [r, g, b] = toRgb(color).map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** 0.179 is where ink and paper text give equal contrast. */
const isLight = (color: string) => luminance(color) > 0.179;

/** Ink or paper, whichever reads better on `color`; never a muddy blend. */
export function inkOn(color: string): string {
  return isLight(color) ? INK : PAPER;
}

export interface HeroPalette {
  /** Text, icons and placeholder outlines. */
  ink: string;
  /** Mobile menu panel. */
  surface: string;
}

/** Derives the per-state colors from the background, so a new item only needs its background. */
export function heroPalette(background: string): HeroPalette {
  const light = isLight(background);
  return {
    ink: light ? INK : PAPER,
    surface: mix(background, light ? "#FFFFFF" : "#000000", 0.15),
  };
}
