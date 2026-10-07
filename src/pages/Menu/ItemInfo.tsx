import SectionLink from "../../components/SectionLink";
import { formatPrice, type MenuItem } from "./menu.config";

interface ItemInfoProps {
  item: MenuItem;
  index: number;
  headingId: string;
  /** Text color that reads on the item's background. */
  ink: string;
}

export default function ItemInfo({ item, index, headingId, ink }: ItemInfoProps) {
  return (
    <>
      <p className="eyebrow text-[10px] opacity-70">
        {String(index + 1).padStart(2, "0")} · {item.tagline}
      </p>
      <h3
        id={headingId}
        className="serif-accent mt-3 text-[2.6rem] leading-[0.95] md:text-[min(4.2vw,3.9rem)]"
      >
        {item.name}
      </h3>
      <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-80">{item.description}</p>
      <div className="mt-6 flex items-center gap-4">
        {item.price !== undefined && (
          <p className="font-display text-2xl font-semibold tabular-nums">
            <span className="sr-only">Price: </span>
            {formatPrice(item.price)}
          </p>
        )}
        <SectionLink
          to="visit"
          className="rounded-full px-5 py-3 font-display text-xs font-semibold tracking-[0.2em] uppercase shadow-md transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
          style={{ backgroundColor: ink, color: item.background }}
        >
          Find it at a café
        </SectionLink>
      </div>
    </>
  );
}
