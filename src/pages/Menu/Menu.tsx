import { useId } from "react";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import CounterMenu from "./CounterMenu";
import PourShowcase from "./PourShowcase";
import StaticMenu from "./StaticMenu";

export default function Menu() {
  const headingId = useId();
  const still = usePrefersReducedMotion();

  return (
    <section id="menu" aria-labelledby={headingId} className="relative bg-paper">
      {still ? <StaticMenu headingId={headingId} /> : <PourShowcase headingId={headingId} />}
      <CounterMenu />
    </section>
  );
}
