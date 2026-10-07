import type { ImageFile } from "../../lib/productImages";
import { PAPER } from "../../theme";
import { HERO_ITEMS, type HeroItem } from "../Hero/hero.config";

interface MenuCopy {
  tagline: string;
  description: string;
  /** Philippine pesos; leave it out to show no price. TODO: the real prices. */
  price?: number;
}

/**
 * Showcase copy for the hero's items, keyed by item id. Their images, names and
 * colors come from HERO_ITEMS, so the menu opens on the hero's line-up.
 */
const COPY: Record<HeroItem["id"], MenuCopy> = {
  croissant: {
    tagline: "Flaky & golden",
    description:
      "Butter folded into the dough by hand, for a shattering crust and a soft, honeycombed middle.",
  },
  "pain-au-chocolat": {
    tagline: "Dark chocolate centre",
    description: "The same buttery layers, rolled around dark chocolate that melts as it bakes.",
  },
  danish: {
    tagline: "Fruity & bright",
    description: "A crisp pastry cup, filled with fruit and finished with a glossy glaze.",
  },
  latte: {
    tagline: "Smooth & mellow",
    description: "Espresso pulled to order and poured with silky steamed milk.",
  },
  cupcake: {
    tagline: "Rich & creamy",
    description: "Moist chocolate cake under a cloud of cream and a crunchy cookie crumble.",
  },
};

/**
 * Menu-only items, after the hero's: they join the showcase and the grid but
 * not the hero wheel. Backgrounds keep alternating light and dark.
 * TODO: check them against the current menu.
 */
const MORE: readonly (HeroItem & MenuCopy)[] = [
  {
    id: "cinnamon-raisin-danish",
    name: "Cinnamon raisin danish",
    word: "Cinnamon",
    background: "#7A3B22",
    image: "cinnamon-raisin-danish.png",
    tagline: "Warm & spiced",
    description:
      "Danish dough swirled with cinnamon sugar and plump raisins, glazed while it's still warm.",
  },
  {
    id: "ham-cheese-croissant",
    name: "Ham & cheese croissant",
    word: "Jambon",
    background: "#E2B547",
    image: "ham-cheese-croissant.png",
    tagline: "Savoury & melty",
    description: "Our butter croissant, baked around smoky ham and a generous layer of melted cheese.",
  },
  {
    id: "mocha",
    name: "Mocha",
    word: "Mocha",
    background: "#5B2E26",
    image: "mocha.png",
    tagline: "Chocolatey & bold",
    description: "Espresso and dark chocolate, stirred into steamed milk for a rich, velvety cup.",
  },
  {
    id: "chunky-cookie",
    name: "Chunky cookie",
    word: "Cookie",
    background: "#E3A869",
    image: "chunky-cookie.png",
    tagline: "Gooey & chunky",
    description:
      "Brown-butter dough loaded with chocolate chunks, baked until the edges crisp and the middle stays soft.",
  },
  {
    id: "cake-slice",
    name: "Cake by the slice",
    word: "Cake",
    background: "#6B1F2A",
    image: "cake-slice.png",
    tagline: "Today's slice",
    description: "A different cake every day, cut generously. Ask at the counter what's fresh this morning.",
  },
];

export interface MenuItem extends HeroItem, MenuCopy {
  /**
   * Ingredients scattered behind the item in the showcase, file name inside
   * src/assets/products. Optional: nothing shows until the file exists.
   */
  splash: ImageFile;
}

export const MENU_ITEMS: readonly MenuItem[] = [
  ...HERO_ITEMS.map((item) => ({ ...item, ...COPY[item.id] })),
  ...MORE,
].map((item): MenuItem => ({ ...item, splash: `${item.id}-splash.png` }));

/** The showcase drains back to paper at the end, so what follows picks up on it. */
export const MENU_END = PAPER;

export const formatPrice = (pesos: number) => `₱${pesos}`;

export interface CounterGroup {
  title: string;
  items: readonly string[];
}

/** "From the counter": the wider line-up, by category. TODO: check it against the current menu. */
export const COUNTER: readonly CounterGroup[] = [
  {
    title: "Viennoiserie",
    items: [
      "Butter croissant",
      "Ham & cheese croissant",
      "Pain au chocolat",
      "Fruit-filled danish",
      "Cinnamon raisin danish",
    ],
  },
  { title: "Sweets", items: ["Chocolate cupcakes", "Chunky cookies", "Cakes by the slice"] },
  { title: "Coffee", items: ["Espresso", "Americano", "Cappuccino", "Latte", "Mocha"] },
];
