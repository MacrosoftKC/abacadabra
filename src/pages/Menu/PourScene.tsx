import { motion, useTransform, type MotionValue } from "motion/react";
import { CRUST, INK, PAPER } from "../../theme";

interface PourSceneProps {
  /** 0 → 1 as the coffee rises. */
  fill: MotionValue<number>;
  /** Sideways travel once the items start moving past, in px (≤ 0). */
  trackX: MotionValue<number>;
  stageHeight: number;
  /** The copy seen through the coffee, in paper-colored text. */
  submerged?: boolean;
  headingId?: string;
}

/**
 * The menu's opening headline. It's drawn once on the paper page and again
 * inside the liquid; both copies share the same motion so they line up
 * exactly where the surface cuts between them.
 */
export default function PourScene({
  fill,
  trackX,
  stageHeight: h,
  submerged = false,
  headingId,
}: PourSceneProps) {
  const textY = useTransform(fill, [0, 1], [h * 0.05, -h * 0.05]);

  return (
    <div
      aria-hidden={submerged || undefined}
      className="absolute inset-0"
      style={{ color: submerged ? PAPER : INK }}
    >
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center will-change-transform"
        style={{ x: trackX, y: textY }}
      >
        <p className="eyebrow" style={{ color: CRUST }}>
          The menu
        </p>
        <h2 id={headingId} className="display-caps mt-5 text-[min(12vw,21svh)] leading-[0.9]">
          Fresh from
          <br />
          <span className="serif-accent" style={{ color: CRUST }}>
            the oven.
          </span>
        </h2>
        <p className="mt-6 max-w-xs text-sm font-medium opacity-75 sm:max-w-sm sm:text-base">
          Five favourites from our counter, baked fresh every morning. Keep scrolling for a taste.
        </p>
      </motion.div>
    </div>
  );
}
