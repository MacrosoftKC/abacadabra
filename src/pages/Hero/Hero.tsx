import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useLayoutEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import doodlesUrl from "../../assets/brand/hero-doodles.webp";
import Seal from "../../components/Seal";
import { heroPalette } from "../../lib/color";
import { POINTER_SPRING, SCROLL_SPRING } from "../../lib/motion";
import { useCycle } from "../../lib/useCycle";
import { useElementSize } from "../../lib/useElementSize";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { BRAND } from "../../site.config";
import Hill from "./Hill";
import ProductWheel from "./ProductWheel";
import {
  CYCLE_INTERVAL_MS,
  HERO_BACKGROUND,
  HERO_ITEMS,
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
 * --hill-y      top of the plate under the copy, which starts just under the item's base
 */
const LAYOUT = [
  "[container-type:size]",
  "[--hill-y:71cqh]",
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
  tint: { scroll: 0.4, pointer: -10 },
  headline: { scroll: 0.25, pointer: -18 },
  wheel: { scroll: -0.08, pointer: 22 },
  seal: { scroll: -0.2, pointer: 34 },
} satisfies Record<string, Depth>;

/** White page, so ink reads everywhere; the navbar takes these colors too. */
const PALETTE = heroPalette(HERO_BACKGROUND);

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
  const sectionRef = useRef<HTMLElement>(null);
  const { height } = useElementSize(sectionRef);

  // The navbar floats over the hero, so it takes the hero's colors and timing.
  useLayoutEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--hero-ink", PALETTE.ink);
    root.setProperty("--hero-surface", PALETTE.surface);
    root.setProperty("--hero-dur", `${TRANSITION_MS}ms`);
    root.setProperty("--hero-ease", TRANSITION_EASING);
  }, []);

  // 0 → 1 as the hero scrolls out of view.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const scroll = useSpring(scrollYProgress, SCROLL_SPRING);
  // -1 → 1 across the hero, mouse only.
  const pointerX = useSpring(0, POINTER_SPRING);
  const pointerY = useSpring(0, POINTER_SPRING);

  const tint = useLayerDrift(scroll, pointerX, pointerY, height, DEPTH.tint);
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
      className={`relative isolate h-svh min-h-144 overflow-hidden ${LAYOUT}`}
      style={
        {
          "--hero-dur": `${TRANSITION_MS}ms`,
          "--hero-ease": TRANSITION_EASING,
          backgroundColor: HERO_BACKGROUND,
          color: PALETTE.ink,
        } as CSSProperties
      }
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${doodlesUrl})` }}
      />

      {/* The current item's color, as a soft glow that follows it around the wheel. */}
      <motion.div aria-hidden="true" className="absolute inset-0" style={drift(tint)}>
        <div
          className="absolute top-(--scene-y) left-1/2 size-[calc(var(--item-size)*1.1)] -translate-1/2 rounded-full opacity-[0.18] transition-colors duration-(--hero-dur) ease-(--hero-ease)"
          style={{ backgroundColor: item.background }}
        />
      </motion.div>

      <motion.div className="pointer-events-none absolute inset-0 z-10" style={drift(headline)}>
        <h1 className="display-caps absolute top-(--headline-y) left-1/2 -translate-1/2 text-[min(20cqw,calc(var(--item-size)*0.62))] leading-[0.8] tracking-[0.06em] whitespace-nowrap select-none">
          <span className="sr-only">{BRAND.name}</span>
          <span aria-hidden="true">Abacá</span>
        </h1>
      </motion.div>

      {/* A white plate under the copy, feathered so the doodles fade out around it. */}
      <div
        aria-hidden="true"
        className="absolute top-(--hill-y) left-[-2%] z-20 h-[60%] w-[104%] rounded-[50%] shadow-[0_0_3rem_2.5rem_var(--plate)]"
        style={{ backgroundColor: HERO_BACKGROUND, "--plate": HERO_BACKGROUND } as CSSProperties}
      />
      <div className="absolute top-(--hill-y) left-[-25%] z-20 h-[86%] w-[150%]">
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
