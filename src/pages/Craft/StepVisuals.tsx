import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import ProductImage from "../../components/ProductImage";
import { EASE_OUT } from "../../lib/motion";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { CRUST, INK, PAPER } from "../../theme";
import { MENU_ITEMS } from "../Menu/menu.config";

/*
 * Illustrations for the craft steps, drawn in HTML and CSS so they look
 * finished without any photos. They're pictures, not controls, so the step
 * cards hide them from assistive tech.
 */

const INGREDIENTS = ["Flour", "Cold butter", "Fresh milk", "Sugar & salt", "Patience"];

export function DoughVisual() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-sm rotate-2 rounded-3xl bg-paper p-6 text-ink shadow-2xl transition-transform duration-500 group-hover:rotate-0 sm:p-7">
        <div className="eyebrow flex items-baseline justify-between text-[10px] opacity-60">
          <span>Recipe card</span>
          <span>No. 01</span>
        </div>
        <p className="serif-accent mt-3 text-3xl">Viennoiserie dough</p>
        <ul className="mt-5 flex flex-col gap-2.5 text-sm">
          {INGREDIENTS.map((name) => (
            <li key={name} className="flex items-center gap-3">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ink text-paper">
                <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2.5 6.2 5 8.5 9.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {name}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <div className="flex items-baseline justify-between text-[10px] font-semibold tracking-[0.2em] uppercase opacity-60">
            <span>Resting</span>
            <span>Overnight</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10">
            <motion.div
              className="h-full origin-left rounded-full"
              style={{ backgroundColor: CRUST }}
              initial={{ scaleX: 0.12 }}
              whileInView={{ scaleX: 0.8 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 2.4, ease: EASE_OUT }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Each fold in thirds triples the layers. */
const FOLDS = [3, 9, 27] as const;
const DOUGH = "#F6E7CB";
const BUTTER = "#F1CF72";

/** A slab of dough that folds itself, 3 → 9 → 27 layers, while it's on screen. */
export function LayersVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const still = usePrefersReducedMotion();
  // 0-2 name a fold; one extra beat holds the last fold before starting over.
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!inView || still) return;
    const id = window.setInterval(() => setBeat((b) => (b + 1) % (FOLDS.length + 1)), 1500);
    return () => window.clearInterval(id);
  }, [inView, still]);

  const fold = still ? FOLDS.length - 1 : Math.min(beat, FOLDS.length - 1);
  const layers = FOLDS[fold];

  return (
    <div ref={ref} className="flex h-full flex-col items-center justify-center gap-6">
      <motion.div
        key={layers}
        className="flex h-[min(50%,14rem)] w-[min(82%,22rem)] origin-bottom flex-col overflow-hidden rounded-2xl shadow-xl ring-1 ring-ink/10"
        initial={{ scaleY: 1.3, scaleX: 0.82 }}
        animate={{ scaleY: 1, scaleX: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Dough with butter between each pair: 2n - 1 stripes for n layers. */}
        {Array.from({ length: layers * 2 - 1 }, (_, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: i % 2 ? BUTTER : DOUGH }} />
        ))}
      </motion.div>

      <div className="text-center">
        <p className="display-caps text-5xl leading-none font-light tabular-nums">{layers}</p>
        <p className="eyebrow mt-2 text-[10px] opacity-70">Layers</p>
        <ol className="mt-3 flex justify-center gap-3 text-[11px] font-semibold">
          {FOLDS.map((n, i) => (
            <li
              key={n}
              className={`rounded-full px-2.5 py-1 ring-1 ring-current/30 transition-opacity ${i <= fold ? "opacity-100" : "opacity-35"}`}
            >
              Fold {i + 1}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const [CROISSANT, PAIN_AU_CHOCOLAT, DANISH] = MENU_ITEMS;

/** Fanned out behind the ticket once their cutouts are in src/assets/products. */
const FAN = [
  { item: CROISSANT, className: "-mr-[18%] origin-bottom-right -rotate-12 group-hover:-rotate-[18deg]" },
  { item: PAIN_AU_CHOCOLAT, className: "z-10 group-hover:-translate-y-3" },
  { item: DANISH, className: "-ml-[18%] origin-bottom-left rotate-12 group-hover:rotate-[18deg]" },
];

export function BatchVisual() {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="absolute inset-x-0 bottom-0 flex h-[62%] items-end justify-center">
        {FAN.map(({ item, className }) => (
          <ProductImage
            key={item.id}
            file={item.image}
            alt=""
            optional
            className={`relative aspect-square h-full object-contain transition-transform duration-500 ease-out ${className}`}
          />
        ))}
      </div>

      <div
        className="relative w-full max-w-72 -rotate-3 rounded-3xl p-6 shadow-2xl transition-transform duration-500 group-hover:rotate-0"
        style={{ backgroundColor: INK, color: PAPER }}
      >
        <div className="eyebrow flex items-center justify-between text-[10px] opacity-70">
          <span>Fresh batch</span>
          <span>Tray 01</span>
        </div>
        <p className="serif-accent mt-3 text-4xl leading-none" style={{ color: CRUST }}>
          Out of the oven!
        </p>
        <p className="mt-2 text-sm opacity-80">Croissants · Pain au chocolat · Danishes</p>

        <div className="relative -mx-6 my-5">
          <span className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full bg-white" />
          <span className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full bg-white" />
          <div className="mx-6 border-t-2 border-dashed border-current/25" />
        </div>

        <dl className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <dt className="opacity-60">Into the oven</dt>
            <dd className="font-bold">Before sunrise</dd>
          </div>
          <div>
            <dt className="opacity-60">On the counter</dt>
            <dd className="font-bold">By opening time</dd>
          </div>
        </dl>
        <div className="mt-5 h-10 rounded-sm bg-[repeating-linear-gradient(90deg,currentColor_0_2px,transparent_2px_5px,currentColor_5px_6px,transparent_6px_9px)] opacity-80" />
      </div>
    </div>
  );
}
