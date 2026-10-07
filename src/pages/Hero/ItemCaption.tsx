import { AnimatePresence, motion } from "motion/react";
import { EASE_IN_OUT } from "../../lib/motion";
import { HERO_ITEMS, TRANSITION_MS } from "./hero.config";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "No. 01 / 05 · Butter croissant" under the center item, rolling over with
 * the wheel. Hidden from assistive tech: the wheel already names the item.
 */
export default function ItemCaption({ step }: { step: number }) {
  const index = step % HERO_ITEMS.length;

  return (
    <div aria-hidden="true" className="flex flex-col items-center">
      <p className="eyebrow text-[10px]">
        <span className="opacity-60">No.</span> {pad(index + 1)}{" "}
        <span className="opacity-40">/ {pad(HERO_ITEMS.length)}</span>
      </p>
      <span className="serif-accent relative mt-1 block h-[1.3em] w-[13em] overflow-hidden text-center text-2xl sm:text-[1.75rem]">
        <AnimatePresence initial={false}>
          <motion.span
            key={step}
            className="absolute inset-0 whitespace-nowrap"
            initial={{ y: "105%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-105%", opacity: 0 }}
            transition={{ duration: TRANSITION_MS / 1000, ease: EASE_IN_OUT }}
          >
            {HERO_ITEMS[index].name}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
