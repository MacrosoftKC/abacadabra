import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import ProductImage from "../../components/ProductImage";
import SectionLink from "../../components/SectionLink";
import { CRUST, INK } from "../../theme";
import { MENU_ITEMS } from "../Menu/menu.config";

const [CROISSANT, , , LATTE] = MENU_ITEMS;

const BUTTON =
  "rounded-full px-8 py-4 font-display text-sm font-semibold tracking-[0.2em] uppercase transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";

/** The closing call to action, with a pastry and a coffee drifting past in opposite directions. */
export default function CraftCta() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const leftY = useTransform(scrollYProgress, [0, 1], ["35%", "-30%"]);
  const leftRotate = useTransform(scrollYProgress, [0, 1], [-20, -4]);
  const rightY = useTransform(scrollYProgress, [0, 1], ["-15%", "40%"]);
  const rightRotate = useTransform(scrollYProgress, [0, 1], [4, 22]);

  return (
    <div ref={ref} className="relative overflow-clip px-6 py-32 text-center sm:py-44">
      <motion.div
        aria-hidden
        className="absolute top-[18%] left-[-8%] hidden aspect-square h-[42%] will-change-transform md:block lg:left-[0%]"
        style={{ y: leftY, rotate: leftRotate }}
      >
        <ProductImage file={CROISSANT.image} alt="" className="size-full object-contain" />
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute top-[18%] right-[-8%] hidden aspect-square h-[42%] will-change-transform md:block lg:right-[0%]"
        style={{ y: rightY, rotate: rightRotate }}
      >
        <ProductImage file={LATTE.image} alt="" className="size-full object-contain" />
      </motion.div>

      <div className="relative">
        <h3 className="display-caps text-[clamp(3rem,10vw,8.5rem)] leading-[0.9]">
          Your table
          <br />
          <span className="serif-accent" style={{ color: CRUST }}>
            is waiting.
          </span>
        </h3>
        <p className="mx-auto mt-6 max-w-sm text-ink/65">
          Pull up a chair at any of our cafés. The coffee's on, and the croissants are still warm.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <SectionLink
            to="visit"
            className={`${BUTTON} shadow-lg`}
            style={{ backgroundColor: CRUST, color: INK }}
          >
            Find a café
          </SectionLink>
          <SectionLink to="menu" className={`${BUTTON} ring-2 ring-current ring-inset`}>
            See the menu
          </SectionLink>
        </div>
      </div>
    </div>
  );
}
