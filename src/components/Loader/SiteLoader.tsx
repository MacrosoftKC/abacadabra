import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { productImageUrl } from "../../lib/productImages";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { HERO_ITEMS } from "../../pages/Hero/hero.config";
import { INK, PAPER } from "../../theme";
import Logo from "../Logo";
import {
  EXIT_MS,
  MAX_WAIT_MS,
  MIN_VISIBLE_MS,
  MIN_VISIBLE_REDUCED_MS,
  POUR_MS,
} from "./loader.config";
import PouringCup from "./PouringCup";

/** What the hero's first screen shows: every product on the wheel. */
const HERO_IMAGES = HERO_ITEMS.flatMap((item) => productImageUrl(item.image) ?? []);

/** The faces the first screen sets type in, so nothing swaps font as the page appears. */
const FONTS = [
  '200 1em "Josefin Sans"',
  '600 1em "Josefin Sans"',
  'italic 400 1em "Fraunces"',
  '400 1em "DM Sans"',
];

/** Resolves once the image is decoded; a broken or missing image must never hold the page back. */
function preloadImage(src: string): Promise<void> {
  const image = new Image();
  image.src = src;
  return image.decode().catch(() => undefined);
}

function preloadFonts(): Promise<unknown> {
  return Promise.all(FONTS.map((font) => document.fonts.load(font).catch(() => undefined)));
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

type Phase = "loading" | "leaving" | "done";

/** The loader plays once per page load. */
let played = false;

interface SiteLoaderProps {
  /** Dynamic imports for the chunks the page needs (the same ones its lazy components use). */
  preload: readonly (() => Promise<unknown>)[];
  children: ReactNode;
}

/**
 * Holds the page back behind a pouring cup until its code, fonts and hero
 * images are ready (and the pour has had time to play), then fades into it.
 * The page only mounts as the fade starts, so the hero begins its rotation
 * from the first item with nothing left to load.
 */
export default function SiteLoader({ preload, children }: SiteLoaderProps) {
  const [phase, setPhase] = useState<Phase>(played ? "done" : "loading");
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (phase !== "loading") return;
    let cancelled = false;

    const assets = Promise.all([
      ...preload.map((load) => load()),
      ...HERO_IMAGES.map(preloadImage),
      preloadFonts(),
    ]);
    const minimum = wait(reduceMotion ? MIN_VISIBLE_REDUCED_MS : MIN_VISIBLE_MS);
    const patience = wait(MAX_WAIT_MS);

    const reveal = () => {
      if (!cancelled) setPhase("leaving");
    };
    // A chunk that fails to load still opens the page: Suspense surfaces that error.
    Promise.all([minimum, Promise.race([assets, patience])]).then(reveal, reveal);

    return () => {
      cancelled = true;
    };
  }, [phase, preload, reduceMotion]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const id = window.setTimeout(() => {
      played = true;
      setPhase("done");
    }, EXIT_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  const leaving = phase === "leaving";

  return (
    <>
      {phase !== "loading" && children}
      {phase !== "done" && (
        <div
          role="status"
          aria-hidden={leaving || undefined}
          className={`fixed inset-0 z-1000 grid place-items-center transition-opacity duration-(--exit-ms) ease-out ${leaving ? "pointer-events-none opacity-0" : ""}`}
          style={
            {
              backgroundColor: PAPER,
              color: INK,
              "--exit-ms": `${EXIT_MS}ms`,
              "--pour-ms": `${POUR_MS}ms`,
            } as CSSProperties
          }
        >
          <span className="sr-only">Loading Abacá Baking Company</span>
          <div className="relative">
            <PouringCup />
            {/* Sits in the scene's empty band under the table line. */}
            <Logo
              variant="lockup"
              className="pour-logo absolute bottom-[9%] left-1/2 w-[46%] -translate-x-1/2"
            />
          </div>
        </div>
      )}
    </>
  );
}
