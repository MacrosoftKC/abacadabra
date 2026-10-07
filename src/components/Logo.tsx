import lockupUrl from "../assets/brand/abaca-lockup.png";
import wordmarkUrl from "../assets/brand/abaca-wordmark.png";

const VARIANTS = {
  /** ABACÁ® alone: for the navbar and other small sizes. */
  wordmark: { url: wordmarkUrl, aspect: "aspect-[450/106]" },
  /** With "Baking Company · Handcrafted since 2006" underneath. */
  lockup: { url: lockupUrl, aspect: "aspect-[450/226]" },
} as const;

interface LogoProps {
  variant?: keyof typeof VARIANTS;
  /** Size it by height or width; the aspect ratio is fixed. */
  className?: string;
}

/**
 * Abacá's logo in the current text color. The artwork is only used as a mask,
 * so one file reads on any background and cross-fades along with it.
 */
export default function Logo({ variant = "wordmark", className = "" }: LogoProps) {
  const { url, aspect } = VARIANTS[variant];
  const mask = `url(${url}) center / contain no-repeat`;

  return (
    <span
      role="img"
      aria-label="Abacá Baking Company"
      className={`block bg-current ${aspect} ${className}`}
      style={{ mask, WebkitMask: mask }}
    />
  );
}
