import SectionLink from "../../components/SectionLink";
import { INK } from "../../theme";
import ItemCaption from "./ItemCaption";

const BADGES = [
  { value: "2006", label: "Est." },
  { value: "100%", label: "Handcrafted" },
  { value: "Daily", label: "Fresh from the oven" },
] as const;

const BUTTON =
  "rounded-full px-6 py-3 font-display text-xs font-semibold tracking-[0.2em] uppercase transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current sm:px-7";

/** The hill's copy, starting just under where the center item rests. */
export default function Hill({ step }: { step: number }) {
  return (
    <div
      className="relative mx-auto grid w-[min(92vw,72rem)] justify-items-center gap-4 px-2 pt-[calc(var(--base-y)_-_var(--hill-y)_+_2.5cqh)] sm:grid-cols-[1fr_auto_1fr] sm:items-start"
      style={{ color: INK }}
    >
      <p className="hidden max-w-56 justify-self-start text-[11px] leading-relaxed font-semibold tracking-[0.12em] uppercase opacity-80 sm:block">
        Breads, pastries and coffee, handcrafted from scratch since 2006.
      </p>

      <div className="flex flex-col items-center gap-4">
        <ItemCaption step={step} />
        <div className="flex flex-wrap justify-center gap-2">
          <SectionLink to="menu" className={`${BUTTON} bg-ink text-paper shadow-md`}>
            Explore the menu
          </SectionLink>
          <SectionLink to="visit" className={`${BUTTON} ring-1 ring-ink/30 ring-inset`}>
            Find a café
          </SectionLink>
        </div>
      </div>

      <dl className="hidden items-start gap-5 justify-self-end sm:flex">
        {BADGES.map((badge) => (
          <div key={badge.label} className="flex flex-col-reverse items-center text-center">
            <dt className="max-w-20 text-[9px] leading-snug font-semibold tracking-[0.14em] uppercase opacity-70">
              {badge.label}
            </dt>
            <dd className="display-caps text-lg font-normal">{badge.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
