import ProductImage from "../../components/ProductImage";
import { heroPalette } from "../../lib/color";
import { CRUST, ESPRESSO, PAPER } from "../../theme";
import ItemInfo from "./ItemInfo";
import { MENU_ITEMS } from "./menu.config";

/** The menu without scroll effects, for visitors who prefer reduced motion. */
export default function StaticMenu({ headingId }: { headingId: string }) {
  return (
    <div style={{ backgroundColor: ESPRESSO, color: PAPER }}>
      <header className="mx-auto w-[min(92vw,72rem)] py-20 text-center sm:py-28">
        <p className="eyebrow" style={{ color: CRUST }}>
          The menu
        </p>
        <h2 id={headingId} className="display-caps mt-5 text-6xl leading-[0.95] sm:text-8xl">
          Fresh from{" "}
          <span className="serif-accent" style={{ color: CRUST }}>
            the oven.
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-sm opacity-75">
          Five favourites from our counter, baked fresh every morning.
        </p>
      </header>

      {MENU_ITEMS.map((item, i) => {
        const ink = heroPalette(item.background).ink;
        const itemHeadingId = `${headingId}-${item.id}`;
        return (
          <article
            key={item.id}
            aria-labelledby={itemHeadingId}
            style={{ backgroundColor: item.background, color: ink }}
          >
            <div className="mx-auto grid w-[min(92vw,64rem)] items-center gap-6 py-12 sm:grid-cols-2 sm:py-16">
              <ProductImage
                file={item.image}
                alt=""
                className="mx-auto aspect-square h-[min(50svh,24rem)] object-contain"
              />
              <div>
                <ItemInfo item={item} index={i} headingId={itemHeadingId} ink={ink} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
