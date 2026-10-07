import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";
import { BRAND, CONTACT, HOURS, SECTIONS, SOCIALS } from "../site.config";
import { CRUST, INK, PAPER } from "../theme";
import Logo from "./Logo";
import SectionLink from "./SectionLink";

const LINK = "opacity-75 transition-opacity hover:opacity-100";

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer style={{ backgroundColor: INK, color: PAPER }}>
      <div className="mx-auto grid w-[min(92vw,72rem)] gap-12 pt-20 pb-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-8">
        <div className="max-w-xs">
          <SectionLink
            to="home"
            className="inline-block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
          >
            <Logo variant="lockup" className="w-40" />
          </SectionLink>
          <p className="mt-6 text-sm leading-relaxed opacity-70">
            Breads, pastries and coffee, handcrafted from scratch since {BRAND.founded}.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {SOCIALS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid size-10 place-items-center rounded-full ring-1 ring-current/20 transition-colors hover:bg-current/10"
              >
                {icon === "instagram" ? <InstagramIcon /> : <FacebookIcon />}
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Explore">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <SectionLink to={section.id} className={LINK}>
                {section.label}
              </SectionLink>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Opening hours">
          {HOURS.map(({ days, time }) => (
            <li key={days}>
              <p className="opacity-75">{days}</p>
              <p>{time}</p>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Get in touch">
          <li>
            <a href={`mailto:${CONTACT.email}`} className={`${LINK} break-all`}>
              {CONTACT.email}
            </a>
          </li>
          <li>
            <a href={CONTACT.phone.href} className={LINK}>
              {CONTACT.phone.label}
            </a>
          </li>
          <li>
            <SectionLink to="visit" className={LINK}>
              Find a café
            </SectionLink>
          </li>
        </FooterColumn>
      </div>

      <GiantWordmark />

      <div className="border-t border-current/10">
        <div className="mx-auto flex w-[min(92vw,72rem)] flex-col-reverse items-center justify-between gap-3 py-6 text-xs opacity-60 sm:flex-row">
          <p>
            © {YEAR} {BRAND.name}. All rights reserved.
          </p>
          <p className="eyebrow text-[10px]">{BRAND.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow text-[10px]" style={{ color: CRUST }}>
        {title}
      </h3>
      <ul className="mt-5 flex flex-col gap-3 text-sm">{children}</ul>
    </div>
  );
}

/** The name, edge to edge, rising into place as the page runs out. */
function GiantWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const still = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["55%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.2, 1]);

  return (
    <div ref={ref} aria-hidden className="overflow-hidden">
      {/* The Á's accent rises above the font's ascent; the top padding keeps it inside the clip. */}
      <motion.p
        className="display-caps pt-[0.22em] text-center text-[22vw] leading-[0.8] tracking-[0.02em] whitespace-nowrap select-none"
        style={still ? undefined : { y, opacity }}
      >
        Abacá
      </motion.p>
    </div>
  );
}

const ICON = "size-[18px]";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={ICON} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={ICON} fill="currentColor">
      <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.4V21h3.1Z" />
    </svg>
  );
}
