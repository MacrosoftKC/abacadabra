import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useId, useRef, useState, type FocusEvent, type ReactNode } from "react";
import { useActiveSection } from "../lib/activeSection";
import { EASE_OUT } from "../lib/motion";
import { SECTIONS } from "../site.config";
import { INK, PAPER } from "../theme";
import Logo from "./Logo";
import SectionLink from "./SectionLink";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";

/** Scrolled past the hero by this much (px of its bottom still showing), the bar turns into a pill. */
const HERO_HANDOFF = 80;

/**
 * One fixed bar for the whole page. Over the hero it's transparent and takes
 * the hero's colors; past it, it becomes a floating pill that tucks away while
 * you scroll down and comes back as soon as you scroll up.
 */
export default function Navbar() {
  const activeId = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const [tucked, setTucked] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const heroHeight = document.getElementById("home")?.offsetHeight ?? window.innerHeight;
    const pastHero = y > heroHeight - HERO_HANDOFF;
    const delta = y - (scrollY.getPrevious() ?? y);
    setOverHero(!pastHero);
    if (!pastHero) setTucked(false);
    else if (delta > 6) setTucked(true);
    else if (delta < -6) setTucked(false);
  });

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const closeOnOutsidePress = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePress);
    };
  }, [menuOpen]);

  // Someone tabbing through the links never has the bar slide away from under them.
  const shown = !tucked || menuOpen || focusWithin;
  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
  };

  const ink = overHero ? "var(--hero-ink)" : INK;
  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4"
      initial={false}
      animate={{ y: shown ? "0%" : "-130%" }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
      onFocus={() => setFocusWithin(true)}
      onBlur={onBlur}
    >
      <nav
        aria-label="Primary"
        data-floating={!overHero || undefined}
        className="mx-auto grid max-w-[120rem] grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-full px-3 py-2 sm:px-5 lg:px-7 lg:py-3 data-floating:max-w-5xl data-floating:bg-paper/85 data-floating:shadow-[0_10px_30px_rgb(20_18_16/0.12)] data-floating:ring-1 data-floating:ring-ink/5 data-floating:backdrop-blur-md lg:data-floating:py-2"
        style={{
          color: ink,
          transition:
            "color var(--hero-dur, 1.2s) var(--hero-ease, ease), max-width 0.5s, background-color 0.5s, box-shadow 0.5s, padding 0.5s",
        }}
      >
        <SectionLink
          to="home"
          aria-current={activeId === "home" ? "page" : undefined}
          className={`justify-self-start rounded-md py-1 ${FOCUS_RING}`}
        >
          <Logo className="h-5 lg:h-6" />
        </SectionLink>

        <ul className="hidden items-center gap-7 md:flex lg:gap-10">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <SectionLink
                to={section.id}
                aria-current={section.id === activeId ? "page" : undefined}
                className={`relative rounded-sm py-1 font-display text-[11px] font-semibold tracking-[0.22em] uppercase transition-opacity after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-center after:scale-x-0 after:bg-current after:transition-transform hover:opacity-70 aria-[current=page]:after:scale-x-100 lg:text-xs ${FOCUS_RING}`}
              >
                {section.label}
              </SectionLink>
            </li>
          ))}
        </ul>

        <div className="col-start-3 flex items-center gap-1 justify-self-end sm:gap-2">
          <SectionLink
            to="visit"
            className={`hidden rounded-full px-5 py-2.5 font-display text-[11px] font-semibold tracking-[0.2em] uppercase ring-1 ring-current/35 transition-[background-color] ring-inset hover:bg-current/10 sm:inline-flex ${FOCUS_RING}`}
          >
            Visit us
          </SectionLink>
          <IconButton
            label={menuOpen ? "Close menu" : "Open menu"}
            className="md:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id={menuId}
            className="absolute inset-x-3 top-full mt-2 rounded-3xl p-2 shadow-xl ring-1 ring-current/10 sm:inset-x-4 md:hidden"
            style={{
              backgroundColor: overHero ? "var(--hero-surface)" : PAPER,
              color: ink,
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
          >
            <ul className="flex flex-col">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <SectionLink
                    to={section.id}
                    aria-current={section.id === activeId ? "page" : undefined}
                    onClick={closeMenu}
                    className={`block rounded-2xl px-4 py-3.5 font-display text-sm font-semibold tracking-[0.2em] uppercase hover:bg-current/5 aria-[current=page]:bg-current/10 ${FOCUS_RING}`}
                  >
                    {section.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

interface IconButtonProps {
  label: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
}

function IconButton({ label, children, className = "", ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`grid size-10 place-items-center rounded-full transition-colors hover:bg-current/10 ${FOCUS_RING} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

const ICON_PROPS = {
  "aria-hidden": true,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "size-6",
} as const;

function MenuIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M4 8h16M4 16h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
