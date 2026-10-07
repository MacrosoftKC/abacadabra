import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useState } from "react";
import type { MenuItem } from "./menu.config";

interface ShowcaseIndicatorProps {
  items: readonly MenuItem[];
  /** 0 with the first item centered, 1 with the last. */
  progress: MotionValue<number>;
  opacity: MotionValue<number>;
  color: MotionValue<string>;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** The counter's digits roll the way you're scrolling. */
const DIGIT = {
  enter: (dir: number) => ({ y: dir > 0 ? "100%" : "-100%" }),
  center: { y: "0%" },
  exit: (dir: number) => ({ y: dir > 0 ? "-100%" : "100%" }),
};

/** Where you are in the sideways scroll: counter, track with a marker, item name. */
export default function ShowcaseIndicator({ items, progress, opacity, color }: ShowcaseIndicatorProps) {
  const last = items.length - 1;
  const [{ active, dir }, setState] = useState({ active: 0, dir: 1 });
  const thumbX = useTransform(progress, (p) => `${p * 100}%`);

  useMotionValueEvent(progress, "change", (p) => {
    const next = Math.round(p * last);
    // The showcase recomputes its progress while it renders when the stage
    // resizes; updating this component's state mid-render is an error.
    queueMicrotask(() =>
      setState((s) => (s.active === next ? s : { active: next, dir: next > s.active ? 1 : -1 })),
    );
  });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-40 px-5 pb-6 sm:px-10 sm:pb-8"
      style={{ opacity, color }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-5 sm:gap-8">
        <div className="display-caps flex items-baseline text-4xl leading-none font-light">
          <span className="relative block h-[1em] w-[1.1em] overflow-hidden">
            <AnimatePresence initial={false} custom={dir}>
              <motion.span
                key={active}
                custom={dir}
                variants={DIGIT}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
                className="absolute inset-0"
              >
                {pad(active + 1)}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="ml-1.5 text-base opacity-50">/ {pad(items.length)}</span>
        </div>

        <div className="relative h-6 flex-1">
          <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-current/20" />
          <motion.div
            className="absolute inset-x-0 top-1/2 h-0.5 origin-left -translate-y-1/2 rounded-full bg-current"
            style={{ scaleX: progress }}
          />
          {items.map((item, i) => (
            <span
              key={item.id}
              className="absolute top-1/2 size-1.5 -translate-1/2 rounded-full bg-current"
              style={{ left: `${(i / last) * 100}%` }}
            />
          ))}
          <motion.div className="absolute inset-0" style={{ x: thumbX }}>
            <span className="absolute top-1/2 left-0 size-3.5 -translate-1/2 rounded-full bg-current" />
          </motion.div>
        </div>

        <p className="eyebrow hidden w-48 text-right text-[10px] sm:block">
          {items[active].name}
        </p>
      </div>
    </motion.div>
  );
}
