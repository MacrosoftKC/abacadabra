import cupcakeUrl from "../../assets/photos/coffee-cupcake.jpg";
import nightUrl from "../../assets/photos/storefront-night.jpg";
import { Parallax, ParallaxImage } from "../../components/Parallax";
import Reveal from "../../components/Reveal";

/**
 * A warm monochrome wash, after the brand's black-and-white doodles; it also
 * hides how small the source photos are. Full color on hover.
 */
const TREATMENT =
  "grayscale-[0.85] sepia-[0.2] contrast-[1.05] transition-[filter] duration-700 group-hover:grayscale-0 group-hover:sepia-0";

/** The three promises written around Abacá's seal. */
const PROMISES = ["Handcrafted goods", "Baking company", "Café & coffeehouse"];

/** Two photos and the seal's promises, each drifting at its own pace. */
export default function PhotoCollage() {
  return (
    <div className="mt-32 grid gap-10 sm:mt-48 md:grid-cols-12 md:gap-x-10 md:gap-y-0">
      <Parallax speed={0.06} className="md:col-span-7">
        <figure className="group">
          <ParallaxImage
            src={nightUrl}
            alt="An Abacá café at night, its black front drawn over with white doodles around the round abacá seal"
            className="grain aspect-[535/373] rounded-[1.75rem]"
            imageClassName={TREATMENT}
          />
          <figcaption className="mt-4 flex items-baseline gap-3">
            <span className="eyebrow text-[10px] text-crust">01</span>
            <span className="serif-accent text-lg opacity-80">The doodled café front</span>
          </figcaption>
        </figure>
      </Parallax>

      <Parallax speed={-0.14} className="md:col-span-4 md:col-start-9 md:mt-56">
        <figure className="group">
          <ParallaxImage
            src={cupcakeUrl}
            alt="A chocolate cupcake with cream and cookie crumble beside an Abacá coffee cup covered in doodles"
            className="grain aspect-[3/4] rounded-[1.75rem]"
            imageClassName={TREATMENT}
          />
          <figcaption className="mt-4 flex items-baseline gap-3">
            <span className="eyebrow text-[10px] text-crust">02</span>
            <span className="serif-accent text-lg opacity-80">Coffee, and something sweet</span>
          </figcaption>
        </figure>
      </Parallax>

      <div className="md:col-span-6 md:col-start-2 md:-mt-16">
        <Reveal>
          <p className="eyebrow text-[10px] opacity-60">Written around our seal</p>
          <ol className="mt-6 flex flex-col">
            {PROMISES.map((promise, i) => (
              <li
                key={promise}
                className="flex items-baseline gap-5 border-t border-current/15 py-5 last:border-b"
              >
                <span className="eyebrow text-[10px] text-crust">0{i + 1}</span>
                <span className="serif-accent text-[clamp(1.9rem,3.6vw,3rem)] leading-none">
                  {promise}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </div>
  );
}
