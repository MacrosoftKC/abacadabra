import {
  easeIn,
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import Seal from "../../components/Seal";
import { SCROLL_SPRING } from "../../lib/motion";
import { CRUST, INK, PAPER } from "../../theme";

/** --seal-d is the seal's diameter; the camera dives into its center. */
const LAYOUT = "[--seal-d:min(46svh,72vw)]";

/**
 * "Since 2006": the words split apart and the view dives into Abacá's seal
 * until a portal opens onto the story.
 */
export default function DiveStage({ headingId }: { headingId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, SCROLL_SPRING);

  const leftX = useTransform(p, [0, 0.4], ["0vw", "-55vw"]);
  const rightX = useTransform(p, [0, 0.4], ["0vw", "55vw"]);
  const wordsOpacity = useTransform(p, [0.12, 0.38], [1, 0]);
  const hintOpacity = useTransform(p, [0, 0.06], [1, 0]);

  const sealScale = useTransform(p, [0.02, 0.62], [1, 9], { ease: easeIn });
  const sealRotate = useTransform(p, [0, 0.62], [0, 100]);

  const radius = useTransform(p, [0.3, 0.64], [0, 92], { ease: easeIn });
  const clipPath = useMotionTemplate`circle(${radius}% at 50% 50%)`;
  const headingOpacity = useTransform(p, [0.58, 0.78], [0, 1]);
  const headingScale = useTransform(p, [0.58, 0.86], [0.82, 1]);

  return (
    <div ref={ref} className="relative h-[260svh]">
      <div
        className={`sticky top-0 h-svh overflow-clip ${LAYOUT}`}
        style={{ backgroundColor: PAPER, color: INK }}
      >
        <div
          aria-hidden
          className="display-caps absolute inset-0 flex flex-col items-center justify-between py-[9svh] text-[24vw] leading-[0.85] md:grid md:grid-cols-[1fr_calc(var(--seal-d)*1.1)_1fr] md:items-center md:py-0 md:text-[min(9vw,20svh)]"
        >
          <motion.span
            className="will-change-transform md:justify-self-end"
            style={{ x: leftX, opacity: wordsOpacity }}
          >
            Since
          </motion.span>
          <span className="hidden md:block" />
          <motion.span
            className="will-change-transform md:justify-self-start"
            style={{ x: rightX, opacity: wordsOpacity }}
          >
            2006<span style={{ color: CRUST }}>.</span>
          </motion.span>
        </div>

        {/* No filter or will-change here: either would freeze the seal's raster at its small size and blur the dive. */}
        <motion.div
          aria-hidden
          className="absolute top-1/2 left-1/2 z-20 size-(--seal-d) -translate-1/2"
          style={{ scale: sealScale, rotate: sealRotate }}
        >
          <Seal spin className="size-full" />
        </motion.div>

        <motion.p
          aria-hidden
          className="eyebrow absolute bottom-6 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 text-[10px] md:flex"
          style={{ opacity: hintOpacity }}
        >
          Scroll to dive in
          <span className="inline-block animate-[scroll-nudge_1.6s_ease-in-out_infinite]">↓</span>
        </motion.p>

        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center px-6 text-center"
          style={{ clipPath, backgroundColor: INK, color: PAPER }}
        >
          <motion.div style={{ opacity: headingOpacity, scale: headingScale }}>
            <p className="eyebrow" style={{ color: CRUST }}>
              About us
            </p>
            <h2
              id={headingId}
              className="display-caps mt-5 text-[clamp(4rem,15vw,12rem)] leading-[0.9]"
            >
              Our{" "}
              <span className="serif-accent" style={{ color: CRUST }}>
                story.
              </span>
            </h2>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
