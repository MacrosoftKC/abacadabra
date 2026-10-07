import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useId, useRef, type ReactNode } from "react";
import { CRUST, INK, PAPER, WHITE } from "../../theme";
import { MENU_ITEMS } from "../Menu/menu.config";
import CraftCta from "./CraftCta";
import Drips from "./Drips";
import { BatchVisual, DoughVisual, LayersVisual } from "./StepVisuals";

interface Step {
  title: string;
  body: string;
  visual: ReactNode;
  background: string;
  ink: string;
  accent: string;
}

// TODO: check the copy with Abacá's bakers.
const STEPS: Step[] = [
  {
    title: "Slow dough",
    body: "Flour, butter, milk and time. Our doughs are mixed by hand and left to rest, so the flavour has room to develop.",
    visual: <DoughVisual />,
    background: INK,
    ink: PAPER,
    accent: CRUST,
  },
  {
    title: "Fold by fold",
    body: "Cold butter is folded into the dough in thirds, again and again, until three layers become twenty-seven.",
    visual: <LayersVisual />,
    background: CRUST,
    ink: INK,
    accent: INK,
  },
  {
    title: "Baked at dawn",
    body: "Into the oven before sunrise, onto the counter by the time our doors open. Tomorrow, we start again.",
    visual: <BatchVisual />,
    background: WHITE,
    ink: INK,
    accent: CRUST,
  },
];

/** The menu ends on its last item's color; that's what drips in from above. */
const ABOVE = MENU_ITEMS[MENU_ITEMS.length - 1].background;

export default function Craft() {
  const headingId = useId();
  const stackRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });

  return (
    <section
      id="craft"
      aria-labelledby={headingId}
      className="relative"
      style={{ backgroundColor: PAPER, color: INK }}
    >
      <Drips color={ABOVE} />

      <header className="mx-auto w-[min(92vw,68rem)] pt-36 sm:pt-44">
        <p className="eyebrow" style={{ color: CRUST }}>
          The craft
        </p>
        <h2
          id={headingId}
          className="display-caps mt-4 text-[clamp(3rem,8.5vw,7rem)] leading-[0.92]"
        >
          Made by hand,
          <br />
          <span className="serif-accent" style={{ color: CRUST }}>
            every morning.
          </span>
        </h2>
        <p className="mt-6 max-w-md text-ink/65">
          Three steps between a sack of flour and the pastry in your hand. None of them can be
          rushed.
        </p>
      </header>

      <ol ref={stackRef} className="relative">
        {STEPS.map((step, i) => (
          <StepCard
            key={step.title}
            step={step}
            index={i}
            total={STEPS.length}
            progress={scrollYProgress}
          />
        ))}
      </ol>

      <CraftCta />
    </section>
  );
}

interface StepCardProps {
  step: Step;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

/** Cards pin in turn and stack; each one shrinks back as the next slides over it. */
function StepCard({ step, index, total, progress }: StepCardProps) {
  const scale = useTransform(progress, [index / total, 1], [1, 1 - (total - 1 - index) * 0.05]);

  return (
    <li className="sticky top-0 flex h-svh items-center justify-center">
      <motion.article
        className="group relative grid h-[min(78svh,36rem)] w-[min(92vw,68rem)] origin-top grid-rows-[auto_minmax(0,1fr)] gap-6 overflow-hidden rounded-[2rem] p-7 shadow-[0_-12px_40px_rgb(20_18_16/0.14)] sm:p-10 md:grid-cols-[1fr_1.1fr] md:grid-rows-1 md:items-center md:gap-10 md:p-14"
        style={{
          scale,
          top: `calc(${index} * 1.75rem)`,
          backgroundColor: step.background,
          color: step.ink,
        }}
      >
        <div>
          <p className="display-caps text-6xl leading-none font-light sm:text-8xl" style={{ color: step.accent }}>
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="serif-accent mt-4 text-4xl sm:text-5xl">{step.title}</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed opacity-80 sm:text-base">{step.body}</p>
        </div>
        <div aria-hidden className="relative h-full min-h-0">
          {step.visual}
        </div>
      </motion.article>
    </li>
  );
}
