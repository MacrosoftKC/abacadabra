import {
  clamp,
  easeInOut,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { inkOn } from "../../lib/color";
import { useElementSize } from "../../lib/useElementSize";
import { CREMA, ESPRESSO } from "../../theme";
import ItemPanel from "./ItemPanel";
import { MENU_ITEMS } from "./menu.config";
import MenuGrid, { type Flight } from "./MenuGrid";
import PourScene from "./PourScene";
import ShowcaseIndicator from "./ShowcaseIndicator";

const COUNT = MENU_ITEMS.length;

/** Scroll spent flooding the screen with coffee, in screen heights. */
const POUR_SCREENS = 1.1;
/** Scroll per item, in screen heights: a glide over to it, then a rest at center stage. */
const ITEM_SCREENS = 0.85;
/** Share of each glide held still at either end, so every item settles before the next moves. */
const DWELL = 0.15;
/** Scroll spent resting on the last item before the stage pans out. */
const HOLD_SCREENS = 0.3;
/** Scroll spent panning out: the coffee drains while the items gather into the grid. */
const OVERVIEW_SCREENS = 1.3;
/** Share of the pan-out the coffee takes to drain away; the grid's cards appear after. */
const DRAIN_SHARE = 0.35;
/** Scroll spent on the finished grid before the page moves on. */
const GRID_HOLD_SCREENS = 0.6;

const BACKGROUNDS = MENU_ITEMS.map((item) => item.background);

const snapToPixel = (v: number) => Math.round(v * window.devicePixelRatio) / window.devicePixelRatio;

/** One item per screen on phones; wider screens let the neighbors peek in. */
const panelWidthFor = (stageWidth: number) =>
  stageWidth < 768 ? stageWidth : clamp(560, 1000, stageWidth * 0.58);

/**
 * Items glided past for a distance scrolled, both counted in items: eased
 * between whole items and flat around each one, so every item comes to rest.
 */
function glide(steps: number) {
  const whole = Math.floor(steps);
  return whole + easeInOut(clamp(0, 1, (steps - whole - DWELL) / (1 - 2 * DWELL)));
}

/**
 * The menu as one pinned scene. Scrolling first floods the page with coffee
 * (the headline turns cream exactly where the surface covers it), then glides
 * the items in from the left one at a time, the coffee taking on each one's
 * color. Last, the coffee drains away and the stage pans out to all of them.
 */
export default function PourShowcase({ headingId }: { headingId: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lastCutoutRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const { width, height } = useElementSize(stageRef);
  const inView = useInView(stageRef);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [gridReady, setGridReady] = useState(false);

  const panelWidth = panelWidthFor(width);
  const pour = height * POUR_SCREENS;
  const step = height * ITEM_SCREENS;
  // Sideways travel at which each item is centered; the first starts just past the left edge.
  const centers = MENU_ITEMS.map((_, i) => width / 2 + (i + 0.5) * panelWidth);
  const travel = centers[COUNT - 1];
  const overviewStart = pour + COUNT * step + height * HOLD_SCREENS;
  const overviewLength = height * OVERVIEW_SCREENS;
  const pinned = overviewStart + overviewLength + height * GRID_HOLD_SCREENS;
  // Whole pixels: a band edge on a fractional row shows up as a faint hairline.
  const waveHeight = Math.round(clamp(28, 72, height * 0.07));
  const cremaHeight = Math.round(waveHeight * 1.6);

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });
  // Springing the distance smooths out mouse-wheel steps for every layer at once.
  const scrolled = useSpring(
    useTransform(() => scrollYProgress.get() * pinned),
    { stiffness: 240, damping: 40, mass: 0.35 },
  );
  const fill = useTransform(scrolled, (s) => clamp(0, 1, s / pour));
  // The item at center stage, eased; -1 while the headline still has it.
  const centered = useTransform(scrolled, (s) => glide(clamp(0, COUNT, (s - pour) / step)) - 1);
  const traveled = useTransform(centered, [-1, 0, COUNT - 1], [0, centers[0], travel]);
  // 0 → 1 as the stage pans out from the last item to the grid.
  const overview = useTransform(scrolled, (s) => clamp(0, 1, (s - overviewStart) / overviewLength));
  // The surface rises as the coffee pours in. When the stage pans out it drains
  // back down, this time past the bottom edge, crema and all.
  const liquidY = useTransform(() => {
    const drained = clamp(0, 1, (scrolled.get() - overviewStart) / (overviewLength * DRAIN_SHARE));
    const y =
      drained > 0
        ? -waveHeight + (height + waveHeight + cremaHeight) * easeInOut(drained)
        : height - (height + waveHeight) * easeInOut(fill.get());
    return snapToPixel(y);
  });
  // Content inside the liquid shifts back so it stays put while the surface rises.
  const counterY = useTransform(liquidY, (y) => -y);
  const liquidColor = useTransform(traveled, [0, ...centers], [ESPRESSO, ...BACKGROUNDS]);
  // Flips between ink and paper as the coffee crosses mid-tone, never a muddy blend.
  const inkColor = useTransform(liquidColor, inkOn);
  const itemProgress = useTransform(traveled, [centers[0], travel], [0, 1]);
  // Fades in as the first item arrives, and out again as the stage pans out.
  const indicatorOpacity = useTransform(
    () =>
      clamp(0, 1, (traveled.get() - centers[0] * 0.4) / (centers[0] * 0.45)) *
      (1 - clamp(0, 1, overview.get() / 0.15)),
  );
  const panelsOpacity = useTransform(overview, [0, 0.25], [1, 0]);
  const panelsPointer = useTransform(overview, (p) => (p > 0 ? "none" : "auto"));
  // The grid's copy of the last cutout takes over the moment the stage starts panning out.
  const cutoutOpacity = useTransform(overview, (p): number => (p > 0 ? 0 : 1));

  useMotionValueEvent(overview, "change", (p) => {
    // Like the indicator's counter: this can change mid-render when the stage resizes.
    queueMicrotask(() => setGridReady(p > 0.95));
  });

  // Where the grid's cutouts fly between: the last cutout at center stage, and each grid slot.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const cutout = lastCutoutRef.current;
    const panel = cutout?.closest("article");
    const slots = gridRef.current?.querySelectorAll<HTMLElement>("[data-slot]");
    if (!stage || !cutout || !panel || !slots) return;

    const measure = () => {
      const stageBox = stage.getBoundingClientRect();
      const cutoutBox = cutout.getBoundingClientRect();
      const panelBox = panel.getBoundingClientRect();
      setFlight({
        // The cutout moves with its panel, so its offset in the panel holds wherever the track is.
        from: {
          x: (width - panelWidth) / 2 + cutoutBox.left - panelBox.left + cutoutBox.width / 2,
          y: cutoutBox.top - panelBox.top + cutoutBox.height / 2,
        },
        size: cutoutBox.width,
        to: Array.from(slots, (slot) => {
          const box = slot.getBoundingClientRect();
          return {
            x: box.left - stageBox.left + box.width / 2,
            y: box.top - stageBox.top + box.height / 2,
            size: Math.min(box.width, box.height),
          };
        }),
        stageWidth: width,
      });
    };

    measure();
    // The slots also resize when the webfonts arrive and the card text reflows.
    const observer = new ResizeObserver(measure);
    observer.observe(cutout);
    slots.forEach((slot) => observer.observe(slot));
    return () => observer.disconnect();
  }, [width, panelWidth]);

  const scrollWithin = (distance: number) => {
    const root = rootRef.current;
    if (!root) return;
    const rootTop = root.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: rootTop + distance, behavior: "smooth" });
  };
  // A transformed track can't scroll focus into view, so bring the panel to center stage.
  const centerPanel = (index: number) => scrollWithin(pour + (index + 1) * step);
  const showGrid = () => scrollWithin(overviewStart + overviewLength);

  const scene = { fill, trackX: traveled, stageHeight: height };

  return (
    <div ref={rootRef} className="relative" style={{ height: height + pinned }}>
      <div
        ref={stageRef}
        className={`sticky top-0 h-svh overflow-clip ${inView ? "" : "liquid-paused"}`}
        style={{ "--wave-h": `${waveHeight}px`, "--crema-h": `${cremaHeight}px` } as CSSProperties}
      >
        {/* Crema: a slower, lighter wave peeking over the surface. */}
        <motion.div aria-hidden className="absolute inset-x-0 top-0 z-10" style={{ y: liquidY }}>
          <div
            className="liquid-wave absolute inset-x-0 bottom-0 h-(--crema-h)"
            style={{ backgroundColor: CREMA, "--wave-dur": "9s", animationDelay: "-4s" } as CSSProperties}
          />
        </motion.div>

        <div className="absolute inset-0 z-20">
          <PourScene {...scene} headingId={headingId} />
        </div>

        <motion.div
          className="absolute inset-x-0 top-0 z-30 h-[calc(100%_+_var(--wave-h))] will-change-transform"
          style={{ y: liquidY }}
        >
          <motion.div
            aria-hidden
            className="liquid-wave absolute inset-x-0 bottom-full h-(--wave-h) overflow-hidden"
            style={{ backgroundColor: liquidColor }}
          >
            <motion.div className="absolute inset-x-0 top-full h-svh" style={{ y: counterY }}>
              <PourScene {...scene} submerged />
            </motion.div>
          </motion.div>

          <motion.div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: liquidColor }}>
            <motion.div
              className="absolute inset-x-0 top-0 h-svh will-change-transform"
              style={{ y: counterY }}
            >
              <PourScene {...scene} submerged />
              {/* Laid out right to left from the stage's left edge, so the items come in from the left. */}
              <motion.div
                className="absolute inset-y-0 right-full flex flex-row-reverse will-change-transform"
                style={{ x: traveled, opacity: panelsOpacity, pointerEvents: panelsPointer }}
              >
                {MENU_ITEMS.map((item, i) => (
                  <ItemPanel
                    key={item.id}
                    item={item}
                    index={i}
                    width={panelWidth}
                    stageHeight={height}
                    center={centers[i]}
                    traveled={traveled}
                    cutoutOpacity={cutoutOpacity}
                    cutoutRef={i === COUNT - 1 ? lastCutoutRef : undefined}
                    onKeyboardFocus={centerPanel}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className={`absolute inset-0 z-35 ${gridReady ? "" : "pointer-events-none"}`}>
          <MenuGrid
            items={MENU_ITEMS}
            overview={overview}
            cardsFrom={DRAIN_SHARE}
            flight={flight}
            listRef={gridRef}
            onSelect={centerPanel}
            onKeyboardFocus={showGrid}
          />
        </div>

        <ShowcaseIndicator
          items={MENU_ITEMS}
          progress={itemProgress}
          opacity={indicatorOpacity}
          color={inkColor}
        />
      </div>
    </div>
  );
}
