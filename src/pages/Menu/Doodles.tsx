/**
 * Hand-drawn doodles, after the scribbles on a café's chalkboard menu. Each
 * stroke draws itself in while its card (the nearest `group/card`) is hovered
 * or focused, in the card's text color.
 */

// The gap is a little longer than the path and the rest offset sits inside it, so
// no dash end touches the path while undrawn: a round cap there leaves a dot.
const DRAW =
  "[stroke-dasharray:1_1.1] [stroke-dashoffset:1.05] transition-[stroke-dashoffset] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/card:[stroke-dashoffset:0] group-focus-visible/card:[stroke-dashoffset:0] motion-reduce:transition-none";

const PEN = {
  "aria-hidden": true,
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

interface DoodleProps {
  className?: string;
}

/** A quick loop around whatever sits in the middle of its box, overshooting where it started. */
export function DoodleLoop({ className = "" }: DoodleProps) {
  return (
    <svg {...PEN} viewBox="0 0 100 100" strokeWidth={1.5} className={`overflow-visible ${className}`}>
      <path
        pathLength={1}
        className={DRAW}
        d="M22 64C10 38 30 12 56 12S94 34 90 56 64 92 44 90 8 70 14 48 30 24 42 20"
      />
    </svg>
  );
}

/** A plus, a cross and a tilde in the box's corners, drawn in just after the loop. */
export function DoodleSparkles({ className = "" }: DoodleProps) {
  return (
    <svg {...PEN} viewBox="0 0 100 100" strokeWidth={1.5} className={`overflow-visible ${className}`}>
      <path pathLength={1} className={`${DRAW} group-hover/card:delay-300`} d="M89 4v12M83 10h12" />
      <path pathLength={1} className={`${DRAW} group-hover/card:delay-500`} d="M5 20l9 9M14 20l-9 9" />
      <path pathLength={1} className={`${DRAW} group-hover/card:delay-400`} d="M74 94q4-6 8 0t8 0" />
    </svg>
  );
}

/** A wobbly underline, 64 × 8. */
export function DoodleUnderline({ className = "" }: DoodleProps) {
  return (
    <svg {...PEN} viewBox="0 0 64 8" strokeWidth={1.6} className={`overflow-visible ${className}`}>
      <path
        pathLength={1}
        className={`${DRAW} group-hover/card:delay-150`}
        d="M2 5c6-4 10 3 16 0s10-4 16 0 10 3 16 0 8-3 12-1"
      />
    </svg>
  );
}
