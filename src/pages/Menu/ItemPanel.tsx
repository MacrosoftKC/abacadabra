import { clamp, motion, useTransform, type MotionValue } from "motion/react";
import { useId, type FocusEvent, type Ref } from "react";
import ProductImage from "../../components/ProductImage";
import { heroPalette } from "../../lib/color";
import ItemInfo from "./ItemInfo";
import type { MenuItem } from "./menu.config";

interface ItemPanelProps {
  item: MenuItem;
  index: number;
  width: number;
  stageHeight: number;
  /** Sideways travel (px) at which this panel is centered. */
  center: number;
  traveled: MotionValue<number>;
  /** Hands the cutout over to the grid's copy when the stage pans out. */
  cutoutOpacity: MotionValue<number>;
  /** The box the cutout sits in, measured so the grid's copy starts out right on top of it. */
  cutoutRef?: Ref<HTMLDivElement>;
  onKeyboardFocus: (index: number) => void;
}

export default function ItemPanel({
  item,
  index,
  width,
  stageHeight,
  center,
  traveled,
  cutoutOpacity,
  cutoutRef,
  onKeyboardFocus,
}: ItemPanelProps) {
  const headingId = useId();
  const ink = heroPalette(item.background).ink;

  // Distance from center stage in panel widths: positive while to the right.
  const offset = useTransform(traveled, (t) => (t - center) / width);
  // Slow layers of far-off panels would drift into view early, so they fade in with distance.
  const presence = useTransform(offset, (o) => clamp(0, 1, (1.3 - Math.abs(o)) / 0.7));
  const wordOpacity = useTransform(presence, (v) => v * 0.1);
  // Each layer passes at its own speed: the word lags far behind, the item pushes ahead.
  const wordX = useTransform(offset, (o) => o * width * -0.45);
  const splashX = useTransform(offset, (o) => o * width * -0.22);
  const splashRotate = useTransform(offset, (o) => o * 32);
  const itemX = useTransform(offset, (o) => o * width * 0.14);
  const itemRotate = useTransform(offset, (o) => o * -10);
  const itemScale = useTransform(offset, (o) => 1 - Math.min(Math.abs(o), 1) * 0.16);
  const infoOpacity = useTransform(offset, (o) => 1 - clamp(0, 1, (Math.abs(o) - 0.2) * 1.6));

  const onFocus = (e: FocusEvent<HTMLElement>) => {
    if (e.target.matches(":focus-visible")) onKeyboardFocus(index);
  };

  return (
    <article
      aria-labelledby={headingId}
      onFocus={onFocus}
      className="relative h-full shrink-0"
      style={{ width, color: ink }}
    >
      <motion.p
        aria-hidden
        className="display-caps pointer-events-none absolute top-[30%] left-1/2 -translate-1/2 leading-none font-light whitespace-nowrap select-none will-change-transform md:top-1/2"
        style={{
          x: wordX,
          opacity: wordOpacity,
          fontSize: Math.min((width * 1.15) / item.word.length, stageHeight * 0.42),
        }}
      >
        {item.word}
      </motion.p>

      <div className="absolute inset-x-0 top-[6svh] flex justify-center md:inset-y-0 md:top-0 md:left-[36%] md:items-center">
        <div ref={cutoutRef} className="relative aspect-square h-[min(46svh,84vw)] md:h-[min(58svh,34vw)]">
          <motion.div
            aria-hidden
            className="absolute top-1/2 left-1/2 w-[150%] -translate-1/2 will-change-transform"
            style={{ x: splashX, rotate: splashRotate, opacity: presence }}
          >
            <ProductImage file={item.splash} alt="" optional className="w-full select-none" />
          </motion.div>
          <motion.div
            className="relative size-full will-change-transform"
            style={{ x: itemX, rotate: itemRotate, scale: itemScale, opacity: cutoutOpacity }}
          >
            <ProductImage
              file={item.image}
              alt=""
              labelPlaceholder
              className="size-full object-contain select-none"
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute inset-x-6 bottom-[15svh] md:inset-x-auto md:top-1/2 md:bottom-auto md:left-[7%] md:w-[min(18rem,30%)] md:-translate-y-1/2"
        style={{ opacity: infoOpacity }}
      >
        <ItemInfo item={item} index={index} headingId={headingId} ink={ink} />
      </motion.div>
    </article>
  );
}
