import type { HexColor } from "../../lib/color";
import type { ImageFile } from "../../lib/productImages";
import { PAPER } from "../../theme";

/**
 * Abacá hero: everything tunable about the section lives here.
 *
 * Product cutouts go in src/assets/products under the file names below:
 * transparent PNG or WebP, roughly square, trimmed so the item rests on the
 * image's bottom edge. Any file that isn't there yet renders as a labeled
 * placeholder, so the layout holds before the art arrives.
 */

export interface HeroItem {
  /** Stable React key. */
  id: string;
  /** Used as the cutout's alt text and in the caption. */
  name: string;
  /** One word that drifts behind the item in the menu showcase. */
  word: string;
  /** Section background while this item is center stage. */
  background: HexColor;
  /** Product cutout, file name inside src/assets/products. */
  image: ImageFile;
}

/**
 * Rotation order; loops back to the first entry after the last. Light and
 * dark backgrounds alternate so every turn reads as a change.
 * Adding or reordering an item is a one-line change here.
 */
export const HERO_ITEMS: readonly [HeroItem, ...HeroItem[]] = [
  {
    id: "croissant",
    name: "Butter croissant",
    word: "Croissant",
    background: "#E6C78F",
    image: "croissant.png",
  },
  {
    id: "pain-au-chocolat",
    name: "Pain au chocolat",
    word: "Chocolat",
    background: "#4A2F22",
    image: "pain-au-chocolat.png",
  },
  {
    id: "danish",
    name: "Fruit-filled danish",
    word: "Danish",
    background: "#D98C7A",
    image: "danish.png",
  },
  {
    id: "latte",
    name: "Abacá latte",
    word: "Latte",
    background: "#1C1916",
    image: "latte.png",
  },
  {
    id: "cupcake",
    name: "Chocolate cupcake",
    word: "Cupcake",
    background: "#CDB08C",
    image: "cupcake.png",
  },
];

/** How long each item holds center stage, transition included. */
export const CYCLE_INTERVAL_MS = 3500;
/** Wheel rotation and background tween duration. Keep it below CYCLE_INTERVAL_MS. */
export const TRANSITION_MS = 1200;
export const TRANSITION_EASING = "cubic-bezier(0.65, 0, 0.35, 1)";

/** The hill at the bottom of the hero; match it to the next section's background. */
export const HILL_COLOR = PAPER;
