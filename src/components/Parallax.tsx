import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { SCROLL_SPRING } from "../lib/motion";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

/** The box's whole pass through the viewport: entering at the bottom to leaving at the top. */
const PASS = ["start end", "end start"] as const;

interface ParallaxProps {
  children: ReactNode;
  /**
   * Drift over the box's whole pass through the viewport, in viewport heights.
   * Positive lags behind the scroll and reads as farther away; negative
   * pushes ahead of it and reads as closer.
   */
  speed?: number;
  className?: string;
}

/** Content that drifts at its own pace while its box scrolls through the viewport. */
export function Parallax({ children, speed = 0.15, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const still = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: [...PASS] });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);
  const y = useTransform(progress, [0, 1], [`${-speed * 50}vh`, `${speed * 50}vh`]);

  // The measured box stays put; only its content moves, so the scroll range never shifts under it.
  return (
    <div ref={ref} className={className}>
      <motion.div className="h-full will-change-transform" style={still ? undefined : { y }}>
        {children}
      </motion.div>
    </div>
  );
}

interface ParallaxImageProps {
  src: string;
  alt: string;
  /** How far the image overhangs its frame at each end, as a share of the frame's height. */
  drift?: number;
  /** Frame classes: size, aspect ratio, rounding. */
  className?: string;
  /** Image classes, e.g. a filter or object-position. */
  imageClassName?: string;
}

/** A photo that moves more slowly than its frame, like a view through a window. */
export function ParallaxImage({
  src,
  alt,
  drift = 0.1,
  className = "",
  imageClassName = "",
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const still = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: [...PASS] });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);
  // Travels the overhang each way, in the image's own height (what % translates by),
  // so both edges stay covered the whole way through.
  const travel = (drift / (1 + 2 * drift)) * 100;
  const y = useTransform(progress, [0, 1], [`${-travel}%`, `${travel}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={`absolute inset-x-0 w-full object-cover select-none ${imageClassName}`}
        style={{ top: `${-drift * 100}%`, height: `${100 + 2 * drift * 100}%`, y: still ? 0 : y }}
      />
    </div>
  );
}
