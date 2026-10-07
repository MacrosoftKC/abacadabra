import { clamp, cubicBezier, motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import type { CSSProperties, FocusEvent, Ref } from "react";
import ProductImage from "../../components/ProductImage";
import { heroPalette } from "../../lib/color";
import { EASE_OUT } from "../../lib/motion";
import { CRUST } from "../../theme";
import { DoodleLoop, DoodleSparkles, DoodleUnderline } from "./Doodles";
import type { MenuItem } from "./menu.config";

/** Where the grid's cutouts fly between, measured on the showcase's stage (px). */
export interface Flight {
  /** Center of the last item's cutout while it holds center stage. */
  from: { x: number; y: number };
  /** That cutout's size. Grid cutouts render at it and scale down, so they stay sharp. */
  size: number;
  /** Center of each card's cutout slot, and the size the cutout rests at. */
  to: readonly { x: number; y: number; size: number }[];
  /** The other items come back in from just past the right edge, where they left. */
  stageWidth: number;
}

/** Share of the pan-out each cutout spends in flight. */
const FLIGHT = 0.42;
/** When the first item, the last to go, sets off. Everyone has landed by LAST_TAKEOFF + FLIGHT. */
const LAST_TAKEOFF = 0.48;
/** Share of the pan-out each card takes to fade in. */
const CARD_FADE = 0.2;

const easeOut = cubicBezier(...EASE_OUT);
const pad = (n: number) => String(n).padStart(2, "0");

/** The cutout lifting off its spot while the card is hovered or focused. */
const LIFT =
  "block size-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:-translate-y-[5%] group-hover/card:scale-110 group-hover/card:-rotate-6 group-focus-visible/card:-translate-y-[5%] group-focus-visible/card:scale-110 group-focus-visible/card:-rotate-6 motion-reduce:transition-none";

interface MenuGridProps {
  items: readonly MenuItem[];
  /** The showcase's pan-out, 0 → 1. Leave it out for a grid that's simply there. */
  overview?: MotionValue<number>;
  /** Pan-out progress from which the cards appear: once the coffee is out of their way. */
  cardsFrom?: number;
  /** Measured once the grid sits on the showcase's stage; null until then. */
  flight?: Flight | null;
  listRef?: Ref<HTMLUListElement>;
  onSelect: (index: number) => void;
  /** A card got keyboard focus, so the grid had better be on screen. */
  onKeyboardFocus?: () => void;
}

/**
 * Every item at a glance. On the showcase's stage it fills the screen and its
 * cutouts fly in from the showcase as the stage pans out; anywhere else it's
 * a plain grid. On portrait screens a card sets its cutout beside the name;
 * on landscape screens, above it.
 */
export default function MenuGrid({
  items,
  overview,
  cardsFrom = 0,
  flight = null,
  listRef,
  onSelect,
  onKeyboardFocus,
}: MenuGridProps) {
  const settled = useMotionValue(1);
  const staged = overview !== undefined;
  const progress = overview ?? settled;
  const headingOpacity = useTransform(progress, [0.55, 0.85], [0, 1]);
  const headingY = useTransform(progress, [0.55, 0.85], [16, 0]);

  return (
    <div
      className={
        staged
          ? "flex size-full flex-col px-4 pt-20 pb-5 sm:px-6 md:pt-24 md:pb-6 lg:px-10 short:pt-14 short:pb-3"
          : ""
      }
    >
      {/* Short screens need every row for the cards. */}
      <motion.header
        className={`mx-auto w-full max-w-7xl ${staged ? "short:hidden" : ""}`}
        style={{ opacity: headingOpacity, y: headingY }}
      >
        <p className="eyebrow" style={{ color: CRUST }}>
          The full line-up
        </p>
        <h3 className="display-caps mt-2 text-[clamp(1.6rem,4.2vw,3.4rem)] leading-none">
          All ten,{" "}
          <span className="serif-accent" style={{ color: CRUST }}>
            at a glance.
          </span>
        </h3>
      </motion.header>

      <ul
        ref={listRef}
        className={`mx-auto mt-4 grid w-full max-w-7xl grid-cols-2 gap-2 sm:gap-3 md:mt-6 landscape:grid-cols-5 landscape:gap-4 ${
          staged
            ? "min-h-0 flex-1 grid-rows-5 landscape:grid-rows-2 short:mt-0"
            : "auto-rows-28 landscape:auto-rows-auto"
        }`}
      >
        {items.map((item, i) => (
          <GridCard
            key={item.id}
            item={item}
            index={i}
            count={items.length}
            progress={progress}
            cardsFrom={cardsFrom}
            flight={flight}
            staged={staged}
            onSelect={onSelect}
            onKeyboardFocus={onKeyboardFocus}
          />
        ))}
      </ul>
    </div>
  );
}

interface GridCardProps {
  item: MenuItem;
  index: number;
  count: number;
  progress: MotionValue<number>;
  cardsFrom: number;
  flight: Flight | null;
  staged: boolean;
  onSelect: (index: number) => void;
  onKeyboardFocus?: () => void;
}

function GridCard({
  item,
  index,
  count,
  progress,
  cardsFrom,
  flight,
  staged,
  onSelect,
  onKeyboardFocus,
}: GridCardProps) {
  const ink = heroPalette(item.background).ink;
  // The last item sets off first; the rest follow in the order they left the stage.
  const takeoff = ((count - 1 - index) / Math.max(1, count - 1)) * LAST_TAKEOFF;
  // The cards fade in under their cutouts in the same order.
  const appear = cardsFrom + takeoff * 0.75;
  const shown = useTransform(progress, [appear, appear + CARD_FADE], [0, 1]);
  const cardScale = useTransform(shown, [0, 1], [0.94, 1]);
  const slot = flight?.to[index];

  const onFocus = (e: FocusEvent<HTMLButtonElement>) => {
    if (e.currentTarget.matches(":focus-visible")) onKeyboardFocus?.();
  };

  return (
    <li className={staged ? "min-h-0" : "landscape:aspect-4/5"}>
      <button
        type="button"
        onClick={() => onSelect(index)}
        onFocus={onFocus}
        className="group/card relative flex size-full cursor-pointer items-center gap-3 rounded-3xl p-2 text-left text-ink transition-colors duration-500 hover:text-(--card-ink) focus-visible:text-(--card-ink) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:p-3 landscape:flex-col landscape:items-stretch landscape:gap-2 landscape:rounded-[1.75rem] landscape:p-4 short:gap-1 short:p-2"
        style={{ "--card-ink": ink, "--pour-wave": "0.9rem" } as CSSProperties}
      >
        <motion.span
          aria-hidden
          className="absolute inset-0 overflow-hidden rounded-[inherit] bg-white shadow-[0_8px_24px_rgb(20_18_16/0.07)] ring-1 ring-ink/5 transition-shadow duration-500 group-hover/card:shadow-[0_18px_40px_rgb(20_18_16/0.16)] group-focus-visible/card:shadow-[0_18px_40px_rgb(20_18_16/0.16)]"
          style={{ opacity: shown, scale: cardScale }}
        >
          {/* A little pour: the item's own color rises from the bottom behind a wavy surface. */}
          <span
            className="absolute inset-0 translate-y-[calc(100%+var(--pour-wave))] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:translate-y-0 group-focus-visible/card:translate-y-0 motion-reduce:transition-none"
            style={{ backgroundColor: item.background }}
          >
            <span
              className="liquid-wave absolute inset-x-0 bottom-full h-(--pour-wave) [animation-play-state:paused] group-hover/card:[animation-play-state:running] group-focus-visible/card:[animation-play-state:running]"
              style={{ backgroundColor: item.background, "--wave-w": "9rem", "--wave-dur": "2.4s" } as CSSProperties}
            />
          </span>
        </motion.span>

        <span
          data-slot
          className="relative h-full w-2/5 shrink-0 landscape:h-auto landscape:min-h-0 landscape:w-full landscape:flex-1"
        >
          <DoodleLoop className="absolute inset-0 z-10 size-full scale-125" />
          <DoodleSparkles className="absolute inset-0 z-10 size-full scale-110" />
          {flight && slot ? (
            <FlyingCutout
              item={item}
              last={index === count - 1}
              takeoff={takeoff}
              progress={progress}
              flight={flight}
              slot={slot}
            />
          ) : (
            <motion.span className="absolute inset-0 z-10" style={{ opacity: shown }}>
              <span className={LIFT}>
                <ProductImage
                  file={item.image}
                  alt=""
                  labelPlaceholder
                  className="size-full object-contain select-none"
                />
              </span>
            </motion.span>
          )}
        </span>

        <motion.span className="relative flex min-w-0 flex-col" style={{ opacity: shown }}>
          <span className="eyebrow text-[9px] opacity-60 sm:text-[10px]">{pad(index + 1)}</span>
          <span className="serif-accent relative mt-1 self-start text-sm leading-tight sm:text-lg landscape:text-[clamp(1rem,1.5vw,1.4rem)]">
            {item.name}
            <DoodleUnderline className="absolute -bottom-2 left-0 h-2 w-16" />
          </span>
          <span className="mt-2 hidden translate-y-1 text-xs opacity-0 transition duration-500 group-hover/card:translate-y-0 group-hover/card:opacity-75 group-focus-visible/card:translate-y-0 group-focus-visible/card:opacity-75 motion-reduce:transition-none sm:block">
            {item.tagline}
          </span>
          <span className="sr-only">, see it up close</span>
        </motion.span>
      </button>
    </li>
  );
}

interface FlyingCutoutProps {
  item: MenuItem;
  last: boolean;
  takeoff: number;
  progress: MotionValue<number>;
  flight: Flight;
  slot: Flight["to"][number];
}

/** A card's cutout, flying in from the showcase to rest in its slot. */
function FlyingCutout({ item, last, takeoff, progress, flight, slot }: FlyingCutoutProps) {
  const { from, size, stageWidth } = flight;
  // The last item leaves exactly where the showcase's cutout was; the others
  // come back from past the right edge, still tilted from leaving.
  const start = last
    ? { x: from.x - slot.x, y: from.y - slot.y, scale: 1, rotate: 0 }
    : { x: stageWidth + size * 0.45 - slot.x, y: 0, scale: 0.7, rotate: -10 };
  const rest = slot.size / size;

  const flown = useTransform(progress, (p) => easeOut(clamp(0, 1, (p - takeoff) / FLIGHT)));
  const x = useTransform(flown, (f) => start.x * (1 - f));
  const y = useTransform(flown, (f) => start.y * (1 - f));
  const scale = useTransform(flown, (f) => start.scale + (rest - start.scale) * f);
  const rotate = useTransform(flown, (f) => start.rotate * (1 - f));
  // Takes over from the showcase's own cutout the moment the pan-out starts.
  const opacity = useTransform(progress, (p) => (p > 0 ? 1 : 0));

  return (
    <motion.span
      className="absolute top-1/2 left-1/2 z-10 -translate-1/2 will-change-transform"
      style={{ width: size, height: size, x, y, scale, rotate, opacity }}
    >
      <span className={LIFT}>
        <ProductImage
          file={item.image}
          alt=""
          labelPlaceholder
          className="size-full object-contain select-none"
        />
      </span>
    </motion.span>
  );
}
