import type { CSSProperties } from "react";
import ProductImage from "../../components/ProductImage";
import { HERO_ITEMS } from "./hero.config";

interface ProductWheelProps {
  step: number;
  reduceMotion: boolean;
}

const COUNT = HERO_ITEMS.length;
const SLOT_DEG = 360 / COUNT;
// Vertical reach of the back-most slot, (1 - cos θ)², so the wheel CSS can
// park those items at the top edge whatever the item count.
const BACK_REACH = Math.max(
  (1 - Math.cos((Math.floor(COUNT / 2) * SLOT_DEG * Math.PI) / 180)) ** 2,
  1,
);

interface WheelProps {
  step: number;
  /** Snap to the new arrangement instead of turning to it. */
  still?: boolean;
  /** Hidden from assistive tech (the outgoing layer of a crossfade). */
  decorative?: boolean;
  className?: string;
}

/** Every item on the wheel, turned so item `step % count` is center stage. */
function Wheel({ step, still = false, decorative = false, className = "" }: WheelProps) {
  const active = step % COUNT;

  return (
    <div
      aria-hidden={decorative || undefined}
      className={`hero-wheel ${still ? "hero-wheel-still" : ""} ${className}`}
      style={
        {
          "--hero-turn": `${step * SLOT_DEG}deg`,
          "--hero-count": COUNT,
          "--wheel-back-reach": BACK_REACH,
        } as CSSProperties
      }
    >
      {HERO_ITEMS.map((item, i) => (
        <div
          key={item.id}
          aria-hidden={i !== active || undefined}
          className="hero-wheel-item size-(--item-size)"
          style={{ "--slot": `${-i * SLOT_DEG}deg` } as CSSProperties}
        >
          <ProductImage
            file={item.image}
            alt={i === active ? item.name : ""}
            labelPlaceholder
            fetchPriority={i === 0 ? "high" : "auto"}
            className="size-full object-contain object-bottom select-none"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * The product stage, anchored on the center item. With full motion the wheel
 * turns clockwise one slot per step (the next item swings in from the right).
 * With reduced motion the same layout is shown, but each new arrangement
 * crossfades in place of the last.
 */
export default function ProductWheel({ step, reduceMotion }: ProductWheelProps) {
  return (
    <div className="pointer-events-none absolute top-(--scene-y) left-1/2 size-0">
      {reduceMotion ? (
        <>
          <Wheel step={step} still />
          {step > 0 && (
            <Wheel
              key={step}
              step={step - 1}
              still
              decorative
              className="absolute top-0 left-0 z-150 animate-[hero-fade-out_var(--hero-dur)_var(--hero-ease)_forwards]"
            />
          )}
        </>
      ) : (
        <Wheel step={step} />
      )}
    </div>
  );
}
