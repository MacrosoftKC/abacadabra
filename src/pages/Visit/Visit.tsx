import { useId } from "react";
import storefrontUrl from "../../assets/photos/storefront-mall.jpg";
import { ParallaxImage } from "../../components/Parallax";
import Reveal from "../../components/Reveal";
import { CAFES, CONTACT, HOURS } from "../../site.config";
import { CRUST, INK, PAPER } from "../../theme";
import ContactForm from "./ContactForm";
import InfoCard from "./InfoCard";

export default function Visit() {
  const headingId = useId();

  return (
    <section
      id="visit"
      aria-labelledby={headingId}
      className="relative py-20 sm:py-28"
      style={{ backgroundColor: PAPER, color: INK }}
    >
      {/* The hero's hill again, rising out of the section above. */}
      <div
        aria-hidden
        className="absolute bottom-full left-[-25%] h-[14vw] w-[150%] translate-y-1/2 rounded-[50%]"
        style={{ backgroundColor: PAPER }}
      />

      <div className="relative mx-auto grid w-[min(92vw,72rem)] gap-14 lg:grid-cols-[3fr_2fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="eyebrow" style={{ color: CRUST }}>
              Visit us
            </p>
            <h2
              id={headingId}
              className="display-caps mt-4 text-[clamp(3rem,7vw,5.5rem)] leading-[0.92]"
            >
              Come say{" "}
              <span className="serif-accent" style={{ color: CRUST }}>
                hello.
              </span>
            </h2>
            <p className="mt-5 max-w-md text-ink/65">
              Pull up a chair, pick something warm from the counter and stay as long as you
              like. Planning an event or a big order? Send us a note.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ParallaxImage
              src={storefrontUrl}
              alt="An Abacá café front in walnut and glass, with the round abacá seal on the wall"
              className="grain mt-10 aspect-[16/10] rounded-[2rem] shadow-xl"
            />
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Reveal delay={0.1}>
              <InfoCard label="Cafés">
                <ul className="flex flex-col gap-3">
                  {CAFES.map((cafe) => (
                    <li key={cafe.name}>
                      <p className="font-semibold">{cafe.name}</p>
                      {cafe.address.map((line) => (
                        <p key={line} className="text-ink/60">
                          {line}
                        </p>
                      ))}
                    </li>
                  ))}
                </ul>
              </InfoCard>
            </Reveal>

            <Reveal delay={0.18}>
              <InfoCard label="Hours">
                <dl className="flex flex-col gap-2.5">
                  {HOURS.map(({ days, time }) => (
                    <div key={days}>
                      <dt className="text-ink/60">{days}</dt>
                      <dd className="font-semibold">{time}</dd>
                    </div>
                  ))}
                </dl>
              </InfoCard>
            </Reveal>

            <Reveal delay={0.26}>
              <InfoCard label="Say hello">
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="font-semibold break-all underline decoration-transparent underline-offset-2 transition-colors hover:decoration-current"
                >
                  {CONTACT.email}
                </a>
                <a
                  href={CONTACT.phone.href}
                  className="mt-1.5 block text-ink/60 transition-colors hover:text-ink"
                >
                  {CONTACT.phone.label}
                </a>
              </InfoCard>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.15} className="lg:sticky lg:top-28 lg:self-start">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
