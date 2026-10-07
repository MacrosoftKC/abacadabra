const ROWS = 18;
const WORDS_PER_ROW = 9;
const ROW_TEXT = Array.from({ length: WORDS_PER_ROW }, () => "Handcrafted").join(" · ");

/**
 * Tiled, tilted "HANDCRAFTED" pattern behind everything. Oversized so the
 * rotated block still covers ultrawide and tall phone viewports; its color is
 * a tone of the current background and tweens along with it.
 */
export default function Watermark({ color }: { color: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden transition-colors duration-(--hero-dur) ease-(--hero-ease) select-none"
      style={{ color }}
    >
      <div className="display-caps absolute top-1/2 left-1/2 flex -translate-1/2 -rotate-22 flex-col gap-[0.35em] text-[max(6cqh,2.4rem)] leading-none font-light tracking-[0.18em] whitespace-nowrap">
        {Array.from({ length: ROWS }, (_, row) => (
          <span key={row} className="even:-translate-x-[2.2em]">
            {ROW_TEXT}
          </span>
        ))}
      </div>
    </div>
  );
}
