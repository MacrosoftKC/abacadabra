import type { ImageFile } from "../../lib/productImages";
import { HERO_ITEMS, type HeroItem } from "../Hero/hero.config";

interface MenuCopy {
  tagline: string;
  description: string;
  /** Philippine pesos; leave it out to show no price. TODO: the real prices. */
  price?: number;
}

/**
 * Showcase copy per hero item, keyed by item id. Images, names and colors come
 * from HERO_ITEMS, so the hero and the menu always show the same line-up.
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

export interface MenuItem extends HeroItem, MenuCopy {
  /**
   * Ingredients scattered behind the item in the showcase, file name inside
   * src/assets/products. Optional: nothing shows until the file exists.
   */
  splash: ImageFile;
}

export const MENU_ITEMS: readonly MenuItem[] = HERO_ITEMS.map(
  (item): MenuItem => ({ ...item, ...COPY[item.id], splash: `${item.id}-splash.png` }),
);

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
