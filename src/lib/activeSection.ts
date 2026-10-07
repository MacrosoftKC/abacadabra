import { useEffect, useSyncExternalStore } from "react";
import { SECTIONS, type SectionId } from "../site.config";

/** Vite's `base` without its trailing slash: "" when the site sits at the domain root. */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, "");

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function section(id: SectionId) {
  return SECTIONS.find((s) => s.id === id) ?? SECTIONS[0];
}

/** The URL a section owns, e.g. "/menu". */
export const sectionHref = (id: SectionId) => BASE + section(id).path;

/** The section a URL path names. Unknown paths land on home. */
export function sectionFromPath(pathname: string): SectionId {
  const local = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  const path = `/${local.replace(/^\/+|\/+$/g, "").toLowerCase()}`;
  return SECTIONS.find((s) => s.path === path)?.id ?? "home";
}

let active: SectionId = sectionFromPath(window.location.pathname);
const listeners = new Set<() => void>();

/**
 * Puts the section's path in the address bar and its title on the tab, via
 * the History API rather than a router: a router navigation re-renders the
 * whole page mid-scroll, which shows up as a visible hitch.
 */
function writeUrl(id: SectionId) {
  const href = sectionHref(id);
  if (window.location.pathname !== href) {
    // Keeps the existing history state and query string; only the path changes.
    window.history.replaceState(window.history.state, "", href + window.location.search);
  }
  document.title = section(id).title;
}

export function setActiveSection(id: SectionId) {
  if (id === active) return;
  active = id;
  writeUrl(id);
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

export function useActiveSection(): SectionId {
  return useSyncExternalStore(subscribe, () => active);
}

export function scrollToSection(id: SectionId, behavior?: ScrollBehavior) {
  const still = window.matchMedia(REDUCED_MOTION_QUERY).matches;
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: behavior ?? (still ? "auto" : "smooth"), block: "start" });
}

/**
 * The page's routing: lands on the section the URL names (deep link, refresh),
 * then keeps the URL and tab title in step with whichever section crosses
 * the middle of the screen.
 */
export function useSectionRouting() {
  useEffect(() => {
    // Our own jump below decides where the page opens, not the browser's memory of it.
    window.history.scrollRestoration = "manual";

    const initial = sectionFromPath(window.location.pathname);
    active = initial;
    // Also rewrites an unknown path to "/".
    writeUrl(initial);
    listeners.forEach((notify) => notify());
    scrollToSection(initial, "auto");

    // A zero-height line across the middle of the viewport, so exactly one
    // section is "in view" at a time.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id as SectionId);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
}
