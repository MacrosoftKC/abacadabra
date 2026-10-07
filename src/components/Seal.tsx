import { useId } from "react";
import { INK, WHITE } from "../theme";

const RING_TEXT = "HANDCRAFTED GOODS • BAKING COMPANY • CAFE & COFFEEHOUSE • ";
/** Baseline circle of the ring text, in the 200-unit box. */
const RING_R = 74;
/** Stretched to the full circle, minus a hair so the loop doesn't collide with itself. */
const RING_LENGTH = 2 * Math.PI * RING_R - 4;
/** Clockwise from 9 o'clock, all the way round. */
const RING_PATH = `M${100 - RING_R} 100a${RING_R} ${RING_R} 0 1 1 ${2 * RING_R} 0a${RING_R} ${RING_R} 0 1 1 ${-2 * RING_R} 0`;

interface SealProps {
  className?: string;
  /** Turns the ring of text slowly, unless the visitor prefers reduced motion. */
  spin?: boolean;
}

/**
 * Abacá's round seal: "abacá" inside a ring that reads handcrafted goods,
 * baking company, cafe & coffeehouse. A white disc with ink lettering, so it
 * sits on any background like a sticker.
 */
export default function Seal({ className = "", spin = false }: SealProps) {
  const ringId = useId();

  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={className}>
      <circle cx="100" cy="100" r="99" fill={WHITE} />
      <circle cx="100" cy="100" r="92" fill="none" stroke={INK} strokeWidth="1.5" />
      <circle cx="100" cy="100" r="61" fill="none" stroke={INK} strokeWidth="1.5" />
      <path id={ringId} d={RING_PATH} fill="none" />
      <g
        className={spin ? "motion-safe:animate-[spin-slow_32s_linear_infinite]" : undefined}
        style={{ transformBox: "view-box", transformOrigin: "100px 100px" }}
      >
        <text fill={INK} fontFamily="'Josefin Sans', sans-serif" fontSize="11.5" fontWeight="600">
          <textPath href={`#${ringId}`} textLength={RING_LENGTH} lengthAdjust="spacing">
            {RING_TEXT}
          </textPath>
        </text>
      </g>
      <text
        x="100"
        y="110"
        textAnchor="middle"
        fill={INK}
        fontFamily="'DM Sans', sans-serif"
        fontSize="33"
        fontWeight="700"
        letterSpacing="-1"
      >
        abacá
      </text>
    </svg>
  );
}
