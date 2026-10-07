import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useId, useRef } from "react";
import { EASE_OUT } from "../../lib/motion";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { BRAND } from "../../site.config";
import { CREMA, CRUST, INK, PAPER } from "../../theme";
import DiveStage from "./DiveStage";
import PhotoCollage from "./PhotoCollage";
import WordReveal from "./WordReveal";

// TODO: check the story, the line and the numbers with Abacá.
const STORY =
  "Abacá has been baking by hand since 2006. Real butter, slow doughs and plenty of patience: every croissant is still laminated and shaped by a baker, every tray leaves the oven before our doors open, and every cup of coffee is pulled the moment you order it.";

const LINE = "“Good things take time. Croissants, especially.”";
const LINE_BY = "The bakers' first rule";

const REVEAL_CLASS = "text-[clamp(1.6rem,3.4vw,2.9rem)] leading-[1.2] font-medium tracking-tight";

const STATS = [
  { value: BRAND.founded, from: 1990, suffix: "", label: "Ovens first lit" },
  {
    value: new Date().getFullYear() - BRAND.founded,
    from: 0,
    suffix: "",
    label: "Years of handcrafting",
  },
  { value: 100, from: 0, suffix: "%", label: "Made from scratch" },
] as const;

export default function About() {
  const headingId = useId();
  const still = usePrefersReducedMotion();

  return (
    <section
      id="about"
      aria-labelledby={headingId}
      style={{ backgroundColor: INK, color: PAPER }}
    >
      {!still && <DiveStage headingId={headingId} />}

      <div className="relative overflow-clip">
        <div className="relative mx-auto w-[min(92vw,72rem)] py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            {still && (
              <>
                <p className="eyebrow" style={{ color: CRUST }}>
                  About us
                </p>
                <h2 id={headingId} className="display-caps mt-4 mb-8 text-6xl sm:text-7xl">
                  Our{" "}
                  <span className="serif-accent" style={{ color: CRUST }}>
                    story.
                  </span>
                </h2>
              </>
            )}
            <WordReveal text={STORY} still={still} className={REVEAL_CLASS} />
          </div>

          <PhotoCollage />

          <div className="mt-32 grid gap-16 sm:mt-48 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
            <figure>
              <blockquote>
                <p className={`serif-accent ${REVEAL_CLASS}`} style={{ color: CREMA }}>
                  {LINE}
                </p>
              </blockquote>
              <figcaption className="eyebrow mt-6" style={{ color: CRUST }}>
                — {LINE_BY}
              </figcaption>
            </figure>

            <dl className="grid content-end gap-10 sm:grid-cols-3 lg:grid-cols-1">
              {STATS.map((stat) => (
                <Stat key={stat.label} {...stat} still={still} />
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

interface StatProps {
  value: number;
  /** Where the count starts. */
  from: number;
  suffix: string;
  label: string;
  still: boolean;
}

/** Counts up the first time it scrolls into view. */
function Stat({ value, from, suffix, label, still }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const count = useMotionValue(still ? value : from);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!inView || still) return;
    const controls = animate(count, value, { duration: 1.6, ease: EASE_OUT });
    return () => controls.stop();
  }, [inView, still, count, value]);

  return (
    <div ref={ref} className="flex flex-col-reverse gap-2 border-t border-current/15 pt-5">
      <dt className="eyebrow text-[10px] opacity-70">{label}</dt>
      <dd className="display-caps text-6xl leading-none font-light sm:text-7xl" style={{ color: CRUST }}>
        <span className="sr-only">
          {value}
          {suffix}
        </span>
        <span aria-hidden>
          <motion.span>{rounded}</motion.span>
          {suffix}
        </span>
      </dd>
    </div>
  );
}
