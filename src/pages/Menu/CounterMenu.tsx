import { useId } from "react";
import pastryCaseUrl from "../../assets/photos/pastry-case.jpg";
import { ParallaxImage } from "../../components/Parallax";
import Reveal from "../../components/Reveal";
import { heroPalette } from "../../lib/color";
import { COUNTER, MENU_END } from "./menu.config";

/** The wider line-up after the showcase, beside a look at the display case. */
export default function CounterMenu() {
  const headingId = useId();
  // The showcase ends on MENU_END, so this picks up right where it leaves off.
  const { ink } = heroPalette(MENU_END);

  return (
    <div role="group" aria-labelledby={headingId} style={{ backgroundColor: MENU_END, color: ink }}>
      <div className="mx-auto grid w-[min(92vw,72rem)] gap-14 py-24 sm:py-32 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
        <Reveal>
          <figure>
            <ParallaxImage
              src={pastryCaseUrl}
              alt="Croissants, pain au chocolat and danishes lined up in an Abacá display case"
              className="grain aspect-4/3 rounded-4xl shadow-2xl"
            />
            <figcaption className="eyebrow mt-4 text-[10px] opacity-70">
              This morning's counter
            </figcaption>
          </figure>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow opacity-70">From the counter</p>
            <h3
              id={headingId}
              className="display-caps mt-4 text-[clamp(2.75rem,6vw,4.75rem)] leading-[0.95]"
            >
              And plenty <span className="serif-accent">more.</span>
            </h3>
            <p className="mt-5 max-w-md text-sm leading-relaxed opacity-80 sm:text-base">
              The showcase is only the start. Here's what else is usually waiting for you
              behind the glass, and at the espresso machine.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {COUNTER.map((group, i) => (
              <Reveal key={group.title} delay={0.08 * (i + 1)}>
                <h4 className="eyebrow border-b border-current/25 pb-3 text-[10px]">
                  {group.title}
                </h4>
                <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                  {group.items.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
