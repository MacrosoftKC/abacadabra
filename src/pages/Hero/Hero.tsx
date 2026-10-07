import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useLayoutEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import Seal from "../../components/Seal";
import { heroPalette } from "../../lib/color";
import { POINTER_SPRING, SCROLL_SPRING } from "../../lib/motion";
import { useCycle } from "../../lib/useCycle";
import { useElementSize } from "../../lib/useElementSize";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { BRAND } from "../../site.config";
import Hill from "./Hill";
import ProductWheel from "./ProductWheel";
import Watermark from "./Watermark";
import {
  CYCLE_INTERVAL_MS,
  HERO_ITEMS,
  HILL_COLOR,
  TRANSITION_EASING,
  TRANSITION_MS,
} from "./hero.config";
import "./hero.css";

/**
 * Layout tokens, all relative to the hero itself (it's a size container):
 * --item-size   the center item's square frame; the wheel, seal and headline scale from it
 * --base-y      where the center item rests (its frame's bottom edge), sunk into the hill
 * --scene-y     center of that frame
 * --headline-y  "ABACÁ" center: behind the item, lifted above it on portrait screens
 * --hill-y      top of the hill; its copy starts just under the item's base
 */
const LAYOUT = [
  "[container-type:size]",
  "[--hill-y:65cqh]",
  "[--item-size:min(58cqh,86cqw)]",
  "[--base-y:77cqh]",
  "[--scene-y:calc(var(--base-y)_-_var(--item-size)/2)]",
  "[--headline-y:calc(var(--scene-y)_-_0.14*var(--item-size))]",
  "[@media(max-aspect-ratio:4/5)]:[--headline-y:calc(var(--scene-y)_-_0.52*var(--item-size))]",
].join(" ");

interface Depth {
  /** Drift while the hero scrolls away, as a share of its height: positive lags behind (far), negative pushes ahead (near). */
  scroll: number;
  /** Drift toward the pointer at the screen's edge, in px: negative moves away from it (far). */
  pointer: number;
}

/** The layers, back to front. */
const DEPTH = {
  watermark: { scroll: 0.4, pointer: -10 },
  headline: { scroll: 0.25, pointer: -18 },
  wheel: { scroll: -0.08, pointer: 22 },
  seal: { scroll: -0.2, pointer: 34 },
} satisfies Record<string, Depth>;

/** One layer's offset from the scroll and the pointer together. */
function useLayerDrift(
  scroll: MotionValue<number>,
  pointerX: MotionValue<number>,
  pointerY: MotionValue<number>,
  height: number,
  depth: Depth,
) {
  const x = useTransform(pointerX, (p) => p * depth.pointer);
  const y = useTransform([scroll, pointerY], ([s, p]: number[]) => s * depth.scroll * height + p * depth.pointer);
  return { x, y };
}

export default function Hero() {
  const step = useCycle(CYCLE_INTERVAL_MS);
  const reduceMotion = usePrefersReducedMotion();
  const item = HERO_ITEMS[step % HERO_ITEMS.length];
  const palette = heroPalette(item.background);
  const sectionRef = useRef<HTMLElement>(null);
  const { height } = useElementSize(sectionRef);

  // The navbar floats over the hero, so it takes the hero's colors and timing.
  useLayoutEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--hero-ink", palette.ink);
    root.setProperty("--hero-surface", palette.surface);
    root.setProperty("--hero-dur", `${TRANSITION_MS}ms`);
    root.setProperty("--hero-ease", TRANSITION_EASING);
  }, [palette.ink, palette.surface]);

  // 0 → 1 as the hero scrolls out of view.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const scroll = useSpring(scrollYProgress, SCROLL_SPRING);
  // -1 → 1 across the hero, mouse only.
  const pointerX = useSpring(0, POINTER_SPRING);
  const pointerY = useSpring(0, POINTER_SPRING);

  const watermark = useLayerDrift(scroll, pointerX, pointerY, height, DEPTH.watermark);
  const headline = useLayerDrift(scroll, pointerX, pointerY, height, DEPTH.headline);
  const wheel = useLayerDrift(scroll, pointerX, pointerY, height, DEPTH.wheel);
  const seal = useLayerDrift(scroll, pointerX, pointerY, height, DEPTH.seal);
  const wheelScale = useTransform(scroll, [0, 1], [1, 1.08]);
  const sealRotate = useTransform(scroll, [0, 1], [0, 90]);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    pointerY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };
  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const drift = <T,>(style: T) => (reduceMotion ? undefined : style);

  return (
    <section
      id="home"
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`relative isolate h-svh min-h-144 overflow-hidden transition-colors duration-(--hero-dur) ease-(--hero-ease) ${LAYOUT}`}
      style={
        {
          "--hero-dur": `${TRANSITION_MS}ms`,
          "--hero-ease": TRANSITION_EASING,
          backgroundColor: item.background,
          color: palette.ink,
        } as CSSProperties
      }
    >
      <motion.div className="absolute inset-0" style={drift(watermark)}>
        <Watermark color={palette.watermark} />
      </motion.div>

      <motion.div className="pointer-events-none absolute inset-0 z-10" style={drift(headline)}>
        <h1 className="display-caps absolute top-(--headline-y) left-1/2 -translate-1/2 text-[min(23cqw,calc(var(--item-size)*0.62))] leading-[0.8] tracking-[0.06em] whitespace-nowrap text-white select-none [text-shadow:0_0.02em_0.06em_rgb(0_0_0/0.12)]">
          <span className="sr-only">{BRAND.name}</span>
          <span aria-hidden="true">Abacá</span>
        </h1>
      </motion.div>

      <div
        className="absolute top-(--hill-y) left-[-25%] z-20 h-[86%] w-[150%] rounded-[50%]"
        style={{ backgroundColor: HILL_COLOR }}
      >
        <Hill step={step} />
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-30 origin-[50%_var(--base-y)]"
        style={drift({ ...wheel, scale: wheelScale })}
      >
        <ProductWheel step={step} reduceMotion={reduceMotion} />
      </motion.div>

      <motion.div className="pointer-events-none absolute inset-0 z-40" style={drift(seal)}>
        <motion.div
          className="absolute top-[calc(var(--scene-y)_-_0.36*var(--item-size))] left-[calc(50%_+_0.22*var(--item-size))] w-[max(5.5rem,calc(var(--item-size)*0.26))] drop-shadow-[0_10px_18px_rgb(0_0_0/0.18)]"
          style={drift({ rotate: sealRotate })}
        >
          <Seal spin className="w-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
